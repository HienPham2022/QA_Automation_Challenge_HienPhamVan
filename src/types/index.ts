/**
 * TypeScript type definitions for the automation framework
 */

// User credentials
export interface UserCredentials {
  username: string;
  password: string;
}

// Product information
export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: ProductCategory;
}

// Product categories
export type ProductCategory = 'phone' | 'laptop' | 'monitor';

// Cart item
export interface CartItem extends Product {
  quantity?: number;
}

// Order information
export interface OrderInfo {
  name: string;
  country: string;
  city: string;
  creditCard: string;
  month: string;
  year: string;
}

// Order confirmation
export interface OrderConfirmation {
  id?: string;
  amount: number;
  cardNumber: string;
  name: string;
  date: string;
}

// Test user
export interface TestUser extends UserCredentials {
  email?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  status: number;
  data: T;
  message?: string;
}

// Login response
export interface LoginResponse {
  Auth_token?: string;
  errorMessage?: string;
}

// Environment config type
export interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}
