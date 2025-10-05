import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCleanBookingFlow() {
  try {
    console.log('🔍 Testing clean booking flow...\n');

    // Check if there are any schedule slots available
    const scheduleSlots = await prisma.scheduleSlot.findMany({
      where: { isAvailable: true },
      include: {
        scheduleTemplate: {
          include: {
            sessionDuration: true,
            venue: true
          }
        }
      },
      take: 3
    });

    console.log(`📅 Found ${scheduleSlots.length} available schedule slots`);
    
    if (scheduleSlots.length === 0) {
      console.log('❌ No schedule slots available for testing');
      return;
    }

    const slot = scheduleSlots[0];
    console.log(`\n📅 Testing with slot ${slot.id}:`);
    console.log(`  ⏰ Start time: ${slot.startTime}`);
    console.log(`  🏢 Venue: ${slot.scheduleTemplate?.venue?.name}`);
    console.log(`  ⏱️ Duration: ${slot.scheduleTemplate?.sessionDuration?.duration_minutes} minutes`);

    // Check if there are any user packages available
    const userPackages = await prisma.userPackage.findMany({
      where: { isActive: true },
      include: {
        packagePrice: {
          include: {
            packageDefinition: true
          }
        }
      },
      take: 3
    });

    console.log(`\n📦 Found ${userPackages.length} active user packages`);
    
    if (userPackages.length === 0) {
      console.log('❌ No user packages available for testing');
      return;
    }

    const userPackage = userPackages[0];
    console.log(`\n📦 Testing with package ${userPackage.id}:`);
    console.log(`  📊 Sessions: ${userPackage.packagePrice.packageDefinition.sessionsCount}`);
    console.log(`  🔢 Used: ${userPackage.sessionsUsed}`);
    console.log(`  💰 Price: ${userPackage.packagePrice.price}`);

    // Simulate booking data
    const bookingData = {
      scheduleSlotId: slot.id,
      userPackageId: userPackage.id,
      sessionType: 'Hatha Yoga',
      notes: 'Test booking'
    };

    console.log('\n📧 Simulated booking data:');
    console.log(JSON.stringify(bookingData, null, 2));

    // Test the email data that would be generated
    const isNewPackage = userPackage.createdAt && 
      (new Date().getTime() - new Date(userPackage.createdAt).getTime()) < 5 * 60 * 1000;

    const emailData = {
      bookingDate: slot.startTime ? new Date(slot.startTime).toISOString().split('T')[0] : '',
      bookingTime: slot.startTime ? new Date(slot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
      sessionType: 'Hatha Yoga',
      teacherName: 'Lucia Meza', // Default teacher
      venue: slot.scheduleTemplate?.venue?.name || 'MATMAX Yoga Studio',
      isNewPackage: isNewPackage,
      totalAmount: isNewPackage ? Number(userPackage.packagePrice.price) * (userPackage.quantity || 1) : 0
    };

    console.log('\n📧 Email data that would be generated:');
    console.log(JSON.stringify(emailData, null, 2));

    // Check if all required fields are populated
    const requiredFields = ['bookingDate', 'bookingTime', 'sessionType', 'teacherName', 'venue'];
    const missingFields = requiredFields.filter(field => !emailData[field]);

    if (missingFields.length > 0) {
      console.log('\n❌ Missing fields:', missingFields);
    } else {
      console.log('\n✅ All required fields are populated');
    }

    console.log('\n🎯 Summary:');
    console.log(`  📅 Schedule slot: ${slot.id} (${slot.startTime})`);
    console.log(`  📦 User package: ${userPackage.id} (${userPackage.packagePrice.packageDefinition.sessionsCount} sessions)`);
    console.log(`  🆕 New package: ${isNewPackage ? 'Yes' : 'No'}`);
    console.log(`  📧 Template: ${isNewPackage ? 'renewal_matpass' : 'booking_only'}`);

  } catch (error) {
    console.error('❌ Error testing clean booking flow:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCleanBookingFlow();
