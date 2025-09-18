import { LyraPaymentConfig } from './payment-service';

/**
 * Environment-specific Lyra configuration
 */
export class LyraConfigManager {
  private static instance: LyraConfigManager;
  private config: LyraPaymentConfig;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  public static getInstance(): LyraConfigManager {
    if (!LyraConfigManager.instance) {
      LyraConfigManager.instance = new LyraConfigManager();
    }
    return LyraConfigManager.instance;
  }

  private loadConfiguration(): LyraPaymentConfig {
    const isProduction = process.env.NODE_ENV === 'production';
    const environment = process.env.LYRA_ENVIRONMENT || (isProduction ? 'production' : 'test');

    if (environment === 'production') {
      return {
        username: process.env.LYRA_USERNAME || 'prodpassword_di6IeBzwz6ccq3OfeWkUmGN5s6PmhX67l6RrKJHSicFPh',
        password: process.env.LYRA_PASSWORD || '88569105',
        publicKey: process.env.LYRA_PUBLIC_KEY || 'publickey_UKrWqzlcOvfMEi4OdXuBAcGK1TaTK6izlIJZYWwHGCqkv',
        apiEndpoint: process.env.LYRA_API_ENDPOINT || 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
        jsLibraryUrl: process.env.LYRA_JS_LIBRARY_URL || 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
        hmacKey: process.env.LYRA_HMAC_PROD_KEY || 'L1tb9IvJNUHb1r120tn0CXfKjaacKrwTVhH6yLX6w5SUw',
        environment: 'production',
        returnUrls: {
          success: process.env.LYRA_RETURN_URL_SUCCESS || 'https://yourdomain.com/payment-success',
          error: process.env.LYRA_RETURN_URL_ERROR || 'https://yourdomain.com/payment-error',
          cancel: process.env.LYRA_RETURN_URL_CANCEL || 'https://yourdomain.com/payment-cancel'
        },
        webhookUrl: process.env.LYRA_WEBHOOK_URL
      };
    } else {
      return {
        username: process.env.LYRA_USERNAME || '',
        password: process.env.LYRA_PASSWORD || '',
        publicKey: process.env.LYRA_PUBLIC_KEY || '',
        apiEndpoint: 'https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment',
        jsLibraryUrl: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
        hmacKey: process.env.LYRA_HMAC_TEST_KEY || 'H9qtqKGBMUFzH8F0kz4ihdw3MTBb0WbpJ1TLLuRLxHZM1',
        environment: 'test',
        returnUrls: {
          success: process.env.LYRA_RETURN_URL_SUCCESS || 'http://localhost:3000/payment-success',
          error: process.env.LYRA_RETURN_URL_ERROR || 'http://localhost:3000/payment-error',
          cancel: process.env.LYRA_RETURN_URL_CANCEL || 'http://localhost:3000/payment-cancel'
        },
        webhookUrl: process.env.LYRA_WEBHOOK_URL
      };
    }
  }

  public getConfig(): LyraPaymentConfig {
    return this.config;
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isTest(): boolean {
    return this.config.environment === 'test';
  }

  public getHmacKey(): string {
    return this.config.hmacKey;
  }

  public getReturnUrls() {
    return this.config.returnUrls;
  }

  public getWebhookUrl(): string | undefined {
    return this.config.webhookUrl;
  }

  /**
   * Validates that all required configuration is present
   */
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.username) {
      errors.push('LYRA_USERNAME is required');
    }

    if (!this.config.password) {
      errors.push('LYRA_PASSWORD is required');
    }

    if (!this.config.publicKey) {
      errors.push('LYRA_PUBLIC_KEY is required');
    }

    if (!this.config.hmacKey) {
      errors.push('HMAC key is required');
    }

    if (!this.config.returnUrls.success) {
      errors.push('Success return URL is required');
    }

    if (!this.config.returnUrls.error) {
      errors.push('Error return URL is required');
    }

    if (!this.config.returnUrls.cancel) {
      errors.push('Cancel return URL is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Updates configuration (useful for testing)
   */
  public updateConfig(newConfig: Partial<LyraPaymentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const lyraConfig = LyraConfigManager.getInstance();
