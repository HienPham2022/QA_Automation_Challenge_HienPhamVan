/**
 * LoginPage - DemoBlaze Login Modal Page Object
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';
import { UserCredentials } from '../types';

export class LoginPage extends BasePage {
  readonly header: HeaderComponent;

  // Login Modal
  readonly loginModal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly closeButton: Locator;

  // Signup Modal
  readonly signupModal: Locator;
  readonly signupUsernameInput: Locator;
  readonly signupPasswordInput: Locator;
  readonly signupButton: Locator;
  readonly signupCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    // Login modal elements
    this.loginModal = page.locator('#logInModal');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.locator('button').filter({ hasText: 'Log in' });
    this.closeButton = page.locator('#logInModal .btn-secondary');

    // Signup modal elements
    this.signupModal = page.locator('#signInModal');
    this.signupUsernameInput = page.locator('#sign-username');
    this.signupPasswordInput = page.locator('#sign-password');
    this.signupButton = page.locator('button').filter({ hasText: 'Sign up' });
    this.signupCloseButton = page.locator('#signInModal .btn-secondary');
  }

  async openLoginModal(): Promise<void> {
    logger.info('Opening login modal');
    await this.header.clickLogin();
    await this.loginModal.waitFor({ state: 'visible' });
  }

  async openSignupModal(): Promise<void> {
    logger.info('Opening signup modal');
    await this.header.clickSignup();
    await this.signupModal.waitFor({ state: 'visible' });
  }

  async login(credentials: UserCredentials): Promise<void> {
    logger.info(`Logging in with username: ${credentials.username}`);
    await this.fillInput(this.usernameInput, credentials.username);
    await this.fillInput(this.passwordInput, credentials.password);
    await this.loginButton.click();
  }

  async loginWithAlert(credentials: UserCredentials): Promise<string> {
    logger.info(`Logging in (expecting alert) with username: ${credentials.username}`);
    const alertPromise = this.handleAlert('accept');
    await this.fillInput(this.usernameInput, credentials.username);
    await this.fillInput(this.passwordInput, credentials.password);
    await this.loginButton.click();
    return await alertPromise;
  }

  async signup(credentials: UserCredentials): Promise<string> {
    logger.info(`Signing up with username: ${credentials.username}`);
    const alertPromise = this.handleAlert('accept');
    await this.fillInput(this.signupUsernameInput, credentials.username);
    await this.fillInput(this.signupPasswordInput, credentials.password);
    await this.signupButton.click();
    return await alertPromise;
  }

  async closeLoginModal(): Promise<void> {
    await this.closeButton.click();
    await this.loginModal.waitFor({ state: 'hidden' });
  }

  async closeSignupModal(): Promise<void> {
    await this.signupCloseButton.click();
    await this.signupModal.waitFor({ state: 'hidden' });
  }

  async verifyLoginSuccess(username: string): Promise<void> {
    logger.info('Verifying login success');
    await this.header.welcomeUser.waitFor({ state: 'visible', timeout: 10000 });
    const welcomeText = await this.header.getWelcomeMessage();
    expect(welcomeText).toContain(username);
  }

  async verifyLoggedIn(): Promise<boolean> {
    return await this.header.isLoggedIn();
  }

  async logout(): Promise<void> {
    logger.info('Logging out');
    await this.header.clickLogout();
    await this.header.loginLink.waitFor({ state: 'visible' });
  }

  async isLoginModalVisible(): Promise<boolean> {
    return await this.isVisible(this.loginModal);
  }

  async isSignupModalVisible(): Promise<boolean> {
    return await this.isVisible(this.signupModal);
  }
}
