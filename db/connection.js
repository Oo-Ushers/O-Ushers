import { Sequelize } from 'sequelize';
import pg from 'pg'; // Explicit import so Vercel's bundler includes it
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./.env') });

export const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.PG_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // eslint-disable-next-line no-console
    console.log('\x1b[32m✔ PostgreSQL connected & synced successfully\x1b[0m');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('\x1b[31m✖ DB connection error:\x1b[0m', error);
    throw error;
  }
};
