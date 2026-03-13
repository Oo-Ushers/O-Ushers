/**
 * WhatsApp Cloud API Integration (Meta Business Platform)
 *
 * Prerequisites (Meta Developer Dashboard):
 * 1. Create a Meta App at https://developers.facebook.com/apps/
 * 2. Add "WhatsApp" product to your app
 * 3. In WhatsApp > API Setup:
 *    - Copy the "Phone number ID" → WHATSAPP_PHONE_NUMBER_ID
 *    - Generate a temporary access token (or create a permanent System User token)
 *      → WHATSAPP_ACCESS_TOKEN
 * 4. In development mode, add recipient numbers to the "To" field test list
 *
 * Note: In development mode you can ONLY send messages to numbers that are
 * registered as test recipients in the Meta dashboard.
 */

const WHATSAPP_API_VERSION = 'v21.0';

/**
 * Send an OTP code to a WhatsApp number using a pre-approved template
 * or a plain text message (for testing).
 *
 * @param {Object} options
 * @param {string} options.to   - Recipient phone in E.164 format (e.g. "201234567890")
 * @param {string} options.otp  - The 6-digit OTP code
 * @returns {Promise<Object>}   - WhatsApp API response body
 */
export const sendWhatsAppOTP = async ({ to, otp }) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    throw new Error(
      'Missing WhatsApp API credentials. Set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env'
    );
  }

  // Strip any "+" prefix — the API expects pure digits in E.164 without "+"
  const recipient = to.replace(/^\+/, '');

  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`;

  // ────────────────────────────────────────────────────────
  // Plain text message with OTP code
  //
  // For development mode: if the 24-hour window expires,
  // just send "hi" from your phone to the test WhatsApp number
  // (shown in Meta dashboard → WhatsApp → API Setup) to reopen it.
  // ────────────────────────────────────────────────────────
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipient,
    type: 'text',
    text: {
      preview_url: false,
      body: `Your *OOUSHERS* verification code is: *${otp}*\n\nThis code expires in 15 minutes. Do not share it with anyone.`,
    },
  };

  console.log(`📤 Sending WhatsApp OTP to: ${recipient}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  // Log full response for debugging
  console.log('📨 WhatsApp API response:', JSON.stringify(data, null, 2));

  if (!response.ok) {
    console.error('❌ WhatsApp API error:', JSON.stringify(data, null, 2));
    const errMsg =
      data?.error?.message || 'Failed to send WhatsApp message';
    throw new Error(errMsg);
  }

  return data;
};
