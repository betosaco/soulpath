import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyRenewalTemplateStructure() {
  try {
    console.log('🔍 Verifying renewal_matpass template structure...\n');
    
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
    
    console.log('📧 Template Analysis:');
    console.log(`  Template: ${template.name}`);
    console.log(`  Content length: ${content.length} characters`);
    
    // Check for order confirmation elements
    console.log('\n🛒 Order Confirmation Elements:');
    const orderElements = {
      'MatPass details': content.includes('matpassType') && content.includes('matpassSessions'),
      'Pricing information': content.includes('matpassPrice') && content.includes('totalAmount'),
      'Tax information': content.includes('taxAmount') && content.includes('taxRate'),
      'Order summary': content.includes('orderNumber') && content.includes('paymentMethod'),
      'Subtotal breakdown': content.includes('subtotal')
    };
    
    Object.entries(orderElements).forEach(([element, present]) => {
      console.log(`  ${present ? '✅' : '❌'} ${element}`);
    });
    
    // Check for booking confirmation elements
    console.log('\n📅 Booking Confirmation Elements:');
    const bookingElements = {
      'Booking details': content.includes('bookingDate') && content.includes('bookingTime'),
      'Class information': content.includes('sessionType') && content.includes('teacherName'),
      'Location details': content.includes('venue'),
      'Conditional booking section': content.includes('{{#if hasBooking}}')
    };
    
    Object.entries(bookingElements).forEach(([element, present]) => {
      console.log(`  ${present ? '✅' : '❌'} ${element}`);
    });
    
    // Check for product information
    console.log('\n📦 Product Information Elements:');
    const productElements = {
      'Product details': content.includes('productName') && content.includes('productPrice'),
      'Product quantity': content.includes('productQuantity'),
      'Conditional product section': content.includes('{{#if hasProducts}}')
    };
    
    Object.entries(productElements).forEach(([element, present]) => {
      console.log(`  ${present ? '✅' : '❌'} ${element}`);
    });
    
    // Check template structure
    console.log('\n🏗️ Template Structure:');
    const structureElements = {
      'HTML structure': content.includes('<!DOCTYPE html>') && content.includes('<html>'),
      'CSS styling': content.includes('<style>') && content.includes('</style>'),
      'Green theme': content.includes('#4a7c2e') && content.includes('#2d5016'),
      'Responsive design': content.includes('max-width: 600px'),
      'Conditional sections': content.includes('{{#if') && content.includes('{{/if}}')
    };
    
    Object.entries(structureElements).forEach(([element, present]) => {
      console.log(`  ${present ? '✅' : '❌'} ${element}`);
    });
    
    // Summary
    const orderScore = Object.values(orderElements).filter(Boolean).length;
    const bookingScore = Object.values(bookingElements).filter(Boolean).length;
    const productScore = Object.values(productElements).filter(Boolean).length;
    const structureScore = Object.values(structureElements).filter(Boolean).length;
    
    console.log('\n📊 Template Completeness Score:');
    console.log(`  🛒 Order Confirmation: ${orderScore}/5 (${Math.round(orderScore/5*100)}%)`);
    console.log(`  📅 Booking Confirmation: ${bookingScore}/4 (${Math.round(bookingScore/4*100)}%)`);
    console.log(`  📦 Product Information: ${productScore}/3 (${Math.round(productScore/3*100)}%)`);
    console.log(`  🏗️ Template Structure: ${structureScore}/5 (${Math.round(structureScore/5*100)}%)`);
    
    const totalScore = orderScore + bookingScore + productScore + structureScore;
    const maxScore = 5 + 4 + 3 + 5;
    console.log(`\n🎯 Overall Score: ${totalScore}/${maxScore} (${Math.round(totalScore/maxScore*100)}%)`);
    
    if (totalScore >= maxScore * 0.9) {
      console.log('\n✅ Template is comprehensive and well-structured!');
      console.log('📧 This template serves as both:');
      console.log('  🛒 Order confirmation email (purchase details, pricing, payment)');
      console.log('  📅 Booking confirmation email (booking details, class info, instructor)');
    } else {
      console.log('\n⚠️ Template may need improvements');
    }
    
  } catch (error) {
    console.error('❌ Error verifying template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyRenewalTemplateStructure();
