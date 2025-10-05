import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProperScheduleSlots() {
  try {
    console.log('🔍 Creating proper schedule slots for the current booking system...\n');

    // Get required data
    const teachers = await prisma.teacher.findMany();
    const serviceTypes = await prisma.serviceType.findMany();
    const venues = await prisma.venue.findMany();
    const sessionDurations = await prisma.sessionDuration.findMany();

    console.log('📊 Available data:');
    console.log(`  👥 Teachers: ${teachers.length}`);
    console.log(`  🧘 Service Types: ${serviceTypes.length}`);
    console.log(`  🏢 Venues: ${venues.length}`);
    console.log(`  ⏱️ Session Durations: ${sessionDurations.length}`);

    if (teachers.length === 0) {
      console.log('❌ No teachers found. Please create teachers first.');
      return;
    }

    if (serviceTypes.length === 0) {
      console.log('❌ No service types found. Please create service types first.');
      return;
    }

    if (venues.length === 0) {
      console.log('❌ No venues found. Please create venues first.');
      return;
    }

    if (sessionDurations.length === 0) {
      console.log('❌ No session durations found. Please create session durations first.');
      return;
    }

    // Use the first available data
    const teacher = teachers[0];
    const serviceType = serviceTypes[0];
    const venue = venues[0];
    const sessionDuration = sessionDurations[0];

    console.log(`\n🎯 Using:`);
    console.log(`  👤 Teacher: ${teacher.name}`);
    console.log(`  🧘 Service Type: ${serviceType.name}`);
    console.log(`  🏢 Venue: ${venue.name}`);
    console.log(`  ⏱️ Duration: ${sessionDuration.duration_minutes} minutes`);

    // Create schedule template
    const scheduleTemplate = await prisma.scheduleTemplate.create({
      data: {
        dayOfWeek: 'Monday',
        startTime: '13:00',
        endTime: '14:00',
        capacity: 10,
        venueId: venue.id,
        sessionDurationId: sessionDuration.id,
        isAvailable: true,
        autoAvailable: true
      }
    });

    console.log(`✅ Created schedule template: ${scheduleTemplate.id}`);

    // Create schedule slots for the next 7 days starting from today
    const today = new Date();
    const slots = [];

    for (let day = 0; day < 7; day++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + day);
      
      // Create 2-3 slots per day
      const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '14:00', end: '15:00' },
        { start: '18:00', end: '19:00' }
      ];

      for (const timeSlot of timeSlots) {
        const startTime = new Date(`${slotDate.toISOString().split('T')[0]}T${timeSlot.start}:00.000Z`);
        const endTime = new Date(`${slotDate.toISOString().split('T')[0]}T${timeSlot.end}:00.000Z`);

        // Only create slots for future dates
        if (startTime > new Date()) {
          slots.push({
            scheduleTemplateId: scheduleTemplate.id,
            startTime: startTime,
            endTime: endTime,
            capacity: 10,
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
        scheduleTemplateId: scheduleTemplate.id
      },
      include: {
        scheduleTemplate: {
          include: {
            venue: true,
            sessionDuration: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 5
    });

    console.log(`\n📅 Created slots preview:`);
    for (const slot of newSlots) {
      console.log(`  📅 ${slot.startTime.toISOString().split('T')[0]} ${slot.startTime.toTimeString().split(' ')[0]} - ${slot.scheduleTemplate?.venue?.name}`);
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

createProperScheduleSlots();
