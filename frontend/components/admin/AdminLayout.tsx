'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { AdminMainContent } from './AdminMainContent';
import { BugReportManagementRef } from '../BugReportManagement';

interface AdminLayoutProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminLayout({ onClose, isModal = true }: AdminLayoutProps) {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('clients');
  const bugReportManagementRef = useRef<BugReportManagementRef>(null);

  console.log('🎯 AdminLayout: activeTab =', activeTab);

  // Show loading state if no user
  if (!user) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p className="admin-loading__text">Loading...</p>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="admin-access-denied">
        <div className="admin-access-denied__icon">🚫</div>
        <h2 className="admin-access-denied__title">Access Denied</h2>
        <p className="admin-access-denied__message">
          You don&apos;t have permission to access the admin dashboard.
        </p>
      </div>
    );
  }

  const containerClasses = isModal 
    ? 'admin-dashboard admin-dashboard--modal'
    : 'admin-dashboard admin-dashboard--fullscreen';

  return (
    <div className={containerClasses}>
      <AdminHeader onClose={onClose} isModal={isModal} />
      
      <div className="admin-dashboard__body">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <AdminMainContent 
          activeTab={activeTab}
          bugReportManagementRef={bugReportManagementRef}
        />
      </div>
    </div>
  );
}
