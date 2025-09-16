'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  MapPin, 
  Users, 
  Star,
  X,
  Grid3X3,
  Table,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Venue {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  capacity: number;
  maxGroupSize?: number;
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  amenities?: Array<{
    id: number;
    amenity: {
      id: number;
      name: string;
      description?: string;
      icon?: string;
      category?: string;
    };
  }>;
  teachers?: Array<{
    id: number;
    name: string;
    email?: string;
    specialties: Array<{
      specialty: {
        name: string;
      };
    }>;
    isActive: boolean;
  }>;
  scheduleTemplates?: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    capacity?: number;
    isAvailable: boolean;
  }>;
}

interface VenueFormData {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  maxGroupSize: number;
  amenityIds: number[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
}

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'city' | 'capacity' | 'teachers' | 'schedules' | 'status';
type SortDirection = 'asc' | 'desc';

export function VenueManagementEnhanced() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [amenities, setAmenities] = useState<Array<{ id: number; name: string; description?: string; icon?: string; category?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    capacity: 10,
    maxGroupSize: 0,
    amenityIds: [],
    isActive: true,
    displayOrder: 0,
    featured: false
  });

  // Fetch venues
  const fetchVenues = useCallback(async () => {
    if (!user?.access_token) {
      console.error('No authentication token available');
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
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

      
        console.error('❌ VenueManagementEnhanced: Non-JSON response received:', {

      
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
        setError(data.message || 'Failed to fetch venues');
      }
    } catch (err) {
      setError('Failed to fetch venues');
      console.error('Error fetching venues:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.access_token]);

  const fetchAmenities = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const response = await fetch('/api/admin/amenities', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ VenueManagementEnhanced: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setAmenities(data.amenities || []);
      }
    } catch (err) {
      console.error('Error fetching amenities:', err);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user?.access_token) {
      fetchVenues();
      fetchAmenities();
    }
  }, [user?.access_token, fetchVenues, fetchAmenities]);


  // Filter and sort venues
  const filteredAndSortedVenues = venues
    .filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.country?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterActive === 'all' || 
                           (filterActive === 'active' && venue.isActive) ||
                           (filterActive === 'inactive' && !venue.isActive);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aValue: string | number | boolean, bValue: string | number | boolean;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'city':
          aValue = (a.city || '').toLowerCase();
          bValue = (b.city || '').toLowerCase();
          break;
        case 'capacity':
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        case 'teachers':
          aValue = a.teachers?.length || 0;
          bValue = b.teachers?.length || 0;
          break;
        case 'schedules':
          aValue = a.scheduleTemplates?.length || 0;
          bValue = b.scheduleTemplates?.length || 0;
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.access_token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setError(null);
      const url = editingVenue ? '/api/admin/venues' : '/api/admin/venues';
      const method = editingVenue ? 'PUT' : 'POST';
      
      const payload = editingVenue 
        ? { id: editingVenue.id, ...formData }
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


        console.error('❌ VenueManagementEnhanced: Non-JSON response received:', {


          status: response.status,


          statusText: response.statusText,


          contentType,


          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')


        });


        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);


      }


      


      const data = await response.json();
      
      if (data.success) {
        await fetchVenues();
        resetForm();
        setShowForm(false);
        setEditingVenue(null);
      } else {
        setError(data.message || 'Failed to save venue');
      }
    } catch (err) {
      setError('Failed to save venue');
      console.error('Error saving venue:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    
    if (!user?.access_token) {
      setError('Authentication required');
      return;
    }
    
    try {
      setError(null);
      const response = await fetch(`/api/admin/venues?id=${id}`, {
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

      
        console.error('❌ VenueManagementEnhanced: Non-JSON response received:', {

      
          status: response.status,

      
          statusText: response.statusText,

      
          contentType,

      
          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

      
        });

      
        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      
      }

      
      

      
      const data = await response.json();
      
      if (data.success) {
        await fetchVenues();
      } else {
        setError(data.message || 'Failed to delete venue');
      }
    } catch (err) {
      setError('Failed to delete venue');
      console.error('Error deleting venue:', err);
    }
  };

  // Handle edit
  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      description: venue.description || '',
      address: venue.address || '',
      city: venue.city || '',
      country: venue.country || '',
      capacity: venue.capacity,
      maxGroupSize: venue.maxGroupSize || 0,
      amenityIds: venue.amenities?.map(a => a.amenity.id) || [],
      isActive: venue.isActive,
      displayOrder: venue.displayOrder,
      featured: venue.featured
    });
    setShowForm(true);
  };

  // Toggle venue status
  const toggleVenueStatus = async (venue: Venue) => {
    if (!user?.access_token) {
      setError('Authentication required');
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/admin/venues', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          ...venue,
          isActive: !venue.isActive
        })
      });

      // Check content type before parsing JSON


      const contentType = response.headers.get('content-type');


      if (!contentType || !contentType.includes('application/json')) {


        const errorText = await response.text();


        console.error('❌ VenueManagementEnhanced: Non-JSON response received:', {


          status: response.status,


          statusText: response.statusText,


          contentType,


          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')


        });


        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);


      }


      


      const data = await response.json();
      
      if (data.success) {
        await fetchVenues();
      } else {
        setError(data.message || 'Failed to update venue status');
      }
    } catch (err) {
      setError('Failed to update venue status');
      console.error('Error updating venue status:', err);
    }
  };

  // Navigate to teachers with venue filter
  const navigateToTeachers = (venueId: number) => {
    // This would be handled by the parent component or router
    console.log('Navigate to teachers filtered by venue:', venueId);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      capacity: 10,
      maxGroupSize: 0,
      amenityIds: [],
      isActive: true,
      displayOrder: 0,
      featured: false
    });
  };

  // Toggle amenity
  const toggleAmenity = (amenityId: number) => {
    setFormData(prev => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(amenityId)
        ? prev.amenityIds.filter(id => id !== amenityId)
        : [...prev.amenityIds, amenityId]
    }));
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
        <p>Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="venue-management-enhanced">
      <div className="venue-management__header">
        <h2 className="venue-management__title">Venue Management</h2>
        <div className="venue-management__actions">
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
              resetForm();
              setShowForm(true);
              setEditingVenue(null);
            }}
          >
            <Plus size={16} />
            Add Venue
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
      <div className="venue-management__filters">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search venues..."
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
            <option value="all">All Venues</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Venues List */}
      <div className="venue-management__list">
        {filteredAndSortedVenues.length === 0 ? (
          <div className="admin-empty-state">
            <MapPin size={48} />
            <h3>No venues found</h3>
            <p>Create your first venue to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="venue-grid">
            {filteredAndSortedVenues.map((venue) => (
              <motion.div
                key={venue.id}
                className="venue-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="venue-card__header">
                  <div className="venue-card__title">
                    <h3>{venue.name}</h3>
                    {venue.featured && <Star size={16} className="venue-card__featured" />}
                  </div>
                  <div className="venue-card__status">
                    <button
                      className={`status-toggle ${venue.isActive ? 'active' : ''}`}
                      onClick={() => toggleVenueStatus(venue)}
                    >
                      {venue.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    </button>
                  </div>
                </div>

                <div className="venue-card__content">
                  {venue.description && (
                    <p className="venue-card__description">{venue.description}</p>
                  )}
                  
                  <div className="venue-card__location">
                    <MapPin size={14} />
                    <span>
                      {[venue.city, venue.country].filter(Boolean).join(', ') || 'No location set'}
                    </span>
                  </div>

                  <div className="venue-card__stats">
                    <div className="venue-stat">
                      <Users size={14} />
                      <span>Capacity: {venue.capacity}</span>
                    </div>
                    {venue.maxGroupSize && (
                      <div className="venue-stat">
                        <Users size={14} />
                        <span>Max Group: {venue.maxGroupSize}</span>
                      </div>
                    )}
                    {venue.teachers && (
                      <div className="venue-stat venue-stat--clickable" onClick={() => navigateToTeachers(venue.id)}>
                        <Users size={14} />
                        <span>Teachers: {venue.teachers.length}</span>
                        <ExternalLink size={12} />
                      </div>
                    )}
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="venue-card__amenities">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="amenity-tag">
                          {amenity.amenity.name}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="amenity-tag amenity-tag--more">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="venue-card__actions">
                  <button
                    className="admin-button admin-button--secondary admin-button--sm"
                    onClick={() => handleEdit(venue)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="admin-button admin-button--danger admin-button--sm"
                    onClick={() => handleDelete(venue.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="venue-table-container">
            <table className="venue-table">
              <thead>
                <tr>
                  <th className="venue-table__header" onClick={() => handleSort('name')}>
                    <div className="venue-table__header-content">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="venue-table__header" onClick={() => handleSort('city')}>
                    <div className="venue-table__header-content">
                      City
                      {getSortIcon('city')}
                    </div>
                  </th>
                  <th className="venue-table__header" onClick={() => handleSort('capacity')}>
                    <div className="venue-table__header-content">
                      Capacity
                      {getSortIcon('capacity')}
                    </div>
                  </th>
                  <th className="venue-table__header" onClick={() => handleSort('teachers')}>
                    <div className="venue-table__header-content">
                      Active Teachers
                      {getSortIcon('teachers')}
                    </div>
                  </th>
                  <th className="venue-table__header" onClick={() => handleSort('schedules')}>
                    <div className="venue-table__header-content">
                      Total Schedules
                      {getSortIcon('schedules')}
                    </div>
                  </th>
                  <th className="venue-table__header" onClick={() => handleSort('status')}>
                    <div className="venue-table__header-content">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="venue-table__header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedVenues.map((venue) => (
                  <tr key={venue.id} className="venue-table__row">
                    <td className="venue-table__cell">
                      <div className="venue-table__name">
                        <span className="venue-table__name-text">{venue.name}</span>
                        {venue.featured && <Star size={14} className="venue-table__featured" />}
                      </div>
                    </td>
                    <td className="venue-table__cell">
                      <div className="venue-table__location">
                        <MapPin size={14} />
                        <span>{venue.city || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="venue-table__cell">
                      <span className="venue-table__capacity">{venue.capacity}</span>
                    </td>
                    <td className="venue-table__cell">
                      <button
                        className="venue-table__link"
                        onClick={() => navigateToTeachers(venue.id)}
                      >
                        <Users size={14} />
                        {venue.teachers?.length || 0}
                        <ExternalLink size={12} />
                      </button>
                    </td>
                    <td className="venue-table__cell">
                      <span className="venue-table__schedules">
                        {venue.scheduleTemplates?.length || 0}
                      </span>
                    </td>
                    <td className="venue-table__cell">
                      <button
                        className={`status-toggle ${venue.isActive ? 'active' : ''}`}
                        onClick={() => toggleVenueStatus(venue)}
                      >
                        {venue.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                    <td className="venue-table__cell">
                      <div className="venue-table__actions">
                        <button
                          className="admin-button admin-button--secondary admin-button--sm"
                          onClick={() => handleEdit(venue)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="admin-button admin-button--danger admin-button--sm"
                          onClick={() => handleDelete(venue.id)}
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

      {/* Slide-over Form Panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="admin-slide-over-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowForm(false);
              setEditingVenue(null);
              resetForm();
            }}
          >
            <motion.div
              className="admin-slide-over"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-slide-over__header">
                <h3>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
                <button
                  className="admin-slide-over__close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVenue(null);
                    resetForm();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-slide-over__content">
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="admin-form-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Capacity *</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      className="admin-form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Max Group Size</label>
                    <input
                      type="number"
                      value={formData.maxGroupSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxGroupSize: parseInt(e.target.value) || 0 }))}
                      className="admin-form-input"
                      min="0"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                      className="admin-form-input"
                      min="0"
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="admin-form-textarea"
                      rows={3}
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Address</label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="admin-form-textarea"
                      rows={2}
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Amenities</label>
                    <div className="checkbox-grid">
                      {amenities.map((amenity) => (
                        <label key={amenity.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.amenityIds.includes(amenity.id)}
                            onChange={() => toggleAmenity(amenity.id)}
                          />
                          <span className="checkbox-label">
                            {amenity.icon && <span className="amenity-icon">{amenity.icon}</span>}
                            {amenity.name}
                            {amenity.description && (
                              <span className="checkbox-description">{amenity.description}</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <div className="admin-form-checkboxes">
                      <label className="admin-form-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        />
                        <span className="admin-form-checkbox__label">Active</span>
                      </label>
                      <label className="admin-form-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        />
                        <span className="admin-form-checkbox__label">Featured</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-slide-over__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingVenue(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button--primary"
                  >
                    {editingVenue ? 'Update Venue' : 'Create Venue'}
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
