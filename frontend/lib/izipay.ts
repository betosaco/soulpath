// Izipay (Lyra) Payment Configuration
export const IZIPAY_CONFIG = {
  // API Configuration
  API_BASE_URL: 'https://api.micuentaweb.pe',
  API_VERSION: 'V4',
  
  // Development Mode (set to true to use mock payments)
  MOCK_MODE: process.env.IZIPAY_MOCK_MODE === 'true' || false, // Disable mock mode for real testing
  
  // Test Environment
  TEST: {
    USERNAME: process.env.IZIPAY_TEST_USERNAME || '69876357',
    PASSWORD: process.env.IZIPAY_TEST_PASSWORD || 'testpassword_DEMOPRIVATEKEY23G4475zXZQ2UA5x7M',
    PUBLIC_KEY: process.env.IZIPAY_TEST_PUBLIC_KEY || '69876357:testpublickey_DEMOPUBLICKEY95me92597fd28tGD4r5',
    HMAC_KEY: process.env.IZIPAY_TEST_HMAC_KEY || 'H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1',
    JAVASCRIPT_URL: process.env.IZIPAY_JAVASCRIPT_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
  },
  
  // Production Environment
  PRODUCTION: {
    USERNAME: process.env.IZIPAY_PROD_USERNAME || '88569105',
    PASSWORD: process.env.IZIPAY_PROD_PASSWORD || 'prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh',
    PUBLIC_KEY: process.env.IZIPAY_PROD_PUBLIC_KEY || '88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv',
    HMAC_KEY: process.env.IZIPAY_PROD_HMAC_KEY || 'Xnv0uum4jpXuY9U1BbpoY3tPK0KRy3lvBfw1ZKmp2G2Sz',
    JAVASCRIPT_URL: process.env.IZIPAY_JAVASCRIPT_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
  }
};

// Get current environment configuration
export const getIzipayConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const envConfig = isProduction ? IZIPAY_CONFIG.PRODUCTION : IZIPAY_CONFIG.TEST;
  
  return {
    ...envConfig,
    API_BASE_URL: IZIPAY_CONFIG.API_BASE_URL,
    API_VERSION: IZIPAY_CONFIG.API_VERSION,
    MOCK_MODE: IZIPAY_CONFIG.MOCK_MODE
  };
};

// API Endpoints
export const IZIPAY_ENDPOINTS = {
  CREATE_PAYMENT: '/api-payment/V4/Charge/CreatePayment',
  GET_PAYMENT: '/api-payment/V4/Charge/GetPayment',
  VALIDATE_PAYMENT: '/api-payment/V4/Charge/ValidatePayment'
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
  ABANDONED: 'ABANDONED'
} as const;

// Currency
export const CURRENCY = 'PEN';

// Payment Form Configuration
export interface PaymentFormConfig {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  returnUrl?: string;
  successUrl?: string;
  errorUrl?: string;
}

// Form Token Response
export interface FormTokenResponse {
  status: 'SUCCESS' | 'ERROR';
  answer?: {
    formToken: string;
  };
  errorMessage?: string;
  errorCode?: string;
}

// Payment Result
export interface PaymentResult {
  shopId: string;
  orderStatus: string;
  orderDetails: {
    orderTotalAmount: number;
    orderCurrency: string;
    orderId: string;
  };
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  transactions: Array<{
    uuid: string;
    amount: number;
    currency: string;
    status: string;
  }>;
  krHash?: string;
}
