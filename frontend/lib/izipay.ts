// Izipay (Lyra) Payment Configuration
export const IZIPAY_CONFIG = {
  // API Configuration
  API_BASE_URL: process.env.IZIPAY_API_BASE_URL || 'https://api.micuentaweb.pe',
  API_VERSION: 'V4',
  
  // Test Environment
  TEST: {
    USERNAME: process.env.IZIPAY_TEST_USERNAME || '88569105',
    PASSWORD: process.env.IZIPAY_TEST_PASSWORD || 'testpassword_NS]pdOEIQsM4RMu16WF89kCViBW9ddilhEdsq02sHA2T',
    PUBLIC_KEY: process.env.IZIPAY_TEST_PUBLIC_KEY || '88569105:testpublickey_oHKEsiKA3i9E1JshcnIA7RktrR163DdRZYZYOWgXqwSXx',
    HMAC_KEY: process.env.IZIPAY_TEST_HMAC_KEY || 'H9ataKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRL<HZM1',
    JAVASCRIPT_URL: process.env.IZIPAY_JAVASCRIPT_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
  },
  
  // Production Environment
  PRODUCTION: {
    USERNAME: process.env.IZIPAY_PROD_USERNAME || '88569105',
    PASSWORD: process.env.IZIPAY_PROD_PASSWORD || 'prodpassword_di6IeBzwz6ccq30feWkUmGN5s6PmhX67|6RrKJHSicFPh',
    PUBLIC_KEY: process.env.IZIPAY_PROD_PUBLIC_KEY || '88569105:publickey UKrWazicOvfMEi40dXuBAcGK1TaTK6izIIJZYWWHGCakv',
    HMAC_KEY: process.env.IZIPAY_PROD_HMAC_KEY || 'XnvOuum4jpXuY9U1BbpoY3tPK0KRy3|vBfw1ZKmp2G2Sz',
    JAVASCRIPT_URL: process.env.IZIPAY_JAVASCRIPT_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
  }
};

// Get current environment configuration
export const getIzipayConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? IZIPAY_CONFIG.PRODUCTION : IZIPAY_CONFIG.TEST;
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
