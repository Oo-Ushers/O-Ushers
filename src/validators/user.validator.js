import joi from "joi";
import { roles, eventCategories, language } from "../utils/constant/enums.js";
import { generalFields } from "../middlewares/validation.js";

export class UserValidator {
    static signup = joi.object({
        fullName: joi.string().min(3).max(50).required(),
        userName: joi.string().min(3).max(30).required(),
        email: generalFields.email.required(),
        password: generalFields.password,
        mobileNumber: joi.string().pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/).required(),
        city: joi.string().required(),
        experience: joi.number().integer().min(0).required(),
        portfolioPicture: joi.any().default({
            secure_url: "https://res.cloudinary.com/dvz0zvpof/image/upload/v1727788484/Default_pfp.svg_v7dmtb.png",
            public_id: "default_avatar"
        }),
        role: joi.string().valid(...Object.values(roles)).required(),
        rate: joi.number().min(0).optional(),
        languages: joi.array().items(joi.string().valid(...Object.values(language))).optional(),
        eventCategories: joi.array().items(joi.string().valid(...Object.values(eventCategories))).optional(),
        portfolio: joi.array().items(joi.any()).optional()
    }).required();

    static login = joi.object({
        email: generalFields.email.required(),
        password: generalFields.password
    }).required();

    static forgetPassword = joi.object({
        email: generalFields.email.required()
    }).required();

    static verifyOtp = joi.object({
        email: generalFields.email.required(),
        otp: joi.string().length(6).required()
    }).required();

    static resetPassword = joi.object({
        email: generalFields.email.required(),
        newPassword: generalFields.password
    }).required();
}
