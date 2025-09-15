'use client';

import React from 'react';
import {
  Settings,
  Users,
  Calendar,
  Clock,
  Package,
  FileText,
  Mail,
  ImageIcon,
  Search,
  CreditCard,
  Receipt,
  History,
  Database,
  Bug,
  Video,
  Zap,
  Brain,
  MessageSquare,
  MapPin,
  UserCheck,
  CalendarDays
} from 'lucide-react';
import { Bot } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const menuItems = [
    // Chatbot Section
    {
      group: 'Chatbot',
      icon: Bot,
      items: [
        { key: 'rasa-monitoring', icon: Brain, label: 'Rasa AI Monitoring' },
        { key: 'rasa-tuning', icon: Settings, label: 'Model Tuning' },
        { key: 'conversation-logs', icon: MessageSquare, label: 'Conversation Logs' }
      ]
    },
    // Administration Section
    {
      group: 'Administration',
      items: [
        { key: 'clients', icon: Users, label: 'Client Management' },
        { key: 'bookings', icon: Calendar, label: 'Bookings Management' },
        { key: 'schedules', icon: Clock, label: 'Schedule Management' },
        { key: 'packages', icon: Package, label: 'Packages & Pricing' },
        { key: 'content', icon: FileText, label: 'Content Management' },
        { key: 'email', icon: Mail, label: 'Communication Settings' }
      ]
    },
    // Venues & Teachers Section
    {
      group: 'Venues & Teachers',
      items: [
        { key: 'venues', icon: MapPin, label: 'Venue Management' },
        { key: 'teachers', icon: UserCheck, label: 'Teacher Management' },
        { key: 'teacher-schedules', icon: CalendarDays, label: 'Teacher Schedules' }
      ]
    },
    // Service Management Section
    {
      group: 'Service Management',
      items: [
        { key: 'service-types', icon: Settings, label: 'Service Types' },
        { key: 'package-services', icon: Package, label: 'Package Services' }
      ]
    },
    // Live Session Section
    {
      group: 'Live Sessions',
      items: [
        { key: 'live-session', icon: Video, label: 'Live Session Config' }
      ]
    },
    // Media Section
    {
      group: 'Media',
      items: [
        { key: 'images', icon: ImageIcon, label: 'Image Management' },
        { key: 'external-apis', icon: Zap, label: 'External APIs' }
      ]
    },
    // SEO Section
    {
      group: 'SEO & Marketing',
      items: [
        { key: 'seo', icon: Search, label: 'SEO Management' }
      ]
    },
    // Payment Section
    {
      group: 'Payments',
      items: [
        { key: 'payment-methods', icon: CreditCard, label: 'Payment Methods' },
        { key: 'payment-records', icon: Receipt, label: 'Payment Records' },
        { key: 'purchase-history', icon: History, label: 'Purchase History' }
      ]
    },
    // System Section
    {
      group: 'System',
      items: [
        { key: 'settings', icon: Database, label: 'Settings' },
        { key: 'bug-reports', icon: Bug, label: 'Bug Reports' }
      ]
    }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__content">
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="admin-sidebar__group">
            <div className="admin-sidebar__group-header">
              {group.icon && <group.icon size={16} />}
              <span className="admin-sidebar__group-label">{group.group}</span>
            </div>
            <nav className="admin-sidebar__menu">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      console.log('🎯 Sidebar: Clicking on', item.key);
                      onTabChange(item.key);
                    }}
                    className={`admin-sidebar__menu-item ${
                      activeTab === item.key ? 'admin-sidebar__menu-item--active' : ''
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}
