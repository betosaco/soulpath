'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { BaseInput } from '../ui/BaseInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Mail,
  Smartphone,
  Search,
  Filter,
  MoreVertical,
  Star,
  StarOff,
  Download,
  Upload,
  Archive,
  RefreshCw,
  Settings,
  BarChart3,
  Calendar,
  User,
  Globe,
  Code,
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Tag,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { EnhancedEmailTemplateEditor } from './EnhancedEmailTemplateEditor';
import { EnhancedTemplatePreview } from './EnhancedTemplatePreview';
import { useAuth } from '../../hooks/useAuth';
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
  usageCount?: number;
  lastUsed?: string;
}

interface TemplateTranslation {
  id: number;
  language: string;
  subject?: string;
  content: string;
}

interface EnhancedTemplateLibraryProps {
  type: 'email' | 'sms';
}

const TEMPLATE_CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: '📋' },
  { value: 'booking', label: 'Booking', icon: '📅', color: 'bg-blue-100 text-blue-800' },
  { value: 'verification', label: 'Verification', icon: '✅', color: 'bg-green-100 text-green-800' },
  { value: 'reminder', label: 'Reminder', icon: '⏰', color: 'bg-orange-100 text-orange-800' },
  { value: 'notification', label: 'Notification', icon: '🔔', color: 'bg-purple-100 text-purple-800' },
  { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-pink-100 text-pink-800' },
  { value: 'support', label: 'Support', icon: '🆘', color: 'bg-red-100 text-red-800' },
  { value: 'payment', label: 'Payment', icon: '💳', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'welcome', label: 'Welcome', icon: '👋', color: 'bg-indigo-100 text-indigo-800' }
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'created', label: 'Created Date' },
  { value: 'updated', label: 'Updated Date' },
  { value: 'usage', label: 'Usage Count' },
  { value: 'category', label: 'Category' }
];

export function EnhancedTemplateLibrary({ type }: EnhancedTemplateLibraryProps) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/communication/templates?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }, [type, user?.access_token]);

  useEffect(() => {
    loadTemplates();
  }, [type, loadTemplates]);

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.templateKey.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
          break;
        case 'updated':
          comparison = new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
          break;
        case 'usage':
          comparison = (a.usageCount || 0) - (b.usageCount || 0);
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean))) as string[];
  const selectedCategoryInfo = TEMPLATE_CATEGORIES.find(cat => cat.value === selectedCategory);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setShowEditor(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowEditor(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleDuplicateTemplate = async (template: Template) => {
    try {
      const newTemplate = {
        templateKey: `${template.templateKey}_copy_${Date.now()}`,
        name: `${template.name} (Copy)`,
        description: template.description,
        type: template.type,
        category: template.category,
        translations: template.translations.map(t => ({
          language: t.language,
          subject: t.subject,
          content: t.content
        }))
      };

      const response = await fetch('/api/admin/communication/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(newTemplate)
      });

      if (response.ok) {
        toast.success('Template duplicated successfully');
        loadTemplates();
      } else {
        toast.error('Failed to duplicate template');
      }
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast.error('Failed to duplicate template');
    }
  };

  const handleDeleteTemplate = async (template: Template) => {
    if (template.isDefault) {
      toast.error('Default templates cannot be deleted');
      return;
    }

    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        const response = await fetch(`/api/admin/communication/templates/${template.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });

        if (response.ok) {
          toast.success('Template deleted successfully');
          loadTemplates();
        } else {
          toast.error('Failed to delete template');
        }
      } catch (error) {
        console.error('Failed to delete template:', error);
        toast.error('Failed to delete template');
      }
    }
  };

  const handleToggleTemplateSelection = (templateId: number) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTemplates.length === 0) {
      toast.error('Please select templates first');
      return;
    }

    try {
      const response = await fetch('/api/admin/communication/templates/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({
          templateIds: selectedTemplates,
          action
        })
      });

      if (response.ok) {
        toast.success(`Bulk ${action} completed successfully`);
        setSelectedTemplates([]);
        setShowBulkActions(false);
        loadTemplates();
      } else {
        toast.error(`Failed to ${action} templates`);
      }
    } catch (error) {
      console.error(`Failed to ${action} templates:`, error);
      toast.error(`Failed to ${action} templates`);
    }
  };

  const handleTemplateSaved = () => {
    setShowEditor(false);
    setEditingTemplate(null);
    loadTemplates();
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = TEMPLATE_CATEGORIES.find(cat => cat.value === category);
    return categoryInfo?.color || 'bg-gray-100 text-gray-800';
  };

  const getTemplateStats = () => {
    const total = templates.length;
    const active = templates.filter(t => t.isActive).length;
    const defaultTemplates = templates.filter(t => t.isDefault).length;
    const categories = new Set(templates.map(t => t.category).filter(Boolean)).size;
    
    return { total, active, defaultTemplates, categories };
  };

  const stats = getTemplateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            {type === 'email' ? <Mail className="w-8 h-8 text-blue-400" /> : <Smartphone className="w-8 h-8 text-green-400" />}
            {type === 'email' ? 'Email' : 'SMS'} Templates
          </h2>
          <p className="text-slate-400 mt-2">
            Manage your {type} templates and translations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BaseButton
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Stats
          </BaseButton>
          <BaseButton
            onClick={handleCreateTemplate}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </BaseButton>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm">Total Templates</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Default</p>
                  <p className="text-2xl font-bold text-white">{stats.defaultTemplates}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm">Categories</p>
                  <p className="text-2xl font-bold text-white">{stats.categories}</p>
                </div>
                <Tag className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <BaseInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search templates..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {TEMPLATE_CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value} className="text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <BaseButton
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </BaseButton>

              <BaseButton
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </BaseButton>
            </div>
          </div>

          {/* Selected Templates Actions */}
          {selectedTemplates.length > 0 && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-300 text-sm">
                  {selectedTemplates.length} template(s) selected
                </span>
                <div className="flex gap-2">
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('activate')}
                    className="border-green-600 text-green-300 hover:text-white"
                  >
                    Activate
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('deactivate')}
                    className="border-orange-600 text-orange-300 hover:text-white"
                  >
                    Deactivate
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkAction('delete')}
                    className="border-red-600 text-red-300 hover:text-white"
                  >
                    Delete
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedTemplates([])}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    Clear
                  </BaseButton>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedTemplates.includes(template.id)}
                        onChange={() => handleToggleTemplateSelection(template.id)}
                        className="rounded border-slate-600 bg-slate-700 text-blue-500"
                      />
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        {type === 'email' ? <Mail className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4 text-green-400" />}
                        {template.name}
                      </CardTitle>
                    </div>
                    {template.description && (
                      <p className="text-slate-400 text-sm">{template.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1" />
                        Default
                      </Badge>
                    )}
                    {!template.isActive && (
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {template.category && (
                    <div>
                      <span className="text-xs text-slate-500">Category:</span>
                      <Badge className={`text-xs ml-2 ${getCategoryColor(template.category)}`}>
                        {TEMPLATE_CATEGORIES.find(cat => cat.value === template.category)?.icon} {template.category}
                      </Badge>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-xs text-slate-500">Languages:</span>
                    <div className="flex gap-1 mt-1">
                      {template.translations.map(translation => (
                        <Badge key={translation.language} variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {translation.language.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {template.usageCount !== undefined && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <BarChart3 className="w-3 h-3" />
                      Used {template.usageCount} times
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewTemplate(template)}
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </BaseButton>
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </BaseButton>
                  </div>

                  <div className="flex gap-2">
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                      className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Duplicate
                    </BaseButton>
                    {!template.isDefault && (
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template)}
                        className="flex-1 border-red-600 text-red-300 hover:text-white hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </BaseButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map(template => (
            <Card key={template.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedTemplates.includes(template.id)}
                      onChange={() => handleToggleTemplateSelection(template.id)}
                      className="rounded border-slate-600 bg-slate-700 text-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {type === 'email' ? <Mail className="w-4 h-4 text-blue-400" /> : <Smartphone className="w-4 h-4 text-green-400" />}
                        <h3 className="text-white font-medium">{template.name}</h3>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                        {!template.isActive && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      {template.description && (
                        <p className="text-slate-400 text-sm">{template.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        {template.category && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {template.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {template.translations.length} languages
                        </span>
                        {template.usageCount !== undefined && (
                          <span className="flex items-center gap-1">
                            <BarChart3 className="w-3 h-3" />
                            {template.usageCount} uses
                          </span>
                        )}
                        {template.updatedAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(template.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewTemplate(template)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Eye className="w-4 h-4" />
                    </BaseButton>
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditTemplate(template)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </BaseButton>
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </BaseButton>
                    {!template.isDefault && (
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template)}
                        className="border-red-600 text-red-300 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </BaseButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            {type === 'email' ? <Mail className="w-16 h-16 mx-auto" /> : <Smartphone className="w-16 h-16 mx-auto" />}
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No templates found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : `Create your first ${type} template to get started`
            }
          </p>
          {(!searchTerm && selectedCategory === 'all') && (
            <BaseButton
              onClick={handleCreateTemplate}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </BaseButton>
          )}
        </div>
      )}

      {/* Enhanced Template Editor Modal */}
      {showEditor && (
        <EnhancedEmailTemplateEditor
          template={editingTemplate}
          type={type}
          onSave={handleTemplateSaved}
          onClose={() => {
            setShowEditor(false);
            setEditingTemplate(null);
          }}
        />
      )}

      {/* Enhanced Template Preview Modal */}
      {showPreview && previewTemplate && (
        <EnhancedTemplatePreview
          template={previewTemplate}
          onClose={() => {
            setShowPreview(false);
            setPreviewTemplate(null);
          }}
        />
      )}
    </div>
  );
}
