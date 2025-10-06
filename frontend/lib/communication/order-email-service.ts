/**
 * DEPRECATED: Order Email Service
 *
 * This service has been replaced by the ModularEmailService.
 * This file exists only for backward compatibility.
 *
 * @deprecated Use ModularEmailService instead
 */

import { ModularEmailService } from './templates/modular-email-service';

export class OrderEmailService {
  private emailService: ModularEmailService;

  constructor() {
    this.emailService = new ModularEmailService();
  }

  async sendOrderConfirmation(orderData: any): Promise<void> {
    console.warn('OrderEmailService is deprecated. Use ModularEmailService instead.');
    // Forward to new service for backward compatibility
    await this.emailService.sendOrderConfirmation(orderData);
  }

  async sendPaymentConfirmation(orderData: any): Promise<void> {
    console.warn('OrderEmailService is deprecated. Use ModularEmailService instead.');
    // Forward to new service for backward compatibility
    await this.emailService.sendPaymentConfirmation(orderData);
  }

  async sendOrderUpdate(orderData: any): Promise<void> {
    console.warn('OrderEmailService is deprecated. Use ModularEmailService instead.');
    // Forward to new service for backward compatibility
    await this.emailService.sendOrderUpdate(orderData);
  }
}

// Export a singleton instance for backward compatibility
export const orderEmailService = new OrderEmailService();
