import { Router } from "express";
import { asyncHandler } from "../utils/appError.js";
import { signup, login, forgetPassword, verifyOtp, resetPassword, getAllUsers, sendPhoneOtp, verifyPhoneOtp } from "../controllers/user.controller.js";
import { isValid } from "../middlewares/validation.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authentication.js";
import { signupSchema, loginSchema, forgetPasswordSchema, verifyOtpSchema, resetPasswordSchema, sendPhoneOtpSchema, verifyPhoneOtpSchema } from "../validators/user.validator.js";

export const authRouter = Router();

authRouter.get('/users', isAuthenticated(), isAuthorized(['usher']), asyncHandler(getAllUsers));
authRouter.post('/signup', isValid(signupSchema), asyncHandler(signup));
authRouter.post('/login', isValid(loginSchema), asyncHandler(login));
authRouter.post('/forget-password', isValid(forgetPasswordSchema), asyncHandler(forgetPassword));
authRouter.post('/verify-otp', isValid(verifyOtpSchema), asyncHandler(verifyOtp));
authRouter.post('/reset-password', isValid(resetPasswordSchema), asyncHandler(resetPassword));

// WhatsApp phone verification
authRouter.post('/send-phone-otp', isValid(sendPhoneOtpSchema), asyncHandler(sendPhoneOtp));
authRouter.post('/verify-phone-otp', isValid(verifyPhoneOtpSchema), asyncHandler(verifyPhoneOtp));

export default authRouter;