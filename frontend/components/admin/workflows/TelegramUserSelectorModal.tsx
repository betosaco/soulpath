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
  console.log('🔧 TelegramUserSelectorModal CALLED with isOpen:', isOpen);

  const [users, setUsers] = useState<TelegramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users/telegram');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch Telegram users:', error);
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

  if (!isOpen) {
    console.log('🔧 Modal returning null (isOpen is false)');
    return null;
  }

  console.log('🔧 Modal rendering (isOpen is true)');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '90%'
      }}>
        <h2>🔧 TEST MODAL</h2>
        <p>Modal is rendering! If you see this, the modal is working.</p>
        <button
          onClick={onClose}
          style={{
            padding: '10px',
            margin: '10px',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Close Modal
        </button>
      </div>
    </div>
  );
}