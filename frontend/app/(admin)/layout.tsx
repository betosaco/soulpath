import AdminLayoutWrapper from './AdminLayoutWrapper';
import '@/styles/admin-dashboard.css';
import '@/styles/tokens/theme-admin.css';
import '@/styles/unified-schedule-management.css';
import '@/styles/schedule-calendar-view.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
