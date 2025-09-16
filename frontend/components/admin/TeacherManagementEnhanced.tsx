'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck, 
  Star,
  Check,
  X,
  MapPin,
  Calendar,
  Award,
  Grid3X3,
  Table,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  CheckSquare,
  Square
} from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  experience: number;
  avatarUrl?: string;
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  venueId?: number;
  venue?: {
    id: number;
    name: string;
    city?: string;
  };
  specialties?: Array<{
    specialty: {
      id: number;
      name: string;
      category?: string;
    };
  }>;
  languages?: Array<{
    language: {
      id: number;
      name: string;
      code: string;
    };
  }>;
  teacherSchedules?: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'venue' | 'experience' | 'schedules' | 'status';
type SortDirection = 'asc' | 'desc';

export function TeacherManagementEnhanced() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [venues, setVenues] = useState<Array<{ id: number; name: string; city?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [filterVenue, setFilterVenue] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showBulkActions, setShowBulkActions] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_specialties, setSpecialties] = useState<Array<{ id: number; name: string; category?: string }>>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_languages, setLanguages] = useState<Array<{ id: number; name: string; code: string }>>([]);

  // Fetch data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/teachers?include=all');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagementEnhanced: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setTeachers(data.teachers);
      } else {
        setError(data.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      setError('Failed to fetch teachers');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch('/api/admin/venues');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagementEnhanced: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      if (data.success) setVenues(data.venues);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch('/api/admin/specialties');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagementEnhanced: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      if (data.success) setSpecialties(data.specialties);
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagementEnhanced: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      if (data.success) setLanguages(data.languages);
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchVenues();
    fetchSpecialties();
    fetchLanguages();
  }, []);

  // Filter and sort teachers
  const filteredAndSortedTeachers = teachers
    .filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.specialties?.some(s => s.specialty.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesActiveFilter = filterActive === 'all' || 
                                 (filterActive === 'active' && teacher.isActive) ||
                                 (filterActive === 'inactive' && !teacher.isActive);
      
      const matchesVenueFilter = filterVenue === 'all' || 
                                (filterVenue === 'unassigned' && !teacher.venueId) ||
                                teacher.venueId?.toString() === filterVenue;
      
      return matchesSearch && matchesActiveFilter && matchesVenueFilter;
    })
    .sort((a, b) => {
      let aValue: string | number | boolean, bValue: string | number | boolean;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'venue':
          aValue = a.venue?.name || '';
          bValue = b.venue?.name || '';
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'schedules':
          aValue = a.teacherSchedules?.length || 0;
          bValue = b.teacherSchedules?.length || 0;
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle teacher selection
  const toggleTeacherSelection = (teacherId: number) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const selectAllTeachers = () => {
    if (selectedTeachers.length === filteredAndSortedTeachers.length) {
      setSelectedTeachers([]);
    } else {
      setSelectedTeachers(filteredAndSortedTeachers.map(t => t.id));
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'assign-venue') => {
    if (selectedTeachers.length === 0) return;

    try {
      const response = await fetch('/api/admin/teachers/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherIds: selectedTeachers,
          action
        })
      });

      // Check content type before parsing JSON


      const contentType = response.headers.get('content-type');


      if (!contentType || !contentType.includes('application/json')) {


        const errorText = await response.text();


        console.error('❌ TeacherManagementEnhanced: Non-JSON response received:', {


          status: response.status,


          statusText: response.statusText,


          contentType,


          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')


        });


        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);


      }


      


      const data = await response.json();
      
      if (data.success) {
        await fetchTeachers();
        setSelectedTeachers([]);
        setShowBulkActions(false);
      } else {
        setError(data.message || 'Failed to perform bulk action');
      }
    } catch (err) {
      setError('Failed to perform bulk action');
      console.error('Error performing bulk action:', err);
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p>Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="teacher-management-enhanced">
      <div className="teacher-management__header">
        <h2 className="teacher-management__title">Teacher Management</h2>
        <div className="teacher-management__actions">
          <div className="view-toggle">
            <button
              className={`view-toggle__button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
              Grid
            </button>
            <button
              className={`view-toggle__button ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <Table size={16} />
              Table
            </button>
          </div>
          <button
            className="admin-button admin-button--primary"
            onClick={() => {
              setShowForm(true);
              setEditingTeacher(null);
            }}
          >
            <Plus size={16} />
            Add Teacher
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="teacher-management__filters">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search__input"
          />
        </div>
        
        <div className="admin-filter">
          <Filter size={16} />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Teachers</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
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
            <option value="unassigned">Unassigned</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id.toString()}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTeachers.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-actions__info">
            <span>{selectedTeachers.length} teacher(s) selected</span>
          </div>
          <div className="bulk-actions__buttons">
            <button
              className="admin-button admin-button--secondary admin-button--sm"
              onClick={() => handleBulkAction('activate')}
            >
              <Check size={14} />
              Activate Selected
            </button>
            <button
              className="admin-button admin-button--secondary admin-button--sm"
              onClick={() => handleBulkAction('deactivate')}
            >
              <X size={14} />
              Deactivate Selected
            </button>
            <button
              className="admin-button admin-button--secondary admin-button--sm"
              onClick={() => setShowBulkActions(true)}
            >
              <Users size={14} />
              Assign to Venue
            </button>
          </div>
        </div>
      )}

      {/* Teachers List */}
      <div className="teacher-management__list">
        {filteredAndSortedTeachers.length === 0 ? (
          <div className="admin-empty-state">
            <UserCheck size={48} />
            <h3>No teachers found</h3>
            <p>Create your first teacher to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="teacher-grid">
            {filteredAndSortedTeachers.map((teacher) => (
              <motion.div
                key={teacher.id}
                className="teacher-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="teacher-card__header">
                  <div className="teacher-card__avatar">
                    {teacher.avatarUrl ? (
                      <Image src={teacher.avatarUrl} alt={teacher.name} width={60} height={60} />
                    ) : (
                      <div className="teacher-card__avatar-placeholder">
                        {teacher.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="teacher-card__info">
                    <div className="teacher-card__title">
                      <h3>{teacher.name}</h3>
                      {teacher.featured && <Star size={16} className="teacher-card__featured" />}
                    </div>
                    <div className="teacher-card__status">
                      {teacher.isActive ? (
                        <span className="status-badge status-badge--active">
                          <Check size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="status-badge status-badge--inactive">
                          <X size={12} />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="teacher-card__content">
                  {teacher.bio && (
                    <p className="teacher-card__bio">{teacher.bio}</p>
                  )}
                  
                  <div className="teacher-card__stats">
                    <div className="teacher-stat">
                      <Award size={14} />
                      <span>{teacher.experience} years experience</span>
                    </div>
                    {teacher.venue && (
                      <div className="teacher-stat">
                        <MapPin size={14} />
                        <span>{teacher.venue.name}</span>
                      </div>
                    )}
                    {teacher.teacherSchedules && (
                      <div className="teacher-stat">
                        <Calendar size={14} />
                        <span>{teacher.teacherSchedules.length} schedules</span>
                      </div>
                    )}
                  </div>

                  {teacher.specialties && teacher.specialties.length > 0 && (
                    <div className="teacher-card__specialties">
                      {teacher.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty.specialty.name}
                        </span>
                      ))}
                      {teacher.specialties.length > 3 && (
                        <span className="specialty-tag specialty-tag--more">
                          +{teacher.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {teacher.languages && teacher.languages.length > 0 && (
                    <div className="teacher-card__languages">
                      <span className="languages-label">Languages:</span>
                      <div className="languages-tags">
                        {teacher.languages.map((lang, index) => (
                          <span key={index} className="language-tag">
                            {lang.language.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="teacher-card__actions">
                  <button
                    className="admin-button admin-button--secondary admin-button--sm"
                    onClick={() => {
                      setEditingTeacher(teacher);
                      setShowForm(true);
                    }}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="admin-button admin-button--danger admin-button--sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this teacher?')) {
                        // Handle delete
                      }
                    }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="teacher-table-container">
            <table className="teacher-table">
              <thead>
                <tr>
                  <th className="teacher-table__header">
                    <button
                      className="teacher-table__select-all"
                      onClick={selectAllTeachers}
                    >
                      {selectedTeachers.length === filteredAndSortedTeachers.length ? (
                        <CheckSquare size={16} />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="teacher-table__header" onClick={() => handleSort('name')}>
                    <div className="teacher-table__header-content">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="teacher-table__header" onClick={() => handleSort('venue')}>
                    <div className="teacher-table__header-content">
                      Assigned Venue
                      {getSortIcon('venue')}
                    </div>
                  </th>
                  <th className="teacher-table__header" onClick={() => handleSort('experience')}>
                    <div className="teacher-table__header-content">
                      Experience (Yrs)
                      {getSortIcon('experience')}
                    </div>
                  </th>
                  <th className="teacher-table__header">Specialties</th>
                  <th className="teacher-table__header">Languages</th>
                  <th className="teacher-table__header" onClick={() => handleSort('schedules')}>
                    <div className="teacher-table__header-content">
                      Active Schedules
                      {getSortIcon('schedules')}
                    </div>
                  </th>
                  <th className="teacher-table__header" onClick={() => handleSort('status')}>
                    <div className="teacher-table__header-content">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="teacher-table__header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTeachers.map((teacher) => (
                  <tr key={teacher.id} className="teacher-table__row">
                    <td className="teacher-table__cell">
                      <button
                        className="teacher-table__select"
                        onClick={() => toggleTeacherSelection(teacher.id)}
                      >
                        {selectedTeachers.includes(teacher.id) ? (
                          <CheckSquare size={16} />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="teacher-table__cell">
                      <div className="teacher-table__name">
                        <div className="teacher-table__avatar">
                          {teacher.avatarUrl ? (
                            <Image src={teacher.avatarUrl} alt={teacher.name} width={60} height={60} />
                          ) : (
                            <div className="teacher-table__avatar-placeholder">
                              {teacher.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="teacher-table__name-info">
                          <span className="teacher-table__name-text">{teacher.name}</span>
                          {teacher.featured && <Star size={14} className="teacher-table__featured" />}
                        </div>
                      </div>
                    </td>
                    <td className="teacher-table__cell">
                      <div className="teacher-table__venue">
                        <MapPin size={14} />
                        <span>{teacher.venue?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="teacher-table__cell">
                      <span className="teacher-table__experience">{teacher.experience}</span>
                    </td>
                    <td className="teacher-table__cell">
                      <div className="teacher-table__specialties">
                        {teacher.specialties?.slice(0, 2).map((specialty, index) => (
                          <span key={index} className="specialty-tag specialty-tag--small">
                            {specialty.specialty.name}
                          </span>
                        ))}
                        {teacher.specialties && teacher.specialties.length > 2 && (
                          <span className="specialty-tag specialty-tag--more">
                            +{teacher.specialties.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="teacher-table__cell">
                      <div className="teacher-table__languages">
                        {teacher.languages?.slice(0, 2).map((lang, index) => (
                          <span key={index} className="language-tag language-tag--small">
                            {lang.language.name}
                          </span>
                        ))}
                        {teacher.languages && teacher.languages.length > 2 && (
                          <span className="language-tag language-tag--more">
                            +{teacher.languages.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="teacher-table__cell">
                      <span className="teacher-table__schedules">
                        {teacher.teacherSchedules?.length || 0}
                      </span>
                    </td>
                    <td className="teacher-table__cell">
                      <span className={`status-badge ${teacher.isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
                        {teacher.isActive ? (
                          <>
                            <Check size={12} />
                            Active
                          </>
                        ) : (
                          <>
                            <X size={12} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="teacher-table__cell">
                      <div className="teacher-table__actions">
                        <button
                          className="admin-button admin-button--secondary admin-button--sm"
                          onClick={() => {
                            setEditingTeacher(teacher);
                            setShowForm(true);
                          }}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="admin-button admin-button--danger admin-button--sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this teacher?')) {
                              // Handle delete
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
