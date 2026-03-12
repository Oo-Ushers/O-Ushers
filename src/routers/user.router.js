import { Router } from "express";
import { asyncHandler } from "../utils/appError.js";
import { signup, login, forgetPassword, verifyOtp, resetPassword } from "../controllers/user.controller.js";
import { isValid } from "../middlewares/validation.js";
import { signupSchema, loginSchema, forgetPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "../validators/user.validator.js";

export const authRouter = Router();

authRouter.post('/signup', isValid(signupSchema), asyncHandler(signup));
authRouter.post('/login', isValid(loginSchema), asyncHandler(login));
authRouter.post('/forget-password', isValid(forgetPasswordSchema), asyncHandler(forgetPassword));
authRouter.post('/verify-otp', isValid(verifyOtpSchema), asyncHandler(verifyOtp));
authRouter.post('/reset-password', isValid(resetPasswordSchema), asyncHandler(resetPassword));

export default authRouter;