import dotenv from 'dotenv';
import path from 'path';
import { connectDB, sequelize } from '../db/connection.js';
import { verifyToken } from './utils/token.js';
import { verificationSuccessTemplate, verificationFailedTemplate } from './utils/htmlTemplate.js';
import { globalErrorHandler } from './utils/appError.js';
// Routes will be imported here as they are created
import * as allRouters from './index.js'
import { User } from '../db/models/user.model.js';
dotenv.config({ path: path.resolve('./.env') });
export const initApp = async (app, express) => {
  app.use(express.static('public'));
  app.use(express.json());
  await connectDB();

  // Health check endpoint — live DB status
  app.get('/health', async (req, res) => {
    try {
      await sequelize.authenticate();
      return res.status(200).json({ server: true, database: true });
    } catch {
      return res.status(200).json({ server: true, database: false });
    }
  });

  app.get('/verify/:token', async (req, res) => {
    try {
      const payload = verifyToken({ token: req.params.token });

      await User.update({ isEmailVerified: true }, { where: { email: payload.email } });

      // Send the HTML verification success page
      res.status(200).send(verificationSuccessTemplate());
    } catch (err) {
      // Send the HTML verification failed page
      res.status(401).send(verificationFailedTemplate());
    }
  });

  app.use('/auth', allRouters.authRouter)
  app.use(globalErrorHandler);
};

