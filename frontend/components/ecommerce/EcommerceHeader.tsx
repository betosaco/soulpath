'use client';

import React from 'react';
import { Download, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { teacherUI } from '@/lib/styles/teacher-ui';

export function EcommerceHeader() {
  return (
    <header className={teacherUI.header.container}>
      <div className="flex items-center justify-between">
        <div className={teacherUI.header.left}>
          <div>
            <h1 className={teacherUI.header.title}>Ecommerce Dashboard</h1>
            <p className={teacherUI.header.subtitle}>Manage your online store, inventory, and orders</p>
          </div>
        </div>
        <div className={teacherUI.header.right}>
          <Link href="/admin" className="inline-flex items-center">
            <button className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </button>
          </Link>
          <button className="px-4 py-2 border border-[var(--unified-border-light)] rounded-lg text-[var(--unified-text-secondary)] hover:bg-[var(--unified-bg-tertiary)] hover:text-[var(--unified-text-primary)] inline-flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className={teacherUI.button.primary + ' inline-flex items-center ml-3'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>
    </header>
  );
}


