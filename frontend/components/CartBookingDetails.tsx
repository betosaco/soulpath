'use client';

import React from 'react';
import { Calendar, Clock, MapPin, User, X, Edit3 } from 'lucide-react';

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
}

export function CartBookingDetails({ 
  bookingDetails, 
  className = '', 
  onRemove, 
  onEdit, 
  onAddMore,
  showActions = false,
  packageSessions = 0,
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
      // Parse the date string as local date to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
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
    <div className={`bg-secondary rounded-lg p-3 w-full border border-border ${className}`}>
      {/* Header with Class Type and Session Count */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Scheduled Classes ({bookings.length}{packageSessions > 0 ? `/${packageSessions}` : ''})
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showActions && canAddMore && onAddMore && (
            <button
              onClick={onAddMore}
              className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full hover:bg-primary/90 transition-colors"
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
          <div key={index} className="rounded-lg p-2" style={{ border: '1px solid color-mix(in srgb, var(--color-status-success) 25%, transparent)', background: 'color-mix(in srgb, var(--color-status-success) 8%, transparent)' }}>
            {/* Service Type Badge */}
            {booking.serviceType && (
              <div className="mb-2">
                <div className="bg-muted text-foreground px-2 py-1 rounded-full text-xs font-medium inline-block">
                  {booking.serviceType}
                </div>
              </div>
            )}

            {/* Main Booking Info */}
            <div className="space-y-2">
              {/* Date and Time */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatDate(booking.selectedDate || '')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">{formatTime(booking.selectedTime || '')}</span>
                </div>
              </div>

              {/* Complete Session Details */}
              <div className="space-y-2">
                {booking.teacher && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">Teacher:</span>
                    </div>
                    <span className="text-foreground font-medium">{booking.teacher}</span>
                  </div>
                )}
                
                {booking.dayOfWeek && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium">Day:</span>
                    </div>
                    <span className="text-foreground">{booking.dayOfWeek}</span>
                  </div>
                )}
                
                {booking.venue && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-medium">Location:</span>
                    </div>
                    <span className="text-foreground">{booking.venue}</span>
                  </div>
                )}

                {booking.scheduleSlotId && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-3.5 h-3.5 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">#</span>
                      </div>
                      <span className="font-medium">Slot ID:</span>
                    </div>
                    <span className="text-foreground font-mono text-xs">{booking.scheduleSlotId}</span>
                  </div>
                )}
              </div>

              {/* Actions for individual booking */}
              {showActions && (onEdit || onRemove) && (
                <div className="flex items-center justify-end gap-1 pt-2 border-t border-border">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(index)}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                      title="Change schedule"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                  {onRemove && (
                    <button
                      onClick={() => onRemove(index)}
                      className="p-1 text-muted-foreground hover:text-[var(--color-status-error)] transition-colors"
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
