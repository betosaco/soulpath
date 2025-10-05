'use client';

import { useState, useEffect } from 'react';
import { BaseButton } from '../../ui/BaseButton';
import { BaseInput } from '../../ui/BaseInput';
import { Label } from '../../ui/label';
import { Checkbox } from '../../ui/checkbox';
import { X, Search, Users, CheckCircle } from 'lucide-react';

interface TelegramUser {
  id: string;
  fullName: string;
  email: string;
  telegram_chat_id: string | null;
  telegram_username: string | null;
}

interface TelegramUserSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: TelegramUser[];
  onUsersChange: (users: TelegramUser[]) => void;
}

export function TelegramUserSelectorModal({ 
  isOpen, 
  onClose, 
  selectedUsers, 
  onUsersChange 
}: TelegramUserSelectorModalProps) {
  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch users with Telegram chat IDs
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/users/telegram');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      console.error('Failed to fetch Telegram users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.telegram_username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserToggle = (user: TelegramUser) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      onUsersChange(selectedUsers.filter(u => u.id !== user.id));
    } else {
      onUsersChange([...selectedUsers, user]);
    }
  };

  const handleSelectAll = () => {
    const usersWithChatIds = filteredUsers.filter(user => user.telegram_chat_id);
    onUsersChange(usersWithChatIds);
  };

  const handleClearAll = () => {
    onUsersChange([]);
  };

  const handleConfirm = () => {
    onClose();
  };

  if (!isOpen) {
    console.log('🔧 TelegramUserSelectorModal: Modal is closed');
    return null;
  }

  console.log('🔧 TelegramUserSelectorModal: Modal is open, rendering...');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Telegram Users</h2>
              <p className="text-sm text-gray-500">Choose users who will receive Telegram notifications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <BaseInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email, or username..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <BaseButton
                onClick={handleSelectAll}
                size="sm"
                className="text-xs"
              >
                Select All with Chat ID
              </BaseButton>
              <BaseButton
                onClick={handleClearAll}
                size="sm"
                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Clear All
              </BaseButton>
            </div>
            <div className="text-sm text-gray-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️ {error}</div>
                <BaseButton onClick={fetchUsers} size="sm">
                  Retry
                </BaseButton>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p>No users found</p>
                {searchQuery && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                const hasChatId = !!user.telegram_chat_id;
                
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'hover:bg-gray-50 border-gray-200'
                    } ${!hasChatId ? 'opacity-50' : ''}`}
                    onClick={() => hasChatId && handleUserToggle(user)}
                  >
                    <Checkbox
                      checked={isSelected}
                      disabled={!hasChatId}
                      onChange={() => hasChatId && handleUserToggle(user)}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium truncate">
                          {user.fullName || 'No Name'}
                        </div>
                        {isSelected && (
                          <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.email || 'No Email'}
                      </div>
                      {user.telegram_username && (
                        <div className="text-xs text-blue-600">
                          @{user.telegram_username}
                        </div>
                      )}
                      {user.telegram_chat_id && (
                        <div className="text-xs text-green-600">
                          Chat ID: {user.telegram_chat_id}
                        </div>
                      )}
                      {!hasChatId && (
                        <div className="text-xs text-red-500">
                          No Telegram Chat ID
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedUsers.length > 0 && (
                <div>
                  <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''} selected
                  <div className="text-xs text-gray-500 mt-1">
                    Chat IDs: {selectedUsers.map(u => u.telegram_chat_id).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <BaseButton
                onClick={onClose}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </BaseButton>
              <BaseButton
                onClick={handleConfirm}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm Selection
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
