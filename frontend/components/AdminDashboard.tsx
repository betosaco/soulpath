import React from 'react';
import { AdminLayoutNew } from './admin/AdminLayoutNew';

interface AdminDashboardProps {
  onClose?: () => void;
  isModal?: boolean;
  children?: React.ReactNode;
}

export function AdminDashboard({ onClose, isModal = true }: AdminDashboardProps) {
  return (
    <AdminLayoutNew onClose={onClose} isModal={isModal} />
  );
}