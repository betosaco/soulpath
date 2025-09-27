'use client';

import React, { useState, useMemo } from 'react';
import { Search, User, Clock, CheckCircle, X } from 'lucide-react';
import { BaseButton } from '../ui/BaseButton';

interface Agent {
  id: string;
  fullName: string;
  email: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  activeConversations: number;
  avgResponseTime: string;
  skillTags: string[];
  avatarUrl?: string;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (agentId: string, note?: string) => Promise<void>;
  conversationId: string;
}

// Mock agents data - in real app, this would come from API
const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    status: 'online',
    activeConversations: 3,
    avgResponseTime: '2m',
    skillTags: ['billing', 'technical', 'escalation'],
  },
  {
    id: '2',
    fullName: 'Mike Chen',
    email: 'mike.chen@company.com',
    status: 'online',
    activeConversations: 1,
    avgResponseTime: '1m',
    skillTags: ['sales', 'onboarding', 'product'],
  },
  {
    id: '3',
    fullName: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@company.com',
    status: 'busy',
    activeConversations: 5,
    avgResponseTime: '5m',
    skillTags: ['technical', 'integrations', 'api'],
  },
  {
    id: '4',
    fullName: 'David Kim',
    email: 'david.kim@company.com',
    status: 'away',
    activeConversations: 0,
    avgResponseTime: '3m',
    skillTags: ['billing', 'refunds', 'payments'],
  },
];

export function TransferModal({ isOpen, onClose, onSubmit, conversationId }: TransferModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [transferNote, setTransferNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAgents = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_AGENTS;
    
    const query = searchQuery.toLowerCase();
    return MOCK_AGENTS.filter(agent => 
      agent.fullName.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.skillTags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleSubmit = async () => {
    if (!selectedAgentId) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(selectedAgentId, transferNote || undefined);
      // Reset form
      setSelectedAgentId('');
      setTransferNote('');
      setSearchQuery('');
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'away': return 'bg-orange-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'Available';
      case 'busy': return 'Busy';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getStatusBadgeColor = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'away': return 'bg-orange-100 text-orange-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Transfer Conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name, email, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Agent List */}
          <div className="mb-6 max-h-80 overflow-y-auto">
            <div className="space-y-2">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAgentId === agent.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAgentId(agent.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{agent.fullName}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(agent.status)}`}>
                            {getStatusText(agent.status)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Avg: {agent.avgResponseTime}
                          </span>
                          <span>{agent.activeConversations} active</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedAgentId === agent.id && (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  {/* Skills */}
                  {agent.skillTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {agent.skillTags.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {filteredAgents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No agents found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Note (Optional)
            </label>
            <textarea
              value={transferNote}
              onChange={(e) => setTransferNote(e.target.value)}
              placeholder="Add context about this conversation for the receiving agent..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <BaseButton
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </BaseButton>
          <BaseButton
            onClick={handleSubmit}
            disabled={!selectedAgentId || isSubmitting}
          >
            {isSubmitting ? 'Transferring...' : 'Transfer Conversation'}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}