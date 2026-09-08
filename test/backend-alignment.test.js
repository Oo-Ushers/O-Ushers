import test from 'node:test';
import assert from 'node:assert/strict';
import { getMissingProfileFields, isProfileComplete } from '../src/utils/profileCompletion.js';
import {
  normalizeEventCategory,
  normalizeLanguage,
  normalizeRole,
} from '../src/utils/normalization.js';
import { EventValidator } from '../src/validators/event.validator.js';
import { UserValidator } from '../src/validators/user.validator.js';
import { ApiFeature } from '../src/utils/apiFeature.js';

test('frontend role aliases map to backend roles', () => {
  assert.equal(normalizeRole('talent'), 'usher');
  assert.equal(normalizeRole('provider'), 'organizer');
  assert.equal(normalizeRole('provider_member'), 'organizer_member');
  assert.equal(normalizeRole('provider_supervisor'), 'organizer_supervisor');
});

test('frontend event and language labels normalize safely', () => {
  assert.equal(normalizeEventCategory('Private Party'), 'private_party');
  assert.equal(normalizeEventCategory('Sports Event'), 'sport_event');
  assert.equal(normalizeLanguage('Chinese (Mandarin)'), 'chinese_mandarin');
  assert.equal(normalizeLanguage('Arabic'), 'arabic');
  assert.equal(normalizeEventCategory('Unknown category'), null);
});

test('usher profile completion matches required frontend fields', () => {
  const usher = {
    role: 'usher',
    fullName: 'Ahmed Ali',
    portfolioPicture: { secure_url: 'https://example.com/photo.jpg', public_id: 'photo_1' },
    city: 'Cairo',
    mobileNumber: '+201001234567',
    workCities: ['Cairo'],
    languages: ['arabic'],
    eventCategories: ['conference'],
  };
  assert.equal(isProfileComplete(usher), true);
  assert.deepEqual(getMissingProfileFields({ ...usher, workCities: [] }), ['workCities']);
});

test('organizer profile completion requires company identity and contact details', () => {
  const organizer = {
    role: 'organizer',
    fullName: 'OO Events',
    portfolioPicture: { secure_url: 'https://example.com/logo.png', public_id: 'logo_1' },
    organizationInfo: { description: 'Event organizer' },
    city: 'Cairo',
    mobileNumber: '+201001234567',
  };
  assert.equal(isProfileComplete(organizer), true);
  assert.deepEqual(getMissingProfileFields({ ...organizer, mobileNumber: null }), ['phone']);
});

test('public signup rejects privileged roles', () => {
  const base = { email: 'user@example.com', password: 'password123' };
  assert.equal(UserValidator.signup.validate({ ...base, role: 'talent' }).error, undefined);
  assert.ok(UserValidator.signup.validate({ ...base, role: 'admin' }).error);
  assert.ok(UserValidator.signup.validate({ ...base, role: 'provider_member' }).error);
});

test('event validation accepts frontend display categories', () => {
  const payload = {
    title: 'Conference Event',
    category: 'Sports Event',
    eventDate: '2030-03-10',
    applicationDeadline: '2030-03-08',
    startTime: '10:00',
    endTime: '18:00',
    location: 'Cairo',
    requiredCount: 10,
    genderPreference: 'any',
    budget: 500,
  };
  assert.equal(EventValidator.create.validate(payload).error, undefined);
});

test('pagination supports the frontend limit parameter and caps large pages', () => {
  const normal = new ApiFeature({ page: '2', limit: '25' }).pagination().build();
  assert.equal(normal.limit, 25);
  assert.equal(normal.offset, 25);

  const capped = new ApiFeature({ limit: '1000' }).pagination().build();
  assert.equal(capped.limit, 100);
});

test('all frontend-alignment route groups are registered', async () => {
  process.env.PG_URI ||= 'postgresql://user:pass@127.0.0.1:5432/route_contract_test';
  process.env.JWT_SECRET_KEY ||= 'route-contract-test';
  const routers = await import('../src/index.js');
  const routes = new Set();

  for (const [routerName, router] of Object.entries(routers)) {
    for (const layer of router.stack) {
      if (!layer.route) continue;
      for (const method of Object.keys(layer.route.methods)) {
        routes.add(`${routerName}:${method.toUpperCase()} ${layer.route.path}`);
      }
    }
  }

  assert.equal(routes.size, 76);
  assert.ok(routes.has('organizerRouter:GET /events/:id/attendance'));
  assert.ok(routes.has('organizerRouter:POST /events/:id/action-requests'));
  assert.ok(routes.has('adminRouter:PATCH /event-action-requests/:id'));
  assert.ok(routes.has('notificationRouter:PATCH /read-all'));
  assert.ok(routes.has('usherRouter:GET /profile/:id/reviews'));

  const { User, Event } = await import('../db/index.js');
  const userJson = User.build({
    id: '7de9086a-aa5c-4aa9-af63-0fd1facb3f10',
    role: 'usher',
    portfolioPicture: { secure_url: 'https://example.com/photo.jpg', public_id: 'photo' },
    experience: 3,
    eventCategories: ['conference'],
    rate: 4.5,
  }).toJSON();
  assert.equal(userJson._id, userJson.id);
  assert.equal(userJson.frontendRole, 'talent');
  assert.equal(userJson.photo, 'https://example.com/photo.jpg');
  assert.deepEqual(userJson.categories, ['conference']);

  const eventJson = Event.build({
    id: '43575802-c57f-451a-b3ed-086b55f90d4c',
    organizerId: 'e31b7076-6ba3-499f-bbf4-561152bef806',
  }).toJSON();
  assert.equal(eventJson._id, eventJson.id);
  assert.equal(eventJson.providerId, eventJson.organizerId);
});
