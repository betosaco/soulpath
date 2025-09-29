'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BaseButton } from '@/components/ui/BaseButton';
import { CheckCircle, FileText, PlayCircle, Upload } from 'lucide-react';

interface PolicyItem {
  id: string;
  title: string;
  summary?: string | null;
  contentUrl?: string | null;
  contentType?: string | null;
  acknowledgments?: { id: string; acknowledgedAt: string }[];
}

export default function PoliciesAdmin() {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/teacher/policies');
        const json = await res.json();
        if (json?.success) setPolicies(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return policies;
    return policies.filter(p => p.title.toLowerCase().includes(q) || (p.summary || '').toLowerCase().includes(q));
  }, [policies, query]);

  const handleUpload = async () => {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('name', f.name);
      const res = await fetch('/api/teacher/policies/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (json?.success && json.url) {
        // refresh policies
        const r2 = await fetch('/api/teacher/policies');
        const j2 = await r2.json();
        if (j2?.success) setPolicies(j2.data || []);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Policies</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <input ref={fileRef} type="file" accept="video/*,application/pdf" className="hidden" />
              <BaseButton variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Select file
              </BaseButton>
              <BaseButton onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload to Blob'}
              </BaseButton>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <Card key={p.id} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {(p.contentType || '').toLowerCase() === 'video' ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-700">
                    <p>{p.summary || '—'}</p>
                    <div className="flex items-center justify-between text-xs">
                      {p.contentUrl ? <a href={p.contentUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Open</a> : <span />}
                      {p.acknowledgments && p.acknowledgments.length > 0 ? (
                        <span className="inline-flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Acknowledged</span>
                      ) : (
                        <span className="text-gray-400">Pending</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


