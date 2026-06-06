import { User } from '../../db/index.js';
import { AppError } from '../utils/appError.js';
import { TokenService } from '../utils/token.js';

export class AuthMiddleware {
  static isAuthenticated() {
    return async (req, res, next) => {
      //  updateeeeee
      let { token, authorization } = req.headers;

      if (!token && authorization) {
        token = authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
      }

      try {
        const payload = TokenService.verifyToken({ token });
        if (!payload?.id) {
          return next(new AppError('Invalid payload', 401));
        }

        const user = await User.findByPk(payload.id);
        if (!user) {
          return next(new AppError('User Not Found', 401));
        }

        // BR-10: Blocked users cannot access the platform
        if (user.isBlocked) {
          return next(new AppError('Your account has been blocked', 403));
        }

        req.authUser = user;
        next();
      } catch (error) {
        return next(new AppError('Authentication Failed', 401));
      }
    };
  }

  static isAuthorized(roles = []) {
    return async (req, res, next) => {
      const user = req.authUser;
      if (!roles.includes(user.role)) {
        return next(new AppError('not authorized', 401));
      }
      next();
    };
  }
}
