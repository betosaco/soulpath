'use client';

import React from 'react';
import { UnifiedScheduleManagement } from '@/components/admin/UnifiedScheduleManagement';
import '@/styles/unified-schedule-management.css';
import '@/styles/schedule-calendar-view.css';

export default function SchedulesPage() {
  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Schedule Management</h1>
        <p className="admin-page__subtitle">
          Manage teacher schedules, venue schedules, and general schedules
        </p>
      </div>
      
      <div className="admin-page__content">
        <UnifiedScheduleManagement />
      </div>
    </div>
  );
}
