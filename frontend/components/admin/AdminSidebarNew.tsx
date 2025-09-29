'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { adminUI } from '@/lib/styles/admin-ui';
import { User } from '@supabase/supabase-js';
import {
  UsersIcon,
  CalendarIcon,
  EnvelopeIcon,
  CameraIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  BellIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  CpuChipIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon,
  CubeIcon,
  ReceiptPercentIcon,
  BugAntIcon,
  ChevronDownIcon,
  HomeIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface AdminSidebarNewProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User;
}

export function AdminSidebarNew({ activeTab, onTabChange, user }: AdminSidebarNewProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showQuickNav, setShowQuickNav] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      id: 'dashboard',
      icon: ChartBarIcon,
      current: activeTab === 'dashboard'
    },
    {
      name: 'Clients',
      id: 'clients',
      icon: UsersIcon,
      current: activeTab === 'clients'
    },
    {
      name: 'Bookings',
      id: 'bookings',
      icon: CalendarIcon,
      current: activeTab === 'bookings'
    },
    {
      name: 'Schedules',
      id: 'schedules',
      icon: CalendarIcon,
      current: activeTab === 'schedules'
    },
    {
      name: 'Packages',
      id: 'packages',
      icon: CubeIcon,
      current: activeTab === 'packages'
    },
    {
      name: 'Teachers',
      id: 'teachers',
      icon: UserGroupIcon,
      current: activeTab === 'teachers'
    },
    {
      name: 'Venues',
      id: 'venues',
      icon: MapPinIcon,
      current: activeTab === 'venues'
    },
    {
      name: 'Content',
      id: 'content',
      icon: DocumentTextIcon,
      current: activeTab === 'content'
    },
    {
      name: 'Communication',
      id: 'email',
      icon: EnvelopeIcon,
      current: activeTab === 'email'
    },
    {
      name: 'Payment Methods',
      id: 'payment-methods',
      icon: CreditCardIcon,
      current: activeTab === 'payment-methods'
    },
    {
      name: 'Payment Records',
      id: 'payment-records',
      icon: ReceiptPercentIcon,
      current: activeTab === 'payment-records'
    },
    {
      name: 'Settings',
      id: 'settings',
      icon: Cog6ToothIcon,
      current: activeTab === 'settings'
    }
  ];

  const advancedNavigation = [
    {
      name: 'Policies',
      id: 'policies-admin',
      icon: ShieldCheckIcon,
      current: activeTab === 'policies-admin'
    },
    {
      name: 'Live Sessions',
      id: 'live-session',
      icon: VideoCameraIcon,
      current: activeTab === 'live-session'
    },
    {
      name: 'Chatbot Dashboard',
      id: 'chatbot',
      icon: CpuChipIcon,
      current: activeTab === 'chatbot'
    },
    {
      name: 'Images',
      id: 'images',
      icon: CameraIcon,
      current: activeTab === 'images'
    },
    {
      name: 'External APIs',
      id: 'external-apis',
      icon: CpuChipIcon,
      current: activeTab === 'external-apis'
    },
    {
      name: 'SEO',
      id: 'seo',
      icon: ChartBarIcon,
      current: activeTab === 'seo'
    },
    {
      name: 'Purchase History',
      id: 'purchase-history',
      icon: ShoppingCartIcon,
      current: activeTab === 'purchase-history'
    },
    {
      name: 'Bug Reports',
      id: 'bug-reports',
      icon: BugAntIcon,
      current: activeTab === 'bug-reports'
    },
    {
      name: 'Rasa Monitoring',
      id: 'rasa-monitoring',
      icon: CpuChipIcon,
      current: activeTab === 'rasa-monitoring'
    },
    {
      name: 'Rasa Tuning',
      id: 'rasa-tuning',
      icon: WrenchScrewdriverIcon,
      current: activeTab === 'rasa-tuning'
    },
    {
      name: 'Conversation Logs',
      id: 'conversation-logs',
      icon: ChatBubbleLeftRightIcon,
      current: activeTab === 'conversation-logs'
    },
    {
      name: 'Service Types',
      id: 'service-types',
      icon: Cog6ToothIcon,
      current: activeTab === 'service-types'
    }
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className={adminUI.sidebar.container}>
      {/* Quick Navigation */}
      <div className={adminUI.sidebar.section}>
        <div className="relative">
          <button
            onClick={() => setShowQuickNav(!showQuickNav)}
            className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-tertiary)] border border-[var(--unified-border-medium)] transition-colors duration-200"
          >
            <span>Quick navigate</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          {showQuickNav && (
            <div className="absolute mt-2 w-full bg-[var(--unified-bg-surface)] border border-[var(--unified-border-light)] rounded-lg shadow-md z-10 overflow-hidden">
              <button
                onClick={() => { setShowQuickNav(false); router.push('/ecommerce'); }}
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <ShoppingCartIcon className="w-4 h-4 mr-2" /> Ecommerce
              </button>
              <button
                onClick={() => { setShowQuickNav(false); router.push('/communications'); }}
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" /> Communications Hub
              </button>
              <button
                onClick={() => { setShowQuickNav(false); router.push('/account'); }}
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <UserIcon className="w-4 h-4 mr-2" /> User account
              </button>
              <button
                onClick={() => { setShowQuickNav(false); router.push('/'); }}
                className="w-full flex items-center px-4 py-2 text-sm hover:bg-[var(--unified-bg-secondary)] text-[var(--unified-text-primary)]"
              >
                <HomeIcon className="w-4 h-4 mr-2" /> Homepage
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={adminUI.sidebar.nav}>
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={item.current ? adminUI.navigation.itemActive : adminUI.navigation.item}
              >
                <Icon className={adminUI.navigation.icon} />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Advanced Navigation Section */}
      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-[var(--unified-accent-light)] uppercase tracking-wide mb-2">
          Advanced
        </h3>
        <div className="space-y-1">
          {advancedNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={item.current ? adminUI.navigation.itemActive : adminUI.navigation.item}
              >
                <Icon className={adminUI.navigation.icon} />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={adminUI.sidebar.footer}>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-[var(--unified-text-inverse)] hover:bg-[var(--unified-primary-hover)] rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}
