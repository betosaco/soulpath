'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { BaseButton } from '../../ui/BaseButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Settings, 
  Layers, 
  FileText, 
  Eye, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  RefreshCw,
  Globe,
  Bot
} from 'lucide-react';

// Import the new modular template components
import { ScenarioManager } from './ScenarioManager';
import { ComponentManager } from './ComponentManager';
import { SubjectManager } from './SubjectManager';
import { TemplatePreview } from './TemplatePreview';

interface ModularTemplateDashboardProps {
  className?: string;
}

export function ModularTemplateDashboard({ className }: ModularTemplateDashboardProps) {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('es');

  const handleLanguageChange = (newLanguage: 'en' | 'es') => {
    setLanguage(newLanguage);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Refresh all template data
      await Promise.all([
        // Add refresh logic here
      ]);
    } catch (error) {
      console.error('Error refreshing templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🏗️ Modular Template System
          </h1>
          <p className="text-gray-600 mt-1">
            Manage email templates with reusable components and dynamic scenarios
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-gray-500" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as 'en' | 'es')}
              className="dashboard-input text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          
          {/* Refresh Button */}
          <BaseButton
            onClick={handleRefresh}
            disabled={isLoading}
            className="dashboard-button-secondary"
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </BaseButton>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scenarios" className="dashboard-tab">
            <Settings size={16} className="mr-2" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="components" className="dashboard-tab">
            <Layers size={16} className="mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="subjects" className="dashboard-tab">
            <FileText size={16} className="mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="preview" className="dashboard-tab">
            <Eye size={16} className="mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <ScenarioManager language={language} />
        </TabsContent>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <ComponentManager language={language} />
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <SubjectManager language={language} />
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <TemplatePreview language={language} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
