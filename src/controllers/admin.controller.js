import { Op } from 'sequelize';
import { User, Event, Application } from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { messages } from '../utils/constant/messages.js';
import { ApiFeature } from '../utils/apiFeature.js';

const SAFE_USER_ATTRS = { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] };

export class AdminController {

    // US-301: Get all users — with search & role filter + ApiFeature pagination
    static async getAllUsers(req, res, next) {
        const { search, role } = req.query;
        const where = {};

        if (role && role !== 'all') {
            if (role === 'blocked') {
                where.isBlocked = true;
            } else {
                where.role = role;
            }
        }

        if (search) {
            where[Op.or] = [
                { fullName: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: SAFE_USER_ATTRS,
            order: feature.order.length ? feature.order : [['createdAt', 'DESC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            ...ApiFeature.paginateResponse(users, page, feature.limit, count),
        });
    }

    // Get all ushers (talent) — with ApiFeature pagination
    static async getUshers(req, res, next) {
        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { count, rows: users } = await User.findAndCountAll({
            where: { role: 'usher' },
            attributes: SAFE_USER_ATTRS,
            order: feature.order.length ? feature.order : [['createdAt', 'DESC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            ...ApiFeature.paginateResponse(users, page, feature.limit, count),
        });
    }

    // Get all organizers (providers) — with ApiFeature pagination
    static async getOrganizers(req, res, next) {
        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { count, rows: users } = await User.findAndCountAll({
            where: { role: 'organizer' },
            attributes: SAFE_USER_ATTRS,
            order: feature.order.length ? feature.order : [['createdAt', 'DESC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: messages.user.getsuccessfully,
            ...ApiFeature.paginateResponse(users, page, feature.limit, count),
        });
    }

    // US-306: Get all events — with search & status filter + ApiFeature pagination
    static async getEvents(req, res, next) {
        const { search, status } = req.query;
        const where = {};

        if (status && status !== 'all') where.status = status;

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { location: { [Op.iLike]: `%${search}%` } },
            ];
        }

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

    // US-302: Block a user (cannot block admins — BR-09)
    static async blockUser(req, res, next) {
        const { id } = req.params;
        const adminId = req.authUser.id;

        if (id === adminId) return next(new AppError('You cannot block yourself', 400));

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));
        if (user.role === 'admin') return next(new AppError('Admin accounts cannot be blocked', 403));

        user.isBlocked = true;
        user.status = 'blocked';
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User blocked successfully',
        });
    }

    // US-303: Unblock a user
    static async unblockUser(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        user.isBlocked = false;
        user.status = 'verified';
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User unblocked successfully',
        });
    }

    // US-304: Verify a user
    static async verifyUser(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: messages.user.verified,
        });
    }

    // US-304: Unverify a user
    static async unverifyUser(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));

        user.isVerified = false;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'User unverified successfully',
        });
    }

    // Legacy: update user status field
    static async updateUserStatus(req, res, next) {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));
        if (user.role === 'admin') return next(new AppError('Cannot modify admin accounts', 403));

        user.status = status;
        user.isBlocked = status === 'blocked';
        await user.save();

        return res.status(200).json({
            success: true,
            message: messages.user.updateSuccessfully,
        });
    }

    // US-307: Change event status
    static async updateEventStatus(req, res, next) {
        const { id } = req.params;
        const { status } = req.body;

        const event = await Event.findByPk(id);
        if (!event) return next(new AppError(messages.event.notfound, 404));

        event.status = status;
        await event.save();

        return res.status(200).json({
            success: true,
            message: messages.event.updateSuccessfully,
            data: event,
        });
    }

    // US-308: Delete event and all its applications (BR-11)
    static async deleteEvent(req, res, next) {
        const { id } = req.params;

        const event = await Event.findByPk(id);
        if (!event) return next(new AppError(messages.event.notfound, 404));

        await Application.destroy({ where: { eventId: id } });
        await event.destroy();

        return res.status(200).json({
            success: true,
            message: messages.event.deleteSuccessfully,
        });
    }

    // US-305: Reset talent late excuses
    static async resetExcuses(req, res, next) {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) return next(new AppError(messages.user.notfound, 404));
        if (user.role !== 'usher') return next(new AppError('Only usher accounts have excuse counters', 400));

        user.lateExcuseCount = 0;
        user.consecutiveGoodEvents = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Late excuse counter reset successfully',
            data: { id: user.id, lateExcuseCount: 0, consecutiveGoodEvents: 0 },
        });
    }

    // US-300: Admin dashboard stats
    static async getDashboard(req, res, next) {
        const [
            totalUsers,
            totalTalents,
            totalOrganizers,
            totalEvents,
            openEvents,
            completedEvents,
            cancelledEvents,
            flaggedTalents,
            recentEvents,
            topRatedTalents,
        ] = await Promise.all([
            User.count(),
            User.count({ where: { role: 'usher' } }),
            User.count({ where: { role: 'organizer' } }),
            Event.count(),
            Event.count({ where: { status: 'open' } }),
            Event.count({ where: { status: 'completed' } }),
            Event.count({ where: { status: 'cancelled' } }),
            User.findAll({
                where: { role: 'usher', lateExcuseCount: { [Op.gte]: 5 } },
                attributes: SAFE_USER_ATTRS,
                order: [['lateExcuseCount', 'DESC']],
            }),
            Event.findAll({ order: [['createdAt', 'DESC']], limit: 10 }),
            User.findAll({
                where: { role: 'usher' },
                attributes: SAFE_USER_ATTRS,
                order: [['rate', 'DESC']],
                limit: 10,
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: {
                stats: { totalUsers, totalTalents, totalOrganizers, totalEvents, openEvents, completedEvents, cancelledEvents },
                flaggedTalents,
                recentEvents,
                topRatedTalents,
            },
        });
    }
}
