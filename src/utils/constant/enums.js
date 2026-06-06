export const roles = {
  USHER: 'usher',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
};
Object.freeze(roles);

export const status = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  BLOCKED: 'blocked',
};
Object.freeze(status);

export const eventStatus = {
  OPEN: 'open',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};
Object.freeze(eventStatus);

export const applicationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  EXCUSED: 'excused',
};
Object.freeze(applicationStatus);

export const attendanceStatus = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
};
Object.freeze(attendanceStatus);

export const referralStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
};
Object.freeze(referralStatus);

export const genderPreference = {
  MALE: 'male',
  FEMALE: 'female',
  ANY: 'any',
};
Object.freeze(genderPreference);

export const language = {
  ARABIC: 'arabic',
  ENGLISH: 'english',
  FRENCH: 'french',
  SPANISH: 'spanish',
  GERMAN: 'german',
  ITALIAN: 'italian',
};
Object.freeze(language);

export const eventCategories = {
  WEDDING: 'wedding',
  CORPORATE: 'corporate',
  CLUB: 'club',
  FESTIVAL: 'festival',
  PRIVATE_PARTY: 'private_party',
  CONFERENCE: 'conference',
  EXHIBITION: 'exhibition',
  SPORT_EVENT: 'sport_event',
};
Object.freeze(eventCategories);
