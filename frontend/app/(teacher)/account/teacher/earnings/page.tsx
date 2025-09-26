'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { TrendingUpIcon, CalendarIcon } from 'lucide-react';

export default function TeacherEarningsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<any>(null);
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');

  const loadEarnings = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);
      const res = await fetch(`/api/teacher/earnings${params.toString() ? `?${params.toString()}` : ''}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load earnings');
      const j = await res.json();
      setData(j.data || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading earnings');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  React.useEffect(() => { loadEarnings(); }, [loadEarnings]);

  const currencySymbol = data?.items?.[0]?.symbol || '$';
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const toggle = (id: number) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <TrendingUpIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Earnings</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="block text-xs text-[var(--unified-text-secondary)] mb-1">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded px-2 py-1 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
            </div>
            <div>
              <label className="block text-xs text-[var(--unified-text-secondary)] mb-1">End date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded px-2 py-1 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
            </div>
            <button onClick={loadEarnings} className="px-3 py-2 bg-[var(--unified-primary)] text-white rounded hover:bg-[var(--unified-primary-hover)] transition-colors flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" /> Apply
            </button>
          </div>

          {loading && (
            <p className="text-[var(--unified-text-secondary)]">Loading earnings...</p>
          )}
          {error && (
            <p className="text-red-600">{error}</p>
          )}

          {!loading && !error && data && (
            <div className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={teacherUI.card.container + ' p-4'}>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Gross</p>
                  <p className="text-2xl font-semibold text-[var(--unified-text-primary)]">{currencySymbol}{(data.totalGross || 0).toFixed(2)}</p>
                </div>
                <div className={teacherUI.card.container + ' p-4'}>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Commission ({Math.round((data.commissionPercent || 0) * 10000) / 100}%)</p>
                  <p className="text-2xl font-semibold text-[var(--unified-text-primary)]">{currencySymbol}{(data.totalCommission || 0).toFixed(2)}</p>
                </div>
                <div className={teacherUI.card.container + ' p-4'}>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Net</p>
                  <p className="text-2xl font-semibold text-[var(--unified-text-primary)]">{currencySymbol}{((data.totalGross || 0) - (data.totalCommission || 0)).toFixed(2)}</p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[var(--unified-text-secondary)] border-b">
                      <th className="py-2 pr-4"></th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Service</th>
                      <th className="py-2 pr-4">Venue</th>
                      <th className="py-2 pr-4">Gross</th>
                      <th className="py-2 pr-4">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items?.map((item: any) => (
                      <React.Fragment key={item.id}>
                        <tr className="border-b last:border-0">
                          <td className="py-2 pr-4 align-top">
                            <button onClick={() => toggle(item.id)} className="text-[var(--unified-primary)] hover:underline text-xs">
                              {expanded[item.id] ? 'Hide' : 'Details'}
                            </button>
                          </td>
                          <td className="py-2 pr-4">{new Date(item.date).toLocaleString()}</td>
                          <td className="py-2 pr-4">{item.service}</td>
                          <td className="py-2 pr-4">{item.venue}</td>
                          <td className="py-2 pr-4">{item.symbol}{item.gross.toFixed(2)}</td>
                          <td className="py-2 pr-4">{item.symbol}{item.commission.toFixed(2)}</td>
                        </tr>
                        {expanded[item.id] && (
                          <tr className="bg-[var(--unified-bg-secondary)]">
                            <td colSpan={6} className="py-3 px-4">
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="px-2 py-1 rounded-full border bg-gray-100 text-gray-700 border-gray-200">
                                  Student: {item.student?.name}
                                </span>
                                <span className="px-2 py-1 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
                                  Pass: {item.pass?.name}
                                </span>
                                {item.pass?.sessionsCount != null && (
                                  <span className="px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                                    Sessions: {item.pass.sessionsCount}
                                  </span>
                                )}
                                {item.pass?.packageType && (
                                  <span className="px-2 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                                    Type: {item.pass.packageType}
                                  </span>
                                )}
                                {typeof item.pass?.pricePerClass === 'number' && (
                                  <span className="px-2 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                                    Price per class: {item.symbol}{item.pass.pricePerClass.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


