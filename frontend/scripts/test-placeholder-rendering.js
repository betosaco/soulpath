import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testPlaceholderRendering() {
  try {
    console.log('🧪 Testing placeholder rendering with real data...');
    
    // Get the order confirmation template
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'order_confirmation_complete',
        isActive: true
      },
      include: {
        translations: {
          where: {
            language: 'es'
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
    
    console.log('📧 Original Subject:', subject);
    console.log('📧 Original Content Length:', content.length);
    
    // Create comprehensive test data
    const testData = {
      // Customer data
      userName: 'María García Rodríguez',
      userEmail: 'maria.garcia@example.com',
      userPhone: '+51 999 888 777',
      
      // Order data
      orderNumber: 'ORD-2025-001',
      submissionDate: new Date().toLocaleDateString('es-ES'),
      orderTotal: '450.00',
      subtotalBeforeTax: '381.36',
      igvAmount: '68.64',
      currency: 'PEN',
      
      // URLs
      orderUrl: 'https://matmax.world/account/orders/ORD-2025-001',
      websiteUrl: 'https://matmax.world',
      adminEmail: 'info@matmax.world',
      
      // Conditional sections
      hasMatpass: true,
      hasBooking: true,
      hasProducts: true,
      
      // MATPASS data
      matpassType: 'MATPASS',
      matpassDescription: '10 sesiones de yoga',
      matpassPrice: '300.00',
      matpassStartDate: new Date().toLocaleDateString('es-ES'),
      matpassEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
      matpassSubtotal: '300.00',
      
      // Booking data
      bookingId: 'BK-2025-001',
      bookingDate: 'Lunes, 20 de Enero, 2025',
      bookingTime: '10:00 AM',
      teacherName: 'Ana Martínez',
      className: 'Hatha Yoga',
      venue: 'MATMAX Yoga Studio',
      
      // Product data
      productName: 'Mat de Yoga Premium',
      productDescription: 'Mat de yoga de alta calidad con correa de transporte',
      productQuantity: 1,
      productPrice: '150.00',
      productsSubtotal: '150.00',
      productImage: ''
    };
    
    console.log('\n📊 Test Data:');
    Object.entries(testData).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    // Process template with test data
    let processedSubject = subject;
    let processedContent = content;
    
    // Replace placeholders
    Object.entries(testData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedSubject = processedSubject.replace(new RegExp(placeholder, 'g'), String(value));
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    console.log('\n📧 Processed Subject:', processedSubject);
    console.log('📧 Processed Content Length:', processedContent.length);
    
    // Check for any remaining placeholders
    const remainingPlaceholders = processedContent.match(/\{\{[^}]+\}\}/g);
    if (remainingPlaceholders) {
      console.log('\n⚠️  Remaining placeholders not replaced:');
      remainingPlaceholders.forEach(placeholder => {
        console.log(`  ${placeholder}`);
      });
    } else {
      console.log('\n✅ All placeholders successfully replaced!');
    }
    
    // Check for conditional sections
    const conditionalSections = processedContent.match(/\{\{#if\s+\w+\}\}/g);
    if (conditionalSections) {
      console.log('\n⚠️  Conditional sections not processed:');
      conditionalSections.forEach(section => {
        console.log(`  ${section}`);
      });
    } else {
      console.log('\n✅ All conditional sections processed!');
    }
    
    // Check for loops
    const loopSections = processedContent.match(/\{\{#each\s+\w+\}\}/g);
    if (loopSections) {
      console.log('\n⚠️  Loop sections not processed:');
      loopSections.forEach(section => {
        console.log(`  ${section}`);
      });
    } else {
      console.log('\n✅ All loop sections processed!');
    }
    
    console.log('\n🎯 Placeholder Rendering Test Complete!');
    console.log('📧 The processed content is ready for email sending');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPlaceholderRendering();
