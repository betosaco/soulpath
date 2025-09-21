import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with all related data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            packagePrice: {
              include: {
                packageDefinition: true,
                currency: true
              }
            }
          }
        },
        customer: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform order items to match frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItems = order.items.map((item: any) => {
      if (item.itemType === 'PRODUCT' && item.product) {
        return {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.price),
          quantity: item.quantity,
          type: 'product' as const,
          image: item.product.image || '/images/products/default.jpg',
          sku: item.product.sku
        };
      } else if (item.itemType === 'PACKAGE' && item.packagePrice) {
        return {
          id: item.packagePrice.id.toString(),
          name: item.packagePrice.packageDefinition.name,
          price: Number(item.price),
          quantity: item.quantity,
          type: 'package' as const,
          sessions: item.packagePrice.packageDefinition.sessionsCount,
          duration: item.packagePrice.packageDefinition.sessionDuration?.duration_minutes,
          packageType: item.packagePrice.packageDefinition.packageType,
          maxGroupSize: item.packagePrice.packageDefinition.maxGroupSize
        };
      }
      return null;
    }).filter(Boolean);

    // Format the response
    const response = {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shippingStatus: order.shippingStatus,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        shippingAmount: Number(order.shippingAmount),
        total: Number(order.total),
        currency: order.currency,
        createdAt: order.createdAt.toISOString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shippingAddress: order.shippingAddress as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        billingAddress: order.billingAddress as any,
        orderItems
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
