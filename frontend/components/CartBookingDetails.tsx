'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User, Users, X, Edit3 } from 'lucide-react';

interface BookingDetails {
  selectedDate?: string;
  selectedTime?: string;
  teacher?: string;
  dayOfWeek?: string;
  serviceType?: string;
  venue?: string;
  scheduleSlotId?: number;
}

interface CartBookingDetailsProps {
  bookingDetails: BookingDetails | BookingDetails[];
  className?: string;
  onRemove?: (index?: number) => void;
  onEdit?: (index?: number) => void;
  onAddMore?: () => void;
  showActions?: boolean;
  packageSessions?: number;
  packageId?: string;
}

export function CartBookingDetails({ 
  bookingDetails, 
  className = '',
  onRemove,
  onEdit,
  onAddMore,
  showActions = false,
  packageSessions = 0,
  packageId
}: CartBookingDetailsProps) {
  // Handle both single booking and array of bookings
  const bookings = Array.isArray(bookingDetails) ? bookingDetails : [bookingDetails];
  const hasBookings = bookings.length > 0 && bookings.some(booking => 
    booking.selectedDate || booking.selectedTime
  );

  if (!hasBookings) {
    return null;
  }

  const canAddMore = packageSessions > 0 && bookings.length < packageSessions;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
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
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-3 w-full border border-gray-200 ${className}`}>
      {/* Header with Class Type and Session Count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Scheduled Classes ({bookings.length}{packageSessions > 0 ? `/${packageSessions}` : ''})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showActions && canAddMore && onAddMore && (
            <button
              onClick={onAddMore}
              className="px-2 py-1 bg-primary text-white text-xs rounded-full hover:bg-primary/90 transition-colors"
              title="Add more classes"
            >
              + Add More
            </button>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {bookings.map((booking, index) => (
          <div key={index} className="border border-green-200 rounded-lg p-2 bg-green-50">
            {/* Service Type Badge */}
            {booking.serviceType && (
              <div className="mb-2">
                <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium inline-block">
                  {booking.serviceType}
                </div>
              </div>
            )}

            {/* Main Booking Info */}
            <div className="space-y-2">
              {/* Date and Time */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-medium">{formatDate(booking.selectedDate || '')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-medium">{formatTime(booking.selectedTime || '')}</span>
                </div>
              </div>

              {/* Teacher and Venue */}
              <div className="space-y-2">
                {booking.teacher && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium">Teacher:</span>
                    </div>
                    <span className="text-gray-700 font-medium">{booking.teacher}</span>
                  </div>
                )}
                
                {booking.venue && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium">Location:</span>
                    </div>
                    <span className="text-gray-700">{booking.venue}</span>
                  </div>
                )}
              </div>

              {/* Actions for individual booking */}
              {showActions && (onEdit || onRemove) && (
                <div className="flex items-center justify-end gap-1 pt-2 border-t border-gray-100">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(index)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Change schedule"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove schedule"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
