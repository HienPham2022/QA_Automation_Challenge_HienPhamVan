/**
 * ProductPage - DemoBlaze Product Detail Page Object
 */
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';
import { Product } from '../types';
import { parsePrice } from '../utils/helpers';

export class ProductPage extends BasePage {
  readonly header: HeaderComponent;

  // Product details
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;

  // Actions
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    this.productName = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.productDescription = page.locator('#more-information p');
    this.productImage = page.locator('.product-image img');
    this.addToCartButton = page.locator('a').filter({ hasText: 'Add to cart' });
  }

  async getProductDetails(): Promise<Product> {
    const name = await this.getText(this.productName);
    const priceText = await this.getText(this.productPrice);
    const description = await this.productDescription.textContent() || '';

    return {
      name: name.trim(),
      price: parsePrice(priceText),
      description: description.trim(),
    };
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) || '';
  }

  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent() || '';
    return parsePrice(priceText);
  }

  async addToCart(): Promise<string> {
    logger.info('Adding product to cart');
    const alertPromise = this.handleAlert('accept');
    await this.addToCartButton.click();
    const message = await alertPromise;
    logger.info(`Alert message: ${message}`);
    return message;
  }

  async addToCartAndVerify(): Promise<void> {
    const message = await this.addToCart();
    if (!message.toLowerCase().includes('added')) {
      throw new Error(`Unexpected alert message: ${message}`);
    }
  }

  async isOnProductPage(): Promise<boolean> {
    return this.page.url().includes('prod.html');
  }
}
