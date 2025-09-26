'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon, PackageIcon, ShoppingCart, Settings } from 'lucide-react';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { BugReportButton } from '@/components/BugReportButton';
import { CustomerDashboard } from '@/components/CustomerDashboard';
import { teacherUI } from '@/lib/styles/teacher-ui';

// interface DashboardStats { // Unused for now
//   totalBookings: number;
//   activePackages: number;
//   totalSpent: number;
//   upcomingSessions: number;
// }

export default function AccountPage() {
  const { user, isTeacher, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user?.access_token) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  // Redirect teachers to their dashboard
  useEffect(() => {
    if (!authLoading && user && isTeacher) {
      window.location.href = '/account/teacher';
    }
  }, [user, isTeacher, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-background-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] text-lg font-semibold">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-background-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] text-lg font-semibold">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Dashboard Component (includes its own actions) */}
      <CustomerDashboard />

      {/* Bug Report Button */}
      <div className="flex justify-center">
        <BugReportButton />
      </div>
    </div>
  );
}
