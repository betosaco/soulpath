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
  Users
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface TeacherSchedule {
  id: number;
  teacherId: number;
  venueId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: number;
    name: string;
    email?: string;
    specialties: string[];
    isActive: boolean;
  };
  venue?: {
    id: number;
    name: string;
    city?: string;
    country?: string;
  };
  teacherScheduleSlots?: Array<{
    id: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    bookedCount: number;
    maxBookings: number;
  }>;
}

interface TeacherScheduleFormData {
  teacherId: number;
  venueId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
  specialties: string[];
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
  'Friday', 'Saturday', 'Sunday'
];

export function TeacherScheduleManagement() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<TeacherSchedule[]>([]);
  const [teachers, setTeachers] = useState<Array<{ id: number; name: string; isActive: boolean }>>([]);
  const [venues, setVenues] = useState<Array<{ id: number; name: string; city?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [filterVenue, setFilterVenue] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<TeacherSchedule | null>(null);
  const [formData, setFormData] = useState<TeacherScheduleFormData>({
    teacherId: 0,
    venueId: 0,
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true,
    maxBookings: 1,
    specialties: []
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  // Fetch schedules, teachers, and venues
  const fetchSchedules = useCallback(async () => {
    if (!user?.access_token) {
      console.error('No authentication token available');
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/admin/teacher-schedules?include=all', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherScheduleManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setSchedules(data.data?.schedules || []);
      } else {
        setError(data.message || 'Failed to fetch schedules');
      }
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.access_token]);

  const fetchTeachers = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const response = await fetch('/api/admin/teachers?isActive=true', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherScheduleManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setTeachers(data.teachers || []);
      } else {
        console.error('Failed to fetch teachers:', data.error || 'Unknown error');
        setTeachers([]);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setTeachers([]);
    }
  }, [user?.access_token]);

  const fetchVenues = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const response = await fetch('/api/admin/venues?isActive=true', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherScheduleManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setVenues(data.data?.venues || []);
      } else {
        console.error('Failed to fetch venues:', data.error || 'Unknown error');
        setVenues([]);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      setVenues([]);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user?.access_token) {
      fetchSchedules();
      fetchTeachers();
      fetchVenues();
    }
  }, [user?.access_token, fetchSchedules, fetchTeachers, fetchVenues]);

  // Filter schedules
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.teacher?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.venue?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTeacher = filterTeacher === 'all' || 
                          schedule.teacherId.toString() === filterTeacher;
    
    const matchesVenue = filterVenue === 'all' || 
                        schedule.venueId.toString() === filterVenue;
    
    const matchesDay = filterDay === 'all' || 
                      schedule.dayOfWeek === filterDay;
    
    return matchesSearch && matchesTeacher && matchesVenue && matchesDay;
  });


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.access_token) {
      setError('Authentication required');
      return;
    }
    
    try {
      const url = editingSchedule ? '/api/admin/teacher-schedules' : '/api/admin/teacher-schedules';
      const method = editingSchedule ? 'PUT' : 'POST';
      
      const payload = editingSchedule 
        ? { id: editingSchedule.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      // Check content type before parsing JSON


      const contentType = response.headers.get('content-type');


      if (!contentType || !contentType.includes('application/json')) {


        const errorText = await response.text();


        console.error('❌ TeacherScheduleManagement: Non-JSON response received:', {


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
        resetForm();
        setShowForm(false);
        setEditingSchedule(null);
      } else {
        setError(data.message || 'Failed to save schedule');
      }
    } catch (err) {
      setError('Failed to save schedule');
      console.error('Error saving schedule:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    if (!user?.access_token) {
      setError('Authentication required');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/teacher-schedules?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Check content type before parsing JSON

      
      const contentType = response.headers.get('content-type');

      
      if (!contentType || !contentType.includes('application/json')) {

      
        const errorText = await response.text();

      
        console.error('❌ TeacherScheduleManagement: Non-JSON response received:', {

      
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
      } else {
        setError(data.message || 'Failed to delete schedule');
      }
    } catch (err) {
      setError('Failed to delete schedule');
      console.error('Error deleting schedule:', err);
    }
  };

  // Handle edit
  const handleEdit = (schedule: TeacherSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      teacherId: schedule.teacherId,
      venueId: schedule.venueId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable,
      maxBookings: schedule.maxBookings,
      specialties: schedule.specialties
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      teacherId: 0,
      venueId: 0,
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
      maxBookings: 1,
      specialties: []
    });
    setNewSpecialty('');
  };

  // Add specialty
  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  // Remove specialty
  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  // Group schedules by day
  const groupedSchedules = filteredSchedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayOfWeek]) {
      acc[schedule.dayOfWeek] = [];
    }
    acc[schedule.dayOfWeek].push(schedule);
    return acc;
  }, {} as Record<string, TeacherSchedule[]>);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p>Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="teacher-schedule-management">
      <div className="teacher-schedule-management__header">
        <h2 className="teacher-schedule-management__title">Teacher Schedule Management</h2>
        <button
          className="admin-button admin-button--primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingSchedule(null);
          }}
        >
          <Plus size={16} />
          Add Schedule
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="teacher-schedule-management__filters">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search__input"
          />
        </div>
        
        <div className="admin-filter">
          <UserCheck size={16} />
          <select
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Teachers</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id.toString()}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-filter">
          <MapPin size={16} />
          <select
            value={filterVenue}
            onChange={(e) => setFilterVenue(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Venues</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id.toString()}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-filter">
          <Calendar size={16} />
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Days</option>
            {DAYS_OF_WEEK.map(day => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedules List */}
      <div className="teacher-schedule-management__list">
        {filteredSchedules.length === 0 ? (
          <div className="admin-empty-state">
            <CalendarDays size={48} />
            <h3>No schedules found</h3>
            <p>Create your first teacher schedule to get started</p>
          </div>
        ) : (
          <div className="schedule-timeline">
            {DAYS_OF_WEEK.map(day => {
              const daySchedules = groupedSchedules[day] || [];
              if (daySchedules.length === 0) return null;

              return (
                <div key={day} className="schedule-day">
                  <div className="schedule-day__header">
                    <h3 className="schedule-day__title">{day}</h3>
                    <span className="schedule-day__count">{daySchedules.length} schedules</span>
                  </div>
                  
                  <div className="schedule-day__content">
                    {daySchedules.map((schedule) => (
                      <motion.div
                        key={schedule.id}
                        className="schedule-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="schedule-card__header">
                          <div className="schedule-card__teacher">
                            <UserCheck size={16} />
                            <span>{schedule.teacher?.name}</span>
                          </div>
                          <div className="schedule-card__status">
                            {schedule.isAvailable ? (
                              <span className="status-badge status-badge--active">
                                <Check size={12} />
                                Available
                              </span>
                            ) : (
                              <span className="status-badge status-badge--inactive">
                                <X size={12} />
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="schedule-card__content">
                          <div className="schedule-card__time">
                            <Clock size={14} />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                          
                          <div className="schedule-card__venue">
                            <MapPin size={14} />
                            <span>{schedule.venue?.name}</span>
                          </div>

                          <div className="schedule-card__bookings">
                            <Users size={14} />
                            <span>Max: {schedule.maxBookings}</span>
                            {schedule.teacherScheduleSlots && (
                              <span className="schedule-card__booked">
                                Booked: {schedule.teacherScheduleSlots.reduce((sum, slot) => sum + slot.bookedCount, 0)}
                              </span>
                            )}
                          </div>

                          {schedule.specialties.length > 0 && (
                            <div className="schedule-card__specialties">
                              {schedule.specialties.map((specialty, index) => (
                                <span key={index} className="specialty-tag">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="schedule-card__actions">
                          <button
                            className="admin-button admin-button--secondary admin-button--sm"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            className="admin-button admin-button--danger admin-button--sm"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowForm(false);
              setEditingSchedule(null);
              resetForm();
            }}
          >
            <motion.div
              className="admin-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal__header">
                <h3>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h3>
                <button
                  className="admin-modal__close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingSchedule(null);
                    resetForm();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-modal__content">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Teacher *</label>
                    <select
                      value={formData.teacherId}
                      onChange={(e) => setFormData(prev => ({ ...prev, teacherId: parseInt(e.target.value) }))}
                      className="admin-form-select"
                      required
                    >
                      <option value={0}>Select a teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Venue *</label>
                    <select
                      value={formData.venueId}
                      onChange={(e) => setFormData(prev => ({ ...prev, venueId: parseInt(e.target.value) }))}
                      className="admin-form-select"
                      required
                    >
                      <option value={0}>Select a venue</option>
                      {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Day of Week *</label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => setFormData(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                      className="admin-form-select"
                      required
                    >
                      {DAYS_OF_WEEK.map(day => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Start Time *</label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="admin-form-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">End Time *</label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="admin-form-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Max Bookings *</label>
                    <input
                      type="number"
                      value={formData.maxBookings}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxBookings: parseInt(e.target.value) || 1 }))}
                      className="admin-form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Specialties</label>
                    <div className="tags-input">
                      <div className="tags-input__add">
                        <input
                          type="text"
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          placeholder="Add specialty..."
                          className="admin-form-input"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                        />
                        <button
                          type="button"
                          onClick={addSpecialty}
                          className="admin-button admin-button--secondary admin-button--sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="tags-list">
                        {formData.specialties.map((specialty, index) => (
                          <span key={index} className="tag tag--editable">
                            {specialty}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(specialty)}
                              className="tag__remove"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <div className="admin-form-checkboxes">
                      <label className="admin-form-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        />
                        <span className="admin-form-checkbox__label">Available</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-modal__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSchedule(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button--primary"
                  >
                    {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
