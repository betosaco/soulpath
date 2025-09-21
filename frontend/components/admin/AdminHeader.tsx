'use client';

import React from 'react';
// Icons removed as requested
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BugReportSystem } from '../BugReportSystem';

interface AdminHeaderProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminHeader({ onClose, isModal = false }: AdminHeaderProps) {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <header className="admin-header">
      <div className="admin-header__container">
        <div className="admin-header__brand">
          <div className="admin-header__title">
            <h1 className="admin-header__title-text">Admin Dashboard</h1>
            <p className="admin-header__subtitle">Welcome back, {user.email}</p>
          </div>
        </div>
        
        <div className="admin-header__actions">
          {/* Ecommerce Dashboard Button */}
          <button
            onClick={() => router.push('/admin/ecommerce')}
            className="admin-header__button admin-header__button--ecommerce"
            title="Ecommerce Dashboard"
          >
            Ecommerce
          </button>

          {/* Back to Main Page Button */}
          <button
            onClick={() => router.push('/')}
            className="admin-header__button admin-header__button--back"
            title="Back to main page"
          >
            Main Page
          </button>

          {/* Report Bug Button */}
          <BugReportSystem onSubmitSuccess={() => {}}>
            {({ openReport }) => (
              <button
                onClick={openReport}
                className="admin-header__button admin-header__button--bug"
              >
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
                My Account
              </button>
            </Link>
          )}
          
          <button
            onClick={signOut}
            className="admin-header__button admin-header__button--logout"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
