'use client';

import React from 'react';
import { Settings, LogOut, User, Bug } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { BugReportSystem } from '../BugReportSystem';

interface AdminHeaderProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminHeader({ onClose, isModal = false }: AdminHeaderProps) {
  const { user, signOut, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <header className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__brand">
          <div className="admin-header__icon">
            <Settings size={20} />
          </div>
          <div className="admin-header__title">
            <h1 className="admin-header__title-text">Admin Dashboard</h1>
            <p className="admin-header__subtitle">Welcome back, {user.email}</p>
          </div>
        </div>
        
        <div className="admin-header__actions">
          {/* Report Bug Button */}
          <BugReportSystem onSubmitSuccess={() => {}}>
            {({ openReport }) => (
              <button
                onClick={openReport}
                className="admin-header__button admin-header__button--bug"
              >
                <Bug size={16} />
                Report Bug
              </button>
            )}
          </BugReportSystem>

          {/* Close button - only show in modal mode */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="admin-header__button admin-header__button--close"
            >
              Close
            </button>
          )}
          
          {/* Admin Account Button - Only show for admin users */}
          {isAdmin && (
            <Link href="/account">
              <button className="admin-header__button admin-header__button--account">
                <User size={16} />
                My Account
              </button>
            </Link>
          )}
          
          <button
            onClick={signOut}
            className="admin-header__button admin-header__button--logout"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
