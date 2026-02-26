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
    // Wait for the /viewcart API response; catch timeout in case the
    // response was already cached or the page loaded the cart data early.
    await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/viewcart') && resp.status() === 200,
        { timeout: 5000 },
      ).catch(() => {
        logger.info('No /viewcart response detected – cart data may already be loaded');
      }),
      this.header.clickCart(),
    ]);
    await this.waitForPageLoad();
    // Wait for cart table to be present before proceeding
    await this.cartTable.waitFor({ state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(1000); // Wait for cart items to render
  }

  async getCartItemCount(): Promise<number> {
    // Wait for cart table body to be present, then give items time to render.
    await this.cartTable.waitFor({ state: 'attached', timeout: 10000 });
    // DemoBlaze loads cart items asynchronously; poll until stable.
    let count = 0;
    let stable = 0;
    for (let i = 0; i < 10; i++) {
      await this.page.waitForTimeout(500);
      const current = await this.cartItems.count();
      if (current === count && current > 0) {
        stable++;
        if (stable >= 2) break; // count unchanged twice in a row
      } else {
        count = current;
        stable = 0;
      }
    }
    return count;
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
    // Wait for the total element to be attached
    await this.totalPrice.waitFor({ state: 'attached', timeout: 10000 });

    // Wait for page to settle – DemoBlaze loads cart items asynchronously.
    // We wait until EITHER the total appears OR the cart is confirmed empty
    // (no rows in table body AND loading is done).
    const hasTotal = await this.page.waitForFunction(
      () => {
        const totalEl = document.querySelector('#totalp');
        const rows = document.querySelectorAll('#tbodyid tr');

        // Case 1: total has a value → cart has item(s)
        if (totalEl && totalEl.textContent && totalEl.textContent.trim().length > 0) {
          return 'has-total';
        }
        // Case 2: no rows at all → empty cart, total will stay blank
        if (rows.length === 0) {
          return 'empty';
        }
        // Still loading – keep waiting
        return false;
      },
      { timeout: 15000 },
    );

    const result = await hasTotal.jsonValue();
    if (result === 'empty') {
      return 0;
    }

    const totalText = await this.totalPrice.textContent() || '0';
    return parsePrice(totalText);
  }

  async deleteItemByIndex(index: number): Promise<void> {
    logger.info(`Deleting cart item at index: ${index}`);

    // Click delete and wait for the server-side delete to complete
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/deleteitem') && resp.status() === 200,
        { timeout: 10000 },
      ),
      this.deleteButtons.nth(index).click(),
    ]);

    // Navigate fresh to the cart page and wait for cart data to fully load
    await this.navigateToCartFresh();
  }

  async deleteItemByName(productName: string): Promise<void> {
    logger.info(`Deleting cart item: ${productName}`);
    const row = this.page.locator('#tbodyid tr').filter({ hasText: productName });

    // Click delete and wait for the server-side delete to complete
    const [response] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/deleteitem') && resp.status() === 200,
        { timeout: 10000 },
      ),
      row.locator('a').filter({ hasText: 'Delete' }).click(),
    ]);

    // Navigate fresh to the cart page and wait for cart data to fully load
    await this.navigateToCartFresh();
  }

  /**
   * Navigate to the cart page and wait for the /viewcart API response
   * to ensure all cart items are fully loaded in the DOM.
   */
  private async navigateToCartFresh(): Promise<void> {
    const [viewcartResponse] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes('/viewcart') && resp.status() === 200,
        { timeout: 15000 },
      ),
      this.navigate('/cart.html'),
    ]);
    // Give the DOM time to render the items from the viewcart response
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

  async verifyDeleteButtonsVisible(): Promise<boolean> {
    const count = await this.getCartItemCount();
    if (count === 0) return true; // Empty cart has no delete buttons needed
    
    const deleteButtonCount = await this.deleteButtons.count();
    return deleteButtonCount === count;
  }
}
