import React, { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useCommunicationStore, useCommunicationActions } from '../store/communication-store';

interface UseCommunicationConfigReturn {
  config: any; // Using any to maintain compatibility
  isLoading: boolean;
  error: string | null;
  updateConfig: (updates: any) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useCommunicationConfig(): UseCommunicationConfigReturn {
  const { user } = useAuth();
  const { config, isLoading, error } = useCommunicationStore();
  const { setConfig, updateConfig: storeUpdateConfig, setLoading, setError } = useCommunicationActions();

  const loadConfig = useCallback(async () => {
    if (!user?.access_token) {
      setError('No authentication token available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/communication/config', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          // Transform Prisma field names to camelCase for frontend compatibility
          const transformedConfig = {
            email_enabled: data.config.emailEnabled ?? true,
            email_provider: data.config.emailProvider ?? 'brevo',
            brevo_api_key: data.config.brevoApiKey ?? '',
            resend_api_key: data.config.resendApiKey ?? '',
            sender_email: data.config.senderEmail ?? 'noreply@matmax.world',
            sender_name: data.config.senderName ?? 'MatMax Wellness Studio',
            admin_email: data.config.adminEmail ?? 'admin@matmax.world',
            sms_enabled: data.config.smsEnabled ?? false,
            sms_provider: data.config.smsProvider ?? 'labsmobile',
            labsmobile_username: data.config.labsmobileUsername ?? '',
            labsmobile_token: data.config.labsmobileToken ?? '',
            sms_sender_name: data.config.smsSenderName ?? 'MatMax Yoga Studio',
            telegram_enabled: data.config.telegramEnabled ?? false,
            telegram_bot_token: data.config.telegramBotToken ?? '',
            telegram_webhook_url: data.config.telegramWebhookUrl ?? '',
            telegram_chat_ids: [], // This field was removed from the unified model
            telegram_username: data.config.telegramBotUsername ?? '',
            whatsapp_enabled: data.config.whatsappEnabled ?? false,
            whatsapp_business_account_id: data.config.whatsappBusinessAccountId ?? '',
            whatsapp_access_token: data.config.whatsappAccessToken ?? '',
            whatsapp_phone_number_id: data.config.whatsappPhoneNumberId ?? '',
            whatsapp_webhook_verify_token: data.config.whatsappWebhookVerifyToken ?? '',
            instagram_enabled: data.config.instagramEnabled ?? false,
            instagram_access_token: data.config.instagramAccessToken ?? '',
            instagram_business_account_id: data.config.instagramBusinessAccountId ?? '',
            instagram_webhook_verify_token: data.config.instagramWebhookVerifyToken ?? ''
          };
          setConfig(transformedConfig);
        } else {
          setError('Invalid configuration data received');
        }
      } else {
        setError(`Failed to load configuration: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, [user?.access_token, setConfig, setLoading, setError]);

  const updateConfig = useCallback(async (updates: any): Promise<boolean> => {
    if (!user?.access_token) {
      setError('No authentication token available');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Transform camelCase field names to Prisma field names
      const prismaUpdates = {
        ...(updates.email_enabled !== undefined && { emailEnabled: updates.email_enabled }),
        ...(updates.email_provider !== undefined && { emailProvider: updates.email_provider }),
        ...(updates.brevo_api_key !== undefined && { brevoApiKey: updates.brevo_api_key }),
        ...(updates.resend_api_key !== undefined && { resendApiKey: updates.resend_api_key }),
        ...(updates.sender_email !== undefined && { senderEmail: updates.sender_email }),
        ...(updates.sender_name !== undefined && { senderName: updates.sender_name }),
        ...(updates.admin_email !== undefined && { adminEmail: updates.admin_email }),
        ...(updates.sms_enabled !== undefined && { smsEnabled: updates.sms_enabled }),
        ...(updates.sms_provider !== undefined && { smsProvider: updates.sms_provider }),
        ...(updates.labsmobile_username !== undefined && { labsmobileUsername: updates.labsmobile_username }),
        ...(updates.labsmobile_token !== undefined && { labsmobileToken: updates.labsmobile_token }),
        ...(updates.sms_sender_name !== undefined && { smsSenderName: updates.sms_sender_name }),
        ...(updates.telegram_enabled !== undefined && { telegramEnabled: updates.telegram_enabled }),
        ...(updates.telegram_bot_token !== undefined && { telegramBotToken: updates.telegram_bot_token }),
        ...(updates.telegram_webhook_url !== undefined && { telegramWebhookUrl: updates.telegram_webhook_url }),
        ...(updates.telegram_username !== undefined && { telegramBotUsername: updates.telegram_username }),
        ...(updates.whatsapp_enabled !== undefined && { whatsappEnabled: updates.whatsapp_enabled }),
        ...(updates.whatsapp_business_account_id !== undefined && { whatsappBusinessAccountId: updates.whatsapp_business_account_id }),
        ...(updates.whatsapp_access_token !== undefined && { whatsappAccessToken: updates.whatsapp_access_token }),
        ...(updates.whatsapp_phone_number_id !== undefined && { whatsappPhoneNumberId: updates.whatsapp_phone_number_id }),
        ...(updates.whatsapp_webhook_verify_token !== undefined && { whatsappWebhookVerifyToken: updates.whatsapp_webhook_verify_token }),
        ...(updates.instagram_enabled !== undefined && { instagramEnabled: updates.instagram_enabled }),
        ...(updates.instagram_access_token !== undefined && { instagramAccessToken: updates.instagram_access_token }),
        ...(updates.instagram_business_account_id !== undefined && { instagramBusinessAccountId: updates.instagram_business_account_id }),
        ...(updates.instagram_webhook_verify_token !== undefined && { instagramWebhookVerifyToken: updates.instagram_webhook_verify_token }),
      };

      const response = await fetch('/api/admin/communication/config', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prismaUpdates)
      });

      if (response.ok) {
        // Update local store with the original camelCase format
        storeUpdateConfig(updates);
        return true;
      } else {
        setError(`Failed to update configuration: ${response.status}`);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.access_token, storeUpdateConfig, setLoading, setError]);

  // Load config on mount
  React.useEffect(() => {
    if (user?.access_token && !config) {
      loadConfig();
    }
  }, [user?.access_token, config, loadConfig]);

  return {
    config: config || {
      email_enabled: true,
      email_provider: 'brevo',
      brevo_api_key: '',
      resend_api_key: '',
      sender_email: 'noreply@matmax.world',
      sender_name: 'MatMax Wellness Studio',
      admin_email: 'admin@matmax.world',
      sms_enabled: false,
      sms_provider: 'labsmobile',
      labsmobile_username: '',
      labsmobile_token: '',
      sms_sender_name: 'MatMax Yoga Studio',
      telegram_enabled: false,
      telegram_bot_token: '',
      telegram_webhook_url: '',
      telegram_chat_ids: [],
      telegram_username: '',
      whatsapp_enabled: false,
      whatsapp_business_account_id: '',
      whatsapp_access_token: '',
      whatsapp_phone_number_id: '',
      whatsapp_webhook_verify_token: '',
      instagram_enabled: false,
      instagram_access_token: '',
      instagram_business_account_id: '',
      instagram_webhook_verify_token: ''
    },
    isLoading,
    error,
    updateConfig,
    refetch: loadConfig
  };
}
