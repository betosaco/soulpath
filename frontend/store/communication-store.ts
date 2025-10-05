import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CommunicationConfigData {
  // General
  adminEmail: string;

  // Email Settings
  emailEnabled: boolean;
  emailProvider: 'brevo' | 'resend';
  senderEmail: string;
  senderName: string;
  brevoApiKey?: string;
  resendApiKey?: string;

  // SMS Settings
  smsEnabled: boolean;
  smsProvider: string;
  smsSenderName?: string;
  labsmobileUsername?: string;
  labsmobileToken?: string;

  // Telegram Settings
  telegramEnabled: boolean;
  telegramBotToken?: string;
  telegramWebhookUrl?: string;
  telegramBotUsername?: string;

  // WhatsApp Settings
  whatsappEnabled: boolean;
  whatsappAccessToken?: string;
  whatsappPhoneNumberId?: string;
  whatsappBusinessAccountId?: string;
  whatsappWebhookVerifyToken?: string;

  // Instagram Settings
  instagramEnabled: boolean;
  instagramAccessToken?: string;
  instagramBusinessAccountId?: string;
  instagramWebhookVerifyToken?: string;
}

interface CommunicationState {
  config: CommunicationConfigData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setConfig: (config: CommunicationConfigData) => void;
  updateConfig: (updates: Partial<CommunicationConfigData>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultConfig: CommunicationConfigData = {
  adminEmail: 'admin@matmax.world',
  emailEnabled: true,
  emailProvider: 'brevo',
  senderEmail: 'noreply@matmax.world',
  senderName: 'MatMax Wellness Studio',
  smsEnabled: false,
  smsProvider: 'labsmobile',
  telegramEnabled: false,
  whatsappEnabled: false,
  instagramEnabled: false,
};

export const useCommunicationStore = create<CommunicationState>()(
  devtools(
    (set, get) => ({
      config: null,
      isLoading: false,
      error: null,

      setConfig: (config: CommunicationConfigData) =>
        set({ config, error: null }),

      updateConfig: (updates: Partial<CommunicationConfigData>) =>
        set((state) => ({
          config: state.config ? { ...state.config, ...updates } : null,
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      reset: () =>
        set({
          config: null,
          isLoading: false,
          error: null,
        }),
    }),
    {
      name: 'communication-store',
    }
  )
);

// Selectors for specific parts of the state
export const useCommunicationConfig = () => {
  const { config, isLoading, error } = useCommunicationStore();
  return { config: config || defaultConfig, isLoading, error };
};

export const useCommunicationActions = () => {
  const { setConfig, updateConfig, setLoading, setError, reset } = useCommunicationStore();
  return { setConfig, updateConfig, setLoading, setError, reset };
};
