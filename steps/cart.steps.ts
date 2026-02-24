/**
 * Cart Step Definitions
 * Covers: navigate to cart, verify cart items/count/total,
 *         delete items, clear cart.
 */
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';

// ─── Cart Navigation ─────────────────────────────────────

When('I navigate to the cart', async ({ cartPage }) => {
  await cartPage.navigateToCart();
});

// ─── Cart Item Count ─────────────────────────────────────

Then('the cart should contain {int} item', async ({ cartPage }, expectedCount: number) => {
  const actualCount = await cartPage.getCartItemCount();
  expect(actualCount).toBe(expectedCount);
});

Then('the cart should contain {int} items', async ({ cartPage }, expectedCount: number) => {
  const actualCount = await cartPage.getCartItemCount();
  expect(actualCount).toBe(expectedCount);
});

Then(
  'the cart should have at least {int} item',
  async ({ cartPage }, minCount: number) => {
    const actualCount = await cartPage.getCartItemCount();
    expect(actualCount).toBeGreaterThanOrEqual(minCount);
  },
);

Then(
  'the cart should have at least {int} items',
  async ({ cartPage }, minCount: number) => {
    const actualCount = await cartPage.getCartItemCount();
    expect(actualCount).toBeGreaterThanOrEqual(minCount);
  },
);

// ─── Cart Item Verification ──────────────────────────────

Then(
  'the cart should contain product {string}',
  async ({ cartPage }, productName: string) => {
    const names = await cartPage.getCartItemNames();
    const trimmedNames = names.map((n) => n.trim());
    expect(trimmedNames).toContain(productName);
  },
);

Then(
  'the cart should not contain product {string}',
  async ({ cartPage }, productName: string) => {
    const names = await cartPage.getCartItemNames();
    const trimmedNames = names.map((n) => n.trim());
    expect(trimmedNames).not.toContain(productName);
  },
);

Then('the cart should contain all remembered products', async ({ cartPage, state }) => {
  const names = await cartPage.getCartItemNames();
  const trimmedNames = names.map((n) => n.trim());
  for (const expectedName of state.selectedProductNames) {
    expect(trimmedNames).toContain(expectedName);
  }
});

// ─── Cart Total ──────────────────────────────────────────

Then('the cart total should be {int}', async ({ cartPage }, expectedTotal: number) => {
  const actualTotal = await cartPage.getTotalPrice();
  expect(actualTotal).toBe(expectedTotal);
});

// ─── Delete / Clear Cart ─────────────────────────────────

When('I delete cart item at index {int}', async ({ cartPage }, index: number) => {
  await cartPage.deleteItemByIndex(index);
});

When('I delete cart item {string}', async ({ cartPage }, productName: string) => {
  await cartPage.deleteItemByName(productName);
});

When('I clear the cart', async ({ cartPage }) => {
  await cartPage.clearCart();
});

Then('the cart should be empty', async ({ cartPage }) => {
  const isEmpty = await cartPage.isCartEmpty();
  expect(isEmpty).toBe(true);
});
