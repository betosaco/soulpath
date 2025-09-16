'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  UserCheck, 
  Building, 
  Users,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { UnifiedSchedule, CalendarEvent, ScheduleType } from '@/types/schedule';

interface ScheduleCalendarViewProps {
  schedules: UnifiedSchedule[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onConflictCheck: (schedule: UnifiedSchedule) => void;
}

export function ScheduleCalendarView({ 
  schedules, 
  currentDate, 
  onDateChange, 
  onEventClick
  // onConflictCheck 
}: ScheduleCalendarViewProps) {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(currentDate);

  // Generate calendar events from schedules
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    const startOfWeek = getStartOfWeek(selectedDate);
    
    schedules.forEach(schedule => {
      const dayIndex = getDayIndex(schedule.dayOfWeek);
      const eventDate = new Date(startOfWeek);
      eventDate.setDate(startOfWeek.getDate() + dayIndex);
      
      const startTime = parseTime(schedule.startTime);
      const endTime = parseTime(schedule.endTime);
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(startTime.hours, startTime.minutes, 0, 0);
      
      const endDateTime = new Date(eventDate);
      endDateTime.setHours(endTime.hours, endTime.minutes, 0, 0);
      
      const event: CalendarEvent = {
        id: `${schedule.type}-${schedule.id}`,
        title: getEventTitle(schedule),
        start: startDateTime,
        end: endDateTime,
        type: schedule.type,
        schedule,
        color: schedule.type === 'teacher' ? '#3b82f6' : 
               schedule.type === 'venue' ? '#10b981' : '#6b7280',
        isAvailable: schedule.isAvailable,
        bookedCount: 0, // This would come from schedule slots
        maxBookings: schedule.maxBookings
      };
      
      events.push(event);
    });
    
    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [schedules, selectedDate]);

  // Get calendar days for the current view
  const calendarDays = useMemo(() => {
    if (view === 'week') {
      return getWeekDays(selectedDate);
    } else {
      return getMonthDays(selectedDate);
    }
  }, [selectedDate, view]);

  // Get events for a specific day (unused function removed)
  // const getEventsForDay = (date: Date) => {
  //   return calendarEvents.filter(event => 
  //     event.start.toDateString() === date.toDateString()
  //   );
  // };

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(selectedDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(selectedDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onDateChange(today);
  };

  // Get event type icon
  const getEventTypeIcon = (type: ScheduleType) => {
    switch (type) {
      case 'teacher': return <UserCheck className="w-3 h-3" />;
      case 'venue': return <Building className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  // Get event color (unused function removed)
  // const getEventColor = (type: ScheduleType) => {
  //   switch (type) {
  //     case 'teacher': return '#3b82f6';
  //     case 'venue': return '#10b981';
  //     case 'general': return '#8b5cf6';
  //     default: return '#6b7280';
  //   }
  // };

  // Get event title
  const getEventTitle = (schedule: UnifiedSchedule) => {
    switch (schedule.type) {
      case 'teacher':
        return `${schedule.teacher?.name || 'Teacher'} - ${schedule.venue?.name || 'Venue'}`;
      case 'venue':
        return `${schedule.venue?.name || 'Venue'} (${schedule.capacity} capacity)`;
      default:
        return 'Schedule';
    }
  };

  return (
    <div className="schedule-calendar-view">
      {/* Calendar Header */}
      <div className="schedule-calendar-view__header">
        <div className="schedule-calendar-view__navigation">
          <button
            onClick={goToPrevious}
            className="schedule-calendar-view__nav-button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={goToToday}
            className="schedule-calendar-view__today-button"
          >
            Today
          </button>
          
          <button
            onClick={goToNext}
            className="schedule-calendar-view__nav-button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="schedule-calendar-view__title">
          <h2 className="schedule-calendar-view__title-text">
            {view === 'week' 
              ? `Week of ${getWeekStartDate(selectedDate).toLocaleDateString()}`
              : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            }
          </h2>
        </div>

        <div className="schedule-calendar-view__view-toggle">
          <button
            onClick={() => setView('week')}
            className={`schedule-calendar-view__view-button ${view === 'week' ? 'active' : ''}`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`schedule-calendar-view__view-button ${view === 'month' ? 'active' : ''}`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="schedule-calendar-view__grid">
        {view === 'week' ? (
          <WeekView 
            days={calendarDays}
            events={calendarEvents}
            onEventClick={onEventClick}
            getEventTypeIcon={getEventTypeIcon}
          />
        ) : (
          <MonthView 
            days={calendarDays}
            events={calendarEvents}
            onEventClick={onEventClick}
            getEventTypeIcon={getEventTypeIcon}
          />
        )}
      </div>
    </div>
  );
}

// Week View Component
function WeekView({ 
  days, 
  events, 
  onEventClick, 
  getEventTypeIcon
}: {
  days: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventTypeIcon: (type: ScheduleType) => React.ReactNode;
}) {
  return (
    <div className="schedule-calendar-view__week">
      {/* Day Headers */}
      <div className="schedule-calendar-view__week-header">
        {days.map((day, index) => (
          <div key={index} className="schedule-calendar-view__day-header">
            <div className="schedule-calendar-view__day-name">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="schedule-calendar-view__day-number">
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Day Columns */}
      <div className="schedule-calendar-view__week-content">
        {days.map((day, dayIndex) => {
          const dayEvents = events.filter(event => 
            event.start.toDateString() === day.toDateString()
          );

          return (
            <div key={dayIndex} className="schedule-calendar-view__day-column">
              <div className="schedule-calendar-view__day-events">
                {dayEvents.map((event, eventIndex) => (
                  <motion.div
                    key={eventIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="schedule-calendar-view__event"
                    style={{ 
                      backgroundColor: event.color + '20',
                      borderLeftColor: event.color,
                      borderLeftWidth: '4px'
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="schedule-calendar-view__event-header">
                      <div className="schedule-calendar-view__event-type">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // onConflictCheck(event.schedule);
                        }}
                        className="schedule-calendar-view__conflict-button"
                        title="Check conflicts"
                      >
                        <AlertTriangle className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="schedule-calendar-view__event-title">
                      {event.title}
                    </div>
                    
                    <div className="schedule-calendar-view__event-time">
                      <Clock className="w-3 h-3" />
                      {event.start.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                      {' - '}
                      {event.end.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>

                    <div className="schedule-calendar-view__event-details">
                      <div className="schedule-calendar-view__event-status">
                        {event.isAvailable ? (
                          <span className="schedule-calendar-view__status-available">
                            Available
                          </span>
                        ) : (
                          <span className="schedule-calendar-view__status-unavailable">
                            Unavailable
                          </span>
                        )}
                      </div>
                      
                      <div className="schedule-calendar-view__event-capacity">
                        <Users className="w-3 h-3" />
                        {event.bookedCount}/{event.maxBookings}
                      </div>
                    </div>

                    {'venue' in event.schedule && event.schedule.venue && (
                      <div className="schedule-calendar-view__event-venue">
                        <MapPin className="w-3 h-3" />
                        {event.schedule.venue.name}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ 
  days, 
  events, 
  onEventClick, 
  getEventTypeIcon
}: {
  days: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  getEventTypeIcon: (type: ScheduleType) => React.ReactNode;
}) {
  return (
    <div className="schedule-calendar-view__month">
      {/* Month Grid */}
      <div className="schedule-calendar-view__month-grid">
        {days.map((day, index) => {
          const dayEvents = events.filter(event => 
            event.start.toDateString() === day.toDateString()
          );
          const isToday = day.toDateString() === new Date().toDateString();
          const isCurrentMonth = day.getMonth() === new Date().getMonth();

          return (
            <div 
              key={index} 
              className={`schedule-calendar-view__month-day ${isToday ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
            >
              <div className="schedule-calendar-view__day-header">
                <span className="schedule-calendar-view__day-number">
                  {day.getDate()}
                </span>
              </div>
              
              <div className="schedule-calendar-view__day-events">
                {dayEvents.slice(0, 3).map((event, eventIndex) => (
                  <motion.div
                    key={eventIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="schedule-calendar-view__month-event"
                    style={{ 
                      backgroundColor: event.color + '20',
                      borderLeftColor: event.color,
                      borderLeftWidth: '3px'
                    }}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="schedule-calendar-view__event-type">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="schedule-calendar-view__event-title">
                      {event.title}
                    </div>
                  </motion.div>
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="schedule-calendar-view__more-events">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper functions
function getStartOfWeek(date: Date): Date {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  return startOfWeek;
}

function getWeekDays(date: Date): Date[] {
  const startOfWeek = getStartOfWeek(date);
  const days: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  
  return days;
}

function getMonthDays(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = getStartOfWeek(firstDay);
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
  
  const days: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

function getDayIndex(dayOfWeek: string): number {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(dayOfWeek);
}

function parseTime(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

function getWeekStartDate(date: Date): Date {
  return getStartOfWeek(date);
}

