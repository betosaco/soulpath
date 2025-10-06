'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCommunicationConfig } from '../../hooks/useCommunicationConfig';
import { CommunicationConfigHeader } from './CommunicationConfigHeader';
import { EmailConfigCard } from './EmailConfigCard';
import { SmsConfigCard } from './SmsConfigCard';
import { TelegramConfigCard } from './TelegramConfigCard';
import { TelegramUserManagement } from './TelegramUserManagement';
import { AddTelegramUsers } from './AddTelegramUsers';


export function CommunicationConfigRefactored() {
  const { user } = useAuth();

  // Use the custom hook for configuration management
  const { config, isLoading, error, updateConfig } = useCommunicationConfig();

  // UI state
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Testing states
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingSms, setIsTestingSms] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  // Modal states
  const [isTelegramUserManagementOpen, setIsTelegramUserManagementOpen] = useState(false);
  const [isAddTelegramUsersOpen, setIsAddTelegramUsersOpen] = useState(false);

  // Handle saving configuration
  const handleSaveConfiguration = async () => {
    const success = await updateConfig({});
    if (success) {
      setMessage({ type: 'success', text: 'Configuration saved successfully!' });
    } else {
      setMessage({ type: 'error', text: error || 'Failed to save configuration' });
    }
  };

  // Handle configuration changes
  const handleConfigChange = async (key: string, value: any) => {
    await updateConfig({ [key]: value });
  };

  // Test functions
  const testEmailConnection = async (testEmailAddress?: string) => {
    setIsTestingEmail(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'email',
          to: testEmailAddress || 'test@example.com',
          subject: 'Test Email from MatMax Yoga Studio',
          content: '<p>This is a test email to verify your email configuration.</p>'
        })
      });

      const data = await response.json();
      setMessage(data.success
        ? { type: 'success', text: `Test email sent successfully to ${testEmailAddress || 'test@example.com'}!` }
        : { type: 'error', text: data.error || 'Failed to send test email' }
      );
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test email' });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const testSmsConnection = async () => {
    setIsTestingSms(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'sms',
          phoneNumber: '+1234567890',
          message: 'Test SMS from MatMax Yoga Studio'
        })
      });

      const data = await response.json();
      setMessage(data.success
        ? { type: 'success', text: 'Test SMS sent successfully!' }
        : { type: 'error', text: data.error || 'Failed to send test SMS' }
      );
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test SMS' });
    } finally {
      setIsTestingSms(false);
    }
  };

  const testTelegramConnection = async () => {
    setIsTestingTelegram(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'telegram',
          chatId: '123456789',
          message: 'Test message from MatMax Yoga Studio'
        })
      });

      const data = await response.json();
      setMessage(data.success
        ? { type: 'success', text: 'Test Telegram message sent successfully!' }
        : { type: 'error', text: data.error || 'Failed to send test Telegram message' }
      );
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test Telegram message' });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  // Placeholder functions for features not yet implemented
  const handleTestTemplates = () => {
    setMessage({ type: 'error', text: 'Template testing feature coming soon!' });
  };

  const handleManageTelegramUsers = () => {
    setIsTelegramUserManagementOpen(true);
  };

  const handleAddTelegramUsers = () => {
    setIsAddTelegramUsersOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <CommunicationConfigHeader
        isSaving={false} // The hook handles saving state
        isLoading={isLoading}
        message={message}
        onSave={handleSaveConfiguration}
        onTestTemplates={handleTestTemplates}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <EmailConfigCard
          config={{
            emailEnabled: config.emailEnabled,
            emailProvider: config.emailProvider,
            brevoApiKey: config.brevoApiKey,
            resendApiKey: config.resendApiKey,
            senderEmail: config.senderEmail,
            senderName: config.senderName,
            adminEmail: config.adminEmail
          }}
          onConfigChange={handleConfigChange}
          onTestConnection={testEmailConnection}
          isTesting={isTestingEmail}
        />

        <SmsConfigCard
          config={{
            sms_enabled: config.sms_enabled,
            sms_provider: config.sms_provider,
            labsmobile_username: config.labsmobile_username,
            labsmobile_token: config.labsmobile_token,
            sms_sender_name: config.sms_sender_name
          }}
          onConfigChange={handleConfigChange}
          onTestConnection={testSmsConnection}
          isTesting={isTestingSms}
        />

        <TelegramConfigCard
          config={{
            telegramEnabled: config.telegramEnabled,
            telegramBotToken: config.telegramBotToken,
            telegramWebhookUrl: config.telegramWebhookUrl,
            telegramChatIds: config.telegramChatIds,
            telegramUsername: config.telegramUsername
          }}
          onConfigChange={handleConfigChange}
          onTestConnection={testTelegramConnection}
          onManageUsers={handleManageTelegramUsers}
          onAddUsers={handleAddTelegramUsers}
          isTesting={isTestingTelegram}
        />
      </div>

      {/* WhatsApp and Instagram placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-lg font-medium mb-2">WhatsApp Configuration</h3>
            <p className="text-sm">WhatsApp Business API integration coming soon...</p>
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-medium mb-2">Instagram Configuration</h3>
            <p className="text-sm">Instagram Business API integration coming soon...</p>
          </div>
        </div>
      </div>

      {/* Telegram User Management Modal */}
      <TelegramUserManagement
        isOpen={isTelegramUserManagementOpen}
        onClose={() => setIsTelegramUserManagementOpen(false)}
        user={user}
      />

      {/* Add Telegram Users Modal */}
      <AddTelegramUsers
        isOpen={isAddTelegramUsersOpen}
        onClose={() => setIsAddTelegramUsersOpen(false)}
        user={user}
      />
    </div>
  );
}
