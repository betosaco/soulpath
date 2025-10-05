import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEmailServiceStatus() {
  try {
    console.log('🔍 Checking email service configuration and status...');

    // Check environment variables (simulated)
    console.log('\n📧 Email Service Configuration:');
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Configured' : '❌ Missing');
    console.log('NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL || 'Not set');

    // Check if templates are active and have content
    const templates = await prisma.communicationTemplate.findMany({
      where: { isActive: true },
      include: {
        translations: {
          where: { language: 'es' },
          select: { id: true }
        }
      }
    });

    console.log('\n📋 Active Email Templates:');
    templates.forEach(template => {
      console.log(`  ${template.templateKey}: ${template.translations.length > 0 ? '✅' : '❌'} Spanish translation`);
    });

    // Check recent orders and their email status
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('\n📦 Recent Orders:');
    for (const order of recentOrders) {
      const orderTime = order.createdAt;
      const timeAgo = Math.floor((Date.now() - orderTime.getTime()) / 1000 / 60); // minutes ago

      console.log(`  ${order.orderNumber}: ${order.customerEmail} (${timeAgo} min ago)`);
      console.log(`    Status: ${order.status}, Payment: ${order.paymentStatus}, Items: ${order.items?.length || 0}`);
    }

    // Check Telegram configuration
    const telegramUsers = await prisma.telegramUser.findMany({
      where: { isActive: true }
    });

    console.log('\n📱 Telegram Configuration:');
    console.log(`Active Telegram users: ${telegramUsers.length}`);
    telegramUsers.forEach(user => {
      console.log(`  User: ${user.telegramId}, Active: ${user.isActive}`);
    });

    // Test email service initialization
    console.log('\n🔧 Testing Email Service:');
    try {
      const { createEmailService } = await import('@/lib/brevo-email-service');
      const emailService = await createEmailService();

      if (emailService) {
        console.log('✅ Email service initialized successfully');
      } else {
        console.log('❌ Email service failed to initialize');
      }
    } catch (error) {
      console.log('❌ Email service error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error checking email service status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmailServiceStatus();

