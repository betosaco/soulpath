import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/dashboard/summary - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', user.email);

    // Fetch all dashboard statistics in parallel
    const [
      totalUsers,
      totalBookings,
      totalRevenue,
      activePackages,
      recentBookings,
      recentPurchases,
      monthlyRevenue,
      bookingStats
    ] = await Promise.all([
      // Total users count
      prisma.user.count({
        where: { role: 'USER' }
      }),
      
      // Total bookings count
      prisma.booking.count(),
      
      // Total revenue from completed purchases
      prisma.purchase.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true }
      }),
      
      // Active packages count
      prisma.packageDefinition.count({
        where: { isActive: true }
      }),
      
      // Recent bookings (last 10)
      prisma.booking.findMany({
        take: 10,
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
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
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
                  }
                }
              }
            }
          }
        }
      }),
      
      // Recent purchases (last 10)
      prisma.purchase.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true
            }
          },
          userPackages: {
            include: {
              packagePrice: {
                include: {
                  packageDefinition: {
                    select: {
                      name: true,
                      packageType: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      
      // Monthly revenue for the last 6 months
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "purchasedAt") as month,
          SUM("totalAmount") as revenue
        FROM "Purchase" 
        WHERE "paymentStatus" = 'completed' 
          AND "purchasedAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "purchasedAt")
        ORDER BY month DESC
      `,
      
      // Booking statistics by status
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true }
      })
    ]);

    // Calculate additional metrics
    const totalRevenueAmount = Number(totalRevenue._sum?.totalAmount || 0);
    const averageBookingValue = totalBookings > 0 ? totalRevenueAmount / totalBookings : 0;
    
    // Process monthly revenue data
    const monthlyRevenueData = Array.isArray(monthlyRevenue) 
      ? monthlyRevenue.map((item: { month: Date; revenue: string | number }) => ({
          month: item.month,
          revenue: parseFloat(String(item.revenue)) || 0
        }))
      : [];

    // Process booking statistics
    const bookingStatsData = bookingStats.reduce((acc: Record<string, number>, stat) => {
      if (stat.status) {
        acc[stat.status] = stat._count.status;
      }
      return acc;
    }, {});

    // Calculate conversion rate (purchases vs total users)
    const conversionRate = totalUsers > 0 ? (recentPurchases.length / totalUsers) * 100 : 0;

    const dashboardSummary = {
      overview: {
        totalUsers,
        totalBookings,
        totalRevenue: totalRevenueAmount,
        activePackages,
        averageBookingValue,
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      recentActivity: {
        recentBookings: recentBookings.map(booking => ({
          id: booking.id,
          user: booking.user,
          sessionDate: booking.createdAt,
          sessionTime: booking.scheduleSlot?.startTime || booking.teacherScheduleSlot?.startTime,
          status: booking.status,
          packageName: booking.userPackage?.packagePrice?.packageDefinition?.name || 'N/A',
          packageType: booking.userPackage?.packagePrice?.packageDefinition?.packageType || 'N/A',
          createdAt: booking.createdAt
        })),
        recentPurchases: recentPurchases.map(purchase => ({
          id: purchase.id,
          user: purchase.user,
          totalAmount: purchase.totalAmount,
          currencyCode: purchase.currencyCode,
          paymentStatus: purchase.paymentStatus,
          packages: purchase.userPackages.map(up => ({
            packageName: up.packagePrice?.packageDefinition?.name || 'N/A',
            packageType: up.packagePrice?.packageDefinition?.packageType || 'N/A',
            quantity: up.quantity
          })),
          purchasedAt: purchase.purchasedAt
        }))
      },
      analytics: {
        monthlyRevenue: monthlyRevenueData,
        bookingStats: bookingStatsData
      }
    };

    console.log('✅ Dashboard summary data fetched successfully');

    return NextResponse.json({
      success: true,
      data: dashboardSummary
    });

  } catch (error) {
    console.error('❌ Unexpected error in dashboard summary API:', error);
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
