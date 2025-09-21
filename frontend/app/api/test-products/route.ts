import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🧪 Test products API called');
    
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        status: true,
        stock: true
      }
    });

    console.log('🧪 Found products:', products);

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('🧪 Error in test products API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch test products' },
      { status: 500 }
    );
  }
}
