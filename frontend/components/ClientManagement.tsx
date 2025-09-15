import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit, Clock, User, Search, Calendar, Grid, List, 
  RefreshCw, Eye, CheckCircle, History, Download, Star, ArrowUpDown, Trash2, X
} from 'lucide-react';
import { BaseButton } from './ui/BaseButton';
import { BaseInput } from './ui/BaseInput';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

import { useAuth } from '../hooks/useAuth';
import { adminApi } from '@/lib/api/admin';
import CreateBookingModal from './modals/CreateBookingModal';


interface Client {
  id: string;
  fullName: string; // Changed from 'name' to 'fullName'
  email: string;
  phone?: string;
  status: string;
  birthDate: string;
  birthTime?: string;
  birthPlace: string;
  question: string;
  language: string;
  adminNotes?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  sessionType?: string;
  lastReminderSent?: string;
  lastBooking?: string;
  createdAt: string;
  updatedAt?: string;
  totalBookings?: number;
  isRecurrent?: boolean;
  role?: string; // Added role field
}

interface Booking {
  id: string;
  clientId: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  notes?: string;
  sessionType?: string;
  price?: number;
  rating?: number;
  feedback?: string;
}

interface ClientModalProps {
  client: Client | null;
  isOpen: boolean;
  mode: 'create' | 'edit' | 'view';
  onClose: () => void;
  onSave: (client: Partial<Client>) => void;
}

function ClientModal({ client, isOpen, mode, onClose, onSave }: ClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    fullName: '',
    email: '',
    phone: '',
    status: 'active',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    question: '',
    language: 'en',
    adminNotes: ''
  });

  useEffect(() => {
    if (client && mode !== 'create') {
      setFormData(client);
    } else {
            setFormData({
        fullName: '',
        email: '',
        phone: '',
        status: 'active',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        question: '',
        language: 'en',
        adminNotes: ''
      });
    }
  }, [client, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[#1a1a2e] border-2 border-[#FFD700] rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl shadow-[#FFD700]/30"
      >
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b border-[#2a2a4a] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                <User size={24} className="text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">
                  {mode === 'create' ? 'Add New Client' : mode === 'edit' ? 'Edit Client' : 'Client Details'}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {mode === 'create' ? 'Enter client information to create a new consultation client' : 
                   mode === 'edit' ? 'Update client details and information' : 
                   'View complete client information and history'}
                </p>
              </div>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-[#1a1a2e] text-white border border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <X size={16} />
            </BaseButton>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="dashboard-text-primary text-lg font-semibold border-b border-[#2a2a4a] pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="dashboard-label">Full Name *</Label>
                  <BaseInput
                    id="name"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="dashboard-label">Email *</Label>
                  <BaseInput
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="dashboard-label">Phone</Label>
                  <BaseInput
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="language" className="dashboard-label">Language</Label>
                  <Select
                    value={formData.language || 'en'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="en" className="dashboard-dropdown-item">🇺🇸 English</SelectItem>
                      <SelectItem value="es" className="dashboard-dropdown-item">🇪🇸 Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="dashboard-label">Status</Label>
                  <Select
                    value={formData.status || 'active'}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger className="dashboard-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dashboard-dropdown-content">
                      <SelectItem value="active" className="dashboard-dropdown-item">Active</SelectItem>
                      <SelectItem value="pending" className="dashboard-dropdown-item">Pending</SelectItem>
                      <SelectItem value="confirmed" className="dashboard-dropdown-item">Confirmed</SelectItem>
                      <SelectItem value="completed" className="dashboard-dropdown-item">Completed</SelectItem>
                      <SelectItem value="cancelled" className="dashboard-dropdown-item">Cancelled</SelectItem>
                      <SelectItem value="no-show" className="dashboard-dropdown-item">No Show</SelectItem>
                      <SelectItem value="inactive" className="dashboard-dropdown-item">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Birth Information Section */}
            <div className="space-y-4">
              <h3 className="dashboard-text-primary text-lg font-semibold border-b border-[#2a2a4a] pb-2">
                Birth Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birthDate" className="dashboard-label">Birth Date *</Label>
                  <BaseInput
                    id="birthDate"
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="birthTime" className="dashboard-label">Birth Time (Optional)</Label>
                  <BaseInput
                    id="birthTime"
                    type="time"
                    value={formData.birthTime || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    placeholder="Leave empty if unknown"
                  />
                  <p className="dashboard-text-muted text-xs mt-1">Leave empty if birth time is unknown</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="birthPlace" className="dashboard-label">Birth Place *</Label>
                  <BaseInput
                    id="birthPlace"
                    value={formData.birthPlace || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                    className="dashboard-input"
                    disabled={mode === 'view'}
                    placeholder="City, Country (or just City if country unknown)"
                    required
                  />
                  <p className="dashboard-text-muted text-xs mt-1">City and country preferred, but city alone is acceptable</p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="question" className="dashboard-label">Question/Focus Areas *</Label>
                  <Textarea
                    id="question"
                    value={formData.question || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    className="dashboard-input min-h-[100px]"
                    disabled={mode === 'view'}
                    placeholder="What would you like to explore in your reading?"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Admin & CRM Section */}
            <div className="space-y-4">
              <h3 className="dashboard-text-primary text-lg font-semibold border-b border-[#2a2a4a] pb-2">
                Admin & CRM
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="adminNotes" className="dashboard-label">Admin Notes (CRM History)</Label>
                  <Textarea
                    id="adminNotes"
                    value={formData.adminNotes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    className="dashboard-input min-h-[100px]"
                    disabled={mode === 'view'}
                    placeholder="Internal notes, follow-up actions, client preferences, etc."
                  />
                </div>
              </div>
            </div>

            {mode !== 'view' && (
              <div className="bg-[#0a0a0a] border-t border-[#2a2a4a] p-6 -mx-6 -mb-6">
                <div className="flex justify-end space-x-4">
                  <BaseButton
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="bg-[#1a1a2e] text-white border border-gray-500 hover:bg-gray-500 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </BaseButton>
                  <BaseButton
                    type="submit"
                    className="bg-[#1a1a2e] text-white border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-200 font-semibold"
                  >
                    {mode === 'create' ? 'Add Client' : 'Save Changes'}
                  </BaseButton>
                </div>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}

interface BookingHistoryModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

function BookingHistoryModal({ client, isOpen, onClose }: BookingHistoryModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const loadBookingHistory = useCallback(async () => {
    if (!client || !user?.access_token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/users/${client.id}/bookings`,
        {
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error('Error loading booking history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [client, user?.access_token]);

  useEffect(() => {
    if (isOpen && client) {
      loadBookingHistory();
    }
  }, [isOpen, client, loadBookingHistory]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-500/20 text-black', label: 'Pending' },
      'confirmed': { color: 'bg-blue-500/20 text-black', label: 'Confirmed' },
      'completed': { color: 'bg-green-500/20 text-black', label: 'Completed' },
      'cancelled': { color: 'bg-red-500/20 text-black', label: 'Cancelled' },
      'no-show': { color: 'bg-gray-500/20 text-black', label: 'No Show' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-[#1a1a2e] border-2 border-[#FFD700] rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl shadow-[#FFD700]/30"
      >
        <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b border-[#2a2a4a] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                <History size={24} className="text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Booking History</h2>
                <p className="text-gray-300 text-sm mt-1">
                  All bookings for {client?.fullName} ({client?.email})
                </p>
              </div>
            </div>
            <BaseButton
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-[#1a1a2e] text-white border border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <X size={16} />
            </BaseButton>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-[#FFD700] border-t-transparent rounded-full"
              />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-400/50 mb-4" />
              <p className="dashboard-text-secondary text-lg mb-2">No booking history</p>
              <p className="dashboard-text-muted text-sm">This client hasn&apos;t made any bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="dashboard-text-secondary text-sm">
                  Total bookings: {bookings.length}
                </p>
                <BaseButton
                  variant="outline"
                  size="sm"
                  className="dashboard-button-outline"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </BaseButton>
              </div>

              <div className="space-y-3">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="dashboard-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                            <Calendar size={20} className="text-[#FFD700]" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <p className="dashboard-text-primary font-medium">
                                {formatDate(booking.date)}
                              </p>
                              <span className="dashboard-text-secondary">•</span>
                              <p className="dashboard-text-secondary">{booking.time}</p>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm dashboard-text-secondary">
                              <span>Type: {booking.sessionType || 'Standard Reading'}</span>
                              {booking.price && <span>• ${booking.price}</span>}
                              {booking.rating && (
                                <div className="flex items-center space-x-1">
                                  <span>•</span>
                                  <Star size={14} className="text-yellow-400" />
                                  <span>{booking.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Booked: {formatDate(booking.createdAt)}
                          </p>
                          {booking.completedAt && (
                            <p className="text-xs text-green-400">
                              Completed: {formatDate(booking.completedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {booking.notes && (
                        <div className="mt-3 pt-3 border-t border-[#C0C0C0]/10">
                          <p className="text-sm text-[#EAEAEA]/80">{booking.notes}</p>
                        </div>
                      )}
                      {booking.feedback && (
                        <div className="mt-3 pt-3 border-t border-[#C0C0C0]/10">
                          <p className="text-xs text-[#C0C0C0] mb-1">Client Feedback:</p>
                          <p className="text-sm text-[#EAEAEA]/80 italic">&quot;{booking.feedback}&quot;</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ClientManagement() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);

  console.log('🔍 ClientManagement component rendered');
  console.log('🔍 User object:', user);
  console.log('🔍 User email:', user?.email);
  console.log('🔍 User access_token exists:', !!user?.access_token);
  console.log('🔍 Clients count:', clients.length);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status' | 'bookings'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view' | 'history';
  }>({ isOpen: false, mode: 'view' });
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [selectedClientForBooking, setSelectedClientForBooking] = useState<Client | null>(null);

  const loadClients = useCallback(async () => {
    try {
      console.log('🔍 loadClients called');
      console.log('🔍 User object:', user);
      console.log('🔍 access_token exists:', !!user?.access_token);

      if (!user?.access_token) {
        console.log('❌ No access token, cannot load clients');
        console.log('❌ User object details:', JSON.stringify(user, null, 2));
        toast.error('Please log in to access this feature');
        return;
      }

      setIsLoading(true);
      console.log('Loading clients using adminApi...');

        const response = await adminApi.getUsers({ 
          limit: 100 
        });

      console.log('🔍 AdminApi response:', response);

      if (response.success && response.data) {
        const loadedClients = Array.isArray(response.data) ? response.data : [];
        console.log('Loaded clients:', loadedClients);
        setClients(loadedClients);
        setLastLoaded(new Date());

        if (loadedClients.length > 0) {
          toast.success(`Loaded ${loadedClients.length} clients successfully`);
        } else {
          toast.info('No clients found');
        }
      } else {
        console.error('❌ Failed to load clients:', response.error);
        toast.error(response.error || 'Failed to load clients');
      }
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Error loading clients');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Add a manual refresh function that can be called from parent components
  const refreshClients = useCallback(() => {
    if (user?.access_token) {
      console.log('Manual refresh requested...');
      loadClients();
    }
  }, [user?.access_token, loadClients]);

  useEffect(() => {
    if (user?.access_token) {
      console.log('User authenticated, loading clients...');
      loadClients();
    } else {
      console.log('User not authenticated, clearing clients...');
      setClients([]);
      setIsLoading(false);
    }
  }, [user?.access_token, loadClients]);

  // Refresh clients when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.access_token && clients.length === 0) {
        console.log('Component became visible, refreshing clients...');
        loadClients();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user?.access_token, clients.length, loadClients]);

  // Refresh clients when component mounts or when user navigates to it
  useEffect(() => {
    if (user?.access_token && clients.length === 0) {
      console.log('Component mounted or navigated to, loading clients...');
      loadClients();
    }
  }, [user?.access_token, clients.length, loadClients]);

  // Expose refresh function to parent components if needed
  useEffect(() => {
    // @ts-expect-error - Exposing refresh function globally for debugging
    window.refreshClients = refreshClients;

    return () => {
      // @ts-expect-error - Clean up global function
      delete window.refreshClients;
    };
  }, [user?.access_token, refreshClients]);

  // Listen for navigation events and refresh clients when needed
  useEffect(() => {
    const handleNavigation = () => {
      // Small delay to ensure the component is fully mounted
      setTimeout(() => {
        if (user?.access_token && clients.length === 0) {
          console.log('Navigation detected, refreshing clients...');
          loadClients();
        }
      }, 100);
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleNavigation);

    // Listen for pushstate (programmatic navigation)
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      handleNavigation();
    };

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      history.pushState = originalPushState;
    };
  }, [user?.access_token, clients.length, loadClients]);

  const filterAndSortClients = useCallback(() => {
    let filtered = [...clients];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(client =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.birthPlace?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(client => client.language === languageFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(client => {
            const clientDate = new Date(client.createdAt);
            return !isNaN(clientDate.getTime()) && clientDate >= filterDate;
          });
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(client => {
            const clientDate = new Date(client.createdAt);
            return !isNaN(clientDate.getTime()) && clientDate >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(client => {
            const clientDate = new Date(client.createdAt);
            return !isNaN(clientDate.getTime()) && clientDate >= filterDate;
          });
          break;
      }
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          // Handle invalid dates by putting them at the end
          if (isNaN(aValue.getTime())) aValue = new Date(0);
          if (isNaN(bValue.getTime())) bValue = new Date(0);
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'bookings':
          aValue = a.totalBookings || 0;
          bValue = b.totalBookings || 0;
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter, languageFilter, dateFilter, sortBy, sortOrder]);

  useEffect(() => {
    filterAndSortClients();
  }, [clients, searchQuery, statusFilter, languageFilter, dateFilter, sortBy, sortOrder, filterAndSortClients]);

  const handleCreateClient = () => {
    setSelectedClient(null);
    setModalState({ isOpen: true, mode: 'create' });
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalState({ isOpen: true, mode: 'edit' });
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setModalState({ isOpen: true, mode: 'view' });
  };

  const handleViewHistory = (client: Client) => {
    setSelectedClient(client);
    setModalState({ isOpen: true, mode: 'history' });
  };

  const handleCreateBooking = (client: Client) => {
    setSelectedClientForBooking(client);
    setShowCreateBookingModal(true);
  };

  const handleDeleteClient = async (client: Client) => {
    if (!user?.access_token) return;
    
    if (!confirm(`Are you sure you want to delete ${client.fullName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/users/${client.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setClients(prev => prev.filter(c => c.id !== client.id));
        toast.success('Client deleted successfully', {
          description: `${client.fullName} has been removed from your client list.`
        });
      } else {
        const errorData = await response.json();
        toast.error('Failed to delete client', {
          description: errorData.message || 'Please try again.'
        });
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Network error', {
        description: 'Failed to delete client. Please check your connection and try again.'
      });
    }
  };

  const handleSaveClient = async (clientData: Partial<Client>) => {
    if (!user?.access_token) return;

    try {
      const isCreate = modalState.mode === 'create';
      const url = isCreate 
        ? `/api/admin/users`
        : `/api/admin/users/${selectedClient?.id}`;

      const response = await fetch(url, {
        method: isCreate ? 'POST' : 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isCreate) {
          setClients(prev => [data.client, ...prev]);
          toast.success('Client created successfully!', {
            description: `${data.client.name} has been added to your client list.`
          });
        } else {
          setClients(prev => prev.map(c => 
            c.id === selectedClient?.id ? { ...c, ...data.client } : c
          ));
          toast.success('Client updated successfully!', {
            description: `${data.client.name}'s information has been updated.`
          });
        }
        
        setModalState({ isOpen: false, mode: 'view' });
        setSelectedClient(null);
      } else {
        const errorData = await response.json();
        toast.error('Failed to save client', {
          description: errorData.message || 'Please try again.'
        });
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Network error', {
        description: 'Failed to save client. Please check your connection and try again.'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-500/20 text-black', label: 'Pending' },
      'confirmed': { color: 'bg-blue-500/20 text-black', label: 'Confirmed' },
      'completed': { color: 'bg-green-500/20 text-black', label: 'Completed' },
      'cancelled': { color: 'bg-red-500/20 text-black', label: 'Cancelled' },
      'no-show': { color: 'bg-gray-500/20 text-black', label: 'No Show' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const stats = {
    total: clients.length,
    pending: clients.filter(c => c.status === 'pending').length,
    confirmed: clients.filter(c => c.status === 'confirmed').length,
    completed: clients.filter(c => c.status === 'completed').length,
    recurrent: clients.filter(c => c.isRecurrent).length
  };
  
  console.log('Stats calculation:', {
    total: clients.length,
    pending: clients.filter(c => c.status === 'pending').length,
    confirmed: clients.filter(c => c.status === 'confirmed').length,
    completed: clients.filter(c => c.status === 'completed').length,
    recurrent: clients.filter(c => c.isRecurrent).length
  });
  console.log('All client statuses:', clients.map(c => ({ name: c.fullName, status: c.status })));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#FFD700] text-lg font-semibold">Loading client management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2a4a] pb-6">
        <div>
          <h1 className="dashboard-text-primary text-3xl font-bold flex items-center">
            <Users size={32} className="mr-3 text-[#FFD700]" />
            Client Management
          </h1>
          <p className="dashboard-text-secondary mt-2">Manage your consultation clients and their booking history</p>
        </div>
        <div className="flex items-center space-x-4">
          <BaseButton
            variant="outline"
            onClick={loadClients}
            className="dashboard-button-outline hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 group"
            disabled={isLoading}
          >
            <RefreshCw 
              size={18} 
              className={`mr-2 transition-transform duration-200 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
            />
            <span className="font-medium">Refresh</span>
            {lastLoaded && (
              <span className="ml-2 text-xs opacity-70">
                {lastLoaded.toLocaleTimeString()}
              </span>
            )}
          </BaseButton>
          <BaseButton
            onClick={handleCreateClient}
            className="bg-[#1a1a2e] text-white border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-black hover:shadow-lg hover:shadow-[#FFD700]/25 transition-all duration-200 group font-semibold"
          >
            <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">Add Client</span>
          </BaseButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="dashboard-card hover:border-[#FFD700]/30 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stats-label text-sm font-medium">Total Clients</p>
                <p className="dashboard-stats-value text-2xl font-bold">{stats.total}</p>
                <p className="dashboard-text-muted text-xs mt-1">All registered clients</p>
              </div>
              <div className="w-12 h-12 bg-[#FFD700]/10 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-[#FFD700]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:border-yellow-500/30 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stats-label text-sm font-medium">Pending</p>
                <p className="dashboard-stats-value text-2xl font-bold text-yellow-500">{stats.pending}</p>
                <p className="dashboard-text-muted text-xs mt-1">Awaiting confirmation</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:border-blue-500/30 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stats-label text-sm font-medium">Confirmed</p>
                <p className="dashboard-stats-value text-2xl font-bold text-blue-500">{stats.confirmed}</p>
                <p className="dashboard-text-muted text-xs mt-1">Ready for sessions</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:border-green-500/30 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stats-label text-sm font-medium">Completed</p>
                <p className="dashboard-stats-value text-2xl font-bold text-green-500">{stats.completed}</p>
                <p className="dashboard-text-muted text-xs mt-1">Sessions finished</p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card hover:border-purple-500/30 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dashboard-stats-label text-sm font-medium">Recurrent</p>
                <p className="dashboard-stats-value text-2xl font-bold text-purple-500">{stats.recurrent}</p>
                <p className="dashboard-text-muted text-xs mt-1">Returning clients</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="dashboard-card border-[#2a2a4a]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="dashboard-text-primary text-lg font-semibold flex items-center">
              <Search size={20} className="mr-2 text-[#FFD700]" />
              Search & Filters
            </h3>
            <div className="flex items-center space-x-2">
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setLanguageFilter('all');
                  setDateFilter('all');
                }}
                className="dashboard-button-outline hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200 group"
              >
                <X size={14} className="mr-2 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-medium">Clear All</span>
              </BaseButton>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <Label className="dashboard-label text-sm font-medium">Search Clients</Label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400/50" />
                <BaseInput
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dashboard-input"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label className="dashboard-label">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="dashboard-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dashboard-dropdown-content">
                  <SelectItem value="all" className="dashboard-dropdown-item">All Status</SelectItem>
                  <SelectItem value="active" className="dashboard-dropdown-item">Active</SelectItem>
                  <SelectItem value="pending" className="dashboard-dropdown-item">Pending</SelectItem>
                  <SelectItem value="confirmed" className="dashboard-dropdown-item">Confirmed</SelectItem>
                  <SelectItem value="completed" className="dashboard-dropdown-item">Completed</SelectItem>
                  <SelectItem value="cancelled" className="dashboard-dropdown-item">Cancelled</SelectItem>
                  <SelectItem value="no-show" className="dashboard-dropdown-item">No Show</SelectItem>
                  <SelectItem value="inactive" className="dashboard-dropdown-item">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Filter */}
            <div>
              <Label className="dashboard-label">Language</Label>
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="dashboard-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dashboard-dropdown-content">
                  <SelectItem value="all" className="dashboard-dropdown-item">All Languages</SelectItem>
                  <SelectItem value="en" className="dashboard-dropdown-item">🇺🇸 English</SelectItem>
                  <SelectItem value="es" className="dashboard-dropdown-item">🇪🇸 Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div>
              <Label className="dashboard-label">Date</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="dashboard-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dashboard-dropdown-content">
                  <SelectItem value="all" className="dashboard-dropdown-item">All Time</SelectItem>
                  <SelectItem value="today" className="dashboard-dropdown-item">Today</SelectItem>
                  <SelectItem value="week" className="dashboard-dropdown-item">This Week</SelectItem>
                  <SelectItem value="month" className="dashboard-dropdown-item">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <Label className="dashboard-label">Sort By</Label>
              <Select value={sortBy} onValueChange={(value: 'date' | 'name' | 'status') => setSortBy(value)}>
                <SelectTrigger className="dashboard-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dashboard-dropdown-content">
                  <SelectItem value="date" className="dashboard-dropdown-item">Date Created</SelectItem>
                  <SelectItem value="name" className="dashboard-dropdown-item">Name</SelectItem>
                  <SelectItem value="status" className="dashboard-dropdown-item">Status</SelectItem>
                  <SelectItem value="bookings" className="dashboard-dropdown-item">Total Bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order & View Mode */}
            <div className="flex space-x-3">
              <BaseButton
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="dashboard-button-outline hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200 group"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown 
                  size={16} 
                  className={`transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
                />
              </BaseButton>
              <div className="flex bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg p-1">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-[#FFD700] text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-[#FFD700]/10'
                  }`}
                  title="List View"
                >
                  <List size={16} />
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-[#FFD700] text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-[#FFD700]/10'
                  }`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </BaseButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <p className="dashboard-text-secondary">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
          {lastLoaded && (
            <p className="dashboard-text-muted">
              Last loaded: {lastLoaded.toLocaleTimeString()}
            </p>
          )}
        </div>
        <BaseButton
          size="sm"
          onClick={loadClients}
          className="dashboard-button-outline hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200 group"
          disabled={isLoading}
        >
          <RefreshCw 
            size={16} 
            className={`mr-2 transition-transform duration-200 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
          />
          <span className="font-medium">Refresh</span>
        </BaseButton>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="dashboard-card">
          <CardContent className="p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-[#ffd700] border-t-transparent rounded-full mx-auto mb-4"
            />
            <h3 className="dashboard-text-primary text-lg font-semibold mb-2">Loading clients...</h3>
            <p className="dashboard-text-secondary">Please wait while we fetch your client data.</p>
          </CardContent>
        </Card>
      )}

      {/* Client List/Grid */}
      {!isLoading && filteredClients.length === 0 ? (
        <Card className="dashboard-card border-[#2a2a4a]">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={40} className="text-[#FFD700]" />
            </div>
            <h3 className="dashboard-text-primary text-xl font-semibold mb-3">No clients found</h3>
            <p className="dashboard-text-secondary mb-6 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || languageFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search terms to find what you\'re looking for.'
                : 'Get started by adding your first client to begin managing consultations.'}
            </p>
            {!searchQuery && statusFilter === 'all' && languageFilter === 'all' && dateFilter === 'all' && (
              <BaseButton
                onClick={handleCreateClient}
                className="bg-[#1a1a2e] text-white border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-black hover:shadow-lg hover:shadow-[#FFD700]/25 transition-all duration-200 group px-8 py-3"
              >
                <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-200" />
                <span className="font-semibold text-lg">Add First Client</span>
              </BaseButton>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        <Card className="dashboard-card border-[#2a2a4a] overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1a2e] border-b border-[#2a2a4a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700] border-r border-[#2a2a4a]">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700] border-r border-[#2a2a4a]">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700] border-r border-[#2a2a4a]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700] border-r border-[#2a2a4a]">Bookings</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700] border-r border-[#2a2a4a]">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#FFD700]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a4a]">
                  {filteredClients.map((client, index) => (
                    <tr key={client.id} className={`hover:bg-[#1a1a2e]/50 transition-colors ${index % 2 === 0 ? 'bg-[#0a0a0a]/30' : 'bg-[#0a0a0a]/10'}`}>
                      <td className="px-6 py-4 border-r border-[#2a2a4a]">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/20">
                            <User size={18} className="text-[#FFD700]" />
                          </div>
                          <div>
                            <p className="dashboard-text-primary font-semibold text-base">{client.fullName}</p>
                            <p className="dashboard-text-secondary text-sm flex items-center">
                              <span className="mr-1">{client.language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
                              {client.birthPlace}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-[#2a2a4a]">
                        <div>
                          <p className="dashboard-text-primary font-medium">{client.email}</p>
                          <p className="dashboard-text-secondary text-sm">
                            Born: {formatDate(client.birthDate)}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-[#2a2a4a]">
                        {getStatusBadge(client.status)}
                      </td>
                      <td className="px-6 py-4 border-r border-[#2a2a4a]">
                        <div className="flex items-center space-x-2">
                          <span className="dashboard-text-primary font-semibold text-lg">{client.totalBookings || 0}</span>
                          {client.isRecurrent && (
                            <div className="flex items-center space-x-1">
                              <Star size={14} className="text-[#FFD700]" />
                              <span className="text-xs text-[#FFD700] font-medium">Recurrent</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-[#2a2a4a]">
                        <p className="dashboard-text-primary font-medium">
                          {formatDate(client.createdAt)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <BaseButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewClient(client)}
                            className="dashboard-button-outline hover:bg-blue-500/20 hover:border-blue-500/50"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </BaseButton>
                          <BaseButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                            className="dashboard-button-outline hover:bg-green-500/20 hover:border-green-500/50"
                            title="Edit Client"
                          >
                            <Edit size={14} />
                          </BaseButton>
                          <BaseButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateBooking(client)}
                            className="dashboard-button-outline hover:bg-purple-500/20 hover:border-purple-500/50"
                            title="Create Booking"
                          >
                            <Calendar size={14} />
                          </BaseButton>
                          {(client.totalBookings || 0) > 0 && (
                            <BaseButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewHistory(client)}
                              className="dashboard-button-outline hover:bg-orange-500/20 hover:border-orange-500/50"
                              title="View History"
                            >
                              <History size={14} />
                            </BaseButton>
                          )}
                          <BaseButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client)}
                            className="dashboard-button-danger hover:bg-red-500/20 hover:border-red-500/50"
                            title="Delete Client"
                          >
                            <Trash2 size={14} />
                          </BaseButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} className="dashboard-card hover:border-[#FFD700]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#FFD700]/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/10 rounded-full flex items-center justify-center border border-[#FFD700]/20">
                      <User size={22} className="text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="dashboard-text-primary font-semibold text-lg">{client.fullName}</h3>
                      <p className="dashboard-text-secondary text-sm flex items-center">
                        <span className="mr-2">{client.language === 'en' ? '🇺🇸' : '🇪🇸'}</span>
                        {client.email}
                      </p>
                    </div>
                  </div>
                  {client.isRecurrent && (
                    <div className="flex items-center space-x-1 bg-[#FFD700]/10 px-2 py-1 rounded-full">
                      <Star size={14} className="text-[#FFD700]" />
                      <span className="text-xs text-[#FFD700] font-medium">Recurrent</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-[#2a2a4a]">
                    <span className="dashboard-text-secondary text-sm font-medium">Status</span>
                    {getStatusBadge(client.status)}
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#2a2a4a]">
                    <span className="dashboard-text-secondary text-sm font-medium">Bookings</span>
                    <span className="dashboard-text-primary font-semibold text-lg">{client.totalBookings || 0}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-[#2a2a4a]">
                    <span className="dashboard-text-secondary text-sm font-medium">Birth Date</span>
                    <span className="dashboard-text-primary font-medium">
                      {formatDate(client.birthDate)}
                    </span>
                  </div>
                  {client.birthPlace && (
                    <div className="flex items-center justify-between py-2">
                      <span className="dashboard-text-secondary text-sm font-medium">Birth Place</span>
                      <span className="dashboard-text-primary text-sm font-medium">{client.birthPlace}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewClient(client)}
                    className="dashboard-button-outline hover:bg-blue-500/20 hover:border-blue-500/50"
                  >
                    <Eye size={14} className="mr-2" />
                    View
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateBooking(client)}
                    className="bg-[#1a1a2e] text-white border border-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-200"
                  >
                    <Calendar size={14} className="mr-2" />
                    Book
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClient(client)}
                    className="dashboard-button-outline hover:bg-green-500/20 hover:border-green-500/50"
                  >
                    <Edit size={14} className="mr-2" />
                    Edit
                  </BaseButton>
                  {(client.totalBookings || 0) > 0 ? (
                    <BaseButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewHistory(client)}
                      className="dashboard-button-outline hover:bg-orange-500/20 hover:border-orange-500/50"
                    >
                      <History size={14} className="mr-2" />
                      History
                    </BaseButton>
                  ) : (
                    <BaseButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client)}
                      className="dashboard-button-danger hover:bg-red-500/20 hover:border-red-500/50"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </BaseButton>
                  )}
                </div>
                {(client.totalBookings || 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a4a]">
                    <BaseButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClient(client)}
                      className="w-full dashboard-button-danger hover:bg-red-500/20 hover:border-red-500/50"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Client
                    </BaseButton>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modalState.mode === 'history' ? (
          <BookingHistoryModal
            client={selectedClient}
            isOpen={modalState.isOpen}
            onClose={() => {
              setModalState({ isOpen: false, mode: 'view' });
              setSelectedClient(null);
            }}
          />
        ) : (
          <ClientModal
            client={selectedClient}
            isOpen={modalState.isOpen}
            mode={modalState.mode as 'create' | 'edit' | 'view'}
            onClose={() => {
              setModalState({ isOpen: false, mode: 'view' });
              setSelectedClient(null);
            }}
            onSave={handleSaveClient}
          />
        )}
      </AnimatePresence>

      {/* Create Booking Modal */}
      {selectedClientForBooking && (
        <CreateBookingModal
          isOpen={showCreateBookingModal}
          onClose={() => {
            setShowCreateBookingModal(false);
            setSelectedClientForBooking(null);
          }}
          client={selectedClientForBooking}
          onSuccess={() => {
            // Refresh clients to update booking counts
            loadClients();
          }}
        />
      )}
    </div>
  );
}