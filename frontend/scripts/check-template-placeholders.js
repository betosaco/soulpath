import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTemplatePlaceholders() {
  try {
    console.log('🔍 Checking template placeholders...\n');
    
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'renewal_matpass'
      },
      include: {
        translations: true
      }
    });
    
    if (!template) {
      console.log('❌ Template not found!');
      return;
    }
    
    const enTranslation = template.translations.find(t => t.language === 'en');
    if (!enTranslation) {
      console.log('❌ English translation not found!');
      return;
    }
    
    const content = enTranslation.content;
    
    // Extract all placeholders from the template
    const placeholderRegex = /\{\{([^}]+)\}\}/g;
    const placeholders = [];
    let match;
    
    while ((match = placeholderRegex.exec(content)) !== null) {
      placeholders.push(match[1]);
    }
    
    // Remove duplicates and sort
    const uniquePlaceholders = [...new Set(placeholders)].sort();
    
    console.log('📧 Template Placeholders Found:');
    uniquePlaceholders.forEach(placeholder => {
      console.log(`  - {{${placeholder}}}`);
    });
    
    // Categorize placeholders
    const categories = {
      'Customer Info': placeholders.filter(p => ['userName', 'userEmail', 'userPhone'].includes(p)),
      'Order Info': placeholders.filter(p => ['orderNumber', 'orderDate', 'subtotal', 'taxAmount', 'totalAmount', 'paymentMethod'].includes(p)),
      'MatPass Info': placeholders.filter(p => ['matpassType', 'matpassDescription', 'matpassPrice', 'matpassStartDate', 'matpassEndDate', 'matpassSessions'].includes(p)),
      'Booking Info': placeholders.filter(p => ['bookingDate', 'bookingTime', 'sessionType', 'teacherName', 'venue'].includes(p)),
      'Product Info': placeholders.filter(p => ['productName', 'productDescription', 'productQuantity', 'productPrice'].includes(p)),
      'Conditional': placeholders.filter(p => ['hasBooking', 'hasProducts', 'hasMatpass'].includes(p)),
      'Other': placeholders.filter(p => !['userName', 'userEmail', 'userPhone', 'orderNumber', 'orderDate', 'subtotal', 'taxAmount', 'totalAmount', 'paymentMethod', 'matpassType', 'matpassDescription', 'matpassPrice', 'matpassStartDate', 'matpassEndDate', 'matpassSessions', 'bookingDate', 'bookingTime', 'sessionType', 'teacherName', 'venue', 'productName', 'productDescription', 'productQuantity', 'productPrice', 'hasBooking', 'hasProducts', 'hasMatpass'].includes(p))
    };
    
    console.log('\n📊 Placeholder Categories:');
    Object.entries(categories).forEach(([category, placeholders]) => {
      if (placeholders.length > 0) {
        console.log(`\n  ${category}:`);
        placeholders.forEach(placeholder => {
          console.log(`    - {{${placeholder}}}`);
        });
      }
    });
    
    // Check for missing mappings
    console.log('\n🔍 Checking for missing mappings:');
    
    const expectedMappings = {
      'userName': 'orderData.customerName',
      'userEmail': 'orderData.customerEmail',
      'userPhone': 'orderData.customerPhone',
      'orderNumber': 'orderData.orderNumber',
      'orderDate': 'orderData.orderDate',
      'subtotal': 'orderData.subtotal',
      'taxAmount': 'orderData.taxAmount',
      'totalAmount': 'orderData.totalAmount',
      'paymentMethod': 'orderData.paymentMethod',
      'matpassType': 'orderData.matpassItems?.[0]?.type',
      'matpassDescription': 'orderData.matpassItems?.[0]?.description',
      'matpassPrice': 'orderData.matpassItems?.[0]?.totalPrice',
      'matpassStartDate': 'orderData.orderDate',
      'matpassEndDate': 'orderData.matpassItems?.[0]?.expiryDate',
      'matpassSessions': 'orderData.matpassItems?.[0]?.sessions',
      'bookingDate': 'orderData.bookings?.[0]?.bookingDate',
      'bookingTime': 'orderData.bookings?.[0]?.bookingTime',
      'sessionType': 'orderData.bookings?.[0]?.sessionType',
      'teacherName': 'orderData.bookings?.[0]?.teacherName',
      'venue': 'orderData.bookings?.[0]?.venue',
      'productName': 'orderData.products?.[0]?.name',
      'productDescription': 'orderData.products?.[0]?.description',
      'productQuantity': 'orderData.products?.[0]?.quantity',
      'productPrice': 'orderData.products?.[0]?.totalPrice',
      'hasBooking': 'orderData.bookings && orderData.bookings.length > 0',
      'hasProducts': 'orderData.products && orderData.products.length > 0',
      'hasMatpass': 'orderData.matpassItems && orderData.matpassItems.length > 0'
    };
    
    const missingMappings = [];
    const incorrectMappings = [];
    
    uniquePlaceholders.forEach(placeholder => {
      if (expectedMappings[placeholder]) {
        console.log(`  ✅ {{${placeholder}}} -> ${expectedMappings[placeholder]}`);
      } else {
        missingMappings.push(placeholder);
        console.log(`  ❌ {{${placeholder}}} -> MISSING MAPPING`);
      }
    });
    
    if (missingMappings.length > 0) {
      console.log('\n⚠️ Missing Mappings:');
      missingMappings.forEach(placeholder => {
        console.log(`  - {{${placeholder}}}`);
      });
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Total placeholders: ${uniquePlaceholders.length}`);
    console.log(`  Mapped placeholders: ${uniquePlaceholders.length - missingMappings.length}`);
    console.log(`  Missing mappings: ${missingMappings.length}`);
    
  } catch (error) {
    console.error('❌ Error checking placeholders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplatePlaceholders();