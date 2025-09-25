'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { BookOpenIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function TeacherBookingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<Array<any>>([]);
  const [status, setStatus] = React.useState<'upcoming' | 'past' | 'all'>('upcoming');

  const loadBookings = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teacher/bookings?status=${status}&limit=50`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load bookings');
      const j = await res.json();
      setBookings(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading bookings');
    } finally {
      setLoading(false);
    }
  }, [status]);

  React.useEffect(() => { loadBookings(); }, [loadBookings]);

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <BookOpenIcon className="h-5 w-5 text-[var(--unified-primary)]" />
            <h2 className="text-xl font-semibold text-gray-800">My Bookings</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          <div className="flex gap-2 mb-6">
            {(['upcoming', 'past', 'all'] as const).map((s) => (
              <button
                key={s}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 font-medium ${
                  status === s
                    ? 'bg-[var(--unified-primary)] text-white border-[var(--unified-primary)] shadow-md'
                    : 'bg-white text-[var(--unified-text-primary)] border-[var(--unified-border-light)] hover:bg-[var(--unified-primary)] hover:text-white hover:border-[var(--unified-primary)] hover:shadow-sm'
                }`}
                onClick={() => setStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--unified-primary)]"></div>
              <span className="ml-2 text-gray-600">Loading bookings...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    // Group bookings by schedule slot
                    const groupedBookings = bookings.reduce((acc: any, booking: any) => {
                      const slotId = booking.teacherScheduleSlot?.id;
                      if (!slotId) return acc;
                      
                      if (!acc[slotId]) {
                        acc[slotId] = {
                          slot: booking.teacherScheduleSlot,
                          bookings: []
                        };
                      }
                      acc[slotId].bookings.push(booking);
                      return acc;
                    }, {});

                    return Object.values(groupedBookings).map((group: any) => (
                      <div key={group.slot.id} className="bg-[var(--unified-bg-surface)] rounded-lg border border-[var(--unified-border-light)] overflow-hidden">
                        {/* Schedule Header */}
                        <div className="bg-white border-b-2 border-[var(--unified-primary)] px-4 py-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-black">
                                {group.slot.teacherSchedule?.serviceType?.name || 'Service'}
                              </h3>
                              <p className="text-sm text-gray-700">
                                {new Date(group.slot.startTime).toLocaleDateString('en-GB', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-black">
                                {new Date(group.slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {' - '}
                                {new Date(group.slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              {group.slot.isLate && (
                                <p className="text-xs text-red-600 font-medium">
                                  ⚠️ Running Late ({group.slot.lateMinutes} min)
                                </p>
                              )}
                              <p className="text-sm text-gray-700">
                                {group.slot.teacherSchedule?.venue?.name || 'Venue'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Students List */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-800">
                              Students ({group.bookings.length})
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              group.slot.isAvailable 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}>
                              {group.slot.isAvailable ? 'Available' : 'Fully Booked'}
                            </span>
                          </div>
                          
                          {group.bookings.length === 0 ? (
                            <p className="text-gray-600 text-sm">No students booked</p>
                          ) : (
                            <div className="space-y-2">
                              {group.bookings.map((booking: any) => (
                                <div key={booking.id} className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-[var(--unified-border-light)] hover:border-[var(--unified-primary)] transition-colors">
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {booking.user?.fullName || booking.user?.email || 'Unknown Student'}
                                    </p>
                                    {booking.user?.phone && (
                                      <p className="text-sm text-gray-600">
                                        📞 {booking.user.phone}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                      booking.status === 'confirmed' 
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : booking.status === 'completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : booking.status === 'cancelled'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                    }`}>
                                      {booking.status}
                                    </span>
                                    <p className="text-xs text-gray-600 mt-1">
                                      📅 Booked {new Date(booking.createdAt).toLocaleDateString('en-GB')}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


