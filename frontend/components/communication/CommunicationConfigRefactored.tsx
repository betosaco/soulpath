'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCommunicationConfig } from '../../hooks/useCommunicationConfig';
import { CommunicationConfigHeader } from './CommunicationConfigHeader';
import { EmailConfigCard } from './EmailConfigCard';
import { SmsConfigCard } from './SmsConfigCard';
import { TelegramConfigCard } from './TelegramConfigCard';


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
  const testEmailConnection = async () => {
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
          to: 'test@example.com',
          subject: 'Test Email from MatMax Yoga Studio',
          content: '<p>This is a test email to verify your email configuration.</p>'
        })
      });

      const data = await response.json();
      setMessage(data.success
        ? { type: 'success', text: 'Test email sent successfully!' }
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
    setMessage({ type: 'error', text: 'Telegram user management feature coming soon!' });
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
            email_enabled: config.email_enabled,
            email_provider: config.email_provider,
            brevo_api_key: config.brevo_api_key,
            resend_api_key: config.resend_api_key,
            sender_email: config.sender_email,
            sender_name: config.sender_name,
            admin_email: config.admin_email
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
            telegram_enabled: config.telegram_enabled,
            telegram_bot_token: config.telegram_bot_token,
            telegram_webhook_url: config.telegram_webhook_url,
            telegram_chat_ids: config.telegram_chat_ids,
            telegram_username: config.telegram_username
          }}
          onConfigChange={handleConfigChange}
          onTestConnection={testTelegramConnection}
          onManageUsers={handleManageTelegramUsers}
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
    </div>
  );
}
