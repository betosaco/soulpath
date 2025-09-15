import React from 'react';
import { AdminLayout } from './admin/AdminLayout';

interface AdminDashboardProps {
  onClose?: () => void;
  isModal?: boolean;
  children?: React.ReactNode;
}

export function AdminDashboard({ onClose, isModal = true }: AdminDashboardProps) {
  return (
    <AdminLayout onClose={onClose} isModal={isModal} />
  );
}