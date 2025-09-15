import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { 
  purchaseCreateSchema,
  commonQuerySchema 
} from '@/lib/validations';

const querySchema = commonQuerySchema.extend({
  userId: z.string().cuid().optional(),
  paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']).optional(),
  paymentMethod: z.string().optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  enhanced: z.enum(['true', 'false']).optional()
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/purchases - Starting request...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('✅ Admin user authenticated:', user.email);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(queryParams);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        details: validation.error.issues
      }, { status: 400 });
    }

    const { userId, paymentStatus, paymentMethod, dateFrom, dateTo, page, limit, enhanced } = validation.data;
    const offset = (page - 1) * limit;

    console.log('🔍 Query parameters:', { userId, paymentStatus, paymentMethod, dateFrom, dateTo, page, limit, enhanced });

    // Build the query with proper relationships
    const where: Record<string, unknown> = {};

    if (userId) where.userId = userId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (dateFrom) where.purchasedAt = { gte: new Date(`${dateFrom}T00:00:00Z`) };
    if (dateTo) {
      where.purchasedAt = {
        ...(where.purchasedAt || {}),
        lte: new Date(`${dateTo}T23:59:59Z`)
      };
    }

    // Base select fields
    const select: Record<string, unknown> = {
      id: true,
      userId: true,
      totalAmount: true,
      currencyCode: true,
      paymentMethod: true,
      paymentStatus: true,
      transactionId: true,
      notes: true,
      purchasedAt: true,
      confirmedAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          fullName: true,
          phone: true
        }
      }
    };

    // Enhanced mode includes related data
    if (enhanced === 'true') {
      select.userPackages = {
        select: {
          id: true,
          quantity: true,
          sessionsUsed: true,
          isActive: true,
          expiresAt: true,
          packagePrice: {
            select: {
              id: true,
              price: true,
              pricingMode: true,
              packageDefinition: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  sessionsCount: true,
                  packageType: true,
                  sessionDuration: {
                    select: {
                      name: true,
                      duration_minutes: true
                    }
                  }
                }
              }
            }
          }
        }
      };
      select.paymentRecords = {
        select: {
          id: true,
          amount: true,
          paymentStatus: true,
          paymentDate: true,
          confirmedAt: true
        }
      };
    }

    console.log('🔍 Executing database query...');
    
    const [purchases, totalCount] = await Promise.all([
      prisma.purchase.findMany({
        where,
        select,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.purchase.count({ where })
    ]);

    console.log('✅ Database query successful, found', purchases.length, 'purchases');

    const totalPages = Math.ceil(totalCount / limit);

    console.log('✅ Returning', purchases.length, 'purchases to client');
    return NextResponse.json({
      success: true,
      data: purchases,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages
      }
    });

  } catch (error) {
    console.error('❌ Unexpected error in purchases API:', error);
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

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

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

    const { userId, packages, paymentMethod, currencyCode, transactionId, notes } = validation.data;

    // Verify user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: 'The specified user does not exist'
      }, { status: 404 });
    }

    // Get package prices and calculate total
    const packagePriceIds = packages.map(pkg => pkg.packagePriceId);
    const packagePrices = await prisma.packagePrice.findMany({
      where: {
        id: { in: packagePriceIds },
        isActive: true
      },
      include: {
        packageDefinition: {
          select: {
            name: true,
            sessionsCount: true,
            isActive: true
          }
        }
      }
    });

    if (packagePrices.length !== packagePriceIds.length) {
      return NextResponse.json({
        success: false,
        error: 'Invalid package prices',
        message: 'Some package prices were not found or are inactive'
      }, { status: 400 });
    }

    // Check if all package definitions are active
    const inactivePackages = packagePrices.filter(price => !price.packageDefinition.isActive);
    if (inactivePackages.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Inactive packages',
        message: 'Some packages are no longer active'
      }, { status: 400 });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const pkg of packages) {
      const price = packagePrices.find(p => p.id === pkg.packagePriceId);
      if (price) {
        totalAmount += Number(price.price) * pkg.quantity;
      }
    }

    console.log('💰 Creating purchase with total amount:', totalAmount);

    // Create purchase with related records in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the purchase
      const purchase = await tx.purchase.create({
        data: {
          userId,
          totalAmount,
          currencyCode,
          paymentMethod,
          paymentStatus: 'pending',
          transactionId,
          notes
        }
      });

      // Create user packages
      const userPackagePromises = packages.map(pkg => {
        return tx.userPackage.create({
          data: {
            userId,
            purchaseId: purchase.id,
            packagePriceId: pkg.packagePriceId,
            quantity: pkg.quantity,
            sessionsUsed: 0,
            isActive: true,
            // Set expiry date if needed (e.g., 1 year from now)
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        });
      });

      const userPackages = await Promise.all(userPackagePromises);

      // Create payment record
      const paymentRecord = await tx.paymentRecord.create({
        data: {
          userId,
          purchaseId: purchase.id,
          amount: totalAmount,
          currencyCode,
          paymentMethod,
          paymentStatus: 'pending',
          transactionId
        }
      });

      return { purchase, userPackages, paymentRecord };
    });

    // Fetch the complete purchase data to return
    const completePurchase = await prisma.purchase.findUnique({
      where: { id: result.purchase.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true
          }
        },
        userPackages: {
          include: {
            packagePrice: {
              include: {
                packageDefinition: {
                  select: {
                    name: true,
                    sessionsCount: true,
                    sessionDuration: {
                      select: {
                        name: true,
                        duration_minutes: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        paymentRecords: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Purchase created successfully',
      data: completePurchase
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating purchase:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to create purchase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

