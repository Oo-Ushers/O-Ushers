import { Router } from "express";
import { ErrorHandler } from "../utils/appError.js";
import { UserController } from "../controllers/user.controller.js";
import { ValidationMiddleware } from "../middlewares/validation.js";
import { AuthMiddleware } from "../middlewares/authentication.js";
import { UserValidator } from "../validators/user.validator.js";

export const authRouter = Router();

// Public auth routes (with schema validation)
authRouter.post('/signup', ValidationMiddleware.isValid(UserValidator.signup), ErrorHandler.asyncHandler(UserController.signup));
authRouter.post('/login', ValidationMiddleware.isValid(UserValidator.login), ErrorHandler.asyncHandler(UserController.login));
authRouter.post('/forget-password', ValidationMiddleware.isValid(UserValidator.forgetPassword), ErrorHandler.asyncHandler(UserController.forgetPassword));
authRouter.post('/verify-otp', ValidationMiddleware.isValid(UserValidator.verifyOtp), ErrorHandler.asyncHandler(UserController.verifyOtp));
authRouter.post('/reset-password', ValidationMiddleware.isValid(UserValidator.resetPassword), ErrorHandler.asyncHandler(UserController.resetPassword));

// Get own profile — any authenticated user can call this to get their own data
authRouter.get('/me', AuthMiddleware.isAuthenticated(), ErrorHandler.asyncHandler(UserController.getMyProfile));

// Get all users — restricted to ushers (as originally intended)
authRouter.get('/users', AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher']), ErrorHandler.asyncHandler(UserController.getAllUsers));

export default authRouter;