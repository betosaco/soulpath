'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Search,
  Users,
  Award,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

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
}

interface EnhancedScheduleProps {
  onBookSlot?: (slot: ScheduleSlot) => void;
  showBookingButton?: boolean;
  className?: string;
}

export function EnhancedSchedule({ 
  onBookSlot, 
  className = ''
}: EnhancedScheduleProps) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch schedule slots
  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching schedule slots...');
      const response = await fetch(`/api/teacher-schedule-slots?available=true&t=${Date.now()}`);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📊 Response data:', data);
      
      if (data.success) {
        console.log('✅ Setting slots:', data.slots.length, 'slots');
        setSlots(data.slots);
      } else {
        console.error('❌ API error:', data.error);
        setError(data.error || 'Failed to fetch schedule');
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to fetch schedule');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Get unique teachers and services for filters
  const teachers = [...new Set(slots.map(slot => slot.teacher.name))];
  const services = [...new Set(slots.map(slot => slot.serviceType.name))];

  // Filter slots based on selected criteria
  const filteredSlots = slots.filter(slot => {
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

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    const colorMap: { [key: string]: string } = {
      'beginner': 'text-green-600 bg-green-100',
      'intermediate': 'text-yellow-600 bg-yellow-100',
      'advanced': 'text-red-600 bg-red-100',
      'all levels': 'text-blue-600 bg-blue-100'
    };
    return colorMap[difficulty?.toLowerCase() || 'all levels'] || 'text-blue-600 bg-blue-100';
  };

  // Handle slot booking
  const handleBookSlot = (slot: ScheduleSlot) => {
    if (onBookSlot) {
      onBookSlot(slot);
    } else {
      // Default behavior - redirect to booking page
      window.location.href = `/account/book?slotId=${slot.id}`;
    }
  };

  // Debug logging
  console.log('🔍 EnhancedSchedule render - loading:', loading, 'slots:', slots.length, 'error:', error);

  if (loading) {
    return (
      <div className={`enhanced-schedule ${className}`}>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Loading schedule...</span>
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
              onClick={fetchSlots}
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
      {/* Header */}
      <div className="enhanced-schedule__header">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Class Schedule</h2>
            <p className="text-gray-600">Book your favorite classes with our expert instructors</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-6 py-3 text-lg font-medium border-2 rounded-lg transition-all duration-200 ${
                viewMode === 'week' 
                  ? 'bg-primary text-white border-primary' 
                  : 'text-primary border-primary hover:bg-orange-500 hover:text-white hover:border-orange-500'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-6 py-3 text-lg font-medium border-2 rounded-lg transition-all duration-200 ${
                viewMode === 'month' 
                  ? 'bg-primary text-white border-primary' 
                  : 'text-primary border-primary hover:bg-orange-500 hover:text-white hover:border-orange-500'
              }`}
            >
              Month View
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

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dateSlots.map((slot) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`schedule-slot ${!slot.isAvailable ? 'schedule-slot--unavailable' : ''}`}
                      >
                        <div className="schedule-slot__header">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">
                              {getServiceIcon(slot.serviceType.name)}
                            </span>
                            <div>
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
                          </div>
                          
                          {slot.serviceType.difficulty && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(slot.serviceType.difficulty)}`}>
                              {slot.serviceType.difficulty}
                            </span>
                          )}
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
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Award className="h-3 w-3" />
                                <span>{slot.teacher.experience} years experience</span>
                              </div>
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

                          {/* Capacity Info */}
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <Users className="h-4 w-4" />
                            <span>
                              {slot.bookedCount}/{slot.capacity} spots filled
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#6ea058] h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.min((slot.bookedCount / slot.capacity) * 100, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="schedule-slot__actions">
                          {slot.isAvailable ? (
                            <button
                              onClick={() => handleBookSlot(slot)}
                              className="w-full bg-[#6ea058] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a8a47] focus:ring-2 focus:ring-[#6ea058] focus:outline-none transition-colors flex items-center justify-center gap-2"
                              disabled={slot.bookedCount >= slot.capacity}
                            >
                              <BookOpen className="h-4 w-4" />
                              {slot.bookedCount >= slot.capacity ? 'Fully Booked' : 'Book Now'}
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              <AlertCircle className="h-4 w-4" />
                              Not Available
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
