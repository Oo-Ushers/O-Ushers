// ═══════════════════════════════════════════════════════════════════════════
//  OpenAPI 3.0 — Reusable Response Definitions
// ═══════════════════════════════════════════════════════════════════════════

// Helper to build a JSON response object
const json = (description, schema, examples) => {
  const resp = { description, content: { 'application/json': {} } };
  if (schema) resp.content['application/json'].schema = schema;
  if (examples) resp.content['application/json'].examples = examples;
  return resp;
};

const jsonExample = (description, example) => ({
  description,
  content: { 'application/json': { example } },
});

const htmlResp = (description) => ({
  description,
  content: { 'text/html': { schema: { type: 'string' } } },
});

// ── Shared error refs ────────────────────────────────────────────────────
const errorRef = { $ref: '#/components/schemas/ErrorResponse' };
const successRef = { $ref: '#/components/schemas/SuccessMessage' };

// ── Exports ──────────────────────────────────────────────────────────────
export const responses = {
  // Generic
  NotFound: jsonExample('Resource not found', { success: false, message: 'user not found' }),
  RateLimit: jsonExample('Rate limit — too soon', { success: false, message: 'Please wait 25 seconds before requesting a new OTP' }),
  ServerError: jsonExample('Internal server error', { success: false, message: 'Failed to send email' }),
  Unauthorized: (msg = 'Authentication Failed') => jsonExample('Unauthorized', { success: false, message: msg }),

  // Utility builders for paths
  json,
  jsonExample,
  htmlResp,
  errorRef,
  successRef,
};
