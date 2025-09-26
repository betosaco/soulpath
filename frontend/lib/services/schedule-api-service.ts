import { PrismaClient } from '@prisma/client';
import { cache, cacheTTL } from '@/lib/redis';

const prisma = new PrismaClient();

export interface ScheduleConnectionConfig {
  connectionType: 'schedule';
  apiUrl?: string;
  scheduleEndpoint?: string;
  timeout?: number;
  rateLimit?: number;
  testMode?: boolean;
}

export interface ScheduleData {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  capacity?: number | null;
  isAvailable: boolean | null;
  autoAvailable?: boolean | null;
  sessionDurationId?: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface ScheduleApiResponse {
  success: boolean;
  data?: ScheduleData[];
  error?: string;
  message?: string;
  cached?: boolean;
}

export class ScheduleApiService {
  private config: ScheduleConnectionConfig;
  private cachePrefix = 'schedule_api';

  constructor(config: ScheduleConnectionConfig) {
    this.config = config;
  }

  /**
   * Get schedules with optional filtering
   */
  async getSchedules(filters?: {
    dayOfWeek?: string;
    available?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<ScheduleApiResponse> {
    try {
      const cacheKey = this.generateCacheKey('schedules', filters);
      
      // Try cache first
      try {
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
          console.log('✅ Schedule API cache hit:', cacheKey);
          return {
            success: true,
            data: cachedData as ScheduleData[],
            cached: true
          };
        }
      } catch (error) {
        console.warn('⚠️ Schedule API cache read error:', error);
      }

      // Build where clause
      const where: any = {};
      
      if (filters?.dayOfWeek) {
        where.dayOfWeek = filters.dayOfWeek;
      }
      
      if (filters?.available !== undefined) {
        where.isAvailable = filters.available;
      }

      // Fetch from database
      const schedules = await prisma.scheduleTemplate.findMany({
        where,
        orderBy: [
          { dayOfWeek: 'asc' },
          { startTime: 'asc' }
        ]
      });

      // Transform to ScheduleData format
      const scheduleData: ScheduleData[] = schedules.map(schedule => ({
        id: schedule.id.toString(),
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        capacity: schedule.capacity,
        isAvailable: schedule.isAvailable,
        autoAvailable: schedule.autoAvailable,
        sessionDurationId: schedule.sessionDurationId,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt
      }));

      // Cache the result
      try {
        await cache.set(cacheKey, scheduleData, cacheTTL.schedule || 1800);
        console.log('✅ Cached schedule API data for key:', cacheKey);
      } catch (error) {
        console.warn('⚠️ Schedule API cache write error:', error);
      }

      return {
        success: true,
        data: scheduleData
      };

    } catch (error) {
      console.error('Schedule API service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch schedules'
      };
    }
  }

  /**
   * Get available time slots for a specific date range
   */
  async getAvailableSlots(filters: {
    startDate: string;
    endDate: string;
    teacherId?: string;
    serviceTypeId?: string;
    venueId?: string;
  }): Promise<ScheduleApiResponse> {
    try {
      const cacheKey = this.generateCacheKey('available_slots', filters);
      
      // Try cache first
      try {
        const cachedData = await cache.get(cacheKey);
        if (cachedData) {
          console.log('✅ Available slots cache hit:', cacheKey);
          return {
            success: true,
            data: cachedData as ScheduleData[],
            cached: true
          };
        }
      } catch (error) {
        console.warn('⚠️ Available slots cache read error:', error);
      }

      // Build where clause for teacher schedule slots
      const whereClause: any = {
        isAvailable: true,
        startTime: {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate)
        }
      };

      if (filters.teacherId) {
        whereClause.teacherId = filters.teacherId;
      }

      if (filters.serviceTypeId) {
        whereClause.serviceTypeId = filters.serviceTypeId;
      }

      if (filters.venueId) {
        whereClause.venueId = filters.venueId;
      }

      // Fetch available slots
      const slots = await prisma.teacherScheduleSlot.findMany({
        where: whereClause,
        orderBy: { startTime: 'asc' },
        include: {
          teacherSchedule: {
            include: {
              teacher: {
                select: { id: true, name: true }
              },
              serviceType: {
                select: { id: true, name: true }
              },
              venue: {
                select: { id: true, name: true }
              }
            }
          }
        }
      });

      // Transform to ScheduleData format
      const slotData: ScheduleData[] = slots.map(slot => ({
        id: slot.id.toString(),
        dayOfWeek: slot.startTime.toLocaleDateString('en-US', { weekday: 'long' }),
        startTime: slot.startTime.toTimeString().slice(0, 5),
        endTime: slot.endTime.toTimeString().slice(0, 5),
        capacity: slot.maxBookings,
        isAvailable: slot.isAvailable,
        autoAvailable: null, // Not available in TeacherScheduleSlot
        sessionDurationId: null, // Not available in TeacherScheduleSlot
        createdAt: slot.createdAt,
        updatedAt: slot.updatedAt
      }));

      // Cache the result
      try {
        await cache.set(cacheKey, slotData, cacheTTL.schedule || 1800);
        console.log('✅ Cached available slots data for key:', cacheKey);
      } catch (error) {
        console.warn('⚠️ Available slots cache write error:', error);
      }

      return {
        success: true,
        data: slotData
      };

    } catch (error) {
      console.error('Available slots service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fetch available slots'
      };
    }
  }

  /**
   * Create a new schedule
   */
  async createSchedule(scheduleData: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    capacity?: number;
    isAvailable?: boolean;
    autoAvailable?: boolean;
    sessionDurationId?: number;
  }): Promise<ScheduleApiResponse> {
    try {
      // Check if schedule already exists
      const existingSchedule = await prisma.scheduleTemplate.findFirst({
        where: {
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: scheduleData.startTime
        }
      });

      if (existingSchedule) {
        return {
          success: false,
          error: 'Schedule already exists',
          message: 'A schedule already exists for this day and time'
        };
      }

      // Create new schedule
      const newSchedule = await prisma.scheduleTemplate.create({
        data: {
          dayOfWeek: scheduleData.dayOfWeek,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          capacity: scheduleData.capacity || 10,
          isAvailable: scheduleData.isAvailable ?? true,
          autoAvailable: scheduleData.autoAvailable ?? true,
          sessionDurationId: scheduleData.sessionDurationId
        }
      });

      // Invalidate related caches
      await this.invalidateCache();

      return {
        success: true,
        data: [{
          id: newSchedule.id.toString(),
          dayOfWeek: newSchedule.dayOfWeek,
          startTime: newSchedule.startTime,
          endTime: newSchedule.endTime,
          capacity: newSchedule.capacity ?? null,
          isAvailable: newSchedule.isAvailable ?? null,
          autoAvailable: newSchedule.autoAvailable ?? null,
          sessionDurationId: newSchedule.sessionDurationId ?? null,
          createdAt: newSchedule.createdAt ?? null,
          updatedAt: newSchedule.updatedAt ?? null
        }],
        message: 'Schedule created successfully'
      };

    } catch (error) {
      console.error('Create schedule service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to create schedule'
      };
    }
  }

  /**
   * Update schedule availability
   */
  async updateScheduleAvailability(scheduleId: string, isAvailable: boolean): Promise<ScheduleApiResponse> {
    try {
      const updatedSchedule = await prisma.scheduleTemplate.update({
        where: { id: parseInt(scheduleId) },
        data: { isAvailable }
      });

      // Invalidate related caches
      await this.invalidateCache();

      return {
        success: true,
        data: [{
          id: updatedSchedule.id.toString(),
          dayOfWeek: updatedSchedule.dayOfWeek,
          startTime: updatedSchedule.startTime,
          endTime: updatedSchedule.endTime,
          capacity: updatedSchedule.capacity ?? null,
          isAvailable: updatedSchedule.isAvailable ?? null,
          autoAvailable: updatedSchedule.autoAvailable ?? null,
          sessionDurationId: updatedSchedule.sessionDurationId ?? null,
          createdAt: updatedSchedule.createdAt ?? null,
          updatedAt: updatedSchedule.updatedAt ?? null
        }],
        message: 'Schedule availability updated successfully'
      };

    } catch (error) {
      console.error('Update schedule availability service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to update schedule availability'
      };
    }
  }

  /**
   * Generate cache key for different operations
   */
  private generateCacheKey(operation: string, filters?: any): string {
    const filterString = filters ? JSON.stringify(filters) : 'all';
    return `${this.cachePrefix}:${operation}:${filterString}`;
  }

  /**
   * Invalidate all schedule-related caches
   */
  private async invalidateCache(): Promise<void> {
    try {
      await cache.del(`${this.cachePrefix}:*`);
      console.log('✅ Invalidated schedule API caches');
    } catch (error) {
      console.warn('⚠️ Schedule API cache invalidation error:', error);
    }
  }

  /**
   * Test the schedule API connection
   */
  async testConnection(): Promise<{ success: boolean; message: string; latency?: number }> {
    const startTime = Date.now();
    
    try {
      // Test by fetching a small amount of data
      const result = await this.getSchedules();
      const latency = Date.now() - startTime;
      
      return {
        success: result.success,
        message: result.success ? 'Schedule API connection successful' : 'Schedule API connection failed',
        latency
      };
    } catch (error) {
      return {
        success: false,
        message: `Schedule API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

/**
 * Factory function to create schedule API service instances
 */
export function createScheduleApiService(config?: Partial<ScheduleConnectionConfig>): ScheduleApiService {
  const defaultConfig: ScheduleConnectionConfig = {
    connectionType: 'schedule',
    apiUrl: process.env.SCHEDULE_API_URL || '/api/schedules',
    scheduleEndpoint: '/api/schedules',
    timeout: 30000,
    rateLimit: 100,
    testMode: process.env.NODE_ENV === 'development',
    ...config
  };

  return new ScheduleApiService(defaultConfig);
}

/**
 * Get schedule API service for packages
 */
export function getPackagesScheduleService(): ScheduleApiService {
  return createScheduleApiService({
    scheduleEndpoint: '/api/schedules',
    testMode: process.env.NODE_ENV === 'development'
  });
}

/**
 * Get schedule API service for products
 */
export function getProductsScheduleService(): ScheduleApiService {
  return createScheduleApiService({
    scheduleEndpoint: '/api/schedules',
    testMode: process.env.NODE_ENV === 'development'
  });
}

/**
 * Get schedule API service for internal products
 */
export function getInternalProductsScheduleService(): ScheduleApiService {
  return createScheduleApiService({
    scheduleEndpoint: '/api/schedules',
    testMode: process.env.NODE_ENV === 'development'
  });
}
