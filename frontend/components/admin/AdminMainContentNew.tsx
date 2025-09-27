'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminUI } from '@/lib/styles/admin-ui';

// Import existing components
import { ClientManagement } from '../ClientManagement';
import BookingsManagement from '../BookingsManagement';
import { UnifiedScheduleManagement } from './UnifiedScheduleManagement';
import PackagesAndPricing from '../PackagesAndPricing';
import { ContentManagement } from '../ContentManagement';
import { CommunicationSettings } from '../communication/CommunicationSettings';
import { CommunicationsDashboard } from '../communications/CommunicationsDashboard';
import { ImageManagement } from '../ImageManagement';
import { SeoManagement } from '../SeoManagement';
import PaymentMethodManagement from '../PaymentMethodManagement';
import PaymentRecordsManagement from '../PaymentRecordsManagement';
import PurchaseHistoryManagement from '../PurchaseHistoryManagement';
import { SettingsManagement } from '../SettingsManagement';
import { BugReportManagement, BugReportManagementRef } from '../BugReportManagement';
import { LiveSessionConfigManagement } from '../LiveSessionConfigManagement';
import { ExternalAPIManagement } from '../ExternalAPIManagement';
import { RasaMonitoring } from '../RasaMonitoring';
import { RasaModelTuning } from '../RasaModelTuning';
import ConversationLogsManagement from './ConversationLogsManagement';
import { VenueManagement } from './VenueManagement';
import { TeacherManagementEnhanced } from './TeacherManagementEnhanced';
import { ServiceTypeManagement } from './ServiceTypeManagement';

// Import dashboard components
import { AdminDashboardStats } from './AdminDashboardStats';

interface AdminMainContentNewProps {
  activeTab?: string;
  bugReportManagementRef?: React.RefObject<BugReportManagementRef>;
}

export function AdminMainContentNew({ activeTab = 'dashboard', bugReportManagementRef }: AdminMainContentNewProps) {
  console.log('🎯 AdminMainContentNew: activeTab =', activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboardStats />;
      case 'clients':
        return <ClientManagement />;
      case 'bookings':
        return <BookingsManagement />;
      case 'schedules':
        return <UnifiedScheduleManagement />;
      case 'packages':
        return <PackagesAndPricing />;
      case 'content':
        return <ContentManagement />;
      case 'email':
        return <CommunicationSettings />;
      case 'communications':
        return <CommunicationsDashboard />;
      case 'live-session':
        return <LiveSessionConfigManagement />;
      case 'images':
        return <ImageManagement />;
      case 'external-apis':
        return <ExternalAPIManagement />;
      case 'seo':
        return <SeoManagement />;
      case 'payment-methods':
        return <PaymentMethodManagement />;
      case 'payment-records':
        return <PaymentRecordsManagement />;
      case 'purchase-history':
        return <PurchaseHistoryManagement />;
      case 'settings':
        return <SettingsManagement />;
      case 'bug-reports':
        return <BugReportManagement ref={bugReportManagementRef} />;
      case 'rasa-monitoring':
        return <RasaMonitoring />;
      case 'chatbot':
        return <RasaMonitoring />;
      case 'rasa-tuning':
        return <RasaModelTuning />;
      case 'conversation-logs':
        return <ConversationLogsManagement />;
      case 'venues':
        return <VenueManagement />;
      case 'teachers':
        return <TeacherManagementEnhanced />;
      case 'service-types':
        return <ServiceTypeManagement />;
      default:
        return <AdminDashboardStats />;
    }
  };

  return (
    <div className="admin-main-content">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="admin-main-content__container"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
