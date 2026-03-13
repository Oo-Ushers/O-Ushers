import joi from "joi";
import { roles, eventCategories, language } from "../utils/constant/enums.js";
import { generalFields } from "../middlewares/validation.js";

export const signupSchema = joi.object({
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

export const loginSchema = joi.object({
    email: generalFields.email.required(),
    password: generalFields.password
}).required();

export const forgetPasswordSchema = joi.object({
    email: generalFields.email.required()
}).required();

export const verifyOtpSchema = joi.object({
    email: generalFields.email.required(),
    otp: joi.string().length(6).required()
}).required();

export const resetPasswordSchema = joi.object({
    email: generalFields.email.required(),
    newPassword: generalFields.password
}).required();

// ── WhatsApp Phone OTP validators ──
export const sendPhoneOtpSchema = joi.object({
    mobileNumber: joi.string().pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/).required(),
}).required();

export const verifyPhoneOtpSchema = joi.object({
    mobileNumber: joi.string().pattern(/^(\+?\d{1,3}[- ]?)?\d{10}$/).required(),
    otp: joi.string().length(6).required(),
}).required();
