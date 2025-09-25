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
                  {students.map((s: any) => (
                    <div key={s.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--unified-text-primary)]">{s.fullName || s.email}</p>
                        <p className="text-sm text-[var(--unified-text-secondary)]">
                          Last booking: {new Date(s.lastBookingAt).toLocaleString()} • Total bookings: {s.bookingsCount}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[var(--unified-text-secondary)]">{s.email}</p>
                        {s.phone && <p className="text-sm text-[var(--unified-text-secondary)]">{s.phone}</p>}
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


