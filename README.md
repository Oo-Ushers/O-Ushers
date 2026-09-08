# OO-Ushers Backend

Express and PostgreSQL API for the OO-Ushers platform. It supports usher and organizer onboarding, profile-completion restrictions, event operations, applications, direct booking invitations, attendance, ratings, warning records, referrals, staff roles, notifications, and admin approvals.

## Local setup

1. Install dependencies with `npm install`.
2. Create `.env` with the required settings below.
3. Start the API with `npm start`.
4. Open `/health` to verify the server and database, or `/docs` for the API reference.

```env
APP_ENV=dev
PORT=3000
BASE_URL=http://localhost:3000
PG_URI=postgresql://USER:PASSWORD@HOST:5432/DATABASE
PG_SSL=false
JWT_SECRET_KEY=replace-me
EMAIL_USER=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

The database startup is backward-compatible with the earlier schema: it adds the new frontend-alignment columns and staff role values when an existing PostgreSQL database is detected. In development, Sequelize also synchronizes model changes.

## Account access rules

- New usher and organizer accounts can browse immediately, but event actions remain locked until all required profile data is complete.
- Ushers must complete their name, photo, city, phone, work cities, languages, and event categories.
- Organizers must complete their company name, logo, description, location, and phone.
- Organizer staff can use their company workspace, but cannot bypass an incomplete or blocked owner account.
- Public signup only permits usher/talent and organizer/provider accounts. Staff and admin roles must be invited.

Frontend role and field names are accepted alongside the backend names. Examples include `talent`/`usher`, `provider`/`organizer`, `Sports Event`/`sport_event`, `experienceYears`/`experience`, and `phoneNumber`/`mobileNumber`.

The usher API is available under both `/usher` and `/talent`; the organizer API is available under both `/organizer` and `/provider`. Responses retain the backend fields and add frontend-friendly aliases such as `_id`, `providerId`, `photo`, `categories`, and `frontendRole`.

## Verification

```sh
npm test
npm run lint
npm run generate:openapi
```

The automated tests cover frontend aliases, profile locks, protected signup roles, event category compatibility, and pagination behavior.
