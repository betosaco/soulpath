'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import TeacherSidebarNav from './TeacherSidebarNav';
import TeacherHeader from './TeacherHeader';
import { teacherUI } from '@/lib/styles/teacher-ui';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isTeacher } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('🔐 No user found, redirecting to home');
      router.push('/');
    } else if (!isLoading && user && !isTeacher) {
      console.log('🔐 User is not a teacher, redirecting to account');
      router.push('/account');
    }
  }, [user, isLoading, isTeacher, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a23]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffd700] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-tertiary)]">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isTeacher) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className={`${teacherUI.layout.shell} teacher-theme`}>
      <TeacherSidebarNav user={user} />
      <div className={teacherUI.layout.main}>
        <TeacherHeader user={user} />
        <main className={teacherUI.layout.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
