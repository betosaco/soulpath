'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CalendarDays, 
  Clock,
  UserCheck,
  MapPin,
  Check,
  X,
  Calendar,
  Users,
  Building,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ScheduleCalendarView } from './ScheduleCalendarView';
import { 
  UnifiedSchedule, 
  ScheduleType, 
  DayOfWeek, 
  TeacherScheduleFormData,
  ScheduleFilters,
  ConflictCheckResult,
  CalendarEvent
} from '@/types/schedule';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

interface Teacher {
  id: number;
  name: string;
  email?: string;
  specialties: string[];
  isActive: boolean;
}

interface Venue {
  id: number;
  name: string;
  city?: string;
  country?: string;
  capacity: number;
  isActive: boolean;
}


interface ServiceType {
  id: number;
  name: string;
  description?: string;
  category: string;
  difficulty?: string;
  isActive: boolean;
}

// Types for API responses
interface TeacherResponse {
  id: number;
  name: string;
  isActive: boolean;
}

interface VenueResponse {
  id: number;
  name: string;
  isActive: boolean;
}


export function UnifiedScheduleManagement() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<UnifiedSchedule[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  
  // Filters and search
  const [filters, setFilters] = useState<ScheduleFilters>({
    type: undefined,
    teacherId: undefined,
    venueId: undefined,
    dayOfWeek: undefined,
    isAvailable: undefined,
    search: ''
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<UnifiedSchedule | null>(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictCheckResult | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Form data
  const [teacherFormData, setTeacherFormData] = useState<TeacherScheduleFormData>({
    teacherId: 0,
    venueId: 0,
    serviceTypeId: undefined,
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    maxBookings: 1,
    specialties: [],
    isRecurrent: false,
    endDate: undefined
  });

  // State for multiple days selection
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday']);

  // Handle day selection for recurrent schedules
  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        // Don't allow removing the last day
        if (prev.length === 1) return prev;
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };


  // Fetch data - ALL HOOKS MUST BE BEFORE ANY CONDITIONAL RETURNS
  const fetchSchedules = useCallback(async () => {
    if (!user || !user.access_token) {
      console.log('🔐 fetchSchedules: User not authenticated, skipping...');
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.teacherId) queryParams.append('teacherId', filters.teacherId.toString());
      if (filters.venueId) queryParams.append('venueId', filters.venueId.toString());
      if (filters.dayOfWeek) queryParams.append('dayOfWeek', filters.dayOfWeek);
      if (filters.isAvailable !== undefined) queryParams.append('isAvailable', filters.isAvailable.toString());
      if (filters.search) queryParams.append('search', filters.search);
      
      queryParams.append('include', 'all');
      
      const response = await fetch(`/api/admin/unified-schedules?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.schedules);
      } else {
        setError(data.message || 'Failed to fetch schedules');
      }
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  const fetchTeachers = useCallback(async () => {
    if (!user || !user.access_token) {
      console.log('🔐 fetchTeachers: User not authenticated, skipping...');
      return;
    }

    try {
      const response = await fetch('/api/admin/teachers?include=all', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received for teachers:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      if (data.success) {
        setTeachers(data.teachers.filter((t: TeacherResponse) => t.isActive));
      } else {
        console.error('❌ Failed to fetch teachers:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching teachers:', error);
    }
  }, [user]);

  const fetchVenues = useCallback(async () => {
    if (!user || !user.access_token) {
      console.log('🔐 fetchVenues: User not authenticated, skipping...');
      return;
    }

    try {
      const response = await fetch('/api/admin/venues?include=all', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received for venues:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      if (data.success) {
        setVenues((data.data?.venues || []).filter((v: VenueResponse) => v.isActive));
      } else {
        console.error('❌ Failed to fetch venues:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching venues:', error);
    }
  }, [user]);

  const fetchSessionDurations = useCallback(async () => {
    if (!user || !user.access_token) {
      console.log('🔐 fetchSessionDurations: User not authenticated, skipping...');
      return;
    }

    try {
      const response = await fetch('/api/admin/packages/durations', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received for session durations:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      if (data.success) {
        // Session durations fetched successfully
        console.log('✅ Session durations fetched:', data.data?.length || 0);
      } else {
        console.error('❌ Failed to fetch session durations:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching session durations:', error);
    }
  }, [user]);

  const fetchServiceTypes = useCallback(async () => {
    if (!user || !user.access_token) {
      console.log('🔐 fetchServiceTypes: User not authenticated, skipping...');
      return;
    }

    try {
      const response = await fetch('/api/admin/service-types', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received for service types:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      if (data.success) {
        setServiceTypes((data.data?.serviceTypes || []).filter((s: ServiceType) => s.isActive));
      } else {
        console.error('❌ Failed to fetch service types:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching service types:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  useEffect(() => {
    fetchTeachers();
    fetchVenues();
    fetchSessionDurations();
    fetchServiceTypes();
  }, [fetchTeachers, fetchVenues, fetchSessionDurations, fetchServiceTypes]);


  // Check for conflicts
  const checkConflicts = async (schedule: UnifiedSchedule) => {
    try {
      const response = await fetch('/api/admin/schedule-conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule })
      });
      
      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('❌ UnifiedScheduleManagement: Non-JSON response received for conflicts:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
        });
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
      }
      
      const data = await response.json();
      setConflicts(data);
      setShowConflicts(true);
    } catch (err) {
      console.error('Error checking conflicts:', err);
    }
  };

  // Calendar view handlers
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click - could open edit modal or show details
    console.log('Event clicked:', event);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.access_token) {
      console.log('🔐 handleSubmit: User not authenticated, skipping...');
      setError('User not authenticated');
      return;
    }
    
    try {
      if (teacherFormData.isRecurrent && selectedDays.length > 1) {
        // Create multiple schedule entries for each selected day
        const promises = selectedDays.map(day => {
          const formData = { 
            type: 'teacher', 
            ...teacherFormData, 
            dayOfWeek: day as DayOfWeek 
          };
          
          return fetch('/api/admin/unified-schedules', {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${user.access_token}`,
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
          });
        });

        const responses = await Promise.all(promises);
        const results = await Promise.all(responses.map(r => r.json()));
        
        // Check if all requests were successful
        const allSuccessful = results.every(result => result.success);
        if (!allSuccessful) {
          throw new Error('Some schedule entries failed to create');
        }
      } else {
        // Single day schedule
        const formData = { 
          type: 'teacher', 
          ...teacherFormData,
          dayOfWeek: teacherFormData.isRecurrent ? selectedDays[0] as DayOfWeek : teacherFormData.dayOfWeek
        };

        const response = await fetch('/api/admin/unified-schedules', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${user.access_token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(formData)
        });

        // Check content type before parsing JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await response.text();
          console.error('❌ UnifiedScheduleManagement: Non-JSON response received for create:', {
            status: response.status,
            statusText: response.statusText,
            contentType,
            body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')
          });
          throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);
        }

        const data = await response.json();
        
        if (data.success) {
          await fetchSchedules();
          setShowForm(false);
          resetForm();
        } else {
          setError(data.message || 'Failed to create schedule');
        }
      }
    } catch (err) {
      setError('Failed to create schedule');
      console.error('Error creating schedule:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setTeacherFormData({
      teacherId: 0,
      venueId: 0,
      serviceTypeId: undefined,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
      maxBookings: 1,
      specialties: [],
      isRecurrent: false,
      endDate: undefined
    });
  };

  // Get schedule type icon
  const getScheduleTypeIcon = (type: ScheduleType) => {
    switch (type) {
      case 'teacher': return <UserCheck className="w-4 h-4" />;
      case 'venue': return <Building className="w-4 h-4" />;
      case 'general': return <Settings className="w-4 h-4" />;
      default: return <CalendarDays className="w-4 h-4" />;
    }
  };

  // Get schedule type color
  const getScheduleTypeColor = (type: ScheduleType) => {
    switch (type) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'venue': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    if (filters.type && schedule.type !== filters.type) return false;
    if (filters.teacherId && schedule.type === 'teacher' && schedule.teacherId !== filters.teacherId) return false;
    if (filters.venueId && 'venueId' in schedule && schedule.venueId !== filters.venueId) return false;
    if (filters.dayOfWeek && schedule.dayOfWeek !== filters.dayOfWeek) return false;
    if (filters.isAvailable !== undefined && schedule.isAvailable !== filters.isAvailable) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (schedule.type === 'teacher' && schedule.teacher) {
        if (!schedule.teacher.name.toLowerCase().includes(searchLower)) return false;
      }
      if ('venue' in schedule && schedule.venue && !schedule.venue.name.toLowerCase().includes(searchLower)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="unified-schedule-management">
      <div className="unified-schedule-management__header">
        <h1 className="unified-schedule-management__title">Unified Schedule Management</h1>
        <p className="unified-schedule-management__subtitle">
          Manage teacher schedules, venue schedules, and general schedules in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="unified-schedule-management__tabs">
        <button
          className={`unified-schedule-management__tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          <Calendar className="w-4 h-4" />
          List View
        </button>
        <button
          className={`unified-schedule-management__tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <CalendarDays className="w-4 h-4" />
          Calendar View
        </button>
      </div>

      {/* Filters */}
      <div className="unified-schedule-management__filters">
        <div className="unified-schedule-management__filter-group">
          <label className="unified-schedule-management__filter-label">Type</label>
          <select
            value={filters.type || 'all'}
            onChange={(e) => setFilters({ ...filters, type: e.target.value === 'all' ? undefined : e.target.value as ScheduleType })}
            className="unified-schedule-management__filter-select"
          >
            <option value="all">All Types</option>
            <option value="teacher">Teacher Schedules</option>
          </select>
        </div>

        <div className="unified-schedule-management__filter-group">
          <label className="unified-schedule-management__filter-label">Day</label>
          <select
            value={filters.dayOfWeek || 'all'}
            onChange={(e) => setFilters({ ...filters, dayOfWeek: e.target.value === 'all' ? undefined : e.target.value as DayOfWeek })}
            className="unified-schedule-management__filter-select"
          >
            <option value="all">All Days</option>
            {DAYS_OF_WEEK.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="unified-schedule-management__filter-group">
          <label className="unified-schedule-management__filter-label">Status</label>
          <select
            value={filters.isAvailable === undefined ? 'all' : filters.isAvailable.toString()}
            onChange={(e) => setFilters({ 
              ...filters, 
              isAvailable: e.target.value === 'all' ? undefined : e.target.value === 'true' 
            })}
            className="unified-schedule-management__filter-select"
          >
            <option value="all">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>

        <div className="unified-schedule-management__filter-group">
          <label className="unified-schedule-management__filter-label">Search</label>
          <div className="unified-schedule-management__search">
            <Search className="w-4 h-4" />
            <input
              type="text"
              placeholder="Search schedules..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="unified-schedule-management__search-input"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="unified-schedule-management__actions">
        <button
          onClick={() => setShowForm(true)}
          className="unified-schedule-management__add-button"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {/* Schedule List or Calendar */}
      {activeTab === 'list' ? (
        <div className="unified-schedule-management__list">
          {filteredSchedules.length === 0 ? (
            <div className="unified-schedule-management__empty">
              <CalendarDays className="w-12 h-12 text-gray-400" />
              <h3 className="unified-schedule-management__empty-title">No schedules found</h3>
              <p className="unified-schedule-management__empty-message">
                Create your first schedule to get started
              </p>
            </div>
          ) : (
            <div className="unified-schedule-management__grid">
              {filteredSchedules.map((schedule) => (
                <motion.div
                  key={`${schedule.type}-${schedule.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="unified-schedule-management__card"
                >
                  <div className="unified-schedule-management__card-header">
                    <div className="unified-schedule-management__card-type">
                      <span className={`unified-schedule-management__type-badge ${getScheduleTypeColor(schedule.type)}`}>
                        {getScheduleTypeIcon(schedule.type)}
                        {schedule.type.charAt(0).toUpperCase() + schedule.type.slice(1)}
                      </span>
                    </div>
                    <div className="unified-schedule-management__card-actions">
                      <button
                        onClick={() => checkConflicts(schedule)}
                        className="unified-schedule-management__action-button"
                        title="Check conflicts"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingSchedule(schedule)}
                        className="unified-schedule-management__action-button"
                        title="Edit schedule"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="unified-schedule-management__action-button"
                        title="Delete schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="unified-schedule-management__card-content">
                    <div className="unified-schedule-management__card-info">
                      <div className="unified-schedule-management__info-item">
                        <CalendarDays className="w-4 h-4" />
                        <span>{schedule.dayOfWeek}</span>
                      </div>
                      <div className="unified-schedule-management__info-item">
                        <Clock className="w-4 h-4" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                      <div className="unified-schedule-management__info-item">
                        <Users className="w-4 h-4" />
                        <span>{schedule.maxBookings} max bookings</span>
                      </div>
                    </div>

                    {schedule.type === 'teacher' && schedule.teacher && (
                      <div className="unified-schedule-management__card-details">
                        <div className="unified-schedule-management__detail-item">
                          <UserCheck className="w-4 h-4" />
                          <span>{schedule.teacher.name}</span>
                        </div>
                        {schedule.venue && (
                          <div className="unified-schedule-management__detail-item">
                            <MapPin className="w-4 h-4" />
                            <span>{schedule.venue.name}</span>
                          </div>
                        )}
                        {schedule.serviceType && (
                          <div className="unified-schedule-management__detail-item">
                            <Settings className="w-4 h-4" />
                            <span>{schedule.serviceType.name} ({schedule.serviceType.category})</span>
                          </div>
                        )}
                      </div>
                    )}

                    {schedule.type === 'venue' && schedule.venue && (
                      <div className="unified-schedule-management__card-details">
                        <div className="unified-schedule-management__detail-item">
                          <Building className="w-4 h-4" />
                          <span>{schedule.venue.name}</span>
                        </div>
                        <div className="unified-schedule-management__detail-item">
                          <Users className="w-4 h-4" />
                          <span>Capacity: {schedule.capacity}</span>
                        </div>
                      </div>
                    )}

                    <div className="unified-schedule-management__card-status">
                      <span className={`unified-schedule-management__status ${schedule.isAvailable ? 'available' : 'unavailable'}`}>
                        {schedule.isAvailable ? (
                          <>
                            <Check className="w-4 h-4" />
                            Available
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            Unavailable
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <ScheduleCalendarView
          schedules={filteredSchedules}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onEventClick={handleEventClick}
          onConflictCheck={checkConflicts}
        />
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="unified-schedule-management__modal"
          >
            <div className="unified-schedule-management__modal-content">
              <div className="unified-schedule-management__modal-header">
                <h2 className="unified-schedule-management__modal-title">
                  {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="unified-schedule-management__modal-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="unified-schedule-management__form">
                {/* Teacher Schedule Form */}
                  <>
                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Teacher</label>
                      <select
                        value={teacherFormData.teacherId}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, teacherId: parseInt(e.target.value) })}
                        className="unified-schedule-management__form-select"
                        required
                      >
                        <option value={0}>Select a teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Venue</label>
                      <select
                        value={teacherFormData.venueId}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, venueId: parseInt(e.target.value) })}
                        className="unified-schedule-management__form-select"
                        required
                      >
                        <option value={0}>Select a venue</option>
                        {venues.map(venue => (
                          <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Service Type</label>
                      <select
                        value={teacherFormData.serviceTypeId || 0}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, serviceTypeId: parseInt(e.target.value) || undefined })}
                        className="unified-schedule-management__form-select"
                      >
                        <option value={0}>Select a service type (optional)</option>
                        {serviceTypes.map(serviceType => (
                          <option key={serviceType.id} value={serviceType.id}>
                            {serviceType.name} - {serviceType.category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-checkbox">
                        <input
                          type="checkbox"
                          checked={teacherFormData.isRecurrent}
                          onChange={(e) => setTeacherFormData({ ...teacherFormData, isRecurrent: e.target.checked })}
                        />
                        <span>Recurrent Schedule</span>
                      </label>
                    </div>

                    {teacherFormData.isRecurrent && (
                      <div className="unified-schedule-management__form-group">
                        <label className="unified-schedule-management__form-label">End Date (Optional)</label>
                        <input
                          type="date"
                          value={teacherFormData.endDate || ''}
                          onChange={(e) => setTeacherFormData({ ...teacherFormData, endDate: e.target.value || undefined })}
                          className="unified-schedule-management__form-input"
                        />
                      </div>
                    )}

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Max Bookings</label>
                      <input
                        type="number"
                        min="1"
                        value={teacherFormData.maxBookings}
                        onChange={(e) => setTeacherFormData({ ...teacherFormData, maxBookings: parseInt(e.target.value) })}
                        className="unified-schedule-management__form-input"
                        required
                      />
                    </div>
                  </>

                {/* Time fields */}
                <div className="unified-schedule-management__form-row">
                  <div className="unified-schedule-management__form-group">
                    <label className="unified-schedule-management__form-label">Start Time</label>
                    <input
                      type="time"
                      value={teacherFormData.startTime}
                      onChange={(e) => {
                        setTeacherFormData({ ...teacherFormData, startTime: e.target.value });
                      }}
                      className="unified-schedule-management__form-input"
                      required
                    />
                  </div>

                  <div className="unified-schedule-management__form-group">
                    <label className="unified-schedule-management__form-label">End Time</label>
                    <input
                      type="time"
                      value={teacherFormData.endTime}
                      onChange={(e) => {
                        setTeacherFormData({ ...teacherFormData, endTime: e.target.value });
                      }}
                      className="unified-schedule-management__form-input"
                      required
                    />
                  </div>
                </div>

                {/* Days selection */}
                <div className="unified-schedule-management__form-group">
                  <label className="unified-schedule-management__form-label">
                    {teacherFormData.isRecurrent ? 'Days of Week' : 'Day of Week'}
                  </label>
                  {teacherFormData.isRecurrent ? (
                    <div className="unified-schedule-management__days-container">
                      <div className="unified-schedule-management__weekdays-grid">
                        {DAYS_OF_WEEK.map(day => (
                          <label key={day} className="unified-schedule-management__weekday-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedDays.includes(day)}
                              onChange={() => toggleDay(day)}
                              className="unified-schedule-management__checkbox-input"
                            />
                            <span className="unified-schedule-management__checkbox-label">
                              {day.substring(0, 3)}
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="unified-schedule-management__selected-summary">
                        {selectedDays.length === 0 ? (
                          <span className="unified-schedule-management__no-selection">
                            No days selected
                          </span>
                        ) : (
                          <span className="unified-schedule-management__selection-count">
                            {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''} selected: {selectedDays.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <select
                      value={teacherFormData.dayOfWeek}
                      onChange={(e) => {
                        const day = e.target.value as DayOfWeek;
                        setTeacherFormData({ ...teacherFormData, dayOfWeek: day });
                      }}
                      className="unified-schedule-management__form-select"
                      required
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="unified-schedule-management__form-group">
                  <label className="unified-schedule-management__form-checkbox">
                    <input
                      type="checkbox"
                      checked={teacherFormData.isAvailable}
                      onChange={(e) => {
                        setTeacherFormData({ ...teacherFormData, isAvailable: e.target.checked });
                      }}
                    />
                    <span>Available for Booking</span>
                  </label>
                </div>

                <div className="unified-schedule-management__form-actions">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="unified-schedule-management__form-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="unified-schedule-management__form-submit"
                  >
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflicts Modal */}
      <AnimatePresence>
        {showConflicts && conflicts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="unified-schedule-management__modal"
          >
            <div className="unified-schedule-management__modal-content">
              <div className="unified-schedule-management__modal-header">
                <h2 className="unified-schedule-management__modal-title">Schedule Conflicts</h2>
                <button
                  onClick={() => setShowConflicts(false)}
                  className="unified-schedule-management__modal-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="unified-schedule-management__conflicts">
                {conflicts.hasConflicts ? (
                  <div className="unified-schedule-management__conflicts-list">
                    {conflicts.conflicts.map((conflict, index) => (
                      <div key={index} className={`unified-schedule-management__conflict ${conflict.severity}`}>
                        <AlertTriangle className="w-4 h-4" />
                        <div>
                          <p className="unified-schedule-management__conflict-message">{conflict.message}</p>
                          <p className="unified-schedule-management__conflict-type">{conflict.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="unified-schedule-management__no-conflicts">
                    <Check className="w-8 h-8 text-green-500" />
                    <p>No conflicts found</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
