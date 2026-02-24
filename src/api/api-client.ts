/**
 * API Client for DemoBlaze
 */
import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.apiUrl;
  }

  async init(): Promise<void> {
    this.context = await request.newContext({
      baseURL: this.baseUrl,
    });
  }

  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
    }
  }

  private getContext(): APIRequestContext {
    if (!this.context) {
      throw new Error('API Client not initialized. Call init() first.');
    }
    return this.context;
  }

  async login(username: string, password: string): Promise<{ status: number; body: string }> {
    logger.info(`API: Login with username: ${username}`);
    const response = await this.getContext().post('/login', {
      data: { username, password },
    });
    return {
      status: response.status(),
      body: await response.text(),
    };
  }

  async signup(username: string, password: string): Promise<{ status: number; body: string }> {
    logger.info(`API: Signup with username: ${username}`);
    const response = await this.getContext().post('/signup', {
      data: { username, password },
    });
    return {
      status: response.status(),
      body: await response.text(),
    };
  }

  async getEntries(): Promise<{ status: number; body: unknown }> {
    logger.info('API: Getting product entries');
    const response = await this.getContext().post('/entries');
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async getProductById(id: number): Promise<{ status: number; body: unknown }> {
    logger.info(`API: Getting product by ID: ${id}`);
    const response = await this.getContext().post('/view', {
      data: { id },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async getByCategory(category: string): Promise<{ status: number; body: unknown }> {
    logger.info(`API: Getting products by category: ${category}`);
    const response = await this.getContext().post('/bycat', {
      data: { cat: category },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async addToCart(
    productId: number, 
    cookie: string
  ): Promise<{ status: number; body: string }> {
    logger.info(`API: Adding product ${productId} to cart`);
    const response = await this.getContext().post('/addtocart', {
      data: { 
        id: `${Date.now()}`,
        cookie,
        prod_id: productId,
        flag: true
      },
    });
    return {
      status: response.status(),
      body: await response.text(),
    };
  }

  async viewCart(cookie: string): Promise<{ status: number; body: unknown }> {
    logger.info('API: Viewing cart');
    const response = await this.getContext().post('/viewcart', {
      data: { cookie, flag: true },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  async deleteFromCart(itemId: string): Promise<{ status: number; body: string }> {
    logger.info(`API: Deleting item ${itemId} from cart`);
    const response = await this.getContext().post('/deleteitem', {
      data: { id: itemId },
    });
    return {
      status: response.status(),
      body: await response.text(),
    };
  }
}

export default ApiClient;
