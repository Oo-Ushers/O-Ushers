import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from '../db/connection.js';
import { verifyToken } from './utils/token.js';
import { verificationSuccessTemplate } from './utils/htmlTemplate.js';
import { globalErrorHandler } from './utils/appError.js';
import * as allRouters from './index.js'
import { User } from '../db/models/user.model.js';
import { log } from 'console';
import { status } from './utils/constant/enums.js';


dotenv.config({ path: path.resolve('./config/.env') })
export const initApp = (app, express) => {
  app.use(express.static('public'));
  app.use(express.json());
  const port = process.env.PORT || 3000;
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
  connectDB();


  app.get('/verify/:token', async (req, res) => {
    try {

      const payload = verifyToken({ token: req.params.token });

      const result = await User.findOneAndUpdate(
        { email: payload.email },
        { status: status.VERIFIED }
      );

      // Send the HTML verification success page instead of JSON
      res.status(200).send(verificationSuccessTemplate());
    } catch (err) {
      // Send an HTML error page for failed verification
      res.status(401).send(`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Verification Failed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
      body {
        font-family: 'Segoe UI', sans-serif;
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
        box-shadow: 0 10px 30px rgba(255, 204, 0, 0.15);
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

      .error-icon {
        display: block;
        width: 90px;
        height: 90px;
        margin: 0 auto 24px;
        border-radius: 50%;
        background-color: #ffcc00;
        position: relative;
      }

      .error-icon:before,
      .error-icon:after {
        content: '';
        position: absolute;
        width: 40px;
        height: 4px;
        background-color: #000000;
        top: 50%;
        left: 50%;
        margin-top: -2px;
        margin-left: -20px;
      }

      .error-icon:before {
        transform: rotate(45deg);
      }

      .error-icon:after {
        transform: rotate(-45deg);
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
        color: #cccccc;
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
          <img src="https://drive.google.com/uc?id=1Rb4DcjXtkUXWAS65e3JBhDB6AqSmTEqc" alt="RAGE Logo" class="logo">
          <h1>Verification Failed</h1>
        </div>
        <div class="card-body">
          <div class="error-icon"></div>
          <p>The verification link is invalid or has expired.</p>
          <a href="https://rage.com/login" class="button">Return to Login</a>
        </div>
      </div>
      <div class="card-footer">
        <p>If this issue persists, please contact our support team.</p>
      </div>
    </div>
  </body>
  </html>
`);

    }
  });






//app.use('/user', allRouters.userRouter)
  app.use(globalErrorHandler);




}

