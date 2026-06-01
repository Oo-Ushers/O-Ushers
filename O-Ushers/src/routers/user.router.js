import { Router } from "express";
import { ErrorHandler } from "../utils/appError.js";
import { UserController } from "../controllers/user.controller.js";
import { ValidationMiddleware } from "../middlewares/validation.js";
import { AuthMiddleware } from "../middlewares/authentication.js";
import { UserValidator } from "../validators/user.validator.js";

export const authRouter = Router();

authRouter.get('/users', AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher']), ErrorHandler.asyncHandler(UserController.getAllUsers));
authRouter.post('/signup', ValidationMiddleware.isValid(UserValidator.signup), ErrorHandler.asyncHandler(UserController.signup));
authRouter.post('/login', ValidationMiddleware.isValid(UserValidator.login), ErrorHandler.asyncHandler(UserController.login));
authRouter.post('/forget-password', ValidationMiddleware.isValid(UserValidator.forgetPassword), ErrorHandler.asyncHandler(UserController.forgetPassword));
authRouter.post('/verify-otp', ValidationMiddleware.isValid(UserValidator.verifyOtp), ErrorHandler.asyncHandler(UserController.verifyOtp));
authRouter.post('/reset-password', ValidationMiddleware.isValid(UserValidator.resetPassword), ErrorHandler.asyncHandler(UserController.resetPassword));
authRouter.get('/talents/:id', AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher']), ErrorHandler.asyncHandler(UserController.getUsherProfile));
export default authRouter;