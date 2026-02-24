/**
 * Modal Component - Reusable modal dialog handler
 */
import { Page, Locator } from '@playwright/test';
import { logger } from '../../utils/logger';

export class ModalComponent {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getModal(modalId: string): Locator {
    return this.page.locator(`#${modalId}`);
  }

  getModalTitle(modalId: string): Locator {
    return this.page.locator(`#${modalId} .modal-title`);
  }

  getCloseButton(modalId: string): Locator {
    return this.page.locator(`#${modalId} button.close`);
  }

  async waitForModalVisible(modalId: string): Promise<void> {
    await this.getModal(modalId).waitFor({ state: 'visible' });
    logger.info(`Modal ${modalId} is visible`);
  }

  async waitForModalHidden(modalId: string): Promise<void> {
    await this.getModal(modalId).waitFor({ state: 'hidden' });
    logger.info(`Modal ${modalId} is hidden`);
  }

  async closeModal(modalId: string): Promise<void> {
    await this.getCloseButton(modalId).click();
    await this.waitForModalHidden(modalId);
  }
}
