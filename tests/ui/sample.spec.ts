import { test, expect } from '@playwright/test';

test.describe('Sample Test Suite', () => {
  test('should load the page successfully', async ({ page }) => {
    // This is a sample test - update with your actual test
    await page.goto('/');
    await expect(page).toHaveTitle(/.*/);
  });
});
