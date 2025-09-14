import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing schedule slots query...');
    
    // Test basic database connection
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test:', connectionTest);
    
    // Test simple schedule slots query
    const simpleQuery = await prisma.scheduleSlot.findMany({
      take: 1,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        capacity: true,
        bookedCount: true,
        isAvailable: true
      }
    });
    console.log('✅ Simple schedule slots query:', simpleQuery);
    
    // Test with relationships
    const complexQuery = await prisma.scheduleSlot.findMany({
      take: 1,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        capacity: true,
        bookedCount: true,
        isAvailable: true,
        scheduleTemplate: {
          select: {
            id: true,
            dayOfWeek: true,
            sessionDuration: {
              select: {
                id: true,
                name: true,
                duration_minutes: true
              }
            }
          }
        }
      }
    });
    console.log('✅ Complex schedule slots query:', complexQuery);
    
    return NextResponse.json({
      success: true,
      message: 'Debug test successful',
      data: {
        connectionTest,
        simpleQuery,
        complexQuery
      }
    });
    
  } catch (error) {
    console.error('❌ DEBUG: Error in schedule slots test:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

