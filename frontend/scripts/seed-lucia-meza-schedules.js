import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLuciaMezaSchedules() {
  try {
    console.log('🧘 Starting Lucia Meza schedule seeding...');

    // 1. Create Lucia Meza teacher profile
    console.log('👩‍🏫 Creating Lucia Meza teacher profile...');
    const luciaMeza = await prisma.teacher.upsert({
      where: { email: 'lucia.meza@matmax.store' },
      update: {},
      create: {
        name: 'Lucia Meza',
        email: 'lucia.meza@matmax.store',
        phone: '+1234567893',
        bio: 'Experienced yoga instructor specializing in Hatha and Vinyasa yoga. With over 8 years of teaching experience, Lucia brings a gentle yet powerful approach to her classes, helping students find balance and strength both on and off the mat.',
        shortBio: 'Experienced yoga instructor specializing in Hatha and Vinyasa yoga with 8+ years of teaching experience.',
        experience: 8,
        teachingStyle: 'Gentle yet powerful approach focusing on alignment, breath, and mindful movement.',
        philosophy: 'Yoga is a journey of self-discovery and transformation that extends beyond the physical practice.',
        approach: 'Combines traditional yoga teachings with modern understanding of anatomy and movement.',
        maxStudents: 15,
        minStudents: 1,
        preferredTimes: ['08:15', '09:30', '17:30', '18:45'],
        isActive: true,
        displayOrder: 1,
        featured: true,
        slug: 'lucia-meza',
        metaTitle: 'Lucia Meza - Yoga Instructor | MatMax Yoga Studio',
        metaDescription: 'Meet Lucia Meza, experienced yoga instructor specializing in Hatha and Vinyasa yoga at MatMax Yoga Studio.'
      }
    });
    console.log('✅ Lucia Meza teacher profile created:', luciaMeza.id);

    // 2. Create venue
    console.log('🏢 Creating MatMax Yoga Studio venue...');
    const venue = await prisma.venue.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'MatMax Yoga Studio',
        description: 'A peaceful and modern yoga studio designed for wellness and mindfulness.',
        address: '123 Wellness Street, Yoga District',
        city: 'Lima',
        country: 'Peru',
        capacity: 20,
        maxGroupSize: 15,
        isActive: true,
        displayOrder: 1,
        featured: true
      }
    });
    console.log('✅ MatMax Yoga Studio venue created:', venue.id);

    // 3. Create service types (Hatha Yoga and Vinyasa Yoga)
    console.log('🧘 Creating yoga service types...');
    const serviceTypes = await Promise.all([
      prisma.serviceType.upsert({
        where: { id: 1 },
        update: {},
        create: {
          name: 'Hatha Yoga',
          description: 'A gentle form of yoga that focuses on basic postures and breathing techniques. Perfect for beginners and those looking for a slower-paced practice.',
          shortDescription: 'Gentle yoga focusing on basic postures and breathing techniques.',
          category: 'CLASS',
          duration: 60,
          maxParticipants: 15,
          minParticipants: 1,
          requirements: ['Yoga mat', 'Comfortable clothing', 'Water bottle'],
          benefits: ['Improved flexibility', 'Better posture', 'Stress relief', 'Mind-body connection'],
          difficulty: 'ALL_LEVELS',
          price: 50.00,
          currencyId: 5, // S/.
          isActive: true,
          displayOrder: 1,
          featured: true,
          color: '#4A90E2',
          icon: 'lotus',
          highlights: ['Beginner-friendly', 'Gentle approach', 'Focus on alignment', 'Breathing techniques']
        }
      }),
      prisma.serviceType.upsert({
        where: { id: 2 },
        update: {},
        create: {
          name: 'Vinyasa Yoga',
          description: 'A dynamic form of yoga that links breath with movement through flowing sequences. Great for building strength, flexibility, and cardiovascular fitness.',
          shortDescription: 'Dynamic yoga linking breath with movement through flowing sequences.',
          category: 'CLASS',
          duration: 60,
          maxParticipants: 15,
          minParticipants: 1,
          requirements: ['Yoga mat', 'Comfortable clothing', 'Water bottle'],
          benefits: ['Improved strength', 'Better flexibility', 'Cardiovascular fitness', 'Mental focus'],
          difficulty: 'INTERMEDIATE',
          price: 50.00,
          currencyId: 5, // S/.
          isActive: true,
          displayOrder: 2,
          featured: true,
          color: '#E24A4A',
          icon: 'flow',
          highlights: ['Dynamic flow', 'Strength building', 'Cardiovascular benefits', 'Mental focus']
        }
      })
    ]);
    console.log('✅ Yoga service types created:', serviceTypes.length);

    // 4. Link Lucia Meza to both service types
    console.log('🔗 Linking Lucia Meza to service types...');
    const teacherServiceTypes = await Promise.all([
      prisma.teacherServiceType.upsert({
        where: { teacherId_serviceTypeId: { teacherId: luciaMeza.id, serviceTypeId: 1 } },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          serviceTypeId: 1 // Hatha Yoga
        }
      }),
      prisma.teacherServiceType.upsert({
        where: { teacherId_serviceTypeId: { teacherId: luciaMeza.id, serviceTypeId: 2 } },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          serviceTypeId: 2 // Vinyasa Yoga
        }
      })
    ]);
    console.log('✅ Teacher service types linked:', teacherServiceTypes.length);

    // 5. Create recurring teacher schedules (EST timezone)
    console.log('📅 Creating recurring teacher schedules in EST...');
    const teacherSchedules = await Promise.all([
      // Monday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      prisma.teacherSchedule.upsert({
        where: { id: 1 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Monday',
          startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 2 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Monday',
          startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 3 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Monday',
          startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      // Tuesday - 17:30 Hatha, 18:45 Vinyasa
      prisma.teacherSchedule.upsert({
        where: { id: 4 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Tuesday',
          startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 5 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Tuesday',
          startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
          endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
          isAvailable: true,
          maxBookings: 15
        }
      }),
      // Wednesday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      prisma.teacherSchedule.upsert({
        where: { id: 6 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Wednesday',
          startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 7 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Wednesday',
          startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 8 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Wednesday',
          startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      // Thursday - 17:30 Hatha, 18:45 Vinyasa
      prisma.teacherSchedule.upsert({
        where: { id: 9 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Thursday',
          startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 10 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Thursday',
          startTime: new Date('1970-01-01T23:45:00Z'), // 18:45 EST = 23:45 UTC
          endTime: new Date('1970-01-02T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
          isAvailable: true,
          maxBookings: 15
        }
      }),
      // Friday - 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha
      prisma.teacherSchedule.upsert({
        where: { id: 11 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Friday',
          startTime: new Date('1970-01-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('1970-01-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 12 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Friday',
          startTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('1970-01-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 13 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Friday',
          startTime: new Date('1970-01-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('1970-01-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      // Saturday - 08:30 Hatha, 09:45 Vinyasa
      prisma.teacherSchedule.upsert({
        where: { id: 14 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 1, // Hatha Yoga
          dayOfWeek: 'Saturday',
          startTime: new Date('1970-01-01T13:30:00Z'), // 08:30 EST = 13:30 UTC
          endTime: new Date('1970-01-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
          isAvailable: true,
          maxBookings: 15
        }
      }),
      prisma.teacherSchedule.upsert({
        where: { id: 15 },
        update: {},
        create: {
          teacherId: luciaMeza.id,
          venueId: venue.id,
          serviceTypeId: 2, // Vinyasa Yoga
          dayOfWeek: 'Saturday',
          startTime: new Date('1970-01-01T14:45:00Z'), // 09:45 EST = 14:45 UTC
          endTime: new Date('1970-01-01T15:45:00Z'), // 10:45 EST = 15:45 UTC
          isAvailable: true,
          maxBookings: 15
        }
      })
    ]);
    console.log('✅ Recurring teacher schedules created:', teacherSchedules.length);

    // 6. Create specific schedule slots for current week (September 29 - October 4, 2025) in EST
    console.log('📅 Creating specific schedule slots for current week (September 29 - October 4, 2025) in EST...');
    const scheduleSlots = await Promise.all([
      // Monday, September 29, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 1 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[0].id, // Monday 08:15 Hatha
          startTime: new Date('2025-09-29T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('2025-09-29T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 2 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[1].id, // Monday 09:30 Vinyasa
          startTime: new Date('2025-09-29T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('2025-09-29T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 3 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[2].id, // Monday 17:30 Hatha
          startTime: new Date('2025-09-29T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('2025-09-29T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      // Tuesday, September 30, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 4 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[3].id, // Tuesday 17:30 Hatha
          startTime: new Date('2025-09-30T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('2025-09-30T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 5 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[4].id, // Tuesday 18:45 Vinyasa
          startTime: new Date('2025-09-30T23:45:00Z'), // 18:45 EST = 23:45 UTC
          endTime: new Date('2025-10-01T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      // Wednesday, October 1, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 6 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[5].id, // Wednesday 08:15 Hatha
          startTime: new Date('2025-10-01T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('2025-10-01T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 7 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[6].id, // Wednesday 09:30 Vinyasa
          startTime: new Date('2025-10-01T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('2025-10-01T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 8 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[7].id, // Wednesday 17:30 Hatha
          startTime: new Date('2025-10-01T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('2025-10-01T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      // Thursday, October 2, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 9 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[8].id, // Thursday 17:30 Hatha
          startTime: new Date('2025-10-02T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('2025-10-02T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 10 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[9].id, // Thursday 18:45 Vinyasa
          startTime: new Date('2025-10-02T23:45:00Z'), // 18:45 EST = 23:45 UTC
          endTime: new Date('2025-10-03T00:45:00Z'), // 19:45 EST = 00:45 UTC (next day)
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      // Friday, October 3, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 11 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[10].id, // Friday 08:15 Hatha
          startTime: new Date('2025-10-03T13:15:00Z'), // 08:15 EST = 13:15 UTC
          endTime: new Date('2025-10-03T14:15:00Z'), // 09:15 EST = 14:15 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 12 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[11].id, // Friday 09:30 Vinyasa
          startTime: new Date('2025-10-03T14:30:00Z'), // 09:30 EST = 14:30 UTC
          endTime: new Date('2025-10-03T15:30:00Z'), // 10:30 EST = 15:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 13 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[12].id, // Friday 17:30 Hatha
          startTime: new Date('2025-10-03T22:30:00Z'), // 17:30 EST = 22:30 UTC
          endTime: new Date('2025-10-03T23:30:00Z'), // 18:30 EST = 23:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      // Saturday, October 4, 2025
      prisma.teacherScheduleSlot.upsert({
        where: { id: 14 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[13].id, // Saturday 08:30 Hatha
          startTime: new Date('2025-10-04T13:30:00Z'), // 08:30 EST = 13:30 UTC
          endTime: new Date('2025-10-04T14:30:00Z'), // 09:30 EST = 14:30 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      }),
      prisma.teacherScheduleSlot.upsert({
        where: { id: 15 },
        update: {},
        create: {
          teacherScheduleId: teacherSchedules[14].id, // Saturday 09:45 Vinyasa
          startTime: new Date('2025-10-04T14:45:00Z'), // 09:45 EST = 14:45 UTC
          endTime: new Date('2025-10-04T15:45:00Z'), // 10:45 EST = 15:45 UTC
          isAvailable: true,
          bookedCount: 0,
          maxBookings: 15
        }
      })
    ]);
    console.log('✅ Schedule slots for current week (September 29 - October 4, 2025) created:', scheduleSlots.length);

    console.log('');
    console.log('🎉 Lucia Meza schedule seeding completed successfully!');
    console.log('');
    console.log('📊 Created:');
    console.log(`   👩‍🏫 Lucia Meza teacher: ${luciaMeza.id}`);
    console.log(`   🏢 MatMax Yoga Studio venue: ${venue.id}`);
    console.log(`   🧘 Yoga service types: ${serviceTypes.length}`);
    console.log(`   🔗 Teacher service types: ${teacherServiceTypes.length}`);
    console.log(`   📅 Recurring teacher schedules: ${teacherSchedules.length}`);
    console.log(`   📅 Current week schedule slots: ${scheduleSlots.length}`);
    console.log('');
    console.log('🚀 Lucia Meza\'s complete schedule is now available!');
    console.log('');
    console.log('📅 Weekly Schedule:');
    console.log('   Monday, Wednesday, Friday: 08:15 Hatha, 09:30 Vinyasa, 17:30 Hatha');
    console.log('   Tuesday, Thursday: 17:30 Hatha, 18:45 Vinyasa');
    console.log('   Saturday: 08:30 Hatha, 09:45 Vinyasa');
    console.log('   Sunday: No classes');

  } catch (error) {
    console.error('❌ Error during Lucia Meza schedule seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedLuciaMezaSchedules();
