import React, { useState, useEffect } from 'react';
import { X, TestTube, CheckCircle, Users, Mail, MessageSquare } from 'lucide-react';
import { BaseButton } from '../ui/BaseButton';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  telegramChatId?: string;
}

interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  nodes: any[];
  connections: any[];
  settings: any;
}

interface WorkflowTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: WorkflowData | null;
  onRunTest: (workflow: WorkflowData, selectedUser: User) => Promise<void>;
}

export function WorkflowTestModal({ isOpen, onClose, workflow, onRunTest }: WorkflowTestModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users/by-role?role=ALL');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users || []);
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRunTest = async () => {
    if (!workflow || !selectedUser) return;

    setLoading(true);
    try {
      await onRunTest(workflow, selectedUser);
      onClose();
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !workflow) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <TestTube className="h-6 w-6 text-blue-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Test Workflow</h2>
              <p className="text-sm text-gray-600">Select a user to test the workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row h-[600px]">
          {/* Left Panel - User Selection */}
          <div className="flex-1 p-6 border-r">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Select Test User</h3>
              <div className="text-xs text-gray-500 mb-4">
                Choose a user to simulate running this workflow for
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {loadingUsers ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {user.fullName || 'No Name'}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                            user.role === 'TEACHER' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                          {user.telegramChatId && (
                            <MessageSquare className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      {selectedUser?.id === user.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Workflow Preview */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Workflow Preview</h3>
              <div className="text-xs text-gray-500 mb-4">
                Review what will be tested
              </div>
            </div>

            <div className="space-y-4">
              {/* Workflow Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{workflow.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {workflow.description || 'No description provided'}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{workflow.nodes?.length || 0} nodes</span>
                  <span>{workflow.connections?.length || 0} connections</span>
                </div>
              </div>

              {/* Selected User Info */}
              {selectedUser ? (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Testing For:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {selectedUser.fullName || 'No Name'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{selectedUser.email}</span>
                    </div>
                    {selectedUser.telegramChatId && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Telegram connected</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 text-center">
                    Select a user to see test preview
                  </p>
                </div>
              )}

              {/* Test Summary */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Test Summary</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Workflow will be executed in simulation mode</li>
                  <li>• No real emails or messages will be sent</li>
                  <li>• Results will be logged to console</li>
                  <li>• Selected user data will be used for templates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <BaseButton
            onClick={onClose}
            className="dashboard-button-secondary"
            disabled={loading}
          >
            Cancel
          </BaseButton>
          <BaseButton
            onClick={handleRunTest}
            disabled={!selectedUser || loading}
            className="dashboard-button-primary bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Running Test...
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4 mr-2" />
                Run Test
              </>
            )}
          </BaseButton>
        </div>
      </div>
    </div>
  );
}
