'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  CalendarIcon, 
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon,
  BookOpenIcon,
  MessageSquareIcon,
  StarIcon,
  TrendingUpIcon
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
      name: 'My Bookings',
      href: '/account/teacher/bookings',
      icon: BookOpenIcon,
      current: pathname === '/account/teacher/bookings'
    },
    {
      name: 'Earnings',
      href: '/account/teacher/earnings',
      icon: TrendingUpIcon,
      current: pathname === '/account/teacher/earnings'
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
      <div className="px-2 py-0 border-b border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-0 mt-0">
            <Image
              src="/logo_matmax.webp"
              alt="MatMax Yoga Studio Logo"
              width={240}
              height={240}
              className="h-32 w-32 object-contain -mt-8 brightness-0 invert"
              priority
            />
          </div>
          <p className={`${teacherUI.sidebar.brandTagline} -mt-2`}>Teacher Portal</p>
        </div>
      </div>

      {/* Teacher Info */}
      <div className={teacherUI.sidebar.section}>
        <div className="text-center">
          <div className="w-12 h-12 bg-[var(--unified-primary)] rounded-full flex items-center justify-center mx-auto mb-2 overflow-hidden">
            <Image
              src="/teacher-avatars/lucia-meza.jpg"
              alt="Teacher Profile"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-full"
              priority
            />
          </div>
          <p className="text-sm font-medium text-white truncate">
            {user.fullName || 'Teacher'}
          </p>
          <p className="text-xs text-gray-300 truncate">
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
                item.current ? sidebarButtonStyles.variants.active : sidebarButtonStyles.variants.inactive
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
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium border border-gray-600 text-white hover:bg-gray-700 hover:text-white hover:border-gray-500 rounded-md transition-all duration-200"
        >
          <LogOutIcon className="mr-2 h-4 w-4 text-white" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
