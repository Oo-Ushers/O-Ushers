import { Router } from 'express';
import { ErrorHandler } from '../utils/appError.js';
import { AuthMiddleware } from '../middlewares/authentication.js';
import { UsherController } from '../controllers/usher.controller.js';
import { MulterService } from '../utils/multer.cloud.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import { ApplicationValidator } from '../validators/event.validator.js';

export const usherRouter = Router();

const auth = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher'])];
const authShared = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['usher', 'admin', 'organizer'])];
const upload = MulterService.cloudUpload();

// US-101: Update own profile (text fields)
usherRouter.put('/profile/update', ...auth, ErrorHandler.asyncHandler(UsherController.updateProfile));

// US-102: Upload / change profile picture
usherRouter.patch('/profile/picture', ...auth, upload.single('picture'), ErrorHandler.asyncHandler(UsherController.uploadProfilePicture));

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

// US-100: Get own profile by id (must be after /profile/:id to avoid conflict)
usherRouter.get('/:id', ...auth, ErrorHandler.asyncHandler(UsherController.getUsherProfile));

export default usherRouter;
