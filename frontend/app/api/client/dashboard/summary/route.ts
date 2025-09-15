import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/client/dashboard/summary - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'client') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Client access required'
      }, { status: 401 });
    }

    console.log('✅ Client user authenticated:', user.email);

    // Fetch client dashboard data in parallel
    const [
      activePackages,
      upcomingBookings,
      totalSpent,
      nextUpcomingSession,
      recentBookings,
      // packageUsageStats
    ] = await Promise.all([
      // Active packages
      prisma.userPackage.findMany({
        where: {
          userId: user.id,
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
      
      // Upcoming bookings
      prisma.booking.findMany({
        where: {
          userId: user.id,
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
            }
          }
        }
      }),
      
      // Total spent
      prisma.purchase.aggregate({
        where: {
          userId: user.id,
          paymentStatus: 'COMPLETED'
        },
        _sum: { totalAmount: true }
      }),
      
      // Next upcoming session
      prisma.booking.findFirst({
        where: {
          userId: user.id,
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
            }
          }
        }
      }),
      
      // Recent bookings (last 5)
      prisma.booking.findMany({
        where: { userId: user.id },
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
            }
          }
        }
      }),
      
      // Package usage statistics
      prisma.userPackage.groupBy({
        by: ['packagePriceId'],
        where: {
          userId: user.id,
          isActive: true
        },
        _sum: {
          sessionsUsed: true
        },
        _count: {
          id: true
        }
      })
    ]);

    // Calculate metrics
    const totalSpentAmount = totalSpent._sum?.totalAmount || 0;
    const totalSessionsUsed = activePackages.reduce((sum, pkg) => sum + (pkg.sessionsUsed || 0), 0);
    const totalSessionsAvailable = activePackages.reduce((sum, pkg) => sum + ((pkg.quantity || 0) * pkg.packagePrice.packageDefinition.sessionsCount), 0);
    const sessionsRemaining = totalSessionsAvailable - totalSessionsUsed;

    // Process active packages
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
      progressPercentage: pkg.packagePrice.packageDefinition.sessionsCount > 0 
        ? Math.round(((pkg.sessionsUsed || 0) / ((pkg.quantity || 0) * pkg.packagePrice.packageDefinition.sessionsCount)) * 100)
        : 0
    }));

    // Process upcoming bookings
    const processedUpcomingBookings = upcomingBookings.map(booking => ({
      id: booking.id,
      createdAt: booking.createdAt,
      sessionTime: booking.scheduleSlot?.startTime || booking.teacherScheduleSlot?.startTime,
      status: booking.status,
      packageName: booking.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
      packageType: booking.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A',
      sessionDuration: booking.userPackage?.packagePrice?.packageDefinition?.sessionDuration?.duration_minutes || 60
    }));

    // Process recent bookings
    const processedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      createdAt: booking.createdAt,
      sessionTime: booking.scheduleSlot?.startTime || booking.teacherScheduleSlot?.startTime,
      status: booking.status,
      packageName: booking.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
      packageType: booking.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A'
    }));

    // Process next upcoming session
    const processedNextSession = nextUpcomingSession ? {
      id: nextUpcomingSession.id,
      createdAt: nextUpcomingSession.createdAt,
      sessionTime: nextUpcomingSession.scheduleSlot?.startTime || nextUpcomingSession.teacherScheduleSlot?.startTime,
      status: nextUpcomingSession.status,
      packageName: nextUpcomingSession.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
      packageType: nextUpcomingSession.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A',
      sessionDuration: nextUpcomingSession.userPackage?.packagePrice?.packageDefinition?.sessionDuration?.duration_minutes || 60,
      sessionDurationName: nextUpcomingSession.userPackage?.packagePrice?.packageDefinition?.sessionDuration?.name || 'Standard'
    } : null;

    const dashboardSummary = {
      overview: {
        activePackageCount: activePackages.length,
        upcomingSessionCount: upcomingBookings.length,
        totalSpent: totalSpentAmount,
        totalSessionsUsed,
        totalSessionsAvailable,
        sessionsRemaining
      },
      nextSession: processedNextSession,
      packages: processedActivePackages,
      upcomingBookings: processedUpcomingBookings,
      recentBookings: processedRecentBookings,
      usageStats: {
        totalPackages: activePackages.length,
        totalSessionsUsed,
        totalSessionsAvailable,
        averageUsagePerPackage: activePackages.length > 0 ? Math.round(totalSessionsUsed / activePackages.length) : 0
      }
    };

    console.log('✅ Client dashboard summary data fetched successfully for user:', user.id);

    return NextResponse.json({
      success: true,
      data: dashboardSummary
    });

  } catch (error) {
    console.error('❌ Unexpected error in client dashboard summary API:', error);
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
