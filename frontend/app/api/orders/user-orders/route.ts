import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the user ID from authentication
    // For now, we'll get it from query params or headers
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's orders with order items
    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: {
        orderItems: {
          include: {
            product: true,
            packagePrice: {
              include: {
                packageDefinition: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform orders to summary format
    const orderSummaries = orders.map(order => {
      const hasProducts = order.orderItems.some(item => item.itemType === 'PRODUCT');
      const hasPackages = order.orderItems.some(item => item.itemType === 'PACKAGE');
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        total: Number(order.total),
        currency: order.currency,
        createdAt: order.createdAt.toISOString(),
        itemCount: order.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        hasProducts,
        hasPackages
      };
    });

    return NextResponse.json({
      success: true,
      orders: orderSummaries
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
