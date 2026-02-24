/**
 * HomePage - DemoBlaze Home Page Object
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';
import { ProductCategory } from '../types';

export class HomePage extends BasePage {
  readonly header: HeaderComponent;

  // Category locators
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;

  // Product grid
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  // Pagination
  readonly nextButton: Locator;
  readonly previousButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    // Categories
    this.phonesCategory = page.locator('a').filter({ hasText: 'Phones' });
    this.laptopsCategory = page.locator('a').filter({ hasText: 'Laptops' });
    this.monitorsCategory = page.locator('a').filter({ hasText: 'Monitors' });

    // Products
    this.productCards = page.locator('.card');
    this.productNames = page.locator('.card-title a');
    this.productPrices = page.locator('.card h5');

    // Pagination
    this.nextButton = page.locator('#next2');
    this.previousButton = page.locator('#prev2');
  }

  async open(): Promise<void> {
    logger.info('Opening DemoBlaze homepage');
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async selectCategory(category: ProductCategory): Promise<void> {
    logger.info(`Selecting category: ${category}`);
    switch (category) {
      case 'phone':
        await this.phonesCategory.click();
        break;
      case 'laptop':
        await this.laptopsCategory.click();
        break;
      case 'monitor':
        await this.monitorsCategory.click();
        break;
    }
    await this.page.waitForTimeout(1000); // Wait for products to load
  }

  async getProductCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.productCards.count();
  }

  async clickProductByName(productName: string): Promise<void> {
    logger.info(`Clicking on product: ${productName}`);
    const product = this.page.locator('.card-title a').filter({ hasText: productName });
    await product.click();
  }

  async clickProductByIndex(index: number): Promise<void> {
    logger.info(`Clicking on product at index: ${index}`);
    await this.productNames.nth(index).click();
  }

  /**
   * Click a random product from the currently displayed product list.
   * Returns the name of the product that was clicked.
   */
  async clickRandomProduct(): Promise<string> {
    await this.page.waitForTimeout(1000); // ensure products are loaded
    const count = await this.productNames.count();
    if (count === 0) throw new Error('No products found on the page');
    const randomIndex = Math.floor(Math.random() * count);
    const name = (await this.productNames.nth(randomIndex).textContent() || '').trim();
    logger.info(`Clicking random product [${randomIndex}/${count}]: ${name}`);
    await this.productNames.nth(randomIndex).click();
    return name;
  }

  async getProductNames(): Promise<string[]> {
    await this.page.waitForTimeout(500);
    return await this.productNames.allTextContents();
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForTimeout(1000);
  }

  async clickPrevious(): Promise<void> {
    await this.previousButton.click();
    await this.page.waitForTimeout(1000);
  }

  async isOnHomePage(): Promise<boolean> {
    return this.page.url().includes('demoblaze.com') && 
           (this.page.url().endsWith('/') || this.page.url().includes('index'));
  }
}
