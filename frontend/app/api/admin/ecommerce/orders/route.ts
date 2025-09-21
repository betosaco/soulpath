import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const shippingStatus = searchParams.get('shippingStatus') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        orderNumber?: { contains: string; mode: 'insensitive' };
        customerName?: { contains: string; mode: 'insensitive' };
        customerEmail?: { contains: string; mode: 'insensitive' };
      }>;
      status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
      paymentStatus?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
      shippingStatus?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
    } = {};
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status && ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(status)) {
      where.status = status as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';
    }
    
    if (paymentStatus && ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'].includes(paymentStatus)) {
      where.paymentStatus = paymentStatus as 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
    }
    
    if (shippingStatus && ['PENDING', 'PROCESSING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED'].includes(shippingStatus)) {
      where.shippingStatus = shippingStatus as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';
    }

    // Build orderBy clause
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    orderBy[sortBy] = sortOrder as 'asc' | 'desc';

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  images: true
                }
              }
            }
          },
          customer: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          },
          _count: {
            select: {
              items: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      taxAmount = 0,
      shippingAmount = 0,
      discountAmount = 0,
      total,
      currency = 'PEN',
      notes,
      shippingAddress,
      billingAddress,
      paymentMethod
    } = body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        subtotal: parseFloat(subtotal),
        taxAmount: parseFloat(taxAmount),
        shippingAmount: parseFloat(shippingAmount),
        discountAmount: parseFloat(discountAmount),
        total: parseFloat(total),
        currency,
        notes,
        shippingAddress,
        billingAddress,
        paymentMethod,
        items: {
          create: items.map((item: {
            productId: string;
            quantity: string;
            price: string;
            name: string;
          }) => ({
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: parseFloat(item.price) * parseInt(item.quantity)
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                images: true
              }
            }
          }
        }
      }
    });

    // Update inventory for each item
    for (const item of items) {
      await prisma.inventoryLog.create({
        data: {
          productId: item.productId,
          type: 'OUT',
          quantity: parseInt(item.quantity),
          reason: 'Order created',
          reference: order.id
        }
      });

      // Update product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: parseInt(item.quantity)
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
