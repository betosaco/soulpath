'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {
  Bot,
  TestTube,
  CheckCircle,
  XCircle,
  AlertCircle,
  Webhook,
  Key,
  Save,
  Trash2,
  RefreshCw,
  UserPlus,
  Users
} from 'lucide-react';

interface TelegramConfig {
  id?: string;
  bot_token: string;
  webhook_url: string;
  is_active: boolean;
  bot_username: string;
  bot_name: string;
  webhook_set: boolean;
  last_webhook_error: string | null;
  created_at?: string;
  updated_at?: string;
}

interface BotInfo {
  id: number;
  first_name: string;
  username?: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

export function TelegramConfigManagement() {
  const { user } = useAuth();
  const [config, setConfig] = useState<TelegramConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('ADMIN');
  const [roleUsers, setRoleUsers] = useState<any[]>([]);
  const [loadingRoleUsers, setLoadingRoleUsers] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    fullName: '',
    telegramChatId: '',
    role: 'USER'
  });

  const [formData, setFormData] = useState({
    bot_token: '',
    webhook_url: '',
    is_active: false
  });

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📡 Loading Telegram config...', {
        userToken: user?.access_token ? 'Present' : 'Missing',
        endpoint: '/api/admin/telegram-config'
      });

      const response = await fetch('/api/admin/telegram-config', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        },
      });

      console.log('📡 Load response status:', response.status);
      const result = await response.json();
      console.log('📊 Load response data:', result);

      if (result.success) {
        setConfig(result.config);
        setFormData({
          bot_token: result.config.bot_token || '',
          webhook_url: result.config.webhook_url || '',
          is_active: result.config.is_active || false
        });
        console.log('✅ Config loaded successfully');
      } else {
        console.error('❌ Load failed:', result);
        toast.error('Failed to load Telegram configuration');
      }
    } catch (error) {
      console.error('❌ Error loading config:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, [user?.access_token]);

  // Load configuration
  useEffect(() => {
    if (user?.access_token) {
      loadConfig();
    }
  }, [user?.access_token, loadConfig]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    if (!formData.bot_token) {
      toast.error('Please enter a bot token first');
      return;
    }

    setTesting(true);
    try {
      const response = await fetch('/api/admin/telegram-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bot_token: formData.bot_token,
          webhook_url: formData.webhook_url,
          is_active: false // Don't activate during test
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setBotInfo(result.botInfo);
        toast.success('Bot connection test successful!');
      } else {
        toast.error(result.details || 'Connection test failed');
      }
    } catch (error) {
      console.error('Error testing connection:', error);
      toast.error('Connection test failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('🔧 Saving Telegram config...', {
        formData,
        userToken: user?.access_token ? 'Present' : 'Missing',
        endpoint: '/api/admin/telegram-config'
      });

      const response = await fetch('/api/admin/telegram-config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('📊 Response data:', result);
      
      if (result.success) {
        setConfig(result.config);
        toast.success('Telegram configuration saved successfully!');
        await loadConfig(); // Reload to get updated info
      } else {
        console.error('❌ Save failed:', result);
        toast.error(result.details || result.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('❌ Error saving config:', error);
      toast.error(`Failed to save configuration: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the Telegram configuration? This will also remove the webhook.')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/telegram-config', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        }
      });

      const result = await response.json();

      if (result.success) {
        setConfig(null);
        setFormData({
          bot_token: '',
          webhook_url: '',
          is_active: false
        });
        setBotInfo(null);
        toast.success('Telegram configuration deleted successfully!');
      } else {
        toast.error(result.details || 'Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      toast.error('Failed to delete configuration');
    } finally {
      setSaving(false);
    }
  };

  const loadUsersByRole = async (role: string) => {
    setLoadingRoleUsers(true);
    try {
      const response = await fetch(`/api/admin/users/by-role?role=${role}`, {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        }
      });

      const result = await response.json();

      if (result.success) {
        setRoleUsers(result.users || []);
      } else {
        toast.error('Failed to load users');
        setRoleUsers([]);
      }
    } catch (error) {
      console.error('Error loading users by role:', error);
      toast.error('Failed to load users');
      setRoleUsers([]);
    } finally {
      setLoadingRoleUsers(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    loadUsersByRole(role);
  };

  const openRoleModal = () => {
    setShowRoleModal(true);
    loadUsersByRole(selectedRole);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setRoleUsers([]);
  };

  const openAddUserModal = () => {
    setShowAddUserModal(true);
    setNewUserData({
      email: '',
      fullName: '',
      telegramChatId: '',
      role: 'USER'
    });
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const handleAddUser = async () => {
    if (!newUserData.email || !newUserData.fullName || !newUserData.telegramChatId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: newUserData.email,
          fullName: newUserData.fullName,
          telegramChatId: newUserData.telegramChatId,
          role: newUserData.role,
          status: 'ACTIVE'
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User added successfully with Telegram Chat ID!');
        closeAddUserModal();
        // Refresh the role modal if it's open
        if (showRoleModal && selectedRole === newUserData.role) {
          loadUsersByRole(selectedRole);
        }
      } else {
        toast.error(result.error || 'Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-[var(--color-text-secondary)]">Loading Telegram configuration...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Telegram Bot Configuration</h2>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Configure your Telegram bot integration for conversational AI
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Bot Token */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Key className="h-4 w-4" />
              <span>Bot Token</span>
            </label>
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                value={formData.bot_token}
                onChange={(e) => handleInputChange('bot_token', e.target.value)}
                placeholder="Enter your Telegram bot token (e.g., 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Get your bot token from @BotFather on Telegram
            </p>
          </div>

          {/* Webhook URL */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Webhook className="h-4 w-4" />
              <span>Webhook URL</span>
            </label>
            <input
              type="url"
              value={formData.webhook_url}
              onChange={(e) => handleInputChange('webhook_url', e.target.value)}
              placeholder="https://your-domain.vercel.app/api/telegram/webhook"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500">
              The webhook URL where Telegram will send messages
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Activate Telegram bot
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={testConnection}
              disabled={testing || !formData.bot_token}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TestTube className="h-4 w-4" />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !formData.bot_token}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>

            <button
              onClick={openRoleModal}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Users className="h-4 w-4" />
              <span>Assign Chat IDs by Role</span>
            </button>

            <button
              onClick={openAddUserModal}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add New User Chat ID</span>
            </button>

            {config && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bot Information */}
      {botInfo && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Bot Information</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Bot Name</label>
                <p className="text-sm text-gray-900">{botInfo.first_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Username</label>
                <p className="text-sm text-gray-900">@{botInfo.username || 'No username'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Bot ID</label>
                <p className="text-sm text-gray-900">{botInfo.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Can Join Groups</label>
                <p className="text-sm text-gray-900">{botInfo.can_join_groups ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Status */}
      {config && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Configuration Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {config.is_active ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-sm font-medium text-gray-700">Bot Active</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  config.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {config.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {config.webhook_set ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="text-sm font-medium text-gray-700">Webhook Set</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  config.webhook_set 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {config.webhook_set ? 'Set' : 'Not Set'}
                </span>
              </div>

              {config.last_webhook_error && (
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Last Webhook Error</span>
                    <p className="text-xs text-red-600 mt-1">{config.last_webhook_error}</p>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <p>Last updated: {config.updated_at ? new Date(config.updated_at).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">Setup Instructions</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span className="font-medium">1.</span>
            <span>Create a bot with @BotFather on Telegram and get your bot token</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">2.</span>
            <span>Enter your bot token in the field above</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">3.</span>
            <span>Set your webhook URL (usually your domain + /api/telegram/webhook)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">4.</span>
            <span>Test the connection to verify your bot token is valid</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="font-medium">5.</span>
            <span>Save the configuration to activate the bot</span>
          </div>
        </div>
      </div>

      {/* Role Assignment Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Assign Chat IDs by Role</h3>
                </div>
                <button
                  onClick={closeRoleModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Manage Telegram chat ID assignments for users by role
              </p>
            </div>

            <div className="p-6">
              {/* Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="USER">User</option>
                </select>
              </div>

              {/* Users List */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">
                  {selectedRole} Users ({roleUsers.length})
                </h4>

                {loadingRoleUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-purple-500" />
                    <span className="ml-2 text-gray-600">Loading users...</span>
                  </div>
                ) : roleUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No users found for this role
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {roleUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.displayName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-sm">
                            {user.telegramChatId ? (
                              <span className="text-green-600 font-medium">
                                Chat ID: {user.telegramChatId}
                              </span>
                            ) : (
                              <span className="text-gray-400">
                                No Chat ID
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {user.telegramChatId ? (
                              <button
                                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                onClick={() => {
                                  // TODO: Implement detach chat ID functionality
                                  toast.info('Detach functionality not yet implemented');
                                }}
                              >
                                Detach
                              </button>
                            ) : (
                              <button
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                onClick={() => {
                                  // TODO: Implement attach chat ID functionality
                                  toast.info('Attach functionality not yet implemented');
                                }}
                              >
                                Assign
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">How to assign chat IDs:</h5>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Have users start a chat with your Telegram bot</li>
                  <li>2. The bot will automatically register their chat IDs</li>
                  <li>3. Refresh this list to see updated chat ID assignments</li>
                </ol>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeRoleModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => loadUsersByRole(selectedRole)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-6 w-6 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Add New User with Chat ID</h3>
                </div>
                <button
                  onClick={closeAddUserModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Create a new user account with Telegram chat ID
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="USER">User</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserData.fullName}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Telegram Chat ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telegram Chat ID
                </label>
                <input
                  type="text"
                  value={newUserData.telegramChatId}
                  onChange={(e) => setNewUserData(prev => ({ ...prev, telegramChatId: e.target.value }))}
                  placeholder="Enter Telegram chat ID (e.g., 123456789)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Users need to start a chat with your bot first to get their chat ID
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeAddUserModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
