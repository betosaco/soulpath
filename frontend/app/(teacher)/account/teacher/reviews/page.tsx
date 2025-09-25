'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { StarIcon } from 'lucide-react';

export default function TeacherReviewsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reviews, setReviews] = React.useState<Array<any>>([]);

  const loadReviews = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/reviews?limit=50', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load reviews');
      const j = await res.json();
      setReviews(j.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadReviews(); }, [loadReviews]);

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <StarIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Reviews</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary-500)]"></div>
              <span className="ml-2 text-[var(--unified-text-secondary)]">Loading reviews...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-[var(--color-text-secondary)] mx-auto mb-4" />
                  <p className="text-[var(--unified-text-secondary)]">No reviews yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-[var(--color-sidebar-600)] rounded-lg p-4 border border-[var(--color-border-500)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-[var(--unified-text-primary)]">
                            {r.user?.fullName || r.user?.email || 'Anonymous'}
                          </p>
                          <p className="text-sm text-[var(--unified-text-secondary)]">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < (r.rating || 0) ? 'text-yellow-400' : 'text-[var(--color-text-secondary)]'}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="text-[var(--unified-text-secondary)] mt-2">{r.comment}</p>
                      )}
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


