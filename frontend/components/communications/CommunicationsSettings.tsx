'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { ArrowLeft, Settings } from 'lucide-react';

interface CommunicationsSettingsProps {
  onBackClick: () => void;
}

export function CommunicationsSettings({ onBackClick }: CommunicationsSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BaseButton
            variant="outline"
            size="sm"
            onClick={onBackClick}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </BaseButton>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Communications Settings</h2>
            <p className="text-gray-600 text-sm">Manage channels, templates, and automation</p>
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Management */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Channel Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Configure communication channels and their settings:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• WhatsApp integration (Twilio/Gupshup)</div>
              <div>• Instagram Direct Messages</div>
              <div>• Email SMTP configuration</div>
              <div>• Live chat widget settings</div>
              <div>• SMS provider setup</div>
              <div>• Telegram bot configuration</div>
            </div>
          </CardContent>
        </Card>

        {/* Template Management */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Template Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Manage message templates and automated responses:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• Welcome messages</div>
              <div>• Ticket created notifications</div>
              <div>• Status update templates</div>
              <div>• Resolution confirmations</div>
              <div>• Escalation notifications</div>
              <div>• Multi-language support</div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Rules */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Assignment Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Configure automatic ticket and conversation routing:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• Round-robin assignment</div>
              <div>• Skill-based routing</div>
              <div>• Load balancing</div>
              <div>• Escalation rules</div>
              <div>• Business hours handling</div>
              <div>• Priority-based routing</div>
            </div>
          </CardContent>
        </Card>

        {/* SLA Management */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">SLA Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Define service level agreements and response targets:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• Response time targets</div>
              <div>• Resolution time goals</div>
              <div>• Priority-based SLAs</div>
              <div>• Business hours configuration</div>
              <div>• Escalation triggers</div>
              <div>• Performance tracking</div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Automation Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Create automated workflows and triggers:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• Auto-create tickets from conversations</div>
              <div>• Status change triggers</div>
              <div>• Notification automation</div>
              <div>• Tag-based actions</div>
              <div>• Customer satisfaction surveys</div>
              <div>• Follow-up reminders</div>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Base */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Knowledge Base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Manage articles and resources for agent assistance:
            </p>
            <div className="text-left space-y-2 text-sm text-gray-600">
              <div>• FAQ management</div>
              <div>• Solution articles</div>
              <div>• Procedure documentation</div>
              <div>• Search functionality</div>
              <div>• Category organization</div>
              <div>• Usage analytics</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
