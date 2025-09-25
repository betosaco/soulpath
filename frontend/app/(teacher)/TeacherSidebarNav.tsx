'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  CalendarIcon, 
  UsersIcon,
  ClockIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  BookOpenIcon,
  MessageSquareIcon,
  StarIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sidebarButtonStyles, combineStyles } from '@/lib/styles/common';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { createClient } from '@/lib/supabase/client';

interface User {
  email: string;
  access_token: string;
  role?: string;
  id?: string;
  fullName?: string;
}

interface TeacherSidebarNavProps {
  user: User;
}

export default function TeacherSidebarNav({ user }: TeacherSidebarNavProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/account/teacher',
      icon: BarChart3Icon,
      current: pathname === '/account/teacher'
    },
    {
      name: 'My Schedule',
      href: '/account/teacher/schedule',
      icon: CalendarIcon,
      current: pathname === '/account/teacher/schedule'
    },
    {
      name: 'Available Slots',
      href: '/account/teacher/slots',
      icon: ClockIcon,
      current: pathname === '/account/teacher/slots'
    },
    {
      name: 'My Bookings',
      href: '/account/teacher/bookings',
      icon: BookOpenIcon,
      current: pathname === '/account/teacher/bookings'
    },
    {
      name: 'Students',
      href: '/account/teacher/students',
      icon: UsersIcon,
      current: pathname === '/account/teacher/students'
    },
    {
      name: 'Messages',
      href: '/account/teacher/messages',
      icon: MessageSquareIcon,
      current: pathname === '/account/teacher/messages'
    },
    {
      name: 'Reviews',
      href: '/account/teacher/reviews',
      icon: StarIcon,
      current: pathname === '/account/teacher/reviews'
    },
    {
      name: 'Settings',
      href: '/account/teacher/settings',
      icon: SettingsIcon,
      current: pathname === '/account/teacher/settings'
    }
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className={teacherUI.sidebar.container}>
      {/* Logo/Brand */}
      <div className={teacherUI.sidebar.header}>
        <div className="text-center">
          <h1 className={teacherUI.sidebar.brandTitle}>MatMax</h1>
          <p className={teacherUI.sidebar.brandTagline}>Teacher Portal</p>
        </div>
      </div>

      {/* Teacher Info */}
      <div className={teacherUI.sidebar.section}>
        <div className="text-center">
          <div className={combineStyles(teacherUI.avatar.circleLg, 'mx-auto mb-2')}>
            <span className={teacherUI.avatar.initialLg}>
              {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-sm font-medium text-[var(--unified-text-primary)] truncate">
            {user.fullName || 'Teacher'}
          </p>
          <p className="text-xs text-[var(--unified-text-secondary)] truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={teacherUI.sidebar.nav}>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={combineStyles(
                'group',
                sidebarButtonStyles.base,
                item.current ? sidebarButtonStyles.variants.active : sidebarButtonStyles.variants.inactive,
                'text-[var(--unified-text-primary)]'
              )}
            >
              <Icon
                className={combineStyles('mr-3 h-5 w-5 flex-shrink-0', sidebarButtonStyles.icon)}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className={teacherUI.sidebar.footer}>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full border-[var(--unified-border-light)] text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-secondary)] hover:text-[var(--unified-text-primary)]"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
