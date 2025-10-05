import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEmailMappingFix() {
  try {
    console.log('🔍 Testing email mapping fix...\n');

    // Get the most recent booking with Teacher Schedule Slot data
    const latestBooking = await prisma.booking.findFirst({
      where: {
        teacherScheduleSlotId: { not: null }
      },
      include: {
        teacherScheduleSlot: {
          include: {
            teacherSchedule: {
              include: {
                venue: true,
                serviceType: true,
                teacher: true
              }
            }
          }
        },
        user: {
          select: {
            email: true,
            fullName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!latestBooking) {
      console.log('❌ No bookings with Teacher Schedule Slot data found');
      return;
    }

    console.log('📅 Latest booking with Teacher Schedule Slot:');
    console.log(`  ID: ${latestBooking.id}`);
    console.log(`  User: ${latestBooking.user?.email}`);
    console.log(`  Session Type: ${latestBooking.sessionType}`);
    console.log(`  Teacher Schedule Slot ID: ${latestBooking.teacherScheduleSlotId}`);

    if (latestBooking.teacherScheduleSlot) {
      console.log('\n👨‍🏫 Teacher Schedule Slot Data:');
      console.log(`  Start Time: ${latestBooking.teacherScheduleSlot.startTime}`);
      console.log(`  End Time: ${latestBooking.teacherScheduleSlot.endTime}`);
      console.log(`  Venue: ${latestBooking.teacherScheduleSlot.teacherSchedule?.venue?.name}`);
      console.log(`  Service: ${latestBooking.teacherScheduleSlot.teacherSchedule?.serviceType?.name}`);
      console.log(`  Teacher: ${latestBooking.teacherScheduleSlot.teacherSchedule?.teacher?.name}`);
    }

    // Simulate the email mapping logic
    const slotData = latestBooking.teacherScheduleSlot;
    const scheduleData = latestBooking.teacherScheduleSlot?.teacherSchedule;
    
    const emailBookingData = {
      bookingId: latestBooking.id?.toString() || '',
      bookingDate: slotData?.startTime ? slotData.startTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : '',
      bookingTime: slotData?.startTime ? slotData.startTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }) : '',
      sessionType: latestBooking.sessionType || scheduleData?.serviceType?.name || 'Yoga',
      teacherName: scheduleData?.teacher?.name || 'To be assigned',
      venue: scheduleData?.venue?.name || 'MATMAX Yoga Studio',
      duration: scheduleData?.sessionDuration?.duration_minutes || 60
    };

    console.log('\n📧 Email booking data that would be generated:');
    console.log(JSON.stringify(emailBookingData, null, 2));

    // Check if all required fields are populated
    const emptyFields = [];
    if (!emailBookingData.bookingDate) emptyFields.push('bookingDate');
    if (!emailBookingData.bookingTime) emptyFields.push('bookingTime');
    if (!emailBookingData.teacherName || emailBookingData.teacherName === 'To be assigned') emptyFields.push('teacherName');
    if (!emailBookingData.venue || emailBookingData.venue === 'MATMAX Yoga Studio') emptyFields.push('venue');

    if (emptyFields.length === 0) {
      console.log('\n✅ SUCCESS: All email fields are properly populated!');
      console.log('✅ The email mapping fix is working correctly');
    } else {
      console.log(`\n❌ PROBLEM: Empty fields in email data: ${emptyFields.join(', ')}`);
      console.log('❌ The email mapping fix needs more work');
    }

  } catch (error) {
    console.error('❌ Error testing email mapping fix:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEmailMappingFix();
