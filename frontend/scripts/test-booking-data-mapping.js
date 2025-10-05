import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testBookingDataMapping() {
  try {
    console.log('🔍 Testing booking data mapping...\n');

    // Find a recent booking with complete data
    const booking = await prisma.booking.findFirst({
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

    if (!booking) {
      console.log('❌ No bookings found');
      return;
    }

    console.log('📅 Found booking:', booking.id);
    console.log('👤 Teacher:', booking.teacher?.name);
    console.log('🏢 Venue:', booking.venue?.name);
    console.log('⏰ Start time:', booking.scheduleSlot?.startTime);
    console.log('📝 Session type:', booking.sessionType);

    // Test the booking data mapping
    const bookingData = {
      bookingId: booking.id.toString(),
      bookingDate: booking.scheduleSlot?.startTime ? new Date(booking.scheduleSlot.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      bookingTime: booking.scheduleSlot?.startTime ? new Date(booking.scheduleSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '10:00 AM',
      sessionType: booking.sessionType || 'Hatha Yoga',
      teacherName: booking.teacher?.name || 'Instructor TBD',
      venue: booking.venue?.name || 'MATMAX Yoga Studio',
      duration: booking.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 60
    };

    console.log('\n📧 Booking data would be:');
    console.log(JSON.stringify(bookingData, null, 2));

    // Check if all fields are populated
    const hasEmptyFields = Object.values(bookingData).some(value => !value || value === 'undefined' || value === 'Instructor TBD');
    
    if (hasEmptyFields) {
      console.log('\n❌ Some fields are empty or undefined');
    } else {
      console.log('\n✅ All booking fields are properly populated');
    }

  } catch (error) {
    console.error('❌ Error testing booking data mapping:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingDataMapping();
