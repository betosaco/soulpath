'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  PackageIcon, 
  CalendarIcon, 
  UserIcon,
  LogOutIcon,
  PlusIcon,
  ShoppingCartIcon,
  HistoryIcon,
  VideoIcon
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
}

interface ClientSidebarNavProps {
  user: User;
}

export default function ClientSidebarNav({ user }: ClientSidebarNavProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/account',
      icon: HomeIcon,
      current: pathname === '/account'
    },
    {
      name: 'Book a Session',
      href: '/account/book',
      icon: PlusIcon,
      current: pathname === '/account/book'
    },
    {
      name: 'Purchase Packages',
      href: '/account/purchase',
      icon: ShoppingCartIcon,
      current: pathname === '/account/purchase'
    },
    {
      name: 'My Packages',
      href: '/account/my-packages',
      icon: PackageIcon,
      current: pathname === '/account/my-packages'
    },
    {
      name: 'Live Sessions',
      href: '/account/live-session',
      icon: VideoIcon,
      current: pathname === '/account/live-session'
    },
    {
      name: 'My Sessions',
      href: '/account/sessions',
      icon: CalendarIcon,
      current: pathname === '/account/sessions'
    },
    {
      name: 'Purchase History',
      href: '/account/purchase-history',
      icon: HistoryIcon,
      current: pathname === '/account/purchase-history'
    },
    {
      name: 'My Profile',
      href: '/account/profile',
      icon: UserIcon,
      current: pathname === '/account/profile'
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
        <h1 className={teacherUI.sidebar.brandTitle}>MatMax</h1>
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
                'text-[var(--color-text-inverse)]'
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

      {/* User Info & Sign Out */}
      <div className={teacherUI.sidebar.footer}>
        <div className="mb-4">
          <p className="text-sm text-[var(--color-text-secondary)]">Signed in as</p>
          <p className="text-sm font-medium text-[var(--color-text-inverse)] truncate">{user.email}</p>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="w-full border-[var(--color-border-500)] text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-700)] hover:text-[var(--color-text-inverse)]"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
