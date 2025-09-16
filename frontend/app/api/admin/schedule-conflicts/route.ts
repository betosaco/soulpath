import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UnifiedSchedule, ConflictCheckResult, ScheduleConflict, DayOfWeek } from '@/types/schedule';

// Type for teacher specialty with nested specialty (matches Prisma structure)
interface TeacherSpecialtyWithSpecialty {
  id: number;
  createdAt: Date;
  teacherId: number;
  specialtyId: number;
  specialty?: {
    name: string;
  } | null;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/admin/schedule-conflicts - Checking for conflicts...');
    
    const user = await requireAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized',
        message: 'Admin access required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { schedule } = body;

    if (!schedule) {
      return NextResponse.json({
        success: false,
        error: 'Schedule required',
        message: 'Schedule data is required for conflict checking'
      }, { status: 400 });
    }

    const conflicts: ScheduleConflict[] = [];
    const conflictingSchedules: UnifiedSchedule[] = [];

    // Check for time overlaps
    const timeOverlapConflicts = await checkTimeOverlaps(schedule);
    conflicts.push(...timeOverlapConflicts.conflicts);
    conflictingSchedules.push(...timeOverlapConflicts.conflictingSchedules);

    // Check for capacity issues
    const capacityConflicts = await checkCapacityConflicts(schedule);
    conflicts.push(...capacityConflicts.conflicts);
    conflictingSchedules.push(...capacityConflicts.conflictingSchedules);

    // Check for teacher availability
    if (schedule.type === 'teacher') {
      const teacherConflicts = await checkTeacherAvailability(schedule);
      conflicts.push(...teacherConflicts.conflicts);
      conflictingSchedules.push(...teacherConflicts.conflictingSchedules);
    }

    // Check for venue availability
    if ('venueId' in schedule && schedule.venueId) {
      const venueConflicts = await checkVenueAvailability(schedule);
      conflicts.push(...venueConflicts.conflicts);
      conflictingSchedules.push(...venueConflicts.conflictingSchedules);
    }

    const result: ConflictCheckResult = {
      hasConflicts: conflicts.length > 0,
      conflicts
    };

    console.log(`✅ Found ${conflicts.length} conflicts`);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Schedule conflicts API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check conflicts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to check for time overlaps
async function checkTimeOverlaps(schedule: UnifiedSchedule): Promise<{ conflicts: ScheduleConflict[], conflictingSchedules: UnifiedSchedule[] }> {
  const conflicts: ScheduleConflict[] = [];
  const conflictingSchedules: UnifiedSchedule[] = [];

  try {
    // Convert time strings to comparable format
    // Convert time strings to comparable format (unused variables removed)
    // const scheduleStart = timeToMinutes(schedule.startTime);
    // const scheduleEnd = timeToMinutes(schedule.endTime);

    // Check teacher schedule overlaps
    if (schedule.type === 'teacher') {
      const overlappingTeacherSchedules = await prisma.teacherSchedule.findMany({
        where: {
          id: { not: schedule.id || 0 },
          dayOfWeek: schedule.dayOfWeek,
          teacherId: schedule.teacherId,
          OR: [
            {
              AND: [
                { startTime: { lte: schedule.startTime } },
                { endTime: { gt: schedule.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: schedule.endTime } },
                { endTime: { gte: schedule.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: schedule.startTime } },
                { endTime: { lte: schedule.endTime } }
              ]
            }
          ]
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              specialties: true,
              isActive: true
            }
          },
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true
            }
          }
        }
      });

      for (const overlappingSchedule of overlappingTeacherSchedules) {
        const conflict: ScheduleConflict = {
          type: 'time_overlap',
          message: `Time overlap with existing teacher schedule: ${overlappingSchedule.teacher?.name} at ${overlappingSchedule.venue?.name}`,
          conflictingSchedules: [{
            ...overlappingSchedule,
            type: 'teacher' as const,
            dayOfWeek: overlappingSchedule.dayOfWeek as DayOfWeek,
            teacher: overlappingSchedule.teacher ? {
              id: overlappingSchedule.teacher.id,
              name: overlappingSchedule.teacher.name,
              email: overlappingSchedule.teacher.email,
              specialties: overlappingSchedule.teacher.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || [],
              isActive: overlappingSchedule.teacher.isActive || false
            } : undefined,
            specialties: overlappingSchedule.teacher?.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || []
          }] as unknown as UnifiedSchedule[],
          severity: 'error'
        };
        conflicts.push(conflict);
        conflictingSchedules.push({
          ...overlappingSchedule,
          type: 'teacher' as const,
          dayOfWeek: overlappingSchedule.dayOfWeek as DayOfWeek,
          teacher: overlappingSchedule.teacher ? {
            id: overlappingSchedule.teacher.id,
            name: overlappingSchedule.teacher.name,
            email: overlappingSchedule.teacher.email,
            specialties: overlappingSchedule.teacher.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || [],
            isActive: overlappingSchedule.teacher.isActive || false
          } : undefined,
          specialties: overlappingSchedule.teacher?.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || []
        } as unknown as UnifiedSchedule);
      }
    }

    // Check venue schedule overlaps
    if ('venueId' in schedule && schedule.venueId) {
      const overlappingVenueSchedules = await prisma.scheduleTemplate.findMany({
        where: {
          id: { not: schedule.id || 0 },
          dayOfWeek: schedule.dayOfWeek,
          venueId: schedule.venueId,
          OR: [
            {
              AND: [
                { startTime: { lte: schedule.startTime } },
                { endTime: { gt: schedule.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: schedule.endTime } },
                { endTime: { gte: schedule.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: schedule.startTime } },
                { endTime: { lte: schedule.endTime } }
              ]
            }
          ]
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
              capacity: true
            }
          },
          sessionDuration: true
        }
      });

      for (const overlappingSchedule of overlappingVenueSchedules) {
        const conflict: ScheduleConflict = {
          type: 'time_overlap',
          message: `Time overlap with existing venue schedule at ${overlappingSchedule.venue?.name}`,
          conflictingSchedules: [{
            ...overlappingSchedule,
            type: 'venue' as const,
            dayOfWeek: overlappingSchedule.dayOfWeek as DayOfWeek,
            venueId: overlappingSchedule.venueId || 0,
            capacity: overlappingSchedule.capacity || 1,
            sessionDurationId: overlappingSchedule.sessionDurationId || 0,
            autoAvailable: overlappingSchedule.autoAvailable || false,
            maxBookings: overlappingSchedule.capacity || 1,
            venue: overlappingSchedule.venue ? {
              id: overlappingSchedule.venue.id,
              name: overlappingSchedule.venue.name,
              city: overlappingSchedule.venue.city,
              country: overlappingSchedule.venue.country,
              capacity: overlappingSchedule.venue.capacity
            } : undefined
          }] as unknown as UnifiedSchedule[],
          severity: 'error'
        };
        conflicts.push(conflict);
        conflictingSchedules.push({
          ...overlappingSchedule,
          type: 'venue' as const,
          dayOfWeek: overlappingSchedule.dayOfWeek as DayOfWeek,
          venueId: overlappingSchedule.venueId || 0,
          capacity: overlappingSchedule.capacity || 1,
          sessionDurationId: overlappingSchedule.sessionDurationId || 0,
          autoAvailable: overlappingSchedule.autoAvailable || false,
          maxBookings: overlappingSchedule.capacity || 1,
          venue: overlappingSchedule.venue ? {
            id: overlappingSchedule.venue.id,
            name: overlappingSchedule.venue.name,
            city: overlappingSchedule.venue.city,
            country: overlappingSchedule.venue.country,
            capacity: overlappingSchedule.venue.capacity
          } : undefined
        } as unknown as UnifiedSchedule);
      }
    }

  } catch (error) {
    console.error('Error checking time overlaps:', error);
  }

  return { conflicts, conflictingSchedules };
}

// Helper function to check capacity conflicts
async function checkCapacityConflicts(schedule: UnifiedSchedule): Promise<{ conflicts: ScheduleConflict[], conflictingSchedules: UnifiedSchedule[] }> {
  const conflicts: ScheduleConflict[] = [];
  const conflictingSchedules: UnifiedSchedule[] = [];

  try {
    if (schedule.type === 'venue' && 'venueId' in schedule && schedule.venueId) {
      // Check if the schedule capacity exceeds venue capacity
      const venue = await prisma.venue.findUnique({
        where: { id: schedule.venueId },
        select: { capacity: true, name: true }
      });

      if (venue && schedule.capacity > venue.capacity) {
        const conflict: ScheduleConflict = {
          type: 'capacity_exceeded',
          message: `Schedule capacity (${schedule.capacity}) exceeds venue capacity (${venue.capacity})`,
          conflictingSchedules: [],
          severity: 'error'
        };
        conflicts.push(conflict);
      }

      // Check for overlapping schedules that would exceed total venue capacity
      const overlappingSchedules = await prisma.scheduleTemplate.findMany({
        where: {
          id: { not: schedule.id || 0 },
          dayOfWeek: schedule.dayOfWeek,
          venueId: schedule.venueId,
          OR: [
            {
              AND: [
                { startTime: { lte: schedule.startTime } },
                { endTime: { gt: schedule.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: schedule.endTime } },
                { endTime: { gte: schedule.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: schedule.startTime } },
                { endTime: { lte: schedule.endTime } }
              ]
            }
          ]
        },
        include: {
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
              capacity: true
            }
          },
          sessionDuration: true
        }
      });

      const totalCapacity = overlappingSchedules.reduce((sum, s) => sum + (s.capacity || 0), 0) + schedule.capacity;
      
      if (venue && totalCapacity > venue.capacity) {
        const conflict: ScheduleConflict = {
          type: 'capacity_exceeded',
          message: `Combined capacity (${totalCapacity}) exceeds venue capacity (${venue.capacity})`,
          conflictingSchedules: overlappingSchedules.map(s => ({
            ...s,
            type: 'venue' as const,
            dayOfWeek: s.dayOfWeek as DayOfWeek,
            venueId: s.venueId || 0,
            capacity: s.capacity || 1,
            sessionDurationId: s.sessionDurationId || 0,
            autoAvailable: s.autoAvailable || false,
            maxBookings: s.capacity || 1,
            venue: s.venue ? {
              id: s.venue.id,
              name: s.venue.name,
              city: s.venue.city,
              country: s.venue.country,
              capacity: s.venue.capacity
            } : undefined
          })) as unknown as UnifiedSchedule[],
          severity: 'warning'
        };
        conflicts.push(conflict);
        conflictingSchedules.push(...overlappingSchedules.map(s => ({
          ...s,
          type: 'venue' as const,
          dayOfWeek: s.dayOfWeek as DayOfWeek,
          venueId: s.venueId || 0,
          capacity: s.capacity || 1,
          sessionDurationId: s.sessionDurationId || 0,
          autoAvailable: s.autoAvailable || false,
          maxBookings: s.capacity || 1,
          venue: s.venue ? {
            id: s.venue.id,
            name: s.venue.name,
            city: s.venue.city,
            country: s.venue.country,
            capacity: s.venue.capacity
          } : undefined
        } as unknown as UnifiedSchedule)));
      }
    }
  } catch (error) {
    console.error('Error checking capacity conflicts:', error);
  }

  return { conflicts, conflictingSchedules };
}

// Helper function to check teacher availability
async function checkTeacherAvailability(schedule: UnifiedSchedule): Promise<{ conflicts: ScheduleConflict[], conflictingSchedules: UnifiedSchedule[] }> {
  const conflicts: ScheduleConflict[] = [];
  const conflictingSchedules: UnifiedSchedule[] = [];

  try {
    if (schedule.type === 'teacher') {
      // Check if teacher is active
      const teacher = await prisma.teacher.findUnique({
        where: { id: schedule.teacherId },
        select: { isActive: true, name: true }
      });

      if (teacher && !teacher.isActive) {
        const conflict: ScheduleConflict = {
          type: 'teacher_unavailable',
          message: `Teacher ${teacher.name} is not active`,
          conflictingSchedules: [],
          severity: 'error'
        };
        conflicts.push(conflict);
      }

      // Check if teacher has conflicting schedules
      const conflictingTeacherSchedules = await prisma.teacherSchedule.findMany({
        where: {
          id: { not: schedule.id || 0 },
          teacherId: schedule.teacherId,
          dayOfWeek: schedule.dayOfWeek,
          OR: [
            {
              AND: [
                { startTime: { lte: schedule.startTime } },
                { endTime: { gt: schedule.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: schedule.endTime } },
                { endTime: { gte: schedule.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: schedule.startTime } },
                { endTime: { lte: schedule.endTime } }
              ]
            }
          ]
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
              specialties: true,
              isActive: true
            }
          },
          venue: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true
            }
          }
        }
      });

      for (const conflictingSchedule of conflictingTeacherSchedules) {
        const conflict: ScheduleConflict = {
          type: 'teacher_unavailable',
          message: `Teacher has conflicting schedule at ${conflictingSchedule.venue?.name}`,
          conflictingSchedules: [{
            ...conflictingSchedule,
            type: 'teacher' as const,
            dayOfWeek: conflictingSchedule.dayOfWeek as DayOfWeek,
            teacher: conflictingSchedule.teacher ? {
              id: conflictingSchedule.teacher.id,
              name: conflictingSchedule.teacher.name,
              email: conflictingSchedule.teacher.email,
              specialties: conflictingSchedule.teacher.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || [],
              isActive: conflictingSchedule.teacher.isActive || false
            } : undefined,
            specialties: conflictingSchedule.teacher?.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || []
          }] as unknown as UnifiedSchedule[],
          severity: 'error'
        };
        conflicts.push(conflict);
        conflictingSchedules.push({
          ...conflictingSchedule,
          type: 'teacher' as const,
          dayOfWeek: conflictingSchedule.dayOfWeek as DayOfWeek,
          teacher: conflictingSchedule.teacher ? {
            id: conflictingSchedule.teacher.id,
            name: conflictingSchedule.teacher.name,
            email: conflictingSchedule.teacher.email,
            specialties: conflictingSchedule.teacher.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || [],
            isActive: conflictingSchedule.teacher.isActive || false
          } : undefined,
          specialties: conflictingSchedule.teacher?.specialties?.map((ts: TeacherSpecialtyWithSpecialty) => ts.specialty?.name || '') || []
        } as unknown as UnifiedSchedule);
      }
    }
  } catch (error) {
    console.error('Error checking teacher availability:', error);
  }

  return { conflicts, conflictingSchedules };
}

// Helper function to check venue availability
async function checkVenueAvailability(schedule: UnifiedSchedule): Promise<{ conflicts: ScheduleConflict[], conflictingSchedules: UnifiedSchedule[] }> {
  const conflicts: ScheduleConflict[] = [];
  const conflictingSchedules: UnifiedSchedule[] = [];

  try {
    if ('venueId' in schedule && schedule.venueId) {
      // Check if venue is active
      const venue = await prisma.venue.findUnique({
        where: { id: schedule.venueId },
        select: { isActive: true, name: true }
      });

      if (venue && !venue.isActive) {
        const conflict: ScheduleConflict = {
          type: 'venue_unavailable',
          message: `Venue ${venue.name} is not active`,
          conflictingSchedules: [],
          severity: 'error'
        };
        conflicts.push(conflict);
      }
    }
  } catch (error) {
    console.error('Error checking venue availability:', error);
  }

  return { conflicts, conflictingSchedules };
}

// Helper function to convert time string to minutes
// Unused function removed
// function timeToMinutes(timeString: string): number {
//   const [hours, minutes] = timeString.split(':').map(Number);
//   return hours * 60 + minutes;
// }

