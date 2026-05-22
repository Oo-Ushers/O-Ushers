// ═══════════════════════════════════════════════════════════════════════════
//  OpenAPI 3.0 — Reusable Component Schemas
// ═══════════════════════════════════════════════════════════════════════════

// ── Enum values (mirrors src/utils/constant/enums.js) ────────────────────
const ROLES = ['usher', 'admin', 'organizer'];
const LANGUAGES = ['arabic', 'english', 'french', 'spanish', 'german', 'italian'];
const EVENT_CATEGORIES = [
  'wedding', 'corporate', 'club', 'festival',
  'private_party', 'conference', 'exhibition', 'sport_event',
];

// ── Shared sub-schemas ───────────────────────────────────────────────────
const PortfolioPicture = {
  type: 'object',
  description: 'Cloudinary image reference',
  properties: {
    secure_url: { type: 'string', format: 'uri', example: 'https://res.cloudinary.com/dvz0zvpof/image/upload/v1727788484/Default_pfp.svg_v7dmtb.png' },
    public_id:  { type: 'string', example: 'default_avatar' },
  },
};

const PortfolioItem = {
  type: 'object',
  properties: {
    title: { type: 'string', example: 'Wedding event – Cairo 2024' },
    url:   { type: 'string', format: 'uri', example: 'https://example.com/portfolio/item-1' },
  },
};

// ── User (public view — sensitive fields excluded) ───────────────────────
const User = {
  type: 'object',
  properties: {
    id:               { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
    fullName:         { type: 'string', example: 'Ahmed Hassan' },
    userName:         { type: 'string', example: 'ahmed_h' },
    email:            { type: 'string', format: 'email', example: 'ahmed@example.com' },
    mobileNumber:     { type: 'string', example: '+201234567890' },
    city:             { type: 'string', example: 'Cairo' },
    role:             { type: 'string', enum: ROLES },
    experience:       { type: 'integer', example: 3 },
    rate:             { type: 'number', format: 'float', example: 4.5 },
    languages:        { type: 'array', items: { type: 'string', enum: LANGUAGES }, example: ['arabic', 'english'] },
    eventCategories:  { type: 'array', items: { type: 'string', enum: EVENT_CATEGORIES }, example: ['wedding', 'corporate'] },
    portfolioPicture: { $ref: '#/components/schemas/PortfolioPicture' },
    portfolio:        { type: 'array', items: { $ref: '#/components/schemas/PortfolioItem' }, nullable: true },
    isEmailVerified:  { type: 'boolean', example: true },
    isVerified:       { type: 'boolean', example: false },
    isPhoneVerified:  { type: 'boolean', example: false },
    createdAt:        { type: 'string', format: 'date-time' },
    updatedAt:        { type: 'string', format: 'date-time' },
  },
};

// ── Request Bodies ───────────────────────────────────────────────────────
const SignupRequest = {
  type: 'object',
  required: ['fullName', 'userName', 'email', 'password', 'mobileNumber', 'city', 'experience', 'role'],
  properties: {
    fullName:         { type: 'string', minLength: 3, maxLength: 50, example: 'Ahmed Hassan' },
    userName:         { type: 'string', minLength: 3, maxLength: 30, example: 'ahmed_h' },
    email:            { type: 'string', format: 'email', example: 'ahmed@example.com' },
    password:         { type: 'string', format: 'password', example: 'SecureP@ss123' },
    mobileNumber:     { type: 'string', pattern: '^(\\+?\\d{1,3}[- ]?)?\\d{10}$', example: '+201234567890' },
    city:             { type: 'string', example: 'Cairo' },
    experience:       { type: 'integer', minimum: 0, example: 3 },
    portfolioPicture: { $ref: '#/components/schemas/PortfolioPicture' },
    role:             { type: 'string', enum: ROLES, example: 'usher' },
    rate:             { type: 'number', minimum: 0, example: 0 },
    languages:        { type: 'array', items: { type: 'string', enum: LANGUAGES }, example: ['arabic', 'english'] },
    eventCategories:  { type: 'array', items: { type: 'string', enum: EVENT_CATEGORIES }, example: ['wedding', 'corporate'] },
    portfolio:        { type: 'array', items: { $ref: '#/components/schemas/PortfolioItem' } },
  },
};

const LoginRequest = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email:    { type: 'string', format: 'email', example: 'ahmed@example.com' },
    password: { type: 'string', format: 'password', example: 'SecureP@ss123' },
  },
};

const ForgetPasswordRequest = {
  type: 'object',
  required: ['email'],
  properties: {
    email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
  },
};

const VerifyOtpRequest = {
  type: 'object',
  required: ['email', 'otp'],
  properties: {
    email: { type: 'string', format: 'email', example: 'ahmed@example.com' },
    otp:   { type: 'string', minLength: 6, maxLength: 6, example: '482910' },
  },
};

const ResetPasswordRequest = {
  type: 'object',
  required: ['email', 'newPassword'],
  properties: {
    email:       { type: 'string', format: 'email', example: 'ahmed@example.com' },
    newPassword: { type: 'string', format: 'password', example: 'NewSecureP@ss456' },
  },
};

// ── Common Response Shapes ───────────────────────────────────────────────
const SuccessMessage = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
  },
};

const ErrorResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string' },
  },
};

// ── Export ────────────────────────────────────────────────────────────────
export const schemas = {
  PortfolioPicture,
  PortfolioItem,
  User,
  SignupRequest,
  LoginRequest,
  ForgetPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,

  SuccessMessage,
  ErrorResponse,
};
