'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MessageListUI } from '@/components/communications/MessageListUI';
import { MessageComposer } from '@/components/communications/MessageComposer';
import { OperatorTools } from '@/components/communications/OperatorTools';

interface ConversationState {
  botActive: boolean;
  humanTakeover: boolean;
  pendingTransfer: boolean;
  awaitingApproval: boolean;
}

export function ChatWindowShell() {
  const [draft, setDraft] = useState('');
  const [conversationState] = useState<ConversationState>({
    botActive: false,
    humanTakeover: true,
    pendingTransfer: false,
    awaitingApproval: false,
  });

  const channelId = useMemo<number | undefined>(() => undefined, []);

  const handleInsertTemplate = useCallback((content: string) => {
    setDraft(prev => (prev ? prev + '\n' + content : content));
  }, []);

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left column - chat area */}
        <div className="flex flex-col h-full max-h-full overflow-hidden">
          <div className="flex-1 flex flex-col space-y-4 p-4 min-h-0 overflow-hidden">
            <Card className="border-0 shadow-sm bg-white flex-1 flex flex-col min-h-0 max-h-full overflow-hidden">
              <CardContent className="p-0 flex-1 flex flex-col h-full">
                {/* Messages area - empty UI, not loading */}
                <div className="flex-1 overflow-y-auto p-4 bg-white min-h-0">
                  <MessageListUI messages={[]} isLoading={false} conversationState={conversationState} />
                </div>
                {/* Composer - disabled due to no channel selected */}
                <div className="border-t border-gray-200 p-3 bg-white flex-shrink-0">
                  <MessageComposer
                    conversationId="preview"
                    channelId={channelId}
                    value={draft}
                    onChange={setDraft}
                    disabled={true}
                    conversationState={conversationState}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right sidebar - operator tools always visible */}
        <div className="space-y-4 h-full p-4 pt-4 overflow-hidden">
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-base">Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <p className="text-sm text-gray-900 font-medium">No conversation selected</p>
                <p className="text-sm text-gray-600">Pick a conversation from the list to start.</p>
              </div>
            </CardContent>
          </Card>

          <OperatorTools
            onInsertTemplate={handleInsertTemplate}
            onInsertLink={handleInsertTemplate}
            onCreateTicket={undefined}
            onOpenCatalog={undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatWindowShell;


