'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebarNew } from '@/components/admin/AdminSidebarNew';
import { AdminHeaderNew } from '@/components/admin/AdminHeaderNew';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { adminUI } from '@/lib/styles/admin-ui';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = useMemo(() => {
    // Expected admin paths: /admin, /admin/<tab>
    if (!pathname) return 'dashboard';
    const match = pathname.match(/^\/admin(?:\/([^\/]+))?/);
    const tab = match?.[1] ?? '';
    return tab === '' ? 'dashboard' : tab;
  }, [pathname]);

  const handleTabChange = (tab: string) => {
    if (tab === 'dashboard') {
      router.push('/admin');
    } else {
      router.push(`/admin/${tab}`);
    }
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

  return (
    <div className={`${adminUI.layout.shell} admin-theme`}>
      <AdminSidebarNew 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        user={user as unknown as SupabaseUser}
      />
      <div className={adminUI.layout.main}>
        <AdminHeaderNew user={user as unknown as SupabaseUser} />
        <main className={adminUI.layout.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
