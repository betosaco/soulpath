'use client';

import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { adminUI } from '@/lib/styles/admin-ui';
import {
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

interface AdminHeaderNewProps {
  user: User;
  onClose?: () => void;
  isModal?: boolean;
}

export function AdminHeaderNew({ user, onClose, isModal = false }: AdminHeaderNewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <header className={adminUI.header.container}>
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className={adminUI.header.left}>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-[var(--unified-text-secondary)] hover:text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
          
          <div>
            <h1 className={adminUI.header.title}>Admin Dashboard</h1>
            <p className={adminUI.header.subtitle}>
              Manage your wellness studio
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className={adminUI.header.center}>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--unified-text-tertiary)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${adminUI.input.base} pl-10 pr-4 w-64`}
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className={adminUI.header.right}>
          {/* Quick Access removed: Communications Hub now lives in global quick navigate */}

          {/* Notifications */}
          <button className="p-2 text-[var(--unified-text-secondary)] hover:text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] rounded-lg transition-colors duration-200 relative">
            <BellIcon className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--unified-error)] rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--unified-text-primary)]">
                {user.email}
              </p>
              <p className="text-xs text-[var(--unified-text-secondary)]">
                Administrator
              </p>
            </div>
            <div className={adminUI.avatar.circleLg}>
              <span className={adminUI.avatar.initialLg}>
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-[var(--unified-text-secondary)] hover:text-[var(--unified-text-primary)] hover:bg-[var(--unified-bg-secondary)] rounded-lg transition-colors duration-200"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search (hidden on desktop) */}
      <div className="md:hidden mt-4">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--unified-text-tertiary)]" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${adminUI.input.base} pl-10 pr-4 w-full`}
            />
          </div>
        </form>
      </div>
    </header>
  );
}
