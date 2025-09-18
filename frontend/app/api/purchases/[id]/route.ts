// app/api/purchases/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const purchaseId = parseInt(params.id);
    
    if (isNaN(purchaseId)) {
      return NextResponse.json(
        { error: 'Invalid purchase ID' },
        { status: 400 }
      );
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        paymentRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
