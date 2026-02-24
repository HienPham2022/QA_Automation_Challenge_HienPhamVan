/**
 * API Tests for DemoBlaze
 */
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/api';
import { generateRandomUsername } from '../../src/utils/helpers';

test.describe('API Tests @api', () => {
  let apiClient: ApiClient;

  test.beforeAll(async () => {
    apiClient = new ApiClient();
    await apiClient.init();
  });

  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test.describe('Product API', () => {
    test('should get all product entries', async () => {
      const response = await apiClient.getEntries();
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Array.isArray((response.body as { Items: unknown[] }).Items)).toBe(true);
    });

    test('should get product by ID', async () => {
      const response = await apiClient.getProductById(1);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    test('should get products by category - phones', async () => {
      const response = await apiClient.getByCategory('phone');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    test('should get products by category - laptops', async () => {
      const response = await apiClient.getByCategory('notebook');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    test('should get products by category - monitors', async () => {
      const response = await apiClient.getByCategory('monitor');
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });

  test.describe('Authentication API', () => {
    test('should signup new user', async () => {
      const username = generateRandomUsername();
      const response = await apiClient.signup(username, 'testpass123');
      
      expect(response.status).toBe(200);
    });

    test('should fail signup for existing user', async () => {
      const username = 'testuser123'; // Existing user
      const response = await apiClient.signup(username, 'testpass123');
      
      expect(response.status).toBe(200);
      expect(response.body.toLowerCase()).toContain('already exist');
    });

    test('should login with valid credentials', async () => {
      const response = await apiClient.login('testuser123', 'testpass123');
      
      expect(response.status).toBe(200);
      expect(response.body).toContain('Auth_token');
    });

    test('should fail login with invalid credentials', async () => {
      const response = await apiClient.login('invaliduser', 'wrongpassword');
      
      expect(response.status).toBe(200);
      expect(response.body.toLowerCase()).toContain('wrong password');
    });
  });

  test.describe('Cart API', () => {
    const testCookie = `user=${Date.now()}`;

    test('should add item to cart', async () => {
      const response = await apiClient.addToCart(1, testCookie);
      
      expect(response.status).toBe(200);
    });

    test('should view cart', async () => {
      // First add an item
      await apiClient.addToCart(1, testCookie);
      
      const response = await apiClient.viewCart(testCookie);
      
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });
  });
});
