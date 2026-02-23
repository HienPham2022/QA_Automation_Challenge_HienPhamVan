/**
 * Environment configuration
 */
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  timeout: Number(process.env.TIMEOUT) || 30000,
};
