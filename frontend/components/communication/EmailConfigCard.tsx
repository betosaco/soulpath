import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Eye, EyeOff, TestTube, CheckCircle, AlertCircle, Info, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface EmailConfigCardProps {
  config: {
    email_enabled: boolean;
    email_provider: 'brevo' | 'resend';
    brevo_api_key: string;
    resend_api_key: string;
    sender_email: string;
    sender_name: string;
    admin_email: string;
  };
  onConfigChange: (key: string, value: any) => void;
  onTestConnection: () => Promise<void>;
  isTesting: boolean;
}

export function EmailConfigCard({ config, onConfigChange, onTestConnection, isTesting }: EmailConfigCardProps) {
  const { user } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showResendApiKey, setShowResendApiKey] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // Validation states
  const [brevoValidation, setBrevoValidation] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message?: string;
  }>({ status: 'idle' });

  const [resendValidation, setResendValidation] = useState<{
    status: 'idle' | 'validating' | 'valid' | 'invalid';
    message?: string;
  }>({ status: 'idle' });

  // Debounced validation function
  const validateApiKey = useCallback(async (provider: 'brevo' | 'resend', apiKey: string) => {
    if (!apiKey || apiKey.length < 10) {
      if (provider === 'brevo') {
        setBrevoValidation({ status: 'idle' });
      } else {
        setResendValidation({ status: 'idle' });
      }
      return;
    }

    if (provider === 'brevo') {
      setBrevoValidation({ status: 'validating' });
    } else {
      setResendValidation({ status: 'validating' });
    }

    try {
      const response = await fetch('/api/admin/communication/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          type: 'email',
          apiKey
        })
      });

      const result = await response.json();

      if (provider === 'brevo') {
        setBrevoValidation({
          status: result.success ? 'valid' : 'invalid',
          message: result.error
        });
      } else {
        setResendValidation({
          status: result.success ? 'valid' : 'invalid',
          message: result.error
        });
      }
    } catch (error) {
      if (provider === 'brevo') {
        setBrevoValidation({
          status: 'invalid',
          message: 'Connection failed'
        });
      } else {
        setResendValidation({
          status: 'invalid',
          message: 'Connection failed'
        });
      }
    }
  }, [user?.access_token]);

  // Debounced effect for Brevo API key validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (config.email_provider === 'brevo' && config.brevo_api_key) {
        validateApiKey('brevo', config.brevo_api_key);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [config.brevo_api_key, config.email_provider, validateApiKey]);

  // Debounced effect for Resend API key validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (config.email_provider === 'resend' && config.resend_api_key) {
        validateApiKey('resend', config.resend_api_key);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [config.resend_api_key, config.email_provider, validateApiKey]);

  const getValidationIcon = (validation: typeof brevoValidation) => {
    switch (validation.status) {
      case 'validating':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getValidationColor = (validation: typeof brevoValidation) => {
    switch (validation.status) {
      case 'valid':
        return 'border-green-300 focus:border-green-500 focus:ring-green-500';
      case 'invalid':
        return 'border-red-300 focus:border-red-500 focus:ring-red-500';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-500" />
          Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="email_enabled" className="text-sm font-medium">
            Enable Email Service
          </Label>
          <Switch
            id="email_enabled"
            checked={config.email_enabled}
            onCheckedChange={(checked) => onConfigChange('email_enabled', checked)}
          />
        </div>

        {config.email_enabled && (
          <>
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="email_provider">Email Provider</Label>
              <Select
                value={config.email_provider}
                onValueChange={(value: 'brevo' | 'resend') => onConfigChange('email_provider', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brevo">Brevo (Sendinblue)</SelectItem>
                  <SelectItem value="resend">Resend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Brevo Configuration */}
            {config.email_provider === 'brevo' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-900">Brevo Configuration</h4>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://app.brevo.com/settings/keys/api"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Get API Key
                    </a>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Brevo (formerly Sendinblue) provides email marketing and transactional email services.
                        You'll need an API key with appropriate permissions.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brevo_api_key" className="flex items-center gap-2">
                    API Key
                    {getValidationIcon(brevoValidation)}
                  </Label>
                  <div className="relative">
                    <BaseInput
                      id="brevo_api_key"
                      type={showApiKey ? 'text' : 'password'}
                      value={config.brevo_api_key}
                      onChange={(e) => onConfigChange('brevo_api_key', e.target.value)}
                      placeholder="Enter your Brevo API key"
                      className={getValidationColor(brevoValidation)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {brevoValidation.status === 'invalid' && brevoValidation.message && (
                    <p className="text-xs text-red-600 mt-1">{brevoValidation.message}</p>
                  )}
                  {brevoValidation.status === 'valid' && (
                    <p className="text-xs text-green-600 mt-1">✓ API key validated successfully</p>
                  )}
                </div>
              </div>
            )}

            {/* Resend Configuration */}
            {config.email_provider === 'resend' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-900">Resend Configuration</h4>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Get API Key
                    </a>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        Resend provides a simple, reliable email API for transactional emails.
                        Create an API key in your Resend dashboard.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resend_api_key" className="flex items-center gap-2">
                    API Key
                    {getValidationIcon(resendValidation)}
                  </Label>
                  <div className="relative">
                    <BaseInput
                      id="resend_api_key"
                      type={showResendApiKey ? 'text' : 'password'}
                      value={config.resend_api_key}
                      onChange={(e) => onConfigChange('resend_api_key', e.target.value)}
                      placeholder="Enter your Resend API key"
                      className={getValidationColor(resendValidation)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowResendApiKey(!showResendApiKey)}
                    >
                      {showResendApiKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {resendValidation.status === 'invalid' && resendValidation.message && (
                    <p className="text-xs text-red-600 mt-1">{resendValidation.message}</p>
                  )}
                  {resendValidation.status === 'valid' && (
                    <p className="text-xs text-green-600 mt-1">✓ API key validated successfully</p>
                  )}
                </div>
              </div>
            )}

            {/* Sender Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender_email">Sender Email</Label>
                <BaseInput
                  id="sender_email"
                  type="email"
                  value={config.sender_email}
                  onChange={(e) => onConfigChange('sender_email', e.target.value)}
                  placeholder="noreply@yourdomain.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender_name">Sender Name</Label>
                <BaseInput
                  id="sender_name"
                  value={config.sender_name}
                  onChange={(e) => onConfigChange('sender_name', e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
            </div>

            {/* Admin Email */}
            <div className="space-y-2">
              <Label htmlFor="admin_email">Admin Email (for notifications)</Label>
              <BaseInput
                id="admin_email"
                type="email"
                value={config.admin_email}
                onChange={(e) => onConfigChange('admin_email', e.target.value)}
                placeholder="admin@yourdomain.com"
              />
            </div>

            {/* Test Email Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test Email Configuration
              </h4>
              <div className="space-y-2">
                <Label htmlFor="test_email">Test Email Address</Label>
                <BaseInput
                  id="test_email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
              </div>
              <BaseButton
                onClick={onTestConnection}
                disabled={isTesting || !testEmail.trim()}
                className="w-full"
                variant="outline"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="h-4 w-4 mr-2" />
                    Test Email Connection
                  </>
                )}
              </BaseButton>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
