/**
 * API Client for DemoBlaze
 * Simple session management - user ID is stored automatically
 */
import { APIRequestContext, request } from '@playwright/test';
import { config } from '../config/env.config';
import { logger } from '../utils/logger';

export class ApiClient {
  private context: APIRequestContext | null = null;
  private baseUrl: string;
  
  // Session: user identifier and encoded cookie (created once per session)
  user: string;
  private _cookie: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || config.apiUrl;
    // Default to guest session
    this.user = `guest_${Date.now()}`;
    this._cookie = this.encodeCookie(this.user);
  }

  /**
   * Encode cookie value (Base64) - like browser does
   */
  private encodeCookie(value: string): string {
    return Buffer.from(value).toString('base64');
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

  // ==================== AUTH ====================

  async login(username: string, password: string): Promise<{ status: number; body: string; success: boolean }> {
    logger.info(`API: Login with username: ${username}`);
    const encodedPassword = Buffer.from(password).toString('base64');
    const response = await this.getContext().post('/login', {
      data: { username, password: encodedPassword },
    });
    const body = await response.text();
    const success = body.includes('Auth_token');
    
    // Auto-save session on successful login
    if (success) {
      this.user = username;
      this._cookie = this.encodeCookie(username);
      logger.info(`API: Session set to user: ${username}`);
    }
    
    return { status: response.status(), body, success };
  }

  async signup(username: string, password: string): Promise<{ status: number; body: string }> {
    logger.info(`API: Signup with username: ${username}`);
    const encodedPassword = Buffer.from(password).toString('base64');
    const response = await this.getContext().post('/signup', {
      data: { username, password: encodedPassword },
    });
    return { status: response.status(), body: await response.text() };
  }

  logout(): void {
    this.user = `guest_${Date.now()}`;
    this._cookie = this.encodeCookie(this.user);
    logger.info('API: Logged out, new guest session created');
  }

  // ==================== PRODUCTS ====================

  async getEntries(): Promise<{ status: number; body: unknown }> {
    logger.info('API: Getting product entries');
    const response = await this.getContext().get('/entries');
    return { status: response.status(), body: await response.json() };
  }

  async getProductById(id: number): Promise<{ status: number; body: unknown }> {
    logger.info(`API: Getting product by ID: ${id}`);
    const response = await this.getContext().post('/view', {
      data: { id },
    });
    return { status: response.status(), body: await response.json() };
  }

  async getByCategory(category: string): Promise<{ status: number; body: unknown }> {
    logger.info(`API: Getting products by category: ${category}`);
    const response = await this.getContext().post('/bycat', {
      data: { cat: category },
    });
    return { status: response.status(), body: await response.json() };
  }

  // ==================== CART ====================
  // All cart methods use this._cookie automatically (session-persistent)

  /**
   * Generate UUID for cart item ID (like browser does)
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async addToCart(productId: number): Promise<{ status: number; body: string }> {
    logger.info(`API: Adding product ${productId} to cart [user: ${this.user}]`);
    const response = await this.getContext().post('/addtocart', {
      data: { 
        id: this.generateUUID(),
        cookie: this._cookie,
        prod_id: productId,
        flag: true
      },
    });
    return { status: response.status(), body: await response.text() };
  }

  async viewCart(): Promise<{ status: number; body: unknown }> {
    logger.info(`API: Viewing cart [user: ${this.user}]`);
    const response = await this.getContext().post('/viewcart', {
      data: { cookie: this._cookie, flag: true },
    });
    return { status: response.status(), body: await response.json() };
  }

  async deleteFromCart(itemId: string): Promise<{ status: number; body: string }> {
    logger.info(`API: Deleting item ${itemId} from cart`);
    const response = await this.getContext().post('/deleteitem', {
      data: { id: itemId },
    });
    return { status: response.status(), body: await response.text() };
  }
}

export default ApiClient;
