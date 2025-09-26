'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { adminUI } from '@/lib/styles/admin-ui';

interface AdminLayoutProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminLayout({ onClose, isModal = true }: AdminLayoutProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('🔐 No user found, redirecting to home');
      router.push('/');
    } else if (!isLoading && user && !isAdmin) {
      console.log('🔐 User is not an admin, redirecting to account');
      router.push('/account');
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--unified-bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--unified-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--unified-text-secondary)]">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null; // Will redirect in useEffect
  }

  const containerClasses = isModal 
    ? `${adminUI.layout.shell} admin-theme`
    : `${adminUI.layout.shell} admin-theme`;

  return (
    <div className={containerClasses}>
      {/* AdminSidebar in this legacy layout does not accept user prop */}
      <AdminSidebar activeTab={"dashboard"} onTabChange={() => {}} />
      <div className={adminUI.layout.main}>
        {/* AdminHeader uses useAuth internally; do not pass user */}
        <AdminHeader onClose={onClose} isModal={isModal} />
        <main className={adminUI.layout.content}>
          {/* Content will be rendered by parent components */}
        </main>
      </div>
    </div>
  );
}