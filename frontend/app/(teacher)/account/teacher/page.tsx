'use client';

import React from 'react';
import { CalendarIcon, UsersIcon, ClockIcon, TrendingUpIcon } from 'lucide-react';
import { teacherUI } from '@/lib/styles/teacher-ui';

type Slot = {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  bookedCount: number | null;
  maxBookings: number | null;
  isLate?: boolean | null;
  lateMinutes?: number | null;
  lateMessage?: string | null;
  originalStartTime?: string | null;
  originalEndTime?: string | null;
  teacherSchedule?: {
    serviceType?: { id: number; name: string; duration?: number | null } | null;
    venue?: { id: number; name: string; city?: string | null } | null;
  } | null;
  bookings?: Array<{
    id: number;
    status: string | null;
    user?: { id: string; email: string | null; fullName?: string | null; phone?: string | null } | null;
  }>;
};

type Booking = {
  id: number;
  status: string | null;
  sessionType: string | null;
  notes?: string | null;
  cancelledReason?: string | null;
  teacherScheduleSlot?: {
    id: number;
    startTime: string;
    endTime: string;
    teacherSchedule?: {
      serviceType?: { id: number; name: string; duration?: number | null } | null;
      venue?: { id: number; name: string; city?: string | null } | null;
    } | null;
  } | null;
  user?: { id: string; email: string | null; fullName?: string | null; phone?: string | null } | null;
};

export default function TeacherDashboardPage() {
  console.log('🏠 Teacher Dashboard: Component rendering...');
  console.log('🏠 Teacher Dashboard: Component file loaded successfully');
  
  const [loading, setLoading] = React.useState(true);
  const [slots, setSlots] = React.useState<Slot[]>([]);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [stats, setStats] = React.useState<{
    todayBookings: number;
    upcomingSessions: number;
    totalStudents: number;
    rating: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'slots' | 'bookings'>('slots');

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading teacher dashboard data...');
      
      const dashboardRes = await fetch('/api/teacher/dashboard?days=30&status=upcoming&limit=50', { cache: 'no-store' });

      console.log('📊 API responses:', { dashboardStatus: dashboardRes.status });

      if (!dashboardRes.ok) {
        const dashError = await dashboardRes.text();
        console.error('❌ Dashboard API error:', dashError);
        throw new Error(`Failed to load dashboard: ${dashboardRes.status} ${dashError}`);
      }

      const dashboardJson = await dashboardRes.json();
      
      console.log('📊 Loaded data:', { 
        slotsCount: dashboardJson.data?.slots?.length || 0, 
        bookingsCount: dashboardJson.data?.bookings?.length || 0,
        statsData: dashboardJson.data?.stats,
      });
      
      setSlots(dashboardJson.data?.slots || []);
      setBookings(dashboardJson.data?.bookings || []);
      setStats(dashboardJson.data?.stats || null);
    } catch (e) {
      console.error('❌ Load data error:', e);
      setError(e instanceof Error ? e.message : 'Error loading data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    console.log('🔄 Teacher Dashboard: useEffect triggered, calling loadData...');
    loadData();
  }, [loadData]);

  const cancelSlot = async (slotId: number) => {
    if (!confirm('Cancel this slot and notify affected bookings?')) return;
    const res = await fetch('/api/teacher/slots', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId })
    });
    if (res.ok) {
      await loadData();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to cancel slot');
    }
  };

  const cancelBooking = async (bookingId: number) => {
    if (!confirm('Cancel this booking?')) return;
    const res = await fetch('/api/teacher/bookings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId })
    });
    if (res.ok) {
      await loadData();
    } else {
      const j = await res.json().catch(() => ({}));
      alert(j.error || 'Failed to cancel booking');
    }
  };

  const formatDate = (iso: string | Date | null | undefined) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  };

  // Use stats from API or fallback to calculated values
  const todayBookings = stats?.todayBookings || 0;
  const upcomingBookings = stats?.upcomingSessions || bookings.length;
  const availableSlots = slots.filter(s => s.isAvailable).length;

  console.log('📊 Teacher Dashboard state:', {
    loading,
    slotsCount: slots.length,
    bookingsCount: bookings.length,
    stats,
    error,
    activeTab,
    availableSlots,
    todayBookings,
    upcomingBookings
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={teacherUI.card.container + ' p-6'}>
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-primary-500)] rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--unified-text-secondary)]">Today's Bookings</p>
              <p className="text-2xl font-bold text-[var(--unified-text-primary)]">{todayBookings}</p>
            </div>
          </div>
        </div>

        <div className={teacherUI.card.container + ' p-6'}>
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-primary-500)] rounded-lg">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--unified-text-secondary)]">Upcoming Sessions</p>
              <p className="text-2xl font-bold text-[var(--unified-text-primary)]">{upcomingBookings}</p>
            </div>
          </div>
        </div>

        <div className={teacherUI.card.container + ' p-6'}>
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-primary-500)] rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--unified-text-secondary)]">Available Slots</p>
              <p className="text-2xl font-bold text-[var(--unified-text-primary)]">{availableSlots}</p>
            </div>
          </div>
        </div>

        <div className={teacherUI.card.container + ' p-6'}>
          <div className="flex items-center">
            <div className="p-2 bg-[var(--color-primary-500)] rounded-lg">
              <TrendingUpIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--unified-text-secondary)]">Total Students</p>
              <p className="text-2xl font-bold text-[var(--unified-text-primary)]">{stats?.totalStudents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Teacher Dashboard</h2>
            <button onClick={loadData} className={teacherUI.button.primary}>
              Refresh
            </button>
          </div>
        </div>

        <div className={teacherUI.card.body}>
          <div className="flex gap-2 mb-6">
            <button
              className={`${teacherUI.tabs.base} ${activeTab === 'slots' ? teacherUI.tabs.active : teacherUI.tabs.inactive}`}
              onClick={() => setActiveTab('slots')}
            >
              Available Schedule
            </button>
            <button
              className={`${teacherUI.tabs.base} ${activeTab === 'bookings' ? teacherUI.tabs.active : teacherUI.tabs.inactive}`}
              onClick={() => setActiveTab('bookings')}
            >
              Upcoming Bookings
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)]"></div>
              <span className="ml-2 text-[var(--color-text-secondary)]">Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && activeTab === 'slots' && (
            <div className="space-y-4">
              {/* Show loading state if no data yet */}
              {slots.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-[var(--unified-text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--unified-text-secondary)]">No available slots found</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {loading ? 'Loading...' : 'No slots available for the next 30 days'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Subtle indicator of loaded data */}
                  <div className="text-xs text-[var(--unified-text-secondary)] text-right">
                    Showing {slots.length} schedule slot{slots.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="grid gap-4">
                    {slots.map((slot) => {
                    const capacity = slot.maxBookings || 12;
                    const bookedCount = slot.bookedCount || 0;
                    const availableSpots = capacity - bookedCount;
                    const isFullyBooked = availableSpots <= 0;
                    const isAvailable = slot.isAvailable && !isFullyBooked;
                    
                    return (
                      <div key={slot.id} className={`rounded-lg p-4 border transition-colors ${
                       isAvailable 
                           ? 'bg-[var(--unified-accent)]/15 border-[var(--unified-accent-dark)] hover:bg-[var(--unified-accent)]/25' 
                           : 'bg-[var(--color-status-error)]/10 border-[var(--color-status-error)]/30 hover:bg-[var(--color-status-error)]/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-[var(--unified-text-primary)]">
                                {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
                              </p>
                              <span className={`${teacherUI.badge.base} ${isAvailable ? teacherUI.badge.available : teacherUI.badge.unavailable}`}>
                                {isAvailable ? 'Available' : 'Fully Booked'}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--unified-text-secondary)] mb-1">
                              {slot.teacherSchedule?.serviceType?.name} at {slot.teacherSchedule?.venue?.name}
                            </p>
                            {/* Available Spots Info - matching EnhancedSchedule format */}
                            <div className="flex items-center gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                 <div className={`w-2 h-2 rounded-full ${slot.isLate ? 'bg-[var(--color-status-warning)]' : 'bg-[var(--unified-accent-dark)]'}`}></div>
                                <span className="text-[var(--unified-text-secondary)]">
                                  {availableSpots} of {capacity} spots available
                                </span>
                              </div>
                              {bookedCount > 0 && (
                                <span className="text-xs text-[var(--unified-text-secondary)]">
                                  ({bookedCount} booked)
                                </span>
                              )}
                            </div>
                            
                            {slot.isLate && (
                              <div className="mt-2 text-xs text-[var(--color-status-warning)] font-medium">
                                ⚠️ Running Late ({slot.lateMinutes} min)
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <button 
                              onClick={() => cancelSlot(slot.id)} 
                              className={teacherUI.button.dangerSm + ' text-sm'}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && !error && activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--color-text-secondary)]">No upcoming bookings found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="bg-[var(--color-sidebar-600)] rounded-lg p-4 border border-[var(--color-border-500)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--color-text-inverse)]">
                            {booking.user?.fullName || booking.user?.email || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {formatDate(booking.teacherScheduleSlot?.startTime)} - {formatDate(booking.teacherScheduleSlot?.endTime)}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {booking.teacherScheduleSlot?.teacherSchedule?.serviceType?.name} at {booking.teacherScheduleSlot?.teacherSchedule?.venue?.name}
                          </p>
                          {booking.notes && (
                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                              Notes: {booking.notes}
                            </p>
                          )}
                        </div>
                        <button onClick={() => cancelBooking(booking.id)} className={teacherUI.button.dangerSm}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
