import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testCommunicationAPI() {
  try {
    console.log('🧪 Testing Communication API...');
    
    // Test the exact query from the API
    const templates = await prisma.communicationTemplate.findMany({
      where: { type: 'email' },
      include: {
        translations: {
          orderBy: { language: 'asc' }
        }
      },
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    });
    
    console.log('✅ Query successful');
    console.log('📊 Found templates:', templates.length);
    
    templates.forEach(template => {
      console.log(`  📧 ${template.name} (${template.templateKey})`);
      console.log(`     Type: ${template.type}, Category: ${template.category}`);
      console.log(`     Translations: ${template.translations.length}`);
    });
    
    // Test count query
    const totalCount = await prisma.communicationTemplate.count({ 
      where: { type: 'email' } 
    });
    
    console.log('📊 Total count:', totalCount);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testCommunicationAPI();
