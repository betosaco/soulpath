'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { ClockIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherSlotsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [slots, setSlots] = React.useState<Array<any>>([]);

  const loadSlots = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/slots?days=30', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load slots');
      const j = await res.json();
      setSlots(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading slots');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadSlots(); }, [loadSlots]);

  const cancelSlot = async (slotId: number) => {
    if (!confirm('Cancel this slot?')) return;
    try {
      const res = await fetch('/api/teacher/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId })
      });
      if (!res.ok) throw new Error('Failed to cancel slot');
      await loadSlots();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error cancelling slot');
    }
  };

  const [cancelDay, setCancelDay] = React.useState('');
  const cancelAllByDay = async () => {
    if (!cancelDay) return alert('Select a day');
    if (!confirm(`Cancel all published slots on ${cancelDay}?`)) return;
    try {
      const res = await fetch('/api/teacher/slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: cancelDay })
      });
      if (!res.ok) throw new Error('Failed to cancel day slots');
      await loadSlots();
      setCancelDay('');
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error cancelling day');
    }
  };

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Available Slots</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          {/* Cancel by day */}
          <div className="mb-6 flex items-center gap-3">
            <input
              type="date"
              value={cancelDay}
              onChange={e => setCancelDay(e.target.value)}
              className="px-3 py-2 rounded border border-[var(--unified-border-light)] bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]"
              placeholder="YYYY-MM-DD"
            />
            <button onClick={cancelAllByDay} className={teacherUI.button.primary}>Cancel all for day</button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)]"></div>
              <span className="ml-2 text-[var(--unified-text-secondary)]">Loading slots...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="space-y-4 text-[var(--unified-text-primary)]">
              {slots.length === 0 ? (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--unified-text-secondary)]">No available slots found</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {slots.map((slot: any) => (
                    <div key={slot.id} className="bg-[var(--color-sidebar-600)] rounded-lg p-4 border border-[var(--color-border-500)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--unified-text-primary)]">
                            {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                          </p>
                          <p className="text-sm text-[var(--unified-text-secondary)]">
                            {slot.teacherSchedule?.serviceType?.name} at {slot.teacherSchedule?.venue?.name}
                          </p>
                          <p className="text-sm text-[var(--unified-text-secondary)]">
                            {slot.bookedCount || 0} / {slot.maxBookings || '∞'} bookings
                          </p>
                        </div>
                        <button onClick={() => cancelSlot(slot.id)} className={teacherUI.button.dangerSm}>Cancel</button>
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


