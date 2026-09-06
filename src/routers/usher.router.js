import { Router } from 'express';
import { ErrorHandler } from '../utils/appError.js';
import { AuthMiddleware } from '../middlewares/authentication.js';
import { UsherController } from '../controllers/usher.controller.js';
import { MulterService } from '../utils/multer.cloud.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import { ApplicationValidator, PaymentMethodValidator } from '../validators/event.validator.js';

export const usherRouter = Router();

const auth = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher'])];
const authShared = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher', 'admin', 'organizer'])];
const upload = MulterService.cloudUpload();

// US-100-EXT: Dashboard stats
usherRouter.get('/dashboard', ...auth, ErrorHandler.asyncHandler(UsherController.getDashboard));

// US-101: Update own profile (text fields)
usherRouter.put('/profile/update', ...auth, ErrorHandler.asyncHandler(UsherController.updateProfile));

// US-102: Upload / change profile picture
usherRouter.patch('/profile/picture', ...auth, upload.single('picture'), ErrorHandler.asyncHandler(UsherController.uploadProfilePicture));

// Payment methods
usherRouter.post('/profile/payment-methods', ...auth, ValidationMiddleware.isValid(PaymentMethodValidator.add), ErrorHandler.asyncHandler(UsherController.addPaymentMethod));
usherRouter.delete('/profile/payment-methods/:methodId', ...auth, ErrorHandler.asyncHandler(UsherController.deletePaymentMethod));
usherRouter.patch('/profile/payment-methods/:methodId/default', ...auth, ErrorHandler.asyncHandler(UsherController.setDefaultPaymentMethod));

// US-210: View any usher profile by id (shared: usher/admin/organizer)
usherRouter.get('/profile/:id', ...authShared, ErrorHandler.asyncHandler(UsherController.getUsherProfileById));

// US-103: Browse available events (with ?category= and ?city= filters)
usherRouter.get('/events/browse', ...auth, ErrorHandler.asyncHandler(UsherController.browseEvents));

// US-104: Apply to an event (with schema validation)
usherRouter.post('/events/apply', ...auth, ValidationMiddleware.isValid(ApplicationValidator.apply), ErrorHandler.asyncHandler(UsherController.applyToEvent));

// US-105: Track applications (with ?filter=upcoming|past)
usherRouter.get('/applications/my', ...auth, ErrorHandler.asyncHandler(UsherController.getMyApplications));

// US-106: Get event history
usherRouter.get('/events/history', ...auth, ErrorHandler.asyncHandler(UsherController.getMyEventHistory));

// US-107: Excuse from an accepted event
usherRouter.patch('/applications/:applicationId/excuse', ...auth, ErrorHandler.asyncHandler(UsherController.excuseFromEvent));

// US-109: Refer a talent to an event (with schema validation)
usherRouter.post('/refer', ...auth, ValidationMiddleware.isValid(ApplicationValidator.refer), ErrorHandler.asyncHandler(UsherController.referTalent));

// US-109-EXT: Manage incoming referrals
usherRouter.get('/referrals/pending', ...auth, ErrorHandler.asyncHandler(UsherController.getMyPendingReferrals));
usherRouter.patch('/referrals/:referralId/accept', ...auth, ErrorHandler.asyncHandler(UsherController.acceptReferral));
usherRouter.patch('/referrals/:referralId/decline', ...auth, ErrorHandler.asyncHandler(UsherController.declineReferral));

// US-100: Get own profile by id (must be after all /profile/* routes)
usherRouter.get('/:id', ...auth, ErrorHandler.asyncHandler(UsherController.getUsherProfile));

export default usherRouter;
