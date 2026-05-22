// ═══════════════════════════════════════════════════════════════════════════
//  OpenAPI 3.0 — Path Definitions: Health & Email Verification
// ═══════════════════════════════════════════════════════════════════════════

export const healthPaths = {
  '/health': {
    get: {
      tags: ['Health'],
      summary: 'Health check',
      operationId: 'healthCheck',
      description:
        'Returns the liveness status of the **Express server** and the **PostgreSQL database** connection.\n' +
        'Useful for monitoring dashboards and deployment readiness probes.',
      responses: {
        200: {
          description: 'Health status (server is always `true` when reachable)',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  server:   { type: 'boolean', example: true },
                  database: { type: 'boolean', example: true },
                },
              },
              examples: {
                healthy: {
                  summary: 'Both server & DB healthy',
                  value: { server: true, database: true },
                },
                db_down: {
                  summary: 'Server up, DB unreachable',
                  value: { server: true, database: false },
                },
              },
            },
          },
        },
      },
    },
  },

  '/verify/{token}': {
    get: {
      tags: ['Auth – Registration'],
      summary: 'Verify email address',
      operationId: 'verifyEmail',
      description:
        "Verifies a user's email using a JWT token sent via the confirmation email.\n" +
        'Returns an **HTML page** (not JSON). Typically opened in a browser.',
      parameters: [
        {
          in: 'path',
          name: 'token',
          required: true,
          schema: { type: 'string' },
          description: 'JWT verification token from the confirmation email',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      ],
      responses: {
        200: {
          description: 'Email verified — HTML success page',
          content: { 'text/html': { schema: { type: 'string' } } },
        },
        401: {
          description: 'Invalid or expired token — HTML failure page',
          content: { 'text/html': { schema: { type: 'string' } } },
        },
      },
    },
  },
};
