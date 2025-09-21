import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get basic counts
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      topProducts
    ] = await Promise.all([
      // Total products
      prisma.product.count(),
      
      // Total orders
      prisma.order.count(),
      
      // Total customers
      prisma.customer.count(),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          paymentStatus: 'COMPLETED'
        }
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }),
      
      // Low stock products
      prisma.product.findMany({
        where: {
          stock: {
            lte: 10
          },
          status: 'ACTIVE'
        },
        take: 5,
        orderBy: { stock: 'asc' }
      }),
      
      // Top selling products
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      })
    ]);

    // Get period-specific stats
    const [
      periodOrders,
      periodRevenue,
      periodCustomers
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      prisma.order.aggregate({
        _sum: {
          total: true
        },
        where: {
          createdAt: {
            gte: startDate
          },
          paymentStatus: 'COMPLETED'
        }
      }),
      
      prisma.customer.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      })
    ]);

    // Calculate growth percentages (mock data for now)
    const revenueGrowth = 12.5; // This would be calculated from previous period
    const ordersGrowth = 8.2;
    const customersGrowth = 15.3;
    const productsGrowth = -2.1;

    const stats = {
      overview: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        productsGrowth
      },
      period: {
        orders: periodOrders,
        revenue: periodRevenue._sum.total || 0,
        customers: periodCustomers
      },
      recent: {
        orders: recentOrders,
        lowStockProducts,
        topProducts
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching ecommerce stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ecommerce stats' },
      { status: 500 }
    );
  }
}
