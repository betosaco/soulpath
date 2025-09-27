'use client';

import React, { useMemo, useState } from 'react';
import { BaseButton } from '../ui/BaseButton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Priority } from '@/lib/types/communications';
import { useCreateTicket } from '@/hooks/useCommunications';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  customerId: string;
  defaultSubject?: string;
}

export function CreateTicketModal({ isOpen, onClose, conversationId, customerId, defaultSubject }: CreateTicketModalProps) {
  const { mutateAsync: createTicket, isPending } = useCreateTicket();

  const [subject, setSubject] = useState<string>(defaultSubject || '');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('NORMAL');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const parsedTags = useMemo(() => tags.split(',').map(t => t.trim()).filter(Boolean), [tags]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!subject.trim()) return;
    await createTicket({
      customerId,
      subject: subject.trim(),
      description: description.trim() || undefined,
      priority,
      category: category.trim() || undefined,
      tags: parsedTags.length ? parsedTags : undefined,
      conversationId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg px-4">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600">
              Linking to this conversation: <span className="font-medium text-gray-900">{conversationId}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="mt-1 w-full h-28 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the problem, steps to reproduce, expected behavior, etc."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Billing, Technical, Account"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags</label>
              <input
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated, e.g., refund,urgent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <BaseButton variant="outline" onClick={onClose}>Cancel</BaseButton>
              <BaseButton onClick={handleSubmit} disabled={!subject.trim() || isPending}>
                {isPending ? 'Creating...' : 'Create Ticket'}
              </BaseButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


