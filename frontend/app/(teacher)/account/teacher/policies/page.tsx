'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BaseButton } from '@/components/ui/BaseButton';
import { CheckCircle, FileText, PlayCircle } from 'lucide-react';

interface PolicyItem {
  id: string;
  title: string;
  summary?: string | null;
  contentUrl?: string | null;
  contentType?: string | null;
  acknowledgments?: { id: string; acknowledgedAt: string }[];
}

export default function TeacherPoliciesPage() {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [ackSubmitting, setAckSubmitting] = useState<string | null>(null);

  // UI first: fetch later
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/teacher/policies');
        const json = await res.json();
        if (!cancelled && json?.success) setPolicies(json.data || []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load policies');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return policies;
    return policies.filter(p => p.title.toLowerCase().includes(q) || (p.summary || '').toLowerCase().includes(q));
  }, [policies, query]);

  const handleAcknowledge = async (policyId: string) => {
    try {
      setAckSubmitting(policyId);
      const res = await fetch('/api/teacher/policies/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policyId })
      });
      const json = await res.json();
      if (json?.success) {
        setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, acknowledgments: [{ id: json.data.id, acknowledgedAt: json.data.acknowledgedAt }] } : p));
      }
    } finally {
      setAckSubmitting(null);
    }
  };

  const pendingCount = useMemo(() => policies.filter(p => !(p.acknowledgments && p.acknowledgments.length > 0)).length, [policies]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header summary */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Policies</h1>
            <p className="text-sm text-gray-500">Pending acknowledgment: {pendingCount}</p>
          </div>
          <div className="w-64">
            <Input placeholder="Search policies..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Content area: list with async load */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(loading && policies.length === 0 ? Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="border-0 shadow-sm bg-white animate-pulse">
              <CardHeader>
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          )) : filtered.map((p) => (
            <Card key={p.id} className="border-0 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {(p.contentType === 'video') ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  {p.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 min-h-[48px]">{p.summary || 'No summary provided.'}</p>
                <div className="flex items-center justify-between">
                  <a
                    href={p.contentUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open material
                  </a>
                  {p.acknowledgments && p.acknowledgments.length > 0 ? (
                    <span className="inline-flex items-center text-green-600 text-xs">
                      <CheckCircle className="h-4 w-4 mr-1" /> Acknowledged
                    </span>
                  ) : (
                    <BaseButton
                      size="sm"
                      disabled={ackSubmitting === p.id}
                      onClick={() => handleAcknowledge(p.id)}
                    >
                      I acknowledge
                    </BaseButton>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


