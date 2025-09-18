import crypto from 'crypto';

export interface LyraPaymentConfig {
  username: string;
  password: string;
  publicKey: string;
  apiEndpoint: string;
  jsLibraryUrl: string;
  hmacKey: string;
  environment: 'test' | 'production';
  returnUrls: {
    success: string;
    error: string;
    cancel: string;
  };
  webhookUrl?: string;
}

export interface CreatePaymentParams {
  amount: number; // Amount in cents
  currency: string;
  orderId: string;
  customer: {
    email: string;
    name?: string;
    phone?: string;
    billingDetails?: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      country?: string;
    };
  };
  metadata?: Record<string, string>;
}

export interface LyraPaymentResponse {
  success: boolean;
  formToken?: string;
  error?: string;
  data?: any;
}

export interface LyraValidationResponse {
  success: boolean;
  isValid?: boolean;
  error?: string;
  data?: any;
}

export class LyraPaymentService {
  private config: LyraPaymentConfig;

  constructor(config: LyraPaymentConfig) {
    this.config = config;
  }

  /**
   * Create a form token for Lyra payment form
   * This should be called server-side only for security
   */
  async createFormToken(params: CreatePaymentParams): Promise<LyraPaymentResponse> {
    try {
      const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
      
      const requestBody = {
        amount: params.amount,
        currency: params.currency,
        orderId: params.orderId,
        customer: {
          email: params.customer.email,
          reference: `customer_${Date.now()}`,
          billingDetails: {
            firstName: params.customer.name?.split(' ')[0] || '',
            lastName: params.customer.name?.split(' ').slice(1).join(' ') || '',
            phoneNumber: params.customer.phone || '',
            country: 'PE' // Default to Peru for this application
          }
        },
        metadata: params.metadata,
        // Disable installment options to hide informational text
        transactionOptions: {
          cardOptions: {
            retry: 1,
            // Disable installment options
            installmentOptions: {
              enabled: false
            }
          }
        }
      };

      console.log('🔍 Lyra API request body:', JSON.stringify(requestBody, null, 2));
      console.log('🔍 Customer name processing:', {
        originalName: params.customer.name,
        firstName: params.customer.name?.split(' ')[0] || '',
        lastName: params.customer.name?.split(' ').slice(1).join(' ') || ''
      });

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.status !== 'SUCCESS') {
        return {
          success: false,
          error: data.answer?.errorMessage || 'Failed to create form token'
        };
      }

      return {
        success: true,
        formToken: data.answer.formToken,
        data: data
      };
    } catch (error) {
      console.error('Error creating Lyra form token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate payment response from Lyra
   * This should be called server-side to verify the payment
   */
  async validatePayment(krAnswer: string, krHash: string): Promise<LyraValidationResponse> {
    try {
      console.log('🔍 Validating payment with krAnswer:', krAnswer?.substring(0, 100) + '...');
      console.log('🔍 Validating payment with krHash:', krHash);
      
      // Basic validation
      if (!krAnswer || !krHash) {
        return {
          success: false,
          error: 'Missing payment data'
        };
      }

      // Parse the answer to check payment status
      const answerData = JSON.parse(krAnswer);
      console.log('🔍 Parsed answer data:', answerData);
      
      // In test/development mode, we're more lenient with validation
      const isTestMode = this.config.environment === 'test' || process.env.NODE_ENV === 'development';
      
      if (answerData.orderStatus === 'PAID') {
        console.log('✅ Payment is PAID');
        return {
          success: true,
          isValid: true,
          data: answerData
        };
      } else if (isTestMode && (answerData.orderStatus === 'CLOSED' || answerData.orderStatus === 'AUTHORISED')) {
        // In test mode, accept CLOSED or AUTHORISED as valid
        console.log('✅ Payment is valid in test mode:', answerData.orderStatus);
        return {
          success: true,
          isValid: true,
          data: answerData
        };
      } else {
        console.log('⚠️ Payment status is not valid:', answerData.orderStatus);
        return {
          success: true,
          isValid: false,
          data: answerData
        };
      }
    } catch (error) {
      console.error('Error validating Lyra payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get the Lyra JavaScript library configuration
   */
  getLibraryConfig() {
    return {
      jsLibraryUrl: this.config.jsLibraryUrl,
      publicKey: this.config.publicKey
    };
  }

  /**
   * Validates HMAC-SHA-256 signature from Lyra return URL
   * @param data - The data to validate
   * @param signature - The kr-hash signature from Lyra
   * @returns boolean indicating if signature is valid
   */
  validateHmacSignature(data: string, signature: string): boolean {
    try {
      const hmac = crypto.createHmac('sha256', this.config.hmacKey);
      hmac.update(data);
      const calculatedSignature = hmac.digest('base64');
      
      return calculatedSignature === signature;
    } catch (error) {
      console.error('Error validating HMAC signature:', error);
      return false;
    }
  }

  /**
   * Validates payment response from Lyra
   * @param responseData - The response data from Lyra
   * @returns validation result
   */
  validatePaymentResponse(responseData: any): { success: boolean; error?: string; data?: any } {
    try {
      // Check if required fields are present
      if (!responseData['kr-hash']) {
        return { success: false, error: 'Missing kr-hash signature' };
      }

      if (!responseData['kr-status']) {
        return { success: false, error: 'Missing payment status' };
      }

      // Extract signature and data for validation
      const signature = responseData['kr-hash'];
      delete responseData['kr-hash'];
      
      // Create data string for validation (sorted keys)
      const sortedKeys = Object.keys(responseData).sort();
      const dataString = sortedKeys.map(key => `${key}=${responseData[key]}`).join('&');

      // Validate signature
      if (!this.validateHmacSignature(dataString, signature)) {
        return { success: false, error: 'Invalid signature' };
      }

      // Check payment status
      const status = responseData['kr-status'];
      if (status !== 'PAID') {
        return { 
          success: false, 
          error: `Payment not successful. Status: ${status}`,
          data: responseData
        };
      }

      return { 
        success: true, 
        data: {
          ...responseData,
          'kr-hash': signature // Add back the signature for reference
        }
      };

    } catch (error) {
      console.error('Error validating payment response:', error);
      return { success: false, error: 'Validation error' };
    }
  }

  /**
   * Gets the current environment configuration
   */
  getEnvironment(): 'test' | 'production' {
    return this.config.environment;
  }

  /**
   * Gets return URLs for the current environment
   */
  getReturnUrls() {
    return this.config.returnUrls;
  }
}

// Production configuration for Peruvian market
export const productionLyraConfig: LyraPaymentConfig = {
  username: (process.env.LYRA_USERNAME || '88569105').trim(),
  password: (process.env.LYRA_PASSWORD || 'prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh').trim(),
  publicKey: (process.env.LYRA_PUBLIC_KEY || 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv').trim(),
  apiEndpoint: (process.env.LYRA_API_ENDPOINT || 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment').trim(),
  jsLibraryUrl: (process.env.LYRA_JS_LIBRARY_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js').trim(),
  hmacKey: (process.env.LYRA_HMAC_PROD_KEY || 'L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw').trim(),
  environment: 'production',
  returnUrls: {
    success: (process.env.LYRA_RETURN_URL_SUCCESS || 'https://yourdomain.com/payment-success').trim(),
    error: (process.env.LYRA_RETURN_URL_ERROR || 'https://yourdomain.com/payment-error').trim(),
    cancel: (process.env.LYRA_RETURN_URL_CANCEL || 'https://yourdomain.com/payment-cancel').trim()
  },
  webhookUrl: process.env.LYRA_WEBHOOK_URL?.trim()
};

// Test configuration for development
export const testLyraConfig: LyraPaymentConfig = {
  username: (process.env.LYRA_USERNAME || '').trim(),
  password: (process.env.LYRA_PASSWORD || '').trim(),
  publicKey: (process.env.LYRA_PUBLIC_KEY || '').trim(),
  apiEndpoint: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
  jsLibraryUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
  hmacKey: (process.env.LYRA_HMAC_TEST_KEY || 'H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1').trim(),
  environment: 'test',
  returnUrls: {
    success: (process.env.LYRA_RETURN_URL_SUCCESS || 'http://localhost:3000/payment-success').trim(),
    error: (process.env.LYRA_RETURN_URL_ERROR || 'http://localhost:3000/payment-error').trim(),
    cancel: (process.env.LYRA_RETURN_URL_CANCEL || 'http://localhost:3000/payment-cancel').trim()
  },
  webhookUrl: process.env.LYRA_WEBHOOK_URL?.trim()
};

// Default configuration - uses production in production environment
export const defaultLyraConfig: LyraPaymentConfig = process.env.NODE_ENV === 'production' 
  ? productionLyraConfig 
  : testLyraConfig;

// Create a default instance
export const lyraPaymentService = new LyraPaymentService(defaultLyraConfig);
