import { NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';

export async function GET() {
  
  try {
    console.log('🔍 Fetching payment methods...');
    
    const paymentMethods = await withConnection(async () => {
      return await prisma.paymentMethodConfig.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        icon: true,
        requiresConfirmation: true,
        autoAssignPackage: true,
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    });

    console.log('✅ Payment methods found:', paymentMethods.length);

    return NextResponse.json({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('❌ Error fetching payment methods:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to fetch payment methods',
        details: message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
