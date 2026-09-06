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

  // Helper to load OpenAPI spec from multiple possible paths (local vs Vercel serverless)
  const getOpenApiSpec = () => {
    const pathsToTry = [
      path.resolve(__dirname, '../docs/openapi.json'),
      path.resolve(process.cwd(), 'docs/openapi.json'),
      path.resolve(process.cwd(), 'O-Ushers/docs/openapi.json'),
    ];
    for (const p of pathsToTry) {
      try {
        const fileContent = readFileSync(p, 'utf8');
        if (fileContent) return JSON.parse(fileContent);
      } catch {
        // try next path
      }
    }
    return null;
  };

  // OpenAPI spec endpoint — returns raw JSON spec for APIdog / Postman / Swagger UI
  // GET /docs/openapi.json
  app.get('/docs/openapi.json', (req, res) => {
    const spec = getOpenApiSpec();
    if (spec) {
      return res.status(200).json(spec);
    }
    return res.status(404).json({ success: false, message: 'OpenAPI spec not found. Run: npm run generate:openapi' });
  });

  // Interactive Swagger UI HTML template (works 100% on Vercel production without static asset 404s)
  const renderSwaggerHtml = (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>O-Ushers API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.11.0/favicon-32x32.png" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    .swagger-ui .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" charset="UTF-8"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "/docs/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`);
  };

  // Interactive Swagger UI documentation endpoints (Vercel + Local)
  app.get('/docs', renderSwaggerHtml);
  app.get('/docs/', renderSwaggerHtml);
  app.get('/api-docs', renderSwaggerHtml);
  app.get('/api-docs/', renderSwaggerHtml);
  app.get('/swagger', renderSwaggerHtml);
  app.get('/swagger/', renderSwaggerHtml);

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
