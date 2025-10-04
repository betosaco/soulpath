import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTemplatePlaceholders() {
  try {
    console.log('🔍 Checking placeholders in order confirmation template...');
    
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
    
    console.log('📧 Template Subject:', subject);
    console.log('📧 Template Content Length:', content.length);
    
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
    
    console.log('\n📋 Found Placeholders:');
    Array.from(placeholders).sort().forEach(placeholder => {
      console.log(`  - {{${placeholder}}}`);
    });
    
    console.log('\n🔍 Checking data mapping in OrderEmailService...');
    
    // Check what data is being passed
    const expectedData = {
      // Customer data
      userName: 'orderData.customerName',
      userEmail: 'orderData.customerEmail', 
      userPhone: 'orderData.customerPhone || ""',
      
      // Order data
      orderNumber: 'orderData.orderNumber',
      submissionDate: 'orderData.orderDate',
      totalAmount: 'orderData.totalAmount.toFixed(2)',
      currency: 'orderData.currency',
      subtotal: 'orderData.subtotal.toFixed(2)',
      taxAmount: 'orderData.taxAmount.toFixed(2)',
      shippingAmount: 'orderData.shippingAmount.toFixed(2)',
      
      // URLs
      orderUrl: 'orderData.orderUrl',
      websiteUrl: 'orderData.websiteUrl',
      adminEmail: '"info@matmax.world"',
      
      // Conditional sections
      hasMatpass: 'orderData.matpassItems && orderData.matpassItems.length > 0',
      hasBookings: 'orderData.bookings && orderData.bookings.length > 0',
      hasProducts: 'orderData.products && orderData.products.length > 0',
      
      // Arrays
      matpassItems: 'orderData.matpassItems || []',
      bookings: 'orderData.bookings || []',
      products: 'orderData.products || []',
      shippingAddress: 'orderData.shippingAddress'
    };
    
    console.log('\n📊 Data Mapping:');
    Object.entries(expectedData).forEach(([key, source]) => {
      const isInTemplate = placeholders.has(key);
      console.log(`  ${isInTemplate ? '✅' : '❌'} {{${key}}} -> ${source}`);
    });
    
    // Check for missing data
    const missingData = Array.from(placeholders).filter(p => !expectedData[p]);
    if (missingData.length > 0) {
      console.log('\n⚠️  Missing Data Mapping:');
      missingData.forEach(placeholder => {
        console.log(`  ❌ {{${placeholder}}} - No data source found`);
      });
    } else {
      console.log('\n✅ All placeholders have corresponding data!');
    }
    
  } catch (error) {
    console.error('❌ Error checking placeholders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplatePlaceholders();
