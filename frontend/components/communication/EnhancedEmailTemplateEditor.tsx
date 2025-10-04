'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  Save, 
  X, 
  Eye, 
  Plus,
  AlertCircle,
  CheckCircle,
  Copy,
  Palette,
  Code,
  Settings,
  Languages,
  FileText,
  Send,
  Download,
  Upload,
  History,
  Star,
  StarOff
} from 'lucide-react';
import { getPlaceholdersGrouped, validatePlaceholders, Placeholder } from '../../lib/communication/placeholders';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { EnhancedTemplatePreview } from './EnhancedTemplatePreview';

interface Template {
  id?: number;
  templateKey: string;
  name: string;
  description?: string;
  type: 'email' | 'sms';
  category?: string;
  isActive: boolean;
  isDefault?: boolean;
  translations: TemplateTranslation[];
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}

interface TemplateTranslation {
  id?: number;
  language: string;
  subject?: string;
  content: string;
  isActive?: boolean;
}

interface EnhancedEmailTemplateEditorProps {
  template?: Template | null;
  type: 'email' | 'sms';
  onSave: () => void;
  onClose: () => void;
}

const TEMPLATE_CATEGORIES = [
  { value: 'booking', label: 'Booking', icon: '📅', color: 'bg-blue-100 text-blue-800' },
  { value: 'verification', label: 'Verification', icon: '✅', color: 'bg-green-100 text-green-800' },
  { value: 'reminder', label: 'Reminder', icon: '⏰', color: 'bg-orange-100 text-orange-800' },
  { value: 'notification', label: 'Notification', icon: '🔔', color: 'bg-purple-100 text-purple-800' },
  { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-pink-100 text-pink-800' },
  { value: 'support', label: 'Support', icon: '🆘', color: 'bg-red-100 text-red-800' },
  { value: 'payment', label: 'Payment', icon: '💳', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'welcome', label: 'Welcome', icon: '👋', color: 'bg-indigo-100 text-indigo-800' }
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' }
];

const EMAIL_TEMPLATE_THEMES = [
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
  { value: 'classic', label: 'Classic', description: 'Traditional business style' },
  { value: 'minimal', label: 'Minimal', description: 'Simple and focused' },
  { value: 'colorful', label: 'Colorful', description: 'Vibrant and engaging' }
];

export function EnhancedEmailTemplateEditor({ template, type, onSave, onClose }: EnhancedEmailTemplateEditorProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    templateKey: '',
    name: '',
    description: '',
    category: '',
    isActive: true,
    theme: 'modern'
  });

  const [translations, setTranslations] = useState<TemplateTranslation[]>([
    { language: 'en', subject: '', content: '', isActive: true },
    { language: 'es', subject: '', content: '', isActive: true }
  ]);

  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [placeholderSearch, setPlaceholderSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState('content');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [templateHistory, setTemplateHistory] = useState<any[]>([]);
  const [isStarred, setIsStarred] = useState(false);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (template) {
      setFormData({
        templateKey: template.templateKey,
        name: template.name,
        description: template.description || '',
        category: template.category || '',
        isActive: template.isActive,
        theme: 'modern'
      });
      setTranslations(template.translations);
      setIsStarred(template.isDefault || false);
    } else {
      // Generate template key from name for new templates
      const key = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      setFormData(prev => ({ ...prev, templateKey: key }));
    }
  }, [template, formData.name]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && !template) {
      const key = String(value).toLowerCase().replace(/[^a-z0-9]/g, '_');
      setFormData(prev => ({ ...prev, templateKey: key }));
    }
  };

  const handleTranslationChange = (language: string, field: string, value: string) => {
    setTranslations(prev => prev.map(t => 
      t.language === language ? { ...t, [field]: value } : t
    ));
  };

  const insertPlaceholderAtCursor = (placeholder: string) => {
    if (contentRef.current) {
      const textarea = contentRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = translations.find(t => t.language === activeLanguage)?.content || '';
      const newContent = currentContent.substring(0, start) + placeholder + currentContent.substring(end);
      handleTranslationChange(activeLanguage, 'content', newContent);
      
      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
      }, 0);
    }
  };

  const validateTemplate = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Template name is required');
    }

    if (!formData.templateKey.trim()) {
      errors.push('Template key is required');
    }

    if (translations.length === 0) {
      errors.push('At least one translation is required');
    }

    translations.forEach(translation => {
      if (!translation.content.trim()) {
        errors.push(`Content for ${translation.language.toUpperCase()} is required`);
      }

      if (type === 'email' && !translation.subject?.trim()) {
        errors.push(`Subject for ${translation.language.toUpperCase()} is required`);
      }

      const validation = validatePlaceholders(translation.content, type);
      if (!validation.valid) {
        errors.push(`Invalid placeholders in ${translation.language.toUpperCase()}: ${validation.missing.join(', ')}`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validateTemplate()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        templateKey: formData.templateKey,
        name: formData.name,
        description: formData.description,
        type,
        category: formData.category,
        isActive: formData.isActive,
        theme: formData.theme,
        translations: translations.filter(t => t.content.trim())
      };

      const url = template 
        ? `/api/admin/communication/templates/${template.id}`
        : '/api/admin/communication/templates';
      
      const method = template ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(templateData)
      });

      if (response.ok) {
        toast.success(template ? 'Template updated successfully' : 'Template created successfully');
        onSave();
      } else {
        const errorData = await response.json();
        setValidationErrors([errorData.error || 'Failed to save template']);
        toast.error(errorData.error || 'Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setValidationErrors(['Failed to save template']);
      toast.error('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!validateTemplate()) {
      toast.error('Please fix validation errors before sending test');
      return;
    }
    
    const testEmail = prompt('Enter test email address:');
    if (!testEmail) return;

    try {
      const response = await fetch('/api/admin/communication/send-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          templateKey: formData.templateKey,
          email: testEmail,
          language: activeLanguage,
          data: {
            userName: 'Test User',
            userEmail: testEmail,
            bookingId: 'TEST-12345'
          }
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
    }
  };

  const currentTranslation = translations.find(t => t.language === activeLanguage);
  const allPlaceholders = getPlaceholdersGrouped(type);
  
  // Filter placeholders based on search
  const filteredPlaceholders = Object.entries(allPlaceholders).reduce((acc, [category, placeholderList]) => {
    const filtered = placeholderList.filter(placeholder => 
      placeholder.key.toLowerCase().includes(placeholderSearch.toLowerCase()) ||
      placeholder.description.toLowerCase().includes(placeholderSearch.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, Placeholder[]>);

  const selectedCategory = TEMPLATE_CATEGORIES.find(cat => cat.value === formData.category);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {template ? 'Edit Template' : 'Create New Template'}
              </h2>
              <p className="text-gray-600 text-sm">
                {type === 'email' ? 'Email Template Editor' : 'SMS Template Editor'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BaseButton
              variant="outline"
              onClick={() => setIsStarred(!isStarred)}
              className={`transition-all duration-200 ${
                isStarred 
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' 
                  : 'border-slate-600 text-slate-400 hover:text-yellow-400'
              }`}
            >
              {isStarred ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </BaseButton>
            <BaseButton
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Template
            </BaseButton>
            <BaseButton
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
            >
              <X className="w-4 h-4" />
            </BaseButton>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 m-4">
                <TabsTrigger value="content" className="text-xs text-gray-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Content</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs text-gray-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="p-4 space-y-6">
                {/* Template Settings */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900 text-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Template Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-700 text-sm font-medium">Template Name</Label>
                      <BaseInput
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter template name"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-700 text-sm font-medium">Template Key</Label>
                      <BaseInput
                        value={formData.templateKey}
                        onChange={(e) => handleInputChange('templateKey', e.target.value)}
                        placeholder="template_key"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Used to reference this template in code
                      </p>
                    </div>

                    <div>
                      <Label className="text-gray-700 text-sm font-medium">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {TEMPLATE_CATEGORIES.map(category => (
                            <SelectItem key={category.value} value={category.value} className="text-gray-900 hover:bg-gray-100">
                              <div className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedCategory && (
                        <div className="mt-2">
                          <Badge className={`text-xs ${selectedCategory.color}`}>
                            {selectedCategory.icon} {selectedCategory.label}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-gray-700 text-sm font-medium">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe when this template is used"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-gray-700 text-sm font-medium">Active</Label>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Language Selector */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900 text-sm flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {LANGUAGES.map(lang => (
                        <BaseButton
                          key={lang.code}
                          size="sm"
                          variant={activeLanguage === lang.code ? "primary" : "outline"}
                          onClick={() => setActiveLanguage(lang.code)}
                          className={`text-xs ${
                            activeLanguage === lang.code 
                              ? 'bg-blue-600 text-white' 
                              : 'border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400'
                          }`}
                        >
                          <span className="mr-1">{lang.flag}</span>
                          {lang.name}
                        </BaseButton>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Placeholders */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-gray-900 text-sm flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      Available Placeholders
                    </CardTitle>
                    <p className="text-xs text-gray-600">
                      Click to insert placeholder into {activeLanguage.toUpperCase()} content
                    </p>
                    <BaseInput
                      value={placeholderSearch}
                      onChange={(e) => setPlaceholderSearch(e.target.value)}
                      placeholder="Search placeholders..."
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 text-xs focus:border-blue-500 focus:ring-blue-500"
                    />
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                    {Object.keys(filteredPlaceholders).length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">No placeholders found matching your search.</p>
                      </div>
                    ) : (
                      Object.entries(filteredPlaceholders).map(([category, placeholderList]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-900 mb-2 capitalize flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {category}
                          </h4>
                          <div className="space-y-1">
                            {placeholderList.map(placeholder => (
                              <div
                                key={placeholder.key}
                                className="group flex items-center justify-between p-2 rounded border transition-all duration-200 cursor-pointer bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                onClick={() => insertPlaceholderAtCursor(placeholder.key)}
                              >
                                <div className="flex-1">
                                  <code className="text-xs font-mono px-1 py-0.5 rounded bg-gray-200 text-blue-600">
                                    {placeholder.key}
                                  </code>
                                  <p className="text-xs text-gray-600 mt-1">{placeholder.description}</p>
                                  {placeholder.example && (
                                    <p className="text-xs mt-1 italic text-gray-500">
                                      Example: {placeholder.example}
                                    </p>
                                  )}
                                </div>
                                <BaseButton
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    insertPlaceholderAtCursor(placeholder.key);
                                  }}
                                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity border-gray-300 text-gray-600 hover:text-gray-900"
                                >
                                  <Plus className="w-3 h-3" />
                                </BaseButton>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="p-4 space-y-6">
                {/* Advanced Settings */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Template Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 text-sm">Email Theme</Label>
                      <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {EMAIL_TEMPLATE_THEMES.map(theme => (
                            <SelectItem key={theme.value} value={theme.value} className="text-white hover:bg-slate-700">
                              <div>
                                <div className="font-medium">{theme.label}</div>
                                <div className="text-xs text-slate-400">{theme.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Template Actions */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Template Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <BaseButton
                      onClick={handleSendTest}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Test Email
                    </BaseButton>
                    
                    <BaseButton
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Template
                    </BaseButton>
                    
                    <BaseButton
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Template
                    </BaseButton>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-6">
              {validationErrors.length > 0 && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Validation Errors</span>
                  </div>
                  <ul className="text-sm space-y-1 text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Editor */}
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-gray-900 text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Content Editor - {activeLanguage.toUpperCase()}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {type === 'email' ? 'HTML' : 'Plain Text'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-700">
                        {currentTranslation?.content?.length || 0} characters
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {type === 'email' && (
                    <div>
                      <Label className="text-gray-700 text-sm font-medium">Subject ({activeLanguage.toUpperCase()})</Label>
                      <BaseInput
                        value={currentTranslation?.subject || ''}
                        onChange={(e) => handleTranslationChange(activeLanguage, 'subject', e.target.value)}
                        placeholder="Enter email subject"
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-gray-700 text-sm font-medium">
                      Content ({activeLanguage.toUpperCase()}) 
                      {type === 'email' ? ' - HTML' : ' - Plain Text'}
                    </Label>
                    <Textarea
                      ref={contentRef}
                      value={currentTranslation?.content || ''}
                      onChange={(e) => handleTranslationChange(activeLanguage, 'content', e.target.value)}
                      placeholder={type === 'email' 
                        ? 'Enter HTML content...' 
                        : 'Enter plain text content...'
                      }
                      className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 font-mono text-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={16}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {type === 'email' 
                          ? 'Use HTML tags for formatting. Placeholders will be replaced with actual data.'
                          : 'Plain text only. Placeholders will be replaced with actual data.'
                        }
                      </p>
                      <div className="flex items-center gap-2">
                        <BaseButton
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const content = currentTranslation?.content || '';
                            navigator.clipboard.writeText(content);
                            toast.success('Content copied to clipboard');
                          }}
                          className="text-xs border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <EnhancedTemplatePreview
          template={{
            ...formData,
            type,
            translations,
            templateKey: formData.templateKey,
            isDefault: isStarred,
            createdAt: template?.createdAt || new Date().toISOString(),
            version: template?.version || '1.0.0'
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
