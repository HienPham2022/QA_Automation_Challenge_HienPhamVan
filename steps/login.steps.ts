/**
 * Login & Signup Step Definitions
 * Covers: login modal, login with credentials, alert-based login,
 *         signup modal, logout, session verification.
 */
import { expect } from '@playwright/test';
import { When, Then } from './fixtures';
import { generateRandomUsername } from '../src/utils/helpers';

// ─── Login Modal ──────────────────────────────────────────

When('I open the login modal', async ({ loginPage }) => {
  await loginPage.openLoginModal();
});

When('I close the login modal', async ({ loginPage }) => {
  await loginPage.closeLoginModal();
});

Then('the login modal should be visible', async ({ loginPage }) => {
  const visible = await loginPage.isLoginModalVisible();
  expect(visible).toBe(true);
});

Then('the login modal should not be visible', async ({ loginPage }) => {
  const visible = await loginPage.isLoginModalVisible();
  expect(visible).toBe(false);
});

Then('the login modal should display all required fields', async ({ loginPage }) => {
  await expect(loginPage.usernameInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.loginButton).toBeVisible();
  await expect(loginPage.closeButton).toBeVisible();
});

// ─── Login Actions ────────────────────────────────────────

When(
  'I login with username {string} and password {string}',
  async ({ loginPage }, username: string, password: string) => {
    await loginPage.login({ username, password });
  },
);

When(
  'I login expecting an alert with username {string} and password {string}',
  async ({ loginPage, state }, username: string, password: string) => {
    const alertMsg = await loginPage.loginWithAlert({ username, password });
    state.alertMessage = alertMsg;
  },
);

// ─── Login Verification ──────────────────────────────────

Then('I should be logged in as {string}', async ({ loginPage }, username: string) => {
  await loginPage.verifyLoginSuccess(username);
});

Then('I should see welcome message containing {string}', async ({ loginPage }, text: string) => {
  const welcomeMsg = await loginPage.header.getWelcomeMessage();
  expect(welcomeMsg).toContain(text);
});

Then('I should not be logged in', async ({ loginPage }) => {
  const loggedIn = await loginPage.verifyLoggedIn();
  expect(loggedIn).toBe(false);
});

// ─── Logout ──────────────────────────────────────────────

When('I logout', async ({ loginPage }) => {
  await loginPage.logout();
});

Then('I should be logged out', async ({ loginPage }) => {
  const loggedIn = await loginPage.verifyLoggedIn();
  expect(loggedIn).toBe(false);
});

// ─── Signup Modal ─────────────────────────────────────────

When('I open the signup modal', async ({ loginPage }) => {
  await loginPage.openSignupModal();
});

When('I signup with a new random user', async ({ loginPage, state }) => {
  const username = generateRandomUsername();
  const password = 'Test@12345';
  const alertMsg = await loginPage.signup({ username, password });
  state.alertMessage = alertMsg;
});

When(
  'I signup with username {string} and password {string}',
  async ({ loginPage, state }, username: string, password: string) => {
    const alertMsg = await loginPage.signup({ username, password });
    state.alertMessage = alertMsg;
  },
);

Then('the signup modal should display all required fields', async ({ loginPage }) => {
  await expect(loginPage.signupUsernameInput).toBeVisible();
  await expect(loginPage.signupPasswordInput).toBeVisible();
  await expect(loginPage.signupButton).toBeVisible();
  await expect(loginPage.signupCloseButton).toBeVisible();
});
