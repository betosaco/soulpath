import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateEmailTitles() {
  try {
    console.log('🔧 Updating email titles to be more specific...\n');

    // Update Spanish renewal_matpass template
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
      let subject = spanishTemplate.translations[0].subject;
      
      console.log('📝 Current Spanish title:', subject);
      
      // Update the title to be more dynamic
      const newSubject = '{{#if hasProducts}}Tu MatPass y Productos han sido Renovados{{else}}Tu MatPass ha sido Renovado{{/if}} - {{userName}}';
      
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: spanishTemplate.translations[0].id
        },
        data: {
          subject: newSubject
        }
      });
      
      console.log('✅ Updated Spanish title to be dynamic');
      console.log('  - MatPass only: "Tu MatPass ha sido Renovado"');
      console.log('  - MatPass + Products: "Tu MatPass y Productos han sido Renovados"');
    }

    // Update English renewal_matpass template
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
      let subject = englishTemplate.translations[0].subject;
      
      console.log('\n📝 Current English title:', subject);
      
      // Update the title to be more dynamic
      const newSubject = '{{#if hasProducts}}Your MatPass and Products have been Renewed{{else}}Your MatPass has been Renewed{{/if}} - {{userName}}';
      
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: englishTemplate.translations[0].id
        },
        data: {
          subject: newSubject
        }
      });
      
      console.log('✅ Updated English title to be dynamic');
      console.log('  - MatPass only: "Your MatPass has been Renewed"');
      console.log('  - MatPass + Products: "Your MatPass and Products have been Renewed"');
    }

    // Also update welcome_matpass template for new customers
    const welcomeSpanishTemplate = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'welcome_matpass',
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

    if (welcomeSpanishTemplate && welcomeSpanishTemplate.translations[0]) {
      const newSubject = '{{#if hasProducts}}¡Bienvenido! Tu MatPass y Productos están listos{{else}}¡Bienvenido! Tu MatPass está listo{{/if}} - {{userName}}';
      
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: welcomeSpanishTemplate.translations[0].id
        },
        data: {
          subject: newSubject
        }
      });
      
      console.log('\n✅ Updated Spanish welcome title to be dynamic');
    }

    const welcomeEnglishTemplate = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'welcome_matpass',
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

    if (welcomeEnglishTemplate && welcomeEnglishTemplate.translations[0]) {
      const newSubject = '{{#if hasProducts}}Welcome! Your MatPass and Products are Ready{{else}}Welcome! Your MatPass is Ready{{/if}} - {{userName}}';
      
      await prisma.communicationTemplateTranslation.update({
        where: {
          id: welcomeEnglishTemplate.translations[0].id
        },
        data: {
          subject: newSubject
        }
      });
      
      console.log('✅ Updated English welcome title to be dynamic');
    }

    console.log('\n🎯 Expected Results:');
    console.log('✅ MatPass only orders: "Tu MatPass ha sido Renovado"');
    console.log('✅ MatPass + Products orders: "Tu MatPass y Productos han sido Renovados"');
    console.log('✅ New customer MatPass only: "¡Bienvenido! Tu MatPass está listo"');
    console.log('✅ New customer MatPass + Products: "¡Bienvenido! Tu MatPass y Productos están listos"');

  } catch (error) {
    console.error('❌ Error updating email titles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEmailTitles();
