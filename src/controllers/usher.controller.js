import { Op } from 'sequelize';
import { User, Event, Application, Attendance, Review, Referral } from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { messages } from '../utils/constant/messages.js';
import { CloudinaryService } from '../utils/cloudinary.js';
import { ApiFeature } from '../utils/apiFeature.js';

const SAFE_USER_ATTRS = { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] };

// FR-VER-01: Auto-verify talent after hitting performance thresholds
const AUTO_VERIFY_MIN_EVENTS = 5;
const AUTO_VERIFY_MIN_RATING = 4.0;

async function checkAndAutoVerify(userId) {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'usher' || user.isVerified) return;

    const acceptedApps = await Application.findAll({ where: { talentId: userId, status: 'accepted' } });
    const eventIds = acceptedApps.map(a => a.eventId);

    const presentCount = eventIds.length > 0
        ? await Attendance.count({
            where: { talentId: userId, eventId: { [Op.in]: eventIds }, status: { [Op.in]: ['present', 'late'] } }
          })
        : 0;

    if (presentCount >= AUTO_VERIFY_MIN_EVENTS && (user.rate || 0) >= AUTO_VERIFY_MIN_RATING) {
        user.isVerified = true;
        await user.save();
    }
}

export class UsherController {

    // US-100: Get own profile
    static async getUsherProfile(req, res, next) {
        const { id } = req.params;
        const authUserId = req.authUser.id;

        if (id !== authUserId) {
            return next(new AppError('Unauthorized: You can only access your own profile', 403));
        }

        const user = await User.findByPk(id, { attributes: SAFE_USER_ATTRS });
        if (!user) return next(new AppError(messages.user.notfound, 404));

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            data: user,
        });
    }

    // US-210: Get usher profile by id (for organizers/admins to view — read-only)
    static async getUsherProfileById(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['mobileNumber', 'email', 'password', 'role', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] },
        });
        if (!user) return next(new AppError(messages.user.notfound, 404));

        const applications = await Application.findAll({
            where: { talentId: id, status: { [Op.in]: ['accepted', 'excused'] } },
        });
        const eventIds = applications.map(a => a.eventId);
        const events = eventIds.length
            ? await Event.findAll({ where: { id: { [Op.in]: eventIds } }, order: [['eventDate', 'DESC']] })
            : [];

        const history = await Promise.all(events.map(async (event) => {
            const attendance = await Attendance.findOne({ where: { eventId: event.id, talentId: id } });
            const review = await Review.findOne({ where: { eventId: event.id, reviewedUserId: id } });
            return { event, attendanceStatus: attendance?.status || null, rating: review?.rating || null, comment: review?.comment || null };
        }));

        const reviews = await Review.findAll({ where: { reviewedUserId: id }, order: [['createdAt', 'DESC']] });

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            data: { user, eventHistory: history, reviews },
        });
    }

    // US-101: Update own profile
    static async updateProfile(req, res, next) {
        const authUserId = req.authUser.id;
        const { fullName, city, experience, languages, eventCategories } = req.body;

        const user = await User.findByPk(authUserId);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        if (fullName !== undefined) user.fullName = fullName;
        if (city !== undefined) user.city = city;
        if (experience !== undefined) user.experience = experience;
        if (languages !== undefined) user.languages = languages;
        if (eventCategories !== undefined) user.eventCategories = eventCategories;

        await user.save();

        return res.status(200).json({
            success: true,
            message: messages.user.updateSuccessfully,
            data: user,
        });
    }

    // US-102: Upload / change profile picture
    static async uploadProfilePicture(req, res, next) {
        if (!req.file) return next(new AppError('Image file is required', 400));

        const userId = req.authUser.id;
        const user = await User.findByPk(userId);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        // Delete old picture if not default
        if (user.portfolioPicture?.public_id && user.portfolioPicture.public_id !== 'default_avatar') {
            await CloudinaryService.deleteImage(user.portfolioPicture.public_id);
        }

        const uploaded = await CloudinaryService.uploadBuffer(req.file.buffer, 'ushers/profiles');
        user.portfolioPicture = uploaded;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            data: { portfolioPicture: uploaded },
        });
    }

    // US-103: Browse available open events (with ApiFeature pagination)
    static async browseEvents(req, res, next) {
        const { category, city } = req.query;

        const where = {
            status: 'open',
            applicationDeadline: { [Op.gt]: new Date() },
        };
        if (category) where.category = category;
        if (city) where.location = { [Op.iLike]: `%${city}%` };

        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { rows: events, count } = await Event.findAndCountAll({
            where,
            order: feature.order.length ? feature.order : [['eventDate', 'ASC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            ...ApiFeature.paginateResponse(events, page, feature.limit, count),
        });
    }

    // US-104: Apply to an event
    static async applyToEvent(req, res, next) {
        const { eventId } = req.body;
        const talentId = req.authUser.id;

        const event = await Event.findByPk(eventId);
        if (!event) return next(new AppError(messages.event.notfound, 404));
        if (event.status !== 'open') return next(new AppError('This event is not open for applications', 400));

        // Enforce deadline (BR-02)
        if (new Date() > new Date(event.applicationDeadline)) {
            return next(new AppError('Application deadline has passed', 400));
        }

        // Prevent duplicate (BR-01)
        const existing = await Application.findOne({ where: { eventId, talentId } });
        if (existing) return next(new AppError('You have already applied to this event', 400));

        const application = await Application.create({
            eventId, talentId, status: 'pending', isDirect: false, appliedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application,
        });
    }

    // US-105: Track my applications & events (with ApiFeature pagination)
    static async getMyApplications(req, res, next) {
        const talentId = req.authUser.id;
        const { filter } = req.query;
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;

        // Fetch all for in-memory enrichment and date-based filtering
        const applications = await Application.findAll({
            where: { talentId },
            order: [['appliedAt', 'DESC']],
        });

        const now = new Date();
        let enriched = await Promise.all(applications.map(async (app) => {
            const event = await Event.findByPk(app.eventId);
            let referredByName = null;
            if (app.referredBy) {
                const referrer = await User.findByPk(app.referredBy, { attributes: ['fullName'] });
                referredByName = referrer?.fullName || null;
            }
            return { ...app.toJSON(), event, referredByName };
        }));

        if (filter === 'upcoming') {
            enriched = enriched.filter(a => a.event && new Date(a.event.eventDate) >= now);
        } else if (filter === 'past') {
            enriched = enriched.filter(a => a.event && new Date(a.event.eventDate) < now);
        }

        const total = enriched.length;
        const paginated = enriched.slice((page - 1) * size, page * size);

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            ...ApiFeature.paginateResponse(paginated, page, size, total),
        });
    }

    // US-106: Get event history on profile page
    static async getMyEventHistory(req, res, next) {
        const talentId = req.authUser.id;

        const applications = await Application.findAll({
            where: { talentId, status: { [Op.in]: ['accepted', 'excused'] } },
        });

        const history = await Promise.all(applications.map(async (app) => {
            const event = await Event.findByPk(app.eventId);
            const attendance = await Attendance.findOne({ where: { eventId: app.eventId, talentId } });
            const review = await Review.findOne({ where: { eventId: app.eventId, reviewedUserId: talentId } });
            return {
                event,
                applicationStatus: app.status,
                attendanceStatus: attendance?.status || null,
                rating: review?.rating || null,
                comment: review?.comment || null,
            };
        }));

        history.sort((a, b) => {
            if (!a.event || !b.event) return 0;
            return new Date(b.event.eventDate) - new Date(a.event.eventDate);
        });

        return res.status(200).json({
            success: true,
            message: messages.event.getsuccessfully,
            data: history,
            count: history.length,
        });
    }

    // US-107 & US-108: Excuse from an accepted event
    static async excuseFromEvent(req, res, next) {
        const { applicationId } = req.params;
        const talentId = req.authUser.id;

        const application = await Application.findOne({ where: { id: applicationId, talentId } });
        if (!application) return next(new AppError('Application not found', 404));

        // Can only excuse from accepted (BR-03)
        if (application.status !== 'accepted') {
            return next(new AppError('You can only excuse from accepted applications', 400));
        }

        const event = await Event.findByPk(application.eventId);
        if (!event) return next(new AppError(messages.event.notfound, 404));

        if (new Date() > new Date(event.eventDate)) {
            return next(new AppError('Cannot excuse from an event that has already occurred', 400));
        }

        // Determine late excuse (BR-04)
        const now = new Date();
        const deadline = new Date(event.applicationDeadline);
        const msIn3Days = 3 * 24 * 60 * 60 * 1000;
        const isLateExcuse = (deadline - now) <= msIn3Days;

        application.status = 'excused';
        await application.save();

        event.hiredTalents = event.hiredTalents.filter(id => id !== talentId);
        await event.save();

        const talent = await User.findByPk(talentId);
        let lateExcuseCount = talent.lateExcuseCount || 0;

        if (isLateExcuse) {
            lateExcuseCount += 1;
            talent.lateExcuseCount = lateExcuseCount;
            talent.consecutiveGoodEvents = 0; // reset streak (BR-08)
            await talent.save();
        }

        return res.status(200).json({
            success: true,
            message: isLateExcuse
                ? `Excused with late penalty. Late excuse count: ${lateExcuseCount}/5`
                : 'Excused successfully. No penalty applied.',
            data: { applicationStatus: application.status, isLateExcuse, lateExcuseCount },
        });
    }

    // US-109: Refer another talent to an event
    static async referTalent(req, res, next) {
        const { eventId, referredTalentId } = req.body;
        const referrerTalentId = req.authUser.id;

        if (referrerTalentId === referredTalentId) return next(new AppError('You cannot refer yourself', 400));

        const event = await Event.findByPk(eventId);
        if (!event) return next(new AppError(messages.event.notfound, 404));
        if (event.status !== 'open') return next(new AppError('Event is not open for referrals', 400));

        const referredTalent = await User.findOne({ where: { id: referredTalentId, role: 'usher' } });
        if (!referredTalent) return next(new AppError('Referred talent not found', 404));

        // Cannot refer accepted/rejected (BR-13)
        const existingApp = await Application.findOne({ where: { eventId, talentId: referredTalentId } });
        if (existingApp && ['accepted', 'rejected'].includes(existingApp.status)) {
            return next(new AppError('Cannot refer a talent who is already accepted or rejected for this event', 400));
        }

        const existingReferral = await Referral.findOne({ where: { eventId, referredTalentId } });
        if (existingReferral) return next(new AppError('This talent has already been referred to this event', 400));

        const referral = await Referral.create({
            eventId, referrerTalentId, referredTalentId, status: 'pending',
        });

        if (!existingApp) {
            await Application.create({
                eventId, talentId: referredTalentId,
                status: 'pending', isDirect: false,
                referredBy: referrerTalentId, appliedAt: new Date(),
            });
        } else {
            existingApp.referredBy = referrerTalentId;
            await existingApp.save();
        }

        return res.status(201).json({
            success: true,
            message: 'Talent referred successfully',
            data: referral,
        });
    }
}

// Export helper for use by organizer controller after marking attendance/reviews
export { checkAndAutoVerify };
