import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CartItem } from '@/lib/cart-context';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const prisma = new PrismaClient();

interface OrderRequest {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    language: string;
  };
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  paymentIntentId?: string;
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const orderData: OrderRequest = await request.json();

    // Validate required fields
    if (!orderData.customerInfo || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Verify payment intent if provided
    let paymentIntent: Stripe.PaymentIntent | undefined;
    if (orderData.paymentIntentId) {
      try {
        paymentIntent = await stripe.paymentIntents.retrieve(orderData.paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
          return NextResponse.json(
            { success: false, error: 'Payment not completed' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error('Error verifying payment intent:', error);
        return NextResponse.json(
          { success: false, error: 'Invalid payment intent' },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or find customer
      let customer = await tx.user.findFirst({
        where: { email: orderData.customerInfo.email }
      });

      if (!customer) {
        customer = await tx.user.create({
          data: {
            email: orderData.customerInfo.email,
            fullName: orderData.customerInfo.name,
            phone: orderData.customerInfo.phone,
            role: 'USER',
            status: 'ACTIVE'
          }
        });
      }

      // Calculate totals
      const subtotal = orderData.totalAmount;
      const tax = 0; // No tax for now
      const shipping = 0; // Free shipping for now
      const total = subtotal + tax + shipping;

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName: orderData.customerInfo.name,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.phone,
          status: 'CONFIRMED',
          paymentStatus: paymentIntent ? 'COMPLETED' : 'PENDING',
          shippingStatus: orderData.shippingAddress ? 'PENDING' : 'PENDING',
          subtotal: subtotal,
          taxAmount: tax,
          shippingAmount: shipping,
          total: total,
          currency: orderData.currency,
          paymentId: paymentIntent?.id || null,
          notes: orderData.notes,
          shippingAddress: orderData.shippingAddress ? {
            address: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            zipCode: orderData.shippingAddress.zipCode,
            country: orderData.shippingAddress.country
          } : undefined,
          billingAddress: {
            address: orderData.shippingAddress?.address || 'N/A',
            city: orderData.shippingAddress?.city || 'N/A',
            state: orderData.shippingAddress?.state || 'N/A',
            zipCode: orderData.shippingAddress?.zipCode || 'N/A',
            country: orderData.shippingAddress?.country || 'N/A'
          }
        }
      });

      // Create order items
      const orderItems = [];
      const userPackages = [];

      for (const item of orderData.items) {
        if (item.type === 'product') {
          // Handle product order item
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: order.id,
              itemType: 'PRODUCT',
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity
            }
          });
          orderItems.push(orderItem);

          // Update product stock
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });

          // Create inventory log
          await tx.inventoryLog.create({
            data: {
              productId: item.id,
              type: 'OUT',
              quantity: item.quantity,
              reason: 'Order sale',
              reference: order.id
            }
          });

        } else if (item.type === 'package') {
          // Handle package order item
          const packagePriceId = parseInt(item.id);
          
          const orderItem = await tx.orderItem.create({
            data: {
              orderId: order.id,
              itemType: 'PACKAGE',
              packagePriceId: packagePriceId,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
              packageMetadata: {
                sessions: item.sessions,
                duration: item.duration,
                packageType: item.packageType,
                maxGroupSize: item.maxGroupSize
              }
            }
          });
          orderItems.push(orderItem);

          // Create UserPackage for each package item
          for (let i = 0; i < item.quantity; i++) {
            const userPackage = await tx.userPackage.create({
              data: {
                userId: customer.id,
                orderItemId: orderItem.id,
                packagePriceId: packagePriceId,
                quantity: 1,
                sessionsUsed: 0,
                isActive: true,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
              }
            });
            userPackages.push(userPackage);
          }
        }
      }

      return {
        order,
        orderItems,
        userPackages
      };
    });

    return NextResponse.json({
      success: true,
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      status: result.order.status,
      totalAmount: result.order.total,
      currency: result.order.currency,
      items: orderData.items,
      userPackages: result.userPackages
    });

  } catch (error) {
    console.error('Error creating unified order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
