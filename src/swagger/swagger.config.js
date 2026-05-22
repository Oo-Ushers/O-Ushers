// ═══════════════════════════════════════════════════════════════════════════
//  OpenAPI 3.0 — Root Specification
//  Single source of truth. No JSDoc parsing — pure programmatic spec.
// ═══════════════════════════════════════════════════════════════════════════

import { schemas }      from './components/schemas.js';
import { healthPaths }  from './paths/health.paths.js';
import { authPaths }    from './paths/auth.paths.js';

export const openApiSpec = {
  openapi: '3.0.3',

  // ── API Information ──────────────────────────────────────────────────
  info: {
    title: 'O-Ushers API',
    version: '1.0.0',
    description:
      'Complete REST API documentation for the **O-Ushers** platform — ' +
      'a service that connects event organizers with professional ushers.\n\n' +
      '## 🔐 Authentication\n' +
      'Most endpoints require a JWT token passed in the `token` header.  \n' +
      'Obtain a token by calling **POST /auth/login**.\n\n' +
      '## ⏱️ Rate Limiting\n' +
      'OTP endpoints enforce a **30-second cooldown** between requests.\n\n' +
      '## 📋 Password Reset Flow\n' +
      '```\n' +
      'POST /auth/forget-password  →  POST /auth/verify-otp  →  POST /auth/reset-password\n' +
      '```',
    contact: { name: 'O-Ushers Support' },
    license: { name: 'ISC' },
  },

  // ── Servers ──────────────────────────────────────────────────────────
  servers: [
    { url: 'http://localhost:3000',          description: 'Local Development' },
    { url: 'https://o-ushers.vercel.app',    description: 'Production (Vercel)' },
  ],

  // ── Tags (control display order) ────────────────────────────────────
  tags: [
    { name: 'Health',                     description: 'Server & database health checks' },
    { name: 'Auth – Registration',        description: 'User signup & email verification' },
    { name: 'Auth – Login',               description: 'User authentication & token generation' },
    { name: 'Auth – Password Recovery',   description: 'Forget password, OTP verification & password reset' },
    { name: 'Users',                      description: 'User management (admin / usher access)' },
  ],

  // ── Paths (merged from modular files) ───────────────────────────────
  paths: {
    ...healthPaths,
    ...authPaths,
  },

  // ── Components ──────────────────────────────────────────────────────
  components: {
    securitySchemes: {
      TokenAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'JWT token returned from the login endpoint. Pass as a header value.',
      },
    },
    schemas,
  },
};
