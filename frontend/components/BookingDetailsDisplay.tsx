'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/useTranslations';

interface BookingDetails {
  selectedDate?: string;
  selectedTime?: string;
  teacher?: string;
  dayOfWeek?: string;
  serviceType?: string;
  venue?: string;
  scheduleSlotId?: number;
}

interface BookingDetailsDisplayProps {
  bookingDetails: BookingDetails;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function BookingDetailsDisplay({ 
  bookingDetails, 
  className = '', 
  showTitle = true,
  compact = false 
}: BookingDetailsDisplayProps) {
  const { language } = useLanguage();
  
  if (!bookingDetails || (!bookingDetails.selectedDate && !bookingDetails.selectedTime)) {
    return null;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const locale = language === 'es' ? 'es-ES' : 'en-US';
      return date.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      const locale = language === 'es' ? 'es-ES' : 'en-US';
      return date.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  if (compact) {
    return (
      <div className={`text-xs text-gray-600 space-y-1 ${className}`}>
        {bookingDetails.selectedDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(bookingDetails.selectedDate)}</span>
          </div>
        )}
        {bookingDetails.selectedTime && (
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(bookingDetails.selectedTime)}</span>
          </div>
        )}
        {bookingDetails.venue && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{bookingDetails.venue}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-900">Scheduled Session</h4>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {bookingDetails.selectedDate && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{formatDate(bookingDetails.selectedDate)}</span>
          </div>
        )}
        
        {bookingDetails.selectedTime && (
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{formatTime(bookingDetails.selectedTime)}</span>
          </div>
        )}
        
        {bookingDetails.teacher && (
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            <span>{bookingDetails.teacher}</span>
          </div>
        )}
        
        {bookingDetails.serviceType && (
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{bookingDetails.serviceType}</span>
          </div>
        )}
        
        {bookingDetails.venue && (
          <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{bookingDetails.venue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
