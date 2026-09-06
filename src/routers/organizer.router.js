import { Router } from 'express';
import { ErrorHandler } from '../utils/appError.js';
import { AuthMiddleware } from '../middlewares/authentication.js';
import { OrganizerController } from '../controllers/organizer.controller.js';
import { StaffController } from '../controllers/staff.controller.js';
import { MulterService } from '../utils/multer.cloud.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import { EventValidator, ApplicationValidator, AttendanceValidator, ReviewValidator, StaffValidator } from '../validators/event.validator.js';

export const organizerRouter = Router();

const auth = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['organizer'])];
const upload = MulterService.cloudUpload();

// US-201: Get own profile
organizerRouter.get('/profile', ...auth, ErrorHandler.asyncHandler(OrganizerController.getMyProfile));

// US-201: Update own profile (companyName, description, city, phone, website)
organizerRouter.put('/profile', ...auth, ErrorHandler.asyncHandler(OrganizerController.updateMyProfile));

// US-202: Upload company logo
organizerRouter.patch('/profile/logo', ...auth, upload.single('logo'), ErrorHandler.asyncHandler(OrganizerController.uploadLogo));

// US-200: Dashboard
organizerRouter.get('/dashboard', ...auth, ErrorHandler.asyncHandler(OrganizerController.getDashboard));

// US-203: Create event (with schema validation)
organizerRouter.post('/events', ...auth, ValidationMiddleware.isValid(EventValidator.create), ErrorHandler.asyncHandler(OrganizerController.createEvent));

// US-200: Get own events (with ?status= filter)
organizerRouter.get('/events', ...auth, ErrorHandler.asyncHandler(OrganizerController.getMyEvents));

// Get single event detail
organizerRouter.get('/events/:id', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventById));

// Update event
organizerRouter.put('/events/:id', ...auth, ErrorHandler.asyncHandler(OrganizerController.updateEvent));

// Delete own event (also deletes all its applications)
organizerRouter.delete('/events/:id', ...auth, ErrorHandler.asyncHandler(OrganizerController.deleteEvent));

// US-206: Close event (confirm)
organizerRouter.patch('/events/:id/close', ...auth, ErrorHandler.asyncHandler(OrganizerController.closeEvent));

// Assign / remove supervisor from event
organizerRouter.patch('/events/:id/supervisor', ...auth, ErrorHandler.asyncHandler(OrganizerController.assignSupervisor));

// US-205: View event applicants
organizerRouter.get('/events/:id/applicants', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventApplicants));

// US-205: Accept / reject applicant (with schema validation)
organizerRouter.patch('/applications/:applicationId/status', ...auth, ValidationMiddleware.isValid(ApplicationValidator.updateStatus), ErrorHandler.asyncHandler(OrganizerController.updateApplicationStatus));

// US-207: Mark attendance (with schema validation)
organizerRouter.post('/events/:id/attendance', ...auth, ValidationMiddleware.isValid(AttendanceValidator.mark), ErrorHandler.asyncHandler(OrganizerController.markAttendance));

// US-208: Review & rate talent (with schema validation)
organizerRouter.post('/events/:id/reviews', ...auth, ValidationMiddleware.isValid(ReviewValidator.create), ErrorHandler.asyncHandler(OrganizerController.reviewTalent));

// GET referrals for an event
organizerRouter.get('/events/:id/referrals', ...auth, ErrorHandler.asyncHandler(OrganizerController.getEventReferrals));

// US-209: Search talent directory
organizerRouter.get('/talents', ...auth, ErrorHandler.asyncHandler(OrganizerController.searchTalents));

// US-211: Direct book a talent (with schema validation)
organizerRouter.post('/direct-book', ...auth, ValidationMiddleware.isValid(ApplicationValidator.directBook), ErrorHandler.asyncHandler(OrganizerController.directBookTalent));

// ── Staff Management ────────────────────────────────────────────────────────
organizerRouter.get('/staff', ...auth, ErrorHandler.asyncHandler(StaffController.getStaffMembers));
organizerRouter.post('/staff', ...auth, ValidationMiddleware.isValid(StaffValidator.invite), ErrorHandler.asyncHandler(StaffController.inviteStaffMember));
organizerRouter.put('/staff/:id', ...auth, ValidationMiddleware.isValid(StaffValidator.update), ErrorHandler.asyncHandler(StaffController.updateStaffMember));
organizerRouter.patch('/staff/:id/block', ...auth, ErrorHandler.asyncHandler(StaffController.blockStaffMember));
organizerRouter.patch('/staff/:id/unblock', ...auth, ErrorHandler.asyncHandler(StaffController.unblockStaffMember));
organizerRouter.delete('/staff/:id', ...auth, ErrorHandler.asyncHandler(StaffController.removeStaffMember));

export default organizerRouter;
