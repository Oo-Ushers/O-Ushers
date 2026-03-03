export const htmlTemplate = (token) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Confirmation - RAGE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  body, table, td, a {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  table, td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #ffcc00;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>
</head>
<body style="background-color: #000000;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <!-- Logo -->
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <img src="https://drive.google.com/uc?id=1JoGsuZB-R5lm1M0dTc3rg2_9yvOEuuaG" alt="RAGE Logo" border="0" width="100" style="display: block;">
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Title -->
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#242424" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #ffcc00;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color: #ffcc00;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <!-- Message -->
          <tr>
            <td align="left" bgcolor="#242424" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0; color: #ffffff;">Click the button below to verify your email and activate your RAGE account.</p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" bgcolor="#242424">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#ffcc00" style="border-radius: 6px;">
                    <a href="https://rage-three.vercel.app//verify/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #000000; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Message -->
          <tr>
            <td align="left" bgcolor="#242424" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #ffcc00;">
              <p style="margin: 0; color: #ffffff;">If you didn’t create an account, no action is required. You can safely ignore this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" bgcolor="#000000" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #888888;">
              <p style="margin: 0;">Need help? Contact the RAGE support team.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>`;
};

export const verificationSuccessTemplate = () => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Verification Success - RAGE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
    body {
      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
      background-color: #000000;
      margin: 0;
      padding: 0;
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .container {
      max-width: 600px;
      width: 100%;
      margin: 0 auto;
    }

    .card {
      background-color: #242424;
      border-radius: 8px;
      border-top: 3px solid #ffcc00;
      border-bottom: 3px solid #ffcc00;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .card-header {
      padding: 36px 24px 0;
      text-align: center;
    }

    .logo {
      width: 60px;
      height: 60px;
      margin-bottom: 24px;
    }

    h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -1px;
      line-height: 48px;
      color: #ffcc00;
      margin-bottom: 12px;
    }

    .card-body {
      padding: 24px;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      color: #ffffff;
    }

    .check-icon {
      display: block;
      width: 90px;
      height: 90px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background-color: #ffcc00;
      position: relative;
    }

    .check-icon:after {
      content: '';
      position: absolute;
      width: 30px;
      height: 15px;
      border-left: 4px solid #000000;
      border-bottom: 4px solid #000000;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%) rotate(-45deg);
    }

    .button {
      display: inline-block;
      padding: 16px 36px;
      font-size: 16px;
      color: #000000;
      text-decoration: none;
      background-color: #ffcc00;
      border-radius: 6px;
      margin-top: 24px;
      transition: background-color 0.3s ease;
      font-weight: bold;
    }

    .button:hover {
      background-color: #D4a800;
    }

    .card-footer {
      padding: 24px;
      font-size: 14px;
      line-height: 20px;
      color: #aaaaaa;
      text-align: center;
      background-color: #000000;
    }

    @media screen and (max-width: 600px) {
      .container {
        width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <img src="https://res.cloudinary.com/dizb3j2hj/image/upload/v1750703190/white_yellow_oi4lz1.png" alt="RAGE Logo" class="logo">
        <h1>Email Verified Successfully!</h1>
      </div>
      <div class="card-body">
        <div class="check-icon"></div>
        <p>Thank you for verifying your email address. Your account is now active and you can start using <strong>RAGE</strong>.</p>
        <a href="https://car-mate-frontend-lvv2syt0x-omers-projects-70d4da40.vercel.app/login" class="button">Continue to Login</a>
      </div>
    </div>
    <div class="card-footer">
      <p>If you have any questions, please contact our support team.</p>
    </div>
  </div>
</body>
</html>`;
};





/**
 * HTML template for new Contact-Us submissions,
 * sent to your support inbox.
 */
export const customerSupportTemplate = ({ name, email, phoneNumber, message }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>New Contact Form Submission</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  table,
  td {
    mso-table-rspace: 0pt; /* Outlook Attachments Spacing */
    mso-table-lspace: 0pt; /* Outlook Attachments Spacing */
  }
  img {
    -ms-interpolation-mode: bicubic;
  }
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    background-color: #000000; /* Main background color */
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  }
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #c41e3a; /* Accent color for links */
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  .label {
    font-weight: 700; /* Bold for labels */
    color: #bbbbbb;  /* Light grey for labels */
  }
  .value {
    color: #ffffff; /* White for values */
  }
  .message-content {
    white-space: pre-wrap; /* Preserve line breaks from the user's message */
    word-wrap: break-word; /* Break long words to prevent layout issues */
    color: #ffffff;
    font-size: 16px;
    line-height: 24px;
  }
  </style>
</head>
<body style="background-color: #000000;">

  <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    New contact form submission from ${name}.
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <img src="https://drive.google.com/uc?id=1Rb4DcjXtkUXWAS65e3JBhDB6AqSmTEqc" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1a1a1a" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #c41e3a;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px; color: #ffffff;">🆕 New Contact Us Message</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1a1a1a" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0 0 12px;"><span class="label">Name:</span> <span class="value">${name}</span></p>
              <p style="margin: 0 0 12px;"><span class="label">Email:</span> <span class="value"><a href="mailto:${email}" style="color: #c41e3a; text-decoration: underline;">${email}</a></span></p>
              <p style="margin: 0;"><span class="label">Phone:</span> <span class="value">${phoneNumber ? phoneNumber : 'N/A'}</span></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1a1a1a" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 1px solid #333333;">
              <p style="margin: 0 0 12px;"><span class="label">Message:</span></p>
              <p class="message-content" style="margin: 0;">${message}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#000000">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#1a1a1a" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-bottom: 3px solid #c41e3a;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" bgcolor="#c41e3a" style="border-radius: 6px;">
                    <a href="mailto:${email}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reply to ${name}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" bgcolor="#000000" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" bgcolor="#000000" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #777777;">
              <p style="margin: 0;">You received this email because a user submitted the contact form on your website.</p>
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#000000" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #777777;">
              <p style="margin: 0 0 4px;">[Your Company Name] &bull; [Your Company Address]</p>
              <p style="margin: 0;">This is an automated notification.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    </table>
</body>
</html>
`;

// Example usage in your application:
// For sending verification email: htmlTemplate(userToken)
// For success page after verification: verificationSuccessTemplate()


export const htmlTemplateOTP = (otp) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RAGE OTP Code</title>
</head>
<body style="margin:0; padding:0; background-color:#000000; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1a1a; border-top:3px solid #ffcc00; border-bottom:3px solid #ffcc00; padding:24px; color:#ffffff;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="https://res.cloudinary.com/dizb3j2hj/image/upload/v1750703190/white_yellow_oi4lz1.png" alt="RAGE Logo" width="60" style="display:block;">
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="font-size:28px; font-weight:bold; color:#ffcc00; padding-bottom: 10px;">
              Your OTP Code
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td align="center" style="font-size:16px; color:#ffffff; padding: 10px 0;">
              Use the following code to verify your identity. This code will expire after 15 minutes.
            </td>
          </tr>

          <!-- OTP Code -->
          <tr>
            <td align="center" style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#ffcc00; padding: 20px 0;">
              ${otp}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="font-size:14px; color:#cccccc; padding: 20px 0;">
              If you didn't request this code, please ignore this email.
            </td>
          </tr>

          <tr>
            <td align="center" style="font-size:14px; color:#777;">
              Need help? Contact us at <a href="mailto:support@rage.com" style="color:#ffcc00; text-decoration:none;">support@rage.com</a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};
