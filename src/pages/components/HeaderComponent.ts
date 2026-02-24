/**
 * Header Component - Navigation and common header elements
 */
import { Page, Locator } from '@playwright/test';
import { logger } from '../../utils/logger';

export class HeaderComponent {
  readonly page: Page;

  // Locators
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly contactLink: Locator;
  readonly aboutUsLink: Locator;
  readonly cartLink: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutLink: Locator;
  readonly welcomeUser: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('#nava');
    this.homeLink = page.locator('.nav-link').filter({ hasText: 'Home' });
    this.contactLink = page.locator('a[data-target="#exampleModal"]');
    this.aboutUsLink = page.locator('a[data-target="#videoModal"]');
    this.cartLink = page.locator('#cartur');
    this.loginLink = page.locator('#login2');
    this.signupLink = page.locator('#signin2');
    this.logoutLink = page.locator('#logout2');
    this.welcomeUser = page.locator('#nameofuser');
  }

  async clickLogo(): Promise<void> {
    logger.info('Clicking on logo');
    await this.logo.click();
  }

  async clickHome(): Promise<void> {
    logger.info('Clicking on Home link');
    await this.homeLink.click();
  }

  async clickCart(): Promise<void> {
    logger.info('Clicking on Cart link');
    await this.cartLink.click();
  }

  async clickLogin(): Promise<void> {
    logger.info('Clicking on Login link');
    await this.loginLink.click();
  }

  async clickSignup(): Promise<void> {
    logger.info('Clicking on Signup link');
    await this.signupLink.click();
  }

  async clickLogout(): Promise<void> {
    logger.info('Clicking on Logout link');
    await this.logoutLink.click();
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      await this.welcomeUser.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getWelcomeMessage(): Promise<string> {
    return (await this.welcomeUser.textContent()) || '';
  }
}
