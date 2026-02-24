/**
 * Order / Checkout Step Definitions
 * Covers: place order, order form, confirmation, purchase completion.
 */
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';
import orders from '../test-data/orders.json';

// ─── Place Order ─────────────────────────────────────────

When('I place an order with valid details', async ({ cartPage, state }) => {
  const confirmation = await cartPage.completePurchase(orders.validOrder);
  state.orderConfirmation = confirmation;
});

When('I place an order with minimal details', async ({ cartPage, state }) => {
  const confirmation = await cartPage.completePurchase(orders.minimalOrder);
  state.orderConfirmation = confirmation;
});

When('I click the Place Order button', async ({ cartPage }) => {
  await cartPage.clickPlaceOrder();
});

When('I fill the order form with valid details', async ({ cartPage }) => {
  await cartPage.fillOrderForm(orders.validOrder);
});

When('I click the Purchase button', async ({ cartPage, state }) => {
  const purchaseButton = cartPage.purchaseButton;
  await purchaseButton.click();
  await cartPage.confirmationModal.waitFor({ state: 'visible' });
  const confirmationText = await cartPage.confirmationMessage.textContent() || '';
  state.orderConfirmation = confirmationText;
});

// ─── Order Confirmation ──────────────────────────────────

Then('I should see order confirmation', async ({ cartPage }) => {
  await expect(cartPage.confirmationModal).toBeVisible();
});

Then('the order confirmation should contain {string}', async ({ state }, expectedText: string) => {
  expect(state.orderConfirmation).toContain(expectedText);
});

Then('the order confirmation should display the total amount', async ({ state }) => {
  expect(state.orderConfirmation.toLowerCase()).toContain('amount');
});

Then('the order confirmation should display the card number', async ({ state }) => {
  expect(state.orderConfirmation).toContain(orders.validOrder.creditCard);
});

// ─── Close Confirmation ──────────────────────────────────

When('I close the order confirmation', async ({ cartPage }) => {
  await cartPage.closeConfirmation();
});

Then('the confirmation modal should be closed', async ({ cartPage }) => {
  await expect(cartPage.confirmationModal).not.toBeVisible();
});
