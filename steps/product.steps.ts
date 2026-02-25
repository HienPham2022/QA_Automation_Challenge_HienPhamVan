/**
 * Product Step Definitions
 * Covers: clicking products, random product selection,
 *         adding to cart, verifying product details.
 */
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';

// ─── Click / Select Product ──────────────────────────────

When('I click on product {string}', async ({ homePage }, productName: string) => {
  await homePage.clickProductByName(productName);
});

When('I click on a random product and remember it', async ({ homePage, state }) => {
  const productName = await homePage.clickRandomProduct();
  state.selectedProductNames.push(productName);
  state.lastProductName = productName;
});

// ─── Add to Cart ──────────────────────────────────────────

When('I add the product to cart', async ({ productPage, state }) => {
  const alertMsg = await productPage.addToCart();
  state.alertMessage = alertMsg;
});

// ─── Product Detail Verification ─────────────────────────

Then(
  'the product name should contain {string}',
  async ({ productPage }, expectedName: string) => {
    const actualName = await productPage.getProductName();
    expect(actualName).toContain(expectedName);
  },
);

Then('the product price should be {int}', async ({ productPage }, expectedPrice: number) => {
  const actualPrice = await productPage.getProductPrice();
  expect(actualPrice).toBe(expectedPrice);
});

Then('the product description should not be empty', async ({ productPage }) => {
  const details = await productPage.getProductDetails();
  expect(details.description).toBeTruthy();
  expect(details.description!.length).toBeGreaterThan(0);
});

Then('the product image should be visible', async ({ productPage }) => {
  const imageVisible = await productPage.isProductImageVisible();
  expect(imageVisible).toBe(true);
});
