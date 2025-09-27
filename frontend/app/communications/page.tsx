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

  // Conversation data will be passed from the dashboard component
  const [conversationData, setConversationData] = useState<{
    customerName: string;
    channelName: string;
    messageCount: number;
    assignedAgent?: string;
    statusBadges: Array<{ text: string; className: string }>;
  } | undefined>(undefined);

  const handleBackToInbox = () => {
    setActiveView('inbox');
  };

  if (loading) return null;

  return (
    <CommunicationsLayout 
      activeView={activeView} 
      onViewChange={setActiveView}
      conversationData={conversationData}
      onBackToInbox={handleBackToInbox}
    >
      <CommunicationsDashboard 
        activeView={activeView} 
        onViewChange={setActiveView}
        onConversationDataChange={setConversationData}
      />
    </CommunicationsLayout>
  );
}
