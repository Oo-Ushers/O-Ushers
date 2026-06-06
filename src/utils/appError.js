import { FileService } from './file-function.js';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ErrorHandler {
  static asyncHandler(fn) {
    return (req, res, next) => {
      fn(req, res, next).catch((err) => {
        // Pass Sequelize errors through unwrapped so the global handler can
        // identify them by instanceof and return field-specific messages.
        if (err instanceof UniqueConstraintError || err instanceof ValidationError) {
          return next(err);
        }
        return next(new AppError(err.message, err.statusCode || 500));
      });
    };
  }

  static globalErrorHandler(err, req, res, next) {
    if (req.file) {
      FileService.deleteFile(req.file.path);
    }

    // ── Sequelize: duplicate unique field (email, mobileNumber, userName) ──
    if (err instanceof UniqueConstraintError) {
      const fieldMessages = {
        email: 'This email address is already registered.',
        mobileNumber: 'This mobile number is already in use.',
        userName: 'This username is already taken.',
      };

      const violated = err.errors?.[0]?.path;
      const message = fieldMessages[violated] || `'${violated}' already exists.`;

      return res.status(409).json({
        success: false,
        message,
        field: violated,
      });
    }

    // ── Sequelize: model-level validation failure ──────────────────────────
    if (err instanceof ValidationError) {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.length === 1 ? messages[0] : messages,
      });
    }

    return res.status(err.statusCode || 500).json({
      message: err.message,
      success: false,
    });
  }
}
