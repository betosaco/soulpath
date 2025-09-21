#!/usr/bin/env node

/**
 * Simple script to check if the email template exists in the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEmailTemplate() {
  console.log('🔍 Checking Email Template in Database\n');

  try {
    // Check if the template exists
    const template = await prisma.communicationTemplate.findFirst({
      where: {
        templateKey: 'package_purchase_confirmation',
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

    if (template) {
      console.log('✅ Template found!');
      console.log('Template ID:', template.id);
      console.log('Template Name:', template.name);
      console.log('Template Key:', template.templateKey);
      console.log('Type:', template.type);
      console.log('Category:', template.category);
      console.log('Is Active:', template.isActive);
      console.log('Is Default:', template.isDefault);
      
      if (template.translations.length > 0) {
        const translation = template.translations[0];
        console.log('\n📧 Spanish Translation:');
        console.log('Subject:', translation.subject);
        console.log('Content Length:', translation.content.length, 'characters');
        console.log('\nContent Preview (first 300 chars):');
        console.log(translation.content.substring(0, 300) + '...');
        
        // Check for key placeholders
        const placeholders = [
          '{{customer_name}}',
          '{{package_name}}',
          '{{package_price}}',
          '{{sessions_count}}',
          '{{purchase_date}}'
        ];
        
        console.log('\n🔍 Placeholder Check:');
        placeholders.forEach(placeholder => {
          const found = translation.content.includes(placeholder);
          console.log(`${found ? '✅' : '❌'} ${placeholder}`);
        });
        
      } else {
        console.log('❌ No Spanish translation found');
      }
      
    } else {
      console.log('❌ Template not found!');
      console.log('This means the template needs to be created in the database.');
    }

    // Also check all available templates
    console.log('\n📋 All Available Templates:');
    const allTemplates = await prisma.communicationTemplate.findMany({
      select: {
        id: true,
        templateKey: true,
        name: true,
        type: true,
        isActive: true,
        translations: {
          select: {
            language: true
          }
        }
      }
    });
    
    allTemplates.forEach(t => {
      const languages = t.translations.map(tr => tr.language).join(', ');
      console.log(`- ${t.templateKey} (${t.name}) - ${t.type} - Active: ${t.isActive} - Languages: ${languages}`);
    });

  } catch (error) {
    console.error('❌ Error checking template:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkEmailTemplate();
