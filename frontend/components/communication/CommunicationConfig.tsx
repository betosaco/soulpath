'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Save, 
  TestTube, 
  Eye, 
  EyeOff, 
  Mail, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bot,
  MessageCircle,
  Instagram,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface CommunicationConfigData {
  // Email Configuration
  email_enabled: boolean;
  email_provider: 'brevo' | 'resend';
  brevo_api_key: string;
  resend_api_key: string;
  sender_email: string;
  sender_name: string;
  admin_email: string;
  
  // SMS Configuration
  sms_enabled: boolean;
  sms_provider: string;
  labsmobile_username: string;
  labsmobile_token: string;
  sms_sender_name: string;
  
  // Telegram Configuration
  telegram_enabled: boolean;
  telegram_bot_token: string;
  telegram_webhook_url: string;
  telegram_chat_ids: string[];
  telegram_username: string;

  // WhatsApp Configuration
  whatsapp_enabled: boolean;
  whatsapp_business_account_id: string;
  whatsapp_access_token: string;
  whatsapp_phone_number_id: string;
  whatsapp_webhook_verify_token: string;

  // Instagram Configuration
  instagram_enabled: boolean;
  instagram_access_token: string;
  instagram_business_account_id: string;
  instagram_webhook_verify_token: string;
}

export function CommunicationConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState<CommunicationConfigData>({
    email_enabled: true,
    email_provider: 'brevo',
    brevo_api_key: '',
    resend_api_key: '',
    sender_email: 'noreply@matmax.store',
    sender_name: 'MatMax Yoga Studio',
    admin_email: 'admin@matmax.store',
    sms_enabled: false,
    sms_provider: 'labsmobile',
    labsmobile_username: '',
    labsmobile_token: '',
    sms_sender_name: 'MatMax Yoga Studio',
    telegram_enabled: false,
    telegram_bot_token: '',
    telegram_webhook_url: '',
    telegram_chat_ids: [],
    telegram_username: 'Matmaxcommerce_bot',
    whatsapp_enabled: false,
    whatsapp_business_account_id: '',
    whatsapp_access_token: '',
    whatsapp_phone_number_id: '',
    whatsapp_webhook_verify_token: '',
    instagram_enabled: false,
    instagram_access_token: '',
    instagram_business_account_id: '',
    instagram_webhook_verify_token: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showResendApiKey, setShowResendApiKey] = useState(false);
  const [showSmsToken, setShowSmsToken] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [showWhatsAppToken, setShowWhatsAppToken] = useState(false);
  const [showInstagramToken, setShowInstagramToken] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testTelegramChat, setTestTelegramChat] = useState('');
  const [testMessage, setTestMessage] = useState('Test message from MatMax Yoga Studio');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingSms, setIsTestingSms] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [isTestingInstagram, setIsTestingInstagram] = useState(false);
  const [testInstagramUser, setTestInstagramUser] = useState('');
  const [telegramUsers, setTelegramUsers] = useState<any[]>([]);
  const [telegramUsersLoaded, setTelegramUsersLoaded] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatIdInput, setChatIdInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadConfiguration = useCallback(async () => {
    if (!user?.access_token) {
      console.log('❌ No access token available for communication config');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/communication/config', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.config) {
        // Ensure all string values are properly initialized to prevent controlled/uncontrolled input errors
        const safeConfig = {
          ...data.config,
          brevo_api_key: data.config.brevo_api_key || '',
          resend_api_key: data.config.resend_api_key || '',
          sender_email: data.config.sender_email || '',
          sender_name: data.config.sender_name || '',
          admin_email: data.config.admin_email || '',
          labsmobile_username: data.config.labsmobile_username || '',
          labsmobile_token: data.config.labsmobile_token || '',
          sms_sender_name: data.config.sms_sender_name || '',
          telegram_bot_token: data.config.telegram_bot_token || '',
          telegram_webhook_url: data.config.telegram_webhook_url || '',
          telegram_username: data.config.telegram_username || '',
          whatsapp_business_account_id: data.config.whatsapp_business_account_id || '',
          whatsapp_access_token: data.config.whatsapp_access_token || '',
          whatsapp_phone_number_id: data.config.whatsapp_phone_number_id || '',
          whatsapp_webhook_verify_token: data.config.whatsapp_webhook_verify_token || '',
          instagram_access_token: data.config.instagram_access_token || '',
          instagram_business_account_id: data.config.instagram_business_account_id || '',
          instagram_webhook_verify_token: data.config.instagram_webhook_verify_token || ''
        };
        setConfig(safeConfig);
        setMessage({ type: 'success', text: 'Configuration loaded successfully!' });
      } else {
        console.error('Failed to load configuration:', response.status, response.statusText);
        setMessage({ type: 'error', text: 'Failed to load configuration' });
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
      setMessage({ type: 'error', text: 'Failed to load configuration' });
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user?.access_token) {
      loadConfiguration();
    }
  }, [user?.access_token, loadConfiguration]);

  const saveConfiguration = async () => {
    setIsSaving(true);
    try {
      console.log('🔧 Saving communication configuration...', {
        config,
        userToken: user?.access_token ? 'Present' : 'Missing',
        endpoint: '/api/admin/communication/config'
      });

      const response = await fetch('/api/admin/communication/config', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      console.log('📡 Save response status:', response.status);
      console.log('📡 Save response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('📊 Save response data:', data);

      if (data.success) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
        console.log('✅ Configuration saved successfully');
      } else {
        console.error('❌ Save failed:', data);
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      console.error('❌ Error saving configuration:', error);
      setMessage({ type: 'error', text: `Failed to save configuration: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

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
          to: testEmail,
          subject: 'Test Email from MatMax Yoga Studio',
          content: '<p>This is a test email to verify your email configuration.</p>'
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Test email sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test email' });
      }
    } catch (error) {
      console.error('Error sending test email:', error);
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
          phoneNumber: testPhone,
          message: testMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Test SMS sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test SMS' });
      }
    } catch (error) {
      console.error('Error sending test SMS:', error);
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
          chatId: testTelegramChat,
          message: testMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Test Telegram message sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test Telegram message' });
      }
    } catch (error) {
      console.error('Error sending test Telegram message:', error);
      setMessage({ type: 'error', text: 'Failed to send test Telegram message' });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const testWhatsAppConnection = async () => {
    setIsTestingWhatsApp(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'whatsapp',
          phoneNumber: testPhone,
          message: testMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Test WhatsApp message sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test WhatsApp message' });
      }
    } catch (error) {
      console.error('Error sending test WhatsApp message:', error);
      setMessage({ type: 'error', text: 'Failed to send test WhatsApp message' });
    } finally {
      setIsTestingWhatsApp(false);
    }
  };

  const testInstagramConnection = async () => {
    setIsTestingInstagram(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'instagram',
          username: testInstagramUser,
          message: testMessage
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Test Instagram message sent successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test Instagram message' });
      }
    } catch (error) {
      console.error('Error sending test Instagram message:', error);
      setMessage({ type: 'error', text: 'Failed to send test Instagram message' });
    } finally {
      setIsTestingInstagram(false);
    }
  };

  const fetchTelegramUsers = async () => {
    console.log('🔄 Starting to fetch Telegram users...');
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users/telegram', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response data:', data);
        setTelegramUsers(data.users || []);
        setTelegramUsersLoaded(true);
        setMessage({ type: 'success', text: `Loaded ${data.users?.length || 0} users` });
      } else {
        const errorText = await response.text();
        console.error('❌ API Error response:', response.status, errorText);
        setTelegramUsers([]);
        setTelegramUsersLoaded(true);
        setMessage({ type: 'error', text: `Failed to load users: ${response.status}` });
      }
    } catch (error) {
      console.error('💥 Network error fetching Telegram users:', error);
      setTelegramUsers([]);
      setTelegramUsersLoaded(true);
      setMessage({ type: 'error', text: 'Network error: Failed to load users' });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const attachChatIdToUser = async (userId: string, chatId: string) => {
    try {
      const response = await fetch('/api/admin/users/telegram', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          chatId,
          action: 'attach'
        })
      });

      if (response.ok) {
        // Update local state
        setTelegramUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, telegram_chat_id: chatId } : user
        ));
        setMessage({ type: 'success', text: 'Chat ID attached successfully' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to attach chat ID' });
      }
    } catch (error) {
      console.error('Error attaching chat ID:', error);
      setMessage({ type: 'error', text: 'Failed to attach chat ID' });
    }
  };

  const detachChatIdFromUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users/telegram', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          action: 'detach'
        })
      });

      if (response.ok) {
        // Update local state
        setTelegramUsers(prev => prev.map(user =>
          user.id === userId ? { ...user, telegram_chat_id: null } : user
        ));
        setMessage({ type: 'success', text: 'Chat ID detached successfully' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to detach chat ID' });
      }
    } catch (error) {
      console.error('Error detaching chat ID:', error);
      setMessage({ type: 'error', text: 'Failed to detach chat ID' });
    }
  };

  const openUserModal = async () => {
    setShowUserModal(true);
    if (!telegramUsersLoaded) {
      await fetchTelegramUsers();
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSearchQuery('');
    setSelectedUser(null);
    setChatIdInput('');
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setChatIdInput(user.telegram_chat_id || '');
  };

  const saveUserChatId = async () => {
    if (!selectedUser || !chatIdInput.trim()) return;
    
    await attachChatIdToUser(selectedUser.id, chatIdInput.trim());
    closeUserModal();
  };

  const filteredUsers = telegramUsers.filter(user => 
    (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Display */}
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} className="text-green-400" />
          ) : (
            <AlertCircle size={20} className="text-red-400" />
          )}
          <span className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </span>
        </div>
      )}

      <div className="flex justify-end">
        <BaseButton
          onClick={saveConfiguration}
          disabled={isSaving}
          className="dashboard-button-primary"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Configuration
            </>
          )}
        </BaseButton>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Primary Communication Services */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Primary Communication Services</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Configuration */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-card-title flex items-center gap-2">
              <Mail size={20} />
                  <span>Email</span>
            </CardTitle>
          </CardHeader>
              <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                    <Label className="dashboard-label">Enable Email</Label>
                    <p className="text-xs text-gray-500">Email notifications</p>
              </div>
              <Switch
                checked={config.email_enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, email_enabled: checked }))}
              />
            </div>

                <div>
                  <Label className="dashboard-label">Email Provider</Label>
                  <Select
                    value={config.email_provider}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, email_provider: value as 'brevo' | 'resend' }))}
                  >
                    <SelectTrigger className="dashboard-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brevo">Brevo</SelectItem>
                      <SelectItem value="resend">Resend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brevo API Key */}
                {config.email_provider === 'brevo' && (
              <div>
                <Label className="dashboard-label">Brevo API Key</Label>
                <div className="relative">
                  <BaseInput
                    type={showApiKey ? "text" : "password"}
                    value={config.brevo_api_key}
                    onChange={(e) => setConfig(prev => ({ ...prev, brevo_api_key: e.target.value }))}
                        placeholder="Your Brevo API Key"
                    className="dashboard-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                  >
                    {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
                )}

                {/* Resend API Key */}
                {config.email_provider === 'resend' && (
                  <div>
                    <Label className="dashboard-label">Resend API Key</Label>
                    <div className="relative">
                      <BaseInput
                        type={showResendApiKey ? "text" : "password"}
                        value={config.resend_api_key}
                        onChange={(e) => setConfig(prev => ({ ...prev, resend_api_key: e.target.value }))}
                        placeholder="Your Resend API Key"
                        className="dashboard-input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResendApiKey(!showResendApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                      >
                        {showResendApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}
              
              <div>
                <Label className="dashboard-label">Sender Email</Label>
                <BaseInput
                  type="email"
                  value={config.sender_email}
                  onChange={(e) => setConfig(prev => ({ ...prev, sender_email: e.target.value }))}
                  placeholder="noreply@yourdomain.com"
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-label">Sender Name</Label>
                <BaseInput
                    type="text"
                  value={config.sender_name}
                  onChange={(e) => setConfig(prev => ({ ...prev, sender_name: e.target.value }))}
                    placeholder="Your Company Name"
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-label">Admin Email</Label>
                <BaseInput
                  type="email"
                  value={config.admin_email}
                  onChange={(e) => setConfig(prev => ({ ...prev, admin_email: e.target.value }))}
                  placeholder="admin@yourdomain.com"
                  className="dashboard-input"
                />
            </div>
          </CardContent>
        </Card>

        {/* SMS Configuration */}
            <Card className="dashboard-card">
          <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
              <Smartphone size={20} />
                  <span>SMS</span>
            </CardTitle>
          </CardHeader>
              <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                    <Label className="dashboard-label">Enable SMS</Label>
                    <p className="text-xs text-gray-500">SMS notifications</p>
              </div>
              <Switch
                checked={config.sms_enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, sms_enabled: checked }))}
              />
            </div>

              <div>
                  <Label className="dashboard-label">SMS Provider</Label>
                  <Select
                    value={config.sms_provider}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, sms_provider: value }))}
                  >
                    <SelectTrigger className="dashboard-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="labsmobile">LabsMobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                  <Label className="dashboard-label">LabsMobile Username</Label>
                <BaseInput
                    type="text"
                  value={config.labsmobile_username}
                  onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_username: e.target.value }))}
                    placeholder="Your LabsMobile username"
                    className="dashboard-input"
                />
              </div>

              <div>
                  <Label className="dashboard-label">LabsMobile Token</Label>
                <div className="relative">
                  <BaseInput
                    type={showSmsToken ? "text" : "password"}
                    value={config.labsmobile_token}
                    onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_token: e.target.value }))}
                      placeholder="Your LabsMobile token"
                      className="dashboard-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSmsToken(!showSmsToken)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                  >
                    {showSmsToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                  <Label className="dashboard-label">SMS Sender Name</Label>
                <BaseInput
                    type="text"
                  value={config.sms_sender_name}
                  onChange={(e) => setConfig(prev => ({ ...prev, sms_sender_name: e.target.value }))}
                    placeholder="MatMax Yoga Studio"
                    className="dashboard-input"
                />
              </div>

                {/* SMS Test Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TestTube size={16} />
                    <Label className="dashboard-label">Test SMS</Label>
            </div>

              <div className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Phone Number</Label>
                <BaseInput
                        type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1234567890"
                        className="dashboard-input"
                />
                    </div>
                    
                    <div>
                      <Label className="text-sm text-gray-600">Test Message</Label>
                <BaseInput
                        type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Test message from MatMax Yoga Studio"
                        className="dashboard-input"
                      />
                    </div>
                    
                    <BaseButton
                      onClick={testSmsConnection}
                      disabled={!testPhone || !config.labsmobile_username || !config.labsmobile_token || isTestingSms}
                      className="dashboard-button-secondary w-full"
                    >
                      {isTestingSms ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Testing SMS...
                        </>
                      ) : (
                        <>
                          <TestTube size={16} className="mr-2" />
                          Test SMS
                        </>
                      )}
                    </BaseButton>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Telegram Configuration */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Bot size={20} />
                  <span>Telegram Bot</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dashboard-label">Enable Telegram</Label>
                    <p className="text-xs text-gray-500">Telegram notifications</p>
                  </div>
                  <Switch
                    checked={config.telegram_enabled}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, telegram_enabled: checked }))}
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Bot Token</Label>
                  <div className="relative">
                    <BaseInput
                      type={showTelegramToken ? "text" : "password"}
                      value={config.telegram_bot_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, telegram_bot_token: e.target.value }))}
                      placeholder="Your Telegram Bot Token"
                      className="dashboard-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTelegramToken(!showTelegramToken)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                    >
                      {showTelegramToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="dashboard-label">Bot Username</Label>
                  <BaseInput
                    type="text"
                    value={config.telegram_username}
                    onChange={(e) => setConfig(prev => ({ ...prev, telegram_username: e.target.value }))}
                    placeholder="@YourBotUsername"
                    className="dashboard-input"
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Webhook URL</Label>
                  <BaseInput
                    type="url"
                    value={config.telegram_webhook_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, telegram_webhook_url: e.target.value }))}
                    placeholder="https://yourdomain.com/webhook/telegram"
                    className="dashboard-input"
                  />
                </div>

                {/* User Management */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="dashboard-label">User Management</Label>
                    <BaseButton
                      onClick={openUserModal}
                      className="dashboard-button-secondary"
                      size="sm"
                    >
                      Manage Users
                    </BaseButton>
                  </div>
                  <p className="text-xs text-gray-500">
                    Attach Telegram chat IDs to specific users for targeted notifications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media APIs */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Social Media APIs</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* WhatsApp Business API */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span>WhatsApp Business</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dashboard-label">Enable WhatsApp</Label>
                    <p className="text-xs text-gray-500">WhatsApp Business notifications</p>
                  </div>
                  <Switch
                    checked={config.whatsapp_enabled}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, whatsapp_enabled: checked }))}
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Business Account ID</Label>
                  <BaseInput
                    type="text"
                    value={config.whatsapp_business_account_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_business_account_id: e.target.value }))}
                    placeholder="Your WhatsApp Business Account ID"
                    className="dashboard-input"
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Access Token</Label>
                  <div className="relative">
                    <BaseInput
                      type={showWhatsAppToken ? "text" : "password"}
                      value={config.whatsapp_access_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_access_token: e.target.value }))}
                      placeholder="Your WhatsApp Access Token"
                      className="dashboard-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                    >
                      {showWhatsAppToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="dashboard-label">Phone Number ID</Label>
                  <BaseInput
                    type="text"
                    value={config.whatsapp_phone_number_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_phone_number_id: e.target.value }))}
                    placeholder="Your WhatsApp Phone Number ID"
                    className="dashboard-input"
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Webhook Verify Token</Label>
                  <BaseInput
                    type="text"
                    value={config.whatsapp_webhook_verify_token}
                    onChange={(e) => setConfig(prev => ({ ...prev, whatsapp_webhook_verify_token: e.target.value }))}
                    placeholder="Your WhatsApp Webhook Verify Token"
                    className="dashboard-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Instagram Business API */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Instagram size={20} />
                  <span>Instagram Business</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="dashboard-label">Enable Instagram</Label>
                    <p className="text-xs text-gray-500">Instagram Business notifications</p>
                  </div>
                  <Switch
                    checked={config.instagram_enabled}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, instagram_enabled: checked }))}
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Access Token</Label>
                  <div className="relative">
                    <BaseInput
                      type={showInstagramToken ? "text" : "password"}
                      value={config.instagram_access_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, instagram_access_token: e.target.value }))}
                      placeholder="Your Instagram Access Token"
                      className="dashboard-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInstagramToken(!showInstagramToken)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#C0C0C0] hover:text-white"
                    >
                      {showInstagramToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label className="dashboard-label">Business Account ID</Label>
                  <BaseInput
                    type="text"
                    value={config.instagram_business_account_id}
                    onChange={(e) => setConfig(prev => ({ ...prev, instagram_business_account_id: e.target.value }))}
                    placeholder="Your Instagram Business Account ID"
                    className="dashboard-input"
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Webhook Verify Token</Label>
                  <BaseInput
                    type="text"
                    value={config.instagram_webhook_verify_token}
                    onChange={(e) => setConfig(prev => ({ ...prev, instagram_webhook_verify_token: e.target.value }))}
                    placeholder="Your Instagram Webhook Verify Token"
                    className="dashboard-input"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testing Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Test Communications</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Testing */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Mail size={20} />
                  <span>Test Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="dashboard-label">Test Email Address</Label>
                  <BaseInput
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="dashboard-input"
                  />
                </div>
                <BaseButton
                  onClick={testEmailConnection}
                  disabled={isTestingEmail || !testEmail}
                  className="dashboard-button-primary w-full"
                >
                  {isTestingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test Email
                    </>
                  )}
                </BaseButton>
              </CardContent>
            </Card>

            {/* SMS Testing */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Smartphone size={20} />
                  <span>Test SMS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="dashboard-label">Test Phone Number</Label>
                  <BaseInput
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="dashboard-input"
                  />
                </div>
                <BaseButton
                  onClick={testSmsConnection}
                  disabled={isTestingSms || !testPhone}
                  className="dashboard-button-primary w-full"
                >
                  {isTestingSms ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test SMS
                    </>
                  )}
                </BaseButton>
              </CardContent>
            </Card>

            {/* Telegram Testing */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Bot size={20} />
                  <span>Test Telegram</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="dashboard-label">Test Chat ID</Label>
                  <BaseInput
                    type="text"
                    value={testTelegramChat}
                    onChange={(e) => setTestTelegramChat(e.target.value)}
                    placeholder="123456789"
                    className="dashboard-input"
                  />
              </div>
                <BaseButton
                  onClick={testTelegramConnection}
                  disabled={isTestingTelegram || !testTelegramChat}
                  className="dashboard-button-primary w-full"
                >
                  {isTestingTelegram ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test Telegram
                    </>
                  )}
                </BaseButton>
              </CardContent>
            </Card>

            {/* WhatsApp Testing */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <MessageCircle size={20} />
                  <span>Test WhatsApp</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="dashboard-label">Test Phone Number</Label>
                  <BaseInput
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="dashboard-input"
                  />
            </div>
                <BaseButton
                  onClick={testWhatsAppConnection}
                  disabled={isTestingWhatsApp || !testPhone}
                  className="dashboard-button-primary w-full"
                >
                  {isTestingWhatsApp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test WhatsApp
                    </>
                  )}
                </BaseButton>
          </CardContent>
        </Card>

            {/* Instagram Testing */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="dashboard-card-title flex items-center gap-2">
                  <Instagram size={20} />
                  <span>Test Instagram</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="dashboard-label">Test Username</Label>
                  <BaseInput
                    type="text"
                    value={testInstagramUser}
                    onChange={(e) => setTestInstagramUser(e.target.value)}
                    placeholder="@username"
                    className="dashboard-input"
                  />
      </div>
                <BaseButton
                  onClick={testInstagramConnection}
                  disabled={isTestingInstagram || !testInstagramUser}
                  className="dashboard-button-primary w-full"
                >
                  {isTestingInstagram ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test Instagram
                    </>
                  )}
                </BaseButton>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Telegram User Management Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Manage Telegram Users</h3>
              <button
                onClick={closeUserModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="dashboard-label">Search Users</Label>
                <BaseInput
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="dashboard-input"
                />
              </div>

              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.fullName || 'No Name'}</p>
                          <p className="text-sm text-gray-500">{user.email || 'No Email'}</p>
                          {user.telegram_chat_id && (
                            <p className="text-xs text-green-600">Chat ID: {user.telegram_chat_id}</p>
                          )}
                        </div>
                        {user.telegram_chat_id && (
                          <BaseButton
                            onClick={() => detachChatIdFromUser(user.id)}
                            className="dashboard-button-danger"
                            size="sm"
                          >
                            Detach
                          </BaseButton>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedUser && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <Label className="dashboard-label">Selected User</Label>
                      <p className="text-sm font-medium">{selectedUser.fullName || 'No Name'}</p>
                      <p className="text-xs text-gray-500">{selectedUser.email || 'No Email'}</p>
                    </div>
                    <div>
                      <Label className="dashboard-label">Telegram Chat ID</Label>
                      <BaseInput
                        type="text"
                        value={chatIdInput}
                        onChange={(e) => setChatIdInput(e.target.value)}
                        placeholder="Enter Telegram Chat ID"
                        className="dashboard-input"
                      />
                    </div>
                    <div className="flex gap-2">
                      <BaseButton
                        onClick={saveUserChatId}
                        disabled={!chatIdInput.trim()}
                        className="dashboard-button-primary"
                      >
                        Save Chat ID
                      </BaseButton>
                      <BaseButton
                        onClick={closeUserModal}
                        className="dashboard-button-secondary"
                      >
                        Cancel
                      </BaseButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}