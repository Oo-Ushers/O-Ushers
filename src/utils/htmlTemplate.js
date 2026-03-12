export const htmlTemplate = (token) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Confirmation - OOUSHERS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; }
  a[x-apple-data-detectors] {
    font-family: inherit !important; font-size: inherit !important;
    font-weight: inherit !important; line-height: inherit !important;
    color: inherit !important; text-decoration: none !important;
  }
  body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; }
  table { border-collapse: collapse !important; }
  a { color: #7c3aed; }
  img { height: auto; line-height: 100%; text-decoration: none; border: 0; outline: none; }
  </style>
</head>
<body style="background-color: #0f0f0f;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- Logo -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <!-- Replace src with your actual logo URL -->
              <span style="font-family: Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; color: #7c3aed; letter-spacing: 3px;">OOUSHERS</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Title -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 36px 24px 0; font-family: Helvetica, Arial, sans-serif; border-top: 3px solid #7c3aed;">
              <h1 style="margin: 0; font-size: 30px; font-weight: 700; letter-spacing: -1px; line-height: 44px; color: #7c3aed;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- Message -->
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 26px;">
              <p style="margin: 0; color: #ffffff;">Click the button below to verify your email and activate your <strong style="color:#7c3aed;">OOUSHERS</strong> account.</p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" bgcolor="#1e1b2e" style="padding: 8px 24px 28px;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#7c3aed" style="border-radius: 6px;">
                    <!-- ✅ Fixed: single slash before token, no double slash -->
                    <a href="http://localhost:3000/verify/${token}" target="_blank"
                       style="display: inline-block; padding: 16px 40px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Message -->
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 15px; line-height: 24px; border-bottom: 3px solid #7c3aed;">
              <p style="margin: 0; color: #a0a0b0;">If you didn't create an account, no action is required. You can safely ignore this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" bgcolor="#0f0f0f" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 12px 24px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #606060;">
              <p style="margin: 0;">Need help? Contact us at <a href="mailto:ooushers@gmail.com" style="color: #7c3aed; text-decoration: none;">ooushers@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>`;
};


// ── 2. VERIFICATION SUCCESS PAGE ──────────────────────────────────────────────
export const verificationSuccessTemplate = () => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Verified - OOUSHERS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
      background-color: #0f0f0f;
      margin: 0; padding: 0;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    /* Animated background glow */
    body::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
    }

    .container { max-width: 560px; width: 90%; margin: 40px auto; position: relative; z-index: 1; }

    .card {
      background-color: #1e1b2e;
      border-radius: 10px;
      border-top: 3px solid #7c3aed;
      border-bottom: 3px solid #7c3aed;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);
      animation: fadeInUp 0.8s ease-out 0.15s both;
    }

    .card-header { padding: 36px 24px 0; text-align: center; }

    .brand {
      display: inline-block;
      font-size: 26px; font-weight: 900;
      color: #7c3aed; letter-spacing: 3px;
      margin-bottom: 24px;
    }

    h1 { margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #ffffff; }

    .card-body { padding: 24px; font-size: 16px; line-height: 26px; text-align: center; color: #d0d0e0; }

    .check-icon {
      display: block; width: 80px; height: 80px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background-color: #7c3aed;
      position: relative;
      animation: scaleIn 0.5s ease-out 0.4s both;
    }
    .check-icon:after {
      content: '';
      position: absolute;
      width: 28px; height: 14px;
      border-left: 4px solid #ffffff;
      border-bottom: 4px solid #ffffff;
      top: 50%; left: 50%;
      transform: translate(-50%, -60%) rotate(-45deg);
    }

    .button {
      display: inline-block;
      padding: 16px 40px;
      font-size: 16px; font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      background-color: #7c3aed;
      border-radius: 6px;
      margin-top: 24px;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .button:hover { background-color: #5b21b6; transform: translateY(-1px); }

    .card-footer {
      padding: 20px 24px;
      font-size: 14px;
      color: #606070;
      text-align: center;
      background-color: #0f0f0f;
    }

    .divider {
      width: 60px; height: 3px;
      background: linear-gradient(90deg, transparent, #a855f7, #7c3aed, transparent);
      margin: 16px auto;
      border-radius: 2px;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to   { opacity: 1; transform: scale(1); }
    }

    @media screen and (max-width: 600px) { .container { width: 92%; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="brand">OOUSHERS</div>
        <h1>Email Verified Successfully!</h1>
      </div>
      <div class="card-body">
        <div class="check-icon"></div>
        <p>Your email address has been confirmed. Your account is now active and you can start using <strong style="color:#7c3aed;">OOUSHERS</strong>.</p>
        <div class="divider"></div>
        <a href="https://ooushers.com/login" class="button">Continue to Login</a>
      </div>
    </div>
    <div class="card-footer">
      <p style="margin:0;">Questions? Reach us at <a href="mailto:ooushers@gmail.com" style="color:#7c3aed; text-decoration:none;">ooushers@gmail.com</a></p>
    </div>
  </div>
</body>
</html>`;
};


// ── VERIFICATION FAILED PAGE ──────────────────────────────────────────────────
export const verificationFailedTemplate = () => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Verification Failed - OOUSHERS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
      background-color: #0f0f0f;
      margin: 0; padding: 0;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }

    /* Animated background glow */
    body::before {
      content: '';
      position: fixed;
      top: 50%;
      left: 50%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: pulse 4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
    }

    .container { max-width: 560px; width: 90%; margin: 40px auto; position: relative; z-index: 1; }

    .card {
      background-color: #1e1b2e;
      border-radius: 10px;
      border-top: 3px solid #7c3aed;
      border-bottom: 3px solid #7c3aed;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);
      animation: fadeInUp 0.8s ease-out 0.15s both;
    }

    .card-header { padding: 36px 24px 0; text-align: center; }

    .brand {
      display: inline-block;
      font-size: 26px; font-weight: 900;
      color: #7c3aed; letter-spacing: 3px;
      margin-bottom: 24px;
    }

    h1 { margin: 0 0 12px; font-size: 28px; font-weight: 700; color: #ffffff; }

    .card-body {
      padding: 24px; font-size: 16px;
      line-height: 26px; text-align: center;
      color: #d0d0e0;
    }

    /* Error X icon */
    .error-icon {
      display: block; width: 80px; height: 80px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background-color: #7c3aed;
      position: relative;
      animation: scaleIn 0.5s ease-out 0.4s both;
    }

    .error-icon:before,
    .error-icon:after {
      content: '';
      position: absolute;
      width: 32px; height: 4px;
      background-color: #ffffff;
      top: 50%; left: 50%;
      margin-top: -2px; margin-left: -16px;
      border-radius: 2px;
    }
    .error-icon:before { transform: rotate(45deg); }
    .error-icon:after  { transform: rotate(-45deg); }

    .button {
      display: inline-block;
      padding: 16px 40px;
      font-size: 16px; font-weight: bold;
      color: #ffffff;
      text-decoration: none;
      background-color: #7c3aed;
      border-radius: 6px;
      margin-top: 24px;
      transition: background-color 0.3s ease, transform 0.2s ease;
    }
    .button:hover { background-color: #5b21b6; transform: translateY(-1px); }

    .card-footer {
      padding: 20px 24px;
      font-size: 14px;
      color: #606070;
      text-align: center;
      background-color: #0f0f0f;
    }

    .divider {
      width: 60px; height: 3px;
      background: linear-gradient(90deg, transparent, #a855f7, #7c3aed, transparent);
      margin: 16px auto;
      border-radius: 2px;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to   { opacity: 1; transform: scale(1); }
    }

    @media screen and (max-width: 600px) { .container { width: 92%; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="brand">OOUSHERS</div>
        <h1>Verification Failed</h1>
      </div>
      <div class="card-body">
        <div class="error-icon"></div>
        <p>The verification link is <strong style="color:#a855f7;">invalid</strong> or has <strong style="color:#a855f7;">expired</strong>.</p>
        <p style="margin-top:12px; font-size:14px; color:#a0a0b0;">Please request a new verification email from your account settings.</p>
        <div class="divider"></div>
        <a href="https://ooushers.com/login" class="button">Return to Login</a>
      </div>
    </div>
    <div class="card-footer">
      <p style="margin:0;">Need help? Contact us at <a href="mailto:ooushers@gmail.com" style="color:#7c3aed; text-decoration:none;">ooushers@gmail.com</a></p>
    </div>
  </div>
</body>
</html>`;
};


// ── 3. CONTACT-US SUPPORT EMAIL ───────────────────────────────────────────────
export const customerSupportTemplate = ({ name, email, phoneNumber, message }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>New Contact Form Submission - OOUSHERS</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
  body { width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; background-color: #0f0f0f; font-family: Helvetica, Arial, sans-serif; }
  table { border-collapse: collapse !important; }
  .label { font-weight: 700; color: #a0a0b0; }
  .value { color: #ffffff; }
  .message-content { white-space: pre-wrap; word-wrap: break-word; color: #ffffff; font-size: 16px; line-height: 26px; }
  </style>
</head>
<body style="background-color: #0f0f0f;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- Logo -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <span style="font-size: 24px; font-weight: 900; color: #7c3aed; letter-spacing: 3px;">OOUSHERS</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Title -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 36px 24px 0; font-family: Helvetica, Arial, sans-serif; border-top: 3px solid #7c3aed;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; line-height: 44px; color: #ffffff;">🆕 New Contact Message</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Sender details -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 28px;">
              <p style="margin: 0 0 10px;"><span class="label">Name:</span> <span class="value">${name}</span></p>
              <p style="margin: 0 0 10px;"><span class="label">Email:</span> <span class="value"><a href="mailto:${email}" style="color: #7c3aed; text-decoration: underline;">${email}</a></span></p>
              <p style="margin: 0;"><span class="label">Phone:</span> <span class="value">${phoneNumber ? phoneNumber : 'N/A'}</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Message body -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; border-top: 1px solid #2e2b40;">
              <p style="margin: 0 0 12px;"><span class="label">Message:</span></p>
              <p class="message-content" style="margin: 0;">${message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Reply button -->
    <tr>
      <td align="center" bgcolor="#0f0f0f">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1e1b2e" style="padding: 24px; font-family: Helvetica, Arial, sans-serif; border-bottom: 3px solid #7c3aed;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#7c3aed" style="border-radius: 6px;">
                    <a href="mailto:${email}" target="_blank"
                       style="display: inline-block; padding: 16px 36px; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" bgcolor="#0f0f0f" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 12px 24px; font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #606060;">
              <p style="margin: 0;">You received this because a user submitted the contact form on the OOUSHERS platform.</p>
              <p style="margin: 8px 0 0;">This is an automated notification.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>
`;


// ── 4. OTP EMAIL ──────────────────────────────────────────────────────────────
export const htmlTemplateOTP = (otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>OOUSHERS OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#0f0f0f; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f0f0f;">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <!-- Container -->
        <table width="560" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#1e1b2e; border-top:3px solid #7c3aed; border-bottom:3px solid #7c3aed; border-radius:10px; overflow:hidden; color:#ffffff;">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding: 32px 0 8px;">
              <span style="font-size:24px; font-weight:900; color:#7c3aed; letter-spacing:3px;">OOUSHERS</span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="font-size:26px; font-weight:bold; color:#ffffff; padding: 8px 24px 4px;">
              Your One-Time Password
            </td>
          </tr>

          <!-- Subtitle -->
          <tr>
            <td align="center" style="font-size:15px; color:#a0a0b0; padding: 8px 40px 20px; line-height:24px;">
              Use the code below to verify your identity. It expires in <strong style="color:#ffffff;">15 minutes</strong>.
            </td>
          </tr>

          <!-- OTP Code box -->
          <tr>
            <td align="center" style="padding: 0 24px 28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                      style="background-color:#2d2650; border: 2px solid #7c3aed; border-radius:8px; padding: 20px 48px;">
                    <span style="font-size:36px; font-weight:bold; letter-spacing:10px; color:#7c3aed;">${otp}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td align="center" style="font-size:14px; color:#606070; padding: 0 40px 20px; line-height:22px;">
              If you didn't request this code, please ignore this email. Your account remains secure.
            </td>
          </tr>

          <!-- Support -->
          <tr>
            <td align="center" style="font-size:14px; color:#606070; padding-bottom:28px;">
              Need help? <a href="mailto:ooushers@gmail.com" style="color:#7c3aed; text-decoration:none;">ooushers@gmail.com</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};