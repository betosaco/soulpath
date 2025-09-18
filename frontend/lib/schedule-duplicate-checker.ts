import { prisma } from './prisma';

export interface ScheduleDuplicateCheck {
  hasDuplicates: boolean;
  duplicates: DuplicateInfo[];
  warnings: string[];
}

export interface DuplicateInfo {
  type: 'exact_match' | 'time_overlap' | 'same_teacher_same_day' | 'same_venue_same_day';
  message: string;
  conflictingScheduleId: number;
  conflictingSchedule: any;
  severity: 'error' | 'warning';
}

export interface ScheduleData {
  id?: number;
  date?: string;
  dayOfWeek?: string;
  startTime: string;
  endTime: string;
  teacherId?: number;
  venueId?: number;
  type: 'teacher' | 'venue' | 'template';
}

/**
 * Comprehensive duplicate checker for schedules
 */
export class ScheduleDuplicateChecker {
  
  /**
   * Check for all types of duplicates
   */
  static async checkDuplicates(scheduleData: ScheduleData): Promise<ScheduleDuplicateCheck> {
    const duplicates: DuplicateInfo[] = [];
    const warnings: string[] = [];

    try {
      // 1. Check for exact matches (same day, same time)
      const exactMatches = await this.checkExactMatches(scheduleData);
      duplicates.push(...exactMatches);

      // 2. Check for time overlaps
      const timeOverlaps = await this.checkTimeOverlaps(scheduleData);
      duplicates.push(...timeOverlaps);

      // 3. Check for same teacher on same day (different times)
      if (scheduleData.teacherId) {
        const teacherDuplicates = await this.checkSameTeacherSameDay(scheduleData);
        duplicates.push(...teacherDuplicates);
      }

      // 4. Check for same venue on same day (different times)
      if (scheduleData.venueId) {
        const venueDuplicates = await this.checkSameVenueSameDay(scheduleData);
        duplicates.push(...venueDuplicates);
      }

      // 5. Check for capacity conflicts
      if (scheduleData.venueId) {
        const capacityWarnings = await this.checkCapacityConflicts(scheduleData);
        warnings.push(...capacityWarnings);
      }

      return {
        hasDuplicates: duplicates.length > 0,
        duplicates,
        warnings
      };

    } catch (error) {
      console.error('Error checking duplicates:', error);
      return {
        hasDuplicates: false,
        duplicates: [],
        warnings: ['Error checking for duplicates']
      };
    }
  }

  /**
   * Check for exact matches (same day, same time)
   */
  private static async checkExactMatches(scheduleData: ScheduleData): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];

    if (scheduleData.type === 'teacher' && scheduleData.teacherId && scheduleData.dayOfWeek) {
      const exactMatch = await prisma.teacherSchedule.findFirst({
        where: {
          id: { not: scheduleData.id || 0 },
          teacherId: scheduleData.teacherId,
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime
        },
        include: {
          teacher: { select: { name: true } },
          venue: { select: { name: true } }
        }
      });

      if (exactMatch) {
        duplicates.push({
          type: 'exact_match',
          message: `Exact duplicate found: ${exactMatch.teacher?.name} at ${exactMatch.venue?.name} on ${scheduleData.dayOfWeek} from ${scheduleData.startTime} to ${scheduleData.endTime}`,
          conflictingScheduleId: exactMatch.id,
          conflictingSchedule: exactMatch,
          severity: 'error'
        });
      }
    }

    if (scheduleData.type === 'venue' && scheduleData.venueId && scheduleData.dayOfWeek) {
      const exactMatch = await prisma.scheduleTemplate.findFirst({
        where: {
          id: { not: scheduleData.id || 0 },
          venueId: scheduleData.venueId,
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime
        },
        include: {
          venue: { select: { name: true } }
        }
      });

      if (exactMatch) {
        duplicates.push({
          type: 'exact_match',
          message: `Exact duplicate found: ${exactMatch.venue?.name} on ${scheduleData.dayOfWeek} from ${scheduleData.startTime} to ${scheduleData.endTime}`,
          conflictingScheduleId: exactMatch.id,
          conflictingSchedule: exactMatch,
          severity: 'error'
        });
      }
    }

    return duplicates;
  }

  /**
   * Check for time overlaps
   */
  private static async checkTimeOverlaps(scheduleData: ScheduleData): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];

    if (scheduleData.type === 'teacher' && scheduleData.teacherId && scheduleData.dayOfWeek) {
      const overlappingSchedules = await prisma.teacherSchedule.findMany({
        where: {
          id: { not: scheduleData.id || 0 },
          teacherId: scheduleData.teacherId,
          dayOfWeek: scheduleData.dayOfWeek,
          OR: [
            {
              AND: [
                { startTime: { lte: scheduleData.startTime } },
                { endTime: { gt: scheduleData.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: scheduleData.endTime } },
                { endTime: { gte: scheduleData.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: scheduleData.startTime } },
                { endTime: { lte: scheduleData.endTime } }
              ]
            }
          ]
        },
        include: {
          teacher: { select: { name: true } },
          venue: { select: { name: true } }
        }
      });

      for (const overlap of overlappingSchedules) {
        duplicates.push({
          type: 'time_overlap',
          message: `Time overlap: ${overlap.teacher?.name} at ${overlap.venue?.name} on ${scheduleData.dayOfWeek} (${overlap.startTime} - ${overlap.endTime}) overlaps with your schedule (${scheduleData.startTime} - ${scheduleData.endTime})`,
          conflictingScheduleId: overlap.id,
          conflictingSchedule: overlap,
          severity: 'error'
        });
      }
    }

    if (scheduleData.type === 'venue' && scheduleData.venueId && scheduleData.dayOfWeek) {
      const overlappingSchedules = await prisma.scheduleTemplate.findMany({
        where: {
          id: { not: scheduleData.id || 0 },
          venueId: scheduleData.venueId,
          dayOfWeek: scheduleData.dayOfWeek,
          OR: [
            {
              AND: [
                { startTime: { lte: scheduleData.startTime } },
                { endTime: { gt: scheduleData.startTime } }
              ]
            },
            {
              AND: [
                { startTime: { lt: scheduleData.endTime } },
                { endTime: { gte: scheduleData.endTime } }
              ]
            },
            {
              AND: [
                { startTime: { gte: scheduleData.startTime } },
                { endTime: { lte: scheduleData.endTime } }
              ]
            }
          ]
        },
        include: {
          venue: { select: { name: true } }
        }
      });

      for (const overlap of overlappingSchedules) {
        duplicates.push({
          type: 'time_overlap',
          message: `Time overlap: ${overlap.venue?.name} on ${scheduleData.dayOfWeek} (${overlap.startTime} - ${overlap.endTime}) overlaps with your schedule (${scheduleData.startTime} - ${scheduleData.endTime})`,
          conflictingScheduleId: overlap.id,
          conflictingSchedule: overlap,
          severity: 'error'
        });
      }
    }

    return duplicates;
  }

  /**
   * Check for same teacher on same day (different times) - warning only
   */
  private static async checkSameTeacherSameDay(scheduleData: ScheduleData): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];

    if (scheduleData.type === 'teacher' && scheduleData.teacherId && scheduleData.dayOfWeek) {
      const sameDaySchedules = await prisma.teacherSchedule.findMany({
        where: {
          id: { not: scheduleData.id || 0 },
          teacherId: scheduleData.teacherId,
          dayOfWeek: scheduleData.dayOfWeek
        },
        include: {
          teacher: { select: { name: true } },
          venue: { select: { name: true } }
        }
      });

      for (const schedule of sameDaySchedules) {
        duplicates.push({
          type: 'same_teacher_same_day',
          message: `Teacher ${schedule.teacher?.name} already has a schedule on ${scheduleData.dayOfWeek} at ${schedule.venue?.name} (${schedule.startTime} - ${schedule.endTime})`,
          conflictingScheduleId: schedule.id,
          conflictingSchedule: schedule,
          severity: 'warning'
        });
      }
    }

    return duplicates;
  }

  /**
   * Check for same venue on same day (different times) - warning only
   */
  private static async checkSameVenueSameDay(scheduleData: ScheduleData): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [];

    if (scheduleData.type === 'venue' && scheduleData.venueId && scheduleData.dayOfWeek) {
      const sameDaySchedules = await prisma.scheduleTemplate.findMany({
        where: {
          id: { not: scheduleData.id || 0 },
          venueId: scheduleData.venueId,
          dayOfWeek: scheduleData.dayOfWeek
        },
        include: {
          venue: { select: { name: true } }
        }
      });

      for (const schedule of sameDaySchedules) {
        duplicates.push({
          type: 'same_venue_same_day',
          message: `Venue ${schedule.venue?.name} already has a schedule on ${scheduleData.dayOfWeek} (${schedule.startTime} - ${schedule.endTime})`,
          conflictingScheduleId: schedule.id,
          conflictingSchedule: schedule,
          severity: 'warning'
        });
      }
    }

    return duplicates;
  }

  /**
   * Check for capacity conflicts
   */
  private static async checkCapacityConflicts(scheduleData: ScheduleData): Promise<string[]> {
    const warnings: string[] = [];

    if (scheduleData.venueId) {
      const venue = await prisma.venue.findUnique({
        where: { id: scheduleData.venueId },
        select: { name: true, capacity: true }
      });

      if (venue && scheduleData.type === 'venue') {
        // Check if the schedule capacity exceeds venue capacity
        const scheduleCapacity = 1; // Default capacity, should be passed in scheduleData
        if (scheduleCapacity > venue.capacity) {
          warnings.push(`Schedule capacity (${scheduleCapacity}) exceeds venue capacity (${venue.capacity}) for ${venue.name}`);
        }
      }
    }

    return warnings;
  }

  /**
   * Get all schedules for a specific day to help with duplicate detection
   */
  static async getSchedulesForDay(dayOfWeek: string): Promise<any[]> {
    const schedules = [];

    // Get teacher schedules for the day
    const teacherSchedules = await prisma.teacherSchedule.findMany({
      where: { dayOfWeek },
      include: {
        teacher: { select: { name: true, email: true } },
        venue: { select: { name: true, city: true } }
      }
    });

    // Get venue schedules for the day
    const venueSchedules = await prisma.scheduleTemplate.findMany({
      where: { dayOfWeek },
      include: {
        venue: { select: { name: true, city: true } }
      }
    });

    schedules.push(...teacherSchedules.map(s => ({ ...s, type: 'teacher' })));
    schedules.push(...venueSchedules.map(s => ({ ...s, type: 'venue' })));

    return schedules;
  }

  /**
   * Get duplicate summary for a day
   */
  static async getDayDuplicateSummary(dayOfWeek: string): Promise<{
    totalSchedules: number;
    duplicates: number;
    warnings: number;
    scheduleList: any[];
  }> {
    const schedules = await this.getSchedulesForDay(dayOfWeek);
    
    let duplicates = 0;
    let warnings = 0;

    // Check for duplicates within the day
    for (let i = 0; i < schedules.length; i++) {
      for (let j = i + 1; j < schedules.length; j++) {
        const schedule1 = schedules[i];
        const schedule2 = schedules[j];

        // Check for exact matches
        if (schedule1.startTime === schedule2.startTime && 
            schedule1.endTime === schedule2.endTime &&
            schedule1.teacherId === schedule2.teacherId &&
            schedule1.venueId === schedule2.venueId) {
          duplicates++;
        }
        // Check for time overlaps
        else if (this.isTimeOverlapping(schedule1.startTime, schedule1.endTime, schedule2.startTime, schedule2.endTime)) {
          duplicates++;
        }
        // Check for same teacher different times
        else if (schedule1.teacherId === schedule2.teacherId && schedule1.teacherId) {
          warnings++;
        }
        // Check for same venue different times
        else if (schedule1.venueId === schedule2.venueId && schedule1.venueId) {
          warnings++;
        }
      }
    }

    return {
      totalSchedules: schedules.length,
      duplicates,
      warnings,
      scheduleList: schedules
    };
  }

  /**
   * Helper function to check if two time ranges overlap
   */
  private static isTimeOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    const time1Start = this.timeToMinutes(start1);
    const time1End = this.timeToMinutes(end1);
    const time2Start = this.timeToMinutes(start2);
    const time2End = this.timeToMinutes(end2);

    return (time1Start < time2End && time1End > time2Start);
  }

  /**
   * Helper function to convert time string to minutes
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
