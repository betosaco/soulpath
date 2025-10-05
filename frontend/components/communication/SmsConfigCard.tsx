import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Smartphone, Eye, EyeOff, TestTube } from 'lucide-react';

interface SmsConfigCardProps {
  config: {
    sms_enabled: boolean;
    sms_provider: string;
    labsmobile_username: string;
    labsmobile_token: string;
    sms_sender_name: string;
  };
  onConfigChange: (key: string, value: any) => void;
  onTestConnection: () => Promise<void>;
  isTesting: boolean;
}

export function SmsConfigCard({ config, onConfigChange, onTestConnection, isTesting }: SmsConfigCardProps) {
  const [showSmsToken, setShowSmsToken] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Test message from MatMax Yoga Studio');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-green-500" />
          SMS Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="sms_enabled" className="text-sm font-medium">
            Enable SMS Service
          </Label>
          <Switch
            id="sms_enabled"
            checked={config.sms_enabled}
            onCheckedChange={(checked) => onConfigChange('sms_enabled', checked)}
          />
        </div>

        {config.sms_enabled && (
          <>
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label htmlFor="sms_provider">SMS Provider</Label>
              <div className="text-sm text-gray-600">
                Currently only LabsMobile is supported
              </div>
            </div>

            {/* LabsMobile Configuration */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-sm text-gray-900">LabsMobile Configuration</h4>

              <div className="space-y-2">
                <Label htmlFor="labsmobile_username">Username</Label>
                <BaseInput
                  id="labsmobile_username"
                  value={config.labsmobile_username}
                  onChange={(e) => onConfigChange('labsmobile_username', e.target.value)}
                  placeholder="Enter your LabsMobile username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labsmobile_token">API Token</Label>
                <div className="relative">
                  <BaseInput
                    id="labsmobile_token"
                    type={showSmsToken ? 'text' : 'password'}
                    value={config.labsmobile_token}
                    onChange={(e) => onConfigChange('labsmobile_token', e.target.value)}
                    placeholder="Enter your LabsMobile token"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowSmsToken(!showSmsToken)}
                  >
                    {showSmsToken ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms_sender_name">Sender Name</Label>
                <BaseInput
                  id="sms_sender_name"
                  value={config.sms_sender_name}
                  onChange={(e) => onConfigChange('sms_sender_name', e.target.value)}
                  placeholder="Your sender name (max 11 chars)"
                  maxLength={11}
                />
                <div className="text-xs text-gray-500">
                  Maximum 11 characters for sender name
                </div>
              </div>
            </div>

            {/* Test SMS Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <h4 className="font-medium text-sm text-green-900 flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test SMS Configuration
              </h4>
              <div className="space-y-2">
                <Label htmlFor="test_phone">Test Phone Number</Label>
                <BaseInput
                  id="test_phone"
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test_message">Test Message</Label>
                <BaseInput
                  id="test_message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message"
                />
              </div>
              <BaseButton
                onClick={onTestConnection}
                disabled={isTesting || !testPhone.trim() || !testMessage.trim()}
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
                    Test SMS Connection
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
