"use client";

import React, { useState, useEffect } from 'react';
import { CommunicationsLayout } from '@/components/communications/CommunicationsLayout';
import { CommunicationsDashboard } from '@/components/communications/CommunicationsDashboard';

export default function CommunicationsPage() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const url = new URL(window.location.href);
    const initialView = url.searchParams.get('view');
    if (initialView) setActiveView(initialView);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;

  return (
    <CommunicationsLayout activeView={activeView} onViewChange={setActiveView}>
      <CommunicationsDashboard activeView={activeView} onViewChange={setActiveView} />
    </CommunicationsLayout>
  );
}
