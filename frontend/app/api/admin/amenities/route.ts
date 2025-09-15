import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/amenities - List all amenities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category');

    const where: Prisma.AmenityWhereInput = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    if (category) {
      where.category = category;
    }

    const amenities = await prisma.amenity.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      amenities
    });

  } catch (error) {
    console.error('Error fetching amenities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities' },
      { status: 500 }
    );
  }
}

// POST /api/admin/amenities - Create new amenity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, category, isActive = true, displayOrder = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const amenity = await prisma.amenity.create({
      data: {
        name,
        description,
        icon,
        category,
        isActive,
        displayOrder
      }
    });

    return NextResponse.json({
      success: true,
      amenity
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating amenity:', error);
    return NextResponse.json(
      { error: 'Failed to create amenity' },
      { status: 500 }
    );
  }
}
