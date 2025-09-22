/**
 * Telegram Order Notification Service
 * Handles sending order details and confirmations via Telegram bot
 */

export interface OrderDetails {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderDate: string;
  orderStatus: string;
  orderStatusText: string;
  paymentStatus: string;
  paymentStatusText: string;
  billingDocumentType?: string;
  dni?: string;
  ruc?: string;
  companyName?: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  notes?: string;
  shippingAddress?: Address;
  scheduleDetails?: ScheduleDetail[];
  packageBookingDetails?: PackageBookingDetails;
}

export interface OrderItem {
  name: string;
  description?: string;
  type_text: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sessions?: number;
  duration_minutes?: number;
}

export interface PackageBookingDetails {
  packageName: string;
  packageDescription?: string;
  sessionsCount: number;
  durationMinutes?: number;
  packageType: string;
}

export interface ScheduleDetail {
  selectedDate?: string;
  selectedTime?: string;
  teacher?: string;
  serviceType?: string;
  venue?: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class TelegramOrderService {
  private botToken: string;
  private baseUrl: string;

  constructor(botToken?: string) {
    this.botToken = botToken || process.env.TELEGRAM_BOT_TOKEN || '8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Send order confirmation to a Telegram chat
   */
  async sendOrderConfirmation(chatId: string, orderDetails: OrderDetails): Promise<boolean> {
    try {
      const message = this.formatOrderMessage(orderDetails);

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        }),
      });

      const data = await response.json();

      if (data.ok) {
        console.log(`✅ Order confirmation sent to Telegram chat ${chatId}`);
        return true;
      } else {
        console.error('❌ Failed to send order confirmation:', data.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending order confirmation to Telegram:', error);
      return false;
    }
  }

  /**
   * Send order status update to a Telegram chat
   */
  async sendOrderStatusUpdate(chatId: string, orderNumber: string, status: string, additionalInfo?: string): Promise<boolean> {
    try {
      const statusEmoji = this.getStatusEmoji(status);
      const message = `
🔔 <b>Order Status Update</b>

📦 <b>Order:</b> ${orderNumber}
${statusEmoji} <b>Status:</b> ${this.formatStatusText(status)}

${additionalInfo ? `ℹ️ ${additionalInfo}` : ''}

Thank you for choosing SoulPath! 🙏
      `.trim();

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      const data = await response.json();

      if (data.ok) {
        console.log(`✅ Order status update sent to Telegram chat ${chatId}`);
        return true;
      } else {
        console.error('❌ Failed to send order status update:', data.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending order status update to Telegram:', error);
      return false;
    }
  }

  /**
   * Format order details into a Telegram message
   */
  private formatOrderMessage(order: OrderDetails): string {
    const itemsText = order.items.map(item => {
      const typeEmoji = item.type_text === 'Paquete de Yoga' ? '📚' : '🛍️';
      const sessionsInfo = item.type_text === 'Paquete de Yoga' && item.sessions ?
        `\n   📅 ${item.sessions} sessions${item.duration_minutes ? ` (${item.duration_minutes}min each)` : ''}` : '';

      return `${typeEmoji} <b>${item.name}</b>
   💰 ${item.unit_price.toFixed(2)} ${order.currency} × ${item.quantity} = ${(item.total_price).toFixed(2)} ${order.currency}${sessionsInfo}`;
    }).join('\n\n');

    const billingInfo = order.billingDocumentType && (order.dni || order.ruc) ?
      `\n📄 <b>Billing Document:</b> ${order.billingDocumentType === 'boleta_simple' ? 'Boleta Simple' : 'Factura'}
${order.dni ? `🆔 DNI: ${order.dni}` : ''}
${order.ruc ? `🏢 RUC: ${order.ruc}` : ''}
${order.companyName ? `🏢 Company: ${order.companyName}` : ''}` : '';

    const scheduleText = order.scheduleDetails && order.scheduleDetails.length > 0 ?
      order.scheduleDetails.map(schedule => {
        return `📅 <b>Scheduled Session:</b>
   🗓️ ${schedule.selectedDate || 'TBD'}
   🕐 ${schedule.selectedTime || 'TBD'}
   👨‍🏫 ${schedule.teacher || 'TBD'}
   🏠 ${schedule.venue || 'MatMax Wellness Studio'}`;
      }).join('\n\n') : '';

    const packageBookingText = order.packageBookingDetails ?
      `\n📚 <b>Package Details:</b>
   📦 ${order.packageBookingDetails.packageName}
   📅 ${order.packageBookingDetails.sessionsCount} sessions
   ⏱️ ${order.packageBookingDetails.durationMinutes || 'N/A'} minutes each
   🎯 Type: ${order.packageBookingDetails.packageType}` : '';

    const addressText = order.shippingAddress ?
      `\n🚚 <b>Shipping Address:</b>
   ${order.shippingAddress.address}
   ${order.shippingAddress.city}, ${order.shippingAddress.state}
   ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}` : '';

    const notesText = order.notes ? `\n📝 <b>Notes:</b> ${order.notes}` : '';

    return `
🎉 <b>MatMax Order Confirmation</b>

👤 <b>Customer:</b> ${order.customerName}
📧 <b>Email:</b> ${order.customerEmail}
${order.customerPhone ? `📱 <b>Phone:</b> ${order.customerPhone}` : ''}

📦 <b>Order Details:</b>
   🆔 ${order.orderNumber}
   📅 ${order.orderDate}
   📊 <b>Status:</b> ${order.orderStatusText}
   💰 <b>Payment:</b> ${order.paymentStatusText}${billingInfo}

🛒 <b>Items:</b>
${itemsText}

💵 <b>Subtotal:</b> ${order.subtotal.toFixed(2)} ${order.currency}
🧾 <b>Tax (IGV):</b> ${order.taxAmount.toFixed(2)} ${order.currency}
🚚 <b>Shipping:</b> ${order.shippingAmount.toFixed(2)} ${order.currency}
💳 <b>Total: ${order.total.toFixed(2)} ${order.currency}</b>${packageBookingText}${scheduleText}${addressText}${notesText}

Thank you for your order at MatMax! 🙏
We will contact you soon with next steps.

For any questions, reply to this message or contact our support team.
    `.trim();
  }

  /**
   * Get emoji for order status
   */
  private getStatusEmoji(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '📦';
      case 'cancelled':
        return '❌';
      case 'refunded':
        return '💸';
      default:
        return '📋';
    }
  }

  /**
   * Format status text for display
   */
  private formatStatusText(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  }

  /**
   * Test bot connection
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/getMe`);
      const data = await response.json();

      if (data.ok) {
        return {
          success: true,
          message: `Bot connected successfully! Bot name: ${data.result.first_name}`
        };
      } else {
        return {
          success: false,
          message: `Failed to connect to bot: ${data.description}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Factory function to create Telegram order service instance
export function createTelegramOrderService(botToken?: string): TelegramOrderService {
  return new TelegramOrderService(botToken);
}
