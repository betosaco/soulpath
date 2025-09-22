'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MessageCircle, CheckCircle, XCircle, Unlink } from 'lucide-react';
import { toast } from 'sonner';

interface TelegramUser {
  id: string;
  telegramChatId: string;
  telegramUsername?: string;
  isActive: boolean;
  lastInteraction: string;
  createdAt: string;
}

interface TelegramLinkStatus {
  linked: boolean;
  telegramUser: TelegramUser | null;
}

export function TelegramAccountLink() {
  const [status, setStatus] = useState<TelegramLinkStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [chatId, setChatId] = useState('');

  // Load current link status
  useEffect(() => {
    loadLinkStatus();
  }, []);

  const loadLinkStatus = async () => {
    try {
      const response = await fetch('/api/telegram/link-account');
      const data = await response.json();

      if (data.success) {
        setStatus(data);
      } else {
        toast.error('Failed to load Telegram link status');
      }
    } catch (error) {
      console.error('Error loading link status:', error);
      toast.error('Failed to load Telegram link status');
    }
  };

  const handleLinkAccount = async () => {
    if (linking) return;

    setLinking(true);
    try {
      // Open Telegram bot
      window.open('https://t.me/Matmaxcommerce_bot', '_blank');

      // Instructions for user
      toast.success('Telegram bot opened! Follow the instructions in the bot to get your Chat ID, then enter it below.', {
        duration: 15000,
      });

      setLinking(false);

    } catch (error) {
      console.error('Error opening Telegram:', error);
      toast.error('Failed to open Telegram');
      setLinking(false);
    }
  };

  const handleManualLink = async (chatId: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/telegram/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChatId: chatId }),
      });

      const data = await response.json();

      if (data.success) {
        await loadLinkStatus();
        toast.success('Telegram account linked successfully!');
      } else {
        toast.error(data.error || 'Failed to link account');
      }
    } catch (error) {
      console.error('Error linking account:', error);
      toast.error('Failed to link Telegram account');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkAccount = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/telegram/link-account', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ linked: false, telegramUser: null });
        toast.success('Telegram account unlinked successfully');
      } else {
        toast.error(data.error || 'Failed to unlink account');
      }
    } catch (error) {
      console.error('Error unlinking account:', error);
      toast.error('Failed to unlink Telegram account');
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Telegram Notifications
        </CardTitle>
        <CardDescription>
          Link your Telegram account to receive order confirmations and updates instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.linked && status.telegramUser ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Telegram Account Linked</p>
                <p className="text-sm text-green-600">
                  Connected to @{status.telegramUser.telegramUsername || 'Telegram User'}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                Active
              </Badge>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p>Last interaction: {new Date(status.telegramUser.lastInteraction).toLocaleString()}</p>
              <p>Linked on: {new Date(status.telegramUser.createdAt).toLocaleDateString()}</p>
            </div>

            <Button
              variant="outline"
              onClick={handleUnlinkAccount}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Unlink className="h-4 w-4 mr-2" />
              )}
              Unlink Telegram Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <MessageCircle className="h-4 w-4" />
              <AlertDescription>
                Get instant order confirmations and updates on Telegram! Link your account to receive notifications directly in the MatMax Telegram Bot.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">How to link your account:</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Click "Open Telegram Bot" below</li>
                <li>In the bot chat, send the message: <code>/register</code></li>
                <li>The bot will show you your Chat ID</li>
                <li>Copy the Chat ID and paste it below</li>
                <li>Click "Link with Chat ID"</li>
              </ol>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleLinkAccount}
                disabled={linking}
                variant="outline"
                className="w-full"
              >
                {linking ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MessageCircle className="h-4 w-4 mr-2" />
                )}
                {linking ? 'Opening...' : 'Open Telegram Bot'}
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enter Chat ID from bot:</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="123456789"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleManualLink(chatId)}
                    disabled={loading || !chatId.trim()}
                    size="sm"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Link'
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {!status.linked && (
              <p className="text-xs text-gray-500 text-center">
                Don't have Telegram? <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download Telegram</a>
              </p>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">What you'll receive:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Instant order confirmations</li>
            <li>✅ Payment status updates</li>
            <li>✅ Shipping notifications</li>
            <li>✅ Special offers and updates</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
