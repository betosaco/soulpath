import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Bot, Eye, EyeOff, TestTube, UserPlus } from 'lucide-react';

interface TelegramConfigCardProps {
  config: {
    telegram_enabled: boolean;
    telegram_bot_token: string;
    telegram_webhook_url: string;
    telegram_chat_ids: string[];
    telegram_username: string;
  };
  onConfigChange: (key: string, value: any) => void;
  onTestConnection: () => Promise<void>;
  onManageUsers: () => void;
  isTesting: boolean;
}

export function TelegramConfigCard({
  config,
  onConfigChange,
  onTestConnection,
  onManageUsers,
  isTesting
}: TelegramConfigCardProps) {
  const [showTelegramToken, setShowTelegramToken] = useState(false);
  const [testTelegramChat, setTestTelegramChat] = useState('');
  const [testMessage, setTestMessage] = useState('Test message from MatMax Yoga Studio');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-400" />
          Telegram Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="telegram_enabled" className="text-sm font-medium">
            Enable Telegram Bot
          </Label>
          <Switch
            id="telegram_enabled"
            checked={config.telegram_enabled}
            onCheckedChange={(checked) => onConfigChange('telegram_enabled', checked)}
          />
        </div>

        {config.telegram_enabled && (
          <>
            {/* Bot Token */}
            <div className="space-y-2">
              <Label htmlFor="telegram_bot_token">Bot Token</Label>
              <div className="relative">
                <BaseInput
                  id="telegram_bot_token"
                  type={showTelegramToken ? 'text' : 'password'}
                  value={config.telegram_bot_token}
                  onChange={(e) => onConfigChange('telegram_bot_token', e.target.value)}
                  placeholder="Enter your Telegram bot token"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowTelegramToken(!showTelegramToken)}
                >
                  {showTelegramToken ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Get your bot token from @BotFather on Telegram
              </div>
            </div>

            {/* Bot Username */}
            <div className="space-y-2">
              <Label htmlFor="telegram_username">Bot Username</Label>
              <BaseInput
                id="telegram_username"
                value={config.telegram_username}
                onChange={(e) => onConfigChange('telegram_username', e.target.value)}
                placeholder="your_bot_username"
              />
              <div className="text-xs text-gray-500">
                The username of your bot (without @)
              </div>
            </div>

            {/* Webhook URL */}
            <div className="space-y-2">
              <Label htmlFor="telegram_webhook_url">Webhook URL</Label>
              <BaseInput
                id="telegram_webhook_url"
                value={config.telegram_webhook_url}
                onChange={(e) => onConfigChange('telegram_webhook_url', e.target.value)}
                placeholder="https://yourdomain.com/api/telegram/webhook"
              />
              <div className="text-xs text-gray-500">
                URL where Telegram will send updates
              </div>
            </div>

            {/* Chat IDs */}
            <div className="space-y-2">
              <Label>Connected Users</Label>
              <div className="text-sm text-gray-600 mb-2">
                {config.telegram_chat_ids?.length || 0} users connected
              </div>
              <BaseButton
                onClick={onManageUsers}
                variant="outline"
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Telegram Users
              </BaseButton>
            </div>

            {/* Test Telegram Section */}
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-sm text-blue-900 flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Test Telegram Configuration
              </h4>
              <div className="space-y-2">
                <Label htmlFor="test_telegram_chat">Chat ID</Label>
                <BaseInput
                  id="test_telegram_chat"
                  value={testTelegramChat}
                  onChange={(e) => setTestTelegramChat(e.target.value)}
                  placeholder="123456789"
                />
                <div className="text-xs text-gray-500">
                  Send /start to your bot and check the webhook logs to get your chat ID
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="test_telegram_message">Test Message</Label>
                <BaseInput
                  id="test_telegram_message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message"
                />
              </div>
              <BaseButton
                onClick={onTestConnection}
                disabled={isTesting || !testTelegramChat.trim() || !testMessage.trim()}
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
                    Test Telegram Connection
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
