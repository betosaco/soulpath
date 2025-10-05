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
  
  // Payment Information
  paymentMethod?: string;
  isPayLater?: boolean;
  
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
      console.log('📧 OrderEmailService: Order data received:', {
        customerEmail: orderData.customerEmail,
        hasMatpass: orderData.matpassItems?.length > 0,
        hasProducts: orderData.products?.length > 0,
        hasBookings: orderData.bookings?.length > 0,
        paymentMethod: orderData.paymentMethod
      });
      
      // Determine the appropriate template based on order type and customer status
      const templateKey = await this.determineTemplateKey(orderData);
      console.log(`📧 OrderEmailService: Selected template: ${templateKey}`);
      
      const result = await this.sendTemplateEmail(templateKey, orderData, language);
      console.log(`📧 OrderEmailService: Email sending result: ${result}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error in OrderEmailService.sendOrderConfirmationEmail:', error);
      return false;
    }
  }

  /**
   * Get currency symbol from currency code
   */
  private static getCurrencySymbol(currencyCode: string): string {
    const currencyMap: { [key: string]: string } = {
      'PEN': 'S/.',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF',
      'CNY': '¥',
      'MXN': '$',
      'BRL': 'R$',
      'ARS': '$',
      'CLP': '$',
      'COP': '$',
      'UYU': '$U',
      'BOB': 'Bs',
      'VES': 'Bs.S',
      'PYG': '₲',
      'DOP': 'RD$',
      'GTQ': 'Q',
      'HNL': 'L',
      'NIO': 'C$',
      'CRC': '₡',
      'PAB': 'B/.',
      'TTD': 'TT$',
      'JMD': 'J$',
      'BBD': 'Bds$',
      'BZD': 'BZ$',
      'XCD': 'EC$',
      'AWG': 'ƒ',
      'ANG': 'ƒ',
      'SRD': '$',
      'GYD': 'G$',
      'BMD': 'BD$',
      'KYD': 'CI$',
      'BHD': 'د.ب',
      'KWD': 'د.ك',
      'QAR': 'ر.ق',
      'SAR': 'ر.س',
      'AED': 'د.إ',
      'OMR': 'ر.ع.',
      'YER': '﷼',
      'JOD': 'د.ا',
      'LBP': 'ل.ل',
      'SYP': 'ل.س',
      'IQD': 'د.ع',
      'IRR': '﷼',
      'AFN': '؋',
      'PKR': '₨',
      'INR': '₹',
      'BDT': '৳',
      'LKR': '₨',
      'NPR': '₨',
      'BTN': 'Nu.',
      'MVR': 'ރ',
      'SCR': '₨',
      'MMK': 'K',
      'THB': '฿',
      'LAK': '₭',
      'KHR': '៛',
      'VND': '₫',
      'IDR': 'Rp',
      'MYR': 'RM',
      'SGD': 'S$',
      'BND': 'B$',
      'PHP': '₱',
      'TWD': 'NT$',
      'HKD': 'HK$',
      'MOP': 'MOP$',
      'KRW': '₩',
      'MNT': '₮',
      'KZT': '₸',
      'UZS': 'лв',
      'KGS': 'лв',
      'TJS': 'SM',
      'TMT': 'T',
      'AZN': '₼',
      'AMD': '֏',
      'GEL': '₾',
      'TRY': '₺',
      'RUB': '₽',
      'BYN': 'Br',
      'UAH': '₴',
      'MDL': 'L',
      'RON': 'lei',
      'BGN': 'лв',
      'HRK': 'kn',
      'RSD': 'дин',
      'MKD': 'ден',
      'ALL': 'L',
      'BAM': 'КМ',
      'CZK': 'Kč',
      'HUF': 'Ft',
      'PLN': 'zł',
      'SKK': 'Sk',
      'SIT': 'SIT',
      'EEK': 'kr',
      'LVL': 'Ls',
      'LTL': 'Lt',
      'ISK': 'kr',
      'DKK': 'kr',
      'NOK': 'kr',
      'SEK': 'kr',
      'FIM': 'mk',
      'IEP': '£',
      'ITL': 'L',
      'ESP': '₧',
      'PTE': '$',
      'FRF': '₣',
      'BEF': 'fr',
      'NLG': 'ƒ',
      'DEM': 'DM',
      'ATS': 'S',
      'CHF': 'CHF',
      'LIE': 'CHF',
      'MCO': '₣',
      'SMR': '₣',
      'VAT': '₣',
      'ADP': '₣',
      'GRD': '₯',
      'CYP': '£',
      'MTL': '₤',
      'LUF': 'fr',
      'BGL': 'лв',
      'ROL': 'lei',
      'SIT': 'SIT',
      'SKK': 'Sk',
      'EEK': 'kr',
      'LVL': 'Ls',
      'LTL': 'Lt',
      'ZAR': 'R',
      'NAD': 'N$',
      'BWP': 'P',
      'SZL': 'L',
      'LSL': 'L',
      'ZMW': 'ZK',
      'ZWL': 'Z$',
      'AOA': 'Kz',
      'MZN': 'MT',
      'MGA': 'Ar',
      'MUR': '₨',
      'SCR': '₨',
      'KES': 'KSh',
      'TZS': 'TSh',
      'UGX': 'USh',
      'RWF': 'RF',
      'BIF': 'FBu',
      'DJF': 'Fdj',
      'SOS': 'S',
      'ETB': 'Br',
      'ERN': 'Nfk',
      'SDG': 'ج.س',
      'SSP': '£',
      'EGP': '£',
      'LYD': 'ل.د',
      'TND': 'د.ت',
      'DZD': 'د.ج',
      'MAD': 'د.م.',
      'MRO': 'UM',
      'MRU': 'UM',
      'XOF': 'CFA',
      'XAF': 'FCFA',
      'KMF': 'CF',
      'DJF': 'Fdj',
      'SOS': 'S',
      'ETB': 'Br',
      'ERN': 'Nfk',
      'SDG': 'ج.س',
      'SSP': '£',
      'EGP': '£',
      'LYD': 'ل.د',
      'TND': 'د.ت',
      'DZD': 'د.ج',
      'MAD': 'د.م.',
      'MRO': 'UM',
      'MRU': 'UM',
      'XOF': 'CFA',
      'XAF': 'FCFA',
      'KMF': 'CF'
    };
    
    return currencyMap[currencyCode] || currencyCode;
  }

  /**
   * Determine the appropriate template key based on order type and customer status
   * SIMPLIFIED LOGIC - NO MORE COMPLEX FALLBACKS
   */
  private static async determineTemplateKey(orderData: OrderEmailData): Promise<string> {
    console.log('🔍 OrderEmailService: Starting template selection...');
    console.log('📊 Order data received:', {
      customerEmail: orderData.customerEmail,
      matpassItems: orderData.matpassItems?.length || 0,
      bookings: orderData.bookings?.length || 0,
      products: orderData.products?.length || 0
    });

    // DEBUG: Log the actual matpassItems content
    if (orderData.matpassItems && orderData.matpassItems.length > 0) {
      console.log('📦 MatPass items details:', orderData.matpassItems);
    } else {
      console.log('❌ No MatPass items found in order data');
    }

    // STEP 1: Check if this order has MatPass items
    const hasMatpass = orderData.matpassItems && orderData.matpassItems.length > 0;
    console.log(`📦 Has MatPass items: ${hasMatpass}`);

    if (hasMatpass) {
      // STEP 2: If has MatPass, check if customer is new or existing
      const isNewCustomer = await this.isNewCustomer(orderData);
      console.log(`👤 Is new customer: ${isNewCustomer}`);

      if (isNewCustomer) {
        console.log('✅ SELECTED: welcome_matpass (New customer with MatPass)');
        return 'welcome_matpass';
      } else {
        console.log('✅ SELECTED: renewal_matpass (Existing customer with MatPass)');
        return 'renewal_matpass';
      }
    }

    // STEP 3: If no MatPass, check for products only
    const hasProducts = orderData.products && orderData.products.length > 0;
    if (hasProducts && !hasMatpass) {
      console.log('✅ SELECTED: products_only (Products only)');
      return 'products_only';
    }

    // STEP 4: If no MatPass and no products, check for bookings only
    const hasBookings = orderData.bookings && orderData.bookings.length > 0;
    if (hasBookings && !hasMatpass && !hasProducts) {
      console.log('✅ SELECTED: booking_only (Booking only)');
      return 'booking_only';
    }

    // STEP 5: Fallback (should not happen in normal flow)
    console.log('⚠️ FALLBACK: order_confirmation_complete');
    return 'order_confirmation_complete';
  }

  /**
   * Check if this is a new customer by checking database for previous orders
   */
  private static async isNewCustomer(orderData: OrderEmailData): Promise<boolean> {
    try {
      // Check if customer has previous orders in the database
      const previousOrders = await prisma.order.findMany({
        where: {
          customerEmail: orderData.customerEmail,
          status: {
            not: 'CANCELLED'
          }
        },
        take: 1
      });
      
      // If no previous orders found, this is a new customer
      return previousOrders.length === 0;
    } catch (error) {
      console.error('Error checking customer history:', error);
      // If there's an error, assume new customer to be safe
      return true;
    }
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
      
      // Use booking data as provided in order data (simplified)
      const bookingData = orderData.bookings || [];
      console.log(`📧 OrderEmailService: Using ${bookingData.length} bookings from order data`);

      // Get currency symbol
      const currencySymbol = this.getCurrencySymbol(orderData.currency);
      
      // Prepare template data with all required placeholders
      const templateData = {
        // Customer data
        userName: orderData.customerName,
        userEmail: orderData.customerEmail,
        userPhone: orderData.customerPhone || '',
        
        // Order data
        orderNumber: orderData.orderNumber,
        submissionDate: orderData.orderDate,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        orderTotal: `${currencySymbol} ${orderData.totalAmount.toFixed(2)}`, // Currency symbol format
        subtotalBeforeTax: `${currencySymbol} ${orderData.subtotal.toFixed(2)}`, // Currency symbol format
        igvAmount: `${currencySymbol} ${orderData.taxAmount.toFixed(2)}`, // Currency symbol format
        currency: currencySymbol, // Currency symbol
        
        // Additional order placeholders
        subtotal: `${currencySymbol} ${orderData.subtotal.toFixed(2)}`, // Currency symbol format
        taxAmount: `${currencySymbol} ${orderData.taxAmount.toFixed(2)}`, // Currency symbol format
        taxRate: '18', // IGV rate in Peru
        shippingAmount: `${currencySymbol} ${orderData.shippingAmount.toFixed(2)}`, // Currency symbol format
        totalAmount: `${currencySymbol} ${orderData.totalAmount.toFixed(2)}`, // Currency symbol format
        
        // URLs
        orderUrl: orderData.orderUrl,
        websiteUrl: orderData.websiteUrl,
        adminEmail: 'info@matmax.world',
        
        // Conditional sections
        hasMatpass: orderData.matpassItems && orderData.matpassItems.length > 0,
        hasBooking: bookingData.length > 0,
        hasProducts: orderData.products && orderData.products.length > 0,
        
        // MATPASS data (if applicable)
        matpassItems: orderData.matpassItems || [],
        matpassType: orderData.matpassItems?.[0]?.name || 'MATPASS', // Use actual MatPass name (01 MATPASS, 04 MATPASS, etc.)
        matpassDescription: orderData.matpassItems?.[0]?.description || '',
        matpassPrice: `${currencySymbol} ${orderData.matpassItems?.[0]?.totalPrice?.toFixed(2) || '0.00'}`, // Currency symbol format
        matpassStartDate: new Date().toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        matpassEndDate: orderData.matpassItems?.[0]?.expiryDate || '',
        matpassSubtotal: `${currencySymbol} ${orderData.matpassItems?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00'}`, // Currency symbol format
        matpassSessions: orderData.matpassItems?.[0]?.sessions || 0, // Add sessions count
        
        // Booking data (if applicable)
        bookings: bookingData,
        bookingId: bookingData?.[0]?.bookingId || '',
        bookingDate: bookingData?.[0]?.bookingDate || '',
        bookingTime: bookingData?.[0]?.bookingTime || '',
        sessionType: bookingData?.[0]?.sessionType || '',
        teacherName: bookingData?.[0]?.teacherName || '',
        venue: bookingData?.[0]?.venue || 'MATMAX Yoga Studio',
        bookingPrice: '0.00', // Booking is included in MatPass
        
        // Product data (if applicable)
        products: orderData.products || [],
        productImage: '', // Not available in current data structure
        productName: orderData.products?.[0]?.name || '',
        productDescription: orderData.products?.[0]?.description || '',
        productQuantity: orderData.products?.[0]?.quantity || 0,
        productPrice: `${currencySymbol} ${orderData.products?.[0]?.totalPrice?.toFixed(2) || '0.00'}`, // Currency symbol format
        productsPrice: `${currencySymbol} ${orderData.products?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00'}`, // Currency symbol format
        productsSubtotal: `${currencySymbol} ${orderData.products?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || '0.00'}`, // Currency symbol format
        
        // Shipping data (if applicable)
        shippingAddress: orderData.shippingAddress,
        
        // Payment data (if applicable)
        paymentMethod: orderData.paymentMethod,
        isPayLater: orderData.isPayLater
      };

      // Process template with Handlebars-like replacement
      console.log('📧 OrderEmailService: Processing template with data:', {
        hasMatpass: templateData.hasMatpass,
        hasProducts: templateData.hasProducts,
        hasBooking: templateData.hasBooking,
        productsCount: templateData.products?.length || 0,
        matpassCount: templateData.matpassItems?.length || 0
      });
      
      const processedContent = this.processTemplate(templateTranslation.content, templateData);
      const processedSubject = this.processTemplate(templateTranslation.subject, templateData);
      
      console.log('📧 OrderEmailService: Template processing completed');
      console.log('📧 OrderEmailService: Subject length:', processedSubject.length);
      console.log('📧 OrderEmailService: Content length:', processedContent.length);

      // Send email using Brevo service
      console.log('📧 OrderEmailService: Creating email service...');
      const emailService = await createEmailService();
      if (!emailService) {
        console.error('❌ Email service not available - check Brevo API key configuration');
        return false;
      }
      console.log('📧 OrderEmailService: Email service created successfully');

      console.log('📧 OrderEmailService: Sending email to:', orderData.customerEmail);
      console.log('📧 OrderEmailService: Email subject:', processedSubject.substring(0, 100) + '...');
      
      try {
        const emailResult = await emailService.sendEmailWithBCC({
          to: orderData.customerEmail,
          bcc: 'alberto@matmax.world',
          subject: processedSubject,
          html: processedContent,
          text: this.generateTextVersion(templateData)
        });

        console.log('📧 OrderEmailService: Email sending result:', emailResult);

        if (!emailResult) {
          console.error('❌ Failed to send order confirmation email - Brevo API returned false');
          return false;
        }

        console.log('✅ Order confirmation email sent successfully using template system');
        return true;
      } catch (emailError) {
        console.error('❌ Exception during email sending:', emailError);
        return false;
      }

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

    // Handle shipping address object placeholders
    if (data.shippingAddress && typeof data.shippingAddress === 'object') {
      const shipping = data.shippingAddress;
      processed = processed.replace(/\{\{shippingAddress\.address\}\}/g, shipping.address || '');
      processed = processed.replace(/\{\{shippingAddress\.city\}\}/g, shipping.city || '');
      processed = processed.replace(/\{\{shippingAddress\.state\}\}/g, shipping.state || '');
      processed = processed.replace(/\{\{shippingAddress\.zipCode\}\}/g, shipping.zipCode || '');
      processed = processed.replace(/\{\{shippingAddress\.country\}\}/g, shipping.country || '');
    }

    // Handle conditional sections
    processed = this.processConditionalSections(processed, data);
    
    // Handle loops
    processed = this.processLoops(processed, data);

    return processed;
  }

  /**
   * Process conditional sections ({{#if}} blocks with {{else}} support)
   */
  private static processConditionalSections(template: string, data: any): string {
    let processed = template;
    
    // Handle {{#if hasMatpass}}...{{else}}...{{/if}} blocks
    const matpassRegex = /{{#if hasMatpass}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g;
    processed = processed.replace(matpassRegex, (match, ifContent, elseContent) => {
      return data.hasMatpass ? ifContent : (elseContent || '');
    });

    // Handle {{#if hasBooking}}...{{else}}...{{/if}} blocks
    const bookingRegex = /{{#if hasBooking}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g;
    processed = processed.replace(bookingRegex, (match, ifContent, elseContent) => {
      return data.hasBooking ? ifContent : (elseContent || '');
    });

    // Handle {{#if hasBookings}}...{{else}}...{{/if}} blocks (plural version)
    const bookingsRegex = /{{#if hasBookings}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g;
    processed = processed.replace(bookingsRegex, (match, ifContent, elseContent) => {
      return data.hasBooking ? ifContent : (elseContent || '');
    });

    // Handle {{#if hasProducts}}...{{else}}...{{/if}} blocks
    const productsRegex = /{{#if hasProducts}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g;
    processed = processed.replace(productsRegex, (match, ifContent, elseContent) => {
      return data.hasProducts ? ifContent : (elseContent || '');
    });

    // Handle {{#if paymentMethod}}...{{/if}} blocks
    const paymentMethodRegex = /{{#if paymentMethod}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(paymentMethodRegex, (match, content) => {
      return data.paymentMethod ? content : '';
    });

    // Handle {{#if isPayLater}}...{{else}}...{{/if}} blocks
    const payLaterRegex = /{{#if isPayLater}}([\s\S]*?)(?:{{else}}([\s\S]*?))?{{\/if}}/g;
    processed = processed.replace(payLaterRegex, (match, ifContent, elseContent) => {
      return data.isPayLater ? ifContent : (elseContent || '');
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
