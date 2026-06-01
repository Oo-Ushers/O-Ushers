import { Router } from 'express';
import { ErrorHandler } from '../utils/appError.js';
import { AuthMiddleware } from '../middlewares/authentication.js';
import { OrganizerController } from '../controllers/organizer.controller.js';
import { MulterService } from '../utils/multer.cloud.js';

export const organizerRouter = Router();

const auth = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['organizer'])];
const upload = MulterService.cloudUpload();

// US-201: Get own profile
organizerRouter.get('/profile', ...auth, ErrorHandler.asyncHandler(OrganizerController.getMyProfile));

// US-201: Update own profile (companyName, description, location, phone, website)
organizerRouter.put('/profile', ...auth, ErrorHandler.asyncHandler(OrganizerController.updateMyProfile));

// US-202: Upload company logo
organizerRouter.patch('/profile/logo', ...auth, upload.single('logo'), ErrorHandler.asyncHandler(OrganizerController.uploadLogo));

// US-200: Dashboard
organizerRouter.get('/dashboard', ...auth, ErrorHandler.asyncHandler(OrganizerController.getDashboard));

// US-203: Create event
organizerRouter.post('/events', ...auth, ErrorHandler.asyncHandler(OrganizerController.createEvent));

// US-200: Get own events (with ?status= filter)
organizerRouter.get('/events', ...auth, ErrorHandler.asyncHandler(OrganizerController.getMyEvents));

// Get single event detail
organizerRouter.get('/events/:id', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventById));

// Update event
organizerRouter.put('/events/:id', ...auth, ErrorHandler.asyncHandler(OrganizerController.updateEvent));

// US-206: Close event (confirm)
organizerRouter.patch('/events/:id/close', ...auth, ErrorHandler.asyncHandler(OrganizerController.closeEvent));

// US-205: View event applicants
organizerRouter.get('/events/:id/applicants', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventApplicants));

// US-205: Accept / reject applicant
organizerRouter.patch('/applications/:applicationId/status', ...auth, ErrorHandler.asyncHandler(OrganizerController.updateApplicationStatus));

// US-207: Mark attendance
organizerRouter.post('/events/:id/attendance', ...auth, ErrorHandler.asyncHandler(OrganizerController.markAttendance));

// US-208: Review & rate talent
organizerRouter.post('/events/:id/reviews', ...auth, ErrorHandler.asyncHandler(OrganizerController.reviewTalent));

// GET referrals for an event
organizerRouter.get('/events/:id/referrals', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventReferrals));

// US-209: Search talent directory
organizerRouter.get('/talents', ...auth, ErrorHandler.asyncHandler(OrganizerController.searchTalents));

// US-211: Direct book a talent
organizerRouter.post('/direct-book', ...auth, ErrorHandler.asyncHandler(OrganizerController.directBookTalent));

export default organizerRouter;
