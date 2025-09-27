'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { DollarSign, BookOpen, Calendar, Ticket as TicketIcon } from 'lucide-react';

interface OperatorToolsProps {
  onInsertTemplate: (content: string) => void;
  onInsertLink: (content: string) => void;
  disabled?: boolean;
  onCreateTicket?: () => void;
  onOpenCatalog?: () => void;
}

export function OperatorTools({ onInsertTemplate, onInsertLink, disabled, onCreateTicket, onOpenCatalog }: OperatorToolsProps) {
  const handlePaymentLink = () => {
    const amountStr = typeof window !== 'undefined' ? window.prompt('Enter amount to request (e.g., 49.90):') : '';
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (Number.isNaN(amount)) return;
    const link = `/checkout?amount=${amount.toFixed(2)}`;
    onInsertLink(`Here is your payment link: ${link}`);
  };

  const handleCatalog = () => {
    if (onOpenCatalog) {
      onOpenCatalog();
      return;
    }
    const link = '/shop';
    onInsertLink(`Explore our catalog: ${link}`);
  };

  const handleSchedule = () => {
    const link = '/schedule';
    onInsertLink(`See our available schedules: ${link}`);
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-base">Operator Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {onCreateTicket && (
          <BaseButton onClick={onCreateTicket} disabled={disabled} className="w-full justify-start">
            <TicketIcon className="h-4 w-4 mr-2" />
            Create ticket from conversation
          </BaseButton>
        )}
        <BaseButton onClick={handlePaymentLink} disabled={disabled} className="w-full justify-start">
          <DollarSign className="h-4 w-4 mr-2" />
          Send payment link
        </BaseButton>
        <BaseButton onClick={handleCatalog} disabled={disabled} variant="outline" className="w-full justify-start">
          <BookOpen className="h-4 w-4 mr-2" />
          Send catalog
        </BaseButton>
        <BaseButton onClick={handleSchedule} disabled={disabled} variant="outline" className="w-full justify-start">
          <Calendar className="h-4 w-4 mr-2" />
          Send schedules
        </BaseButton>
      </CardContent>
    </Card>
  );
}
