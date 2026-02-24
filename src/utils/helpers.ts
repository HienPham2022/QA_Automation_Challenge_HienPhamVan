/**
 * Helper utilities for test automation
 */

/**
 * Generate a random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email
 */
export function generateRandomEmail(): string {
  return `test_${generateRandomString(8)}@test.com`;
}

/**
 * Generate a random username
 */
export function generateRandomUsername(): string {
  return `user_${generateRandomString(8)}`;
}

/**
 * Wait for a specified time
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format price string to number
 */
export function parsePrice(priceString: string): number {
  const cleaned = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format number to currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(0)}`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string for SQL injection prevention check
 */
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
    /('|"|;|--)/,
    /(\bOR\b.*=.*)/i,
    /(\bAND\b.*=.*)/i,
  ];
  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitize string for XSS prevention check
 */
export function containsXss(input: string): boolean {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]+>/g,
  ];
  return xssPatterns.some((pattern) => pattern.test(input));
}
