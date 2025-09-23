'use client';

import React from 'react';
import { CentralizedHeader } from './CentralizedHeader';
import { Footer } from './Footer';
import { CartSidebar } from './CartSidebar';
import { MobileScrollFix } from './MobileScrollFix';
import { QueryProvider } from './providers/QueryProvider';

interface AppShellProps {
  children: React.ReactNode;
  user?: { email: string } | null;
  isAdmin?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * AppShell - The primary layout component for the entire application
 * 
 * This component provides:
 * - Consistent header across all pages
 * - Mobile-first responsive design with MobileScrollFix integration
 * - Footer (conditionally rendered)
 * - Cart sidebar for e-commerce functionality
 * - Unified styling using CSS custom properties
 * 
 * All pages should use this component as their root layout wrapper.
 */
export function AppShell({ 
  children, 
  user = null, 
  isAdmin = false, 
  showFooter = true,
  className = "min-h-screen bg-white"
}: AppShellProps) {
  return (
    <QueryProvider>
      {/* Mobile viewport and scroll fixes applied globally */}
      <MobileScrollFix />
      
      <div className={`${className} mobile-container mobile-scrollable`}>
        {/* Centralized header with navigation, cart, and language switching */}
        <CentralizedHeader 
          user={user} 
          isAdmin={isAdmin}
        />
        
        {/* Main content area with proper spacing for fixed header */}
        <main className="pt-20 mobile-content mobile-scrollable">
          {children}
        </main>
        
        {/* Footer (conditionally rendered) */}
        {showFooter && <Footer />}
        
        {/* Cart sidebar for e-commerce functionality */}
        <CartSidebar />
      </div>
    </QueryProvider>
  );
}
