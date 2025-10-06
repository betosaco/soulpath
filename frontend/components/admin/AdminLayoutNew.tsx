'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebarNew } from './AdminSidebarNew';
import { AdminHeaderNew } from './AdminHeaderNew';
import { AdminMainContentNew } from './AdminMainContentNew';
import { adminUI } from '@/lib/styles/admin-ui';

interface AdminLayoutNewProps {
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminLayoutNew({ onClose, isModal = true }: AdminLayoutNewProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Extract tab from URL pathname (e.g., /admin/template-studio -> template-studio)
  const urlTab = pathname.split('/').pop();
  const initialTab = urlTab && urlTab !== 'admin' ? urlTab : 'dashboard';

  const [activeTab, setActiveTab] = useState(initialTab);
  const bugReportManagementRef = useRef<any>(null);


  // Handle tab changes and update URL
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    // Update URL to reflect the current tab
    router.push(`/admin/${newTab}`);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('🔐 No user found, redirecting to home');
      router.push('/');
    } else if (!isLoading && user && !isAdmin) {
      console.log('🔐 User is not an admin, redirecting to account');
      router.push('/account');
    }
  }, [user, isLoading, isAdmin, router]);

  // Update activeTab when URL changes (for browser navigation)
  useEffect(() => {
    const urlTab = pathname.split('/').pop();
    const newTab = urlTab && urlTab !== 'admin' ? urlTab : 'dashboard';
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [pathname, activeTab]);

  // Show loading state while authentication is being checked
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

  // Show loading state if no user (after auth check is complete)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--unified-bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--unified-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--unified-text-secondary)]">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin (only after auth check is complete)
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--unified-bg-primary)]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-[var(--unified-text-primary)] mb-2">Access Denied</h2>
          <p className="text-[var(--unified-text-secondary)]">
            You don&apos;t have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  const containerClasses = isModal 
    ? `${adminUI.layout.shell} admin-theme fixed inset-0 z-50`
    : `${adminUI.layout.shell} admin-theme`;

  return (
    <div className={containerClasses}>
      <AdminSidebarNew 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        user={user as unknown as any}
      />
      
      <div className={adminUI.layout.main}>
        <AdminHeaderNew 
          user={user as unknown as any}
          onClose={onClose} 
          isModal={isModal} 
        />
        
        <main className={adminUI.layout.content}>
          <AdminMainContentNew 
            activeTab={activeTab}
            bugReportManagementRef={bugReportManagementRef}
          />
        </main>
      </div>
    </div>
  );
}
