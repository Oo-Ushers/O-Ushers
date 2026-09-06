import dotenv from 'dotenv';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, sequelize } from '../db/connection.js';
import { TokenService } from './utils/token.js';
import { HtmlTemplateService } from './utils/htmlTemplate.js';
import { ErrorHandler } from './utils/appError.js';
// Routes will be imported here as they are created
import * as allRouters from './index.js'
import { User } from '../db/models/user.model.js';
import swaggerUi from 'swagger-ui-express';

dotenv.config({ path: path.resolve('./.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // OpenAPI spec endpoint — returns raw JSON spec for APIdog / Postman import
  // GET /docs/openapi.json
  app.get('/docs/openapi.json', (req, res) => {
    try {
      const specPath = path.resolve(__dirname, '../docs/openapi.json');
      const spec = JSON.parse(readFileSync(specPath, 'utf8'));
      return res.status(200).json(spec);
    } catch {
      return res.status(404).json({ success: false, message: 'OpenAPI spec not found. Run: npm run generate:openapi' });
    }
  });

  // Interactive Swagger UI documentation endpoints
  // GET /docs | GET /api-docs | GET /swagger
  try {
    const specPath = path.resolve(__dirname, '../docs/openapi.json');
    const swaggerDocument = JSON.parse(readFileSync(specPath, 'utf8'));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.error('Failed to load Swagger UI document:', err.message);
  }

  app.get('/verify/:token', async (req, res) => {
    try {
      const payload = TokenService.verifyToken({ token: req.params.token });

      await User.update({ isEmailVerified: true }, { where: { email: payload.email } });

      // Send the HTML verification success page
      res.status(200).send(HtmlTemplateService.verificationSuccess());
    } catch (err) {
      // Send the HTML verification failed page
      res.status(401).send(HtmlTemplateService.verificationFailed());
    }
  });

  app.use('/auth', allRouters.authRouter);
  app.use('/usher', allRouters.usherRouter);
  app.use('/organizer', allRouters.organizerRouter);
  app.use('/admin', allRouters.adminRouter);
  app.use(ErrorHandler.globalErrorHandler);
};
