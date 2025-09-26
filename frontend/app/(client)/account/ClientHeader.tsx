'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CalendarIcon, PackageIcon, ShoppingCart, BellIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { teacherUI } from '@/lib/styles/teacher-ui';

interface User {
  email: string;
  access_token: string;
  id?: string;
  fullName?: string;
}

interface CustomerStats {
  activePackages: number;
  upcomingSessions: number;
  totalOrders: number;
}

export default function ClientHeader({ user }: { user: User }) {
  const [stats, setStats] = useState<CustomerStats>({
    activePackages: 0,
    upcomingSessions: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomerStats = async () => {
      try {
        const res = await fetch('/api/client/stats', {
          headers: { 'Authorization': `Bearer ${user.access_token}` },
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            activePackages: data?.data?.activePackages ?? 0,
            upcomingSessions: data?.data?.upcomingSessions ?? 0,
            totalOrders: data?.data?.totalOrders ?? 0,
          });
        }
      } catch (err) {
        console.error('Failed to load customer stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomerStats();
  }, [user.access_token]);

  return (
    <header className={teacherUI.header.container}>
      <div className="flex items-center justify-between">
        <div className={teacherUI.header.left}>
          <div>
            <h1 className={teacherUI.header.title}>
              Welcome back, {user.fullName || 'Explorer'}! 👋
            </h1>
            <p className={teacherUI.header.subtitle}>Manage your sessions, packages and orders</p>
          </div>
        </div>

        <div className={teacherUI.header.center}>
          {!loading && (
            <>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <CalendarIcon className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.upcomingSessions}</span> upcoming
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <PackageIcon className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.activePackages}</span> active
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[var(--unified-text-primary)]">
                <ShoppingCart className="h-4 w-4 text-[var(--color-primary-500)]" />
                <span className="text-sm">
                  <span className="font-semibold">{stats.totalOrders}</span> orders
                </span>
              </div>
            </>
          )}
        </div>

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
                src="/user-avatars/default.jpg"
                alt="User Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--unified-text-primary)]">{user.fullName || user.email}</p>
              <p className="text-xs text-[var(--unified-text-secondary)]">Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


