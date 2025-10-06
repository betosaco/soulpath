'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Send,
  Mail,
  MessageSquare,
  Smartphone,
  Bot,
  Instagram,
  X,
  Users,
  User,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCommunicationConfig } from '../../hooks/useCommunicationConfig';
import { useTemplatesQuery } from '../../hooks/useTemplatesQuery';
import { useUsersQuery } from '../../hooks/useUsersQuery';
import { toast } from 'sonner';

interface UniversalComposerProps {
  isOpen: boolean;
  onClose: () => void;
  initialChannel?: 'email' | 'sms' | 'telegram' | 'whatsapp' | 'instagram';
  initialRecipients?: string[];
}

interface Recipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  telegramId?: string;
  whatsappId?: string;
  instagramId?: string;
  channels: ('email' | 'sms' | 'telegram' | 'whatsapp' | 'instagram')[];
  avatar?: string;
  role?: string;
}

export function UniversalComposer({
  isOpen,
  onClose,
  initialChannel = 'email',
  initialRecipients = []
}: UniversalComposerProps) {
  const { user } = useAuth();
  const { config } = useCommunicationConfig();
  const [selectedChannel, setSelectedChannel] = useState<'email' | 'sms' | 'telegram' | 'whatsapp' | 'instagram'>(initialChannel);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [subject, setSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recipientSearch, setRecipientSearch] = useState('');

  // Fetch templates for selected channel
  const { data: templatesData, isLoading: templatesLoading } = useTemplatesQuery({
    type: selectedChannel,
    isActive: true
  });

  // Fetch users for recipient selection
  const { data: usersData, isLoading: usersLoading } = useUsersQuery({
    search: recipientSearch,
    limit: 20
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedChannel(initialChannel);
      setSelectedRecipients([]);
      setMessageContent('');
      setSubject('');
      setSelectedTemplate('');
    }
  }, [isOpen, initialChannel]);

  // Update recipients when initialRecipients changes
  useEffect(() => {
    if (initialRecipients.length > 0 && usersData?.users) {
      const initialRecipientObjects = usersData.users.filter(user =>
        initialRecipients.includes(user.id)
      );
      setSelectedRecipients(initialRecipientObjects);
    }
  }, [initialRecipients, usersData]);

  // Channel configuration and icons
  const channels = [
    {
      id: 'email' as const,
      name: 'Email',
      icon: Mail,
      enabled: config?.emailEnabled,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'sms' as const,
      name: 'SMS',
      icon: Smartphone,
      enabled: config?.sms_enabled,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'telegram' as const,
      name: 'Telegram',
      icon: Bot,
      enabled: config?.telegramEnabled,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'whatsapp' as const,
      name: 'WhatsApp',
      icon: MessageSquare,
      enabled: config?.whatsapp_enabled,
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'instagram' as const,
      name: 'Instagram',
      icon: Instagram,
      enabled: config?.instagram_enabled,
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const availableChannels = channels.filter(c => c.enabled);

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = templatesData?.templates.find(t => t.id.toString() === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      // Load template content and subject
      const translation = template.translations.find(t => t.language === 'en') || template.translations[0];
      if (translation) {
        setMessageContent(translation.content);
        if (selectedChannel === 'email' && translation.subject) {
          setSubject(translation.subject);
        }
      }
    }
  };

  // Handle recipient selection
  const handleRecipientToggle = (recipient: Recipient) => {
    setSelectedRecipients(prev => {
      const isSelected = prev.some(r => r.id === recipient.id);
      if (isSelected) {
        return prev.filter(r => r.id !== recipient.id);
      } else {
        return [...prev, recipient];
      }
    });
  };

  // Send message
  const handleSend = async () => {
    if (!selectedRecipients.length || !messageContent.trim()) {
      toast.error('Please select recipients and enter a message');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/admin/communication/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channel: selectedChannel,
          recipients: selectedRecipients.map(r => r.id),
          content: messageContent,
          subject: selectedChannel === 'email' ? subject : undefined,
          templateId: selectedTemplate === 'custom' ? undefined : selectedTemplate
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Message sent successfully to ${selectedRecipients.length} recipient(s)!`);
        onClose();
      } else {
        toast.error(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">New Message</h2>
          <BaseButton variant="ghost" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </BaseButton>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Panel - Configuration */}
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Channel Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Channel</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableChannels.map(channel => {
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                          selectedChannel === channel.id
                            ? `${channel.color} border-current`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Template Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template or write custom" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Message</SelectItem>
                    {templatesData?.templates.filter(template => template.id).map(template => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Recipients Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Recipients ({selectedRecipients.length} selected)
                </Label>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={recipientSearch}
                    onChange={(e) => setRecipientSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Selected Recipients */}
                {selectedRecipients.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipients.map(recipient => (
                        <Badge
                          key={recipient.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={recipient.avatar} />
                            <AvatarFallback className="text-xs">
                              {recipient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {recipient.name}
                          <button
                            onClick={() => handleRecipientToggle(recipient)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Recipients */}
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                  {usersLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                      Loading users...
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {usersData?.users?.filter(user =>
                        !selectedRecipients.some(r => r.id === user.id)
                      ).map(user => {
                        // Mock channel availability - in real app, check user preferences
                        const userChannels = ['email' as const]; // Default to email
                        if (user.phone) userChannels.push('sms');
                        if (user.telegramId) userChannels.push('telegram');

                        return (
                          <button
                            key={user.id}
                            onClick={() => handleRecipientToggle({
                              id: user.id,
                              name: user.fullName || user.email || 'Unknown',
                              email: user.email,
                              phone: user.phone,
                              telegramId: user.telegramId,
                              channels: userChannels,
                              role: user.role
                            })}
                            className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>
                                  {user.fullName?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {user.fullName || user.email}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.email}
                                </p>
                                <div className="flex gap-1 mt-1">
                                  {userChannels.map(channel => {
                                    const channelInfo = channels.find(c => c.id === channel);
                                    if (!channelInfo) return null;
                                    const Icon = channelInfo.icon;
                                    return (
                                      <Icon key={channel} className="w-3 h-3 text-gray-400" />
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {userChannels.includes(selectedChannel) ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-500" title={`Not reachable via ${selectedChannel}`} />
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Message Composition */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Subject (for email only) */}
              {selectedChannel === 'email' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subject</Label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Message Content */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Message Content
                  {selectedChannel === 'email' && (
                    <span className="text-xs text-gray-500 ml-2">(HTML supported)</span>
                  )}
                </Label>
                <Textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={
                    selectedChannel === 'email'
                      ? 'Compose your email message...'
                      : 'Enter your message...'
                  }
                  rows={selectedChannel === 'email' ? 12 : 8}
                  className="mt-1 resize-none"
                />

                {selectedChannel === 'email' && (
                  <p className="text-xs text-gray-500 mt-2">
                    You can use HTML tags for formatting. Placeholders like {{userName}} will be replaced with actual data.
                  </p>
                )}
              </div>

              {/* Preview */}
              {messageContent && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      {selectedChannel === 'email' ? (
                        <div>
                          {subject && (
                            <div className="font-medium text-gray-900 mb-2 border-b pb-2">
                              Subject: {subject}
                            </div>
                          )}
                          <div
                            className="text-sm text-gray-700 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: messageContent }}
                          />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {messageContent}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Send Button */}
              <div className="flex justify-end pt-4 border-t">
                <BaseButton
                  onClick={handleSend}
                  disabled={isSending || !selectedRecipients.length || !messageContent.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
