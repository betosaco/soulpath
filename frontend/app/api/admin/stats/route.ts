import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Admin Stats API Endpoint
 * 
 * This endpoint demonstrates the new secure pattern:
 * 1. Middleware has already verified the user is authenticated and has admin role
 * 2. We use getAuthenticatedUser() to get user data from headers (no additional DB calls)
 * 3. No need for manual role checking - middleware guarantees admin access
 */

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('📊 Admin Stats API: Fetching dashboard statistics...');

    // Get authenticated user from middleware-set headers
    // This is much more efficient than re-verifying the token
    const authUser = getAuthenticatedUser(request);
    
    if (!authUser) {
      // This should never happen due to middleware protection, but good to be safe
      console.error('📊 Admin Stats API: No user data in headers (middleware issue)');
      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        message: 'User data not found in request headers'
      }, { status: 500 });
    }

    console.log('📊 Admin Stats API: Processing request for admin user:', authUser.email);

    // Fetch comprehensive dashboard statistics
    const [
      totalUsers,
      activeUsers,
      totalBookings,
      confirmedBookings,
      totalPackages,
      activePackages,
      totalRevenue,
      recentBookings,
      userGrowth,
      bookingTrends
    ] = await Promise.all([
      // User statistics
      prisma.user.count(),
      prisma.user.count({ where: { status: 'active' } }),
      
      // Booking statistics
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      
      // Package statistics
      prisma.packageDefinition.count(),
      prisma.packageDefinition.count({ where: { isActive: true } }),
      
      // Revenue statistics
      prisma.purchase.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: 'confirmed' }
      }),
      
      // Recent bookings (last 7 days)
      prisma.booking.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          user: {
            select: { id: true, email: true, fullName: true }
          },
          userPackage: {
            include: {
              packagePrice: {
                include: {
                  packageDefinition: {
                    select: { name: true, sessionsCount: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // User growth (last 30 days)
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Booking trends (last 30 days)
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate additional metrics
    const bookingConversionRate = totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;
    const averageRevenuePerUser = activeUsers > 0 ? Number(totalRevenue._sum.totalAmount || 0) / activeUsers : 0;
    const packageUtilizationRate = activePackages > 0 ? (totalPackages / activePackages) * 100 : 0;

    // Format recent bookings for display
    const formattedRecentBookings = recentBookings.map(booking => ({
      id: booking.id,
      user: {
        id: booking.user.id,
        email: booking.user.email,
        fullName: booking.user.fullName
      },
      package: {
        name: booking.userPackage.packagePrice.packageDefinition.name,
        sessionsCount: booking.userPackage.packagePrice.packageDefinition.sessionsCount
      },
      status: booking.status,
      createdAt: booking.createdAt,
      sessionType: booking.sessionType
    }));

    const stats = {
      overview: {
        totalUsers,
        activeUsers,
        totalBookings,
        confirmedBookings,
        totalPackages,
        activePackages,
        totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
        bookingConversionRate: Math.round(bookingConversionRate * 100) / 100,
        averageRevenuePerUser: Math.round(averageRevenuePerUser * 100) / 100,
        packageUtilizationRate: Math.round(packageUtilizationRate * 100) / 100
      },
      growth: {
        newUsersLast30Days: userGrowth,
        newBookingsLast30Days: bookingTrends
      },
      recentActivity: {
        recentBookings: formattedRecentBookings
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: authUser.email,
        period: '30 days'
      }
    };

    console.log('📊 Admin Stats API: Successfully generated stats for admin:', authUser.email);

    return NextResponse.json({
      success: true,
      data: stats,
      message: 'Dashboard statistics retrieved successfully'
    });

  } catch (error) {
    console.error('❌ Admin Stats API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard statistics',
      message: 'An error occurred while generating dashboard statistics',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Internal server error'
    }, { status: 500 });
  }
}
