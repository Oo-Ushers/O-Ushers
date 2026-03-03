import { User } from "../../db/index.js";
import { AppError } from "../utils/appError.js";
import { verifyToken } from "../utils/token.js";

export const isAuthenticated = () => {
    return async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return next(new AppError('Token Required', 401));
        }

        try {
            const payload = verifyToken({ token });
            if (!payload?.id) {
                return next(new AppError('Invalid payload', 401));
            }

            const user = await User.findById(payload.id);
            if (!user) {
                return next(new AppError('User Not Found', 401));
            }

            // Set the authenticated user in req
            req.authUser = user;
            next();
        } catch (error) {
            return next(new AppError('Authentication Failed', 401));
        }
    }
}

export const isAuthorized = (roles = []) => {
    return async (req, res, next) => {
        const user = req.authUser;
        if (!roles.includes(user.role)) {
            return next(new AppError('not authorized', 401));
        }
        next();
    };
};


