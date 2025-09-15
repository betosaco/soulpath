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
  const merchantId = process.env.IZIPAY_MERCHANT_ID;
  const username = process.env.IZIPAY_USERNAME;
  const password = process.env.IZIPAY_PASSWORD;
  const publicKey = process.env.IZIPAY_PUBLIC_KEY;
  const environment = (process.env.IZIPAY_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox';

  if (!merchantId || !username || !password || !publicKey) {
    console.warn('Izipay configuration incomplete. Missing required environment variables.');
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
