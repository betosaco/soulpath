import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CartItem } from '@/lib/cart-context';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/send-order-confirmation-email';
import { sendBookingConfirmationEmail } from '@/lib/send-booking-confirmation-email';
import { createTelegramOrderService, OrderDetails } from '@/lib/services/telegram-order-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

interface OrderRequest {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    language: string;
    billingDocumentType?: string;
    dni?: string;
    ruc?: string;
    companyName?: string;
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
  scheduleDetails?: {
    selectedDate?: string;
    selectedTime?: string;
    teacher?: string;
    serviceType?: string;
    venue?: string;
    dayOfWeek?: string;
    scheduleSlotId?: number;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('Order creation API called');
    const orderData: OrderRequest = await request.json();
    console.log('Order data received:', JSON.stringify(orderData, null, 2));
    
    // Validate that we have the required environment variables
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Database configuration error' },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!orderData.customerInfo || !orderData.items || orderData.items.length === 0) {
      console.log('Validation failed: Missing required order data');
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Validate customer info fields
    if (!orderData.customerInfo.name || !orderData.customerInfo.email || !orderData.customerInfo.phone) {
      console.log('Validation failed: Missing required customer info');
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
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

    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (connectionError) {
      console.error('Database connection failed:', connectionError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: connectionError instanceof Error ? connectionError.message : 'Unknown connection error'
        },
        { status: 500 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Start transaction
    console.log('Starting database transaction...');
    let result;
    try {
      result = await prisma.$transaction(async (tx) => {
      console.log('Transaction started, creating customer...');
      // Create or find customer
      let customer = await tx.user.findFirst({
        where: { email: orderData.customerInfo.email }
      });

      if (!customer) {
        customer = await tx.user.create({
          data: {
            email: orderData.customerInfo.email,
            fullName: orderData.customerInfo.name,
            phone: orderData.customerInfo.countryCode
              ? `${orderData.customerInfo.countryCode} ${orderData.customerInfo.phone}`
              : orderData.customerInfo.phone,
            role: 'USER',
            status: 'ACTIVE'
          }
        });
      }

      // Calculate totals - orderData.totalAmount includes IGV, so we need to separate it
      const totalWithIGV = orderData.totalAmount;
      const subtotal = totalWithIGV / 1.18; // Base price before IGV
      const tax = totalWithIGV - subtotal; // IGV amount
      const shipping = 0; // Free shipping for now
      const total = subtotal + tax + shipping;

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          customerName: orderData.customerInfo.name,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.countryCode
            ? `${orderData.customerInfo.countryCode} ${orderData.customerInfo.phone}`
            : orderData.customerInfo.phone,
          // Billing document fields
          billingDocumentType: orderData.customerInfo.billingDocumentType || 'boleta_simple',
          dni: orderData.customerInfo.dni || null,
          ruc: orderData.customerInfo.ruc || null,
          companyName: orderData.customerInfo.companyName || null,
          status: 'PENDING',
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
          billingAddress: orderData.shippingAddress ? {
            address: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            zipCode: orderData.shippingAddress.zipCode,
            country: orderData.shippingAddress.country
          } : undefined
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
            },
            include: {
              product: true
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
          console.log('Processing package item:', {
            id: item.id,
            name: item.name,
            type: item.type,
            idType: typeof item.id
          });

          let packagePriceId = parseInt(item.id);

          // If parsing fails, try to find the package by name or other criteria
          if (isNaN(packagePriceId) || packagePriceId <= 0) {
            console.log('Failed to parse packagePriceId, attempting to find package by name...');

            // Try to find the package price by package name and price
            const packagePrice = await tx.packagePrice.findFirst({
              where: {
                packageDefinition: {
                  name: item.name
                },
                price: item.price,
                isActive: true
              }
            });

            if (!packagePrice) {
              throw new Error(`Could not find package "${item.name}" with price ${item.price}. Original ID: ${item.id}`);
            }

            packagePriceId = packagePrice.id;
            console.log('Found packagePriceId by name lookup:', packagePriceId);
          }

          console.log('Using packagePriceId:', packagePriceId);

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
            },
            include: {
              packagePrice: {
                include: {
                  packageDefinition: {
                    include: {
                      sessionDuration: true
                    }
                  }
                }
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

      console.log('Transaction completed successfully');
      return {
        order,
        orderItems,
        userPackages
      };
      });
      
      console.log('Database transaction completed, order created:', result.order.id);
    } catch (transactionError) {
      console.error('Database transaction failed:', transactionError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database transaction failed',
          details: transactionError instanceof Error ? transactionError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }

    // Validate that we have a valid result
    if (!result || !result.order) {
      console.error('Invalid result from database transaction:', result);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid result from database transaction',
          details: 'Order creation failed - no order returned'
        },
        { status: 500 }
      );
    }

    // Get order items with proper relations
    const orderItemsWithRelations = await prisma.orderItem.findMany({
      where: { orderId: result.order.id },
      include: {
        product: true,
        packagePrice: {
          include: {
            packageDefinition: {
              include: {
                sessionDuration: true
              }
            }
          }
        }
      }
    });

    // Get schedule details from the request (now supports multiple bookings)
    let scheduleDetails = orderData.scheduleDetails || null;
    
    // If schedule details are provided and there's a package, create bookings
    let bookingResults = [];
    if (scheduleDetails && Array.isArray(scheduleDetails) && scheduleDetails.length > 0 && result.userPackages.length > 0) {
      try {
        // Find the first available user package for booking
        const userPackage = result.userPackages[0];
        
        // Create multiple bookings for each schedule detail
        for (const scheduleDetail of scheduleDetails) {
          if (scheduleDetail.scheduleSlotId) {
            // Create the booking
            const booking = await prisma.booking.create({
              data: {
                userId: result.order.customerId!,
                userPackageId: userPackage.id,
                scheduleSlotId: scheduleDetail.scheduleSlotId,
                sessionType: scheduleDetail.serviceType || 'Yoga Class',
                notes: orderData.notes || '',
                status: 'confirmed'
              },
              include: {
                scheduleSlot: {
                  include: {
                    scheduleTemplate: {
                      include: {
                        sessionDuration: true,
                        venue: true
                      }
                    }
                  }
                },
                userPackage: {
                  include: {
                    packagePrice: {
                      include: {
                        packageDefinition: {
                    include: {
                      sessionDuration: true
                    }
                  }
                      }
                    }
                  }
                },
                teacher: true,
                venue: true
              }
            });
            
            // Update schedule slot booked count
            await prisma.scheduleSlot.update({
              where: { id: scheduleDetail.scheduleSlotId },
              data: { bookedCount: { increment: 1 } }
            });
            
            // Get the booking with proper relations
            const bookingWithRelations = await prisma.booking.findUnique({
              where: { id: booking.id },
              include: {
                scheduleSlot: {
                  include: {
                    scheduleTemplate: {
                      include: {
                        sessionDuration: true,
                        venue: true
                      }
                    }
                  }
                },
                userPackage: {
                  include: {
                    packagePrice: {
                      include: {
                        packageDefinition: {
                    include: {
                      sessionDuration: true
                    }
                  }
                      }
                    }
                  }
                },
                teacher: true,
                venue: true
              }
            });
            
            bookingResults.push(bookingWithRelations);
            console.log('✅ Booking created successfully:', booking.id);
          }
        }
        
        // Update user package sessions used (total number of bookings)
        await prisma.userPackage.update({
          where: { id: userPackage.id },
          data: { sessionsUsed: { increment: bookingResults.length } }
        });
        
        console.log(`✅ Created ${bookingResults.length} bookings successfully`);
      } catch (bookingError) {
        console.error('Error creating bookings:', bookingError);
        // Don't fail the order creation if booking fails
      }
    }

    // Send order confirmation email and Telegram notification
    try {
      const orderUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order-confirmation?orderId=${result.order.id}`;

      // Format order items for email and Telegram
      const emailOrderItems = orderItemsWithRelations.map(item => {
        if (item.itemType === 'PRODUCT' && item.product) {
          return {
            name: item.product.name,
            description: item.product.description || undefined,
            type_text: 'Producto',
            quantity: item.quantity,
            unit_price: Number(item.price),
            total_price: Number(item.price) * item.quantity
          };
        } else if (item.itemType === 'PACKAGE' && item.packagePrice) {
          return {
            name: item.packagePrice.packageDefinition.name,
            description: item.packagePrice.packageDefinition.description || undefined,
            type_text: 'Paquete de Yoga',
            quantity: item.quantity,
            unit_price: Number(item.price),
            total_price: Number(item.price) * item.quantity,
            sessions: item.packagePrice.packageDefinition.sessionsCount,
            duration_minutes: item.packagePrice.packageDefinition.sessionDuration?.duration_minutes
          };
        }
        return null;
      }).filter(Boolean);

      // Format order items for Telegram
      const telegramOrderItems = orderItemsWithRelations.map(item => {
        if (item.itemType === 'PRODUCT' && item.product) {
          return {
            name: item.product.name,
            description: item.product.description || undefined,
            type: 'PRODUCT' as const,
            quantity: item.quantity,
            price: Number(item.price),
            total: Number(item.price) * item.quantity
          };
        } else if (item.itemType === 'PACKAGE' && item.packagePrice) {
          return {
            name: item.packagePrice.packageDefinition.name,
            description: item.packagePrice.packageDefinition.description || undefined,
            type: 'PACKAGE' as const,
            quantity: item.quantity,
            price: Number(item.price),
            total: Number(item.price) * item.quantity,
            sessions: item.packagePrice.packageDefinition.sessionsCount,
            duration: item.packagePrice.packageDefinition.sessionDuration?.duration_minutes
          };
        }
        return null;
      }).filter((item): item is NonNullable<typeof item> => item !== null);

      // Get package booking details from the order items
      let packageBookingDetails = null;
      const packageItem = orderItemsWithRelations.find(item => item.itemType === 'PACKAGE' && item.packagePrice);
      if (packageItem && packageItem.packagePrice) {
        packageBookingDetails = {
          packageName: packageItem.packagePrice.packageDefinition.name,
          packageDescription: packageItem.packagePrice.packageDefinition.description || undefined,
          sessionsCount: packageItem.packagePrice.packageDefinition.sessionsCount,
          durationMinutes: packageItem.packagePrice.packageDefinition.sessionDuration?.duration_minutes,
          packageType: packageItem.packagePrice.packageDefinition.packageType
        };
      }

      // Prepare enhanced schedule details if bookings were created
      let enhancedScheduleDetails = scheduleDetails;
      if (bookingResults && bookingResults.length > 0) {
        // Use the first booking for the main schedule details in email
        const firstBooking = bookingResults[0];
        if (firstBooking) {
          enhancedScheduleDetails = [{
            selectedDate: firstBooking.scheduleSlot?.startTime ? firstBooking.scheduleSlot.startTime.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : scheduleDetails?.[0]?.selectedDate,
            selectedTime: firstBooking.scheduleSlot?.startTime ? firstBooking.scheduleSlot.startTime.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            }) : scheduleDetails?.[0]?.selectedTime,
            teacher: firstBooking.teacher?.name || scheduleDetails?.[0]?.teacher,
            serviceType: firstBooking.sessionType || scheduleDetails?.[0]?.serviceType,
            venue: firstBooking.venue?.name || scheduleDetails?.[0]?.venue,
            dayOfWeek: firstBooking.scheduleSlot?.scheduleTemplate?.dayOfWeek || scheduleDetails?.[0]?.dayOfWeek
          }];
        }
      }

      const emailData = {
        customerName: result.order.customerName,
        customerEmail: result.order.customerEmail,
        customerPhone: result.order.customerPhone,
        orderNumber: result.order.orderNumber,
        orderId: result.order.id,
        orderDate: result.order.createdAt.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        orderStatus: result.order.status.toLowerCase(),
        orderStatusText: result.order.status === 'CONFIRMED' ? 'Confirmado' : result.order.status,
        paymentStatus: result.order.paymentStatus.toLowerCase(),
        paymentStatusText: result.order.paymentStatus === 'COMPLETED' ? 'Completado' : 
                          result.order.paymentStatus === 'PENDING' ? 'Pendiente' : result.order.paymentStatus,
        billingDocumentType: result.order.billingDocumentType || 'boleta_simple',
        dni: result.order.dni || undefined,
        ruc: result.order.ruc || undefined,
        companyName: result.order.companyName || undefined,
        orderItems: emailOrderItems.filter(item => item !== null),
        subtotal: Number(result.order.subtotal),
        tax_amount: Number(result.order.taxAmount),
        shipping_amount: Number(result.order.shippingAmount),
        total_amount: Number(result.order.total),
        currency: result.order.currency,
        notes: result.order.notes || undefined,
        shipping_address: result.order.shippingAddress as any,
        scheduleDetails: enhancedScheduleDetails?.[0] || undefined,
        packageBookingDetails: packageBookingDetails || undefined,
        order_url: orderUrl
      };

      // Send email asynchronously (don't wait for it to complete)
      sendOrderConfirmationEmail(emailData).catch(error => {
        console.error('Failed to send order confirmation email:', error);
        // Don't fail the order creation if email fails
      });

      // If bookings were created, also send booking confirmation emails
      if (bookingResults && bookingResults.length > 0) {
        try {
          // Send booking confirmation email for each booking
          for (const bookingResult of bookingResults) {
            if (!bookingResult) continue;
            
            const bookingEmailData = {
              customerName: result.order.customerName,
              customerEmail: result.order.customerEmail,
              bookingId: bookingResult.id?.toString() || '',
              bookingDate: bookingResult.scheduleSlot?.startTime ? bookingResult.scheduleSlot.startTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : '',
              bookingTime: bookingResult.scheduleSlot?.startTime ? bookingResult.scheduleSlot.startTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              }) : '',
              sessionType: bookingResult.sessionType || '',
              instructor: bookingResult.teacher?.name || 'Por asignar',
              venue: bookingResult.venue?.name || 'MatMax Yoga Studio',
              duration: bookingResult.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 60,
              packageName: bookingResult.userPackage?.packagePrice?.packageDefinition?.name || 'Paquete de Yoga',
              packageDescription: bookingResult.userPackage?.packagePrice?.packageDefinition?.description || '',
              sessionsUsed: bookingResult.userPackage?.sessionsUsed || 0,
              sessionsRemaining: (bookingResult.userPackage?.packagePrice?.packageDefinition?.sessionsCount || 0) - (bookingResult.userPackage?.sessionsUsed || 0),
              packageType: bookingResult.userPackage?.packagePrice?.packageDefinition?.packageType || 'INDIVIDUAL',
              bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/bookings`,
              language: orderData.customerInfo.language || 'es'
            };

            // Send booking confirmation email asynchronously
            sendBookingConfirmationEmail(bookingEmailData).catch(error => {
              console.error('Failed to send booking confirmation email:', error);
              // Don't fail the order creation if email fails
            });
          }
        } catch (bookingEmailError) {
          console.error('Error preparing booking confirmation emails:', bookingEmailError);
          // Don't fail the order creation if email preparation fails
        }
      }

      // Send Telegram order confirmation notification to business account (info@matmax.store)
      try {
        console.log('📱 Starting Telegram notification process for order:', result.order.id);

        // Always send notifications to info@matmax.store for ALL orders
        const businessUser = await prisma.$queryRaw`
          SELECT id FROM users WHERE email = 'info@matmax.store' LIMIT 1
        ` as any[];

        console.log('🏢 Business user lookup result:', businessUser.length > 0 ? 'Found' : 'Not found');

        if (businessUser.length > 0) {
          const telegramUsers = await prisma.$queryRaw`
            SELECT * FROM telegram_users
            WHERE user_id = ${businessUser[0].id}
            AND is_active = true
            LIMIT 1
          ` as any[];

          console.log('📱 Telegram user lookup result:', telegramUsers.length > 0 ? 'Found' : 'Not found');

          const telegramUser = telegramUsers[0];

          if (telegramUser) {
            console.log('📱 Sending Telegram order confirmation to business account (info@matmax.store):', telegramUser.telegramChatId);

          // Prepare order details for Telegram (matching email format)
          const telegramOrderDetails: OrderDetails = {
            orderId: result.order.id,
            orderNumber: result.order.orderNumber,
            customerName: result.order.customerName,
            customerEmail: result.order.customerEmail,
            customerPhone: result.order.customerPhone,
            orderDate: result.order.createdAt.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            orderStatus: result.order.status.toLowerCase(),
            orderStatusText: result.order.status === 'CONFIRMED' ? 'Confirmado' : result.order.status,
            paymentStatus: result.order.paymentStatus.toLowerCase(),
            paymentStatusText: result.order.paymentStatus === 'COMPLETED' ? 'Completado' :
                              result.order.paymentStatus === 'PENDING' ? 'Pendiente' : result.order.paymentStatus,
            billingDocumentType: result.order.billingDocumentType || 'boleta_simple',
            dni: result.order.dni || undefined,
            ruc: result.order.ruc || undefined,
            companyName: result.order.companyName || undefined,
            items: emailOrderItems, // Use the same formatted items as email
            subtotal: Number(result.order.subtotal),
            taxAmount: Number(result.order.taxAmount),
            shippingAmount: Number(result.order.shippingAmount),
            total: Number(result.order.total),
            currency: result.order.currency,
            notes: result.order.notes || undefined,
            shippingAddress: result.order.shippingAddress ? {
              address: result.order.shippingAddress.address,
              city: result.order.shippingAddress.city,
              state: result.order.shippingAddress.state,
              zipCode: result.order.shippingAddress.zipCode,
              country: result.order.shippingAddress.country
            } : undefined,
            scheduleDetails: enhancedScheduleDetails?.map(schedule => ({
              selectedDate: schedule.selectedDate,
              selectedTime: schedule.selectedTime,
              teacher: schedule.teacher,
              serviceType: schedule.serviceType,
              venue: schedule.venue
            })),
            packageBookingDetails: packageBookingDetails || undefined
          };

          // Send Telegram notification to MatMax Bot Service
          console.log('📡 Calling bot service with chat ID:', telegramUser.telegramChatId);
          const telegramResponse = await fetch('https://telemax-1kpe0zyxd-matmaxworlds-projects.vercel.app/api/orders/send-notification', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderDetails: telegramOrderDetails,
              telegramChatId: telegramUser.telegramChatId
            }),
          });

          console.log('📡 Bot service response status:', telegramResponse.status);
          if (telegramResponse.ok) {
            console.log('✅ Telegram order confirmation sent successfully');
          } else {
            console.error('❌ Failed to send Telegram order confirmation to business account, status:', telegramResponse.status);
            const errorText = await telegramResponse.text();
            console.error('❌ Bot service error:', errorText);
          }
        } else {
          console.log('⚠️ Business account (info@matmax.store) does not have Telegram linked');
        }
      } else {
        console.log('⚠️ Business account (info@matmax.store) not found');
      }
      } catch (telegramError) {
        console.error('Error sending Telegram order notification:', telegramError);
        // Don't fail the order creation if Telegram notification fails
      }

    } catch (emailError) {
      console.error('Error preparing order confirmation email:', emailError);
      // Don't fail the order creation if email preparation fails
    }

    const successResponse = {
      success: true,
      orderId: result.order.id,
      orderNumber: result.order.orderNumber,
      status: result.order.status,
      totalAmount: result.order.total,
      currency: result.order.currency,
      items: orderData.items,
      userPackages: result.userPackages,
      bookings: bookingResults.filter((booking): booking is NonNullable<typeof booking> => booking !== null).map(booking => ({
        id: booking.id,
        sessionType: booking.sessionType,
        status: booking.status,
        scheduleSlot: {
          startTime: booking.scheduleSlot?.startTime,
          endTime: booking.scheduleSlot?.endTime,
          teacher: booking.teacher?.name,
          venue: booking.venue?.name
        }
      }))
    };
    
    console.log('Order created successfully, returning response:', successResponse);
    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Error creating unified order:', error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code);
      console.error('Prisma error meta:', (error as any).meta);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
