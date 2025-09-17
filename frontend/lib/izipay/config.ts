/**
 * Izipay configuration and initialization
 */

import { createHash } from 'node:crypto'

export interface IzipayConfig {
  merchantId: string;
  username: string;
  password: string;
  publicKey: string;
  currency: string;
  environment: 'sandbox' | 'production';
  supportedCountries: string[];
  returnUrl: string;
  cancelUrl: string;
  // Additional properties for API compatibility
  USERNAME: string;
  PASSWORD: string;
  PUBLIC_KEY: string;
  API_BASE_URL: string;
  JAVASCRIPT_URL: string;
  MOCK_MODE: boolean;
}

export interface IzipayCredentials {
  merchantId: string;
  username: string;
  password: string;
  publicKey: string;
  environment: 'sandbox' | 'production';
}

/**
 * Get Izipay configuration from environment variables
 */
export function getIzipayConfig(): IzipayConfig | null {
  const environment = (process.env.IZIPAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';
  
  // Use environment-specific variables
  const merchantId = environment === 'production' 
    ? process.env.IZIPAY_PROD_MERCHANT_ID || process.env.IZIPAY_MERCHANT_ID
    : process.env.IZIPAY_TEST_MERCHANT_ID || process.env.IZIPAY_MERCHANT_ID;
  const username = environment === 'production' 
    ? process.env.IZIPAY_PROD_USERNAME || process.env.IZIPAY_USERNAME
    : process.env.IZIPAY_TEST_USERNAME || process.env.IZIPAY_USERNAME;
  const password = environment === 'production' 
    ? process.env.IZIPAY_PROD_PASSWORD || process.env.IZIPAY_PASSWORD
    : process.env.IZIPAY_TEST_PASSWORD || process.env.IZIPAY_PASSWORD;
  const publicKey = environment === 'production' 
    ? process.env.IZIPAY_PROD_PUBLIC_KEY || process.env.IZIPAY_PUBLIC_KEY
    : process.env.IZIPAY_TEST_PUBLIC_KEY || process.env.IZIPAY_PUBLIC_KEY;

  if (!merchantId || !username || !password || !publicKey) {
    console.warn('Izipay configuration incomplete. Missing required environment variables for', environment, 'environment.');
    console.warn('Required variables:', {
      merchantId: !!merchantId,
      username: !!username,
      password: !!password,
      publicKey: !!publicKey
    });
    return null;
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  return {
    merchantId,
    username,
    password,
    publicKey,
    currency: 'PEN',
    environment,
    supportedCountries: ['PE'],
    returnUrl: `${baseUrl}/payment/success`,
    cancelUrl: `${baseUrl}/payment/cancel`,
    // Add properties expected by the API route
    USERNAME: username,
    PASSWORD: password,
    PUBLIC_KEY: publicKey,
    API_BASE_URL: process.env.IZIPAY_API_BASE_URL || 'https://api.micuentaweb.pe',
    JAVASCRIPT_URL: process.env.IZIPAY_JAVASCRIPT_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
    MOCK_MODE: process.env.IZIPAY_MOCK_MODE === 'true' || false,
  };
}

/**
 * Get Izipay API base URL based on environment
 */
export function getIzipayApiUrl(environment: 'sandbox' | 'production' = 'sandbox'): string {
  return environment === 'production'
    ? 'https://api.micuentaweb.pe'
    : 'https://api.micuentaweb.pe'; // Izipay uses the same URL for both environments
}

/**
 * Validate Izipay configuration
 */
export function validateIzipayConfig(config: IzipayConfig): boolean {
  const requiredFields = ['merchantId', 'username', 'password', 'publicKey'];
  return requiredFields.every(field => config[field as keyof IzipayConfig]);
}

/**
 * Get basic auth header for Izipay API requests
 */
export function getIzipayAuthHeader(username: string, password: string): string {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Generate signature for Izipay requests
 */
export function generateIzipaySignature(data: Record<string, unknown>, key: string): string {
  const sortedKeys = Object.keys(data).sort();
  const queryString = sortedKeys
    .map(key => `${key}=${data[key]}`)
    .join('&');

  const signatureString = `${queryString}+${key}`;

  return createHash('sha256').update(signatureString).digest('base64');
}

const izipayConfig = {
  getIzipayConfig,
  getIzipayApiUrl,
  validateIzipayConfig,
  getIzipayAuthHeader,
  generateIzipaySignature,
};

export default izipayConfig;
