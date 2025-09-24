import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
// import { replacePlaceholders } from '@/lib/communication/placeholders';
import { sendBookingConfirmationEmail } from '@/lib/send-booking-confirmation-email';


// Zod schema for booking creation
const createBookingSchema = z.object({
  scheduleSlotId: z.number().int().positive('Schedule slot ID must be positive'),
  userPackageId: z.number().int().positive('User package ID must be positive'),
  sessionType: z.string().min(1, 'Session type is required').default('Session'),
  notes: z.string().optional(),
  otpCode: z.string().optional(), // OTP code for verification
  phoneNumber: z.string().optional() // Phone number for OTP verification
});

const querySchema = z.object({
  status: z.enum(['upcoming', 'past', 'all']).default('all'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 GET /api/client/bookings - Starting request...');
    
    const user = await requireAuth(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Authentication required' 
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { status, page, limit } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { status, page, limit });

    // Build the query with proper relationships
    const where: Record<string, unknown> = {
      userId: user.id
    };

    // Filter by status
    if (status === 'upcoming') {
      where.scheduleSlot = {
        startTime: { gte: new Date() }
      };
      where.status = 'confirmed';
    } else if (status === 'past') {
      where.scheduleSlot = {
        startTime: { lt: new Date() }
      };
      where.status = 'completed';
    }

    // Ensure database connection
    try {
      await prisma.$connect();
    } catch (error) {
      console.log('Database already connected or connection failed:', error);
    }
    
    // Get bookings with enhanced relationships
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where,
        select: {
          id: true,
          sessionType: true,
          status: true,
          notes: true,
          cancelledReason: true,
          reminderSent: true,
          createdAt: true,
          updatedAt: true,
          scheduleSlot: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              capacity: true,
              bookedCount: true,
              scheduleTemplate: {
                select: {
                  dayOfWeek: true,
                  sessionDuration: {
                    select: {
                      name: true,
                      duration_minutes: true
                    }
                  }
                }
              }
            }
          },
          userPackage: {
            select: {
              id: true,
              quantity: true,
              sessionsUsed: true,
              isActive: true,
              expiresAt: true,
              packagePrice: {
                select: {
                  price: true,
                  pricingMode: true,
                  packageDefinition: {
                    select: {
                      name: true,
                      description: true,
                      sessionsCount: true,
                      packageType: true
                    }
                  },
                  currency: {
                    select: {
                      code: true,
                      symbol: true
                    }
                  }
                }
              }
            }
          }
        },
        skip: offset,
        take: limit,
        orderBy: [
          { scheduleSlot: { startTime: status === 'upcoming' ? 'asc' : 'desc' } }
        ]
      }),
      prisma.booking.count({ where })
    ]);

    console.log('✅ Database query successful, found', bookings?.length || 0, 'bookings');

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages
      },
      message: 'Bookings fetched successfully'
    });

  } catch (error) {
    console.error('❌ Error in GET /api/client/bookings:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 POST /api/client/bookings - Starting request...');
    
    const user = await requireAuth(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized',
        message: 'Authentication required' 
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    const body = await request.json();
    const validation = createBookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid booking data',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { scheduleSlotId, userPackageId, sessionType, notes, otpCode, phoneNumber } = validation.data;

    // Ensure database connection
    try {
      await prisma.$connect();
    } catch (error) {
      console.log('Database already connected or connection failed:', error);
    }

    // Verify the user owns the package and it's active
    const userPackage = await prisma.userPackage.findFirst({
      where: {
        id: userPackageId,
        userId: user.id,
        isActive: true
      },
      include: {
        packagePrice: {
          include: {
            packageDefinition: {
              select: {
                sessionsCount: true
              }
            }
          }
        }
      }
    });

    if (!userPackage) {
      return NextResponse.json({
        success: false,
        error: 'Invalid package',
        message: 'Package not found or not active'
      }, { status: 400 });
    }

    // Check if user has remaining sessions
    const totalSessions = userPackage.packagePrice.packageDefinition.sessionsCount * (userPackage.quantity || 1);
    const remainingSessions = totalSessions - (userPackage.sessionsUsed || 0);

    if (remainingSessions <= 0) {
      return NextResponse.json({
        success: false,
        error: 'No sessions remaining',
        message: 'You have no sessions remaining in this package'
      }, { status: 400 });
    }

    // Verify OTP if provided
    if (otpCode && phoneNumber) {
      const otpVerification = await prisma.otpVerification.findFirst({
        where: {
          phoneNumber,
          otpCode,
          isVerified: true,
          expiresAt: {
            gt: new Date()
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (!otpVerification) {
        return NextResponse.json({
          success: false,
          error: 'Invalid OTP',
          message: 'OTP code is invalid or has expired'
        }, { status: 400 });
      }
    }

    // Verify the schedule slot is available
    const scheduleSlot = await prisma.scheduleSlot.findFirst({
      where: {
        id: scheduleSlotId,
        isAvailable: true
      }
    });

    if (!scheduleSlot) {
      return NextResponse.json({
        success: false,
        error: 'Invalid schedule slot',
        message: 'Schedule slot not found or not available'
      }, { status: 400 });
    }

    // Check if slot has capacity
    if (scheduleSlot.bookedCount && scheduleSlot.capacity && scheduleSlot.bookedCount >= scheduleSlot.capacity) {
      return NextResponse.json({
        success: false,
        error: 'Slot full',
        message: 'This time slot is already full'
      }, { status: 400 });
    }

    // Create the booking and update counts in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the booking
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          userPackageId: userPackageId,
          scheduleSlotId: scheduleSlotId,
          sessionType: sessionType,
          notes: notes,
          status: 'confirmed'
        },
        include: {
          scheduleSlot: {
            select: {
              id: true,
              startTime: true,
              endTime: true,
              scheduleTemplate: {
                select: {
                  dayOfWeek: true,
                  sessionDuration: {
                    select: {
                      name: true,
                      duration_minutes: true
                    }
                  }
                }
              }
            }
          },
          userPackage: {
            select: {
              id: true,
              sessionsUsed: true,
              packagePrice: {
                select: {
                  packageDefinition: {
                    select: {
                      name: true,
                      sessionsCount: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      // Update user package sessions used
      await tx.userPackage.update({
        where: { id: userPackageId },
        data: { sessionsUsed: { increment: 1 } }
      });

      // Update schedule slot booked count
      await tx.scheduleSlot.update({
        where: { id: scheduleSlotId },
        data: { bookedCount: { increment: 1 } }
      });

      return booking;
    });

    console.log('✅ Booking created successfully');

    // Send booking confirmation email
    try {
      if (user.email) {
        // Get complete booking details with package information
        const completeBooking = await prisma.booking.findUnique({
          where: { id: result.id },
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
            userPackage: {
              include: {
                packagePrice: {
                  include: {
                    packageDefinition: true
                  }
                }
              }
            },
            teacher: true,
            venue: true
          }
        });

        if (completeBooking) {
          // Fetch complete user details including name and phone
          const userDetails = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
              id: true,
              email: true,
              phone: true
            }
          });

          const bookingData = {
            customerName: userDetails?.email || 'Usuario',
            customerEmail: user.email,
            customerPhone: userDetails?.phone || '',
            bookingId: completeBooking.id.toString(),
            bookingDate: completeBooking.scheduleSlot?.startTime.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) || '',
            bookingTime: completeBooking.scheduleSlot?.startTime.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            }) || '',
            sessionType: completeBooking.sessionType,
            instructor: completeBooking.teacher?.name || 'Por asignar',
            venue: completeBooking.venue?.name || 'MatMax Yoga Studio',
            duration: completeBooking.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 60,
            packageName: completeBooking.userPackage?.packagePrice?.packageDefinition?.name || 'Paquete de Yoga',
            packageDescription: completeBooking.userPackage?.packagePrice?.packageDefinition?.description || '',
            sessionsUsed: completeBooking.userPackage?.sessionsUsed || 0,
            sessionsRemaining: (completeBooking.userPackage?.packagePrice?.packageDefinition?.sessionsCount || 0) - (completeBooking.userPackage?.sessionsUsed || 0),
            packageType: completeBooking.userPackage?.packagePrice?.packageDefinition?.packageType || 'INDIVIDUAL',
            bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/bookings`,
            language: 'es'
          };

          // Send email asynchronously (don't wait for it to complete)
          sendBookingConfirmationEmail(bookingData).catch(error => {
            console.error('Failed to send booking confirmation email:', error);
            // Don't fail the booking creation if email fails
          });
        }
      }
    } catch (emailError) {
      console.error('Error sending booking confirmation email:', emailError);
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Booking created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error in POST /api/client/bookings:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      message: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
