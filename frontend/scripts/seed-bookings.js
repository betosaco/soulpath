import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function seedBookings() {
  try {
    console.log('🌱 Starting booking seed...');

    // First, let's check what data we have available
    console.log('📋 Checking existing data...');
    
    const users = await prisma.user.findMany({ take: 3 });
    const userPackages = await prisma.userPackage.findMany({ take: 3 });
    const teacherScheduleSlots = await prisma.teacherScheduleSlot.findMany({ take: 10 });
    const serviceTypes = await prisma.serviceType.findMany({ take: 2 });
    const teachers = await prisma.teacher.findMany({ take: 1 });
    const venues = await prisma.venue.findMany({ take: 1 });

    console.log(`📊 Found: ${users.length} users, ${userPackages.length} user packages, ${teacherScheduleSlots.length} schedule slots, ${serviceTypes.length} service types, ${teachers.length} teachers, ${venues.length} venues`);

    if (users.length === 0 || userPackages.length === 0 || teacherScheduleSlots.length === 0) {
      console.log('❌ Missing required data. Please run the main seed first.');
      return;
    }

    // Create realistic bookings
    console.log('📅 Creating realistic bookings...');
    
    const bookings = await Promise.all([
      // Booking 1: John Doe - Hatha Yoga - Monday morning
      prisma.booking.upsert({
        where: { id: 1 },
        update: {},
        create: {
          userId: users[0].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[0]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Hatha Yoga',
          status: 'confirmed',
          notes: 'First time trying yoga - please be gentle with adjustments',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        }
      }),

      // Booking 2: Maria Garcia - Vinyasa Yoga - Tuesday evening
      prisma.booking.upsert({
        where: { id: 2 },
        update: {},
        create: {
          userId: users[1].id,
          userPackageId: userPackages[1].id,
          teacherScheduleSlotId: teacherScheduleSlots[1]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Vinyasa Yoga',
          status: 'confirmed',
          notes: 'Sesión en español - preferencias de música suave',
          reminderSent: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        }
      }),

      // Booking 3: Test Client - Hatha Yoga - Wednesday morning
      prisma.booking.upsert({
        where: { id: 3 },
        update: {},
        create: {
          userId: users[2].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[2]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Hatha Yoga',
          status: 'confirmed',
          notes: 'Regular client - no special requirements',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        }
      }),

      // Booking 4: John Doe - Vinyasa Yoga - Thursday evening (completed)
      prisma.booking.upsert({
        where: { id: 4 },
        update: {},
        create: {
          userId: users[0].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[3]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Vinyasa Yoga',
          status: 'completed',
          notes: 'Great session! Felt more flexible after class.',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        }
      }),

      // Booking 5: Maria Garcia - Hatha Yoga - Friday morning (cancelled)
      prisma.booking.upsert({
        where: { id: 5 },
        update: {},
        create: {
          userId: users[1].id,
          userPackageId: userPackages[1].id,
          teacherScheduleSlotId: teacherScheduleSlots[4]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Hatha Yoga',
          status: 'cancelled',
          notes: 'Had to cancel due to work emergency',
          cancelledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          cancelledReason: 'Work emergency - client had to attend important meeting',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        }
      }),

      // Booking 6: Test Client - Vinyasa Yoga - Saturday morning (upcoming)
      prisma.booking.upsert({
        where: { id: 6 },
        update: {},
        create: {
          userId: users[2].id,
          userPackageId: userPackages[1].id,
          teacherScheduleSlotId: teacherScheduleSlots[5]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Vinyasa Yoga',
          status: 'confirmed',
          notes: 'Looking forward to the weekend flow class',
          reminderSent: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        }
      }),

      // Booking 7: John Doe - Hatha Yoga - Monday morning (upcoming)
      prisma.booking.upsert({
        where: { id: 7 },
        update: {},
        create: {
          userId: users[0].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[6]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Hatha Yoga',
          status: 'confirmed',
          notes: 'Second session - feeling more confident',
          reminderSent: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        }
      }),

      // Booking 8: Maria Garcia - Vinyasa Yoga - Tuesday evening (upcoming)
      prisma.booking.upsert({
        where: { id: 8 },
        update: {},
        create: {
          userId: users[1].id,
          userPackageId: userPackages[1].id,
          teacherScheduleSlotId: teacherScheduleSlots[7]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Vinyasa Yoga',
          status: 'confirmed',
          notes: 'Ready for a challenging flow sequence',
          reminderSent: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        }
      }),

      // Booking 9: Test Client - Hatha Yoga - Wednesday morning (pending)
      prisma.booking.upsert({
        where: { id: 9 },
        update: {},
        create: {
          userId: users[2].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[8]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Hatha Yoga',
          status: 'pending',
          notes: 'Waiting for confirmation',
          reminderSent: false,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        }
      }),

      // Booking 10: John Doe - Vinyasa Yoga - Thursday evening (no-show)
      prisma.booking.upsert({
        where: { id: 10 },
        update: {},
        create: {
          userId: users[0].id,
          userPackageId: userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[9]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Vinyasa Yoga',
          status: 'no_show',
          notes: 'Client did not show up - no prior notice',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        }
      })
    ]);

    console.log('✅ Bookings created:', bookings.length);

    // Update the booked count for the schedule slots
    console.log('📊 Updating schedule slot booked counts...');
    
    for (const booking of bookings) {
      if (booking.teacherScheduleSlotId) {
        await prisma.teacherScheduleSlot.update({
          where: { id: booking.teacherScheduleSlotId },
          data: {
            bookedCount: {
              increment: 1
            }
          }
        });
      }
    }

    console.log('✅ Schedule slot booked counts updated');

    // Create some additional bookings for different scenarios
    console.log('📅 Creating additional scenario bookings...');
    
    const additionalBookings = await Promise.all([
      // Group booking scenario
      prisma.booking.upsert({
        where: { id: 11 },
        update: {},
        create: {
          userId: users[0].id,
          userPackageId: userPackages[2]?.id || userPackages[0].id,
          teacherScheduleSlotId: teacherScheduleSlots[0]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[0]?.id,
          sessionType: 'Group Hatha Yoga',
          status: 'confirmed',
          notes: 'Group session with friends - 3 people total',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        }
      }),

      // Workshop booking scenario
      prisma.booking.upsert({
        where: { id: 12 },
        update: {},
        create: {
          userId: users[1].id,
          userPackageId: userPackages[1].id,
          teacherScheduleSlotId: teacherScheduleSlots[1]?.id,
          venueId: venues[0]?.id,
          teacherId: teachers[0]?.id,
          serviceTypeId: serviceTypes[1]?.id,
          sessionType: 'Yoga Workshop',
          status: 'confirmed',
          notes: 'Special workshop on breathing techniques',
          reminderSent: true,
          reminderSentAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        }
      })
    ]);

    console.log('✅ Additional scenario bookings created:', additionalBookings.length);

    // Display summary
    console.log('');
    console.log('🎉 Booking seed completed successfully!');
    console.log('');
    console.log('📊 Created bookings:');
    console.log(`   📅 Total bookings: ${bookings.length + additionalBookings.length}`);
    console.log(`   ✅ Confirmed: ${bookings.filter(b => b.status === 'confirmed').length + additionalBookings.filter(b => b.status === 'confirmed').length}`);
    console.log(`   ✅ Completed: ${bookings.filter(b => b.status === 'completed').length}`);
    console.log(`   ❌ Cancelled: ${bookings.filter(b => b.status === 'cancelled').length}`);
    console.log(`   ⏳ Pending: ${bookings.filter(b => b.status === 'pending').length}`);
    console.log(`   🚫 No-show: ${bookings.filter(b => b.status === 'no_show').length}`);
    console.log('');
    console.log('📋 Booking scenarios included:');
    console.log('   • First-time yoga students');
    console.log('   • Regular clients with preferences');
    console.log('   • Completed sessions with feedback');
    console.log('   • Cancelled bookings with reasons');
    console.log('   • Upcoming confirmed sessions');
    console.log('   • Pending bookings awaiting confirmation');
    console.log('   • No-show scenarios');
    console.log('   • Group session bookings');
    console.log('   • Special workshop bookings');
    console.log('   • Multi-language support (Spanish notes)');
    console.log('');
    console.log('🔔 Reminder system:');
    console.log('   • Some bookings have reminders sent');
    console.log('   • Various reminder timing scenarios');
    console.log('   • Ready for testing reminder functionality');
    console.log('');
    console.log('🚀 Your booking system is now fully seeded and ready for testing!');

  } catch (error) {
    console.error('❌ Error during booking seed:', error);
    throw error;
  }
}

seedBookings()
  .catch((e) => {
    console.error('❌ Booking seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
