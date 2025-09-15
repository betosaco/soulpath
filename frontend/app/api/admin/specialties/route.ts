import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/specialties - List all specialties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (category) {
      where.category = category;
    }

    const specialties = await prisma.specialty.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      specialties
    });

  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialties' },
      { status: 500 }
    );
  }
}

// POST /api/admin/specialties - Create new specialty
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, isActive = true, displayOrder = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const specialty = await prisma.specialty.create({
      data: {
        name,
        description,
        category,
        isActive,
        displayOrder
      }
    });

    return NextResponse.json({
      success: true,
      specialty
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating specialty:', error);
    return NextResponse.json(
      { error: 'Failed to create specialty' },
      { status: 500 }
    );
  }
}
