import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true,
                price: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        },
        orderHistory: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const {
      status,
      paymentStatus,
      shippingStatus,
      notes
    } = body;

    const updateData: {
      status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
      paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
      shippingStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
      notes?: string;
    } = {};
    
    if (status !== undefined && ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(status)) {
      updateData.status = status as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
    }
    if (paymentStatus !== undefined && ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'].includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus as 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
    }
    if (shippingStatus !== undefined && ['PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(shippingStatus)) {
      updateData.shippingStatus = shippingStatus as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
    }
    if (notes !== undefined) updateData.notes = notes;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: updateData
    });

    // Add to order history
    if (status || paymentStatus || shippingStatus) {
      await prisma.orderHistory.create({
        data: {
          orderId: params.id,
          status: status || paymentStatus || shippingStatus,
          notes: `Status updated to ${status || paymentStatus || shippingStatus}`
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get order with items to restore inventory
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Restore inventory for each item
    for (const item of order.items) {
      await prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          type: 'IN',
          quantity: item.quantity,
          reason: 'Order cancelled',
          reference: order.id
        }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });
    }

    // Delete the order
    await prisma.order.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
