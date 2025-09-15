import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

interface PaymentMethodUpdateData {
  name?: string;
  type?: string;
  description?: string;
  icon?: string;
  requiresConfirmation?: boolean;
  autoAssignPackage?: boolean;
  isActive?: boolean;
  providerConfig?: any;
}

// GET - List all payment methods
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin payment methods API called');
    const user = await requireAuth(request);
    console.log('🔍 Auth result:', user ? 'authenticated' : 'not authenticated');
    if (!user) {
      console.log('❌ User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure Prisma is connected before making queries
    console.log('🔍 Ensuring Prisma connection...');
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Fetch all payment methods using Prisma (same as booking flow)
    console.log('🔍 Fetching payment methods from database...');
    const paymentMethods = await prisma.paymentMethodConfig.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        icon: true,
        requiresConfirmation: true,
        autoAssignPackage: true,
        isActive: true,
        providerConfig: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('✅ Payment methods fetched:', paymentMethods.length, 'items');
    return NextResponse.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('❌ Error in GET /api/admin/payment-methods:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Create new payment method
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create new payment method using Prisma
    const newPaymentMethod = await prisma.paymentMethodConfig.create({
      data: {
        name: body.name,
        type: body.type || 'custom',
        description: body.description || null,
        icon: body.icon || null,
        requiresConfirmation: body.requiresConfirmation !== undefined ? body.requiresConfirmation : false,
        autoAssignPackage: body.autoAssignPackage !== undefined ? body.autoAssignPackage : true,
        isActive: body.isActive !== undefined ? body.isActive : true,
        providerConfig: body.providerConfig || null
      }
    });

    return NextResponse.json({
      success: true,
      data: newPaymentMethod,
      message: 'Payment method created successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/admin/payment-methods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update payment method
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, type, description, icon, requiresConfirmation, autoAssignPackage, isActive, providerConfig } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: PaymentMethodUpdateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (requiresConfirmation !== undefined) updateData.requiresConfirmation = requiresConfirmation;
    if (autoAssignPackage !== undefined) updateData.autoAssignPackage = autoAssignPackage;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (providerConfig !== undefined) updateData.providerConfig = providerConfig;

    const updatedPaymentMethod = await prisma.paymentMethodConfig.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedPaymentMethod,
      message: 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('Error in PUT /api/admin/payment-methods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete payment method
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.paymentMethodConfig.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/payment-methods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}