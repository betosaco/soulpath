'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { SettingsIcon } from 'lucide-react';

export default function TeacherSettingsPage() {
  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--color-text-inverse)]">Settings</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          <p className="text-[var(--color-text-secondary)]">Teacher preferences and profile settings coming soon.</p>
        </div>
      </div>
    </div>
  );
}


