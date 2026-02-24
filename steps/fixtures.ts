/**
 * BDD Fixtures - Integrates Page Object Model with playwright-bdd
 * Provides typed fixtures for all page objects + shared BDD state
 */
import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from '../src/pages/HomePage';
import { LoginPage } from '../src/pages/LoginPage';
import { ProductPage } from '../src/pages/ProductPage';
import { CartPage } from '../src/pages/CartPage';

/**
 * Shared state across steps within a single scenario.
 * Mutable object that persists for the duration of one test.
 */
export interface BddState {
  selectedProductNames: string[];
  alertMessage: string;
  orderConfirmation: string;
  lastProductName: string;
  lastProductPrice: number;
}

/** All custom fixtures */
type BddFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  state: BddState;
};

/** Extend Playwright base test with POM pages + BDD state */
export const test = base.extend<BddFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  state: async ({}, use) => {
    await use({
      selectedProductNames: [],
      alertMessage: '',
      orderConfirmation: '',
      lastProductName: '',
      lastProductPrice: 0,
    });
  },
});

/** BDD step functions bound to our fixtures */
export const { Given, When, Then } = createBdd(test);
