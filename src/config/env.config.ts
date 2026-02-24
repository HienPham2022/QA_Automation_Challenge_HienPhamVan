/**
 * Environment configuration
 */
import { EnvironmentConfig } from '../types';

export const config: EnvironmentConfig = {
  baseUrl: process.env.BASE_URL || 'https://www.demoblaze.com',
  apiUrl: process.env.API_URL || 'https://api.demoblaze.com',
  timeout: Number(process.env.TIMEOUT) || 30000,
  retries: Number(process.env.RETRIES) || 2,
  headless: process.env.HEADLESS !== 'false',
};

export const testUsers = {
  validUser: {
    username: process.env.TEST_USERNAME || 'testuser123',
    password: process.env.TEST_PASSWORD || 'testpass123',
  },
  invalidUser: {
    username: 'invaliduser',
    password: 'wrongpassword',
  },
};

export default config;
