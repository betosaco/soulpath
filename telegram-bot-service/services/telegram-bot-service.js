import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TelegramBotService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '8361218732:AAHWcGk9kMZNNNtJvzZjUelSl5WftCXQoBU';
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  /**
   * Handle incoming messages
   */
  async handleMessage(message) {
    try {
      const chatId = message.chat?.id;
      const text = message.text;
      const userInfo = message.from;

      if (!chatId || !text) {
        console.log('⚠️ Invalid message - missing chat_id or text');
        return;
      }

      console.log(`💬 Processing message from ${userInfo?.first_name || 'Unknown'}: ${text}`);

      // Register or update Telegram user
      try {
        await this.registerTelegramUser({
          telegramChatId: chatId.toString(),
          telegramUserId: userInfo?.id?.toString(),
          telegramUsername: userInfo?.username,
          telegramFirstName: userInfo?.first_name,
          telegramLastName: userInfo?.last_name
        });
      } catch (registrationError) {
        console.error('Error registering Telegram user:', registrationError);
      }

      // Handle commands
      const lowerText = text.toLowerCase().trim();

      if (lowerText === '/start') {
        await this.handleStartCommand(chatId.toString(), userInfo);
        return;
      }

      if (lowerText === '/register') {
        await this.handleRegistrationCommand(chatId.toString(), userInfo);
        return;
      }

      // Handle account linking
      if (lowerText.startsWith('/link') || text.includes('link_')) {
        const linkToken = text.split(' ')[1] || (text.includes('link_') ? text.split('link_')[1].split(' ')[0] : null);
        if (linkToken && linkToken.startsWith('link_')) {
          await this.handleAccountLinking(chatId.toString(), userInfo, linkToken);
          return;
        }
      }

      // Handle package queries
      if (this.isPackageQuery(lowerText)) {
        await this.handlePackageQuery(chatId.toString());
        return;
      }

      // Default response
      await this.sendMessage(chatId, `Hello! 👋 I'm your MatMax assistant. Send /register to link your account for order notifications, or ask about our packages!`);

    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  /**
   * Handle callback queries (button clicks)
   */
  async handleCallbackQuery(callbackQuery) {
    try {
      const chatId = callbackQuery.message?.chat?.id;
      const data = callbackQuery.data;

      if (!chatId || !data) {
        console.log('⚠️ Invalid callback query - missing chat_id or data');
        return;
      }

      console.log(`🔘 Processing callback from ${callbackQuery.from?.first_name || 'Unknown'}: ${data}`);

      // Handle callback data
      if (data.startsWith('package_')) {
        await this.handlePackageCallback(chatId, data);
      }

      // Answer the callback query
      await this.answerCallbackQuery(callbackQuery.id);

    } catch (error) {
      console.error('Error handling callback query:', error);
    }
  }

  /**
   * Register or update Telegram user
   */
  async registerTelegramUser(telegramData) {
    try {
      // First, try to find existing Telegram user by chat ID
      const existingTelegramUser = await prisma.telegramUser.findFirst({
        where: {
          telegramChatId: telegramData.telegramChatId
        }
      });

      if (existingTelegramUser) {
        // Update last interaction
        await prisma.telegramUser.update({
          where: { id: existingTelegramUser.id },
          data: {
            lastInteraction: new Date(),
            isActive: true
          }
        });
        console.log('📱 Telegram user interaction updated');
        return;
      }

      // For new users, we can't automatically link to system user
      // They need to register through the main app
      console.log('📱 New Telegram user detected - waiting for account linking');

    } catch (error) {
      console.error('❌ Error checking Telegram user registration:', error);
    }
  }

  /**
   * Handle start command
   */
  async handleStartCommand(chatId, userInfo) {
    try {
      const startMessage = `
🤖 <b>Welcome to MatMax Telegram Bot!</b>

Hello ${userInfo?.first_name || 'there'}! 👋

I'm your MatMax wellness assistant. I can help you with:

📦 <b>Package Information</b>
• Ask about our yoga packages and pricing
• Get details about classes and sessions

🔔 <b>Order Notifications</b>
• Receive instant order confirmations
• Get updates on your bookings

🔗 <b>Account Linking</b>
• Connect your MatMax account for personalized notifications

Try these commands:
• <code>paquetes</code> - View our packages
• <code>/register</code> - Link your account
• <code>/help</code> - More commands

How can I help you today?
      `.trim();

      await this.sendMessage(chatId, startMessage);
      console.log(`✅ Start message sent to ${chatId}`);

    } catch (error) {
      console.error('❌ Error handling start command:', error);
    }
  }

  /**
   * Handle account linking
   */
  async handleAccountLinking(chatId, userInfo, linkToken) {
    try {
      console.log(`🔗 Processing account linking for chat ${chatId} with token ${linkToken}`);

      // For now, we'll store the Telegram user info and wait for the web app to complete the linking
      // In a production system, you'd validate the token and complete the linking
      const linkingMessage = `
🔗 <b>Account Linking Started!</b>

Your Telegram account has been detected for linking.

Please return to your MatMax account settings page to complete the linking process.

Your chat ID: <code>${chatId}</code>

If you don't see the linking complete automatically, contact support with this chat ID.
      `.trim();

      await this.sendMessage(chatId, linkingMessage);

      // Store the linking information temporarily (in production, use Redis/database)
      // For now, we'll just acknowledge the linking attempt
      console.log(`✅ Account linking initiated for chat ${chatId}`);

    } catch (error) {
      console.error('❌ Error handling account linking:', error);
      await this.sendMessage(chatId, 'Sorry, there was an error linking your account. Please try again.');
    }
  }

  /**
   * Handle registration command
   */
  async handleRegistrationCommand(chatId, userInfo) {
    try {
      const welcomeMessage = `
🤖 <b>Welcome to MatMax Telegram Bot!</b>

Hello ${userInfo?.first_name || 'there'}! 👋

📱 <b>Your Chat ID: <code>${chatId}</code></b>

<b>Copy this Chat ID number above!</b> You'll need it to link your account.

To receive order notifications and updates via Telegram:

1. Go to your MatMax account settings (matmax.world/account/profile)
2. Scroll down to "Telegram Notifications" section
3. Click "Open Telegram Bot" (opens this chat)
4. Paste your Chat ID: <code>${chatId}</code>
5. Click "Link with Chat ID"

Once linked, you'll receive:
✅ Instant order confirmations
📦 Shipping updates
🔔 Status notifications
🎁 Special offers

Questions? Reply to this message or contact support.
      `.trim();

      await this.sendMessage(chatId, welcomeMessage);
      console.log(`✅ Registration welcome message sent to ${chatId}`);

    } catch (error) {
      console.error('❌ Error handling registration command:', error);
    }
  }

  /**
   * Check if message is a package query
   */
  isPackageQuery(text) {
    const packageKeywords = [
      'paquetes', 'packages', 'lista', 'list', 'mostrar', 'show',
      'ver', 'see', 'dame', 'give me', 'precios', 'prices',
      'precio', 'price', 'costo', 'cost', 'tarifa', 'rates',
      'cuánto', 'how much', 'yoga', 'clases', 'classes'
    ];

    return packageKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Handle package queries
   */
  async handlePackageQuery(chatId) {
    try {
      const packagesMessage = `
🧘‍♀️ <b>MatMax Yoga Packages</b>

Here are our available packages:

<b>📚 Individual Sessions</b>
• Single Yoga Class - $25
• Private Session - $50

<b>📦 Package Deals</b>
• 5-Class Package - $110 (save $15)
• 10-Class Package - $200 (save $50)
• Monthly Unlimited - $150

<b>🏠 Private Sessions</b>
• 1-on-1 Yoga - $60/1-hour session
• Couples Session - $80/1-hour session
• Small Group (3-4 people) - $25/person per 1-hour session

<b>🎯 Specialty Classes</b>
• Meditation & Mindfulness - $30
• Yoga Therapy - $45
• Prenatal Yoga - $35

For detailed information and booking, please visit our website or contact us directly!

Questions? Feel free to ask! 🙏
      `.trim();

      await this.sendMessage(chatId, packagesMessage);
      console.log(`✅ Package information sent to ${chatId}`);

    } catch (error) {
      console.error('❌ Error handling package query:', error);
      await this.sendMessage(chatId, 'Sorry, I encountered an error. Please try again later.');
    }
  }

  /**
   * Handle package callback queries
   */
  async handlePackageCallback(chatId, callbackData) {
    // Handle specific package selections if needed
    await this.sendMessage(chatId, 'For detailed booking information, please visit our website or contact us directly!');
  }

  /**
   * Send order confirmation
   */
  async sendOrderConfirmation(chatId, orderDetails) {
    try {
      const message = this.formatOrderMessage(orderDetails);
      await this.sendMessage(chatId, message);
      console.log(`✅ Order confirmation sent to Telegram chat ${chatId}`);
    } catch (error) {
      console.error('❌ Error sending order confirmation:', error);
      throw error;
    }
  }

  /**
   * Format order details into a message
   */
  formatOrderMessage(order) {
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
      order.scheduleDetails.map((schedule, index) => {
        let sessionText = `📅 <b>Scheduled Session ${index + 1}:</b>
   🗓️ ${schedule.selectedDate || 'TBD'}
   🕐 ${schedule.selectedTime || 'TBD'}
   👨‍🏫 ${schedule.teacher || 'TBD'}
   🏠 ${schedule.venue || 'MatMax Wellness Studio'}`;
        
        // For group bookings, show which packages are applied to this session
        if (order.isGroupBooking && order.groupMembers && order.groupMembers.length > 0) {
          sessionText += `\n   📦 <b>Packages for this session:</b>`;
          order.groupMembers.forEach((member, memberIndex) => {
            sessionText += `\n      ${memberIndex + 1}. ${member.firstName} ${member.lastName} - ${member.packageName || 'Package'}`;
          });
        }
        
        return sessionText;
      }).join('\n\n') : '';

    const packageBookingText = order.packageBookingDetails ?
      `\n📚 <b>Package Details:</b>
   📦 ${order.packageBookingDetails.packageName}
   📅 ${order.packageBookingDetails.sessionsCount} sessions
   ⏱️ ${order.packageBookingDetails.durationMinutes || 'N/A'} minutes each
   🎯 Type: ${order.packageBookingDetails.packageType}` : '';

    const groupBookingText = order.isGroupBooking && order.groupMembers && order.groupMembers.length > 0 ?
      `\n👥 <b>Group Booking (${order.groupMembers.length} members):</b>
${order.groupMembers.map((member, index) => `
   ${index + 1}. 👤 <b>${member.firstName} ${member.lastName}</b>
      📧 ${member.email}
      📱 ${member.countryCode} ${member.phone}
      📦 <b>Package:</b> ${member.packageName || 'Package'}
      ${member.birthDate ? `🎂 <b>Birth Date:</b> ${member.birthDate}` : ''}
      ${member.birthTime ? `🕐 <b>Birth Time:</b> ${member.birthTime}` : ''}
      ${member.birthPlace ? `📍 <b>Birth Place:</b> ${member.birthPlace}` : ''}
      ${member.question ? `❓ <b>Question:</b> ${member.question}` : ''}`).join('')}` : '';

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
💳 <b>Total: ${order.total.toFixed(2)} ${order.currency}</b>${packageBookingText}${groupBookingText}${scheduleText}${addressText}${notesText}

Thank you for your order at MatMax! 🙏
We will contact you soon with next steps.

For any questions, reply to this message or contact our support team.
    `.trim();
  }

  /**
   * Format status text
   */
  formatStatusText(status) {
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
   * Send message to Telegram
   */
  async sendMessage(chatId, text, options = {}) {
    try {
      const response = await axios.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...options
      });

      if (response.data.ok) {
        console.log(`✅ Message sent successfully to ${chatId}`);
      } else {
        console.error('❌ Failed to send message:', response.data.description);
      }
    } catch (error) {
      console.error('❌ Error sending message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Answer callback query
   */
  async answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
    try {
      const response = await axios.post(`${this.baseUrl}/answerCallbackQuery`, {
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: showAlert
      });

      if (response.data.ok) {
        console.log(`✅ Callback query answered successfully`);
      } else {
        console.error('❌ Failed to answer callback query:', response.data.description);
      }
    } catch (error) {
      console.error('❌ Error answering callback query:', error.response?.data || error.message);
    }
  }
}
