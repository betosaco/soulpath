'use client';

import React, { useState, useEffect } from 'react';
import { EcommerceDashboard } from '@/components/ecommerce/EcommerceDashboard';
import { EcommerceLayout } from '@/components/ecommerce/EcommerceLayout';

export default function EcommercePage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return null;

  return (
    <EcommerceLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <EcommerceDashboard activeTab={activeTab} onTabChange={setActiveTab} />
    </EcommerceLayout>
  );
}


