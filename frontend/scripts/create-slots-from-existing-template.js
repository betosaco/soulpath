import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSlotsFromExistingTemplate() {
  try {
    console.log('🔍 Creating schedule slots from existing template...\n');

    // Get the existing schedule template
    const existingTemplate = await prisma.scheduleTemplate.findFirst({
      include: {
        venue: true,
        sessionDuration: true
      }
    });

    if (!existingTemplate) {
      console.log('❌ No existing schedule template found');
      return;
    }

    console.log('📅 Using existing template:');
    console.log(`  Day of Week: ${existingTemplate.dayOfWeek}`);
    console.log(`  Start Time: ${existingTemplate.startTime}`);
    console.log(`  End Time: ${existingTemplate.endTime}`);
    console.log(`  Capacity: ${existingTemplate.capacity}`);
    console.log(`  Venue: ${existingTemplate.venue?.name || 'No venue'}`);
    console.log(`  Session Duration: ${existingTemplate.sessionDuration?.duration_minutes} minutes`);

    // Check if there are already slots for this template
    const existingSlots = await prisma.scheduleSlot.findMany({
      where: {
        scheduleTemplateId: existingTemplate.id
      },
      orderBy: {
        startTime: 'desc'
      },
      take: 5
    });

    console.log(`\n📅 Existing slots for this template: ${existingSlots.length}`);
    
    if (existingSlots.length > 0) {
      console.log('📅 Recent slots:');
      for (const slot of existingSlots) {
        console.log(`  📅 ${slot.startTime.toISOString().split('T')[0]} ${slot.startTime.toTimeString().split(' ')[0]} - Available: ${slot.isAvailable}`);
      }
    }

    // Create new slots for the next 7 days using the existing template
    const today = new Date();
    const slots = [];

    // Get the time slots from the existing template
    const startTime = existingTemplate.startTime; // e.g., "09:00"
    const endTime = existingTemplate.endTime; // e.g., "17:00"
    const sessionDuration = existingTemplate.sessionDuration?.duration_minutes || 60;

    console.log(`\n📅 Creating slots for next 7 days using:`);
    console.log(`  Time range: ${startTime} - ${endTime}`);
    console.log(`  Session duration: ${sessionDuration} minutes`);

    for (let day = 0; day < 7; day++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + day);
      
      // Create slots every hour within the time range
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        const startTimeStr = `${hour.toString().padStart(2, '0')}:00`;
        const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        const startTime = new Date(`${slotDate.toISOString().split('T')[0]}T${startTimeStr}:00.000Z`);
        const endTime = new Date(`${slotDate.toISOString().split('T')[0]}T${endTimeStr}:00.000Z`);

        // Only create slots for future dates
        if (startTime > new Date()) {
          slots.push({
            scheduleTemplateId: existingTemplate.id,
            startTime: startTime,
            endTime: endTime,
            capacity: existingTemplate.capacity,
            bookedCount: 0,
            isAvailable: true
          });
        }
      }
    }

    console.log(`\n📅 Creating ${slots.length} schedule slots...`);

    // Create schedule slots in batches
    const batchSize = 10;
    let createdCount = 0;

    for (let i = 0; i < slots.length; i += batchSize) {
      const batch = slots.slice(i, i + batchSize);
      const result = await prisma.scheduleSlot.createMany({
        data: batch
      });
      createdCount += result.count;
      console.log(`  ✅ Created batch ${Math.floor(i / batchSize) + 1}: ${result.count} slots`);
    }

    console.log(`\n🎉 Successfully created ${createdCount} schedule slots!`);
    
    // Verify the created slots
    const newSlots = await prisma.scheduleSlot.findMany({
      where: {
        scheduleTemplateId: existingTemplate.id,
        startTime: { gt: new Date() }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5
    });

    console.log(`\n📅 Available slots preview:`);
    for (const slot of newSlots) {
      console.log(`  📅 ${slot.startTime.toISOString().split('T')[0]} ${slot.startTime.toTimeString().split(' ')[0]} - Capacity: ${slot.capacity} - Available: ${slot.isAvailable}`);
    }

    console.log('\n🎯 Now you can use the current booking system:');
    console.log('1. Go to /packages/enhanced');
    console.log('2. Select a package');
    console.log('3. Go to /booking/schedule');
    console.log('4. Select a schedule slot');
    console.log('5. Complete the booking flow');

  } catch (error) {
    console.error('❌ Error creating schedule slots:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSlotsFromExistingTemplate();
