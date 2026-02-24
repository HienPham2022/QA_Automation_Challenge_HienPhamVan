/**
 * E2E Flow Tests
 * Complete purchase journeys from start to finish
 */
import { test, expect } from '../../src/fixtures';
import users from '../../test-data/users.json';
import products from '../../test-data/products.json';
import orders from '../../test-data/orders.json';

test.describe('End-to-End Flow Tests @e2e', () => {
  test.describe('Complete Purchase Journey', () => {
    test('should complete purchase as logged-in user', async ({ 
      homePage, 
      loginPage, 
      productPage, 
      cartPage 
    }) => {
      // Step 1: Login
      await homePage.open();
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      await loginPage.verifyLoginSuccess(users.validUser.username);
      
      // Step 2: Browse and select product
      await homePage.open();
      const product = products.phones[0];
      await homePage.clickProductByName(product.name);
      
      // Step 3: Add to cart
      await productPage.addToCartAndVerify();
      
      // Step 4: Go to cart
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(1);
      expect(cartItems[0].name).toBe(product.name);
      
      // Step 5: Place order
      const confirmation = await cartPage.completePurchase(orders.validOrder);
      
      // Step 6: Verify order confirmation
      expect(confirmation).toContain('Amount');
      expect(confirmation).toContain(orders.validOrder.creditCard);
      expect(confirmation).toContain(orders.validOrder.name);
      
      // Step 7: Close confirmation and verify
      await cartPage.closeConfirmation();
      expect(await homePage.isOnHomePage()).toBe(true);
    });

    test('should complete purchase with multiple items', async ({ 
      homePage, 
      productPage, 
      cartPage 
    }) => {
      const productsToAdd = [products.phones[0], products.laptops[0]];
      const expectedTotal = productsToAdd.reduce((sum, p) => sum + p.price, 0);
      
      // Add multiple products
      for (const product of productsToAdd) {
        await homePage.open();
        await homePage.clickProductByName(product.name);
        await productPage.addToCartAndVerify();
      }
      
      // Go to cart and verify
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(2);
      
      const total = await cartPage.getTotalPrice();
      expect(total).toBe(expectedTotal);
      
      // Complete purchase
      const confirmation = await cartPage.completePurchase(orders.validOrder);
      expect(confirmation).toContain(String(expectedTotal));
      
      await cartPage.closeConfirmation();
    });

    test('should complete purchase as guest user', async ({ 
      homePage, 
      productPage, 
      cartPage,
      loginPage
    }) => {
      // Ensure not logged in
      await homePage.open();
      const isLoggedIn = await loginPage.verifyLoggedIn();
      if (isLoggedIn) {
        await loginPage.logout();
      }
      
      // Browse and add product
      await homePage.open();
      await homePage.clickProductByName(products.monitors[0].name);
      await productPage.addToCartAndVerify();
      
      // Complete purchase without login
      await cartPage.navigateToCart();
      const confirmation = await cartPage.completePurchase(orders.validOrder);
      
      expect(confirmation).toContain('Amount');
      await cartPage.closeConfirmation();
    });
  });

  test.describe('Purchase Flow Variations', () => {
    test('should handle random product selection from each category', async ({ 
      homePage, 
      productPage, 
      cartPage 
    }) => {
      const selectedProducts: string[] = [];

      // Add random phone
      await homePage.open();
      await homePage.selectCategory('phone');
      selectedProducts.push(await homePage.clickRandomProduct());
      await productPage.addToCartAndVerify();

      // Add random laptop
      await homePage.open();
      await homePage.selectCategory('laptop');
      selectedProducts.push(await homePage.clickRandomProduct());
      await productPage.addToCartAndVerify();

      // Add random monitor
      await homePage.open();
      await homePage.selectCategory('monitor');
      selectedProducts.push(await homePage.clickRandomProduct());
      await productPage.addToCartAndVerify();

      // Verify cart has 3 items
      await cartPage.navigateToCart();
      const cartItems = await cartPage.getCartItems();
      expect(cartItems.length).toBe(3);

      // Verify each selected product is present
      const itemNames = cartItems.map(item => item.name);
      for (const name of selectedProducts) {
        expect(itemNames).toContain(name);
      }

      // Complete purchase
      const confirmation = await cartPage.completePurchase(orders.validOrder);
      expect(confirmation).toBeTruthy();
      await cartPage.closeConfirmation();
    });

    test('should allow removing item before purchase', async ({ 
      homePage, 
      productPage, 
      cartPage 
    }) => {
      const productsToAdd = [products.phones[0], products.phones[1]];
      
      // Add products
      for (const product of productsToAdd) {
        await homePage.open();
        await homePage.clickProductByName(product.name);
        await productPage.addToCartAndVerify();
      }
      
      // Go to cart and remove one item
      await cartPage.navigateToCart();
      await cartPage.deleteItemByIndex(0);
      
      // Verify one item remains
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBe(1);
      
      // Complete purchase with remaining item
      const confirmation = await cartPage.completePurchase(orders.validOrder);
      expect(confirmation).toBeTruthy();
      await cartPage.closeConfirmation();
    });
  });

  test.describe('Login and Cart Persistence', () => {
    test('should maintain cart after login', async ({ 
      homePage, 
      loginPage, 
      productPage, 
      cartPage 
    }) => {
      // Add product before login
      await homePage.open();
      await homePage.clickProductByName(products.phones[0].name);
      await productPage.addToCartAndVerify();
      
      // Login
      await homePage.open();
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      await loginPage.verifyLoginSuccess(users.validUser.username);
      
      // Verify cart still has the item
      await cartPage.navigateToCart();
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    });

    test('should maintain cart after logout and re-login', async ({ 
      homePage, 
      loginPage, 
      productPage, 
      cartPage 
    }) => {
      // Login first
      await homePage.open();
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      await loginPage.verifyLoginSuccess(users.validUser.username);
      
      // Add product
      await homePage.open();
      await homePage.clickProductByName(products.phones[0].name);
      await productPage.addToCartAndVerify();
      
      // Get initial cart count
      await cartPage.navigateToCart();
      const initialCount = await cartPage.getCartItemCount();
      
      // Logout
      await loginPage.logout();
      
      // Login again
      await loginPage.openLoginModal();
      await loginPage.login(users.validUser);
      await loginPage.verifyLoginSuccess(users.validUser.username);
      
      // Verify cart - items should persist
      await cartPage.navigateToCart();
      const finalCount = await cartPage.getCartItemCount();
      expect(finalCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle placing order with minimal form data', async ({ 
      homePage, 
      productPage, 
      cartPage 
    }) => {
      await homePage.open();
      await homePage.clickProductByName(products.phones[0].name);
      await productPage.addToCartAndVerify();
      
      await cartPage.navigateToCart();
      
      // Use minimal order info
      const confirmation = await cartPage.completePurchase(orders.minimalOrder);
      expect(confirmation).toBeTruthy();
      await cartPage.closeConfirmation();
    });

    test('should show product details correctly before adding to cart', async ({ 
      homePage, 
      productPage 
    }) => {
      const expectedProduct = products.phones[0];
      
      await homePage.open();
      await homePage.clickProductByName(expectedProduct.name);
      
      const details = await productPage.getProductDetails();
      
      expect(details.name).toContain(expectedProduct.name);
      expect(details.price).toBe(expectedProduct.price);
      expect(details.description).toBeTruthy();
    });
  });
});
