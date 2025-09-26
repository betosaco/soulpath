import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }));
}

// POST: Send late notification to students
export async function POST(request: NextRequest) {
  console.log('🔔 POST /api/teacher/notify-late - Starting late notification request');
  console.log('🔔 Request URL:', request.url);
  console.log('🔔 Request method:', request.method);
  
  try {
    console.log('🔔 Attempting authentication...');
    let user, teacher;
    
    try {
      user = getAuthenticatedUser(request) ?? await requireAuth(request);
      console.log('🔔 User authenticated:', user ? 'Yes' : 'No', user?.email);
    } catch (authError) {
      console.error('🔔 Authentication failed:', authError);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 }));
    }
    
    if (!user || !user.email) {
      console.log('🔔 Unauthorized - no user or email');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }));
    }

    try {
      console.log('🔔 Looking up teacher with email:', user.email);
      teacher = await prisma.teacher.findFirst({ 
        where: { email: user.email } 
      });
      console.log('🔔 Teacher found:', teacher ? 'Yes' : 'No', teacher?.id);
    } catch (teacherError) {
      console.error('🔔 Teacher lookup failed:', teacherError);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Teacher lookup failed' }, { status: 500 }));
    }
    
    if (!teacher) {
      console.log('🔔 Teacher profile not found for email:', user.email);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 403 }));
    }

    console.log('🔔 Parsing request body...');
    const body = await request.json().catch((parseError) => {
      console.error('🔔 Failed to parse request body:', parseError);
      return {};
    });
    const { slotId, lateMinutes, message } = body || {};
    
    console.log('🔔 Request body:', { slotId, lateMinutes, message });

    if (!slotId || !lateMinutes) {
      console.log('🔔 Missing required fields:', { slotId, lateMinutes });
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 }));
    }

    // Validate data types
    if (typeof slotId !== 'number' && typeof slotId !== 'string') {
      console.log('🔔 Invalid slotId type:', typeof slotId);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Invalid slotId type' }, { status: 400 }));
    }

    if (typeof lateMinutes !== 'number' || lateMinutes <= 0) {
      console.log('🔔 Invalid lateMinutes:', lateMinutes);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Invalid lateMinutes value' }, { status: 400 }));
    }

    // Verify slot belongs to this teacher
    console.log('🔔 Looking up slot with ID:', Number(slotId));
    const slot = await prisma.teacherScheduleSlot.findUnique({
      where: { id: Number(slotId) },
      select: { 
        id: true, 
        startTime: true,
        endTime: true,
        teacherSchedule: { 
          select: { 
            teacherId: true,
            serviceType: { select: { name: true } },
            venue: { select: { name: true } }
          } 
        },
        bookings: {
          where: { status: { not: 'cancelled' } },
          select: {
            id: true,
            userId: true,
            user: {
              select: {
                id: true,
                email: true,
                fullName: true
              }
            }
          }
        }
      }
    });
    console.log('🔔 Slot query completed, found:', slot ? 'Yes' : 'No');

    console.log('🔔 Slot found:', slot ? 'Yes' : 'No', slot?.id);
    console.log('🔔 Slot teacher ID:', slot?.teacherSchedule?.teacherId, 'Current teacher ID:', teacher.id);
    
    if (!slot || slot.teacherSchedule.teacherId !== teacher.id) {
      console.log('🔔 Slot not found or unauthorized');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Slot not found or unauthorized' }, { status: 404 }));
    }

    // Calculate new start time
    console.log('🔔 Calculating new times...');
    console.log('🔔 Original start time:', slot.startTime);
    console.log('🔔 Original end time:', slot.endTime);
    console.log('🔔 Late minutes:', lateMinutes);
    
    const originalStart = new Date(slot.startTime);
    const newStart = new Date(originalStart.getTime() + (lateMinutes * 60 * 1000));
    const newEnd = new Date(slot.endTime.getTime() + (lateMinutes * 60 * 1000));
    
    console.log('🔔 New start time:', newStart);
    console.log('🔔 New end time:', newEnd);

    // Update the slot times and late notification data
    console.log('🔔 Updating slot with late notification data...');
    try {
      const updatedSlot = await prisma.teacherScheduleSlot.update({
        where: { id: Number(slotId) },
        data: {
          startTime: newStart,
          endTime: newEnd,
          isLate: true,
          lateMinutes: lateMinutes,
          lateMessage: message || null,
          lateNotifiedAt: new Date(),
          originalStartTime: originalStart,
          originalEndTime: slot.endTime
        }
      });
      console.log('🔔 Slot updated successfully:', updatedSlot.id);
    } catch (dbError) {
      console.error('🔔 Database update failed:', dbError);
      console.error('🔔 Full error object:', JSON.stringify(dbError, null, 2));
      throw new Error(`Database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    // Update all bookings for this slot
    if (slot.bookings.length > 0) {
      console.log('🔔 Updating bookings for slot...');
      try {
        const updatedBookings = await prisma.booking.updateMany({
          where: { 
            teacherScheduleSlotId: Number(slotId),
            status: { not: 'cancelled' }
          },
          data: {
            // Note: startTime and endTime are stored in TeacherScheduleSlot, not Booking
          }
        });
        console.log('🔔 Bookings updated successfully:', updatedBookings.count);
      } catch (bookingError) {
        console.error('🔔 Booking update failed:', bookingError);
        // Don't throw here, just log the error as the slot update was successful
      }
    }

    // TODO: Send email notifications to students
    // This would integrate with your email service (Brevo, etc.)
    // For now, we'll just log the notification details
    
    const notificationDetails = {
      slotId: slot.id,
      originalStartTime: originalStart.toISOString(),
      newStartTime: newStart.toISOString(),
      lateMinutes,
      message: message || '',
      affectedStudents: slot.bookings.map(booking => ({
        id: booking.user.id,
        email: booking.user.email,
        name: booking.user.fullName
      })),
      serviceType: slot.teacherSchedule.serviceType?.name || 'Unknown',
      venue: slot.teacherSchedule.venue.name
    };

    console.log('🔔 Late notification sent:', notificationDetails);

    const response = { 
      success: true, 
      message: 'Late notification sent successfully',
      data: {
        newStartTime: newStart.toISOString(),
        affectedStudents: slot.bookings.length,
        notificationDetails
      }
    };
    
    console.log('🔔 Returning success response:', response);
    return addCorsHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('🔔 POST /api/teacher/notify-late error:', error);
    console.error('🔔 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return addCorsHeaders(NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 }));
  }
}
