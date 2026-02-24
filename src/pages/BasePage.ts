/**
 * BasePage - Base class for all Page Objects
 */
import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import config from '../config/env.config';

export abstract class BasePage {
  readonly page: Page;
  readonly timeout: number;

  constructor(page: Page) {
    this.page = page;
    this.timeout = config.timeout;
  }

  /**
   * Navigate to the page URL
   */
  async navigate(path: string = ''): Promise<void> {
    const url = `${config.baseUrl}${path}`;
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeout || this.timeout });
  }

  /**
   * Click element with retry
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.waitForElement(locator);
    await locator.click();
  }

  /**
   * Fill input field
   */
  async fillInput(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Get element text
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return (await locator.textContent()) || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator, timeout?: number): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: timeout || 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handle browser alert/dialog
   */
  async handleAlert(action: 'accept' | 'dismiss' = 'accept'): Promise<string> {
    return new Promise((resolve) => {
      this.page.once('dialog', async (dialog) => {
        const message = dialog.message();
        logger.info(`Alert message: ${message}`);
        if (action === 'accept') {
          await dialog.accept();
        } else {
          await dialog.dismiss();
        }
        resolve(message);
      });
    });
  }

  /**
   * Wait for alert and get message
   */
  async waitForAlertWithMessage(expectedMessage?: string): Promise<string> {
    const alertPromise = this.handleAlert('accept');
    const message = await alertPromise;
    if (expectedMessage) {
      expect(message).toContain(expectedMessage);
    }
    return message;
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
    logger.info(`Screenshot saved: ${name}.png`);
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
