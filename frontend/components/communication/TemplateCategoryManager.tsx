'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Tag,
  Palette,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Copy,
  Archive,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface TemplateCategory {
  id: number;
  name: string;
  key: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
  isDefault: boolean;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TemplateCategoryManagerProps {
  onCategoryChange?: (categories: TemplateCategory[]) => void;
}

const DEFAULT_CATEGORIES = [
  {
    name: 'Booking',
    key: 'booking',
    description: 'Templates for booking confirmations, reminders, and updates',
    icon: '📅',
    color: 'bg-blue-100 text-blue-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Verification',
    key: 'verification',
    description: 'Templates for email verification and account setup',
    icon: '✅',
    color: 'bg-green-100 text-green-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Reminder',
    key: 'reminder',
    description: 'Templates for appointment and event reminders',
    icon: '⏰',
    color: 'bg-orange-100 text-orange-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Notification',
    key: 'notification',
    description: 'Templates for general notifications and updates',
    icon: '🔔',
    color: 'bg-purple-100 text-purple-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Marketing',
    key: 'marketing',
    description: 'Templates for promotional and marketing emails',
    icon: '📢',
    color: 'bg-pink-100 text-pink-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Support',
    key: 'support',
    description: 'Templates for customer support and help',
    icon: '🆘',
    color: 'bg-red-100 text-red-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Payment',
    key: 'payment',
    description: 'Templates for payment confirmations and receipts',
    icon: '💳',
    color: 'bg-yellow-100 text-yellow-800',
    isActive: true,
    isDefault: true
  },
  {
    name: 'Welcome',
    key: 'welcome',
    description: 'Templates for welcoming new users',
    icon: '👋',
    color: 'bg-indigo-100 text-indigo-800',
    isActive: true,
    isDefault: true
  }
];

const COLOR_OPTIONS = [
  { value: 'bg-blue-100 text-blue-800', label: 'Blue', preview: '🔵' },
  { value: 'bg-green-100 text-green-800', label: 'Green', preview: '🟢' },
  { value: 'bg-orange-100 text-orange-800', label: 'Orange', preview: '🟠' },
  { value: 'bg-purple-100 text-purple-800', label: 'Purple', preview: '🟣' },
  { value: 'bg-pink-100 text-pink-800', label: 'Pink', preview: '🩷' },
  { value: 'bg-red-100 text-red-800', label: 'Red', preview: '🔴' },
  { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow', preview: '🟡' },
  { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo', preview: '🔷' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gray', preview: '⚫' },
  { value: 'bg-teal-100 text-teal-800', label: 'Teal', preview: '🟦' }
];

const ICON_OPTIONS = [
  '📅', '✅', '⏰', '🔔', '📢', '🆘', '💳', '👋', '📧', '📱',
  '🎯', '🌟', '🚀', '💡', '🔒', '📊', '🎉', '🎁', '🏆', '⭐',
  '❤️', '💪', '🎨', '🔧', '📝', '📋', '🗂️', '📌', '🔗', '💬'
];

export function TemplateCategoryManager({ onCategoryChange }: TemplateCategoryManagerProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TemplateCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    icon: '📅',
    color: 'bg-blue-100 text-blue-800',
    isActive: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/communication/categories', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      } else {
        // If no categories exist, create default ones
        await createDefaultCategories();
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    try {
      const response = await fetch('/api/admin/communication/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify({ categories: DEFAULT_CATEGORIES })
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        toast.success('Default categories created successfully');
      }
    } catch (error) {
      console.error('Failed to create default categories:', error);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      key: '',
      description: '',
      icon: '📅',
      color: 'bg-blue-100 text-blue-800',
      isActive: true
    });
    setShowEditor(true);
  };

  const handleEditCategory = (category: TemplateCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      key: category.key,
      description: category.description || '',
      icon: category.icon,
      color: category.color,
      isActive: category.isActive
    });
    setShowEditor(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim() || !formData.key.trim()) {
      toast.error('Name and key are required');
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        key: formData.key,
        description: formData.description,
        icon: formData.icon,
        color: formData.color,
        isActive: formData.isActive
      };

      const url = editingCategory 
        ? `/api/admin/communication/categories/${editingCategory.id}`
        : '/api/admin/communication/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
        setShowEditor(false);
        setEditingCategory(null);
        loadCategories();
        onCategoryChange?.(categories);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (category: TemplateCategory) => {
    if (category.isDefault) {
      toast.error('Default categories cannot be deleted');
      return;
    }

    if (confirm(`Are you sure you want to delete "${category.name}"? This will affect all templates in this category.`)) {
      try {
        const response = await fetch(`/api/admin/communication/categories/${category.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });

        if (response.ok) {
          toast.success('Category deleted successfully');
          loadCategories();
          onCategoryChange?.(categories);
        } else {
          toast.error('Failed to delete category');
        }
      } catch (error) {
        console.error('Failed to delete category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleDuplicateCategory = async (category: TemplateCategory) => {
    try {
      const newCategory = {
        name: `${category.name} (Copy)`,
        key: `${category.key}_copy_${Date.now()}`,
        description: category.description,
        icon: category.icon,
        color: category.color,
        isActive: category.isActive
      };

      const response = await fetch('/api/admin/communication/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token}`
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        toast.success('Category duplicated successfully');
        loadCategories();
      } else {
        toast.error('Failed to duplicate category');
      }
    } catch (error) {
      console.error('Failed to duplicate category:', error);
      toast.error('Failed to duplicate category');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'name' && !editingCategory) {
      const key = String(value).toLowerCase().replace(/[^a-z0-9]/g, '_');
      setFormData(prev => ({ ...prev, key }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tag className="w-6 h-6 text-blue-400" />
            Template Categories
          </h2>
          <p className="text-slate-400 mt-1">
            Organize your email templates with custom categories
          </p>
        </div>
        <BaseButton
          onClick={handleCreateCategory}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </BaseButton>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <Card key={category.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </CardTitle>
                  {category.description && (
                    <p className="text-slate-400 text-sm mt-1">{category.description}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  {category.isDefault && (
                    <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                  {!category.isActive && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Template Count:</span>
                  <Badge className={`text-xs ${category.color}`}>
                    {category.templateCount} templates
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Status:</span>
                  <div className="flex items-center gap-2">
                    {category.isActive ? (
                      <Eye className="w-4 h-4 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-xs text-slate-300">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Created:</span>
                  <span className="text-xs text-slate-300">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCategory(category)}
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </BaseButton>
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleDuplicateCategory(category)}
                    className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </BaseButton>
                </div>

                {!category.isDefault && (
                  <BaseButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCategory(category)}
                    className="w-full border-red-600 text-red-300 hover:text-white hover:border-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </BaseButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Editor Modal */}
      {showEditor && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Configure category settings and appearance
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BaseButton
                  onClick={handleSaveCategory}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </BaseButton>
                <BaseButton
                  variant="outline"
                  onClick={() => {
                    setShowEditor(false);
                    setEditingCategory(null);
                  }}
                  className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                >
                  <X className="w-4 h-4" />
                </BaseButton>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 text-sm">Category Name</Label>
                      <BaseInput
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter category name"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-300 text-sm">Category Key</Label>
                      <BaseInput
                        value={formData.key}
                        onChange={(e) => handleInputChange('key', e.target.value)}
                        placeholder="category_key"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                      <p className="text-xs text-slate-400 mt-1">
                        Used to reference this category in code
                      </p>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-sm">Description</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe what this category is used for"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-slate-300 text-sm">Active</Label>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300 text-sm">Icon</Label>
                      <div className="grid grid-cols-10 gap-2 mt-2">
                        {ICON_OPTIONS.map(icon => (
                          <BaseButton
                            key={icon}
                            size="sm"
                            variant={formData.icon === icon ? "primary" : "outline"}
                            onClick={() => handleInputChange('icon', icon)}
                            className={`text-lg ${
                              formData.icon === icon 
                                ? 'bg-blue-600 text-white' 
                                : 'border-slate-600 text-slate-300 hover:text-white'
                            }`}
                          >
                            {icon}
                          </BaseButton>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-300 text-sm">Color Theme</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {COLOR_OPTIONS.map(color => (
                          <BaseButton
                            key={color.value}
                            size="sm"
                            variant={formData.color === color.value ? "primary" : "outline"}
                            onClick={() => handleInputChange('color', color.value)}
                            className={`${
                              formData.color === color.value 
                                ? 'bg-blue-600 text-white' 
                                : 'border-slate-600 text-slate-300 hover:text-white'
                            }`}
                          >
                            <span className="mr-2">{color.preview}</span>
                            {color.label}
                          </BaseButton>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <Label className="text-slate-300 text-sm">Preview</Label>
                      <div className="mt-2 p-3 bg-slate-700/50 rounded border border-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{formData.icon}</span>
                          <span className="text-white font-medium">{formData.name || 'Category Name'}</span>
                          <Badge className={`text-xs ${formData.color}`}>
                            Preview
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
