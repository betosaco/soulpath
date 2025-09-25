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

// POST: Revert late notification and restore original times
export async function POST(request: NextRequest) {
  console.log('🔄 POST /api/teacher/revert-late - Starting revert late notification request');
  console.log('🔄 Request URL:', request.url);
  console.log('🔄 Request method:', request.method);
  
  try {
    console.log('🔄 Attempting authentication...');
    let user, teacher;
    
    try {
      user = getAuthenticatedUser(request) ?? await requireAuth(request);
      console.log('🔄 User authenticated:', user ? 'Yes' : 'No', user?.email);
    } catch (authError) {
      console.error('🔄 Authentication failed:', authError);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 401 }));
    }
    
    if (!user || !user.email) {
      console.log('🔄 Unauthorized - no user or email');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }));
    }

    try {
      console.log('🔄 Looking up teacher with email:', user.email);
      teacher = await prisma.teacher.findFirst({ 
        where: { email: user.email } 
      });
      console.log('🔄 Teacher found:', teacher ? 'Yes' : 'No', teacher?.id);
    } catch (teacherError) {
      console.error('🔄 Teacher lookup failed:', teacherError);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Teacher lookup failed' }, { status: 500 }));
    }
    
    if (!teacher) {
      console.log('🔄 Teacher profile not found for email:', user.email);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Teacher profile not found' }, { status: 403 }));
    }

    console.log('🔄 Parsing request body...');
    const body = await request.json().catch((parseError) => {
      console.error('🔄 Failed to parse request body:', parseError);
      return {};
    });
    const { slotId } = body || {};
    
    console.log('🔄 Request body:', { slotId });

    if (!slotId) {
      console.log('🔄 Missing required field: slotId');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Missing required field: slotId' }, { status: 400 }));
    }

    // Validate data type
    if (typeof slotId !== 'number' && typeof slotId !== 'string') {
      console.log('🔄 Invalid slotId type:', typeof slotId);
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Invalid slotId type' }, { status: 400 }));
    }

    // Verify slot belongs to this teacher and is currently late
    console.log('🔄 Looking up slot with ID:', Number(slotId));
    const slot = await prisma.teacherScheduleSlot.findUnique({
      where: { id: Number(slotId) },
      select: { 
        id: true, 
        startTime: true,
        endTime: true,
        isLate: true,
        originalStartTime: true,
        originalEndTime: true,
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
    console.log('🔄 Slot query completed, found:', slot ? 'Yes' : 'No');

    console.log('🔄 Slot found:', slot ? 'Yes' : 'No', slot?.id);
    console.log('🔄 Slot teacher ID:', slot?.teacherSchedule?.teacherId, 'Current teacher ID:', teacher.id);
    console.log('🔄 Slot is late:', slot?.isLate);
    console.log('🔄 Slot has original times:', slot?.originalStartTime ? 'Yes' : 'No');
    
    if (!slot || slot.teacherSchedule.teacherId !== teacher.id) {
      console.log('🔄 Slot not found or unauthorized');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Slot not found or unauthorized' }, { status: 404 }));
    }

    if (!slot.isLate || !slot.originalStartTime || !slot.originalEndTime) {
      console.log('🔄 Slot is not currently late or missing original times');
      return addCorsHeaders(NextResponse.json({ success: false, error: 'Slot is not currently late or missing original times' }, { status: 400 }));
    }

    // Restore original times
    console.log('🔄 Restoring original times...');
    console.log('🔄 Current start time:', slot.startTime);
    console.log('🔄 Current end time:', slot.endTime);
    console.log('🔄 Original start time:', slot.originalStartTime);
    console.log('🔄 Original end time:', slot.originalEndTime);

    // Update the slot to restore original times and clear late notification data
    console.log('🔄 Updating slot to restore original times...');
    try {
      const updatedSlot = await prisma.teacherScheduleSlot.update({
        where: { id: Number(slotId) },
        data: {
          startTime: slot.originalStartTime,
          endTime: slot.originalEndTime,
          isLate: false,
          lateMinutes: 0,
          lateMessage: null,
          lateNotifiedAt: null,
          originalStartTime: null,
          originalEndTime: null
        }
      });
      console.log('🔄 Slot updated successfully:', updatedSlot.id);
    } catch (dbError) {
      console.error('🔄 Database update failed:', dbError);
      console.error('🔄 Full error object:', JSON.stringify(dbError, null, 2));
      throw new Error(`Database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }

    // Update all bookings for this slot to restore original times
    if (slot.bookings.length > 0) {
      console.log('🔄 Updating bookings for slot...');
      try {
        const updatedBookings = await prisma.booking.updateMany({
          where: { 
            teacherScheduleSlotId: Number(slotId),
            status: { not: 'cancelled' }
          },
          data: {
            startTime: slot.originalStartTime,
            endTime: slot.originalEndTime
          }
        });
        console.log('🔄 Bookings updated successfully:', updatedBookings.count);
      } catch (bookingError) {
        console.error('🔄 Booking update failed:', bookingError);
        // Don't throw here, just log the error as the slot update was successful
      }
    }

    // TODO: Send email notifications to students about the time restoration
    // This would integrate with your email service (Brevo, etc.)
    // For now, we'll just log the notification details
    
    const revertDetails = {
      slotId: slot.id,
      restoredStartTime: slot.originalStartTime.toISOString(),
      restoredEndTime: slot.originalEndTime.toISOString(),
      affectedStudents: slot.bookings.map(booking => ({
        id: booking.user.id,
        email: booking.user.email,
        name: booking.user.fullName
      })),
      serviceType: slot.teacherSchedule.serviceType.name,
      venue: slot.teacherSchedule.venue.name
    };

    console.log('🔄 Late notification reverted:', revertDetails);

    const response = { 
      success: true, 
      message: 'Late notification reverted successfully',
      data: {
        restoredStartTime: slot.originalStartTime.toISOString(),
        restoredEndTime: slot.originalEndTime.toISOString(),
        affectedStudents: slot.bookings.length,
        revertDetails
      }
    };
    
    console.log('🔄 Returning success response:', response);
    return addCorsHeaders(NextResponse.json(response));
  } catch (error) {
    console.error('🔄 POST /api/teacher/revert-late error:', error);
    console.error('🔄 Error details:', {
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
