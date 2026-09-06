import joi from 'joi';
import { eventCategories, genderPreference, eventStatus } from '../utils/constant/enums.js';

export class EventValidator {
    static create = joi.object({
        title: joi.string().min(3).max(100).required(),
        category: joi.string().valid(...Object.values(eventCategories)).required(),
        eventDate: joi.date().greater('now').required(),
        applicationDeadline: joi.date().less(joi.ref('eventDate')).required(),
        startTime: joi.string().required(),
        endTime: joi.string().required(),
        location: joi.string().required(),
        requiredCount: joi.number().integer().min(1).required(),
        genderPreference: joi.string().valid(...Object.values(genderPreference)).default('any'),
        budget: joi.number().positive().required(),
        dressCode: joi.string().optional(),
        notes: joi.string().optional(),
    }).required();

    static updateStatus = joi.object({
        status: joi.string().valid(...Object.values(eventStatus)).required(),
    }).required();
}

export class ApplicationValidator {
    static apply = joi.object({
        eventId: joi.string().uuid().required(),
    }).required();

    static refer = joi.object({
        eventId: joi.string().uuid().required(),
        referredTalentId: joi.string().uuid().required(),
    }).required();

    static directBook = joi.object({
        eventId: joi.string().uuid().required(),
        talentId: joi.string().uuid().required(),
    }).required();

    static updateStatus = joi.object({
        status: joi.string().valid('accepted', 'rejected').required(),
    }).required();
}

export class AttendanceValidator {
    static mark = joi.object({
        talentId: joi.string().uuid().required(),
        status: joi.string().valid('present', 'absent', 'late').required(),
        checkInTime: joi.date().optional(),
    }).required();
}

export class ReviewValidator {
    static create = joi.object({
        talentId: joi.string().uuid().required(),
        rating: joi.number().integer().min(1).max(5).required(),
        comment: joi.string().max(500).optional(),
    }).required();
}

export class StaffValidator {
    static invite = joi.object({
        fullName: joi.string().min(2).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).default('member123'),
        role: joi.string().valid('organizer_member', 'organizer_supervisor').default('organizer_member'),
    }).required();

    static update = joi.object({
        fullName: joi.string().min(2).max(100).optional(),
        email: joi.string().email().optional(),
        password: joi.string().min(6).optional(),
        role: joi.string().valid('organizer_member', 'organizer_supervisor').optional(),
    }).min(1).required();
}

export class PaymentMethodValidator {
    static add = joi.object({
        provider: joi.string().min(2).max(50).required(),
        numberOrDetail: joi.string().min(3).max(100).required(),
    }).required();
}
