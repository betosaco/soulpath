'use client';

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage, useTranslations } from '@/hooks/useTranslations';
import { defaultTranslations } from '@/lib/data/translations';
// import './EnhancedSchedule.css'; // TODO: Re-enable CSS import after fixing SSR issues

interface Teacher {
  id: number;
  name: string;
  bio?: string;
  shortBio?: string;
  experience: number;
  avatarUrl?: string;
  isActive?: boolean;
}

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  duration: number;
  difficulty?: string;
  color?: string;
  icon?: string;
}

interface Venue {
  id: number;
  name: string;
  address?: string;
  city?: string;
}

interface ScheduleSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
  duration: number;
  teacher: Teacher;
  serviceType: ServiceType;
  venue: Venue;
  dayOfWeek: string;
  conflictReason?: string;
  isLate?: boolean;
  lateMinutes?: number;
  lateMessage?: string;
  lateNotifiedAt?: string;
  teacherNotice?: {
    type: 'cancelled' | 'substitution' | 'late';
    message: string;
  };
  originalStartTime?: string;
  originalEndTime?: string;
}

interface EnhancedScheduleProps {
  onBookSlot?: (slot: ScheduleSlot, event?: React.MouseEvent) => void;
  showBookingButton?: boolean;
  className?: string;
  startDate?: Date;
  endDate?: Date;
  onSlotsChange?: (slots: ScheduleSlot[]) => void;
  selectedSlot?: ScheduleSlot | null;
  existingBookings?: Array<{
    selectedDate: string;
    selectedTime: string;
    packageName?: string; // Name of the package that booked this slot
    packageId?: string; // ID of the package that booked this slot
  }>;
  lockedTimeSlots?: Array<{
    selectedDate: string;
    selectedTime: string;
    packageId: string;
  }>; // Time slots that are locked/disabled for specific packages
  maxBookingsPerSlot?: number; // Maximum number of times a slot can be booked
  reloadTrigger?: number; // Triggers a reload when this value changes
  showFilters?: boolean; // Whether to show the header and filters
  hasMultiplePackages?: boolean; // Whether there are multiple packages in cart
  cartPackages?: Array<{
    id: string;
    name: string;
    sessions: number;
    bookingDetails?: Array<{
      selectedDate?: string;
      selectedTime?: string;
    }>;
  }>; // All packages in the cart for checking if all have booked a slot
}

// ULTRA-OPTIMIZATION: Memoized EnhancedSchedule component
export const EnhancedSchedule = memo(function EnhancedSchedule({
  onBookSlot,
  className = '',
  startDate,
  endDate,
  onSlotsChange,
  existingBookings = [],
  lockedTimeSlots = [],
  maxBookingsPerSlot = 1,
  reloadTrigger,
  showFilters = true,
  hasMultiplePackages = false,
  selectedSlot = null,
  cartPackages = []
}: EnhancedScheduleProps) {
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 EnhancedSchedule render - startDate:', startDate, 'endDate:', endDate);
  }
  
  // Translation hooks
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Use default translations directly to ensure schedule translations are always available
  // Make it reactive to language changes by accessing it directly
  const schedule = defaultTranslations[language]?.schedule || defaultTranslations.en.schedule;
  const serviceTypes = defaultTranslations[language]?.serviceTypes || defaultTranslations.en.serviceTypes || {};
  const serviceDescriptions = defaultTranslations[language]?.serviceDescriptions || defaultTranslations.en.serviceDescriptions || {};
  
  // Debug logging - always show for troubleshooting
  console.log('🔍 EnhancedSchedule - Language:', language, '| Title:', schedule.title);
  console.log('🔍 EnhancedSchedule - Available service type keys:', Object.keys(serviceTypes));
  console.log('🔍 EnhancedSchedule - Available service description keys:', Object.keys(serviceDescriptions));
  
  // Helper function to get translations
  const getTranslation = useCallback((key: string, fallback: string = ''): string => {
    return (schedule as Record<string, string>)[key] || fallback;
  }, [schedule, language]);

  // Helper function to translate service types
  const translateServiceType = useCallback((serviceName: string): string => {
    try {
      const translation = (serviceTypes as Record<string, string>)[serviceName];
      console.log('🔍 Service type lookup:', { serviceName, translation, availableKeys: Object.keys(serviceTypes) });
      return translation || serviceName;
    } catch (error) {
      console.warn('Error translating service type:', error);
      return serviceName;
    }
  }, [serviceTypes, language]);

  // Helper function to translate service descriptions
  const translateServiceDescription = useCallback((serviceName: string): string => {
    try {
      const translation = (serviceDescriptions as Record<string, string>)[serviceName];
      console.log('🔍 Service description lookup:', { serviceName, translation, availableKeys: Object.keys(serviceDescriptions) });
      return translation || '';
    } catch (error) {
      console.warn('Error translating service description:', error);
      return '';
    }
  }, [serviceDescriptions, language]);
  // Handle slot booking - redirect to account booking page
  const handleBookSlot = (slot: ScheduleSlot) => {
    try {
      console.log('Booking slot data:', {
        slotId: slot.id,
        date: slot.date,
        time: slot.time,
        serviceType: slot.serviceType.name,
        teacher: slot.teacher.name,
        venue: slot.venue.name
      });

      // Redirect to schedule review page with slot information
      const params = new URLSearchParams({
        slotId: slot.id.toString(),
        teacherId: slot.teacher.id.toString(),
        serviceTypeId: slot.serviceType.id.toString(),
        venueId: slot.venue.id.toString(),
        date: slot.date,
        time: slot.time
      });
      
      window.location.href = `/schedule-review?${params.toString()}`;
    } catch (error) {
      console.error('Error redirecting to booking:', error);
      alert('Error al procesar la reserva. Por favor, intenta de nuevo.');
    }
  };

  // Enhanced slot click handler that clears conflicts
  const handleSlotClickWithConflictClear = (slot: ScheduleSlot, event?: React.MouseEvent) => {
    // For multiple packages, allow cross-package booking (different packages can book same slot)
    // For single package, prevent clicking on locked slots
    if (!hasMultiplePackages && isSlotLocked(slot)) {
      console.log('🚫 Slot is locked for single package, cannot be selected:', slot);
      return;
    }
    
    // For multiple packages, always allow slot selection (package-specific validation happens later)
    console.log('✅ Slot selection allowed - hasMultiplePackages:', hasMultiplePackages);
    
    // Clear conflicting schedule from sessionStorage when user selects a new slot
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('conflictingSchedule');
    }
    
    // Use the onBookSlot prop if provided, otherwise use default behavior
    if (onBookSlot) {
      console.log('🎯 Calling onBookSlot prop with slot:', slot);
      onBookSlot(slot, event);
    } else {
      console.log('🎯 Using default handleBookSlot with slot:', slot);
      handleBookSlot(slot);
    }
  };
  
  // Use the enhanced handler
  const handleSlotClick = handleSlotClickWithConflictClear;
  
  // Check if a slot is already booked
  const isSlotBooked = (slot: ScheduleSlot) => {
    // For multiple packages, a slot is only "booked" if it reaches max capacity
    // For single package, a slot is "booked" if any booking exists
    if (hasMultiplePackages) {
      return getSlotBookingCount(slot) >= maxBookingsPerSlot;
    } else {
      return existingBookings.some(booking => 
        booking.selectedDate === slot.date && 
        booking.selectedTime === slot.time
      );
    }
  };

  // Check if all packages in cart have booked this slot
  const isSlotBookedByAllPackages = (slot: ScheduleSlot) => {
    if (!hasMultiplePackages || cartPackages.length === 0) return false;
    
    // Check if all packages in cart have booked this specific slot
    return cartPackages.every(pkg => {
      return pkg.bookingDetails?.some(booking => 
        booking.selectedDate === slot.date && 
        booking.selectedTime === slot.time
      ) || false;
    });
  };

  // Check if a slot is locked for a specific package
  const isSlotLocked = (slot: ScheduleSlot, packageId?: string) => {
    // For multiple packages, only lock if the specific package has booked the slot
    // For single package, lock if any package has booked the slot
    if (hasMultiplePackages) {
      if (packageId) {
        // Multiple packages with specific package - check if that package has booked the slot
        return lockedTimeSlots.some(lockedSlot =>
          lockedSlot.selectedDate === slot.date &&
          lockedSlot.selectedTime === slot.time &&
          lockedSlot.packageId === packageId
        );
      } else {
        // Multiple packages but no specific package - allow cross-package booking
        return false;
      }
    } else {
      // Single package mode - lock if any package has booked it
      return lockedTimeSlots.some(lockedSlot =>
        lockedSlot.selectedDate === slot.date &&
        lockedSlot.selectedTime === slot.time
      );
    }
  };

  // Check if a slot is currently selected
  const isSlotSelected = (slot: ScheduleSlot) => {
    return selectedSlot &&
           selectedSlot.date === slot.date &&
           selectedSlot.time === slot.time &&
           selectedSlot.id === slot.id;
  };


  const getSlotBookingCount = (slot: ScheduleSlot) => {
    return existingBookings.filter(booking => 
      booking.selectedDate === slot.date && booking.selectedTime === slot.time
    ).length;
  };

  const canBookMore = (slot: ScheduleSlot) => {
    // For multiple packages, allow cross-package booking (maxBookingsPerSlot is 999)
    // For single package, this should be handled by the package selection logic
    const currentBookings = getSlotBookingCount(slot);
    return currentBookings < maxBookingsPerSlot;
  };

  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousSlotsRef = useRef<ScheduleSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch schedule slots
  const fetchSlots = useCallback(async (customStartDate?: Date, customEndDate?: Date) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Starting fetchSlots function...');
      console.log('🔍 Props received:', { startDate, endDate, customStartDate, customEndDate });
      
      const start = customStartDate || startDate;
      const end = customEndDate || endDate;
      
      console.log('🔍 Fetching schedule slots...', { start, end });
      
      // Build query parameters
      const params = new URLSearchParams({
        available: 'true',
        t: Date.now().toString()
      });
      
      if (start && end) {
        params.append('startDate', start.toISOString().split('T')[0]);
        params.append('endDate', end.toISOString().split('T')[0]);
      }
      
      console.log('🌐 Fetching from:', `/api/teacher-schedule-slots?${params.toString()}`);

      const response = await fetch(`/api/teacher-schedule-slots?${params.toString()}`);
      if (process.env.NODE_ENV === 'development') {
        console.log('📡 Response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Response success:', data.success, 'slots:', data.slots?.length || 0);
      }
      
      if (data.success) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Setting slots:', data.slots.length, 'slots');
        }
        if (data.message && data.message.includes('mock data')) {
          console.log('📝 Using mock data - database unavailable');
        }
        // Check for conflicting schedules and mark them as unavailable
        const processedSlots = data.slots.map((slot: ScheduleSlot) => {
          // Check if this slot conflicts with a schedule that needs to be changed
          if (typeof window !== 'undefined') {
            const conflictingSchedule = sessionStorage.getItem('conflictingSchedule');
            if (conflictingSchedule) {
              try {
                const conflict = JSON.parse(conflictingSchedule);
                if (slot.date === conflict.date && slot.time === conflict.time) {
                  return {
                    ...slot,
                    isAvailable: false,
                    conflictReason: 'Schedule conflict - please choose a different time'
                  };
                }
              } catch (error) {
                console.error('Error parsing conflicting schedule:', error);
              }
            }
          }
          return slot;
        });
        
        setSlots(processedSlots);
        // Only call onSlotsChange if the slots actually changed
        if (JSON.stringify(processedSlots) !== JSON.stringify(previousSlotsRef.current)) {
          previousSlotsRef.current = processedSlots;
          onSlotsChange?.(processedSlots);
        }
      } else {
        console.error('❌ API error:', data.error);
        setError(data.error || 'Failed to fetch schedule');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      console.error('❌ Error type:', err?.constructor?.name);
      console.error('❌ Error message:', (err as Error)?.message);

      // Provide more specific error messages
      if (err instanceof TypeError && err.message.includes('fetch')) {
        console.error('🌐 Network error - check if server is running');
        setError('Network error: Unable to connect to server. Please check your connection.');
      } else if (err instanceof Error && err.message.includes('HTTP')) {
        console.error('📡 HTTP error from server');
        setError(`Server error: ${err.message}`);
      } else {
        console.error('❓ Unknown error occurred');
        setError('Failed to fetch schedule. Please try again.');
      }
    } finally {
      if (process.env.NODE_ENV === 'development') {
        console.log('🏁 Setting loading to false');
      }
      setLoading(false);
    }
  }, [startDate, endDate, onSlotsChange]);

  // Fetch slots when component mounts or date range changes
  useEffect(() => {
    console.log('🔄 useEffect triggered - startDate:', startDate, 'endDate:', endDate);
    console.log('🔄 Component mounted, fetching slots...');
    console.log('🔄 fetchSlots function:', typeof fetchSlots);
    
    // Always fetch slots on mount
    if (fetchSlots) {
      fetchSlots();
    } else {
      console.error('❌ fetchSlots is not defined!');
    }
  }, [startDate, endDate, fetchSlots]); // Include fetchSlots in dependencies


  // Reload slots when reloadTrigger changes
  useEffect(() => {
    if (reloadTrigger !== undefined) {
      console.log('🔄 Reload trigger changed, refetching slots...', reloadTrigger);
      if (startDate && endDate) {
        fetchSlots(startDate, endDate);
      } else {
        fetchSlots();
      }
    }
  }, [reloadTrigger, startDate, endDate, fetchSlots]);

  // ULTRA-OPTIMIZATION: Memoized computed values
  const teachers = useMemo(() => {
    return [...new Set((slots || []).map(slot => slot.teacher.name))];
  }, [slots]);

  const services = useMemo(() => {
    return [...new Set((slots || []).map(slot => slot.serviceType.name))];
  }, [slots]);

  // ULTRA-OPTIMIZATION: Memoized filtered slots
  const filteredSlots = useMemo(() => {
    return (slots || []).filter(slot => {
      const matchesDate = !selectedDate || slot.date === selectedDate;
      const matchesTeacher = selectedTeacher === 'all' || slot.teacher.name === selectedTeacher;
      const matchesService = selectedService === 'all' || slot.serviceType.name === selectedService;
      const matchesSearch = !searchTerm || 
        slot.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.venue.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesDate && matchesTeacher && matchesService && matchesSearch;
    });
  }, [slots, selectedDate, selectedTeacher, selectedService, searchTerm]);

  // ULTRA-OPTIMIZATION: Memoized grouped slots
  const groupedSlots = useMemo(() => {
    return filteredSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    }, {} as Record<string, ScheduleSlot[]>);
  }, [filteredSlots]);

  // ULTRA-OPTIMIZATION: Memoized available dates
  const availableDates = useMemo(() => {
    return Object.keys(groupedSlots).sort();
  }, [groupedSlots]);

  // Format date for display
  const formatDate = useCallback((dateString: string) => {
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    // Use the current language for date formatting
    const locale = language === 'es' ? 'es-ES' : 'en-US';
    
    return date.toLocaleDateString(locale, { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }, [language]);

  // Get service type icon
  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'hatha yoga': '',
      'vinyasa yoga': '',
      'meditation': '',
      'pilates': '🤸',
      'fitness': '💪',
      'dance': '💃',
      'martial arts': '🥋',
      'swimming': '🏊',
      'running': '🏃',
      'cycling': '🚴',
      'boxing': '🥊',
      'crossfit': '🏋️',
      'aerobics': '🤸‍♀️',
      'stretching': '🤸‍♂️',
      'breathing': '🫁',
      'mindfulness': '🧠',
      'wellness': '🌿',
      'nutrition': '🥗',
      'massage': '💆',
      'therapy': '🩺',
      'rehabilitation': '🦽'
    };
    const lowerName = serviceName.toLowerCase();
    return iconMap[lowerName] || '';
  };


  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 EnhancedSchedule render - loading:', loading, 'slots:', slots?.length || 0, 'error:', error);
  }

  // Skeleton components for UI-first loading
  const ScheduleSlotSkeleton = () => (
    <div className="schedule-slot card-base animate-pulse">
      <div className="schedule-slot__header">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-1 flex-1">
            <div className="h-5 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="schedule-slot__content space-y-3 mt-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
      <div className="schedule-slot__footer mt-4">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );

  const ScheduleDaySkeleton = ({ slotsCount = 3 }: { slotsCount?: number }) => (
    <div className="schedule-day rounded-lg shadow-sm border overflow-hidden animate-pulse" style={{
      backgroundColor: 'color-mix(in srgb, var(--color-primary-500) 6%, transparent)',
      borderColor: 'color-mix(in srgb, var(--color-primary-500) 20%, transparent)'
    }}>
      <div className="schedule-day__header px-6 py-4 border-b flex items-center justify-between" style={{
        backgroundColor: 'color-mix(in srgb, var(--color-primary-500) 10%, transparent)',
        borderBottomColor: 'color-mix(in srgb, var(--color-primary-500) 20%, transparent)'
      }}>
        <div className="h-7 bg-gray-200 rounded w-48"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
        {Array.from({ length: slotsCount }).map((_, index) => (
          <ScheduleSlotSkeleton key={index} />
        ))}
      </div>
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className={`enhanced-schedule ${className}`}>
        <div className="flex items-center justify-center py-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load schedule</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => fetchSlots()}
              className="bg-[#6ea058] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a8a47] focus:ring-2 focus:ring-[#6ea058] focus:outline-none transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // UI-first approach: Always render the structure
  return (
    <div className={`enhanced-schedule ${className}`}>
      {showFilters && (
        <>
          {/* Header - Always renders first */}
          <div className="enhanced-schedule__header">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{getTranslation('title', 'Class Schedule')}</h2>
                <p className="text-gray-600">{getTranslation('subtitle', 'Book your favorite classes with our expert instructors')}</p>
              </div>
            </div>

            {/* Filters - Always rendered (disabled while loading) */}
            <div className="enhanced-schedule__filters">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={getTranslation('searchPlaceholder', 'Search classes...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Date Filter */}
            <label className="sr-only" htmlFor="schedule-date-filter">{getTranslation('filterByDate', 'Filter by date')}</label>
            <select
              id="schedule-date-filter"
              name="date"
              aria-label={getTranslation('filterByDate', 'Filter by date')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{getTranslation('allDates', 'All Dates')}</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>

            {/* Teacher Filter */}
            <label className="sr-only" htmlFor="schedule-teacher-filter">{getTranslation('filterByTeacher', 'Filter by teacher')}</label>
            <select
              id="schedule-teacher-filter"
              name="teacher"
              aria-label={getTranslation('filterByTeacher', 'Filter by teacher')}
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">{getTranslation('allTeachers', 'All Teachers')}</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>

            {/* Service Filter */}
            <label className="sr-only" htmlFor="schedule-service-filter">{getTranslation('filterByService', 'Filter by service')}</label>
            <select
              id="schedule-service-filter"
              name="service"
              aria-label={getTranslation('filterByService', 'Filter by service')}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">{getTranslation('allServices', 'All Services')}</option>
              {services.map(service => (
                <option key={service} value={service}>
                  {translateServiceType(service)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Schedule Content - UI-first approach */}
      <div className="enhanced-schedule__content">
        {loading ? (
          // Show skeleton while loading
          <div className="space-y-6">
            <ScheduleDaySkeleton slotsCount={3} />
            <ScheduleDaySkeleton slotsCount={3} />
            <ScheduleDaySkeleton slotsCount={2} />
          </div>
        ) : !slots || slots.length === 0 ? (
          // No slots available
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getTranslation('noClassesAvailable', 'No classes available')}</h3>
              <p className="text-gray-600 mb-4">{getTranslation('noClassesDescription', 'There are no classes scheduled for the selected period.')}</p>
              <button 
                onClick={() => fetchSlots()}
                className="bg-[#6ea058] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a8a47] focus:ring-2 focus:ring-[#6ea058] focus:outline-none transition-colors"
              >
                {getTranslation('refreshSchedule', 'Refresh Schedule')}
              </button>
            </div>
          </div>
        ) : Object.keys(groupedSlots).length === 0 ? (
          // No classes match filters
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{getTranslation('noClassesFound', 'No classes found')}</h3>
            <p className="text-gray-600">{getTranslation('noClassesFoundDescription', 'Try adjusting your filters or check back later for new classes.')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSlots)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, dateSlots]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="schedule-day rounded-lg shadow-sm border overflow-hidden"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary-500) 6%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--color-primary-500) 20%, transparent)'
                  }}
                >
                  <div
                    className="schedule-day__header px-6 py-4 border-b flex items-center justify-between"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-primary-500) 10%, transparent)',
                      borderBottomColor: 'color-mix(in srgb, var(--color-primary-500) 20%, transparent)'
                    }}
                  >
                    <h3 className="text-xl font-semibold text-gray-900">
                      {formatDate(date)}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {dateSlots.length} {dateSlots.length === 1 ? getTranslation('class', 'class') : getTranslation('classes', 'classes')}
                    </span>
                  </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
                        {dateSlots.map((slot) => {
                          // Debug logging for each slot
                          console.log('🔍 Slot service type:', slot.serviceType.name, '| Description:', slot.serviceType.shortDescription);
                          console.log('🔍 Translation lookup for:', slot.serviceType.name, '| Result:', translateServiceDescription(slot.serviceType.name));
                          return (
                            <motion.div
                              key={slot.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`schedule-slot card-base card-hover hover-scale ${!slot.isAvailable ? 'schedule-slot--unavailable' : ''} ${isSlotBooked(slot) ? 'schedule-slot--booked opacity-75' : ''} ${!hasMultiplePackages && isSlotLocked(slot) ? 'schedule-slot--locked opacity-75' : ''} ${isSlotBookedByAllPackages(slot) ? 'schedule-slot--fully-booked opacity-75' : ''} ${isSlotSelected(slot) ? 'schedule-slot--selected ring-2 ring-green-500 ring-opacity-75' : ''}`}
                            >
                              <div className="schedule-slot__header">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                  {getServiceIcon(slot.serviceType.name)}
                                </span>
                                <h4 className="text-lg font-bold text-gray-900">
                                  {translateServiceType(slot.serviceType.name)}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600 font-medium">
                                  {slot.time} ({slot.duration} min)
                                </span>
                              </div>
                              {/* Late Notice */}
                              {slot.isLate && (
                                <div className="text-xs text-red-600 font-medium">
                                  ⚠️ Running Late ({slot.lateMinutes} min)
                                  {slot.lateMessage && (
                                    <div className="text-red-500 italic mt-1">
                                      "{slot.lateMessage}"
                                    </div>
                                  )}
                                </div>
                              )}
                              {/* Teacher Notice Space */}
                              <div className="h-4 text-xs text-gray-500">
                                {slot.teacherNotice && !slot.isLate && (
                                  <span className={`font-medium ${
                                    slot.teacherNotice.type === 'cancelled' ? 'text-red-600' :
                                    slot.teacherNotice.type === 'substitution' ? 'text-blue-600' :
                                    'text-gray-600'
                                  }`}>
                                    {slot.teacherNotice.type === 'cancelled' && '❌ '}
                                    {slot.teacherNotice.type === 'substitution' && '🔄 '}
                                    {slot.teacherNotice.message}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Teacher Info */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="relative">
                                  {slot.teacher.avatarUrl ? (
                                    <Image
                                      src={slot.teacher.avatarUrl}
                                      alt={slot.teacher.name}
                                      width={40}
                                      height={40}
                                      className={`rounded-full object-cover ${!slot.teacher.isActive ? 'grayscale' : ''}`}
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                  )}
                                </div>
                                <p className="font-medium text-gray-900 text-sm text-center">
                                  {slot.teacher.name}
                                </p>
                              </div>
                              {isSlotBooked(slot) && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="text-xs font-medium">
                                    Selected ({getSlotBookingCount(slot)}/{maxBookingsPerSlot})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                        </div>

                        <div className="schedule-slot__content">

                          {/* Service Description */}
                          {(translateServiceDescription(slot.serviceType.name) || slot.serviceType.shortDescription) && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {translateServiceDescription(slot.serviceType.name) || slot.serviceType.shortDescription}
                            </p>
                          )}

                          {/* Venue Info */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>{slot.venue.name}</span>
                            {slot.venue.city && (
                              <span className="text-gray-400">• {slot.venue.city}</span>
                            )}
                          </div>


                          {/* Available Spots Info */}
                          <div className="flex items-center gap-2 text-sm mb-3">
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${slot.isLate ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                              <span className="text-gray-600">
                                {slot.capacity - slot.bookedCount} of {slot.capacity} {slot.capacity - slot.bookedCount === 1 ? getTranslation('spotAvailable', 'spot available') : getTranslation('spotsAvailable', 'spots available')}
                              </span>
                            </div>
                            {slot.bookedCount > 0 && (
                              <span className="text-xs text-gray-500">
                                ({slot.bookedCount} booked)
                              </span>
                            )}
                          </div>

                        </div>

                        <div className="schedule-slot__actions">
                          {slot.isAvailable ? (
                            // Check if all packages have booked this slot first
                            isSlotBookedByAllPackages(slot) ? (
                              <button
                                disabled
                                className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                                title="All packages have already booked this time slot"
                              >
                                <Lock className="h-4 w-4" />
                                {getTranslation('alreadyBooked', 'Already Booked')}
                              </button>
                            ) : !hasMultiplePackages && isSlotLocked(slot) ? (
                              <button
                                disabled
                                className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 opacity-75"
                                title="This time slot was previously booked and is locked"
                              >
                                <Lock className="h-4 w-4" />
                                {getTranslation('previouslyBooked', 'Previously Booked')}
                              </button>
                            ) : !canBookMore(slot) ? (
                              <button
                                disabled
                                className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 opacity-60"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Max Bookings Reached ({getSlotBookingCount(slot)}/{maxBookingsPerSlot})
                              </button>
                            ) : (
                              <button
                                onClick={(event) => handleSlotClick(slot, event)}
                                className="w-full bg-[#6ea058] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a8a47] focus:ring-2 focus:ring-[#6ea058] focus:outline-none transition-colors flex items-center justify-center gap-2"
                                disabled={slot.bookedCount >= slot.capacity}
                              >
                                <BookOpen className="h-4 w-4" />
                                {slot.bookedCount >= slot.capacity ? getTranslation('fullyBooked', 'Fully Booked') : 
                                 isSlotBooked(slot) ? `${getTranslation('bookMore', 'Book More')} (${getSlotBookingCount(slot)}/${maxBookingsPerSlot})` : 
                                 getTranslation('bookClass', 'Book Class')}
                              </button>
                            )
                          ) : (
                            <button
                              disabled
                              className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                              title={slot.conflictReason || 'Not Available'}
                            >
                              <AlertCircle className="h-4 w-4" />
                              {slot.conflictReason ? 'Schedule Conflict' : 'Not Available'}
                            </button>
                          )}
                        </div>
                      </motion.div>
                          );
                        })}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});
