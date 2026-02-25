/**
 * API Tests for DemoBlaze
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api';
import { generateRandomUsername } from '../../src/utils/helpers';
import { testUsers } from '../../src/config/env.config';

test.describe('API Tests @api', () => {
  let apiClient: ApiClient;

  test.beforeEach(async () => {
    // Fresh client for each test to avoid session sharing
    apiClient = new ApiClient();
    await apiClient.init();
  });

  test.afterEach(async () => {
    await apiClient.dispose();
  });

  test.describe('Product API', () => {
    test('should get all product entries', async () => {
      const response = await apiClient.getEntries();
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      const body = response.body as { Items: unknown[] };
      expect(Array.isArray(body.Items)).toBe(true);
      expect(body.Items.length).toBeGreaterThan(0);
    });

    test('should get product by ID and verify structure', async () => {
      const response = await apiClient.getProductById(1);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      
      // Verify product structure
      const product = response.body as { id: number; title: string; price: number; cat: string };
      expect(product.id).toBe(1);
      expect(product.title).toBeDefined();
      expect(product.price).toBeGreaterThan(0);
      expect(product.cat).toBeDefined();
    });

    test('should get products by category - phones', async () => {
      const response = await apiClient.getByCategory('phone');
      
      expect(response.status).toBe(200);
      const body = response.body as { Items: { cat: string }[] };
      expect(body.Items.every(item => item.cat === 'phone')).toBe(true);
    });

    test('should get products by category - laptops', async () => {
      const response = await apiClient.getByCategory('notebook');
      
      expect(response.status).toBe(200);
      const body = response.body as { Items: { cat: string }[] };
      expect(body.Items.every(item => item.cat === 'notebook')).toBe(true);
    });

    test('should get products by category - monitors', async () => {
      const response = await apiClient.getByCategory('monitor');
      
      expect(response.status).toBe(200);
      const body = response.body as { Items: { cat: string }[] };
      expect(body.Items.every(item => item.cat === 'monitor')).toBe(true);
    });

    test('should handle invalid category gracefully', async () => {
      const response = await apiClient.getByCategory('invalid_category');
      
      expect(response.status).toBe(200);
      const body = response.body as { Items: unknown[] };
      expect(body.Items.length).toBe(0);
    });
  });

  test.describe('Authentication API', () => {
    test('should signup new user', async () => {
      const username = generateRandomUsername();
      const response = await apiClient.signup(username, 'testpass123');
      
      expect(response.status).toBe(200);
    });

    test('should fail signup for existing user', async () => {
      const { username, password } = testUsers.validUser;
      const response = await apiClient.signup(username, password);
      
      expect(response.status).toBe(200);
      expect(response.body.toLowerCase()).toContain('already exist');
    });

    test('should login with valid credentials', async () => {
      const { username, password } = testUsers.validUser;
      const response = await apiClient.login(username, password);
      
      expect(response.status).toBe(200);
      expect(response.success).toBe(true);
      expect(response.body).toContain('Auth_token');
      expect(apiClient.user).toBe(username);
    });

    test('should fail login with invalid credentials', async () => {
      const response = await apiClient.login('invaliduser', 'wrongpassword');
      
      expect(response.status).toBe(200);
      expect(response.success).toBe(false);
      expect(response.body.toLowerCase()).toContain('wrong password');
    });

    test('should logout and create new guest session', async () => {
      const { username, password } = testUsers.validUser;
      await apiClient.login(username, password);
      expect(apiClient.user).toBe(username);
      
      apiClient.logout();
      expect(apiClient.user).toContain('guest_');
    });
  });

  test.describe('Cart API', () => {
    test('should add single item to cart', async () => {
      const response = await apiClient.addToCart(1);
      expect(response.status).toBe(200);
    });

    test('should add multiple items to cart', async () => {
      const response1 = await apiClient.addToCart(1);
      const response2 = await apiClient.addToCart(2);
      const response3 = await apiClient.addToCart(3);
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });

    test('should view cart returns valid response', async () => {
      const response = await apiClient.viewCart();
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    test('should view empty cart', async () => {
      // New session = empty cart
      const response = await apiClient.viewCart();
      
      expect(response.status).toBe(200);
      const body = response.body as { Items: unknown[] };
      // Empty cart may return empty Items array or undefined
      expect(body.Items === undefined || body.Items.length === 0).toBe(true);
    });

    test('should add item to cart after login', async () => {
      const { username, password } = testUsers.validUser;
      await apiClient.login(username, password);
      
      const response = await apiClient.addToCart(1);
      expect(response.status).toBe(200);
    });

    test('should delete item from cart', async () => {
      // Add item first
      await apiClient.addToCart(1);
      
      // View cart to get item ID
      const cartResponse = await apiClient.viewCart();
      const cart = cartResponse.body as { Items: { id: string }[] };
      
      if (cart.Items && cart.Items.length > 0) {
        const itemId = cart.Items[0].id;
        const deleteResponse = await apiClient.deleteFromCart(itemId);
        expect(deleteResponse.status).toBe(200);
      }
    });

    test('should perform cart operations sequence', async () => {
      // Add items
      const add1 = await apiClient.addToCart(1);
      const add2 = await apiClient.addToCart(2);
      
      // Verify operations succeed
      expect(add1.status).toBe(200);
      expect(add2.status).toBe(200);
      
      // View cart returns valid response
      const response = await apiClient.viewCart();
      expect(response.status).toBe(200);
    });

    // ==================== EDGE CASES ====================

    test('should handle adding same product multiple times (duplicates)', async () => {
      // Add same product 3 times
      const response1 = await apiClient.addToCart(1);
      const response2 = await apiClient.addToCart(1);
      const response3 = await apiClient.addToCart(1);
      
      // All should succeed - API allows duplicates
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(response3.status).toBe(200);
    });

    test('should handle adding non-existent product ID', async () => {
      // Product ID 99999 likely doesn't exist
      const response = await apiClient.addToCart(99999);
      
      // API may still return 200 (no validation on server)
      expect(response.status).toBe(200);
    });

    test('should handle adding product with ID 0', async () => {
      const response = await apiClient.addToCart(0);
      
      // API behavior with ID 0
      expect(response.status).toBe(200);
    });

    test('should handle adding product with negative ID', async () => {
      const response = await apiClient.addToCart(-1);
      
      // API behavior with negative ID
      expect(response.status).toBe(200);
    });

    test('should handle deleting non-existent item from cart', async () => {
      // Try to delete with fake UUID
      const fakeItemId = 'non-existent-item-id-12345';
      const response = await apiClient.deleteFromCart(fakeItemId);
      
      // API returns 200 even for non-existent items
      expect(response.status).toBe(200);
    });

    test('should return error when deleting with empty item ID', async () => {
      const response = await apiClient.deleteFromCart('');
      
      // API returns 500 server error for empty ID (no input validation)
      expect(response.status).toBe(500);
    });

    test('should isolate cart between different sessions', async () => {
      // Create two separate API clients (different sessions)
      const client1 = new ApiClient();
      const client2 = new ApiClient();
      await client1.init();
      await client2.init();
      
      try {
        // Add item to client1's cart
        await client1.addToCart(1);
        
        // Client2's cart should be empty (different session)
        const cart2Response = await client2.viewCart();
        const cart2 = cart2Response.body as { Items: unknown[] };
        
        // Different session = isolated cart
        expect(cart2.Items === undefined || cart2.Items.length === 0).toBe(true);
      } finally {
        await client1.dispose();
        await client2.dispose();
      }
    });

    test('should handle rapid consecutive cart operations', async () => {
      // Simulate rapid operations - add 5 items quickly
      const promises = [
        apiClient.addToCart(1),
        apiClient.addToCart(2),
        apiClient.addToCart(3),
        apiClient.addToCart(4),
        apiClient.addToCart(5),
      ];
      
      const responses = await Promise.all(promises);
      
      // All should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
