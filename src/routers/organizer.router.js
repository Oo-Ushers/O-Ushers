import { Router } from 'express';
import { ErrorHandler } from '../utils/appError.js';
import { AuthMiddleware } from '../middlewares/authentication.js';
import { OrganizerController } from '../controllers/organizer.controller.js';
import { StaffController } from '../controllers/staff.controller.js';
import { MulterService } from '../utils/multer.cloud.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import { EventValidator, ApplicationValidator, AttendanceValidator, ReviewValidator, StaffValidator, SupervisorValidator, EventActionRequestValidator } from '../validators/event.validator.js';
import { OrganizerProfileValidator } from '../validators/user.validator.js';

export const organizerRouter = Router();

const ownerAuth = [AuthMiddleware.isAuthenticated(), AuthMiddleware.isAuthorized(['organizer'])];
const workspaceAuth = [
    AuthMiddleware.isAuthenticated(),
    AuthMiddleware.isAuthorized(['organizer', 'organizer_member', 'organizer_supervisor']),
];
const upload = MulterService.cloudUpload();
const completeProfile = AuthMiddleware.requiresCompleteProfile();

// US-201: Get own profile
organizerRouter.get('/profile', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getMyProfile));

// US-201: Update own profile (companyName, description, city, phone, website)
organizerRouter.put('/profile', ...ownerAuth, ValidationMiddleware.isValid(OrganizerProfileValidator.update), ErrorHandler.asyncHandler(OrganizerController.updateMyProfile));

// US-202: Upload company logo
organizerRouter.patch('/profile/logo', ...ownerAuth, upload.single('logo'), ErrorHandler.asyncHandler(OrganizerController.uploadLogo));

// US-200: Dashboard
organizerRouter.get('/dashboard', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getDashboard));

// US-203: Create event (with schema validation)
organizerRouter.post('/events', ...ownerAuth, completeProfile, ValidationMiddleware.isValid(EventValidator.create), ErrorHandler.asyncHandler(OrganizerController.createEvent));

// US-200: Get own events (with ?status= filter)
organizerRouter.get('/events', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getMyEvents));

// Get single event detail
organizerRouter.get('/events/:id', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getEventById));

// Update event
organizerRouter.put('/events/:id', ...ownerAuth, completeProfile, ValidationMiddleware.isValid(EventValidator.update), ErrorHandler.asyncHandler(OrganizerController.updateEvent));

// Delete own event (also deletes all its applications)
organizerRouter.delete('/events/:id', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(OrganizerController.deleteEvent));

// US-206: Close event (confirm)
organizerRouter.patch('/events/:id/close', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(OrganizerController.closeEvent));

// Assign / remove supervisor from event
organizerRouter.patch('/events/:id/supervisor', ...ownerAuth, completeProfile, ValidationMiddleware.isValid(SupervisorValidator.assign), ErrorHandler.asyncHandler(OrganizerController.assignSupervisor));

// US-205: View event applicants
organizerRouter.get('/events/:id/applicants', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getEventApplicants));

// US-205: Accept / reject applicant (with schema validation)
organizerRouter.patch('/applications/:applicationId/status', ...workspaceAuth, completeProfile, ValidationMiddleware.isValid(ApplicationValidator.updateStatus), ErrorHandler.asyncHandler(OrganizerController.updateApplicationStatus));

// US-207: Mark attendance (with schema validation)
organizerRouter.get('/events/:id/attendance', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getEventAttendance));
organizerRouter.post('/events/:id/attendance', ...workspaceAuth, completeProfile, ValidationMiddleware.isValid(AttendanceValidator.mark), ErrorHandler.asyncHandler(OrganizerController.markAttendance));

// US-208: Review & rate talent (with schema validation)
organizerRouter.get('/events/:id/reviews', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getEventReviews));
organizerRouter.post('/events/:id/reviews', ...workspaceAuth, completeProfile, ValidationMiddleware.isValid(ReviewValidator.create), ErrorHandler.asyncHandler(OrganizerController.reviewTalent));

// GET referrals for an event
organizerRouter.get('/events/:id/referrals', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.getEventReferrals));

// US-209: Search talent directory
organizerRouter.get('/talents', ...workspaceAuth, ErrorHandler.asyncHandler(OrganizerController.searchTalents));

// US-211: Direct book a talent (with schema validation)
organizerRouter.post('/direct-book', ...workspaceAuth, completeProfile, ValidationMiddleware.isValid(ApplicationValidator.directBook), ErrorHandler.asyncHandler(OrganizerController.directBookTalent));

// Confirmed/completed events require admin approval before cancellation or deletion.
organizerRouter.post('/events/:id/action-requests', ...workspaceAuth, completeProfile, ValidationMiddleware.isValid(EventActionRequestValidator.create), ErrorHandler.asyncHandler(OrganizerController.requestEventAction));

organizerRouter.post('/events/:id/whatsapp-group', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(OrganizerController.createWhatsAppGroup));

// ── Staff Management ────────────────────────────────────────────────────────
organizerRouter.get('/staff', ...workspaceAuth, ErrorHandler.asyncHandler(StaffController.getStaffMembers));
organizerRouter.post('/staff', ...ownerAuth, completeProfile, ValidationMiddleware.isValid(StaffValidator.invite), ErrorHandler.asyncHandler(StaffController.inviteStaffMember));
organizerRouter.put('/staff/:id', ...ownerAuth, completeProfile, ValidationMiddleware.isValid(StaffValidator.update), ErrorHandler.asyncHandler(StaffController.updateStaffMember));
organizerRouter.patch('/staff/:id/block', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(StaffController.blockStaffMember));
organizerRouter.patch('/staff/:id/unblock', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(StaffController.unblockStaffMember));
organizerRouter.delete('/staff/:id', ...ownerAuth, completeProfile, ErrorHandler.asyncHandler(StaffController.removeStaffMember));

export default organizerRouter;
