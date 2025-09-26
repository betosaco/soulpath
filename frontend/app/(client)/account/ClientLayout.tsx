'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ClientSidebarNav from './ClientSidebarNav';
import ClientHeader from './ClientHeader';
import { teacherUI } from '@/lib/styles/teacher-ui';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('🔐 No user found, redirecting to home');
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--color-background-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-500)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={`${teacherUI.layout.shell} teacher-theme`}>
      <ClientSidebarNav user={user} />
      <div className={teacherUI.layout.main}>
        <ClientHeader user={user} />
        <main className={teacherUI.layout.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
