'use client';

import React from 'react';
import { CentralizedHeader } from './CentralizedHeader';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  user?: { email: string } | null;
  isAdmin?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function AppLayout({ 
  children, 
  user = null, 
  isAdmin = false, 
  showFooter = true,
  className = "min-h-screen bg-white"
}: AppLayoutProps) {

  return (
    <div className={className}>
      <CentralizedHeader 
        user={user} 
        isAdmin={isAdmin}
      />
      
      <main className="pt-20">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
