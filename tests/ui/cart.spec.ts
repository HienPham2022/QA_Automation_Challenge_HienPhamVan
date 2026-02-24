/**
 * Cart Module Tests
 * Covers: Add to cart, Delete from cart, Cart calculations, Categories
 */
import { test, expect } from '../../src/fixtures';
import products from '../../test-data/products.json';

test.describe('Cart Module Tests @cart', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test.describe('Add to Cart Tests', () => {
    test('should add a single product to cart', async ({ homePage, productPage, cartPage }) => {
      const product = products.phones[0];
      
      await homePage.clickProductByName(product.name);
      await productPage.addToCartAndVerify();
      
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();
      
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].name).toBe(product.name);
    });

    test('should add multiple products to cart', async ({ homePage, productPage, cartPage }) => {
      const productsToAdd = [products.phones[0], products.phones[1]];
      
      // Add first product
      await homePage.clickProductByName(productsToAdd[0].name);
      await productPage.addToCartAndVerify();
      
      // Go back and add second product
      await homePage.open();
      await homePage.clickProductByName(productsToAdd[1].name);
      await productPage.addToCartAndVerify();
      
      // Verify cart
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();
      
      expect(cartItems.length).toBe(2);
    });

    test('should add a random product from each category to cart', async ({ homePage, productPage, cartPage }) => {
      const selectedProducts: string[] = [];

      // Add random phone
      await homePage.selectCategory('phone');
      const phoneName = await homePage.clickRandomProduct();
      selectedProducts.push(phoneName);
      await productPage.addToCartAndVerify();

      // Add random laptop
      await homePage.open();
      await homePage.selectCategory('laptop');
      const laptopName = await homePage.clickRandomProduct();
      selectedProducts.push(laptopName);
      await productPage.addToCartAndVerify();

      // Add random monitor
      await homePage.open();
      await homePage.selectCategory('monitor');
      const monitorName = await homePage.clickRandomProduct();
      selectedProducts.push(monitorName);
      await productPage.addToCartAndVerify();

      // Verify cart contains all 3 products
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();

      expect(cartItems.length).toBe(3);
      const itemNames = cartItems.map(item => item.name);
      for (const name of selectedProducts) {
        expect(itemNames).toContain(name);
      }
    });

    test('should show correct product alert when adding to cart', async ({ homePage, productPage }) => {
      await homePage.clickProductByName(products.phones[0].name);
      const alertMessage = await productPage.addToCart();
      
      expect(alertMessage.toLowerCase()).toContain('added');
    });
  });

  test.describe('Delete from Cart Tests', () => {
    test.beforeEach(async ({ homePage, productPage }) => {
      // Add a product to cart before each delete test
      await homePage.clickProductByName(products.phones[0].name);
      await productPage.addToCartAndVerify();
    });

    test('should delete item from cart', async ({ cartPage }) => {
      await cartPage.navigateToCart();
      
      const initialCount = await cartPage.getCartItemCount();
      expect(initialCount).toBe(1);
      
      await cartPage.deleteItemByIndex(0);
      
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBe(0);
    });

    test('should delete specific item by name', async ({ homePage, productPage, cartPage }) => {
      // Add another product
      await homePage.open();
      await homePage.clickProductByName(products.phones[1].name);
      await productPage.addToCartAndVerify();
      
      await cartPage.navigateToCart();
      
      // Delete first product
      await cartPage.deleteItemByName(products.phones[0].name);
      
      const remainingItems = await cartPage.getCartItemNames();
      expect(remainingItems).not.toContain(products.phones[0].name);
      expect(remainingItems.some(name => name.includes(products.phones[1].name))).toBe(true);
    });

    test('should clear entire cart', async ({ homePage, productPage, cartPage }) => {
      // Add more products
      await homePage.open();
      await homePage.clickProductByName(products.phones[1].name);
      await productPage.addToCartAndVerify();
      
      await cartPage.navigateToCart();
      await cartPage.clearCart();
      
      expect(await cartPage.isCartEmpty()).toBe(true);
    });
  });

  test.describe('Cart Total Calculation Tests', () => {
    test('should calculate correct total for single item', async ({ homePage, productPage, cartPage }) => {
      const product = products.phones[0];
      
      await homePage.clickProductByName(product.name);
      await productPage.addToCartAndVerify();
      
      await cartPage.navigateToCart();
      const total = await cartPage.getTotalPrice();
      
      expect(total).toBe(product.price);
    });

    test('should calculate correct total for multiple items', async ({ homePage, productPage, cartPage }) => {
      const productsToAdd = [products.phones[0], products.phones[1]];
      const expectedTotal = productsToAdd.reduce((sum, p) => sum + p.price, 0);
      
      for (const product of productsToAdd) {
        await homePage.open();
        await homePage.clickProductByName(product.name);
        await productPage.addToCartAndVerify();
      }
      
      await cartPage.navigateToCart();
      const total = await cartPage.getTotalPrice();
      
      expect(total).toBe(expectedTotal);
    });

    test('should update total after deleting item', async ({ homePage, productPage, cartPage }) => {
      const productsToAdd = [products.phones[0], products.phones[1]];
      
      for (const product of productsToAdd) {
        await homePage.open();
        await homePage.clickProductByName(product.name);
        await productPage.addToCartAndVerify();
      }
      
      await cartPage.navigateToCart();
      
      // Delete first item
      await cartPage.deleteItemByIndex(0);
      
      // Wait for total to update
      await cartPage.page.waitForTimeout(1000);
      const total = await cartPage.getTotalPrice();
      
      // Total should be the price of the remaining item
      expect(total).toBe(productsToAdd[1].price);
    });
  });

  test.describe('Category Navigation Tests', () => {
    test('should display phones category', async ({ homePage }) => {
      await homePage.selectCategory('phone');
      const productNames = await homePage.getProductNames();
      
      expect(productNames.length).toBeGreaterThan(0);
    });

    test('should display laptops category', async ({ homePage }) => {
      await homePage.selectCategory('laptop');
      const productNames = await homePage.getProductNames();
      
      expect(productNames.length).toBeGreaterThan(0);
    });

    test('should display monitors category', async ({ homePage }) => {
      await homePage.selectCategory('monitor');
      const productNames = await homePage.getProductNames();
      
      expect(productNames.length).toBeGreaterThan(0);
    });
  });

  test.describe('Product Details Tests', () => {
    test('should display correct product details', async ({ homePage, productPage }) => {
      const expectedProduct = products.phones[0];
      
      await homePage.clickProductByName(expectedProduct.name);
      
      const productName = await productPage.getProductName();
      const productPrice = await productPage.getProductPrice();
      
      expect(productName).toContain(expectedProduct.name);
      expect(productPrice).toBe(expectedProduct.price);
    });
  });
});
