'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { MessageSquareIcon } from 'lucide-react';

export default function TeacherMessagesPage() {
  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <MessageSquareIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text-inverse)]">Messages</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          <p className="text-[var(--color-text-secondary)]">Teacher-student messaging coming soon.</p>
        </div>
      </div>
    </div>
  );
}


