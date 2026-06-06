import { sequelize } from "../../db/connection.js";
import { User } from "../../db/index.js";
import { AppError } from "../utils/appError.js";
import { messages } from "../utils/constant/messages.js";
import { EmailService } from "../utils/email.js";
import { HashService } from "../utils/hashAndcompare.js";
import { HtmlTemplateService } from "../utils/htmlTemplate.js";
import { OtpService } from "../utils/otp.js";
import { TokenService } from "../utils/token.js";
import { ApiFeature } from "../utils/apiFeature.js";

const SAFE_USER_ATTRS = { exclude: ['password', 'otp', 'otpExpiry', 'otpAttempts', 'lastOtpRequest', 'otpVerified'] };

export class UserController {
    // signup
    static async signup(req, res, next) {
        let {
            fullName, userName, email, password, mobileNumber, city,
            experience, portfolioPicture, role, rate, languages, eventCategories, portfolio
        } = req.body;

        email = email.toLowerCase();

        if (!portfolioPicture) {
            portfolioPicture = {
                secure_url: "https://res.cloudinary.com/dvz0zvpof/image/upload/v1727788484/Default_pfp.svg_v7dmtb.png",
                public_id: "default_avatar"
            };
        }

        const transaction = await sequelize.transaction();

        const userExist = await User.findOne({
            where: { email },
            attributes: ['email'],
            transaction
        });

        if (userExist) {
            await transaction.rollback();
            return next(new AppError(messages.user.alreadyExist, 400));
        }

        const hashedpassword = HashService.hashPassword({ password });

        const newUser = await User.create({
            fullName,
            userName,
            email,
            password: hashedpassword,
            mobileNumber,
            city,
            experience,
            portfolioPicture,
            role,
            rate: rate || 0,
            languages,
            eventCategories,
            portfolio
        }, { transaction });

        // Create token and send verification email — rollback if email fails
        const token = TokenService.generateToken({ payload: { email } });
        try {
            await EmailService.sendEmail({
                to: email,
                subject: 'Email Confirmation',
                html: HtmlTemplateService.emailConfirmation(token)
            });
        } catch {
            await transaction.rollback();
            return next(new AppError('Failed to send verification email. Please try again.', 500));
        }

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: messages.user.createSuccessfully,
            data: newUser  // toJSON() on the model strips the password field
        });
    }

    // login
    static async login(req, res, next) {
        let { email, password } = req.body;
        email = email.toLowerCase();

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return next(new AppError(messages.user.notfound, 404));
        }

        const isValid = HashService.comparePassword({ password, hashPassword: user.password });

        if (!isValid) {
            return next(new AppError(messages.user.invalidCreadintials, 401));
        }

        if (!user.isEmailVerified) {
            return next(new AppError(messages.user.notverified, 401));
        }

        const token = TokenService.generateToken({
            payload: {
                email,
                id: user.id,
                role: user.role
            }
        });

        return res.status(200).json({
            success: true,
            message: messages.user.loginSuccessfully,
            role: user.role,
            data: { token }
        });
    }

    // forgetPassword — OTP is hashed before storing
    static async forgetPassword(req, res, next) {
        const { email } = req.body;

        const userExist = await User.findOne({ where: { email } });

        if (!userExist) {
            return next(new AppError(messages.user.notfound, 404));
        }

        const currentTime = Date.now();

        if (userExist.lastOtpRequest) {
            const lastRequestTime = new Date(userExist.lastOtpRequest).getTime();
            const timeSinceLastRequest = currentTime - lastRequestTime;

            if (timeSinceLastRequest < 30 * 1000) {
                const remainingTime = Math.ceil((30 * 1000 - timeSinceLastRequest) / 1000);
                return next(new AppError(`Please wait ${remainingTime} seconds before requesting a new OTP`, 429));
            }
        }

        const otp = OtpService.generateOTP();
        // Hash the OTP before storing — plain text OTP is only sent via email, never stored
        const hashedOtp = HashService.hashPassword({ password: otp.toString() });

        try {
            await userExist.update({
                otp: hashedOtp,
                otpExpiry: new Date(currentTime + 15 * 60 * 1000),
                otpAttempts: 0,
                lastOtpRequest: new Date(currentTime)
            });

            await EmailService.sendEmail({
                to: email,
                subject: 'Forget Password OTP',
                html: HtmlTemplateService.otpEmail(otp), // raw OTP in email
            });

            return res.status(200).json({
                message: 'Check your email for the OTP',
                success: true
            });

        } catch {
            await userExist.update({
                otp: null,
                otpExpiry: null,
                otpAttempts: 0,
                lastOtpRequest: null
            });
            return next(new AppError('Failed to send email', 500));
        }
    }

    // verifyOtp — compares against hashed OTP; returns error if expired (no auto-resend)
    static async verifyOtp(req, res, next) {
        const { otp, email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(new AppError(messages.user.notfound, 404));
        }

        const currentTime = Date.now();
        const otpExpiryTime = user.otpExpiry ? new Date(user.otpExpiry).getTime() : 0;

        // If OTP doesn't exist or has expired — tell user to request a new one
        if (!user.otp || otpExpiryTime <= currentTime) {
            return next(new AppError('OTP has expired. Please request a new one via /forget-password.', 400));
        }

        // Compare raw OTP against stored bcrypt hash
        const isValidOtp = HashService.comparePassword({ password: otp.toString(), hashPassword: user.otp });

        if (!isValidOtp) {
            await user.increment('otpAttempts', { by: 1 });
            await user.reload();

            if (user.otpAttempts >= 3) {
                await user.update({
                    otp: null,
                    otpExpiry: null,
                    otpAttempts: 0
                });
                return next(new AppError('Maximum OTP attempts exceeded. Please request a new OTP.', 403));
            }

            return next(new AppError(`Invalid OTP. You have ${3 - user.otpAttempts} attempts left`, 401));
        }

        await user.update({
            otpAttempts: 0,
            otp: null,
            otpExpiry: null,
            otpVerified: true
        });

        return res.status(200).json({
            message: 'OTP verified successfully',
            success: true
        });
    }

    // resetPassword
    static async resetPassword(req, res, next) {
        const { newPassword, email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(new AppError(messages.user.notfound, 404));
        }

        if (!user.otpVerified) {
            return next(new AppError('OTP verification required before resetting password.', 403));
        }

        const hashedPassword = HashService.hashPassword({ password: newPassword });

        await user.update({
            password: hashedPassword,
            otpVerified: false,
            lastOtpRequest: null
        });

        return res.status(200).json({ message: 'Password updated successfully', success: true });
    }

    // getAllUsers — with pagination via ApiFeature
    static async getAllUsers(req, res, next) {
        const feature = new ApiFeature(req.query).pagination().sort().build();
        const page = parseInt(req.query.page) || 1;

        const { count, rows: users } = await User.findAndCountAll({
            attributes: SAFE_USER_ATTRS,
            order: feature.order.length ? feature.order : [['createdAt', 'DESC']],
            limit: feature.limit,
            offset: feature.offset,
        });

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            ...ApiFeature.paginateResponse(users, page, feature.limit, count),
        });
    }

    // getMyProfile — returns the authenticated user's own profile (any role)
    static async getMyProfile(req, res, next) {
        const userId = req.authUser.id;
        const user = await User.findByPk(userId, {
            attributes: SAFE_USER_ATTRS,
        });
        if (!user) {
            return next(new AppError(messages.user.notfound, 404));
        }
        return res.status(200).json({
            success: true,
            message: 'Profile fetched successfully',
            data: user,
        });
    }
}