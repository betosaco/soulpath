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

  console.log('🔧 TelegramUserSelectorModal: Component called with isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('🔧 TelegramUserSelectorModal: Modal is closed, returning null');
    return null;
  }

  console.log('🔧 TelegramUserSelectorModal: Modal is open, rendering...');
  
  // Simple test modal
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      background: 'rgba(0,0,0,0.5)', 
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>🔧 TEST MODAL</h2>
        <p>If you can see this, the modal is working!</p>
        <button onClick={onClose} style={{ padding: '10px', margin: '10px' }}>
          Close Modal
        </button>
      </div>
    </div>
  );

