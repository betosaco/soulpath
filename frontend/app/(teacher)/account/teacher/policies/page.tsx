'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BaseButton } from '@/components/ui/BaseButton';
import { CheckCircle, FileText, PlayCircle, Download } from 'lucide-react';
import { FullScreenModal } from '@/components/ui/FullScreenModal';
// @ts-ignore - react-player has no types in our setup
import ReactPlayer from 'react-player';

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPolicy, setViewerPolicy] = useState<PolicyItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

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

  const videoPolicy = useMemo(() => filtered.find((p) => (p.contentType || '').toLowerCase() === 'video'), [filtered]);
  const carouselPolicies = useMemo(() => filtered.filter((p) => (p.contentType || '').toLowerCase() !== 'video'), [filtered]);

  useEffect(() => {
    const active = carouselPolicies[currentIndex];
    if (active) {
      setSeenIds((prev) => {
        const next = new Set(prev);
        next.add(active.id);
        return next;
      });
    }
  }, [currentIndex, carouselPolicies]);

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

  const openViewer = (policy: PolicyItem) => {
    setViewerPolicy(policy);
    setViewerOpen(true);
    setSeenIds((prev) => {
      const next = new Set(prev);
      next.add(policy.id);
      return next;
    });
  };
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerPolicy(null);
  };

  const pendingCount = useMemo(() => policies.filter(p => !(p.acknowledgments && p.acknowledgments.length > 0)).length, [policies]);
  const allSeen = useMemo(() => {
    const ids = new Set(seenIds);
    const required: PolicyItem[] = [];
    if (videoPolicy) required.push(videoPolicy);
    for (const p of carouselPolicies) required.push(p);
    if (required.length === 0) return false;
    return required.every((p) => ids.has(p.id) || (p.acknowledgments && p.acknowledgments.length > 0));
  }, [seenIds, videoPolicy, carouselPolicies]);

  const acknowledgeAll = async () => {
    for (const p of policies) {
      if (!(p.acknowledgments && p.acknowledgments.length > 0)) {
        // eslint-disable-next-line no-await-in-loop
        await handleAcknowledge(p.id);
      }
    }
  };

  // Auto-ack when all have been seen (only if there are pending ones)
  useEffect(() => {
    if (allSeen && pendingCount > 0) {
      acknowledgeAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSeen, pendingCount]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header summary */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Policies</h1>
            <p className="text-sm text-gray-500">Pending acknowledgment: {pendingCount}</p>
          </div>
          <div className="w-auto flex items-center gap-3">
            <Input placeholder="Search policies..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <a href="/api/teacher/policies/pdf" target="_blank" rel="noreferrer">
              <BaseButton size="sm" variant="outline">Download PDF</BaseButton>
            </a>
            <BaseButton size="sm" variant={allSeen && pendingCount > 0 ? 'primary' : 'outline'} disabled={!allSeen || pendingCount === 0} onClick={acknowledgeAll}>
              Acknowledge All
            </BaseButton>
          </div>
        </div>
      </div>

      {/* Content area: list with async load */}
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}
        {/* Introduction */}
        <Card className="border-0 shadow-sm bg-white mb-4">
          <CardHeader>
            <CardTitle className="text-base">Bienvenida y guía</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700 space-y-2">
            <p>
              En esta sección revisaremos las políticas y buenas prácticas de MatMax Wellness Studio para profesores.
              Encontrarás un video introductorio y una serie de tarjetas con los puntos claves. Por favor, revisa todo el contenido y acepta haberlo leído al finalizar.
            </p>
            <p>
              Puedes navegar entre las políticas con los botones de Anterior/Siguiente y abrir materiales complementarios desde cada tarjeta. Cuando hayas visto todo, podrás
              reconocer las políticas en un solo paso.
            </p>
          </CardContent>
        </Card>
        {/* Featured video */}
        {videoPolicy && (
          <Card className="border-0 shadow-sm bg-white mb-4">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PlayCircle className="h-4 w-4" /> {videoPolicy.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {videoPolicy.summary && <p className="text-sm text-gray-600">{videoPolicy.summary}</p>}
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-black">
                {videoPolicy.contentUrl ? (
                  <ReactPlayer
                    url={videoPolicy.contentUrl}
                    controls
                    playing={false}
                    muted={false}
                    volume={1}
                    width="100%"
                    height="60vh"
                    config={{ file: { attributes: { controlsList: 'nodownload', playsInline: true } } }}
                  />
                ) : (
                  <div className="p-6 text-sm text-gray-500 bg-white">No video available.</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <button type="button" onClick={() => openViewer(videoPolicy)} className="text-sm text-blue-600 hover:underline">Open material</button>
                {videoPolicy.acknowledgments && videoPolicy.acknowledgments.length > 0 ? (
                  <span className="inline-flex items-center text-green-600 text-xs"><CheckCircle className="h-4 w-4 mr-1" /> Acknowledged</span>
                ) : (
                  <BaseButton
                    size="sm"
                    disabled={ackSubmitting === videoPolicy.id}
                    onClick={async () => {
                      await handleAcknowledge(videoPolicy.id);
                      setPolicies((prev) => prev.map(p => p.id === videoPolicy.id ? { ...p, acknowledgments: [{ id: 'ack', acknowledgedAt: new Date().toISOString() }] } : p));
                    }}
                  >
                    I acknowledge
                  </BaseButton>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Carousel for the rest */}
        <div className="grid grid-cols-1 gap-4">
          {loading && policies.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border-0 shadow-sm bg-white animate-pulse">
                  <CardHeader>
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))
            : (() => {
                const active = carouselPolicies[currentIndex];
                if (!active) return null;
                return (
                  <Card key={active.id} className="border-0 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" /> {active.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 min-h-[48px]">{active.summary || 'No summary provided.'}</p>
                      <div className="flex items-center justify-between">
                        <button type="button" onClick={() => openViewer(active)} className="text-sm text-blue-600 hover:underline">Open material</button>
                        {active.acknowledgments && active.acknowledgments.length > 0 ? (
                          <span className="inline-flex items-center text-green-600 text-xs"><CheckCircle className="h-4 w-4 mr-1" /> Acknowledged</span>
                        ) : (
                          <BaseButton
                            size="sm"
                            disabled={ackSubmitting === active.id}
                            onClick={async () => {
                              await handleAcknowledge(active.id);
                              setPolicies((prev) => prev.map(p => p.id === active.id ? { ...p, acknowledgments: [{ id: 'ack', acknowledgedAt: new Date().toISOString() }] } : p));
                            }}
                          >
                            I acknowledge
                          </BaseButton>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <BaseButton variant="outline" size="sm" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}>Back</BaseButton>
                        <div className="text-xs text-gray-500">{currentIndex + 1} / {carouselPolicies.length}</div>
                        <BaseButton variant="outline" size="sm" disabled={currentIndex >= carouselPolicies.length - 1} onClick={() => setCurrentIndex((i) => Math.min(carouselPolicies.length - 1, i + 1))}>Next</BaseButton>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
        </div>
      </div>
      {/* Policy Viewer */}
      <FullScreenModal isOpen={viewerOpen} onClose={closeViewer} title={viewerPolicy?.title || 'Policy'}>
        <FullScreenModal.Content padding="lg" className="h-full">
          <div className="flex flex-col gap-4 h-full">
            {/* Summary */}
            {viewerPolicy?.summary && (
              <div className="text-sm text-gray-700">
                {viewerPolicy.summary}
              </div>
            )}

            {/* Material */}
            <div className="flex-1 min-h-0 rounded-lg border border-gray-200 overflow-hidden bg-white">
              {viewerPolicy?.contentType === 'video' && viewerPolicy?.contentUrl ? (
                <ReactPlayer
                  url={viewerPolicy.contentUrl}
                  controls
                  playing={false}
                  muted={false}
                  volume={1}
                  width="100%"
                  height="70vh"
                  config={{ file: { attributes: { controlsList: 'nodownload', playsInline: true } } }}
                />
              ) : viewerPolicy?.contentType === 'pdf' && viewerPolicy?.contentUrl ? (
                <iframe src={viewerPolicy.contentUrl} className="w-full h-full" title="Policy PDF" />
              ) : viewerPolicy?.contentUrl ? (
                <iframe src={viewerPolicy.contentUrl} className="w-full h-full" title="Policy Material" />
              ) : (
                <div className="p-6 text-sm text-gray-500">No additional material provided for this policy.</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              {viewerPolicy?.contentUrl ? (
                <a
                  href={viewerPolicy.contentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              ) : <span />}
              {viewerPolicy && !(viewerPolicy.acknowledgments && viewerPolicy.acknowledgments.length > 0) && (
                <BaseButton
                  size="sm"
                  disabled={ackSubmitting === viewerPolicy.id}
                  onClick={async () => {
                    await handleAcknowledge(viewerPolicy.id);
                    // reflect ack state locally
                    setViewerPolicy((prev) => prev ? { ...prev, acknowledgments: [{ id: 'ack', acknowledgedAt: new Date().toISOString() }] } : prev);
                  }}
                >
                  I acknowledge
                </BaseButton>
              )}
            </div>
          </div>
        </FullScreenModal.Content>
      </FullScreenModal>
      {/* Download all policies as PDF */}
      <div className="fixed bottom-4 right-4">
        <a href="/api/teacher/policies/pdf" className="text-xs text-blue-600 underline">Descargar todas las políticas (PDF)</a>
      </div>
    </div>
  );
}


