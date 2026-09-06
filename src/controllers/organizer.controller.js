import { Op } from 'sequelize';
import { User, Event, Application, Attendance, Review, Referral } from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { messages } from '../utils/constant/messages.js';
import { CloudinaryService } from '../utils/cloudinary.js';
import { ApiFeature } from '../utils/apiFeature.js';
import { checkAndAutoVerify } from './usher.controller.js';

export class OrganizerController {

    // US-201: Get own organizer profile
    static async getMyProfile(req, res, next) {
        const userId = req.authUser.id;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] },
        });
        if (!user) return next(new AppError(messages.user.notfound, 404));

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            data: user,
        });
    }

    // US-201: Update organizer profile — description & website stored in organizationInfo JSON field
    static async updateMyProfile(req, res, next) {
        const userId = req.authUser.id;
        const { fullName, description, city, mobileNumber, website } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        if (fullName !== undefined) user.fullName = fullName;
        if (city !== undefined) user.city = city;
        if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;

        // Store organizer-specific fields in the dedicated organizationInfo JSON field
        if (description !== undefined || website !== undefined) {
            user.organizationInfo = {
                ...(user.organizationInfo || {}),
                ...(description !== undefined ? { description } : {}),
                ...(website !== undefined ? { website } : {}),
            };
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: messages.user.updateSuccessfully,
            data: user,
        });
    }

    // US-202: Upload / change company logo (reuses portfolioPicture field)
    static async uploadLogo(req, res, next) {
        if (!req.file) return next(new AppError('Image file is required', 400));

        const userId = req.authUser.id;
        const user = await User.findByPk(userId);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        if (user.portfolioPicture?.public_id && user.portfolioPicture.public_id !== 'default_avatar') {
            await CloudinaryService.deleteImage(user.portfolioPicture.public_id);
        }

        const uploaded = await CloudinaryService.uploadBuffer(req.file.buffer, 'ushers/logos');
        user.portfolioPicture = uploaded;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Company logo updated successfully',
            data: { logo: uploaded },
        });
    }

    // US-200: Get organizer dashboard stats
    static async getDashboard(req, res, next) {
        const organizerId = req.authUser.id;

        const [totalEvents, openEvents, confirmedEvents, completedEvents, recentEvents] = await Promise.all([
            Event.count({ where: { organizerId } }),
            Event.count({ where: { organizerId, status: 'open' } }),
            Event.count({ where: { organizerId, status: 'confirmed' } }),
            Event.count({ where: { organizerId, status: 'completed' } }),
            Event.findAll({ where: { organizerId }, order: [['createdAt', 'DESC']], limit: 5 }),
        ]);

        // Total hired count across all events
        const allEvents = await Event.findAll({ where: { organizerId }, attributes: ['hiredTalents'] });
        const totalHired = allEvents.reduce((sum, e) => sum + (e.hiredTalents?.length || 0), 0);

        // Active events (open + confirmed) for display
        const activeEvents = await Event.findAll({
            where: { organizerId, status: { [Op.in]: ['open', 'confirmed'] } },
            order: [['eventDate', 'ASC']],
        });

        // Count pending applications across organizer's events
        const eventIds = allEvents.map(e => e.id).filter(Boolean);
        const pendingApplicationsCount = eventIds.length
            ? await Application.count({ where: { eventId: { [Op.in]: eventIds }, status: 'pending' } })
            : 0;

        return res.status(200).json({
            success: true,
            message: 'Dashboard retrieved successfully',
            data: {
                totalEvents,
                openEvents,
                confirmedEvents,
                completedEvents,
                activeEventsCount: openEvents + confirmedEvents,
                totalHired,
                pendingApplicationsCount,
                activeEvents,
                recentEvents,
            },
        });
    }

    // US-203: Create a new event
    static async createEvent(req, res, next) {
        const organizerId = req.authUser.id;
        const {
            title, category, eventDate, applicationDeadline,
            startTime, endTime, location, requiredCount,
            genderPreference, budget, dressCode, notes,
        } = req.body;

        const event = await Event.create({
            organizerId, title, category, eventDate, applicationDeadline,
            startTime, endTime, location, requiredCount,
            genderPreference: genderPreference || 'any',
            budget, dressCode, notes, status: 'open', hiredTalents: [],
        });

        return res.status(201).json({
            success: true,
            message: messages.event.createSuccessfully,
            data: event,
        });
    }

    // US-200: Get own events (with optional status filter + ApiFeature pagination)
    static async getMyEvents(req, res, next) {
        const organizerId = req.authUser.id;
        const { status } = req.query;

        const where = { organizerId };
        if (status) where.status = status;

        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { count, rows: events } = await Event.findAndCountAll({
            where,
            order: feature.order.length ? feature.order : [['createdAt', 'DESC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            ...ApiFeature.paginateResponse(events, page, feature.limit, count),
        });
    }

    // Get single event detail (organizer must own it)
    static async getEventById(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            data: event,
        });
    }

    // Update event details
    static async updateEvent(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        const allowedFields = [
            'title', 'category', 'eventDate', 'applicationDeadline',
            'startTime', 'endTime', 'location', 'requiredCount',
            'genderPreference', 'budget', 'dressCode', 'notes',
        ];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) event[field] = req.body[field];
        });
        await event.save();

        return res.status(200).json({
            success: true,
            message: messages.event.updateSuccessfully,
            data: event,
        });
    }

    // US-206: Close event / set to confirmed
    static async closeEvent(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        event.status = 'confirmed';
        await event.save();

        return res.status(200).json({
            success: true,
            message: 'Event closed for new applications',
            data: event,
        });
    }

    // US-205: View event applicants
    static async getEventApplicants(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        const applications = await Application.findAll({
            where: { eventId: id },
            order: [['appliedAt', 'ASC']],
        });

        const enriched = await Promise.all(applications.map(async (app) => {
            const talent = await User.findByPk(app.talentId, { attributes: { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] } });
            let referredByName = null;
            if (app.referredBy) {
                const referrer = await User.findByPk(app.referredBy, { attributes: ['fullName'] });
                referredByName = referrer?.fullName || null;
            }
            return { ...app.toJSON(), talent, referredByName };
        }));

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            data: enriched,
        });
    }

    // US-205: Accept or reject an applicant
    static async updateApplicationStatus(req, res, next) {
        const { applicationId } = req.params;
        const { status } = req.body;
        const organizerId = req.authUser.id;

        const application = await Application.findByPk(applicationId);
        if (!application) return next(new AppError('Application not found', 404));

        const event = await Event.findOne({ where: { id: application.eventId, organizerId } });
        if (!event) return next(new AppError('Not authorized', 403));

        application.status = status;
        await application.save();

        if (status === 'accepted') {
            if (!event.hiredTalents.includes(application.talentId)) {
                event.hiredTalents = [...event.hiredTalents, application.talentId];
                await event.save();
            }
        } else if (status === 'rejected') {
            event.hiredTalents = event.hiredTalents.filter(id => id !== application.talentId);
            await event.save();
        }

        return res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            data: application,
        });
    }

    // US-207: Mark attendance
    static async markAttendance(req, res, next) {
        const { id } = req.params; // eventId
        const { talentId, status, checkInTime } = req.body;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        // Attendance allowed only after deadline or when event is confirmed/closed (FR-ATT-02)
        const now = new Date();
        const deadline = new Date(event.applicationDeadline);
        if (now < deadline && event.status === 'open') {
            return next(new AppError('Attendance can only be marked after the application deadline has passed or event is closed', 400));
        }

        if (!event.hiredTalents.includes(talentId)) {
            return next(new AppError('Talent is not hired for this event', 400));
        }

        let [attendance, created] = await Attendance.findOrCreate({
            where: { eventId: id, talentId },
            defaults: { status, checkInTime: checkInTime || null },
        });

        if (!created) {
            attendance.status = status;
            if (checkInTime) attendance.checkInTime = checkInTime;
            await attendance.save();
        }

        // Update talent consecutive good events counter (BR-07)
        const talent = await User.findByPk(talentId);
        if (talent) {
            if (status === 'present' || status === 'late') {
                talent.consecutiveGoodEvents = (talent.consecutiveGoodEvents || 0) + 1;
                // Reset late excuse counter after 5 consecutive good events (BR-06, FR-EXC-08)
                if (talent.consecutiveGoodEvents >= 5) {
                    talent.lateExcuseCount = 0;
                    talent.consecutiveGoodEvents = 0;
                }
            } else if (status === 'absent') {
                talent.consecutiveGoodEvents = 0;
            }
            await talent.save();
        }

        // Check if talent should be auto-verified (FR-VER-01)
        await checkAndAutoVerify(talentId);

        return res.status(200).json({
            success: true,
            message: 'Attendance marked successfully',
            data: attendance,
        });
    }

    // US-208: Review & rate talent
    static async reviewTalent(req, res, next) {
        const { id } = req.params; // eventId
        const { talentId, rating, comment } = req.body;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        if (!event.hiredTalents.includes(talentId)) {
            return next(new AppError('Talent was not hired for this event', 400));
        }

        const existing = await Review.findOne({
            where: { eventId: id, reviewerId: organizerId, reviewedUserId: talentId },
        });
        if (existing) return next(new AppError('You have already reviewed this talent for this event', 400));

        const review = await Review.create({
            eventId: id, reviewerId: organizerId, reviewedUserId: talentId, rating, comment,
        });

        // Recalculate talent's average rating
        const talent = await User.findByPk(talentId);
        if (talent) {
            const allReviews = await Review.findAll({ where: { reviewedUserId: talentId } });
            const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            talent.rate = Math.round(avg * 10) / 10;
            await talent.save();
        }

        // Check auto-verify after new review updates rating (FR-VER-01)
        await checkAndAutoVerify(talentId);

        return res.status(201).json({
            success: true,
            message: messages.review.createSuccessfully,
            data: review,
        });
    }

    // US-209: Search talent directory (with ApiFeature pagination)
    static async searchTalents(req, res, next) {
        const { city, category, experience } = req.query;

        const where = { role: 'usher', isBlocked: false };
        if (city) where.city = { [Op.iLike]: `%${city}%` };
        if (experience) where.experience = { [Op.gte]: parseInt(experience) };
        if (category) where.eventCategories = { [Op.contains]: [category] };

        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { rows: talents, count } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] },
            limit: feature.limit,
            offset: feature.offset,
            order: feature.order.length ? feature.order : [['rate', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            ...ApiFeature.paginateResponse(talents, page, feature.limit, count),
        });
    }

    // US-211: Direct book a talent
    static async directBookTalent(req, res, next) {
        const { talentId, eventId } = req.body;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id: eventId, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));
        if (event.status !== 'open') return next(new AppError('Event is not open for bookings', 400));

        const talent = await User.findOne({ where: { id: talentId, role: 'usher', isBlocked: false } });
        if (!talent) return next(new AppError(messages.user.notfound, 404));

        // Prevent duplicate (BR-01)
        const existing = await Application.findOne({ where: { eventId, talentId } });
        if (existing) return next(new AppError('Talent already has an application for this event', 400));

        // Direct booking = auto-accepted (BR-12)
        const application = await Application.create({
            eventId, talentId, status: 'accepted', isDirect: true, appliedAt: new Date(),
        });

        event.hiredTalents = [...event.hiredTalents, talentId];
        await event.save();

        return res.status(201).json({
            success: true,
            message: 'Talent booked directly and accepted',
            data: application,
        });
    }

    // GET referrals for an event
    static async getEventReferrals(req, res, next) {
        const { id } = req.params; // eventId
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        const referrals = await Referral.findAll({
            where: { eventId: id },
            order: [['createdAt', 'DESC']],
        });

        const enriched = await Promise.all(referrals.map(async (ref) => {
            const referrer = await User.findByPk(ref.referrerTalentId, { attributes: ['id', 'fullName'] });
            const referred = await User.findByPk(ref.referredTalentId, { attributes: ['id', 'fullName', 'rate', 'isVerified', 'lateExcuseCount'] });
            return { ...ref.toJSON(), referrer, referred };
        }));

        return res.status(200).json({
            success: true,
            message: messages.referral.getsuccessfully,
            data: enriched,
        });
    }

    // DELETE /organizer/events/:id — organizer deletes own event
    static async deleteEvent(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        await Application.destroy({ where: { eventId: id } });
        await event.destroy();

        return res.status(200).json({
            success: true,
            message: messages.event.deleteSuccessfully,
        });
    }

    // PATCH /organizer/events/:id/supervisor — assign / remove supervisor from event
    static async assignSupervisor(req, res, next) {
        const { id } = req.params;
        const organizerId = req.authUser.id;
        const { supervisorUserId } = req.body;

        const event = await Event.findOne({ where: { id, organizerId } });
        if (!event) return next(new AppError(messages.event.notfound, 404));

        if (supervisorUserId) {
            // Validate the supervisor belongs to this organizer's staff
            const supervisor = await User.findOne({
                where: { id: supervisorUserId, role: 'organizer_supervisor', providerOwnerId: organizerId },
            });
            if (!supervisor) return next(new AppError('Selected user is not a valid supervisor for your company', 400));
            event.supervisorId = supervisorUserId;
        } else {
            event.supervisorId = null;
        }

        await event.save();

        return res.status(200).json({
            success: true,
            message: 'Supervisor assigned successfully',
            data: event,
        });
    }
}
