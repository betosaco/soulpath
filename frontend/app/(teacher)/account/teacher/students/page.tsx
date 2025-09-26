'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { UsersIcon } from 'lucide-react';

export default function TeacherStudentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [students, setStudents] = React.useState<Array<any>>([]);

  const loadStudents = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/students', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load students');
      const j = await res.json();
      setStudents(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading students');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadStudents(); }, [loadStudents]);

  // Format relative time like "3 days ago"
  const formatRelativeTime = (dateInput: string | number | Date) => {
    const date = new Date(dateInput);
    const diffMs = Date.now() - date.getTime();
    const sec = Math.floor(diffMs / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day > 0) return `${day} day${day !== 1 ? 's' : ''} ago`;
    if (hr > 0) return `${hr} hour${hr !== 1 ? 's' : ''} ago`;
    if (min > 0) return `${min} minute${min !== 1 ? 's' : ''} ago`;
    return 'just now';
  };

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <UsersIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Students</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)]"></div>
              <span className="ml-2 text-[var(--unified-text-secondary)]">Loading students...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="space-y-2">
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--unified-text-secondary)]">No students found</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--color-border-500)]">
                  {students.map((s: any) => {
                    const name: string = s.fullName || 'Unknown student';
                    const initial: string = (name?.trim?.()[0] || '?').toUpperCase();
                    const lastBooking = s.lastBookingAt ? new Date(s.lastBookingAt) : null;
                    const lastBookingRelative = lastBooking ? formatRelativeTime(lastBooking) : 'No bookings yet';
                    const daysSince = lastBooking ? Math.floor((Date.now() - lastBooking.getTime()) / (1000 * 60 * 60 * 24)) : Infinity;
                    const isActive = Number.isFinite(daysSince) && daysSince <= 60; // active if booked within last ~2 months
                    const statusClass = isActive
                      ? 'bg-[var(--unified-accent)]/30 text-[var(--unified-text-primary)] border-[var(--unified-accent-dark)]'
                      : 'bg-gray-100 text-gray-700 border-gray-200';

                    return (
                      <div key={s.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[var(--unified-primary)]/10 border border-[var(--unified-border-light)] flex items-center justify-center text-[var(--unified-primary)] font-semibold">
                            {initial}
                          </div>
                          <div>
                            <p className="font-medium text-[var(--unified-text-primary)]">{name}</p>
                            <p className="text-sm text-[var(--unified-text-secondary)]">Last booking: {lastBookingRelative}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                            {s.bookingsCount || 0} bookings
                          </span>
                          {typeof s.attendanceRate === 'number' && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              s.attendanceRate >= 80
                                ? 'bg-[var(--unified-accent)]/30 text-[var(--unified-text-primary)] border-[var(--unified-accent-dark)]'
                                : s.attendanceRate >= 50
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {s.attendanceRate}% attendance
                            </span>
                          )}
                          {s.topServiceType?.name && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-purple-50 text-purple-700 border-purple-200">
                              Class: {s.topServiceType.name}
                            </span>
                          )}
                          {s.topVenue?.name && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-700 border-gray-200">
                              Venue: {s.topVenue.name}{s.topVenue.city ? `, ${s.topVenue.city}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


