import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 GET /api/admin/clients/[id]/summary - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { id } = params;
    const clientId = id;

    console.log('✅ Admin user authenticated:', user.email);
    console.log('🔍 Fetching summary for client:', clientId);

    // Fetch client profile and related data in parallel
    const [
      clientProfile,
      activePackages,
      pastPackages,
      recentBookings,
      totalPurchaseAmount,
      upcomingBookings
    ] = await Promise.all([
      // Client profile details
      prisma.user.findUnique({
        where: { id: clientId },
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true,
          birthDate: true,
          birthTime: true,
          birthPlace: true,
          question: true,
          language: true,
          adminNotes: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      
      // Active packages
      prisma.userPackage.findMany({
        where: {
          userId: clientId,
          isActive: true
        },
        include: {
          packagePrice: {
            include: {
              packageDefinition: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  sessionsCount: true,
                  packageType: true,
                  sessionDuration: {
                    select: {
                      name: true,
                      duration_minutes: true
                    }
                  }
                }
              },
              currency: {
                select: {
                  code: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      // Past packages (inactive)
      prisma.userPackage.findMany({
        where: {
          userId: clientId,
          isActive: false
        },
        include: {
          packagePrice: {
            include: {
              packageDefinition: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  sessionsCount: true,
                  packageType: true,
                  sessionDuration: {
                    select: {
                      name: true,
                      duration_minutes: true
                    }
                  }
                }
              },
              currency: {
                select: {
                  code: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Recent bookings (last 5)
      prisma.booking.findMany({
        where: { userId: clientId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          scheduleSlot: {
            select: {
              startTime: true
            }
          },
          teacherScheduleSlot: {
            select: {
              startTime: true
            }
          },
          userPackage: {
            include: {
              packagePrice: {
                include: {
                  packageDefinition: {
                    select: {
                      name: true,
                      packageType: true
                    }
                  },
                  currency: {
                    select: {
                      code: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      
      // Total purchase amount
      prisma.purchase.aggregate({
        where: {
          userId: clientId,
          paymentStatus: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      
      // Upcoming bookings
      prisma.booking.findMany({
        where: {
          userId: clientId,
          status: { in: ['confirmed', 'pending'] },
          createdAt: { gte: new Date() }
        },
        orderBy: { createdAt: 'asc' },
        include: {
          scheduleSlot: {
            select: {
              startTime: true
            }
          },
          teacherScheduleSlot: {
            select: {
              startTime: true
            }
          },
          userPackage: {
            include: {
              packagePrice: {
                include: {
                  packageDefinition: {
                    select: {
                      name: true,
                      packageType: true
                    }
                  },
                  currency: {
                    select: {
                      code: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    ]);

    if (!clientProfile) {
      return NextResponse.json({
        success: false,
        error: 'Client not found',
        message: 'Client with this ID does not exist'
      }, { status: 404 });
    }

    // Calculate additional metrics
    const totalSpent = totalPurchaseAmount._sum.totalAmount || 0;
    const totalSessionsUsed = activePackages.reduce((sum, pkg) => sum + (pkg.sessionsUsed || 0), 0);
    const totalSessionsAvailable = activePackages.reduce((sum, pkg) => sum + ((pkg.quantity || 0) * pkg.packagePrice.packageDefinition.sessionsCount), 0);
    const sessionsRemaining = totalSessionsAvailable - totalSessionsUsed;

    // Process packages data
    const processedActivePackages = activePackages.map(pkg => ({
      id: pkg.id,
      packageName: pkg.packagePrice.packageDefinition.name,
      packageType: pkg.packagePrice.packageDefinition.packageType,
      sessionsCount: pkg.packagePrice.packageDefinition.sessionsCount,
      sessionsUsed: pkg.sessionsUsed || 0,
      sessionsRemaining: ((pkg.quantity || 0) * pkg.packagePrice.packageDefinition.sessionsCount) - (pkg.sessionsUsed || 0),
      quantity: pkg.quantity,
      price: pkg.packagePrice.price,
      currencyCode: pkg.packagePrice.currency?.code || 'USD',
      expiresAt: pkg.expiresAt,
      createdAt: pkg.createdAt
    }));

    const processedPastPackages = pastPackages.map(pkg => ({
      id: pkg.id,
      packageName: pkg.packagePrice.packageDefinition.name,
      packageType: pkg.packagePrice.packageDefinition.packageType,
      sessionsCount: pkg.packagePrice.packageDefinition.sessionsCount,
      sessionsUsed: pkg.sessionsUsed,
      quantity: pkg.quantity,
      price: pkg.packagePrice.price,
      currencyCode: pkg.packagePrice.currency?.code || 'USD',
      createdAt: pkg.createdAt,
      expiresAt: pkg.expiresAt
    }));

    // Process bookings data
    const processedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      sessionDate: booking.createdAt,
      sessionTime: booking.scheduleSlot?.startTime || booking.teacherScheduleSlot?.startTime,
      status: booking.status,
      packageName: booking.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
      packageType: booking.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A',
      createdAt: booking.createdAt
    }));

    const processedUpcomingBookings = upcomingBookings.map(booking => ({
      id: booking.id,
      sessionDate: booking.createdAt,
      sessionTime: booking.scheduleSlot?.startTime || booking.teacherScheduleSlot?.startTime,
      status: booking.status,
      packageName: booking.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
      packageType: booking.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A'
    }));

    const clientSummary = {
      profile: clientProfile,
      metrics: {
        totalSpent,
        totalSessionsUsed,
        totalSessionsAvailable,
        sessionsRemaining,
        activePackageCount: activePackages.length,
        upcomingSessionCount: upcomingBookings.length
      },
      packages: {
        active: processedActivePackages,
        past: processedPastPackages
      },
      bookings: {
        recent: processedRecentBookings,
        upcoming: processedUpcomingBookings
      }
    };

    console.log('✅ Client summary data fetched successfully for client:', clientId);

    return NextResponse.json({
      success: true,
      data: clientSummary
    });

  } catch (error) {
    console.error('❌ Unexpected error in client summary API:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
