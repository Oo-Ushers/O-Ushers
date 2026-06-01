import joi from 'joi';
import { AppError } from '../utils/appError.js';

export const generalFields = {
  name: joi.string(),
  email: joi.string().email(),
  password: joi.string().required(),
  rePassword: joi.string().valid(joi.ref('password')),
  id: joi.number().integer().positive(),
  comment: joi.string(),
};

export class ValidationMiddleware {
  static isValid(schema) {
    return (req, res, next) => {
      const data = {
        ...req.body,
        ...req.params,
        ...req.query,
      };
      const { error } = schema.validate(data, { abortEarly: true });
      if (error) {
        const errArr = [];
        error.details.forEach((err) => errArr.push(err.message));
        return next(new AppError(errArr, 400));
      }
      next();
    };
  }

  static async isAdmin(req, res, next) {
    try {
      if (!req.authUser || req.authUser.role !== 'admin') {
        return next(new AppError('Unauthorized - Admin access required', 403));
      }
      next();
    } catch (error) {
      return next(new AppError('Authentication failed', 401));
    }
  }
}
