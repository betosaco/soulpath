import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyPlaceholders() {
  try {
    console.log('🔍 Verifying all placeholders in order confirmation template...');
    
    // Get the order confirmation template
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'order_confirmation_complete',
        isActive: true
      },
      include: {
        translations: {
          where: {
            language: 'en'
          }
        }
      }
    });

    if (!template || !template.translations[0]) {
      console.log('❌ Template not found');
      return;
    }

    const content = template.translations[0].content;
    const subject = template.translations[0].subject;
    
    // Extract all placeholders from content
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders = new Set();
    let match;
    
    while ((match = placeholderRegex.exec(content)) !== null) {
      placeholders.add(match[1]);
    }
    
    // Also check subject
    while ((match = placeholderRegex.exec(subject)) !== null) {
      placeholders.add(match[1]);
    }
    
    console.log(`📋 Found ${placeholders.size} unique placeholders in template`);
    
    // Current data mapping from OrderEmailService
    const currentDataMapping = {
      // Customer data
      userName: 'orderData.customerName',
      userEmail: 'orderData.customerEmail',
      userPhone: 'orderData.customerPhone || ""',
      
      // Order data
      orderNumber: 'orderData.orderNumber',
      submissionDate: 'orderData.orderDate',
      orderTotal: 'orderData.totalAmount.toFixed(2)',
      subtotalBeforeTax: 'orderData.subtotal.toFixed(2)',
      igvAmount: 'orderData.taxAmount.toFixed(2)',
      currency: 'orderData.currency',
      
      // URLs
      orderUrl: 'orderData.orderUrl',
      websiteUrl: 'orderData.websiteUrl',
      adminEmail: '"info@matmax.world"',
      
      // Conditional sections
      hasMatpass: 'orderData.matpassItems && orderData.matpassItems.length > 0',
      hasBooking: 'orderData.bookings && orderData.bookings.length > 0',
      hasProducts: 'orderData.products && orderData.products.length > 0',
      
      // MATPASS data
      matpassItems: 'orderData.matpassItems || []',
      matpassType: 'orderData.matpassItems?.[0]?.type || ""',
      matpassDescription: 'orderData.matpassItems?.[0]?.description || ""',
      matpassPrice: 'orderData.matpassItems?.[0]?.totalPrice?.toFixed(2) || "0.00"',
      matpassStartDate: 'orderData.orderDate',
      matpassEndDate: 'orderData.matpassItems?.[0]?.expiryDate || ""',
      matpassSubtotal: 'orderData.matpassItems?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || "0.00"',
      
      // Booking data
      bookings: 'orderData.bookings || []',
      bookingId: 'orderData.bookings?.[0]?.bookingId || ""',
      bookingDate: 'orderData.bookings?.[0]?.bookingDate || ""',
      bookingTime: 'orderData.bookings?.[0]?.bookingTime || ""',
      teacherName: 'orderData.bookings?.[0]?.teacherName || ""',
      className: 'orderData.bookings?.[0]?.sessionType || ""',
      venue: 'orderData.bookings?.[0]?.venue || "MATMAX Yoga Studio"',
      
      // Product data
      products: 'orderData.products || []',
      productImage: '"" (not available)',
      productName: 'orderData.products?.[0]?.name || ""',
      productDescription: 'orderData.products?.[0]?.description || ""',
      productQuantity: 'orderData.products?.[0]?.quantity || 0',
      productPrice: 'orderData.products?.[0]?.totalPrice?.toFixed(2) || "0.00"',
      productsSubtotal: 'orderData.products?.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2) || "0.00"',
      
      // Shipping data
      shippingAddress: 'orderData.shippingAddress'
    };
    
    console.log('\n📊 Placeholder Verification:');
    let allMapped = true;
    
    Array.from(placeholders).sort().forEach(placeholder => {
      // Skip Handlebars control structures
      if (placeholder.startsWith('#') || placeholder.startsWith('/')) {
        console.log(`  🔧 {{${placeholder}}} - Handlebars control structure`);
        return;
      }
      
      const isMapped = currentDataMapping[placeholder] !== undefined;
      const status = isMapped ? '✅' : '❌';
      const source = currentDataMapping[placeholder] || 'NO DATA SOURCE';
      
      console.log(`  ${status} {{${placeholder}}} -> ${source}`);
      
      if (!isMapped) {
        allMapped = false;
      }
    });
    
    if (allMapped) {
      console.log('\n🎉 All placeholders have corresponding data!');
    } else {
      console.log('\n⚠️  Some placeholders are missing data sources');
    }
    
    // Check for unused data
    const templatePlaceholders = Array.from(placeholders);
    const unusedData = Object.keys(currentDataMapping).filter(key => 
      !templatePlaceholders.includes(key) && 
      !key.startsWith('#') && 
      !key.startsWith('/')
    );
    
    if (unusedData.length > 0) {
      console.log('\n📝 Unused data sources:');
      unusedData.forEach(key => {
        console.log(`  - ${key}: ${currentDataMapping[key]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error verifying placeholders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPlaceholders();
