import { prisma } from '@/lib/prisma';
import { createEmailService } from '@/lib/brevo-email-service';

export interface OrderEmailData {
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  
  // Order Information
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
  
  // URLs
  orderUrl: string;
  websiteUrl: string;
}

export class OrderEmailService {
  /**
   * Send order confirmation email using the template system with intelligent routing
   */
  static async sendOrderConfirmationEmail(orderData: OrderEmailData, language: 'en' | 'es' = 'en'): Promise<boolean> {
    try {
      console.log('📧 OrderEmailService: Starting intelligent email routing...');
      
      // Determine the appropriate template based on order type and customer status
      const templateKey = this.determineTemplateKey(orderData);
      console.log(`📧 OrderEmailService: Selected template: ${templateKey}`);
      
      return await this.sendTemplateEmail(templateKey, orderData, language);
      
    } catch (error) {
      console.error('❌ Error in OrderEmailService.sendOrderConfirmationEmail:', error);
      return false;
    }
  }

  /**
   * Determine the appropriate template key based on order type and customer status
   */
  private static determineTemplateKey(orderData: OrderEmailData): string {
    const hasMatpass = orderData.matpassItems && orderData.matpassItems.length > 0;
    const hasBookings = orderData.bookings && orderData.bookings.length > 0;
    const hasProducts = orderData.products && orderData.products.length > 0;
    
    console.log('📊 OrderEmailService: Analyzing order components:');
    console.log(`  - Has MatPass: ${hasMatpass}`);
    console.log(`  - Has Bookings: ${hasBookings}`);
    console.log(`  - Has Products: ${hasProducts}`);
    
    // Decision Flow Implementation - Handle all combinations
    if (hasMatpass) {
      // MatPass Purchase - Check if new customer or renewal
      const isNewCustomer = this.isNewCustomer(orderData);
      console.log(`  - Is New Customer: ${isNewCustomer}`);
      
      if (isNewCustomer) {
        // New customer with MatPass - check for additional components
        if (hasBookings && hasProducts) {
          console.log('📧 OrderEmailService: New customer with MatPass + Booking + Products');
          return 'welcome_matpass'; // Welcome template handles all components
        } else if (hasBookings) {
          console.log('📧 OrderEmailService: New customer with MatPass + Booking');
          return 'welcome_matpass'; // Welcome template handles MatPass + booking
        } else if (hasProducts) {
          console.log('📧 OrderEmailService: New customer with MatPass + Products');
          return 'welcome_matpass'; // Welcome template handles MatPass + products
        } else {
          console.log('📧 OrderEmailService: New customer with MatPass only');
          return 'welcome_matpass'; // New customer with MatPass only
        }
      } else {
        // Existing customer renewal - check for additional components
        if (hasBookings && hasProducts) {
          console.log('📧 OrderEmailService: Existing customer with MatPass + Booking + Products');
          return 'renewal_matpass'; // Renewal template handles all components
        } else if (hasBookings) {
          console.log('📧 OrderEmailService: Existing customer with MatPass + Booking');
          return 'renewal_matpass'; // Renewal template handles MatPass + booking
        } else if (hasProducts) {
          console.log('📧 OrderEmailService: Existing customer with MatPass + Products');
          return 'renewal_matpass'; // Renewal template handles MatPass + products
        } else {
          console.log('📧 OrderEmailService: Existing customer with MatPass only');
          return 'renewal_matpass'; // Existing customer with MatPass only
        }
      }
    } else if (hasProducts && !hasMatpass) {
      // Products Only Purchase
      console.log('📧 OrderEmailService: Products only purchase');
      return 'products_only';
    } else if (hasBookings && !hasMatpass && !hasProducts) {
      // Booking from existing account with MatPass
      console.log('📧 OrderEmailService: Booking only from existing account');
      return 'booking_only';
    } else {
      // Fallback to comprehensive template
      console.log('📧 OrderEmailService: Using fallback comprehensive template');
      return 'order_confirmation_complete';
    }
  }

  /**
   * Check if this is a new customer (simplified logic)
   * In a real implementation, this would check the database for previous orders
   */
  private static isNewCustomer(orderData: OrderEmailData): boolean {
    // For now, we'll use a simple heuristic
    // In production, this should check the database for previous orders
    // This is a placeholder - you should implement proper customer history checking
    return true; // Assume new customer for now
  }

  /**
   * Send email using the specified template
   */
  private static async sendTemplateEmail(templateKey: string, orderData: OrderEmailData, language: 'en' | 'es'): Promise<boolean> {
    try {
      console.log('📧 Sending order confirmation email using template system...');
      
      // Get the specified template
      const template = await prisma.communicationTemplate.findFirst({
        where: {
          templateKey: templateKey,
          isActive: true
        },
        include: {
          translations: {
            where: {
              language: language
            }
          }
        }
      });

      if (!template || !template.translations[0]) {
        console.error('❌ Order confirmation template not found');
        return false;
      }

      const templateTranslation = template.translations[0];
      
      // Prepare template data with all required placeholders
      const templateData = {
        // Customer data
        userName: orderData.customerName,
        userEmail: orderData.customerEmail,
        userPhone: orderData.customerPhone || '',
        
        // Order data
        orderNumber: orderData.orderNumber,
        submissionDate: orderData.orderDate,
        orderTotal: orderData.totalAmount.toFixed(2),
        subtotalBeforeTax: orderData.subtotal.toFixed(2),
        igvAmount: orderData.taxAmount.toFixed(2),
        currency: orderData.currency,
        
        // Additional order placeholders
        subtotal: orderData.subtotal.toFixed(2),
        taxAmount: orderData.taxAmount.toFixed(2),
        shippingAmount: orderData.shippingAmount.toFixed(2),
        totalAmount: orderData.totalAmount.toFixed(2),
        
        // URLs
        orderUrl: orderData.orderUrl,
        websiteUrl: orderData.websiteUrl,
        adminEmail: 'info@matmax.world',
        
        // Conditional sections
        hasMatpass: orderData.matpassItems && orderData.matpassItems.length > 0,
        hasBooking: orderData.bookings && orderData.bookings.length > 0,
        hasProducts: orderData.products && orderData.products.length > 0,
        
        // MATPASS data (if applicable)
        matpassItems: orderData.matpassItems || [],
        matpassType: orderData.matpassItems?.[0]?.type || '',
        matpassDescription: orderData.matpassItems?.[0]?.description || '',
        matpassPrice: orderData.matpassItems?.[0]?.totalPrice?.toFixed(2) || '0.00',
        matpassStartDate: orderData.orderDate,
        matpassEndDate: orderData.matpassItems?.[0]?.expiryDate || '',
        matpassSubtotal: orderData.matpassItems?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00',
        
        // Booking data (if applicable)
        bookings: orderData.bookings || [],
        bookingId: orderData.bookings?.[0]?.bookingId || '',
        bookingDate: orderData.bookings?.[0]?.bookingDate || '',
        bookingTime: orderData.bookings?.[0]?.bookingTime || '',
        teacherName: orderData.bookings?.[0]?.teacherName || '',
        className: orderData.bookings?.[0]?.sessionType || '',
        venue: orderData.bookings?.[0]?.venue || 'MATMAX Yoga Studio',
        
        // Product data (if applicable)
        products: orderData.products || [],
        productImage: '', // Not available in current data structure
        productName: orderData.products?.[0]?.name || '',
        productDescription: orderData.products?.[0]?.description || '',
        productQuantity: orderData.products?.[0]?.quantity || 0,
        productPrice: orderData.products?.[0]?.totalPrice?.toFixed(2) || '0.00',
        productsSubtotal: orderData.products?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00',
        
        // Shipping data (if applicable)
        shippingAddress: orderData.shippingAddress
      };

      // Process template with Handlebars-like replacement
      const processedContent = this.processTemplate(templateTranslation.content, templateData);
      const processedSubject = this.processTemplate(templateTranslation.subject, templateData);

      // Send email using Brevo service
      const emailService = await createEmailService();
      if (!emailService) {
        console.error('❌ Email service not available');
        return false;
      }

      const emailResult = await emailService.sendEmailWithBCC({
        to: orderData.customerEmail,
        bcc: 'alberto@matmax.world',
        subject: processedSubject,
        html: processedContent,
        text: this.generateTextVersion(templateData)
      });

      if (!emailResult) {
        console.error('❌ Failed to send order confirmation email');
        return false;
      }

      console.log('✅ Order confirmation email sent successfully using template system');
      return true;

    } catch (error) {
      console.error('❌ Error sending order confirmation email:', error);
      return false;
    }
  }

  /**
   * Process template with data replacement
   */
  private static processTemplate(template: string, data: any): string {
    let processed = template;
    
    // Replace simple placeholders first
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string' || typeof data[key] === 'number' || typeof data[key] === 'boolean') {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processed = processed.replace(regex, String(data[key]));
      }
    });

    // Handle conditional sections
    processed = this.processConditionalSections(processed, data);
    
    // Handle loops
    processed = this.processLoops(processed, data);

    return processed;
  }

  /**
   * Process conditional sections ({{#if}} blocks)
   */
  private static processConditionalSections(template: string, data: any): string {
    let processed = template;
    
    // Handle {{#if hasMatpass}} blocks
    const matpassRegex = /{{#if hasMatpass}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(matpassRegex, (match, content) => {
      return data.hasMatpass ? content : '';
    });

    // Handle {{#if hasBooking}} blocks (note: singular, not plural)
    const bookingRegex = /{{#if hasBooking}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(bookingRegex, (match, content) => {
      return data.hasBooking ? content : '';
    });

    // Handle {{#if hasBookings}} blocks (plural version)
    const bookingsRegex = /{{#if hasBookings}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(bookingsRegex, (match, content) => {
      return data.hasBooking ? content : '';
    });

    // Handle {{#if hasProducts}} blocks
    const productsRegex = /{{#if hasProducts}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(productsRegex, (match, content) => {
      return data.hasProducts ? content : '';
    });

    return processed;
  }

  /**
   * Process loops ({{#each}} blocks)
   */
  private static processLoops(template: string, data: any): string {
    let processed = template;
    
    // Handle {{#each matpassItems}} loops
    const matpassLoopRegex = /{{#each matpassItems}}([\s\S]*?){{\/each}}/g;
    processed = processed.replace(matpassLoopRegex, (match, content) => {
      if (!data.matpassItems || data.matpassItems.length === 0) return '';
      
      return data.matpassItems.map((item: any) => {
        let itemContent = content;
        // Map item properties to template placeholders
        const itemData = {
          name: item.name,
          sessions: item.sessions,
          totalPrice: item.totalPrice?.toFixed(2) || '0.00',
          expiryDate: item.expiryDate
        };
        
        Object.keys(itemData).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          itemContent = itemContent.replace(regex, String(itemData[key]));
        });
        return itemContent;
      }).join('');
    });

    // Handle {{#each bookings}} loops
    const bookingsLoopRegex = /{{#each bookings}}([\s\S]*?){{\/each}}/g;
    processed = processed.replace(bookingsLoopRegex, (match, content) => {
      if (!data.bookings || data.bookings.length === 0) return '';
      
      return data.bookings.map((booking: any) => {
        let bookingContent = content;
        // Map booking properties to template placeholders
        const bookingData = {
          sessionType: booking.sessionType,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
          teacherName: booking.teacherName,
          venue: booking.venue
        };
        
        Object.keys(bookingData).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          bookingContent = bookingContent.replace(regex, String(bookingData[key]));
        });
        return bookingContent;
      }).join('');
    });

    // Handle {{#each products}} loops
    const productsLoopRegex = /{{#each products}}([\s\S]*?){{\/each}}/g;
    processed = processed.replace(productsLoopRegex, (match, content) => {
      if (!data.products || data.products.length === 0) return '';
      
      return data.products.map((product: any) => {
        let productContent = content;
        // Map product properties to template placeholders
        const productData = {
          name: product.name,
          quantity: product.quantity,
          totalPrice: product.totalPrice?.toFixed(2) || '0.00',
          description: product.description
        };
        
        Object.keys(productData).forEach(key => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          productContent = productContent.replace(regex, String(productData[key]));
        });
        return productContent;
      }).join('');
    });

    return processed;
  }

  /**
   * Generate text version of the email
   */
  private static generateTextVersion(data: any): string {
    return `
Order Confirmation - MATMAX Wellness Studio

Hello ${data.userName},

Thank you for your order! Your order has been confirmed successfully.

ORDER DETAILS:
Order Number: ${data.orderNumber}
Date: ${data.submissionDate}
Total: ${data.currency} ${data.totalAmount}

${data.hasMatpass ? `
MATPASS ITEMS:
${data.matpassItems.map((item: any) => `- ${item.name} (${item.sessions} sessions) - ${data.currency} ${item.totalPrice}`).join('\n')}
` : ''}

${data.hasBookings ? `
BOOKINGS:
${data.bookings.map((booking: any) => `- ${booking.sessionType} on ${booking.bookingDate} at ${booking.bookingTime} with ${booking.teacherName}`).join('\n')}
` : ''}

${data.hasProducts ? `
PRODUCTS:
${data.products.map((product: any) => `- ${product.name} x ${product.quantity} - ${data.currency} ${product.totalPrice}`).join('\n')}
` : ''}

PRICE BREAKDOWN:
- Subtotal: ${data.currency} ${data.subtotal}
- Tax: ${data.currency} ${data.taxAmount}
- Shipping: ${data.currency} ${data.shippingAmount}
- TOTAL: ${data.currency} ${data.totalAmount}

View your order: ${data.orderUrl}

If you have any questions, please contact us at ${data.adminEmail}.

MATMAX Wellness Studio
Premium Yoga Classes in Miraflores, Lima
    `.trim();
  }
}
