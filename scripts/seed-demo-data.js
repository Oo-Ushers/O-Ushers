import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from '../db/connection.js';
import { User, Event, Application, Attendance, Review } from '../db/index.js';
import { HashService } from '../src/utils/hashAndcompare.js';
import {
  applicationStatus,
  attendanceStatus,
  eventCategories,
  eventStatus,
  genderPreference,
  language,
  roles,
  status,
} from '../src/utils/constant/enums.js';

dotenv.config({ path: path.resolve('./.env') });

const passwordHash = HashService.hashPassword({ password: 'password123' });

const image = (url, publicId) => ({ secure_url: url, public_id: publicId });

const addDays = (days) => {
  const date = new Date();
  date.setUTCHours(9, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

const isoDate = (days) => addDays(days).toISOString().slice(0, 10);

const demoUsers = [
  {
    key: 'admin',
    fullName: 'OO Demo Admin',
    userName: 'oo_demo_admin',
    email: 'admin@usher.com',
    role: roles.ADMIN,
    mobileNumber: '+201000000001',
    city: 'Cairo',
    experience: 0,
    rate: 0,
    languages: [language.ARABIC, language.ENGLISH],
    eventCategories: [],
  },
  {
    key: 'ahmed',
    fullName: 'Ahmed Hassan',
    userName: 'demo_ahmed_hassan',
    email: 'ahmed@talent.com',
    role: roles.USHER,
    mobileNumber: '+201001112233',
    whatsappNumber: '+201001112233',
    city: 'Cairo',
    workCities: ['Cairo', 'Giza', 'New Cairo'],
    experience: 5,
    rate: 4.7,
    totalRatings: 23,
    completedEventsCount: 8,
    reliabilityScore: 92,
    lateExcuseCount: 1,
    consecutiveGoodEvents: 4,
    languages: [language.ARABIC, language.ENGLISH],
    eventCategories: [eventCategories.WEDDING, eventCategories.CORPORATE, eventCategories.CLUB],
    refusedCategories: [],
    availabilityDates: [isoDate(3), isoDate(6), isoDate(10), isoDate(15)],
    paymentMethods: [
      { _id: 'pm-demo-ahmed-vf', provider: 'Vodafone Cash', numberOrDetail: '+201001112233', isDefault: true, type: 'wallet' },
      { _id: 'pm-demo-ahmed-ip', provider: 'InstaPay', numberOrDetail: '+201001112233', isDefault: false, type: 'wallet' },
    ],
    portfolioPicture: image('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'demo_ahmed_profile'),
    portfolio: [
      image('https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'demo_ahmed_wedding'),
      image('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'demo_ahmed_conference'),
    ],
  },
  {
    key: 'nour',
    fullName: 'Nour El-Din',
    userName: 'demo_nour_eldin',
    email: 'nour@talent.com',
    role: roles.USHER,
    mobileNumber: '+201002223344',
    whatsappNumber: '+201002223344',
    city: 'New Cairo',
    workCities: ['all'],
    experience: 3,
    rate: 4.5,
    totalRatings: 15,
    completedEventsCount: 5,
    reliabilityScore: 88,
    lateExcuseCount: 0,
    consecutiveGoodEvents: 3,
    languages: [language.ARABIC, language.ENGLISH, language.FRENCH],
    eventCategories: [eventCategories.CORPORATE, eventCategories.CONFERENCE, eventCategories.EXHIBITION],
    refusedCategories: [eventCategories.CLUB],
    availabilityDates: [isoDate(2), isoDate(7), isoDate(12), isoDate(18)],
    paymentMethods: [
      { _id: 'pm-demo-nour-vf', provider: 'Orange Cash', numberOrDetail: '+201002223344', isDefault: true, type: 'wallet' },
    ],
    portfolioPicture: image('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', 'demo_nour_profile'),
    portfolio: [
      image('https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800', 'demo_nour_exhibition'),
      image('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', 'demo_nour_stage'),
    ],
  },
  {
    key: 'omar',
    fullName: 'Omar Farouk',
    userName: 'demo_omar_farouk',
    email: 'omar@talent.com',
    role: roles.USHER,
    mobileNumber: '+201003334455',
    whatsappNumber: '+201003334455',
    city: 'Alexandria',
    workCities: ['Alexandria', 'El Alamein', 'Cairo'],
    experience: 7,
    rate: 4.9,
    totalRatings: 31,
    completedEventsCount: 12,
    reliabilityScore: 95,
    lateExcuseCount: 0,
    consecutiveGoodEvents: 8,
    languages: [language.ARABIC, language.ENGLISH, language.ITALIAN],
    eventCategories: [eventCategories.WEDDING, eventCategories.FESTIVAL, eventCategories.PRIVATE_PARTY],
    refusedCategories: [eventCategories.CORPORATE],
    availabilityDates: [isoDate(1), isoDate(4), isoDate(11), isoDate(20)],
    paymentMethods: [
      { _id: 'pm-demo-omar-ip', provider: 'InstaPay', numberOrDetail: '+201003334455', isDefault: true, type: 'wallet' },
    ],
    portfolioPicture: image('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'demo_omar_profile'),
    portfolio: [
      image('https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800', 'demo_omar_festival'),
      image('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 'demo_omar_event'),
    ],
  },
  {
    key: 'pyramid',
    fullName: 'Pyramid Events',
    userName: 'demo_pyramid_events',
    email: 'events@pyramidevents.com',
    role: roles.ORGANIZER,
    mobileNumber: '+201005550101',
    city: 'Cairo',
    experience: 0,
    rate: 0,
    languages: [language.ARABIC, language.ENGLISH],
    eventCategories: [eventCategories.CORPORATE, eventCategories.WEDDING, eventCategories.EXHIBITION],
    organizationInfo: {
      description: 'Premium event management team for launches, exhibitions, weddings, and VIP programs across Egypt.',
      website: 'https://pyramidevents.example',
    },
    portfolioPicture: image('https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop', 'demo_pyramid_logo'),
  },
  {
    key: 'nile',
    fullName: 'Nile Venue Events',
    userName: 'demo_nile_venue',
    email: 'info@nilevenue.com',
    role: roles.ORGANIZER,
    mobileNumber: '+201005550202',
    city: 'Giza',
    experience: 0,
    rate: 0,
    languages: [language.ARABIC, language.ENGLISH],
    eventCategories: [eventCategories.CONFERENCE, eventCategories.PRIVATE_PARTY, eventCategories.FESTIVAL],
    organizationInfo: {
      description: 'Venue and event operations company handling guest flow, registration, and hospitality staffing.',
      website: 'https://nilevenue.example',
    },
    portfolioPicture: image('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop', 'demo_nile_logo'),
  },
];

const buildEvents = (usersByKey) => [
  {
    key: 'tech-summit',
    organizerId: usersByKey.pyramid.id,
    title: `Cairo Tech Summit ${new Date().getFullYear()}`,
    category: eventCategories.CORPORATE,
    eventDate: addDays(9),
    applicationDeadline: addDays(5),
    startTime: '09:00',
    endTime: '18:00',
    location: 'Cairo International Convention Centre',
    gatheringLocation: 'Gate 4 registration desk',
    requiredCount: 8,
    genderPreference: genderPreference.ANY,
    specifyGenders: false,
    budget: 24000,
    dressCode: 'Black suit, white shirt, formal shoes',
    notes: 'Registration support, badge scanning, and VIP room direction. English is required.',
    status: eventStatus.OPEN,
    hiredKeys: ['ahmed'],
    whatsappGroupLink: 'https://chat.whatsapp.com/demo-cairo-tech-summit',
  },
  {
    key: 'north-coast-launch',
    organizerId: usersByKey.pyramid.id,
    title: 'North Coast Summer Launch',
    category: eventCategories.EXHIBITION,
    eventDate: addDays(17),
    applicationDeadline: addDays(10),
    startTime: '14:00',
    endTime: '22:00',
    location: 'Marassi, North Coast',
    gatheringLocation: 'Main brand booth',
    requiredCount: 12,
    genderPreference: genderPreference.ANY,
    specifyGenders: false,
    budget: 36000,
    dressCode: 'Provided branded polo and black trousers',
    notes: 'Outdoor product launch with high guest traffic.',
    status: eventStatus.OPEN,
    hiredKeys: [],
  },
  {
    key: 'gala',
    organizerId: usersByKey.nile.id,
    title: 'Nile Business Gala Dinner',
    category: eventCategories.CONFERENCE,
    eventDate: addDays(4),
    applicationDeadline: addDays(1),
    startTime: '18:00',
    endTime: '23:30',
    location: 'The Nile Ritz-Carlton, Cairo',
    gatheringLocation: 'Lobby staircase',
    requiredCount: 6,
    genderPreference: genderPreference.ANY,
    specifyGenders: false,
    budget: 21000,
    dressCode: 'Black tie',
    notes: 'VIP seating and reception desk support.',
    status: eventStatus.CONFIRMED,
    hiredKeys: ['nour', 'omar'],
  },
  {
    key: 'alex-wedding',
    organizerId: usersByKey.nile.id,
    title: 'Alexandria Seaside Wedding',
    category: eventCategories.WEDDING,
    eventDate: addDays(-8),
    applicationDeadline: addDays(-14),
    startTime: '16:00',
    endTime: '23:00',
    location: 'Royal Jewelry Museum Garden, Alexandria',
    gatheringLocation: 'Main entrance',
    requiredCount: 5,
    genderPreference: genderPreference.ANY,
    specifyGenders: false,
    budget: 17500,
    dressCode: 'All black formal',
    notes: 'Completed demo event for attendance and review testing.',
    status: eventStatus.COMPLETED,
    hiredKeys: ['ahmed', 'nour', 'omar'],
  },
];

const upsertUser = async (data, transaction) => {
  const [user] = await User.findOrCreate({
    where: { email: data.email },
    defaults: {
      ...data,
      password: passwordHash,
      isEmailVerified: true,
      isVerified: true,
      isBlocked: false,
      status: status.VERIFIED,
      whatsappConsentGiven: false,
      whatsappConsentGivenAt: null,
    },
    transaction,
  });

  await user.update({
    ...data,
    password: passwordHash,
    isEmailVerified: true,
    isVerified: true,
    isBlocked: false,
    status: status.VERIFIED,
    whatsappConsentGiven: false,
    whatsappConsentGivenAt: null,
  }, { transaction });

  return user;
};

const upsertEvent = async (data, usersByKey, transaction) => {
  const hiredTalents = data.hiredKeys.map((key) => usersByKey[key].id);
  const payload = { ...data, hiredTalents };
  delete payload.key;
  delete payload.hiredKeys;

  const [event] = await Event.findOrCreate({
    where: { title: data.title },
    defaults: payload,
    transaction,
  });

  await event.update(payload, { transaction });
  return event;
};

const upsertApplication = async ({ event, talent, status: appStatus, isDirect = false, appliedAt }, transaction) => {
  const [application] = await Application.findOrCreate({
    where: { eventId: event.id, talentId: talent.id },
    defaults: { status: appStatus, isDirect, appliedAt },
    transaction,
  });
  await application.update({ status: appStatus, isDirect, appliedAt }, { transaction });
  return application;
};

const upsertAttendance = async ({ event, talent, status: currentStatus, checkInTime, checkOutTime }, transaction) => {
  const [attendance] = await Attendance.findOrCreate({
    where: { eventId: event.id, talentId: talent.id },
    defaults: { status: currentStatus, checkInTime, checkOutTime },
    transaction,
  });
  await attendance.update({ status: currentStatus, checkInTime, checkOutTime }, { transaction });
  return attendance;
};

const upsertReview = async ({ event, reviewer, reviewed, rating, comment }, transaction) => {
  const [review] = await Review.findOrCreate({
    where: { eventId: event.id, reviewerId: reviewer.id, reviewedUserId: reviewed.id },
    defaults: { rating, comment },
    transaction,
  });
  await review.update({ rating, comment }, { transaction });
  return review;
};

const seed = async () => {
  await sequelize.authenticate();
  await import('../db/index.js');
  await sequelize.sync();

  const transaction = await sequelize.transaction();
  try {
    const usersByKey = {};
    for (const userData of demoUsers) {
      const { key, ...data } = userData;
      usersByKey[key] = await upsertUser(data, transaction);
    }

    const eventsByKey = {};
    for (const eventData of buildEvents(usersByKey)) {
      eventsByKey[eventData.key] = await upsertEvent(eventData, usersByKey, transaction);
    }

    await upsertApplication({
      event: eventsByKey['tech-summit'],
      talent: usersByKey.ahmed,
      status: applicationStatus.ACCEPTED,
      isDirect: false,
      appliedAt: addDays(-2),
    }, transaction);
    await upsertApplication({
      event: eventsByKey['tech-summit'],
      talent: usersByKey.nour,
      status: applicationStatus.PENDING,
      isDirect: false,
      appliedAt: addDays(-1),
    }, transaction);
    await upsertApplication({
      event: eventsByKey['north-coast-launch'],
      talent: usersByKey.omar,
      status: applicationStatus.PENDING,
      isDirect: false,
      appliedAt: addDays(-1),
    }, transaction);
    await upsertApplication({
      event: eventsByKey.gala,
      talent: usersByKey.nour,
      status: applicationStatus.ACCEPTED,
      isDirect: true,
      appliedAt: addDays(-4),
    }, transaction);
    await upsertApplication({
      event: eventsByKey.gala,
      talent: usersByKey.omar,
      status: applicationStatus.ACCEPTED,
      isDirect: true,
      appliedAt: addDays(-4),
    }, transaction);

    for (const talentKey of ['ahmed', 'nour', 'omar']) {
      const talent = usersByKey[talentKey];
      await upsertApplication({
        event: eventsByKey['alex-wedding'],
        talent,
        status: applicationStatus.ACCEPTED,
        isDirect: talentKey === 'omar',
        appliedAt: addDays(-18),
      }, transaction);
      await upsertAttendance({
        event: eventsByKey['alex-wedding'],
        talent,
        status: talentKey === 'nour' ? attendanceStatus.LATE : attendanceStatus.PRESENT,
        checkInTime: addDays(-8),
        checkOutTime: addDays(-8),
      }, transaction);
      await upsertReview({
        event: eventsByKey['alex-wedding'],
        reviewer: usersByKey.nile,
        reviewed: talent,
        rating: talentKey === 'omar' ? 5 : 4,
        comment: talentKey === 'nour'
          ? 'Handled a late arrival professionally and stayed through checkout.'
          : 'Reliable, polished, and easy to brief on site.',
      }, transaction);
    }

    await transaction.commit();
    console.log('Demo data seeded successfully.');
    console.log('Login password for all demo accounts: password123');
    console.table(demoUsers.map(({ email, role, fullName }) => ({ email, role, name: fullName })));
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await sequelize.close();
  }
};

seed().catch((error) => {
  console.error('Failed to seed demo data:', error);
  process.exitCode = 1;
});
