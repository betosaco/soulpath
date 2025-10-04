import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');
    
    // Check if communication templates table exists
    const templates = await prisma.communicationTemplate.findMany({
      take: 1
    });
    
    console.log('✅ CommunicationTemplate table exists');
    console.log('📊 Found', templates.length, 'templates');
    
    // Check if translations table exists
    const translations = await prisma.communicationTemplateTranslation.findMany({
      take: 1
    });
    
    console.log('✅ CommunicationTemplateTranslation table exists');
    console.log('📊 Found', translations.length, 'translations');
    
    console.log('🎉 All communication tables are working!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('💡 Solution: Run database migration');
      console.log('   npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
