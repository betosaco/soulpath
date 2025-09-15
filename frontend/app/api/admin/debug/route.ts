import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    console.log('🔍 Debug endpoint - Testing database connection...');
    
    
    console.log('🔍 Prisma client created');

    // Test basic connection
    const userCount = await prisma.user.count();

    console.log('✅ Database connection successful');
    console.log('✅ Users table query successful, found', userCount, 'users');

    return NextResponse.json({
      success: true,
      message: 'Database connection and table access working',
      userCount: userCount,
      refactored: true
    });

  } catch (error) {
    console.error('❌ Unexpected error in debug endpoint:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
