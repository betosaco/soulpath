// Unified Schedule Management Types
// This file contains all types for the integrated schedule management system

export type ScheduleType = 'teacher' | 'venue' | 'general';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface BaseSchedule {
  id: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  maxBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSchedule extends BaseSchedule {
  type: 'teacher';
  teacherId: number;
  venueId: number;
  serviceTypeId?: number;
  specialties: string[];
  teacher?: {
    id: number;
    name: string;
    email?: string | null;
    specialties: string[];
    isActive: boolean;
  };
  venue?: {
    id: number;
    name: string;
    city?: string | null;
    country?: string | null;
  };
  serviceType?: {
    id: number;
    name: string;
    category: string;
    description?: string;
  };
  teacherScheduleSlots?: TeacherScheduleSlot[];
}

export interface VenueSchedule extends BaseSchedule {
  type: 'venue';
  venueId: number;
  capacity: number;
  sessionDurationId: number;
  autoAvailable: boolean;
  venue?: {
    id: number;
    name: string;
    city?: string | null;
    country?: string | null;
    capacity: number;
  };
  sessionDuration?: {
    id: number;
    name: string;
    duration_minutes: number;
    description: string;
  };
  scheduleSlots?: VenueScheduleSlot[];
}

export interface GeneralSchedule extends BaseSchedule {
  type: 'general';
  name: string;
  description?: string;
  capacity: number;
  sessionDurationId: number;
  autoAvailable: boolean;
  sessionDuration?: {
    id: number;
    name: string;
    duration_minutes: number;
    description: string;
  };
  scheduleSlots?: GeneralScheduleSlot[];
}

export type UnifiedSchedule = TeacherSchedule | VenueSchedule | GeneralSchedule;

// Schedule Slots
export interface BaseScheduleSlot {
  id: number;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  isAvailable: boolean;
  bookedCount: number;
  maxBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherScheduleSlot extends BaseScheduleSlot {
  teacherScheduleId: number;
  bookings: Booking[];
}

export interface VenueScheduleSlot extends BaseScheduleSlot {
  scheduleTemplateId: number;
  bookings: Booking[];
}

export interface GeneralScheduleSlot extends BaseScheduleSlot {
  scheduleTemplateId: number;
  bookings: Booking[];
}

export type UnifiedScheduleSlot = TeacherScheduleSlot | VenueScheduleSlot | GeneralScheduleSlot;

// Supporting types
export interface Booking {
  id: number;
  clientId: number;
  status: string;
  bookingType: string;
  groupSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionDuration {
  id: number;
  name: string;
  duration_minutes: number;
  description: string;
  isActive: boolean;
}

export interface Teacher {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  specialties: string[];
  languages: string[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
}

export interface Venue {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  capacity: number;
  maxGroupSize?: number;
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
}

// Form data types
export interface TeacherScheduleFormData {
  teacherId: number;
  venueId: number;
  serviceTypeId?: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
  specialties: string[];
  isRecurrent: boolean;
  endDate?: string; // For recurrent schedules
}

export interface VenueScheduleFormData {
  venueId: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
  maxBookings: number;
  sessionDurationId: number;
  autoAvailable: boolean;
  isRecurrent: boolean;
  endDate?: string; // For recurrent schedules
}

export interface GeneralScheduleFormData {
  name: string;
  description?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  capacity: number;
  isAvailable: boolean;
  maxBookings: number;
  sessionDurationId: number;
  autoAvailable: boolean;
}

export type UnifiedScheduleFormData = TeacherScheduleFormData | VenueScheduleFormData | GeneralScheduleFormData;

// Filter types
export interface ScheduleFilters {
  type?: ScheduleType;
  teacherId?: number;
  venueId?: number;
  dayOfWeek?: DayOfWeek;
  isAvailable?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// API response types
export interface ScheduleListResponse {
  success: boolean;
  data: {
    schedules: UnifiedSchedule[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ScheduleSlotListResponse {
  success: boolean;
  data: {
    slots: UnifiedScheduleSlot[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// Conflict detection types
export interface ScheduleConflict {
  type: 'time_overlap' | 'capacity_exceeded' | 'teacher_unavailable' | 'venue_unavailable';
  message: string;
  conflictingSchedules: UnifiedSchedule[];
  severity: 'warning' | 'error';
}

export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflicts: ScheduleConflict[];
}

// Calendar view types
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: ScheduleType;
  schedule: UnifiedSchedule;
  color: string;
  isAvailable: boolean;
  bookedCount: number;
  maxBookings: number;
}

export interface CalendarViewProps {
  schedules: UnifiedSchedule[];
  slots: UnifiedScheduleSlot[];
  view: 'week' | 'month' | 'day';
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

