import { Sequelize } from 'sequelize';
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
    console.log('PostgreSQL connected & synced successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('DB connection error:', error);
  }
};
