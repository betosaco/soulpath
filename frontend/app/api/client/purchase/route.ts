import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { createEmailService } from '@/lib/brevo-email-service';

// Zod schema for purchase creation
const createPurchaseSchema = z.object({
  packagePriceId: z.number().int('Invalid package price ID'),
  paymentMethodId: z.number().int('Invalid payment method ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  notes: z.string().optional(),
  paymentToken: z.string().optional() // For Izipay payments
});

export async function GET() {
  // This endpoint requires authentication for all methods
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/client/purchase - Starting request...');
    
    const user = await requireAuth(request);
    if (!user) {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', user.email);

    const body = await request.json();
    const validation = createPurchaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid purchase data',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { packagePriceId, paymentMethodId, quantity, notes, paymentToken } = validation.data;

    // Get package price details with related data
    const packagePrice = await prisma.packagePrice.findUnique({
      where: { id: packagePriceId },
      include: {
        packageDefinition: {
          select: {
            id: true,
            name: true,
            description: true,
            sessionsCount: true,
            isActive: true
          }
        },
        currency: {
          select: {
            id: true,
            code: true,
            symbol: true,
            name: true
          }
        }
      }
    });

    if (!packagePrice) {
      return NextResponse.json({
        success: false,
        error: 'Package not found',
        message: 'The specified package price does not exist'
      }, { status: 404 });
    }

    if (!packagePrice.packageDefinition.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Package inactive',
        message: 'This package is currently not available for purchase'
      }, { status: 400 });
    }

    // Get payment method details with provider config
    const paymentMethod = await prisma.paymentMethodConfig.findUnique({
      where: { id: paymentMethodId },
      select: {
        id: true,
        type: true,
        name: true,
        description: true,
        icon: true,
        isActive: true,
        requiresConfirmation: true,
        autoAssignPackage: true,
        providerConfig: true
      }
    });

    if (!paymentMethod || !paymentMethod.isActive) {
      return NextResponse.json({
        success: false,
        error: 'Payment method not found',
        message: 'The specified payment method is not available'
      }, { status: 404 });
    }

    // Calculate total amount
    const totalAmount = Number(packagePrice.price) * quantity;

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        totalAmount: totalAmount,
        currencyCode: packagePrice.currency.code,
        paymentMethod: paymentMethod.name,
        paymentStatus: 'pending',
        notes: notes
      }
    });

    console.log('✅ Purchase created:', purchase.id);

    // Handle Izipay payment processing
    if (paymentMethod.type === 'izipay' && paymentToken) {
      try {
        const izipayConfig = (paymentMethod.providerConfig as Record<string, unknown>)?.izipayConfig;
        
        if (!izipayConfig || !(izipayConfig as Record<string, unknown>).username || !(izipayConfig as Record<string, unknown>).password) {
          throw new Error('Izipay configuration is incomplete');
        }

        // Create Basic Auth header
        const credentials = Buffer.from(`${(izipayConfig as Record<string, unknown>).username}:${(izipayConfig as Record<string, unknown>).password}`).toString('base64');
        
        // Prepare Izipay API request
        const izipayPayload = {
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: packagePrice.currency.code,
          paymentToken: paymentToken,
          customer: {
            email: user.email,
            name: user.email, // Using email as name for now
          },
          orderId: purchase.id.toString(),
          metadata: {
            packageName: packagePrice.packageDefinition.name,
            quantity: quantity.toString(),
            userId: user.id.toString()
          }
        };

        console.log('🔍 Processing Izipay payment for purchase:', purchase.id);

        // Make API call to Izipay
        const izipayResponse = await fetch('https://api.izipay.pe/api-payment/v4/Charge/CreatePayment', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(izipayPayload)
        });

        const izipayResult = await izipayResponse.json();
        console.log('🔍 Izipay API response:', izipayResult);

        if (izipayResponse.ok && izipayResult.status === 'SUCCESS') {
          // Update purchase status to completed
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: {
              paymentStatus: 'completed',
              transactionId: izipayResult.transactionId || paymentToken,
              purchasedAt: new Date()
            }
          });

          console.log('✅ Izipay payment processed successfully');
        } else {
          // Update purchase status to failed
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: {
              paymentStatus: 'failed',
              notes: `Payment failed: ${izipayResult.errorMessage || 'Unknown error'}`
            }
          });

          throw new Error(izipayResult.errorMessage || 'Payment processing failed');
        }
      } catch (error: any) {
        console.error('❌ Izipay payment error:', error);
        
        // Update purchase status to failed
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            paymentStatus: 'failed',
            notes: `Payment error: ${error.message}`
          }
        });

        return NextResponse.json({
          success: false,
          error: 'Payment failed',
          message: error.message || 'Payment processing failed'
        }, { status: 400 });
      }
    }

    // Create user package if payment method auto-assigns packages
    let userPackage = null;
    if (paymentMethod.autoAssignPackage) {
      userPackage = await prisma.userPackage.create({
        data: {
          userId: user.id,
          purchaseId: purchase.id,
          packagePriceId: packagePriceId,
          quantity: quantity,
          sessionsUsed: 0,
          isActive: true,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        },
        include: {
          packagePrice: {
            include: {
              packageDefinition: true
            }
          }
        }
      });
      console.log('✅ User package created:', userPackage.id);
    }

    // Send confirmation email
    try {
      const emailService = await createEmailService();
      if (emailService) {
        const replacements = {
          client_name: user.email,
          package_name: packagePrice.packageDefinition.name,
          quantity: quantity.toString(),
          total_amount: `${packagePrice.currency.symbol}${totalAmount.toFixed(2)}`,
          payment_method: paymentMethod.name,
          purchase_date: new Date().toLocaleDateString(),
          sessions_count: packagePrice.packageDefinition.sessionsCount.toString()
        };

        await emailService.sendTemplateEmail(
          user.email,
          'purchase_confirmation',
          'Purchase Confirmation - SoulPath',
          replacements
        );
        console.log('✅ Purchase confirmation email sent');
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError);
      // Don't fail the purchase if email fails
    }

    return NextResponse.json({
      success: true,
      data: {
        purchase: {
          id: purchase.id,
          totalAmount: purchase.totalAmount,
          currencyCode: purchase.currencyCode,
          paymentMethod: purchase.paymentMethod,
          paymentStatus: purchase.paymentStatus,
          notes: purchase.notes,
          purchasedAt: purchase.purchasedAt,
          package: {
            name: packagePrice.packageDefinition.name,
            description: packagePrice.packageDefinition.description,
            sessionsCount: packagePrice.packageDefinition.sessionsCount
          },
          paymentMethodDetails: {
            name: paymentMethod.name,
            type: paymentMethod.type
          },
          currency: {
            symbol: packagePrice.currency.symbol,
            code: packagePrice.currency.code
          }
        },
        userPackage: userPackage ? {
          id: userPackage.id,
          sessionsUsed: userPackage.sessionsUsed,
          isActive: userPackage.isActive,
          quantity: userPackage.quantity
        } : null
      },
      message: 'Purchase created successfully'
    });

  } catch (error) {
    console.error('❌ Error in POST /api/client/purchase:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to process purchase'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
