import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { purchaseUpdateSchema } from '@/lib/validations';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { id } = params;
    const purchaseId = parseInt(id);

    if (isNaN(purchaseId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Purchase ID must be a number'
      }, { status: 400 });
    }

    const body = await request.json();
    const validation = updatePurchaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid purchase update data',
        details: validation.error.issues
      }, { status: 400 });
    }

    const updateData = validation.data;

    // Check if purchase exists
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { paymentRecords: true }
    });

    if (!existingPurchase) {
      return NextResponse.json({
        success: false,
        error: 'Purchase not found',
        message: 'Purchase with this ID does not exist'
      }, { status: 404 });
    }

    // Update purchase and related payment records in transaction
    await prisma.$transaction(async (tx) => {
      const updatedPurchase = await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          ...updateData,
          confirmedAt: updateData.confirmedAt ? new Date(updateData.confirmedAt) : undefined
        }
      });

      // Update related payment records if payment status changed
      if (updateData.paymentStatus) {
        await tx.paymentRecord.updateMany({
          where: { purchaseId: purchaseId },
          data: {
            paymentStatus: updateData.paymentStatus,
            confirmedAt: updateData.paymentStatus === 'completed' ? new Date() : null
          }
        });
      }

      return updatedPurchase;
    });

    // Fetch complete updated purchase data
    const completePurchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
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
                    sessionsCount: true
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
      message: 'Purchase updated successfully',
      data: completePurchase
    });

  } catch (error) {
    console.error('❌ Error updating purchase:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to update purchase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { id } = params;
    const purchaseId = parseInt(id);

    if (isNaN(purchaseId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid ID',
        message: 'Purchase ID must be a number'
      }, { status: 400 });
    }

    // Check if purchase exists and has no active bookings
    const existingPurchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        userPackages: {
          include: {
            bookings: {
              where: {
                status: { in: ['confirmed', 'pending'] }
              }
            }
          }
        }
      }
    });

    if (!existingPurchase) {
      return NextResponse.json({
        success: false,
        error: 'Purchase not found',
        message: 'Purchase with this ID does not exist'
      }, { status: 404 });
    }

    // Check if there are active bookings
    const hasActiveBookings = existingPurchase.userPackages.some(
      pkg => pkg.bookings.length > 0
    );

    if (hasActiveBookings) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete purchase',
        message: 'Purchase has active bookings and cannot be deleted'
      }, { status: 400 });
    }

    // Delete the purchase (cascading will handle related records)
    await prisma.purchase.delete({
      where: { id: purchaseId }
    });

    return NextResponse.json({
      success: true,
      message: 'Purchase deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting purchase:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete purchase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
