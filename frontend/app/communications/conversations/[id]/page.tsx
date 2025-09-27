'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CommunicationsLayout } from '@/components/communications/CommunicationsLayout';
import { ConversationView } from '@/components/communications/ConversationView';

export default function ConversationDeepLinkPage() {
  const params = useParams();
  const router = useRouter();
  const [activeView, setActiveView] = useState('inbox');

  const conversationId = (params?.id as string) || '';

  return (
    <CommunicationsLayout activeView={activeView} onViewChange={setActiveView}>
      {conversationId ? (
        <ConversationView conversationId={conversationId} onBackClick={() => router.push('/communications?view=inbox')} />
      ) : null}
    </CommunicationsLayout>
  );
}


