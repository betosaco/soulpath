'use client';

import { AdminMainContentNew } from '@/components/admin/AdminMainContentNew';

export default function AdminPage() {
  // The /(admin)/layout.tsx already provides the shell (sidebar/header).
  // Render only the admin main content to avoid double layout nesting.
  return <AdminMainContentNew activeTab="dashboard" />;
}
