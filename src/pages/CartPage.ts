/**
 * CartPage - DemoBlaze Shopping Cart Page Object
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from './components/HeaderComponent';
import { logger } from '../utils/logger';
import { CartItem, OrderInfo } from '../types';
import { parsePrice } from '../utils/helpers';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;

  // Cart table
  readonly cartTable: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly deleteButtons: Locator;
  readonly totalPrice: Locator;

  // Place Order Modal
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly creditCardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly closeOrderModalButton: Locator;

  // Confirmation
  readonly confirmationModal: Locator;
  readonly confirmationMessage: Locator;
  readonly okButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    // Cart elements
    this.cartTable = page.locator('#tbodyid');
    this.cartItems = page.locator('#tbodyid tr');
    this.cartItemNames = page.locator('#tbodyid tr td:nth-child(2)');
    this.cartItemPrices = page.locator('#tbodyid tr td:nth-child(3)');
    this.deleteButtons = page.locator('#tbodyid tr td:nth-child(4) a');
    this.totalPrice = page.locator('#totalp');

    // Order modal elements
    this.placeOrderButton = page.locator('button').filter({ hasText: 'Place Order' });
    this.orderModal = page.locator('#orderModal');
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.creditCardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.locator('button').filter({ hasText: 'Purchase' });
    this.closeOrderModalButton = page.locator('#orderModal .btn-secondary');

    // Confirmation
    this.confirmationModal = page.locator('.sweet-alert');
    this.confirmationMessage = page.locator('.sweet-alert p');
    this.okButton = page.locator('.sweet-alert .confirm');
  }

  async open(): Promise<void> {
    logger.info('Opening cart page');
    await this.navigate('/cart.html');
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    await this.header.clickCart();
    await this.waitForPageLoad();
    await this.page.waitForTimeout(1000); // Wait for cart items to load
  }

  async getCartItemCount(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.cartItems.count();
  }

  async getCartItems(): Promise<CartItem[]> {
    await this.page.waitForTimeout(500);
    const items: CartItem[] = [];
    const count = await this.cartItems.count();

    for (let i = 0; i < count; i++) {
      const name = await this.cartItemNames.nth(i).textContent() || '';
      const priceText = await this.cartItemPrices.nth(i).textContent() || '';
      items.push({
        name: name.trim(),
        price: parsePrice(priceText),
      });
    }

    return items;
  }

  async getCartItemNames(): Promise<string[]> {
    await this.page.waitForTimeout(500);
    return await this.cartItemNames.allTextContents();
  }

  async getTotalPrice(): Promise<number> {
    const totalText = await this.totalPrice.textContent() || '0';
    return parsePrice(totalText);
  }

  async deleteItemByIndex(index: number): Promise<void> {
    logger.info(`Deleting cart item at index: ${index}`);
    await this.deleteButtons.nth(index).click();
    await this.page.waitForTimeout(1000); // Wait for item to be removed
  }

  async deleteItemByName(productName: string): Promise<void> {
    logger.info(`Deleting cart item: ${productName}`);
    const row = this.page.locator('#tbodyid tr').filter({ hasText: productName });
    await row.locator('a').filter({ hasText: 'Delete' }).click();
    await this.page.waitForTimeout(1000);
  }

  async clearCart(): Promise<void> {
    logger.info('Clearing all items from cart');
    let itemCount = await this.getCartItemCount();
    while (itemCount > 0) {
      await this.deleteItemByIndex(0);
      itemCount = await this.getCartItemCount();
    }
  }

  async clickPlaceOrder(): Promise<void> {
    logger.info('Clicking Place Order button');
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
  }

  async fillOrderForm(orderInfo: OrderInfo): Promise<void> {
    logger.info('Filling order form');
    await this.fillInput(this.nameInput, orderInfo.name);
    await this.fillInput(this.countryInput, orderInfo.country);
    await this.fillInput(this.cityInput, orderInfo.city);
    await this.fillInput(this.creditCardInput, orderInfo.creditCard);
    await this.fillInput(this.monthInput, orderInfo.month);
    await this.fillInput(this.yearInput, orderInfo.year);
  }

  async completePurchase(orderInfo: OrderInfo): Promise<string> {
    await this.clickPlaceOrder();
    await this.fillOrderForm(orderInfo);
    await this.purchaseButton.click();
    
    // Wait for confirmation modal
    await this.confirmationModal.waitFor({ state: 'visible' });
    const confirmationText = await this.confirmationMessage.textContent() || '';
    logger.info(`Order confirmation: ${confirmationText}`);
    
    return confirmationText;
  }

  async closeConfirmation(): Promise<void> {
    await this.okButton.click();
    await this.confirmationModal.waitFor({ state: 'hidden' });
  }

  async verifyOrderConfirmation(): Promise<void> {
    await expect(this.confirmationModal).toBeVisible();
    const text = await this.confirmationMessage.textContent();
    expect(text).toBeTruthy();
  }

  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  async isOnCartPage(): Promise<boolean> {
    return this.page.url().includes('cart.html');
  }
}
