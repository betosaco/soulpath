/**
 * Izipay Payment Service
 * Handles payment processing with Izipay Peru payment gateway
 */

import { getIzipayConfig, getIzipayApiUrl, getIzipayAuthHeader, generateIzipaySignature, IzipayConfig } from './config';

// Izipay API Types
export interface IzipayPaymentRequest {
  amount: number; // Amount in cents (e.g., 10000 for S/100.00)
  currency: string; // 'PEN' for Peruvian Sol
  orderId: string; // Unique order identifier
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  returnUrl: string;
  cancelUrl: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface IzipayPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
  details?: any;
}

export interface IzipayWebhookPayload {
  transactionId: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
  signature: string;
}

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  orderId: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface IzipayTokenRequest {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  returnUrl: string;
  cancelUrl: string;
  description?: string;
}

export interface IzipayTokenResponse {
  success: boolean;
  formToken?: string;
  error?: string;
  details?: any;
}

/**
 * Izipay Payment Service Class
 */
export class IzipayPaymentService {
  private static config: IzipayConfig | null = null;

  /**
   * Initialize Izipay configuration
   */
  private static getConfig(override?: Partial<IzipayConfig>): IzipayConfig {
    if (!this.config) {
      this.config = getIzipayConfig();
    }
    const base = this.config || ({} as IzipayConfig);
    const merged: IzipayConfig = {
      merchantId: override?.merchantId || base.merchantId,
      username: override?.username || base.username,
      password: override?.password || base.password,
      publicKey: override?.publicKey || base.publicKey,
      currency: override?.currency || base.currency || 'PEN',
      environment: override?.environment || base.environment || 'sandbox',
      supportedCountries: override?.supportedCountries || base.supportedCountries || ['PE'],
      returnUrl: override?.returnUrl || base.returnUrl,
      cancelUrl: override?.cancelUrl || base.cancelUrl,
    };
    if (!merged.merchantId || !merged.username || !merged.password || !merged.publicKey) {
      throw new Error('Izipay configuration not found. Please check environment variables or providerConfig.');
    }
    return merged;
  }

  /**
   * Create a payment form token for embedded payment
   */
  static async createFormToken(params: IzipayTokenRequest, overrideConfig?: Partial<IzipayConfig>): Promise<IzipayTokenResponse> {
    try {
      const config = this.getConfig(overrideConfig);
      const apiUrl = getIzipayApiUrl(config.environment);
      
      const requestData = {
        amount: params.amount,
        currency: params.currency,
        orderId: params.orderId,
        customer: params.customer,
        returnUrl: params.returnUrl,
        cancelUrl: params.cancelUrl,
        description: params.description || 'Payment for wellness services',
      };

      const authHeader = getIzipayAuthHeader(config.username, config.password);
      
      const response = await fetch(`${apiUrl}/api-payment/V4/Charge/CreatePayment`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Izipay API error:', result);
        return {
          success: false,
          error: result.errorMessage || 'Failed to create payment form token',
          details: result,
        };
      }

      return {
        success: true,
        formToken: result.answer?.formToken,
        details: result,
      };
    } catch (error) {
      console.error('Error creating Izipay form token:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Create a payment intent for processing
   */
  static async createPaymentIntent(params: CreatePaymentIntentParams, overrideConfig?: Partial<IzipayConfig>): Promise<IzipayPaymentResponse> {
    try {
      const config = this.getConfig(overrideConfig);
      
      const tokenRequest: IzipayTokenRequest = {
        amount: Math.round(params.amount * 100), // Convert to cents
        currency: params.currency,
        orderId: params.orderId,
        customer: {
          email: params.customerEmail,
          firstName: params.customerName?.split(' ')[0] || '',
          lastName: params.customerName?.split(' ').slice(1).join(' ') || '',
        },
        returnUrl: config.returnUrl,
        cancelUrl: config.cancelUrl,
        description: params.description,
      };

      const tokenResponse = await this.createFormToken(tokenRequest, overrideConfig);
      
      if (!tokenResponse.success || !tokenResponse.formToken) {
        return {
          success: false,
          error: tokenResponse.error || 'Failed to create payment token',
          details: tokenResponse.details,
        };
      }

      // Generate payment URL for redirection
      const apiUrl = getIzipayApiUrl(config.environment);
      const paymentUrl = `${apiUrl}/vads-payment/entry.silentInit.a?vads_form_token=${tokenResponse.formToken}`;

      return {
        success: true,
        paymentUrl,
        transactionId: tokenResponse.formToken,
        details: tokenResponse.details,
      };
    } catch (error) {
      console.error('Error creating Izipay payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: IzipayWebhookPayload): boolean {
    try {
      const config = this.getConfig();
      
      // Create signature data excluding the signature itself
      const { signature, ...signatureData } = payload;
      
      // Generate expected signature
      const expectedSignature = generateIzipaySignature(signatureData, config.publicKey);
      
      return signature === expectedSignature;
    } catch (error) {
      console.error('Error verifying Izipay webhook signature:', error);
      return false;
    }
  }

  /**
   * Process webhook notification
   */
  static async processWebhook(payload: IzipayWebhookPayload): Promise<{
    success: boolean;
    status: string;
    orderId: string;
    transactionId: string;
  }> {
    try {
      // Verify signature first
      if (!this.verifyWebhookSignature(payload)) {
        throw new Error('Invalid webhook signature');
      }

      // Map Izipay status to our internal status
      let status: string;
      switch (payload.status) {
        case 'PAID':
        case 'AUTHORISED':
          status = 'completed';
          break;
        case 'REFUSED':
        case 'CANCELLED':
          status = 'failed';
          break;
        case 'PENDING':
        case 'WAITING_AUTHORISATION':
          status = 'pending';
          break;
        default:
          status = 'pending';
      }

      return {
        success: true,
        status,
        orderId: payload.orderId,
        transactionId: payload.transactionId,
      };
    } catch (error) {
      console.error('Error processing Izipay webhook:', error);
      throw error;
    }
  }

  /**
   * Get payment details by transaction ID
   */
  static async getPaymentDetails(transactionId: string): Promise<{
    success: boolean;
    status?: string;
    amount?: number;
    currency?: string;
    error?: string;
  }> {
    try {
      const config = this.getConfig();
      const apiUrl = getIzipayApiUrl(config.environment);
      const authHeader = getIzipayAuthHeader(config.username, config.password);

      const response = await fetch(`${apiUrl}/api-payment/V4/Transaction/Get`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          uuid: transactionId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.errorMessage || 'Failed to get payment details',
        };
      }

      const transaction = result.answer;
      
      return {
        success: true,
        status: transaction.transactionStatus,
        amount: transaction.amount,
        currency: transaction.currency,
      };
    } catch (error) {
      console.error('Error getting Izipay payment details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Refund a payment
   */
  static async refundPayment(transactionId: string, amount?: number): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }> {
    try {
      const config = this.getConfig();
      const apiUrl = getIzipayApiUrl(config.environment);
      const authHeader = getIzipayAuthHeader(config.username, config.password);

      const requestData: any = {
        uuid: transactionId,
      };

      if (amount) {
        requestData.amount = Math.round(amount * 100); // Convert to cents
      }

      const response = await fetch(`${apiUrl}/api-payment/V4/Transaction/CancelOrRefund`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.errorMessage || 'Failed to refund payment',
        };
      }

      return {
        success: true,
        refundId: result.answer?.uuid,
      };
    } catch (error) {
      console.error('Error refunding Izipay payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export default IzipayPaymentService;
