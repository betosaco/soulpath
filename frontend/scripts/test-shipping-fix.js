import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testShippingFix() {
  try {
    console.log('🧪 Testing shipping address fix in templates...');

    // Test renewal_matpass template
    const renewalTemplate = await prisma.communicationTemplate.findFirst({
      where: { templateKey: 'renewal_matpass' },
      include: { 
        translations: {
          where: { language: 'es' }
        }
      }
    });

    if (renewalTemplate && renewalTemplate.translations[0]) {
      const content = renewalTemplate.translations[0].content;
      
      console.log('\n📧 Renewal MatPass Template Analysis:');
      console.log(`  - Has shipping section: ${content.includes('shipping-info') ? '✅' : '❌'}`);
      console.log(`  - Has shipping address placeholder: ${content.includes('{{shippingAddress.address}}') ? '✅' : '❌'}`);
      console.log(`  - Has shipping city placeholder: ${content.includes('{{shippingAddress.city}}') ? '✅' : '❌'}`);
      console.log(`  - Has products conditional: ${content.includes('{{#if hasProducts}}') ? '✅' : '❌'}`);
      console.log(`  - Has shipping conditional: ${content.includes('{{#if hasProducts}}') && content.includes('shipping-info') ? '✅' : '❌'}`);

      // Show the shipping section
      const shippingMatch = content.match(/<div class="shipping-info"[^>]*>[\s\S]*?<\/div>/);
      if (shippingMatch) {
        console.log('\n📋 Shipping section preview:');
        console.log(shippingMatch[0].substring(0, 300) + '...');
      }
    }

    // Test welcome_matpass template
    const welcomeTemplate = await prisma.communicationTemplate.findFirst({
      where: { templateKey: 'welcome_matpass' },
      include: { 
        translations: {
          where: { language: 'es' }
        }
      }
    });

    if (welcomeTemplate && welcomeTemplate.translations[0]) {
      const content = welcomeTemplate.translations[0].content;
      
      console.log('\n📧 Welcome MatPass Template Analysis:');
      console.log(`  - Has shipping section: ${content.includes('shipping-info') ? '✅' : '❌'}`);
      console.log(`  - Has shipping address placeholder: ${content.includes('{{shippingAddress.address}}') ? '✅' : '❌'}`);
      console.log(`  - Has shipping city placeholder: ${content.includes('{{shippingAddress.city}}') ? '✅' : '❌'}`);
      console.log(`  - Has products conditional: ${content.includes('{{#if hasProducts}}') ? '✅' : '❌'}`);
      console.log(`  - Has shipping conditional: ${content.includes('{{#if hasProducts}}') && content.includes('shipping-info') ? '✅' : '❌'}`);
    }

    console.log('\n🎯 Expected Results:');
    console.log('✅ When products are included: Shipping address section appears');
    console.log('✅ When no products: Shipping address section is hidden');
    console.log('✅ Shipping address shows: street, city, state, zip, country');
    console.log('✅ Delivery time estimate is included');

  } catch (error) {
    console.error('❌ Error testing shipping fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testShippingFix();
