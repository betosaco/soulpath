'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  History, 
  Clock, 
  User, 
  GitBranch, 
  GitCommit, 
  RotateCcw, 
  Eye, 
  Download, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  Tag,
  Code,
  FileText,
  Save,
  X,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface TemplateVersion {
  id: number;
  templateId: number;
  version: number;
  name: string;
  description?: string;
  content: string;
  subject?: string;
  language: string;
  changes: string[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
  isRollback: boolean;
  parentVersion?: number;
}

interface TemplateVersionHistoryProps {
  templateId: number;
  templateName: string;
  onVersionRestore?: (version: TemplateVersion) => void;
}

export function TemplateVersionHistory({ templateId, templateName, onVersionRestore }: TemplateVersionHistoryProps) {
  const { user } = useAuth();
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<TemplateVersion | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const [compareVersions, setCompareVersions] = useState<{ from: TemplateVersion | null; to: TemplateVersion | null }>({
    from: null,
    to: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'rollback'>('all');

  useEffect(() => {
    loadVersions();
  }, [templateId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/communication/templates/${templateId}/versions`, {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreVersion = async (version: TemplateVersion) => {
    if (confirm(`Are you sure you want to restore version ${version.version}? This will create a new version with the current content.`)) {
      try {
        const response = await fetch(`/api/admin/communication/templates/${templateId}/versions/${version.id}/restore`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.access_token}`
          }
        });

        if (response.ok) {
          toast.success(`Version ${version.version} restored successfully`);
          loadVersions();
          onVersionRestore?.(version);
        } else {
          toast.error('Failed to restore version');
        }
      } catch (error) {
        console.error('Failed to restore version:', error);
        toast.error('Failed to restore version');
      }
    }
  };

  const handleDeleteVersion = async (version: TemplateVersion) => {
    if (version.isActive) {
      toast.error('Cannot delete the active version');
      return;
    }

    if (confirm(`Are you sure you want to delete version ${version.version}? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/admin/communication/templates/${templateId}/versions/${version.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.access_token}`
          }
        });

        if (response.ok) {
          toast.success('Version deleted successfully');
          loadVersions();
        } else {
          toast.error('Failed to delete version');
        }
      } catch (error) {
        console.error('Failed to delete version:', error);
        toast.error('Failed to delete version');
      }
    }
  };

  const handleCompareVersions = (version1: TemplateVersion, version2: TemplateVersion) => {
    setCompareVersions({ from: version1, to: version2 });
    setShowDiff(true);
  };

  const filteredVersions = versions.filter(version => {
    const matchesSearch = version.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         version.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         version.changes.some(change => change.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'active' && version.isActive) ||
                         (filterBy === 'rollback' && version.isRollback);
    
    return matchesSearch && matchesFilter;
  });

  const getVersionStatus = (version: TemplateVersion) => {
    if (version.isActive) return { label: 'Active', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    if (version.isRollback) return { label: 'Rollback', color: 'bg-orange-100 text-orange-800', icon: RotateCcw };
    return { label: 'Archived', color: 'bg-gray-100 text-gray-800', icon: History };
  };

  const getChangeTypeColor = (change: string) => {
    if (change.startsWith('Added')) return 'text-green-400';
    if (change.startsWith('Removed')) return 'text-red-400';
    if (change.startsWith('Modified')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading version history...</p>
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
            <History className="w-6 h-6 text-blue-400" />
            Version History
          </h2>
          <p className="text-slate-400 mt-1">
            Track changes and manage versions for "{templateName}"
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BaseButton
            variant="outline"
            onClick={() => setShowDiff(!showDiff)}
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            <Code className="w-4 h-4 mr-2" />
            {showDiff ? 'Hide' : 'Show'} Diff
          </BaseButton>
          <BaseButton
            onClick={loadVersions}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </BaseButton>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <History className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <BaseInput
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search versions..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-md text-sm"
              >
                <option value="all">All Versions</option>
                <option value="active">Active Only</option>
                <option value="rollback">Rollbacks</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Versions List */}
      <div className="space-y-4">
        {filteredVersions.map((version, index) => {
          const status = getVersionStatus(version);
          const StatusIcon = status.icon;
          
          return (
            <Card key={version.id} className="bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <GitCommit className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">v{version.version}</span>
                      </div>
                      <Badge className={`text-xs ${status.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                      {version.parentVersion && (
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          <GitBranch className="w-3 h-3 mr-1" />
                          From v{version.parentVersion}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-white font-medium mb-1">{version.name}</h3>
                    {version.description && (
                      <p className="text-slate-400 text-sm mb-3">{version.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {version.createdBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(version.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {version.language.toUpperCase()}
                      </div>
                    </div>

                    {/* Changes */}
                    {version.changes.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-slate-300 text-sm">Changes:</Label>
                        <div className="mt-1 space-y-1">
                          {version.changes.map((change, changeIndex) => (
                            <div key={changeIndex} className={`text-xs ${getChangeTypeColor(change)}`}>
                              • {change}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-300 text-sm">Content Preview</span>
                      </div>
                      <div className="text-slate-300 text-sm max-h-20 overflow-y-auto">
                        {version.subject && (
                          <div className="mb-1">
                            <strong>Subject:</strong> {version.subject}
                          </div>
                        )}
                        <div className="whitespace-pre-wrap">
                          {version.content.substring(0, 200)}
                          {version.content.length > 200 && '...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <BaseButton
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedVersion(version)}
                      className="border-slate-600 text-slate-300 hover:text-white"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </BaseButton>
                    
                    {!version.isActive && (
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreVersion(version)}
                        className="border-green-600 text-green-300 hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </BaseButton>
                    )}

                    {index > 0 && (
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompareVersions(version, filteredVersions[index - 1])}
                        className="border-blue-600 text-blue-300 hover:text-white"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        Compare
                      </BaseButton>
                    )}

                    {!version.isActive && (
                      <BaseButton
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteVersion(version)}
                        className="border-red-600 text-red-300 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </BaseButton>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredVersions.length === 0 && (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No versions found</h3>
          <p className="text-slate-400">
            {searchTerm || filterBy !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Version history will appear here as you make changes to the template'
            }
          </p>
        </div>
      )}

      {/* Version Detail Modal */}
      {selectedVersion && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <GitCommit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Version {selectedVersion.version}</h2>
                  <p className="text-gray-600 text-sm">{selectedVersion.name}</p>
                </div>
              </div>
              <BaseButton
                variant="outline"
                onClick={() => setSelectedVersion(null)}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <X className="w-4 h-4" />
              </BaseButton>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Version Info */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Version Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300 text-sm">Version Number</Label>
                        <p className="text-white font-mono">v{selectedVersion.version}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-sm">Status</Label>
                        <div className="flex items-center gap-2">
                          {getVersionStatus(selectedVersion).icon({ className: "w-4 h-4" })}
                          <span className="text-white">{getVersionStatus(selectedVersion).label}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-sm">Created By</Label>
                        <p className="text-white">{selectedVersion.createdBy}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-sm">Created At</Label>
                        <p className="text-white">{new Date(selectedVersion.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-slate-300 text-sm">Language</Label>
                        <p className="text-white">{selectedVersion.language.toUpperCase()}</p>
                      </div>
                      {selectedVersion.parentVersion && (
                        <div>
                          <Label className="text-slate-300 text-sm">Parent Version</Label>
                          <p className="text-white">v{selectedVersion.parentVersion}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedVersion.description && (
                      <div>
                        <Label className="text-slate-300 text-sm">Description</Label>
                        <p className="text-white">{selectedVersion.description}</p>
                      </div>
                    )}

                    {selectedVersion.changes.length > 0 && (
                      <div>
                        <Label className="text-slate-300 text-sm">Changes</Label>
                        <div className="space-y-1">
                          {selectedVersion.changes.map((change, index) => (
                            <div key={index} className={`text-sm ${getChangeTypeColor(change)}`}>
                              • {change}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Content */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Template Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedVersion.subject && (
                      <div>
                        <Label className="text-slate-300 text-sm">Subject</Label>
                        <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                          <p className="text-white">{selectedVersion.subject}</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-slate-300 text-sm">Content</Label>
                      <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                        <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                          {selectedVersion.content}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diff Modal */}
      {showDiff && compareVersions.from && compareVersions.to && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Version Comparison</h2>
                  <p className="text-slate-400 text-sm">
                    Comparing v{compareVersions.from.version} with v{compareVersions.to.version}
                  </p>
                </div>
              </div>
              <BaseButton
                variant="outline"
                onClick={() => setShowDiff(false)}
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <X className="w-4 h-4" />
              </BaseButton>
            </div>

            {/* Diff Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* From Version */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <ArrowDown className="w-4 h-4 text-red-400" />
                      Version {compareVersions.from.version} (From)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                        {compareVersions.from.content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* To Version */}
                <Card className="bg-slate-800/50 border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      Version {compareVersions.to.version} (To)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-900/50 p-3 rounded border border-slate-700">
                      <pre className="text-white text-sm whitespace-pre-wrap font-mono">
                        {compareVersions.to.content}
                      </pre>
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
