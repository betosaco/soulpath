import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CartItem } from '@/store/appStore';
import Stripe from 'stripe';
import { sendOrderConfirmationEmail } from '@/lib/send-order-confirmation-email';
import { sendBookingConfirmationEmail } from '@/lib/send-booking-confirmation-email';
import { OrderDetails } from '@/lib/services/telegram-order-service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

interface GroupMember {
  id: string;
  packageId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  question?: string;
}

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
  paymentMethod?: string;
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
  groupMembers?: GroupMember[];
  isGroupBooking?: boolean;
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
      console.log('Customer info:', orderData.customerInfo);
      console.log('Items:', orderData.items);
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Validate customer info fields
    if (!orderData.customerInfo.name || !orderData.customerInfo.email || !orderData.customerInfo.phone) {
      console.log('Validation failed: Missing required customer info');
      console.log('Customer name:', orderData.customerInfo.name);
      console.log('Customer email:', orderData.customerInfo.email);
      console.log('Customer phone:', orderData.customerInfo.phone);
      return NextResponse.json(
        { success: false, error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Validate group booking data if present
    if (orderData.isGroupBooking && orderData.groupMembers) {
      console.log('Validating group booking data:', {
        isGroupBooking: orderData.isGroupBooking,
        groupMembersCount: orderData.groupMembers.length,
        groupMembers: orderData.groupMembers.map(m => ({
          firstName: m.firstName,
          lastName: m.lastName,
          email: m.email,
          phone: m.phone,
          packageId: m.packageId
        }))
      });

      // Validate each group member
      for (let i = 0; i < orderData.groupMembers.length; i++) {
        const member = orderData.groupMembers[i];
        if (!member.firstName || !member.lastName || !member.email || !member.phone || !member.packageId) {
          console.log(`Validation failed: Missing required group member data for member ${i}:`, member);
          return NextResponse.json(
            { success: false, error: `Missing required information for group member ${i + 1}` },
            { status: 400 }
          );
        }
      }
    }

    // Verify payment intent if provided (only for Stripe payments)
    let paymentIntent: Stripe.PaymentIntent | undefined;
    if (orderData.paymentIntentId && orderData.paymentMethod !== 'pay_later') {
      try {
        console.log('Verifying payment intent:', orderData.paymentIntentId);
        paymentIntent = await stripe.paymentIntents.retrieve(orderData.paymentIntentId);
        console.log('Payment intent status:', paymentIntent.status);
        
        if (paymentIntent.status !== 'succeeded') {
          console.warn('Payment intent not succeeded, status:', paymentIntent.status);
          // Don't fail the order creation if payment is processing
          if (paymentIntent.status === 'processing' || paymentIntent.status === 'requires_capture') {
            console.log('Payment is processing, allowing order creation');
          } else {
            return NextResponse.json(
              { success: false, error: `Payment not completed. Status: ${paymentIntent.status}` },
              { status: 400 }
            );
          }
        }
      } catch (error) {
        console.error('Error verifying payment intent:', error);
        // Don't fail order creation if we can't verify payment intent
        // This could happen due to network issues or temporary Stripe API problems
        console.warn('Payment intent verification failed, but continuing with order creation');
        console.warn('Error details:', error instanceof Error ? error.message : 'Unknown error');
      }
    } else if (orderData.paymentMethod === 'pay_later') {
      console.log('Pay-later payment method detected, skipping payment intent verification');
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

    // Generate unique order number (optimized for speed and uniqueness)
    const generateOrderNumber = async (): Promise<string> => {
      // Use high-resolution timestamp + process ID + random string for guaranteed uniqueness
      const timestamp = Date.now();
      const processId = process.pid || Math.floor(Math.random() * 10000);
      const randomPart = Math.random().toString(36).substr(2, 9).toUpperCase();
      const microtime = process.hrtime.bigint().toString().slice(-6); // Last 6 digits of high-res time
      
      const orderNumber = `ORD-${timestamp}-${processId}-${microtime}-${randomPart}`;
      
      // Double-check for uniqueness (should be extremely rare with this approach)
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber },
        select: { id: true } // Only select id for faster query
      });
      
      if (existingOrder) {
        // If collision (virtually impossible), add extra random suffix
        const extraRandom = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `ORD-${timestamp}-${processId}-${microtime}-${randomPart}-${extraRandom}`;
      }

      return orderNumber;
    };

    const orderNumber = await generateOrderNumber();

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
          paymentStatus: orderData.paymentMethod === 'pay_later' ? 'PENDING' : 
                        (paymentIntent && paymentIntent.status === 'succeeded' ? 'COMPLETED' : 'PENDING'),
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

          const packagePriceId = parseInt(item.id);

          // Validate package exists and is active
          if (isNaN(packagePriceId) || packagePriceId <= 0) {
            throw new Error(`Invalid package ID: ${item.id}. Package ID must be a valid integer.`);
          }

          // Verify package exists and is active (single query)
          const packageExists = await tx.packagePrice.findFirst({
            where: {
              id: packagePriceId,
              isActive: true
            },
            select: { id: true }
          });

          if (!packageExists) {
            throw new Error(`Package with ID ${packagePriceId} not found or inactive.`);
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

          // Create UserPackages in batch for better performance
          const userPackageData = Array.from({ length: item.quantity }, () => ({
            userId: customer.id,
            orderItemId: orderItem.id,
            packagePriceId: packagePriceId,
            quantity: 1,
            sessionsUsed: 0,
            isActive: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }));
          
          const _createdUserPackages = await tx.userPackage.createMany({
            data: userPackageData
          });
          
          // Get the created user packages for further processing
          const newUserPackages = await tx.userPackage.findMany({
            where: {
              orderItemId: orderItem.id,
              userId: customer.id
            }
          });
          
          userPackages.push(...newUserPackages);
        }
      }

      // Handle group members for group bookings
      if (orderData.isGroupBooking && orderData.groupMembers && orderData.groupMembers.length > 0) {
        console.log('Processing group members:', orderData.groupMembers.length);
        
        for (const groupMember of orderData.groupMembers) {
          // Create or find group member user
          let groupMemberUser = await tx.user.findFirst({
            where: { email: groupMember.email }
          });

          if (!groupMemberUser) {
            groupMemberUser = await tx.user.create({
              data: {
                email: groupMember.email,
                fullName: `${groupMember.firstName} ${groupMember.lastName}`,
                phone: groupMember.countryCode 
                  ? `${groupMember.countryCode} ${groupMember.phone}`
                  : groupMember.phone,
                role: 'USER',
                status: 'ACTIVE'
              }
            });
          }

          // Find the corresponding package for this group member
          const packageItem = orderData.items.find(item => item.id === groupMember.packageId);
          if (packageItem && packageItem.type === 'package') {
            // Find the user package for this group member
            const groupMemberUserPackage = userPackages.find(up => 
              up.packagePriceId === parseInt(packageItem.id)
            );

            if (groupMemberUserPackage) {
              // Update the user package to belong to the group member
              await tx.userPackage.update({
                where: { id: groupMemberUserPackage.id },
                data: { userId: groupMemberUser.id }
              });
            }
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

    // Get order items with minimal relations for better performance
    const orderItemsWithRelations = await prisma.orderItem.findMany({
      where: { orderId: result.order.id },
      select: {
        id: true,
        itemType: true,
        quantity: true,
        price: true,
        total: true,
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            sku: true
          }
        },
        packagePrice: {
          select: {
            id: true,
            price: true,
              packageDefinition: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  sessionsCount: true,
                  packageType: true,
                  sessionDuration: {
                    select: {
                      duration_minutes: true
                    }
                  }
                }
              }
          }
        }
      }
    });

    // Get schedule details from the request (now supports multiple bookings)
    const scheduleDetails = orderData.scheduleDetails || null;
    
    // If schedule details are provided and there's a package, create bookings
    const bookingResults: any[] = [];
    console.log('🔍 Schedule details received:', scheduleDetails);
    console.log('🔍 User packages created:', result.userPackages.length);
    
    if (scheduleDetails && Array.isArray(scheduleDetails) && scheduleDetails.length > 0 && result.userPackages.length > 0) {
      try {
        // Find the first available user package for booking
        const userPackage = result.userPackages[0];
        console.log('🔍 Using user package for bookings:', userPackage.id);
        
        // Prepare booking data for batch creation
        const bookingData = await Promise.all(
          scheduleDetails
            .filter(scheduleDetail => {
              console.log('🔍 Filtering schedule detail:', scheduleDetail);
              const hasSlotId = !!scheduleDetail.scheduleSlotId;
              console.log('🔍 Has scheduleSlotId:', hasSlotId);
              return hasSlotId;
            })
            .map(async (scheduleDetail) => {
              // Get teacher information from the teacher schedule slot
              const teacherScheduleSlot = await prisma.teacherScheduleSlot.findUnique({
                where: { id: scheduleDetail.scheduleSlotId },
                include: {
                  teacherSchedule: {
                    include: {
                      teacher: true
                    }
                  }
                }
              });

              const teacherId = teacherScheduleSlot?.teacherSchedule?.teacher?.id;

              const bookingDataItem = {
                userId: result.order.customerId!,
                userPackageId: userPackage.id,
                teacherScheduleSlotId: scheduleDetail.scheduleSlotId,
                teacherId: teacherId,
                sessionType: scheduleDetail.serviceType || 'Yoga Class',
                notes: orderData.notes || '',
                status: 'confirmed'
              };
              console.log('🔍 Created booking data item:', bookingDataItem);
              return bookingDataItem;
            })
        );
        
        // Create all bookings in a single batch operation
        if (bookingData.length > 0) {
          const _createdBookings = await prisma.booking.createMany({
            data: bookingData
          });
          
          // Update teacher schedule slots booked count in batch
          const teacherScheduleSlotIds = bookingData.map(b => b.teacherScheduleSlotId).filter(id => id !== null) as number[];
          await prisma.teacherScheduleSlot.updateMany({
            where: { id: { in: teacherScheduleSlotIds } },
            data: { bookedCount: { increment: 1 } }
          });
          
          // Get the created bookings with minimal relations for response
          const bookingsWithRelations = await prisma.booking.findMany({
            where: {
              userPackageId: userPackage.id,
              userId: result.order.customerId!
            },
            include: {
              scheduleSlot: {
                select: {
                  id: true,
                  startTime: true,
                  endTime: true,
                  scheduleTemplate: {
                    select: {
                      sessionDuration: {
                        select: {
                          duration_minutes: true
                        }
                      },
                      venue: {
                        select: {
                          name: true
                        }
                      }
                    }
                  }
                }
              },
              userPackage: {
                select: {
                  id: true,
                  packagePrice: {
                    select: {
                      packageDefinition: {
                        select: {
                          name: true,
                          sessionsCount: true
                        }
                      }
                    }
                  }
                }
              }
            }
          });
          
          bookingResults.push(...bookingsWithRelations);
          
          // Update user package sessions used (total number of bookings)
          await prisma.userPackage.update({
            where: { id: userPackage.id },
            data: { sessionsUsed: { increment: bookingData.length } }
          });
          
          console.log(`✅ Created ${bookingData.length} bookings successfully in batch`);
        }
      } catch (bookingError) {
        console.error('Error creating bookings:', bookingError);
        // Don't fail the order creation if booking fails
      }
    }

    // Prepare success response immediately for faster Pay Later processing
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
          id: booking.scheduleSlot?.id,
          startTime: booking.scheduleSlot?.startTime,
          endTime: booking.scheduleSlot?.endTime,
          duration: booking.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes,
          venue: booking.scheduleSlot?.scheduleTemplate?.venue?.name
        },
        userPackage: {
          id: booking.userPackage?.id,
          packageName: booking.userPackage?.packagePrice?.packageDefinition?.name,
          sessionsCount: booking.userPackage?.packagePrice?.packageDefinition?.sessionsCount
        }
      }))
    };

    // Send Telegram notifications immediately (but don't wait for completion)
    // This ensures notifications are sent before the serverless function terminates
    const sendNotifications = async () => {
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

        // Get package booking details from the order items
        let packageBookingDetails = null;
        const packageItem = orderItemsWithRelations.find(item => item.itemType === 'PACKAGE' && item.packagePrice);
        if (packageItem && packageItem.packagePrice) {
          packageBookingDetails = {
            packageName: packageItem.packagePrice.packageDefinition.name,
            packageDescription: packageItem.packagePrice.packageDefinition.description || '',
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
              teacher: firstBooking.teacher?.fullName || 
                       (firstBooking.teacher?.firstName && firstBooking.teacher?.lastName ? 
                        `${firstBooking.teacher.firstName} ${firstBooking.teacher.lastName}` : 
                        firstBooking.teacher?.name) || 
                       scheduleDetails?.[0]?.teacher || 'Por asignar',
              serviceType: firstBooking.sessionType || scheduleDetails?.[0]?.serviceType,
              venue: firstBooking.scheduleSlot?.scheduleTemplate?.venue?.name || scheduleDetails?.[0]?.venue,
              dayOfWeek: scheduleDetails?.[0]?.dayOfWeek || 'Unknown'
            }];
          }
        }

        const emailData = {
          customerName: result.order.customerName,
          customerEmail: result.order.customerEmail,
          customerPhone: result.order.customerPhone || '',
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
          taxAmount: Number(result.order.taxAmount),
          shippingAmount: Number(result.order.shippingAmount),
          totalAmount: Number(result.order.total),
          currency: result.order.currency,
          notes: result.order.notes || undefined,
          shipping_address: result.order.shippingAddress ? {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            address: (result.order.shippingAddress as any).address || '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            city: (result.order.shippingAddress as any).city || '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            state: (result.order.shippingAddress as any).state || '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            zipCode: (result.order.shippingAddress as any).zipCode || '',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            country: (result.order.shippingAddress as any).country || ''
          } : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          scheduleDetails: (enhancedScheduleDetails || scheduleDetails || undefined) as any,
          packageBookingDetails: packageBookingDetails || undefined,
          order_url: orderUrl,
          // Add group booking information
          is_group_booking: orderData.isGroupBooking || false,
          group_members_count: orderData.groupMembers?.length || 0,
          group_members: orderData.groupMembers?.map(member => ({
            first_name: member.firstName,
            last_name: member.lastName,
            email: member.email,
            phone: member.phone,
            country_code: member.countryCode, // This is the phone prefix like "+51"
            package_name: orderData.items.find(item => item.id === member.packageId)?.name || 'Package',
            birth_date: member.birthDate,
            birth_time: member.birthTime,
            birth_place: member.birthPlace,
            question: member.question
          })) || []
        };

        // Send email asynchronously (don't wait for it to complete)
        sendOrderConfirmationEmail(emailData, 'client').catch(error => {
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
                customerPhone: result.order.customerPhone || orderData.customerInfo.phone || '',
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
                sessionType: bookingResult.sessionType || bookingResult.scheduleSlot?.scheduleTemplate?.serviceType?.name || 'Yoga',
                instructor: bookingResult.scheduleSlot?.scheduleTemplate?.teacher?.fullName || 
                          bookingResult.scheduleSlot?.scheduleTemplate?.teacher?.firstName + ' ' + bookingResult.scheduleSlot?.scheduleTemplate?.teacher?.lastName || 
                          'Por asignar',
                venue: bookingResult.scheduleSlot?.scheduleTemplate?.venue?.name || 'MatMax Yoga Studio',
                duration: bookingResult.scheduleSlot?.scheduleTemplate?.sessionDuration?.duration_minutes || 60,
                packageName: bookingResult.userPackage?.packagePrice?.packageDefinition?.name || 'Paquete de Yoga',
                packageDescription: bookingResult.userPackage?.packagePrice?.packageDefinition?.description || '',
                sessionsUsed: 1, // This booking uses 1 session
                sessionsRemaining: (bookingResult.userPackage?.packagePrice?.packageDefinition?.sessionsCount || 0) - 1,
                packageType: bookingResult.userPackage?.packagePrice?.packageDefinition?.packageType || 'INDIVIDUAL',
                bookingUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/bookings`,
                language: orderData.customerInfo.language || 'es'
              };

              // Send booking confirmation email asynchronously
              sendBookingConfirmationEmail(bookingEmailData, 'client').catch(error => {
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

          // Send notifications to ALL active Telegram users
          const allTelegramUsers = await prisma.telegramUser.findMany({
            where: { isActive: true },
            include: {
              user: {
                select: { email: true, fullName: true }
              }
            }
          });

          console.log('📱 Found active Telegram users:', allTelegramUsers.length);
          allTelegramUsers.forEach(user => {
            console.log(`   - ${user.user?.email || 'Unknown'} (Chat ID: ${user.telegramChatId})`);
          });

          if (allTelegramUsers.length > 0) {
            // Send notification to each active Telegram user
            for (const telegramUser of allTelegramUsers) {
              console.log(`📱 Sending Telegram order confirmation to ${telegramUser.user?.email || 'Unknown'} (Chat ID: ${telegramUser.telegramChatId})`);

              if (telegramUser) {
                try {
                  // Prepare order details for Telegram (matching email format)
                  const telegramOrderDetails: OrderDetails = {
                    orderId: result.order.id,
                    orderNumber: result.order.orderNumber,
                    customerName: result.order.customerName,
                    customerEmail: result.order.customerEmail,
                    customerPhone: result.order.customerPhone || '',
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
                    items: emailOrderItems.filter(item => item !== null), // Use the same formatted items as email
                    subtotal: Number(result.order.subtotal),
                    taxAmount: Number(result.order.taxAmount),
                    shippingAmount: Number(result.order.shippingAmount),
                    total: Number(result.order.total),
                    currency: result.order.currency,
                    notes: result.order.notes || undefined,
                    shippingAddress: result.order.shippingAddress ? {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      address: (result.order.shippingAddress as any).address,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      city: (result.order.shippingAddress as any).city,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      state: (result.order.shippingAddress as any).state,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      zipCode: (result.order.shippingAddress as any).zipCode,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      country: (result.order.shippingAddress as any).country
                    } : undefined,
                    scheduleDetails: enhancedScheduleDetails?.map(schedule => ({
                      selectedDate: schedule.selectedDate,
                      selectedTime: schedule.selectedTime,
                      teacher: schedule.teacher,
                      serviceType: schedule.serviceType,
                      venue: schedule.venue
                    })),
                    packageBookingDetails: packageBookingDetails || undefined,
                    // Add group booking information
                    isGroupBooking: orderData.isGroupBooking || false,
                    groupMembers: orderData.groupMembers?.map(member => ({
                      firstName: member.firstName,
                      lastName: member.lastName,
                      email: member.email,
                      phone: member.phone,
                      countryCode: member.countryCode, // This is the phone prefix like "+51"
                      packageName: orderData.items.find(item => item.id === member.packageId)?.name || 'Package',
                      birthDate: member.birthDate,
                      birthTime: member.birthTime,
                      birthPlace: member.birthPlace,
                      question: member.question
                    })) || []
                  };

                  // Send Telegram notification to MatMax Bot Service
                  console.log('📡 Calling bot service with chat ID:', telegramUser.telegramChatId);
                  console.log('📡 Telegram order details:', JSON.stringify(telegramOrderDetails, null, 2));
                  const telegramResponse = await fetch('https://telemax-p2m6q066b-matmaxworlds-projects.vercel.app/api/orders/send-notification', {
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
                    console.log(`✅ Telegram order confirmation sent successfully to ${telegramUser.user?.email || 'Unknown'}`);
                  } else {
                    console.error(`❌ Failed to send Telegram order confirmation to ${telegramUser.user?.email || 'Unknown'}, status:`, telegramResponse.status);
                    const errorText = await telegramResponse.text();
                    console.error('❌ Bot service error:', errorText);
                  }
                } catch (userError) {
                  console.error(`❌ Error sending notification to ${telegramUser.user?.email || 'Unknown'}:`, userError);
                }
              }
            }
          } else {
            console.log('⚠️ No active Telegram users found');
          }
        } catch (telegramError) {
          console.error('Error sending Telegram order notification:', telegramError);
          // Don't fail the order creation if Telegram notification fails
        }

      } catch (emailError) {
        console.error('Error preparing order confirmation email:', emailError);
        // Don't fail the order creation if email preparation fails
      }
    };

    // Send notifications immediately
    await sendNotifications();

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
      console.error('Prisma error code:', (error as { code?: string }).code);
      console.error('Prisma error meta:', (error as { meta?: unknown }).meta);
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
