'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, ArrowRight, Loader2 } from 'lucide-react';
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

interface SchedulePreviewProps {
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function SchedulePreview({ 
  limit = 3, 
  showViewAll = true,
  onViewAll,
  className = ''
}: SchedulePreviewProps) {
  const [slots, setSlots] = useState<ScheduleSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch schedule slots
  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/teacher-schedule-slots?available=true');
      const data = await response.json();
      
      if (data.success) {
        // Sort by date and time, then take the first few
        const sortedSlots = data.slots
          .sort((a: ScheduleSlot, b: ScheduleSlot) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, limit);
        
        setSlots(sortedSlots);
      } else {
        setError(data.error || 'Failed to fetch schedule');
      }
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSlots();
  }, [limit, fetchSlots]);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      window.location.href = '/schedule';
    }
  };

  if (loading) {
    return (
      <div className={`schedule-preview ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading upcoming classes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`schedule-preview ${className}`}>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchSlots}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className={`schedule-preview ${className}`}>
        <div className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming classes</h3>
          <p className="text-gray-600">Check back later for new class schedules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`schedule-preview ${className}`}>
      <div className="space-y-4">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Service Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">
                    {getServiceIcon(slot.serviceType.name)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {slot.serviceType.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(slot.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{slot.time} ({slot.duration} min)</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability Badge */}
                  <div className="flex-shrink-0">
                    {slot.isAvailable && slot.bookedCount < slot.capacity ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {slot.bookedCount >= slot.capacity ? 'Full' : 'Unavailable'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative">
                    {slot.teacher.avatarUrl ? (
                      <Image
                        src={slot.teacher.avatarUrl}
                        alt={slot.teacher.name}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {slot.teacher.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    • {slot.teacher.experience} years exp
                  </span>
                </div>

                {/* Venue Info */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{slot.venue.name}</span>
                  {slot.venue.city && (
                    <span className="text-gray-400">• {slot.venue.city}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* View All Button */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: slots.length * 0.1 }}
            className="text-center pt-4"
          >
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              View All Classes
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
