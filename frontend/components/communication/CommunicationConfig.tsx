'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Bot
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NEW_PURCHASE_TEMPLATE } from './templates/NewPurchaseTemplate';

interface CommunicationConfigData {
  // Email Configuration
  email_enabled: boolean;
  brevo_api_key: string;
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
}

export function CommunicationConfig() {
  const { user } = useAuth();
  const [config, setConfig] = useState<CommunicationConfigData>({
    email_enabled: true,
    brevo_api_key: '',
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
    telegram_username: 'MatMaxYogaBot'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSmsToken, setShowSmsToken] = useState(false);
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'telegram'>('email');
  const [testEmail, setTestEmail] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testTelegramChat, setTestTelegramChat] = useState('');
  const [testMessage, setTestMessage] = useState('Test message from MatMax Yoga Studio');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingSms, setIsTestingSms] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [newChatId, setNewChatId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('');
  const [templateCategory, setTemplateCategory] = useState<string>('');
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
        setConfig(data.config);
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
      const response = await fetch('/api/admin/communication/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();
      if (data.config) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save configuration' });
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setIsSaving(false);
    }
  };

  const testEmailConnection = async () => {
    if (!testEmail) return;
    
    setIsTestingEmail(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
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
    if (!testPhone) return;
    
    setIsTestingSms(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
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
    if (!testTelegramChat) return;
    
    setIsTestingTelegram(true);
    try {
      const response = await fetch('/api/admin/communication/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
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

  const addChatId = () => {
    if (newChatId.trim() && !config.telegram_chat_ids.includes(newChatId.trim())) {
      setConfig(prev => ({
        ...prev,
        telegram_chat_ids: [...prev.telegram_chat_ids, newChatId.trim()]
      }));
      setNewChatId('');
    }
  };

  const removeChatId = (chatIdToRemove: string) => {
    setConfig(prev => ({
      ...prev,
      telegram_chat_ids: prev.telegram_chat_ids.filter(id => id !== chatIdToRemove)
    }));
  };

  const loadTemplate = (templateName: string) => {
    setSelectedTemplate(templateName);
    setTemplateName(templateName);
    
    switch (templateName) {
      case 'New Purchase Confirmation':
        setTemplateContent(NEW_PURCHASE_TEMPLATE);
        setTemplateCategory('payment');
        break;
      case 'Welcome Message':
        setTemplateContent(`Welcome to MatMax Yoga Studio! 🧘‍♀️\n\nWe're excited to have you join our community. Here you'll find information about our classes, schedules, and wellness programs.\n\nUse /help to see available commands.`);
        setTemplateCategory('welcome');
        break;
      case 'Class Reminder':
        setTemplateContent(`🧘‍♀️ Class Reminder\n\nYour {class_name} class is starting in {time_remaining}!\n\n📍 Location: {venue_name}\n⏰ Time: {class_time}\n\nSee you soon! 🙏`);
        setTemplateCategory('reminder');
        break;
      case 'Payment Confirmation':
        setTemplateContent(`💳 Payment Confirmed!\n\nAmount: {amount}\nPayment Method: {payment_method}\nTransaction ID: {transaction_id}\n\nThank you for your payment! Your booking is now confirmed.\n\n🙏 Namaste`);
        setTemplateCategory('payment');
        break;
      default:
        setTemplateContent('');
        setTemplateCategory('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffd700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="dashboard-text-secondary">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20' 
            : 'bg-red-500/10 border border-red-500/20'
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

      {/* Tab Navigation */}
      <div className="border-b border-[#C0C0C0]/20">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('email')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'email'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#C0C0C0] hover:text-white hover:border-[#C0C0C0]'
            }`}
          >
            <Mail size={16} className="inline mr-2" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sms'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#C0C0C0] hover:text-white hover:border-[#C0C0C0]'
            }`}
          >
            <Smartphone size={16} className="inline mr-2" />
            SMS
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'telegram'
                ? 'border-[#ffd700] text-[#ffd700]'
                : 'border-transparent text-[#C0C0C0] hover:text-white hover:border-[#C0C0C0]'
            }`}
          >
            <Bot size={16} className="inline mr-2" />
            Telegram
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'email' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Configuration */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="dashboard-card-title flex items-center gap-2">
              <Mail size={20} />
              <span>Email Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="dashboard-label">Enable Email Service</Label>
                <p className="text-xs text-gray-500">Enable email notifications and templates</p>
              </div>
              <Switch
                checked={config.email_enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, email_enabled: checked }))}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="dashboard-label">Brevo API Key</Label>
                <div className="relative">
                  <BaseInput
                    type={showApiKey ? "text" : "password"}
                    value={config.brevo_api_key}
                    onChange={(e) => setConfig(prev => ({ ...prev, brevo_api_key: e.target.value }))}
                    placeholder="Enter your Brevo API key"
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
                  value={config.sender_name}
                  onChange={(e) => setConfig(prev => ({ ...prev, sender_name: e.target.value }))}
                  placeholder="SoulPath Astrology"
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
            </div>

            {/* Test Email Section */}
            <div className="border-t border-[#C0C0C0]/20 pt-6">
              <h4 className="font-medium dashboard-text-primary mb-4">Test Email Configuration</h4>
              <div className="space-y-3">
                <BaseInput
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter test email address"
                  className="dashboard-input"
                />
                <BaseButton
                  onClick={testEmailConnection}
                  disabled={isTestingEmail || !testEmail || !config.email_enabled}
                  className="dashboard-button-success w-full"
                >
                  {isTestingEmail ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test Email
                    </>
                  )}
                </BaseButton>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SMS Configuration */}
        <Card className="bg-[#0A0A23]/30 border-[#C0C0C0]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#EAEAEA]">
              <Smartphone size={20} />
              <span>SMS Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-[#C0C0C0]">Enable SMS Service</Label>
                <p className="text-xs text-gray-500">Enable SMS OTP verification and notifications</p>
              </div>
              <Switch
                checked={config.sms_enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, sms_enabled: checked }))}
              />
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-[#C0C0C0]">SMS Provider</Label>
                <Select value={config.sms_provider} onValueChange={(value) => setConfig(prev => ({ ...prev, sms_provider: value }))}>
                  <SelectTrigger className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="labsmobile">Labsmobile</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Currently only Labsmobile is supported</p>
              </div>

              <div>
                <Label className="text-[#C0C0C0]">Labsmobile Username</Label>
                <BaseInput
                  value={config.labsmobile_username}
                  onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_username: e.target.value }))}
                  placeholder="Your Labsmobile username"
                  className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                />
              </div>

              <div>
                <Label className="text-[#C0C0C0]">Labsmobile API Token</Label>
                <div className="relative">
                  <BaseInput
                    type={showSmsToken ? "text" : "password"}
                    value={config.labsmobile_token}
                    onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_token: e.target.value }))}
                    placeholder="Your Labsmobile API token"
                    className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA] pr-10"
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
                <Label className="text-[#C0C0C0]">SMS Sender Name</Label>
                <BaseInput
                  value={config.sms_sender_name}
                  onChange={(e) => setConfig(prev => ({ ...prev, sms_sender_name: e.target.value }))}
                  placeholder="SMS sender name (e.g., SoulPath)"
                  className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                />
              </div>
            </div>

            {/* Test SMS Section */}
            <div className="border-t border-[#C0C0C0]/20 pt-6">
              <h4 className="font-medium text-[#EAEAEA] mb-4">Test SMS Configuration</h4>
              <div className="space-y-3">
                <BaseInput
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                />
                <BaseInput
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Test SMS message"
                  className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                />
                <BaseButton
                  onClick={testSmsConnection}
                  disabled={isTestingSms || !testPhone || !config.sms_enabled}
                  className="bg-[#10B981] hover:bg-[#059669] text-white px-4 w-full"
                >
                  {isTestingSms ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <TestTube size={16} className="mr-2" />
                      Send Test SMS
                    </>
                  )}
                </BaseButton>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      )}

      {activeTab === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMS Configuration */}
          <Card className="bg-[#0A0A23]/30 border-[#C0C0C0]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EAEAEA]">
                <Smartphone size={20} />
                <span>SMS Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-[#C0C0C0]">Enable SMS Service</Label>
                  <p className="text-xs text-gray-500">Enable SMS OTP verification and notifications</p>
                </div>
                <Switch
                  checked={config.sms_enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, sms_enabled: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-[#C0C0C0]">SMS Provider</Label>
                  <Select value={config.sms_provider} onValueChange={(value) => setConfig(prev => ({ ...prev, sms_provider: value }))}>
                    <SelectTrigger className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="labsmobile">Labsmobile</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Currently only Labsmobile is supported</p>
                </div>

                <div>
                  <Label className="text-[#C0C0C0]">Labsmobile Username</Label>
                  <BaseInput
                    value={config.labsmobile_username}
                    onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_username: e.target.value }))}
                    placeholder="Your Labsmobile username"
                    className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                  />
                </div>

                <div>
                  <Label className="text-[#C0C0C0]">Labsmobile API Token</Label>
                  <div className="relative">
                    <BaseInput
                      type={showSmsToken ? "text" : "password"}
                      value={config.labsmobile_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, labsmobile_token: e.target.value }))}
                      placeholder="Your Labsmobile API token"
                      className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA] pr-10"
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
                  <Label className="text-[#C0C0C0]">SMS Sender Name</Label>
                  <BaseInput
                    value={config.sms_sender_name}
                    onChange={(e) => setConfig(prev => ({ ...prev, sms_sender_name: e.target.value }))}
                    placeholder="SMS sender name (e.g., SoulPath)"
                    className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                  />
                </div>
              </div>

              {/* Test SMS Section */}
              <div className="border-t border-[#C0C0C0]/20 pt-6">
                <h4 className="font-medium text-[#EAEAEA] mb-4">Test SMS Configuration</h4>
                <div className="space-y-3">
                  <BaseInput
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                  />
                  <BaseInput
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Test SMS message"
                    className="bg-[#0A0A23]/50 border-[#C0C0C0]/30 text-[#EAEAEA]"
                  />
                  <BaseButton
                    onClick={testSmsConnection}
                    disabled={isTestingSms || !testPhone || !config.sms_enabled}
                    className="bg-[#10B981] hover:bg-[#059669] text-white px-4 w-full"
                  >
                    {isTestingSms ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <TestTube size={16} className="mr-2" />
                        Send Test SMS
                      </>
                    )}
                  </BaseButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Telegram Configuration */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title flex items-center gap-2">
                <Bot size={20} />
                <span>Telegram Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="dashboard-label">Enable Telegram Service</Label>
                  <p className="text-xs text-gray-500">Enable Telegram bot notifications and templates</p>
                </div>
                <Switch
                  checked={config.telegram_enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, telegram_enabled: checked }))}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="dashboard-label">Telegram Bot Token</Label>
                  <div className="relative">
                    <BaseInput
                      type={showTelegramToken ? "text" : "password"}
                      value={config.telegram_bot_token}
                      onChange={(e) => setConfig(prev => ({ ...prev, telegram_bot_token: e.target.value }))}
                      placeholder="Enter your Telegram bot token"
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
                  <Label className="dashboard-label">Webhook URL</Label>
                  <BaseInput
                    value={config.telegram_webhook_url}
                    onChange={(e) => setConfig(prev => ({ ...prev, telegram_webhook_url: e.target.value }))}
                    placeholder="https://yourdomain.com/api/telegram/webhook"
                    className="dashboard-input"
                  />
                </div>

                <div>
                  <Label className="dashboard-label">Notification Chat IDs</Label>
                  <div className="space-y-3">
                    {/* Add new chat ID */}
                    <div className="flex gap-2">
                      <BaseInput
                        value={newChatId}
                        onChange={(e) => setNewChatId(e.target.value)}
                        placeholder="Enter chat ID or username"
                        className="dashboard-input flex-1"
                      />
                      <BaseButton
                        onClick={addChatId}
                        disabled={!newChatId.trim()}
                        className="dashboard-button-primary"
                      >
                        Add
                      </BaseButton>
                    </div>
                    
                    {/* List of chat IDs */}
                    <div className="space-y-2">
                      {config.telegram_chat_ids.map((chatId, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-[#0A0A23]/30 rounded border border-[#C0C0C0]/20">
                          <span className="text-[#EAEAEA] text-sm">{chatId}</span>
                          <button
                            onClick={() => removeChatId(chatId)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {config.telegram_chat_ids.length === 0 && (
                        <p className="text-[#C0C0C0] text-sm">No chat IDs added yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="dashboard-label">Bot Username</Label>
                  <BaseInput
                    value={config.telegram_username}
                    onChange={(e) => setConfig(prev => ({ ...prev, telegram_username: e.target.value }))}
                    placeholder="Your bot username"
                    className="dashboard-input"
                  />
                </div>
              </div>

              {/* Test Telegram Section */}
              <div className="border-t border-[#C0C0C0]/20 pt-6">
                <h4 className="font-medium dashboard-text-primary mb-4">Test Telegram Configuration</h4>
                <div className="space-y-3">
                  <BaseInput
                    value={testTelegramChat}
                    onChange={(e) => setTestTelegramChat(e.target.value)}
                    placeholder="Enter chat ID or username"
                    className="dashboard-input"
                  />
                  <BaseInput
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Test Telegram message"
                    className="dashboard-input"
                  />
                  <BaseButton
                    onClick={testTelegramConnection}
                    disabled={isTestingTelegram || !testTelegramChat || !config.telegram_enabled}
                    className="dashboard-button-success w-full"
                  >
                    {isTestingTelegram ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <TestTube size={16} className="mr-2" />
                        Send Test Message
                      </>
                    )}
                  </BaseButton>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Telegram Template Manager */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="dashboard-card-title flex items-center gap-2">
                <MessageSquare size={20} />
                <span>Telegram Template Manager</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {/* Template Categories */}
                <div>
                  <Label className="dashboard-label">Template Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 text-left border border-[#C0C0C0]/30 rounded hover:bg-[#0A0A23]/30 transition-colors">
                      <div className="font-medium text-[#EAEAEA]">Welcome Messages</div>
                      <div className="text-xs text-[#C0C0C0]">User onboarding</div>
                    </button>
                    <button className="p-3 text-left border border-[#C0C0C0]/30 rounded hover:bg-[#0A0A23]/30 transition-colors">
                      <div className="font-medium text-[#EAEAEA]">Class Reminders</div>
                      <div className="text-xs text-[#C0C0C0]">Booking notifications</div>
                    </button>
                    <button className="p-3 text-left border border-[#C0C0C0]/30 rounded hover:bg-[#0A0A23]/30 transition-colors">
                      <div className="font-medium text-[#EAEAEA]">Payment Confirmations</div>
                      <div className="text-xs text-[#C0C0C0]">Transaction updates</div>
                    </button>
                    <button className="p-3 text-left border border-[#C0C0C0]/30 rounded hover:bg-[#0A0A23]/30 transition-colors">
                      <div className="font-medium text-[#EAEAEA]">Promotional</div>
                      <div className="text-xs text-[#C0C0C0]">Marketing messages</div>
                    </button>
                  </div>
                </div>

                {/* Template Editor */}
                <div>
                  <Label className="dashboard-label">Template Editor</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <BaseInput
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name"
                        className="dashboard-input flex-1"
                      />
                      <Select value={templateCategory} onValueChange={setTemplateCategory}>
                        <SelectTrigger className="dashboard-input w-40">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="welcome">Welcome</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="promotional">Promotional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <textarea
                      value={templateContent}
                      onChange={(e) => setTemplateContent(e.target.value)}
                      placeholder="Enter your template message here... Use variables like {userName}, {class_name}, {venue_name}, etc."
                      className="dashboard-input h-48 resize-none"
                    />
                    
                    <div className="flex gap-2">
                      <BaseButton className="dashboard-button-primary">
                        Save Template
                      </BaseButton>
                      <BaseButton className="dashboard-button-secondary">
                        Preview
                      </BaseButton>
                      <BaseButton 
                        className="dashboard-button-success"
                        onClick={() => {
                          setTestMessage(templateContent);
                          setTestTelegramChat(config.telegram_chat_ids[0] || '');
                        }}
                      >
                        Test Send
                      </BaseButton>
                    </div>
                  </div>
                </div>

                {/* Available Variables */}
                <div>
                  <Label className="dashboard-label">Available Variables</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">User Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{userName}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{userEmail}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{user_phone}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{submissionDate}'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">MATPASS Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassType}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassDescription}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassPrice}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassStartDate}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassEndDate}'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">Booking Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{bookingId}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{bookingDate}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{bookingTime}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{teacherName}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{className}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{venue}'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">Product Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{productName}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{productDescription}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{productQuantity}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{productPrice}'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">Order Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{matpassSubtotal}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{productsSubtotal}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{subtotalBeforeTax}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{igvAmount}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{orderTotal}'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[#C0C0C0]">System Variables:</div>
                      <div className="text-[#EAEAEA] font-mono">{'{adminEmail}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{date}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{time}'}</div>
                      <div className="text-[#EAEAEA] font-mono">{'{studio_name}'}</div>
                    </div>
                  </div>
                </div>

                {/* Template Library */}
                <div>
                  <Label className="dashboard-label">Template Library</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-3 border border-[#C0C0C0]/30 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#EAEAEA]">🌿 New Purchase Confirmation</div>
                        <div className="text-xs text-[#C0C0C0]">Complete order confirmation with MATPASS, bookings, and products</div>
                      </div>
                      <div className="flex gap-1">
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-secondary"
                          onClick={() => loadTemplate('New Purchase Confirmation')}
                        >
                          Edit
                        </BaseButton>
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-success"
                          onClick={() => {
                            loadTemplate('New Purchase Confirmation');
                            setTestMessage(NEW_PURCHASE_TEMPLATE);
                            setTestTelegramChat(config.telegram_chat_ids[0] || '');
                          }}
                        >
                          Test
                        </BaseButton>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-[#C0C0C0]/30 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#EAEAEA]">Welcome Message</div>
                        <div className="text-xs text-[#C0C0C0]">Welcome new users to the studio</div>
                      </div>
                      <div className="flex gap-1">
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-secondary"
                          onClick={() => loadTemplate('Welcome Message')}
                        >
                          Edit
                        </BaseButton>
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-success"
                          onClick={() => loadTemplate('Welcome Message')}
                        >
                          Test
                        </BaseButton>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-[#C0C0C0]/30 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#EAEAEA]">Class Reminder</div>
                        <div className="text-xs text-[#C0C0C0]">Remind users about upcoming classes</div>
                      </div>
                      <div className="flex gap-1">
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-secondary"
                          onClick={() => loadTemplate('Class Reminder')}
                        >
                          Edit
                        </BaseButton>
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-success"
                          onClick={() => loadTemplate('Class Reminder')}
                        >
                          Test
                        </BaseButton>
                      </div>
                    </div>
                    
                    <div className="p-3 border border-[#C0C0C0]/30 rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[#EAEAEA]">Payment Confirmation</div>
                        <div className="text-xs text-[#C0C0C0]">Confirm successful payments</div>
                      </div>
                      <div className="flex gap-1">
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-secondary"
                          onClick={() => loadTemplate('Payment Confirmation')}
                        >
                          Edit
                        </BaseButton>
                        <BaseButton 
                          size="sm" 
                          className="dashboard-button-success"
                          onClick={() => loadTemplate('Payment Confirmation')}
                        >
                          Test
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
