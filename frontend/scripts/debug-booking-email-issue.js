import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugBookingEmailIssue() {
  try {
    console.log('🔍 Debugging booking email issue...\n');

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

    console.log('📅 Latest booking details:');
    console.log(`  ID: ${latestBooking.id}`);
    console.log(`  Created: ${latestBooking.createdAt}`);
    console.log(`  Session Type: ${latestBooking.sessionType}`);
    console.log(`  Teacher ID: ${latestBooking.teacherId}`);
    console.log(`  Schedule Slot ID: ${latestBooking.scheduleSlotId}`);
    console.log(`  Venue ID: ${latestBooking.venueId}`);

    console.log('\n📅 Schedule Slot Data:');
    console.log(`  Exists: ${!!latestBooking.scheduleSlot}`);
    if (latestBooking.scheduleSlot) {
      console.log(`  Start Time: ${latestBooking.scheduleSlot.startTime}`);
      console.log(`  End Time: ${latestBooking.scheduleSlot.endTime}`);
      console.log(`  Template ID: ${latestBooking.scheduleSlot.scheduleTemplateId}`);
    } else {
      console.log('  ❌ No schedule slot data');
    }

    console.log('\n👤 Teacher Data:');
    console.log(`  Exists: ${!!latestBooking.teacher}`);
    if (latestBooking.teacher) {
      console.log(`  Name: ${latestBooking.teacher.name}`);
      console.log(`  Email: ${latestBooking.teacher.email}`);
    } else {
      console.log('  ❌ No teacher data');
    }

    console.log('\n🏢 Venue Data:');
    console.log(`  Exists: ${!!latestBooking.venue}`);
    if (latestBooking.venue) {
      console.log(`  Name: ${latestBooking.venue.name}`);
      console.log(`  Address: ${latestBooking.venue.address}`);
    } else {
      console.log('  ❌ No venue data');
    }

    console.log('\n📦 User Package Data:');
    console.log(`  Exists: ${!!latestBooking.userPackage}`);
    if (latestBooking.userPackage) {
      console.log(`  Package ID: ${latestBooking.userPackage.id}`);
      console.log(`  Created: ${latestBooking.userPackage.createdAt}`);
      console.log(`  Active: ${latestBooking.userPackage.isActive}`);
    }

    // Simulate the email data that would be generated
    const emailData = {
      bookingDate: latestBooking.scheduleSlot?.startTime ? new Date(latestBooking.scheduleSlot.startTime).toISOString().split('T')[0] : '',
      bookingTime: latestBooking.scheduleSlot?.startTime ? new Date(latestBooking.scheduleSlot.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
      sessionType: latestBooking.sessionType || '',
      teacherName: latestBooking.teacher?.name || '',
      venue: latestBooking.venue?.name || latestBooking.scheduleSlot?.scheduleTemplate?.venue?.name || '',
      duration: latestBooking.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 0
    };

    console.log('\n📧 Email data that would be generated:');
    console.log(JSON.stringify(emailData, null, 2));

    // Check for empty fields
    const emptyFields = [];
    if (!emailData.bookingDate) emptyFields.push('bookingDate');
    if (!emailData.bookingTime) emptyFields.push('bookingTime');
    if (!emailData.sessionType) emptyFields.push('sessionType');
    if (!emailData.teacherName) emptyFields.push('teacherName');
    if (!emailData.venue) emptyFields.push('venue');

    if (emptyFields.length > 0) {
      console.log('\n❌ Empty fields in email data:', emptyFields);
    } else {
      console.log('\n✅ All fields populated');
    }

    // Check if the issue is in the database relationships
    console.log('\n🔍 Database Relationship Analysis:');
    
    // Check if schedule slot exists in database
    if (latestBooking.scheduleSlotId) {
      const scheduleSlot = await prisma.scheduleSlot.findUnique({
        where: { id: latestBooking.scheduleSlotId },
        include: {
          scheduleTemplate: {
            include: {
              sessionDuration: true,
              venue: true
            }
          }
        }
      });
      
      console.log(`  Schedule Slot ${latestBooking.scheduleSlotId} exists: ${!!scheduleSlot}`);
      if (scheduleSlot) {
        console.log(`    Start Time: ${scheduleSlot.startTime}`);
        console.log(`    Venue: ${scheduleSlot.scheduleTemplate?.venue?.name}`);
      }
    }

    // Check if teacher exists in database
    if (latestBooking.teacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: latestBooking.teacherId }
      });
      
      console.log(`  Teacher ${latestBooking.teacherId} exists: ${!!teacher}`);
      if (teacher) {
        console.log(`    Name: ${teacher.name}`);
      }
    }

    // Check if venue exists in database
    if (latestBooking.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: latestBooking.venueId }
      });
      
      console.log(`  Venue ${latestBooking.venueId} exists: ${!!venue}`);
      if (venue) {
        console.log(`    Name: ${venue.name}`);
      }
    }

  } catch (error) {
    console.error('❌ Error debugging booking email issue:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugBookingEmailIssue();
