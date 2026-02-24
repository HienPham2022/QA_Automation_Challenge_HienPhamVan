/**
 * Common Step Definitions
 * Shared navigation, alerts, and category steps used across all features.
 */
import { expect } from '@playwright/test';
import { Given, When, Then } from './fixtures';
import { ProductCategory } from '../src/types';

// ─── Navigation ───────────────────────────────────────────

Given('I am on the DemoBlaze homepage', async ({ homePage }) => {
  await homePage.open();
});

When('I go back to the homepage', async ({ homePage }) => {
  await homePage.open();
});

Then('I should be on the homepage', async ({ homePage }) => {
  const isHome = await homePage.isOnHomePage();
  expect(isHome).toBe(true);
});

// ─── Alert Verification ──────────────────────────────────

Then(
  'I should see an alert with message containing {string}',
  async ({ state }, expectedText: string) => {
    expect(state.alertMessage).toBeTruthy();
    expect(state.alertMessage.toLowerCase()).toContain(expectedText.toLowerCase());
  },
);

// ─── Category Selection ──────────────────────────────────

When('I select the {string} category', async ({ homePage }, categoryLabel: string) => {
  const categoryMap: Record<string, ProductCategory> = {
    Phones: 'phone',
    Laptops: 'laptop',
    Monitors: 'monitor',
  };
  const category = categoryMap[categoryLabel];
  if (!category) throw new Error(`Unknown category label: ${categoryLabel}`);
  await homePage.selectCategory(category);
});

Then('I should see products in the list', async ({ homePage }) => {
  const count = await homePage.getProductCount();
  expect(count).toBeGreaterThan(0);
});
