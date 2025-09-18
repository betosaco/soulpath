import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ScheduleDuplicateChecker } from '@/lib/schedule-duplicate-checker';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/schedule-duplicates - Checking for duplicates...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleData } = body;

    if (!scheduleData) {
      return NextResponse.json({
        success: false,
        error: 'Schedule data required',
        message: 'Schedule data is required for duplicate checking'
      }, { status: 400 });
    }

    // Validate required fields
    if (!scheduleData.startTime || !scheduleData.endTime || !scheduleData.type) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'startTime, endTime, and type are required'
      }, { status: 400 });
    }

    // Check for duplicates
    const duplicateCheck = await ScheduleDuplicateChecker.checkDuplicates(scheduleData);

    console.log(`✅ Found ${duplicateCheck.duplicates.length} duplicates and ${duplicateCheck.warnings.length} warnings`);

    return NextResponse.json({
      success: true,
      data: duplicateCheck,
      message: duplicateCheck.hasDuplicates 
        ? `Found ${duplicateCheck.duplicates.length} duplicate(s) and ${duplicateCheck.warnings.length} warning(s)`
        : 'No duplicates found'
    });

  } catch (error) {
    console.error('❌ Check duplicates error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to check for duplicates',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/schedule-duplicates - Getting day summary...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dayOfWeek = searchParams.get('dayOfWeek');

    if (!dayOfWeek) {
      return NextResponse.json({
        success: false,
        error: 'Day of week required',
        message: 'dayOfWeek parameter is required'
      }, { status: 400 });
    }

    // Get duplicate summary for the day
    const summary = await ScheduleDuplicateChecker.getDayDuplicateSummary(dayOfWeek);

    console.log(`✅ Day summary for ${dayOfWeek}: ${summary.totalSchedules} schedules, ${summary.duplicates} duplicates, ${summary.warnings} warnings`);

    return NextResponse.json({
      success: true,
      data: summary,
      message: `Found ${summary.duplicates} duplicates and ${summary.warnings} warnings for ${dayOfWeek}`
    });

  } catch (error) {
    console.error('❌ Get day summary error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to get day summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
