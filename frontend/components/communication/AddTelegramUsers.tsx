'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BaseButton } from '../ui/BaseButton';
import { Badge } from '../ui/badge';
import { BaseInput } from '../ui/BaseInput';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Bot,
  Users,
  UserPlus,
  UserMinus,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Search,
  X
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  telegram_chat_id: string | null;
  telegram_username: string | null;
}

interface AddTelegramUsersProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // User object with access_token
}

export function AddTelegramUsers({ isOpen, onClose, user }: AddTelegramUsersProps) {
  if (!isOpen) return null;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newChatId, setNewChatId] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users without telegram chat IDs
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('filter', 'no_telegram');
      if (selectedRole !== 'all') {
        params.append('role', selectedRole.toLowerCase());
      }

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users || []);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, user?.access_token]);

  // Handle user connection action
  const handleConnectUser = async (userId: string, chatId: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const response = await fetch('/api/admin/users/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          chatId,
          action: 'attach'
        })
      });

      const data = await response.json();

      if (data.success) {
        // Refresh users list
        await fetchUsers();
        setShowAssignModal(false);
        setNewChatId('');
        setSelectedUser(null);
      } else {
        setError(data.error || 'Action failed');
      }
    } catch (err) {
      setError('Failed to perform action');
      console.error('Error performing user action:', err);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add Telegram Users</h2>
                <p className="text-blue-100 mt-1">Connect users to Telegram chat IDs</p>
              </div>
            </div>
            <BaseButton
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2"
            >
              <X className="w-5 h-5" />
            </BaseButton>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Users List */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Users Without Telegram ({filteredUsers.length})
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <BaseInput
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => {
                      setSelectedRole(value);
                      // Fetch users immediately when role changes
                      setTimeout(() => fetchUsers(), 0);
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                  <BaseButton
                    onClick={() => fetchUsers()}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </BaseButton>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading users...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>All users have Telegram accounts connected!</p>
                  <p className="text-sm mt-1">No users found without Telegram chat IDs.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Connected
                        </Badge>
                        <BaseButton
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAssignModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Connect
                        </BaseButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="mt-8 text-center">
            <BaseButton variant="outline" onClick={onClose}>
              Close
            </BaseButton>
          </div>
        </div>
      </div>

      {/* Assign Chat ID Modal */}
      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Connect Telegram Account</h3>
                <BaseButton
                  variant="ghost"
                  onClick={() => {
                    setShowAssignModal(false);
                    setNewChatId('');
                    setSelectedUser(null);
                  }}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </BaseButton>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Connect <strong>{selectedUser.name}</strong> ({selectedUser.email}) to a Telegram chat.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="chatId">Telegram Chat ID</Label>
                  <BaseInput
                    id="chatId"
                    value={newChatId}
                    onChange={(e) => setNewChatId(e.target.value)}
                    placeholder="123456789"
                  />
                  <div className="text-xs text-gray-500">
                    Get the chat ID by having the user send /start to your bot and check the webhook logs,
                    or use a Telegram bot like @userinfobot.
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <BaseButton
                  variant="outline"
                  onClick={() => {
                    setShowAssignModal(false);
                    setNewChatId('');
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </BaseButton>
                <BaseButton
                  onClick={() => handleConnectUser(selectedUser.id, newChatId)}
                  disabled={!newChatId.trim() || actionLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {actionLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect User
                    </>
                  )}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
