'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MapPinIcon, XIcon, UserIcon, AlertTriangleIcon, MoreVerticalIcon } from 'lucide-react';

type ViewMode = 'weekly' | 'monthly';

export default function TeacherSchedulePage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>('weekly');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<Array<any>>([]);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<any>(null);
  const [substituteTeachers, setSubstituteTeachers] = React.useState<Array<any>>([]);
  const [cancelling, setCancelling] = React.useState(false);
  const [showLateModal, setShowLateModal] = React.useState(false);
  const [lateMinutes, setLateMinutes] = React.useState(15);
  const [lateMessage, setLateMessage] = React.useState('');
  const [sendingLate, setSendingLate] = React.useState(false);
  const [showSlotMenu, setShowSlotMenu] = React.useState<number | null>(null);
  const [revertingLate, setRevertingLate] = React.useState(false);
  const [showRevertModal, setShowRevertModal] = React.useState(false);

  const loadSlots = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Derive the visible date range based on current view
      let startDate: string;
      let endDate: string;
      if (viewMode === 'weekly') {
        const week = getWeekDates(currentDate);
        startDate = `${week[0].getFullYear()}-${String(week[0].getMonth() + 1).padStart(2, '0')}-${String(week[0].getDate()).padStart(2, '0')}`;
        endDate = `${week[6].getFullYear()}-${String(week[6].getMonth() + 1).padStart(2, '0')}-${String(week[6].getDate()).padStart(2, '0')}`;
      } else {
        const monthDates = getMonthDates(currentDate);
        startDate = `${monthDates[0].getFullYear()}-${String(monthDates[0].getMonth() + 1).padStart(2, '0')}-${String(monthDates[0].getDate()).padStart(2, '0')}`;
        endDate = `${monthDates[monthDates.length - 1].getFullYear()}-${String(monthDates[monthDates.length - 1].getMonth() + 1).padStart(2, '0')}-${String(monthDates[monthDates.length - 1].getDate()).padStart(2, '0')}`;
      }

      const url = `/api/teacher/slots?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load schedule');
      const j = await res.json();
      setSlots(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading schedule');
    } finally {
      setLoading(false);
    }
  }, [currentDate, viewMode]);

  React.useEffect(() => { loadSlots(); }, [loadSlots]);

  const loadSubstituteTeachers = React.useCallback(async () => {
    try {
      console.log('Loading substitute teachers...');
      const res = await fetch('/api/teacher/substitutes', { cache: 'no-store' });
      console.log('Substitute teachers response:', res.status, res.statusText);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Substitute teachers data:', data);
        setSubstituteTeachers(data.teachers || []);
      } else {
        const errorText = await res.text();
        console.error('Failed to load substitute teachers:', res.status, res.statusText, errorText);
      }
    } catch (e) {
      console.error('Failed to load substitute teachers:', e);
    }
  }, []);

  React.useEffect(() => { loadSubstituteTeachers(); }, [loadSubstituteTeachers]);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowSlotMenu(null);
    };
    
    if (showSlotMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSlotMenu]);

  const handleCancelSlot = (slot: any) => {
    setSelectedSlot(slot);
    setShowCancelModal(true);
  };

  const handleLateNotification = (slot: any) => {
    setSelectedSlot(slot);
    setLateMinutes(15);
    setLateMessage('');
    setShowLateModal(true);
    setShowSlotMenu(null);
  };

  const handleRevertLate = (slot: any) => {
    setSelectedSlot(slot);
    setShowRevertModal(true);
    setShowSlotMenu(null);
  };

  const handleSlotMenuToggle = (slotId: number) => {
    setShowSlotMenu(showSlotMenu === slotId ? null : slotId);
  };

  const confirmCancelSlot = async (transferToTeacherId?: number) => {
    if (!selectedSlot) return;
    
    setCancelling(true);
    try {
      const res = await fetch('/api/teacher/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          action: 'cancel',
          transferToTeacherId
        })
      });
      
      if (res.ok) {
        await loadSlots(); // Refresh the schedule
        setShowCancelModal(false);
        setSelectedSlot(null);
        setShowSlotMenu(null);
      } else {
        throw new Error('Failed to cancel slot');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error cancelling slot');
    } finally {
      setCancelling(false);
    }
  };

  const sendLateNotification = async () => {
    if (!selectedSlot) return;
    
    setSendingLate(true);
    setError(null); // Clear any previous errors
    try {
      console.log('Sending late notification:', {
        slotId: selectedSlot.id,
        lateMinutes: lateMinutes,
        message: lateMessage
      });

      const res = await fetch('/api/teacher/notify-late', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          lateMinutes: lateMinutes,
          message: lateMessage
        })
      });
      
      console.log('Late notification response status:', res.status);
      
      if (res.ok) {
        const responseData = await res.json();
        console.log('Late notification success:', responseData);
        await loadSlots(); // Refresh the schedule to show updated times
        setShowLateModal(false);
        setSelectedSlot(null);
        setLateMessage('');
        setShowSlotMenu(null);
        // Could show a success message here
      } else {
        let errorMessage = 'Failed to send late notification';
        try {
          const errorData = await res.json();
          console.error('Late notification error:', errorData);
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.error('Late notification catch error:', e);
      setError(e instanceof Error ? e.message : 'Error sending notification');
    } finally {
      setSendingLate(false);
    }
  };

  const revertLateNotification = async () => {
    if (!selectedSlot) {
      console.error('🔄 No selected slot for revert');
      setError('No slot selected for revert');
      return;
    }

    setRevertingLate(true);
    setError(null);
    try {
      console.log('🔄 Reverting late notification for slot:', selectedSlot.id);
      
      const response = await fetch('/api/teacher/revert-late', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot.id
        }),
      });

      const data = await response.json();
      console.log('🔄 Revert late notification response:', data);

      if (!response.ok) {
        const errorMessage = data.error || data.details || `HTTP ${response.status}: ${response.statusText}`;
        console.error('🔄 Revert late notification failed:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success) {
        const errorMessage = data.error || data.details || 'Failed to revert late notification';
        console.error('🔄 Revert late notification failed:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('🔄 Late notification reverted successfully');
      
      // Refresh the slots to show the updated data
      await loadSlots();
      
      // Close the modal after successful revert
      setShowRevertModal(false);
      setSelectedSlot(null);
      
    } catch (error) {
      console.error('🔄 Revert late notification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to revert late notification';
      setError(`Revert late notification error: ${errorMessage}`);
    } finally {
      setRevertingLate(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const getSlotsForDate = (date: Date) => {
    // Use local date methods to avoid timezone offset
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return slots.filter(slot => {
      // For late notification slots, use originalStartTime if available
      const slotTime = slot.originalStartTime ? slot.originalStartTime : slot.startTime;
      const slotDate = new Date(slotTime);
      const slotDateStr = `${slotDate.getFullYear()}-${String(slotDate.getMonth() + 1).padStart(2, '0')}-${String(slotDate.getDate()).padStart(2, '0')}`;
      return slotDateStr === dateStr;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date, currentDate: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-[var(--unified-primary)]" />
              <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">My Schedule</h2>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                className={`${teacherUI.tabs.base} ${viewMode === 'weekly' ? teacherUI.tabs.active : teacherUI.tabs.inactive}`}
                onClick={() => setViewMode('weekly')}
              >
                Weekly
              </button>
              <button
                className={`${teacherUI.tabs.base} ${viewMode === 'monthly' ? teacherUI.tabs.active : teacherUI.tabs.inactive}`}
                onClick={() => setViewMode('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>
        
        <div className={teacherUI.card.body}>
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateDate('prev')}
              className={`${teacherUI.tabs.base} ${teacherUI.tabs.inactive}`}
            >
              <ChevronLeftIcon className="h-5 w-5 text-[var(--unified-text-secondary)]" />
            </button>
            
            <h3 className="text-lg font-semibold text-[var(--unified-text-primary)]">
              {viewMode === 'weekly' 
                ? `Week of ${currentDate.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}`
                : currentDate.toLocaleDateString('en-GB', { 
                    month: 'long', 
                    year: 'numeric' 
                  })
              }
            </h3>
            
            <button
              onClick={() => navigateDate('next')}
              className={`${teacherUI.tabs.base} ${teacherUI.tabs.inactive}`}
            >
              <ChevronRightIcon className="h-5 w-5 text-[var(--unified-text-secondary)]" />
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--unified-primary)]"></div>
              <span className="ml-2 text-[var(--color-text-secondary)]">Loading schedule...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {viewMode === 'weekly' ? (
                <WeeklyView 
                  dates={getWeekDates(currentDate)}
                  getSlotsForDate={getSlotsForDate}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  isToday={isToday}
                  onCancelSlot={handleCancelSlot}
                  onLateNotification={handleLateNotification}
                  showSlotMenu={showSlotMenu}
                  onSlotMenuToggle={handleSlotMenuToggle}
                  onRevertLate={handleRevertLate}
                />
              ) : (
                <MonthlyView 
                  dates={getMonthDates(currentDate)}
                  currentDate={currentDate}
                  getSlotsForDate={getSlotsForDate}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  isToday={isToday}
                  isCurrentMonth={isCurrentMonth}
                  onCancelSlot={handleCancelSlot}
                  onLateNotification={handleLateNotification}
                  showSlotMenu={showSlotMenu}
                  onSlotMenuToggle={handleSlotMenuToggle}
                  onRevertLate={handleRevertLate}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Cancel Slot Modal */}
      {showCancelModal && selectedSlot && (
        <CancelSlotModal
          slot={selectedSlot}
          substituteTeachers={substituteTeachers}
          onConfirm={confirmCancelSlot}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedSlot(null);
          }}
          loading={cancelling}
        />
      )}

      {/* Late Notification Modal */}
      {showLateModal && selectedSlot && (
        <LateNotificationModal
          slot={selectedSlot}
          lateMinutes={lateMinutes}
          setLateMinutes={setLateMinutes}
          lateMessage={lateMessage}
          setLateMessage={setLateMessage}
          onConfirm={sendLateNotification}
          onClose={() => {
            setShowLateModal(false);
            setSelectedSlot(null);
            setLateMessage('');
          }}
          loading={sendingLate}
        />
      )}

      {/* Revert Late Notification Modal */}
      {showRevertModal && selectedSlot && (
        <RevertLateModal
          slot={selectedSlot}
          onConfirm={() => revertLateNotification()}
          onClose={() => {
            setShowRevertModal(false);
            setSelectedSlot(null);
          }}
          loading={revertingLate}
        />
      )}
    </div>
  );
}

// Weekly View Component
function WeeklyView({ dates, getSlotsForDate, formatDate, formatTime, isToday, onCancelSlot, onLateNotification, showSlotMenu, onSlotMenuToggle, onRevertLate }: any) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="grid grid-cols-7 gap-4">
      {dates.map((date: Date, index: number) => {
        const daySlots = getSlotsForDate(date);
        return (
          <div key={index} className="min-h-[200px]">
            <div className={`text-center p-3 rounded-lg mb-2 ${
              isToday(date) 
                ? 'bg-[var(--unified-primary)] text-[var(--unified-primary-contrast)]' 
                : 'bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]'
            }`}>
              <div className="text-sm font-medium">{weekDays[index]}</div>
              <div className="text-lg font-semibold">{formatDate(date)}</div>
            </div>
            
            <div className="space-y-2">
              {daySlots.length === 0 ? (
                <p className="text-[var(--unified-text-secondary)] text-sm text-center py-4">No slots</p>
              ) : (
                daySlots.map((slot: any) => {
                  const capacity = slot.maxBookings || 12;
                  const bookedCount = slot.bookedCount || 0;
                  const availableSpots = capacity - bookedCount;
                  const isFullyBooked = availableSpots <= 0;
                  
                  return (
                    <div key={slot.id} className={`p-2 rounded-lg border text-xs relative group ${
                      slot.isAvailable && !isFullyBooked
                        ? 'bg-[var(--unified-accent)]/15 border-[var(--unified-accent-dark)] text-[var(--unified-text-primary)]' 
                        : 'bg-[var(--color-status-error)]/10 border-[var(--color-status-error)]/30 text-[var(--unified-text-primary)]'
                    }`}>
                      <div className="font-medium">{formatTime(new Date(slot.originalStartTime ?? slot.startTime))}</div>
                      {slot.isLate && (
                        <div className="text-xs text-[var(--color-status-warning)] font-medium">
                          ⚠️ Running Late ({slot.lateMinutes} min)
                        </div>
                      )}
                      <div className="text-xs opacity-75">
                        {slot.teacherSchedule?.serviceType?.name}
                      </div>
                      {/* Available Spots Info */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${slot.isLate ? 'bg-[var(--color-status-warning)]' : (slot.isAvailable && !isFullyBooked ? 'bg-[var(--unified-accent-dark)]' : 'bg-[var(--color-status-error)]')}`}></div>
                        <span className="text-xs">
                          {availableSpots} of {capacity} spots
                        </span>
                      </div>
                    {slot.isAvailable && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={() => onSlotMenuToggle(slot.id)}
                            className={`${teacherUI.tabs.base} ${teacherUI.tabs.inactive} p-1`
                            }
                            title="Slot options"
                          >
                            <MoreVerticalIcon className="h-3 w-3" />
                          </button>
                          
                          {showSlotMenu === slot.id && (
                            <div className="absolute right-0 top-8 bg-[var(--unified-bg-surface)] border border-[var(--unified-border-light)] rounded-lg shadow-lg z-10 min-w-[160px]">
                              {slot.isLate ? (
                                <button
                                  onClick={() => onRevertLate(slot)}
                                  className="w-full px-3 py-2 text-left text-sm text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] flex items-center gap-2"
                                >
                                  <ClockIcon className="h-4 w-4 text-[var(--unified-accent-dark)]" />
                                  Revert Late
                                </button>
                              ) : (
                                <button
                                  onClick={() => onLateNotification(slot)}
                                  className="w-full px-3 py-2 text-left text-sm text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] flex items-center gap-2"
                                >
                                  <ClockIcon className="h-4 w-4 text-[var(--color-status-warning)]" />
                                  Notify Late
                                </button>
                              )}
                              <button
                                onClick={() => onCancelSlot(slot)}
                                className="w-full px-3 py-2 text-left text-sm text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] flex items-center gap-2"
                              >
                                <XIcon className="h-4 w-4 text-[var(--color-status-error)]" />
                                Cancel Class
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Monthly View Component
function MonthlyView({ dates, currentDate, getSlotsForDate, formatDate, formatTime, isToday, isCurrentMonth, onCancelSlot, onLateNotification, showSlotMenu, onSlotMenuToggle, onRevertLate }: any) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="space-y-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center p-2 font-medium text-gray-600 text-sm">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date: Date, index: number) => {
          const daySlots = getSlotsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date, currentDate);
          
          return (
            <div 
              key={index} 
              className={`min-h-[120px] p-2 border rounded-lg ${
                isCurrentMonthDay 
                  ? 'bg-white border-gray-200' 
                  : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className={`text-sm font-medium mb-2 ${
                isToday(date) 
                  ? 'text-[var(--unified-primary)] font-bold' 
                  : isCurrentMonthDay 
                    ? 'text-gray-800' 
                    : 'text-gray-400'
              }`}>
                {formatDate(date)}
              </div>
              
              <div className="space-y-1">
                {daySlots.slice(0, 3).map((slot: any) => {
                  const capacity = slot.maxBookings || 12;
                  const bookedCount = slot.bookedCount || 0;
                  const availableSpots = capacity - bookedCount;
                  const isFullyBooked = availableSpots <= 0;
                  
                  return (
                    <div key={slot.id} className={`p-1 rounded text-xs relative group ${
                      slot.isAvailable && !isFullyBooked
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <div className="font-medium">{formatTime(new Date(slot.originalStartTime ?? slot.startTime))}</div>
                      {slot.isLate && (
                        <div className="text-xs text-red-600 font-medium">
                          ⚠️ Late ({slot.lateMinutes}min)
                        </div>
                      )}
                      {/* Available Spots Info */}
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${slot.isLate ? 'bg-yellow-500' : (slot.isAvailable && !isFullyBooked ? 'bg-green-500' : 'bg-red-500')}`}></div>
                        <span className="text-xs">
                          {availableSpots}/{capacity}
                        </span>
                      </div>
                    {slot.isAvailable && (
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative">
                          <button
                            onClick={() => onSlotMenuToggle(slot.id)}
                            className="p-0.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                            title="Slot options"
                          >
                            <MoreVerticalIcon className="h-2 w-2" />
                          </button>
                          
                          {showSlotMenu === slot.id && (
                            <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                              {slot.isLate ? (
                                <button
                                  onClick={() => onRevertLate(slot)}
                                  className="w-full px-2 py-1 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                >
                                  <ClockIcon className="h-3 w-3 text-green-600" />
                                  Revert Late
                                </button>
                              ) : (
                                <button
                                  onClick={() => onLateNotification(slot)}
                                  className="w-full px-2 py-1 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                                >
                                  <ClockIcon className="h-3 w-3 text-yellow-600" />
                                  Notify Late
                                </button>
                              )}
                              <button
                                onClick={() => onCancelSlot(slot)}
                                className="w-full px-2 py-1 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-1"
                              >
                                <XIcon className="h-3 w-3 text-red-600" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  );
                })}
                {daySlots.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{daySlots.length - 3} more
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

// Cancel Slot Modal Component
function CancelSlotModal({ slot, substituteTeachers, onConfirm, onClose, loading }: any) {
  const [selectedSubstitute, setSelectedSubstitute] = React.useState<number | null>(null);
  const [cancelType, setCancelType] = React.useState<'cancel' | 'transfer'>('cancel');

  const handleConfirm = () => {
    if (cancelType === 'transfer' && selectedSubstitute) {
      onConfirm(selectedSubstitute);
    } else {
      onConfirm();
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangleIcon className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Cancel Schedule Slot</h3>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Slot Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Service:</strong> {slot.teacherSchedule?.serviceType?.name}</div>
              <div><strong>Date & Time:</strong> {formatDateTime(new Date(slot.startTime))}</div>
              <div><strong>Venue:</strong> {slot.teacherSchedule?.venue?.name}</div>
              <div><strong>Duration:</strong> {Math.round((new Date(slot.endTime).getTime() - new Date(slot.startTime).getTime()) / (1000 * 60))} minutes</div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="cancelType"
                value="cancel"
                checked={cancelType === 'cancel'}
                onChange={(e) => setCancelType(e.target.value as 'cancel')}
                className="text-red-600"
              />
              <div>
                <div className="font-medium text-gray-800">Cancel the class</div>
                <div className="text-sm text-gray-600">Students will be notified and can reschedule</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="cancelType"
                value="transfer"
                checked={cancelType === 'transfer'}
                onChange={(e) => setCancelType(e.target.value as 'transfer')}
                className="text-red-600"
              />
              <div>
                <div className="font-medium text-gray-800">Transfer to substitute teacher</div>
                <div className="text-sm text-gray-600">Another teacher will take over this class</div>
              </div>
            </label>
          </div>

          {cancelType === 'transfer' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Substitute Teacher
              </label>
              {substituteTeachers.length === 0 ? (
                <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                  Loading available teachers...
                </div>
              ) : (
                <select
                  value={selectedSubstitute || ''}
                  onChange={(e) => setSelectedSubstitute(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--unified-primary)] focus:border-transparent"
                >
                  <option value="">Choose a teacher...</option>
                  {substituteTeachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name || teacher.fullName} - {teacher.venue?.name || 'No venue'} ({teacher.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (cancelType === 'transfer' && !selectedSubstitute)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {cancelType === 'transfer' ? 'Transfer Class' : 'Cancel Class'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Late Notification Modal Component
function LateNotificationModal({ slot, lateMinutes, setLateMinutes, lateMessage, setLateMessage, onConfirm, onClose, loading }: any) {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNewStartTime = () => {
    const originalStart = new Date(slot.startTime);
    const newStart = new Date(originalStart.getTime() + (lateMinutes * 60 * 1000));
    return newStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Notify Running Late</h3>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Class Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div><strong>Service:</strong> {slot.teacherSchedule?.serviceType?.name}</div>
              <div><strong>Original Time:</strong> {formatDateTime(new Date(slot.startTime))}</div>
              <div><strong>New Start Time:</strong> {getNewStartTime()}</div>
              <div><strong>Venue:</strong> {slot.teacherSchedule?.venue?.name}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="unified-form-label">
                How many minutes late will you be?
              </label>
              <select
                value={lateMinutes}
                onChange={(e) => setLateMinutes(Number(e.target.value))}
                className="unified-form-select"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div>
              <label className="unified-form-label">
                Additional Message (Optional)
              </label>
              <textarea
                value={lateMessage}
                onChange={(e) => setLateMessage(e.target.value)}
                placeholder="e.g., Traffic jam, please wait for me..."
                className="unified-form-textarea resize-none"
                rows={3}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 mt-1">
                {lateMessage.length}/200 characters
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                <strong>What happens next:</strong>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Students will receive an email notification</li>
                  <li>• The class start time will be updated</li>
                  <li>• Students can choose to wait or reschedule</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}

// Revert Late Notification Modal Component
function RevertLateModal({ slot, onConfirm, onClose, loading }: any) {
  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revert Late Notification</h3>
              <p className="text-sm text-gray-600">Restore original class time</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Class Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Service:</strong> {slot.teacherSchedule?.serviceType?.name}</div>
                <div><strong>Venue:</strong> {slot.teacherSchedule?.venue?.name}</div>
                <div><strong>Current Time:</strong> {formatDateTime(new Date(slot.startTime))}</div>
                {slot.originalStartTime && (
                  <div><strong>Original Time:</strong> {formatDateTime(new Date(slot.originalStartTime))}</div>
                )}
                <div><strong>Students:</strong> {slot.bookings?.length || 0} booked</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-green-600 mt-0.5">✅</div>
                <div className="text-sm text-green-800">
                  <strong>What will happen:</strong>
                  <ul className="mt-1 space-y-1 text-green-700">
                    <li>• Class time will be restored to original schedule</li>
                    <li>• Students will be notified of the time change</li>
                    <li>• Late notification will be removed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              Revert to Original Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


