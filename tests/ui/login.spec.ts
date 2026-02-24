/**
 * Login Module Tests
 * Covers: Functional scenarios, Edge cases, Negative paths
 */
import { test, expect } from '../../src/fixtures';
import { generateRandomUsername } from '../../src/utils/helpers';
import users from '../../test-data/users.json';

test.describe('Login Module Tests @login', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test.describe('Functional Tests', () => {
    test('should login successfully with valid credentials', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      
      // Wait for login to complete
      await loginPage.verifyLoginSuccess(users.validUser.username);
      expect(await loginPage.verifyLoggedIn()).toBe(true);
    });

    test('should logout successfully after login', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      await loginPage.verifyLoginSuccess(users.validUser.username);
      
      await loginPage.logout();
      
      // Verify logged out - login link should be visible
      await expect(loginPage.header.loginLink).toBeVisible();
      expect(await loginPage.verifyLoggedIn()).toBe(false);
    });

    test('should show welcome message with username after login', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      
      await loginPage.header.welcomeUser.waitFor({ state: 'visible' });
      const welcomeText = await loginPage.header.getWelcomeMessage();
      expect(welcomeText).toContain(`Welcome ${users.validUser.username}`);
    });

    test('should be able to close login modal', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      expect(await loginPage.isLoginModalVisible()).toBe(true);
      
      await loginPage.closeLoginModal();
      expect(await loginPage.isLoginModalVisible()).toBe(false);
    });
  });

  test.describe('Negative Tests', () => {
    test('should show error for invalid credentials', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert(users.invalidCredentials);
      
      expect(alertMessage.toLowerCase()).toContain('wrong password');
    });

    test('should show error for non-existent user', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert(users.nonExistentUser);
      
      expect(alertMessage.toLowerCase()).toContain('user does not exist');
    });

    test('should show error for empty username', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert({
        username: '',
        password: 'somepassword'
      });
      
      expect(alertMessage.toLowerCase()).toContain('please fill out');
    });

    test('should show error for empty password', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert({
        username: 'someuser',
        password: ''
      });
      
      expect(alertMessage.toLowerCase()).toContain('please fill out');
    });

    test('should show error for empty credentials', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert(users.emptyCredentials);
      
      expect(alertMessage.toLowerCase()).toContain('please fill out');
    });
  });

  test.describe('Security Tests', () => {
    test('should handle SQL injection attempt', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert(users.sqlInjection);
      
      // Should not allow SQL injection - should show error or be handled gracefully
      expect(alertMessage).toBeTruthy();
      expect(await loginPage.verifyLoggedIn()).toBe(false);
    });

    test('should handle XSS attempt', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      const alertMessage = await loginPage.loginWithAlert(users.xssAttempt);
      
      // Should handle XSS gracefully
      expect(alertMessage).toBeTruthy();
      expect(await loginPage.verifyLoggedIn()).toBe(false);
    });
  });

  test.describe('Signup Tests', () => {
    test('should signup successfully with new user', async ({ loginPage }) => {
      const newUser = {
        username: generateRandomUsername(),
        password: 'testpass123'
      };

      await loginPage.openSignupModal();
      const alertMessage = await loginPage.signup(newUser);
      
      expect(alertMessage.toLowerCase()).toContain('sign up successful');
    });

    test('should show error when signing up with existing username', async ({ loginPage }) => {
      await loginPage.openSignupModal();
      const alertMessage = await loginPage.signup(users.validUser);
      
      expect(alertMessage.toLowerCase()).toContain('already exist');
    });

    test('should show error for empty signup fields', async ({ loginPage }) => {
      await loginPage.openSignupModal();
      const alertMessage = await loginPage.signup(users.emptyCredentials);
      
      expect(alertMessage.toLowerCase()).toContain('please fill out');
    });
  });

  test.describe('UI/UX Tests', () => {
    test('should display login modal with all required fields', async ({ loginPage }) => {
      await loginPage.openLoginModal();
      
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
      await expect(loginPage.closeButton).toBeVisible();
    });

    test('should display signup modal with all required fields', async ({ loginPage }) => {
      await loginPage.openSignupModal();
      
      await expect(loginPage.signupUsernameInput).toBeVisible();
      await expect(loginPage.signupPasswordInput).toBeVisible();
      await expect(loginPage.signupButton).toBeVisible();
    });
  });
});
