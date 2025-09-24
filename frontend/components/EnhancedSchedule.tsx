'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Lock
} from 'lucide-react';
import Image from 'next/image';
// import './EnhancedSchedule.css'; // TODO: Re-enable CSS import after fixing SSR issues

interface Teacher {
  id: number;
  name: string;
  bio?: string;
  shortBio?: string;
  experience: number;
  avatarUrl?: string;
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

export function EnhancedSchedule({
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
  console.log('🔍 EnhancedSchedule render - startDate:', startDate, 'endDate:', endDate);
  console.log('🔍 EnhancedSchedule - lockedTimeSlots:', lockedTimeSlots);
  console.log('🔍 EnhancedSchedule - existingBookings:', existingBookings);
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
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Response data:', data);
      console.log('📊 Response success:', data.success);
      console.log('📊 Response slots length:', data.slots?.length || 0);
      
      if (data.success) {
        console.log('✅ Setting slots:', data.slots.length, 'slots');
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
      console.log('🏁 Setting loading to false');
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

  // Force fetch on mount as backup
  useEffect(() => {
    console.log('🔄 Force fetch useEffect triggered');
    const timeoutId = setTimeout(() => {
      console.log('🔄 Force fetch timeout triggered');
      if (fetchSlots) {
        fetchSlots();
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [fetchSlots]); // Include fetchSlots in dependencies

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

  // Get unique teachers and services for filters
  const teachers = [...new Set((slots || []).map(slot => slot.teacher.name))];
  const services = [...new Set((slots || []).map(slot => slot.serviceType.name))];

  // Filter slots based on selected criteria
  const filteredSlots = (slots || []).filter(slot => {
    const matchesDate = !selectedDate || slot.date === selectedDate;
    const matchesTeacher = selectedTeacher === 'all' || slot.teacher.name === selectedTeacher;
    const matchesService = selectedService === 'all' || slot.serviceType.name === selectedService;
    const matchesSearch = !searchTerm || 
      slot.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.venue.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDate && matchesTeacher && matchesService && matchesSearch;
  });

  // Group slots by date
  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, ScheduleSlot[]>);

  // Get available dates
  const availableDates = Object.keys(groupedSlots).sort();

  // Format date for display
  const formatDate = (dateString: string) => {
    // Parse the date string as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get service type icon
  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'hatha yoga': '🧘‍♀️',
      'vinyasa yoga': '🧘‍♂️',
      'meditation': '🧘',
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
    return iconMap[lowerName] || '🎯';
  };


  // Debug logging
  console.log('🔍 EnhancedSchedule render - loading:', loading, 'slots:', slots?.length || 0, 'error:', error);

  // Show loading state only if actually loading
  if (loading) {
    return (
      <div className={`enhanced-schedule ${className} bg-white`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading schedule...</span>
        </div>
      </div>
    );
  }

  // If no slots and not loading, show empty state
  if (!slots || slots.length === 0) {
    return (
      <div className={`enhanced-schedule ${className} bg-white`}>
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes available</h3>
            <p className="text-gray-600 mb-4">There are no classes scheduled for the selected period.</p>
            <button 
              onClick={() => fetchSlots()}
              className="bg-[#6ea058] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a8a47] focus:ring-2 focus:ring-[#6ea058] focus:outline-none transition-colors"
            >
              Refresh Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className={`enhanced-schedule ${className}`}>
      {showFilters && (
        <>
          {/* Header */}
          <div className="enhanced-schedule__header">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Class Schedule</h2>
                <p className="text-gray-600">Book your favorite classes with our expert instructors</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Check if there are products in cart that require address
                    const cart = localStorage.getItem('cart');
                    if (cart) {
                      try {
                        const cartItems = JSON.parse(cart);
                        const hasProducts = cartItems.some((item: { type: string }) => item.type === 'product');
                        const hasPackages = cartItems.some((item: { type: string }) => item.type === 'package');

                        if (hasPackages) {
                          // If packages are in cart, go to step 2 (personal information)
                          // The system will automatically determine if address is needed based on products
                          window.location.href = '/checkout?step=2';
                        } else if (hasProducts) {
                          // If only products (no packages), go to step 2 (personal information)
                          // The system will automatically determine if address is needed
                          window.location.href = '/checkout?step=2';
                        } else {
                          // No items, go to default checkout
                          window.location.href = '/checkout';
                        }
                      } catch (error) {
                        console.error('Error parsing cart:', error);
                        // Fallback to default checkout
                        window.location.href = '/checkout';
                      }
                    } else {
                      // No cart items, go to default checkout
                      window.location.href = '/checkout';
                    }
                  }}
                  className="px-6 py-3 text-lg font-medium rounded-lg transition-all duration-200 bg-[#6ea058] text-white hover:bg-[#5a8a47] hover:scale-105 active:scale-95"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="enhanced-schedule__filters">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent"
            >
              <option value="">All Dates</option>
              {availableDates.map(date => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>

            {/* Teacher Filter */}
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent"
            >
              <option value="all">All Teachers</option>
              {teachers.map(teacher => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>

            {/* Service Filter */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6ea058] focus:border-transparent"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Schedule Content */}
      <div className="enhanced-schedule__content">
        {Object.keys(groupedSlots).length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new classes.</p>
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
                  className="schedule-day"
                >
                  <div className="schedule-day__header">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {formatDate(date)}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {dateSlots.length} class{dateSlots.length !== 1 ? 'es' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
                    {dateSlots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`schedule-slot card-base card-hover hover-scale ${!slot.isAvailable ? 'schedule-slot--unavailable' : ''} ${isSlotBooked(slot) ? 'schedule-slot--booked opacity-75' : ''} ${!hasMultiplePackages && isSlotLocked(slot) ? 'schedule-slot--locked opacity-75' : ''} ${isSlotBookedByAllPackages(slot) ? 'schedule-slot--fully-booked opacity-75' : ''} ${isSlotSelected(slot) ? 'schedule-slot--selected ring-2 ring-green-500 ring-opacity-75' : ''}`}
                      >
                        <div className="schedule-slot__header">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {getServiceIcon(slot.serviceType.name)}
                            </span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {slot.serviceType.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {slot.time} ({slot.duration} min)
                                </span>
                              </div>
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

                        <div className="schedule-slot__content">
                          {/* Teacher Info */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="relative">
                              {slot.teacher.avatarUrl ? (
                                <Image
                                  src={slot.teacher.avatarUrl}
                                  alt={slot.teacher.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {slot.teacher.name}
                              </p>
                            </div>
                          </div>

                          {/* Service Description */}
                          {slot.serviceType.shortDescription && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {slot.serviceType.shortDescription}
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
                                Booked by All Packages
                              </button>
                            ) : !hasMultiplePackages && isSlotLocked(slot) ? (
                              <button
                                disabled
                                className="w-full px-4 py-2 bg-orange-100 text-orange-700 rounded-lg cursor-not-allowed flex items-center justify-center gap-2 opacity-75"
                                title="This time slot was previously booked and is locked"
                              >
                                <Lock className="h-4 w-4" />
                                Previously Booked
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
                                {slot.bookedCount >= slot.capacity ? 'Fully Booked' : 
                                 isSlotBooked(slot) ? `Book More (${getSlotBookingCount(slot)}/${maxBookingsPerSlot})` : 
                                 'Book Session'}
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
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
