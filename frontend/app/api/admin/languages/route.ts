import { NextRequest, NextResponse } from 'next/server';
import { prisma, withConnection } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/admin/languages - List all languages
export async function GET(request: NextRequest) {
  try {
    return await withConnection(async () => {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: Prisma.LanguageWhereInput = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const languages = await prisma.language.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json({
      success: true,
      languages
    });
    }); // Close withConnection wrapper

  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}

// POST /api/admin/languages - Create new language
export async function POST(request: NextRequest) {
  try {
    // Get user data from middleware headers
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const userRole = request.headers.get('x-user-role');
    
    if (!userId || !userEmail || userRole !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, nativeName, isActive = true, displayOrder = 0 } = body;

    if (!name || !code) {
      return NextResponse.json(
        { error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const language = await prisma.language.create({
      data: {
        name,
        code,
        nativeName,
        isActive,
        displayOrder
      }
    });

    return NextResponse.json({
      success: true,
      language
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating language:', error);
    return NextResponse.json(
      { error: 'Failed to create language' },
      { status: 500 }
    );
  }
}
