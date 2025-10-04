'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  X, 
  Mail,
  Smartphone,
  Copy,
  CheckCircle,
  Send,
  Download,
  Share2,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Palette,
  Code,
  FileText,
  Clock,
  User,
  Calendar,
  MapPin,
  Phone,
  Globe
} from 'lucide-react';
import { replacePlaceholders } from '../../lib/communication/placeholders';
import { toast } from 'sonner';

interface Template {
  id: number;
  templateKey: string;
  name: string;
  description?: string;
  type: 'email' | 'sms';
  category?: string;
  isActive: boolean;
  isDefault: boolean;
  translations: TemplateTranslation[];
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

interface TemplateTranslation {
  id: number;
  language: string;
  subject?: string;
  content: string;
}

interface EnhancedTemplatePreviewProps {
  template: Template;
  onClose: () => void;
}

const SAMPLE_DATA = {
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userPhone: '+1 (555) 123-4567',
  bookingId: 'BK-12345',
  language: 'English',
  adminEmail: 'admin@matmax.world',
  submissionDate: '2024-01-15',
  birthDate: '1990-05-15',
  birthTime: '14:30',
  birthPlace: 'New York, USA',
  clientQuestion: 'What does my future hold?',
  bookingDate: '2024-01-20',
  bookingTime: '10:00 AM',
  reminderDate: '2024-01-19',
  newDate: '2024-01-25',
  newTime: '2:00 PM',
  oldDate: '2024-01-20',
  oldTime: '10:00 AM',
  rescheduleReason: 'Emergency',
  rescheduleDate: '2024-01-18',
  otpCode: '123456',
  expiryTime: '10 minutes',
  sessionType: 'Individual Reading',
  videoConferenceLink: 'https://meet.google.com/abc-defg-hij',
  teacherName: 'Lucia Meza',
  serviceName: 'Hatha Yoga',
  venueName: 'MatMax Yoga Studio',
  venueAddress: '123 Wellness Street, Lima, Peru',
  packageName: 'MATPASS 30 Days',
  packagePrice: '$99.00',
  totalAmount: '$99.00',
  paymentMethod: 'Credit Card',
  orderNumber: 'ORD-789012'
};

const EMAIL_THEMES = [
  { value: 'modern', label: 'Modern', colors: ['#3B82F6', '#1E40AF'] },
  { value: 'classic', label: 'Classic', colors: ['#6B7280', '#374151'] },
  { value: 'minimal', label: 'Minimal', colors: ['#000000', '#6B7280'] },
  { value: 'colorful', label: 'Colorful', colors: ['#EC4899', '#8B5CF6'] }
];

export function EnhancedTemplatePreview({ template, onClose }: EnhancedTemplatePreviewProps) {
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [customData, setCustomData] = useState(SAMPLE_DATA);
  const [copied, setCopied] = useState<string | null>(null);
  const [showRawContent, setShowRawContent] = useState(false);
  const [emailTheme, setEmailTheme] = useState('modern');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  const currentTranslation = template.translations.find(t => t.language === activeLanguage);
  const languages = template.translations.map(t => t.language);

  const getPreviewContent = () => {
    if (!currentTranslation) return '';
    return replacePlaceholders(currentTranslation.content, customData);
  };

  const getPreviewSubject = () => {
    if (!currentTranslation?.subject) return '';
    return replacePlaceholders(currentTranslation.subject, customData);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success(`${type} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSendTest = async () => {
    const testEmail = prompt('Enter test email address:');
    if (!testEmail) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/communication/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateKey: template.templateKey,
          email: testEmail,
          language: activeLanguage,
          data: customData
        })
      });

      if (response.ok) {
        toast.success('Test email sent successfully');
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      booking: 'bg-blue-100 text-blue-800',
      verification: 'bg-green-100 text-green-800',
      reminder: 'bg-orange-100 text-orange-800',
      notification: 'bg-purple-100 text-purple-800',
      marketing: 'bg-pink-100 text-pink-800',
      support: 'bg-red-100 text-red-800',
      payment: 'bg-yellow-100 text-yellow-800',
      welcome: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const selectedTheme = EMAIL_THEMES.find(theme => theme.value === emailTheme);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl border border-slate-700/50 w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              {template.type === 'email' ? <Mail className="w-6 h-6 text-white" /> : <Smartphone className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{template.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                  {template.type.toUpperCase()}
                </Badge>
                {template.category && (
                  <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </Badge>
                )}
                {template.isDefault && (
                  <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Default
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                  {template.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BaseButton
              variant="outline"
              onClick={handleSendTest}
              disabled={isLoading}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Test
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={() => copyToClipboard(getPreviewContent(), 'content')}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            >
              {copied === 'content' ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              Copy Content
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            >
              <X className="w-4 h-4" />
            </BaseButton>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-slate-700/50 bg-slate-800/30 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Language Selector */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {languages.map(lang => (
                      <BaseButton
                        key={lang}
                        size="sm"
                        variant={activeLanguage === lang ? "primary" : "outline"}
                        onClick={() => setActiveLanguage(lang)}
                        className={`text-xs ${
                          activeLanguage === lang 
                            ? 'bg-blue-600 text-white' 
                            : 'border-slate-600 text-slate-300 hover:text-white'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </BaseButton>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Preview Settings */}
              {template.type === 'email' && (
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Preview Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 text-sm">Email Theme</Label>
                      <Select value={emailTheme} onValueChange={setEmailTheme}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {EMAIL_THEMES.map(theme => (
                            <SelectItem key={theme.value} value={theme.value} className="text-white hover:bg-slate-700">
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {theme.colors.map((color, index) => (
                                    <div key={index} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                  ))}
                                </div>
                                <span>{theme.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-sm">Preview Mode</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <BaseButton
                          size="sm"
                          variant={previewMode === 'desktop' ? "primary" : "outline"}
                          onClick={() => setPreviewMode('desktop')}
                          className={`text-xs ${
                            previewMode === 'desktop' 
                              ? 'bg-blue-600 text-white' 
                              : 'border-slate-600 text-slate-300 hover:text-white'
                          }`}
                        >
                          Desktop
                        </BaseButton>
                        <BaseButton
                          size="sm"
                          variant={previewMode === 'mobile' ? "primary" : "outline"}
                          onClick={() => setPreviewMode('mobile')}
                          className={`text-xs ${
                            previewMode === 'mobile' 
                              ? 'bg-blue-600 text-white' 
                              : 'border-slate-600 text-slate-300 hover:text-white'
                          }`}
                        >
                          Mobile
                        </BaseButton>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 text-sm">Show Raw Content</Label>
                      <Switch
                        checked={showRawContent}
                        onCheckedChange={setShowRawContent}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sample Data */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Sample Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                  {Object.entries(customData).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-slate-300 text-xs">{key}:</Label>
                      <BaseInput
                        value={String(value)}
                        onChange={(e) => setCustomData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="bg-slate-700/50 border-slate-600 text-white text-xs"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Template Info */}
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Template Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-slate-300 text-xs">Template Key:</Label>
                    <p className="text-white font-mono text-xs bg-slate-700/50 p-2 rounded">{template.templateKey}</p>
                  </div>
                  
                  {template.description && (
                    <div>
                      <Label className="text-slate-300 text-xs">Description:</Label>
                      <p className="text-white text-xs">{template.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300 text-xs">Status:</Label>
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {template.createdAt && (
                    <div>
                      <Label className="text-slate-300 text-xs">Created:</Label>
                      <p className="text-white text-xs">{new Date(template.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}

                  {template.version && (
                    <div>
                      <Label className="text-slate-300 text-xs">Version:</Label>
                      <p className="text-white text-xs">v{template.version}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <Tabs value={activeLanguage} onValueChange={setActiveLanguage} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 mb-6">
                  {languages.map(lang => (
                    <TabsTrigger key={lang} value={lang} className="flex items-center gap-2">
                      {lang.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeLanguage} className="space-y-6">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">Preview</h3>
                      <p className="text-slate-400 text-sm">
                        {template.type === 'email' ? 'Email Preview' : 'SMS Preview'} - {activeLanguage.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {template.type === 'email' && getPreviewSubject() && (
                        <BaseButton
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(getPreviewSubject(), 'subject')}
                          className="border-slate-600 text-slate-300 hover:text-white"
                        >
                          {copied === 'subject' ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                          Copy Subject
                        </BaseButton>
                      )}
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(getPreviewContent(), 'content')}
                        className="border-slate-600 text-slate-300 hover:text-white"
                      >
                        {copied === 'content' ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        Copy Content
                      </BaseButton>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-6">
                      {template.type === 'email' ? (
                        <div className="space-y-6">
                          {getPreviewSubject() && (
                            <div>
                              <Label className="text-slate-300 text-sm">Subject:</Label>
                              <p className="text-white font-medium text-lg mt-1">{getPreviewSubject()}</p>
                            </div>
                          )}
                          
                          <div>
                            <Label className="text-slate-300 text-sm">Content:</Label>
                            <div className={`mt-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-4xl'}`}>
                              {showRawContent ? (
                                <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                                  <pre className="text-slate-300 text-sm whitespace-pre-wrap font-mono">
                                    {getPreviewContent()}
                                  </pre>
                                </div>
                              ) : (
                                <div 
                                  className="bg-white rounded-lg shadow-lg p-6 text-gray-900"
                                  style={{
                                    background: `linear-gradient(135deg, ${selectedTheme?.colors[0]}10, ${selectedTheme?.colors[1]}10)`
                                  }}
                                  dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label className="text-slate-300 text-sm">SMS Content:</Label>
                          <div className={`mt-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'}`}>
                            <div className="bg-slate-900/50 p-4 rounded border border-slate-700">
                              <p className="text-white whitespace-pre-wrap font-mono text-sm">
                                {getPreviewContent()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Content Stats */}
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Content Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {getPreviewContent().length}
                          </div>
                          <div className="text-xs text-slate-400">Characters</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {getPreviewContent().split(' ').length}
                          </div>
                          <div className="text-xs text-slate-400">Words</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {getPreviewContent().split('\n').length}
                          </div>
                          <div className="text-xs text-slate-400">Lines</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {template.type === 'email' ? 'HTML' : 'TXT'}
                          </div>
                          <div className="text-xs text-slate-400">Format</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
