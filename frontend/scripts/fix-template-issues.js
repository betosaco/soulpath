import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTemplateIssues() {
  try {
    console.log('🔧 Fixing template issues...\n');

    // Get the Spanish template
    const spanishTemplate = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'renewal_matpass',
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

    if (spanishTemplate && spanishTemplate.translations[0]) {
      let content = spanishTemplate.translations[0].content;
      
      console.log('📝 Original Spanish template issues:');
      console.log('  - Contains Tarifa de Reserva:', content.includes('Tarifa de Reserva'));
      console.log('  - Contains double currency symbols:', content.includes('${{'));
      
      // Remove Tarifa de Reserva line
      content = content.replace(/<p><strong>Tarifa de Reserva:<\/strong> \${{bookingPrice}}<\/p>/g, '');
      
      // Fix double currency symbol issue - replace ${{ with just {{
      content = content.replace(/\${{/g, '{{');
      
      // Update the template
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: spanishTemplate.translations[0].id
        },
        data: {
          content: content
        }
      });
      
      console.log('✅ Fixed Spanish template:');
      console.log('  - Removed Tarifa de Reserva line');
      console.log('  - Fixed double currency symbols');
    }

    // Also update English template
    const englishTemplate = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'renewal_matpass',
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

    if (englishTemplate && englishTemplate.translations[0]) {
      let content = englishTemplate.translations[0].content;
      
      console.log('\n📝 Original English template issues:');
      console.log('  - Contains Booking Fee:', content.includes('Booking Fee'));
      console.log('  - Contains double currency symbols:', content.includes('${{'));
      
      // Remove Booking Fee line
      content = content.replace(/<p><strong>Booking Fee:<\/strong> \${{bookingPrice}}<\/p>/g, '');
      
      // Fix double currency symbol issue
      content = content.replace(/\${{/g, '{{');
      
      // Update the template
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: englishTemplate.translations[0].id
        },
        data: {
          content: content
        }
      });
      
      console.log('✅ Fixed English template:');
      console.log('  - Removed Booking Fee line');
      console.log('  - Fixed double currency symbols');
    }

    console.log('\n🎯 Expected Results:');
    console.log('✅ No more "Tarifa de Reserva: $0.00" line');
    console.log('✅ No more double currency symbols like "$S/. 350.00"');
    console.log('✅ Proper currency display like "S/. 350.00"');

  } catch (error) {
    console.error('❌ Error fixing template issues:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixTemplateIssues();
