'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CommunicationsLayout } from '@/components/communications/CommunicationsLayout';
import { TicketView } from '@/components/communications/TicketView';

export default function TicketDeepLinkPage() {
  const params = useParams();
  const router = useRouter();
  const [activeView, setActiveView] = useState('tickets');

  const ticketId = (params?.id as string) || '';

  return (
    <CommunicationsLayout activeView={activeView} onViewChange={setActiveView}>
      {ticketId ? (
        <TicketView ticketId={ticketId} onBackClick={() => router.push('/communications?view=tickets')} />
      ) : null}
    </CommunicationsLayout>
  );
}


