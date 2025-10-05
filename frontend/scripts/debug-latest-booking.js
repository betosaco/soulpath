import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugLatestBooking() {
  try {
    console.log('🔍 Debugging latest booking data...\n');

    // Find the most recent booking
    const latestBooking = await prisma.booking.findFirst({
      where: {
        status: 'confirmed'
      },
      include: {
        scheduleSlot: {
          include: {
            scheduleTemplate: {
              include: {
                sessionDuration: true,
                venue: true
              }
            }
          }
        },
        teacher: true,
        venue: true,
        userPackage: {
          include: {
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!latestBooking) {
      console.log('❌ No bookings found');
      return;
    }

    console.log('📅 Latest booking:', latestBooking.id);
    console.log('📅 Created:', latestBooking.createdAt);
    console.log('📝 Session type:', latestBooking.sessionType);
    console.log('👤 Teacher ID:', latestBooking.teacherId);
    console.log('👤 Teacher name:', latestBooking.teacher?.name);
    console.log('📅 Schedule slot ID:', latestBooking.scheduleSlotId);
    console.log('📅 Schedule slot exists:', !!latestBooking.scheduleSlot);
    
    if (latestBooking.scheduleSlot) {
      console.log('  ⏰ Start time:', latestBooking.scheduleSlot.startTime);
      console.log('  🏢 Venue:', latestBooking.scheduleSlot.scheduleTemplate?.venue?.name);
      console.log('  📝 Template ID:', latestBooking.scheduleSlot.scheduleTemplate?.id);
    } else {
      console.log('  ❌ No schedule slot data');
    }

    console.log('🏢 Venue ID:', latestBooking.venueId);
    console.log('🏢 Venue name:', latestBooking.venue?.name);

    // Simulate the email data that would be sent
    const emailData = {
      bookingDate: latestBooking.scheduleSlot?.startTime ? new Date(latestBooking.scheduleSlot.startTime).toISOString().split('T')[0] : '',
      bookingTime: latestBooking.scheduleSlot?.startTime ? new Date(latestBooking.scheduleSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
      sessionType: latestBooking.sessionType || '',
      teacherName: latestBooking.teacher?.name || '',
      venue: latestBooking.venue?.name || latestBooking.scheduleSlot?.scheduleTemplate?.venue?.name || ''
    };

    console.log('\n📧 Email data that would be sent:');
    console.log('  📅 bookingDate:', emailData.bookingDate);
    console.log('  ⏰ bookingTime:', emailData.bookingTime);
    console.log('  📝 sessionType:', emailData.sessionType);
    console.log('  👤 teacherName:', emailData.teacherName);
    console.log('  🏢 venue:', emailData.venue);

    // Check for empty fields
    const emptyFields = [];
    if (!emailData.bookingDate) emptyFields.push('bookingDate');
    if (!emailData.bookingTime) emptyFields.push('bookingTime');
    if (!emailData.sessionType) emptyFields.push('sessionType');
    if (!emailData.teacherName) emptyFields.push('teacherName');
    if (!emailData.venue) emptyFields.push('venue');

    if (emptyFields.length > 0) {
      console.log('\n❌ Empty fields:', emptyFields);
    } else {
      console.log('\n✅ All fields populated');
    }

  } catch (error) {
    console.error('❌ Error debugging latest booking:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLatestBooking();
