'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClientManagement } from '../ClientManagement';
import BookingsManagement from '../BookingsManagement';
import { UnifiedScheduleManagement } from './UnifiedScheduleManagement';
import PackagesAndPricing from '../PackagesAndPricing';
import { ContentManagement } from '../ContentManagement';
import { CommunicationSettings } from '../communication/CommunicationSettings';
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
import { TeacherManagement } from './TeacherManagement';
// import { TeacherScheduleManagement } from './TeacherScheduleManagement'; // Replaced by UnifiedScheduleManagement
import { ServiceTypeManagement } from './ServiceTypeManagement';

interface AdminMainContentProps {
  activeTab: string;
  bugReportManagementRef?: React.RefObject<BugReportManagementRef>;
}

export function AdminMainContent({ activeTab, bugReportManagementRef }: AdminMainContentProps) {
  console.log('🎯 AdminMainContent: activeTab =', activeTab);

  return (
    <main className="admin-main-content">
      <div className="admin-main-content__wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="admin-main-content__container"
          >
            {activeTab === 'clients' && <ClientManagement />}
            {activeTab === 'bookings' && <BookingsManagement />}
            {activeTab === 'schedules' && <UnifiedScheduleManagement />}
            {activeTab === 'packages' && <PackagesAndPricing />}
            {activeTab === 'content' && <ContentManagement />}
            {activeTab === 'email' && <CommunicationSettings />}
            {activeTab === 'live-session' && <LiveSessionConfigManagement />}
            {activeTab === 'images' && <ImageManagement />}
            {activeTab === 'external-apis' && <ExternalAPIManagement />}
            {activeTab === 'seo' && <SeoManagement />}
            {activeTab === 'payment-methods' && <PaymentMethodManagement />}
            {activeTab === 'payment-records' && <PaymentRecordsManagement />}
            {activeTab === 'purchase-history' && <PurchaseHistoryManagement />}
            {activeTab === 'settings' && <SettingsManagement />}
            {activeTab === 'bug-reports' && <BugReportManagement ref={bugReportManagementRef} />}
            {activeTab === 'rasa-monitoring' && <RasaMonitoring />}
            {activeTab === 'rasa-tuning' && <RasaModelTuning />}
            {activeTab === 'conversation-logs' && <ConversationLogsManagement />}
            {activeTab === 'venues' && <VenueManagement />}
            {activeTab === 'teachers' && <TeacherManagement />}
            {activeTab === 'teacher-schedules' && <UnifiedScheduleManagement />}
            {activeTab === 'service-types' && <ServiceTypeManagement />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
