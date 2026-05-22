import { Router } from "express";
import { asyncHandler } from "../utils/appError.js";
import { signup, login, forgetPassword, verifyOtp, resetPassword, getAllUsers } from "../controllers/user.controller.js";
import { isValid } from "../middlewares/validation.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authentication.js";
import { signupSchema, loginSchema, forgetPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "../validators/user.validator.js";

export const authRouter = Router();

// ── Users ────────────────────────────────────────────────────────────────
authRouter.get('/users', isAuthenticated(), isAuthorized(['usher']), asyncHandler(getAllUsers));

// ── Registration ─────────────────────────────────────────────────────────
authRouter.post('/signup', isValid(signupSchema), asyncHandler(signup));

// ── Login ────────────────────────────────────────────────────────────────
authRouter.post('/login', isValid(loginSchema), asyncHandler(login));

// ── Password Recovery ────────────────────────────────────────────────────
authRouter.post('/forget-password', isValid(forgetPasswordSchema), asyncHandler(forgetPassword));
authRouter.post('/verify-otp', isValid(verifyOtpSchema), asyncHandler(verifyOtp));
authRouter.post('/reset-password', isValid(resetPasswordSchema), asyncHandler(resetPassword));

export default authRouter;