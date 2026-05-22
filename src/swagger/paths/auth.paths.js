// ═══════════════════════════════════════════════════════════════════════════
//  OpenAPI 3.0 — Path Definitions: Auth (signup, login, password recovery)
// ═══════════════════════════════════════════════════════════════════════════

const err = (schema = { $ref: '#/components/schemas/ErrorResponse' }) => schema;

export const authPaths = {

  // ── Signup ─────────────────────────────────────────────────────────────
  '/auth/signup': {
    post: {
      tags: ['Auth – Registration'],
      summary: 'Register a new user',
      operationId: 'signup',
      description:
        'Creates a new user account and sends a **verification email** with a confirmation link.\n' +
        'The user must verify their email before logging in.\n\n' +
        '### Validation Rules\n' +
        '| Field | Rule |\n' +
        '|---|---|\n' +
        '| `fullName` | 3–50 characters |\n' +
        '| `userName` | 3–30 characters, unique |\n' +
        '| `email` | Valid email, unique |\n' +
        '| `password` | Required |\n' +
        '| `mobileNumber` | Pattern: `(+country)XXXXXXXXXX` |\n' +
        '| `role` | `usher` · `admin` · `organizer` |\n' +
        '| `experience` | Integer ≥ 0 |\n' +
        '| `languages` | arabic, english, french, spanish, german, italian |\n' +
        '| `eventCategories` | wedding, corporate, club, festival, etc. |',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SignupRequest' },
            examples: {
              usher_full: {
                summary: 'Usher registration (full)',
                value: {
                  fullName: 'Ahmed Hassan', userName: 'ahmed_h',
                  email: 'ahmed@example.com', password: 'SecureP@ss123',
                  mobileNumber: '+201234567890', city: 'Cairo',
                  experience: 3, role: 'usher', rate: 4.5,
                  languages: ['arabic', 'english'],
                  eventCategories: ['wedding', 'corporate'],
                  portfolio: [{ title: 'Wedding event – Cairo 2024', url: 'https://example.com/portfolio/item-1' }],
                },
              },
              organizer_minimal: {
                summary: 'Organizer registration (minimal)',
                value: {
                  fullName: 'Sara Ali', userName: 'sara_organizer',
                  email: 'sara@events.com', password: 'OrgP@ss789',
                  mobileNumber: '+201098765432', city: 'Alexandria',
                  experience: 5, role: 'organizer',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'User created — verification email sent',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data:    { $ref: '#/components/schemas/User' },
                },
              },
              example: {
                success: true, message: 'user created successfully',
                data: {
                  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  fullName: 'Ahmed Hassan', userName: 'ahmed_h',
                  email: 'ahmed@example.com', mobileNumber: '+201234567890',
                  city: 'Cairo', role: 'usher', experience: 3, rate: 4.5,
                  languages: ['arabic', 'english'],
                  eventCategories: ['wedding', 'corporate'],
                  isEmailVerified: false, isVerified: false, isPhoneVerified: false,
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error or user already exists',
          content: {
            'application/json': {
              schema: err(),
              examples: {
                duplicate: { summary: 'Duplicate email', value: { success: false, message: 'user already exist' } },
                validation: { summary: 'Validation failed', value: { success: false, message: '"fullName" length must be at least 3 characters long' } },
              },
            },
          },
        },
      },
    },
  },

  // ── Login ──────────────────────────────────────────────────────────────
  '/auth/login': {
    post: {
      tags: ['Auth – Login'],
      summary: 'Log in & obtain a JWT token',
      operationId: 'login',
      description:
        'Authenticates a user with email and password. Returns a JWT token that must be included in the `token` header for protected endpoints.\n\n' +
        '**Prerequisites:** User must have a verified email (`isEmailVerified: true`).\n\n' +
        '**Token Usage:** Include the returned token in the request header:\n```\ntoken: <jwt_token_value>\n```',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
            example: { email: 'ahmed@example.com', password: 'SecureP@ss123' },
          },
        },
      },
      responses: {
        200: {
          description: 'Login successful — token issued',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  role:    { type: 'string', enum: ['usher', 'admin', 'organizer'] },
                  data: {
                    type: 'object',
                    properties: { token: { type: 'string' } },
                  },
                },
              },
              example: {
                success: true, message: 'login successfully', role: 'usher',
                data: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              },
            },
          },
        },
        401: {
          description: 'Invalid credentials or unverified email',
          content: {
            'application/json': {
              schema: err(),
              examples: {
                bad_password:  { summary: 'Wrong password',       value: { success: false, message: 'invalid creadintials' } },
                not_verified:  { summary: 'Email not verified',   value: { success: false, message: 'user not verified' } },
              },
            },
          },
        },
        404: {
          description: 'User not found',
          content: { 'application/json': { schema: err(), example: { success: false, message: 'user not found' } } },
        },
      },
    },
  },

  // ── Forget Password ────────────────────────────────────────────────────
  '/auth/forget-password': {
    post: {
      tags: ['Auth – Password Recovery'],
      summary: 'Request a password-reset OTP',
      operationId: 'forgetPassword',
      description:
        'Sends a **6-digit OTP** to the user\'s registered email address.\n\n' +
        '### Flow\n' +
        '1. Call this endpoint with the user\'s email.\n' +
        '2. User receives the OTP via email.\n' +
        '3. Submit the OTP via `POST /auth/verify-otp`.\n' +
        '4. Reset the password via `POST /auth/reset-password`.\n\n' +
        '**Rate Limiting:** 30-second cooldown.  **OTP Expiry:** 15 minutes.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ForgetPasswordRequest' },
            example: { email: 'ahmed@example.com' },
          },
        },
      },
      responses: {
        200: { description: 'OTP sent to email', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' }, example: { success: true, message: 'Check your email for the OTP' } } } },
        404: { description: 'User not found',    content: { 'application/json': { schema: err(), example: { success: false, message: 'user not found' } } } },
        429: { description: 'Rate limit — OTP requested too soon', content: { 'application/json': { schema: err(), example: { success: false, message: 'Please wait 25 seconds before requesting a new OTP' } } } },
        500: { description: 'Email delivery failed',               content: { 'application/json': { schema: err(), example: { success: false, message: 'Failed to send email' } } } },
      },
    },
  },

  // ── Verify OTP ─────────────────────────────────────────────────────────
  '/auth/verify-otp': {
    post: {
      tags: ['Auth – Password Recovery'],
      summary: 'Verify a password-reset OTP',
      operationId: 'verifyOtp',
      description:
        'Validates the 6-digit OTP sent to the user\'s email.\n\n' +
        '- **Correct OTP** → marks user as OTP-verified for password reset.\n' +
        '- **Wrong OTP** → decrements remaining attempts (max **3**).\n' +
        '- **Expired OTP** → automatically sends a **new OTP** (30s cooldown).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/VerifyOtpRequest' },
            example: { email: 'ahmed@example.com', otp: '482910' },
          },
        },
      },
      responses: {
        200: {
          description: 'OTP verified or new OTP auto-sent',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessMessage' },
              examples: {
                verified: { summary: 'OTP correct',         value: { success: true, message: 'OTP verified successfully' } },
                resent:   { summary: 'Expired — new OTP sent', value: { success: true, message: 'Previous OTP expired or invalid. A new OTP has been sent to your email' } },
              },
            },
          },
        },
        401: { description: 'Wrong OTP (attempts remaining)',  content: { 'application/json': { schema: err(), example: { success: false, message: 'Invalid OTP. You have 2 attempts left' } } } },
        403: { description: 'Max attempts exceeded',           content: { 'application/json': { schema: err(), example: { success: false, message: 'Maximum OTP attempts exceeded. Please request a new OTP.' } } } },
        404: { description: 'User not found',                  content: { 'application/json': { schema: err(), example: { success: false, message: 'user not found' } } } },
        429: { description: 'Rate limit — too soon to resend', content: { 'application/json': { schema: err(), example: { success: false, message: 'Please wait 20 seconds before requesting a new OTP' } } } },
      },
    },
  },

  // ── Reset Password ─────────────────────────────────────────────────────
  '/auth/reset-password': {
    post: {
      tags: ['Auth – Password Recovery'],
      summary: 'Set a new password',
      operationId: 'resetPassword',
      description:
        'Resets the user\'s password after successful OTP verification.\n\n' +
        '**Prerequisites:** The user must have a verified OTP first.\n' +
        'Complete the flow: `forget-password` → `verify-otp` → `reset-password`.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ResetPasswordRequest' },
            example: { email: 'ahmed@example.com', newPassword: 'NewSecureP@ss456' },
          },
        },
      },
      responses: {
        200: { description: 'Password updated',    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessMessage' }, example: { success: true, message: 'Password updated successfully' } } } },
        403: { description: 'OTP not verified yet', content: { 'application/json': { schema: err(), example: { success: false, message: 'OTP verification required before resetting password.' } } } },
        404: { description: 'User not found',       content: { 'application/json': { schema: err(), example: { success: false, message: 'user not found' } } } },
      },
    },
  },

  // ── Get All Users ──────────────────────────────────────────────────────
  '/auth/users': {
    get: {
      tags: ['Users'],
      summary: 'Get all users',
      operationId: 'getAllUsers',
      description:
        'Returns a list of all registered users ordered by most recent first.\n' +
        'Sensitive fields (password, OTP data) are excluded.\n\n' +
        '**Authorization:** Requires JWT token + **usher** role.',
      security: [{ TokenAuth: [] }],
      responses: {
        200: {
          description: 'Users list retrieved',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Users fetched successfully' },
                  data:    { type: 'array', items: { $ref: '#/components/schemas/User' } },
                },
              },
              example: {
                success: true, message: 'Users fetched successfully',
                data: [{
                  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                  fullName: 'Ahmed Hassan', userName: 'ahmed_h',
                  email: 'ahmed@example.com', mobileNumber: '+201234567890',
                  city: 'Cairo', role: 'usher', experience: 3, rate: 4.5,
                  languages: ['arabic', 'english'],
                  eventCategories: ['wedding', 'corporate'],
                  isEmailVerified: true, isVerified: false, isPhoneVerified: true,
                  createdAt: '2026-05-22T16:30:00.000Z', updatedAt: '2026-05-22T16:30:00.000Z',
                }],
              },
            },
          },
        },
        401: {
          description: 'Not authenticated or not authorized',
          content: {
            'application/json': {
              schema: err(),
              examples: {
                no_token:       { summary: 'Missing token',  value: { success: false, message: 'Token Required' } },
                bad_token:      { summary: 'Invalid token',  value: { success: false, message: 'Authentication Failed' } },
                not_authorized: { summary: 'Wrong role',     value: { success: false, message: 'not authorized' } },
              },
            },
          },
        },
      },
    },
  },
};
