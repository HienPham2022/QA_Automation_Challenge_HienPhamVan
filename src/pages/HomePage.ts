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
    const categoryClick = async () => {
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
    };
    // Wait for the /bycat API response; catch timeout in case
    // products are already loaded (e.g., Phones shown by default on homepage).
    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/bycat') && resp.status() === 200,
        { timeout: 5000 },
      ).catch(() => {
        logger.info(`No /bycat response for '${category}' – products may already be loaded`);
      }),
      categoryClick(),
    ]);
    // Ensure at least one product card is visible before proceeding
    await this.productNames.first().waitFor({ state: 'visible', timeout: 10000 });
    // Brief pause for DOM to finish rendering remaining cards
    await this.page.waitForTimeout(500);
  }

  async getProductCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.productCards.count();
  }

  async clickProductByName(productName: string): Promise<void> {
    logger.info(`Clicking on product: ${productName}`);
    const product = this.page.locator('.card-title a').filter({ hasText: productName }).first();
    // Extract href and navigate directly to avoid Playwright click-navigation timing issues
    const href = await product.getAttribute('href');
    if (!href) throw new Error(`Product link not found for: ${productName}`);
    const url = href.startsWith('http') ? href : new URL(href, this.page.url()).href;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.locator('.name').waitFor({ state: 'visible', timeout: 15000 });
  }

  async clickProductByIndex(index: number): Promise<void> {
    logger.info(`Clicking on product at index: ${index}`);
    // Extract href and navigate directly to avoid Playwright click-navigation timing issues
    const href = await this.productNames.nth(index).getAttribute('href');
    if (!href) throw new Error(`Product link not found at index: ${index}`);
    const url = href.startsWith('http') ? href : new URL(href, this.page.url()).href;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.locator('.name').waitFor({ state: 'visible', timeout: 15000 });
  }

  /**
   * Click a random product from the currently displayed product list.
   * Returns the name of the product that was clicked.
   */
  async clickRandomProduct(): Promise<string> {
    // Wait for at least one product card to appear in the DOM
    await this.productNames.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500); // let remaining cards render
    const count = await this.productNames.count();
    if (count === 0) throw new Error('No products found on the page');
    const randomIndex = Math.floor(Math.random() * count);
    const name = (await this.productNames.nth(randomIndex).textContent() || '').trim();
    logger.info(`Clicking random product [${randomIndex}/${count}]: ${name}`);
    // Extract href and navigate directly to avoid Playwright click-navigation timing issues
    const href = await this.productNames.nth(randomIndex).getAttribute('href');
    if (!href) throw new Error(`Product link not found at index: ${randomIndex}`);
    const url = href.startsWith('http') ? href : new URL(href, this.page.url()).href;
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.locator('.name').waitFor({ state: 'visible', timeout: 15000 });
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
