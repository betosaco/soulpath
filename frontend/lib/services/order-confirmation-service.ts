import { communicationService } from './communication-service';
import { generateModularEmail } from '@/lib/communication/templates/index';
import { RecipientService } from './recipient-service';

/**
 * New Order Confirmation Service using CommunicationService and Modular Email System
 *
 * This replaces the deprecated OrderEmailService with a more robust, unified approach.
 */
export interface OrderConfirmationData {
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  // Order Information
  orderId: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;

  // Order Items
  orderItems: Array<{
    name: string;
    type: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
  }>;

  // MATPASS Information (if applicable)
  matpassItems?: Array<{
    name: string;
    type: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sessions: number;
    expiryDate: string;
  }>;

  // Booking Information (if applicable)
  bookings?: Array<{
    bookingId: string;
    bookingDate: string;
    bookingTime: string;
    sessionType: string;
    teacherName: string;
    venue: string;
    duration: number;
  }>;

  // Product Information (if applicable)
  products?: Array<{
    name: string;
    type: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    description?: string;
  }>;

  // Shipping Information
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Payment Information
  paymentMethod?: string;
  isPayLater?: boolean;

  // URLs
  orderUrl: string;
  websiteUrl: string;

  // Customer status (for template selection)
  isNewCustomer?: boolean;
}

export class OrderConfirmationService {
  /**
   * Send order confirmation email using the new modular email system
   */
  static async sendOrderConfirmation(orderData: OrderConfirmationData, language: 'en' | 'es' = 'es'): Promise<boolean> {
    try {
      console.log('🆕 OrderConfirmationService: Sending order confirmation using new system...');
      console.log('🆕 Order data:', {
        orderId: orderData.orderId,
        customerEmail: orderData.customerEmail,
        hasMatpass: orderData.matpassItems?.length > 0,
        hasProducts: orderData.products?.length > 0,
        hasBookings: orderData.bookings?.length > 0
      });

      // Transform order data to match modular email system format
      const emailData = this.transformOrderDataForEmail(orderData);

      // Generate email using modular system
      const email = await generateModularEmail('order_confirmation', emailData, language);

      // Send email using CommunicationService
      const emailResult = await communicationService.sendEmail({
        to: orderData.customerEmail,
        subject: email.subject,
        html: email.html,
        text: email.text
      });

      if (!emailResult.success) {
        console.error('❌ OrderConfirmationService: Failed to send email:', emailResult.error);
        return false;
      }

      console.log('✅ OrderConfirmationService: Email sent successfully via', emailResult.provider);

      // Send admin notification
      await this.sendAdminNotification(orderData, language);

      // Send Telegram notifications if applicable
      await this.sendTelegramNotifications(orderData);

      return true;

    } catch (error) {
      console.error('❌ OrderConfirmationService: Failed to send order confirmation:', error);
      return false;
    }
  }

  /**
   * Transform order data to match modular email system format
   */
  private static transformOrderDataForEmail(orderData: OrderConfirmationData) {
    return {
      // Customer info
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,

      // Order info
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      orderDate: orderData.orderDate,
      totalAmount: orderData.totalAmount,
      currency: orderData.currency,
      subtotal: orderData.subtotal,
      taxAmount: orderData.taxAmount,
      shippingAmount: orderData.shippingAmount,

      // Order composition for scenario detection
      isNewCustomer: orderData.isNewCustomer ?? false,
      hasMatpass: (orderData.matpassItems?.length ?? 0) > 0,
      hasProducts: (orderData.products?.length ?? 0) > 0,
      hasBookings: (orderData.bookings?.length ?? 0) > 0,
      hasShipping: !!orderData.shippingAddress,

      matpassCount: orderData.matpassItems?.length ?? 0,
      bookingCount: orderData.bookings?.length ?? 0,
      productCount: orderData.products?.length ?? 0,

      // Items
      orderItems: orderData.orderItems,
      matpassItems: orderData.matpassItems,
      bookings: orderData.bookings,
      products: orderData.products,

      // Additional info
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      isPayLater: orderData.isPayLater,
      orderUrl: orderData.orderUrl,
      websiteUrl: orderData.websiteUrl
    };
  }

  /**
   * Send admin notification about new order
   */
  private static async sendAdminNotification(orderData: OrderConfirmationData, language: 'en' | 'es' = 'es'): Promise<void> {
    try {
      console.log('📧 OrderConfirmationService: Sending admin notification...');

      const adminEmailData = {
        ...this.transformOrderDataForEmail(orderData),
        adminNotification: true
      };

      const adminEmail = await generateModularEmail('order_admin_notification', adminEmailData, language);

      const adminResult = await communicationService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@matmax.world',
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text
      });

      if (adminResult.success) {
        console.log('✅ OrderConfirmationService: Admin notification sent successfully');
      } else {
        console.warn('⚠️ OrderConfirmationService: Failed to send admin notification:', adminResult.error);
      }

    } catch (error) {
      console.warn('⚠️ OrderConfirmationService: Admin notification failed:', error);
    }
  }

  /**
   * Send Telegram notifications for orders
   */
  private static async sendTelegramNotifications(orderData: OrderConfirmationData): Promise<void> {
    try {
      console.log('📱 OrderConfirmationService: Sending Telegram notifications...');

      // Send to customer if they have Telegram
      if (orderData.customerEmail) {
        // In a real implementation, you'd look up the customer's telegramChatId
        // For now, we'll just log the intent
        console.log('📱 Would send Telegram notification to customer:', orderData.customerEmail);
      }

      // Send admin notifications to ADMIN role users
      const adminRecipients = await RecipientService.resolveRecipients({
        type: 'user',
        role: 'ADMIN'
      });

      const telegramRecipients = RecipientService.filterByType(adminRecipients, 'telegram');

      if (telegramRecipients.length > 0) {
        console.log(`📱 Sending Telegram notifications to ${telegramRecipients.length} admins`);

        for (const recipient of telegramRecipients) {
          if (recipient.telegramChatId) {
            const message = this.createTelegramOrderMessage(orderData);

            const result = await communicationService.sendTelegramMessage({
              chatId: recipient.telegramChatId,
              message: message,
              parseMode: 'Markdown'
            });

            if (result.success) {
              console.log(`✅ Telegram notification sent to admin: ${recipient.name || recipient.email}`);
            } else {
              console.warn(`⚠️ Failed to send Telegram notification to admin: ${result.error}`);
            }
          }
        }
      }

    } catch (error) {
      console.warn('⚠️ OrderConfirmationService: Telegram notifications failed:', error);
    }
  }

  /**
   * Create Telegram message for order notification
   */
  private static createTelegramOrderMessage(orderData: OrderConfirmationData): string {
    const itemsText = orderData.orderItems.map(item =>
      `• ${item.name} (${item.quantity}x) - ${orderData.currency} ${item.totalPrice}`
    ).join('\n');

    return `*🆕 Nuevo Pedido - ${orderData.orderNumber}*

👤 Cliente: ${orderData.customerName}
📧 Email: ${orderData.customerEmail}
${orderData.customerPhone ? `📱 Teléfono: ${orderData.customerPhone}\n` : ''}💰 Total: ${orderData.currency} ${orderData.totalAmount}

📦 Items:
${itemsText}

${orderData.bookings?.length ? `📅 Reservas: ${orderData.bookings.length}\n` : ''}${orderData.matpassItems?.length ? `🎫 MatPasses: ${orderData.matpassItems.length}\n` : ''}🔗 Ver pedido: ${orderData.orderUrl}`;
  }

  /**
   * Test the new order confirmation system
   */
  static async testOrderConfirmation(): Promise<boolean> {
    const testOrderData: OrderConfirmationData = {
      customerName: 'Test Customer',
      customerEmail: 'test@example.com',
      customerPhone: '+1234567890',

      orderId: 'test-order-123',
      orderNumber: 'TEST-123',
      orderDate: new Date().toISOString(),
      totalAmount: 150,
      currency: 'PEN',
      subtotal: 130,
      taxAmount: 20,
      shippingAmount: 0,

      orderItems: [
        {
          name: 'Test MatPass',
          type: 'matpass',
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
          description: 'Test package'
        }
      ],

      matpassItems: [
        {
          name: 'Test MatPass',
          type: 'matpass',
          quantity: 1,
          unitPrice: 150,
          totalPrice: 150,
          sessions: 10,
          expiryDate: '2025-12-31'
        }
      ],

      isNewCustomer: true,
      hasMatpass: true,
      hasProducts: false,
      hasBookings: false,

      orderUrl: 'https://matmax.world/orders/test-123',
      websiteUrl: 'https://matmax.world'
    };

    return this.sendOrderConfirmation(testOrderData, 'es');
  }
}
