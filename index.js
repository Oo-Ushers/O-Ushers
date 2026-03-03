import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { initApp } from './src/initapp.js';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(cors());

// Optionally, configure CORS with more control
app.use(
  cors({
    origin: '*', // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }),
);

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from a 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Add route handler for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'welcome.html'));
});

initApp(app, express);

// In production, export as serverless function for Vercel
// In dev, start the Express server normally
let handler;
if (process.env.APP_ENV === 'prod') {
  const ServerlessHttp = (await import('serverless-http')).default;
  handler = ServerlessHttp(app);
} else {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`\x1b[36m🚀 Server is running on port ${port}\x1b[0m`);
  });
}

export { handler };
export default app;
