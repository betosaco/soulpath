'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BellIcon, UserIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { teacherUI } from '@/lib/styles/teacher-ui';

interface User {
  email: string;
  access_token: string;
  role?: string;
  id?: string;
  fullName?: string;
}

interface TeacherHeaderProps {
  user: User;
}

interface TeacherStats {
  todayBookings: number;
  upcomingSessions: number;
  totalStudents: number;
  rating: number;
}

export default function TeacherHeader({ user }: TeacherHeaderProps) {
  const [stats, setStats] = useState<TeacherStats>({
    todayBookings: 0,
    upcomingSessions: 0,
    totalStudents: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherStats = async () => {
      try {
        const response = await fetch('/api/teacher/stats', {
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.data || stats);
        }
      } catch (error) {
        console.error('Failed to load teacher stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherStats();
  }, [user.access_token]);

  return (
    <header className={teacherUI.header.container}>
      <div className="flex items-center justify-between">
        {/* Left side - Welcome message */}
        <div className={teacherUI.header.left}>
          <div>
            <h1 className={teacherUI.header.title}>
              Welcome back, {user.fullName || 'Teacher'}! 👋
            </h1>
            <p className={teacherUI.header.subtitle}>
              Here's your teaching dashboard overview
            </p>
          </div>
        </div>

        {/* Center - Quick stats */}
        <div className={teacherUI.header.center}>
          {!loading && (
            <>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <CalendarIcon className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.todayBookings}</span> today
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <ClockIcon className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.upcomingSessions}</span> upcoming
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <UserIcon className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.totalStudents}</span> students
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right side - Actions */}
        <div className={teacherUI.header.right}>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--unified-border-light)] text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)]"
          >
            <BellIcon className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[var(--unified-primary)] rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/teacher-avatars/lucia-meza.jpg"
                alt="Teacher Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--unified-text-primary)]">
                {user.fullName || 'Teacher'}
              </p>
              <p className="text-xs text-[var(--unified-text-secondary)]">
                Teacher
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
