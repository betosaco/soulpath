'use client';

import { useParams } from 'next/navigation';
import { AdminMainContentNew } from '@/components/admin/AdminMainContentNew';

export default function AdminTabPage() {
  const params = useParams();
  const tabParam = (params?.tab as string) || 'dashboard';

  return <AdminMainContentNew activeTab={tabParam} />;
}


