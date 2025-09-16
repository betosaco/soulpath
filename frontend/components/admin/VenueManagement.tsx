'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import '@/styles/unified-schedule-management.css';
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
  Check,
  X,
  Building,
  Settings
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
      displayOrder?: number;
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
  serviceIds: number[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
}

export function VenueManagement() {
  const { user } = useAuth();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [amenities, setAmenities] = useState<Array<{ id: number; name: string; description?: string; icon?: string; category?: string; displayOrder?: number }>>([]);
  const [services, setServices] = useState<Array<{ id: number; name: string; description?: string; category: string; difficulty?: string; isActive: boolean }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'amenities' | 'services'>('basic');
  

  const [formData, setFormData] = useState<VenueFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    capacity: 10,
    maxGroupSize: 0,
    amenityIds: [],
    serviceIds: [],
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

      
        console.error('❌ VenueManagement: Non-JSON response received:', {

      
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

        console.error('❌ VenueManagement: Non-JSON response received:', {

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

  const fetchServices = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      const response = await fetch('/api/admin/service-types', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
      }

      const data = await response.json();
      setServices(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, [user?.access_token]);

  useEffect(() => {
    if (user?.access_token) {
      fetchVenues();
      fetchAmenities();
      fetchServices();
    }
  }, [user?.access_token, fetchVenues, fetchAmenities, fetchServices]);


  // Filter venues
  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.country?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && venue.isActive) ||
                         (filterActive === 'inactive' && !venue.isActive);
    
    return matchesSearch && matchesFilter;
  });

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


        console.error('❌ VenueManagement: Non-JSON response received:', {


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

      
        console.error('❌ VenueManagement: Non-JSON response received:', {

      
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
      serviceIds: [], // TODO: Add venue services when available from API
      isActive: venue.isActive,
      displayOrder: venue.displayOrder,
      featured: venue.featured
    });
    setShowForm(true);
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
      serviceIds: [],
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

  // Toggle service
  const toggleService = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
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
    <div className="venue-management">
      <div className="venue-management__header">
        <h2 className="venue-management__title">Venue Management</h2>
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
        {filteredVenues.length === 0 ? (
          <div className="admin-empty-state">
            <MapPin size={48} />
            <h3>No venues found</h3>
            <p>Create your first venue to get started</p>
          </div>
        ) : (
          <div className="venue-grid">
            {filteredVenues.map((venue) => (
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
                    {venue.isActive ? (
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
                      <div className="venue-stat">
                        <Users size={14} />
                        <span>Teachers: {venue.teachers.length}</span>
                      </div>
                    )}
                  </div>

                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="venue-card__amenities">
                      {venue.amenities
                        .sort((a, b) => {
                          // Sort by displayOrder first, then by name
                          if (a.amenity.displayOrder !== undefined && b.amenity.displayOrder !== undefined) {
                            return a.amenity.displayOrder - b.amenity.displayOrder;
                          }
                          return a.amenity.name.localeCompare(b.amenity.name);
                        })
                        .slice(0, 3)
                        .map((amenity, index) => (
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
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="unified-schedule-management__modal"
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
              className="unified-schedule-management__modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="unified-schedule-management__modal-header">
                <h3 className="unified-schedule-management__modal-title">{editingVenue ? 'Edit Venue' : 'Add New Venue'}</h3>
                <button
                  className="unified-schedule-management__modal-close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingVenue(null);
                    resetForm();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="unified-schedule-management__form">
                {/* Tab Navigation */}
                <div className="venue-tabs">
                  <button
                    type="button"
                    className={`venue-tab ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                  >
                    <Building className="w-4 h-4" />
                    Basic Info
                  </button>
                  <button
                    type="button"
                    className={`venue-tab ${activeTab === 'amenities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('amenities')}
                  >
                    <Settings className="w-4 h-4" />
                    Amenities
                  </button>
                  <button
                    type="button"
                    className={`venue-tab ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                  >
                    <Users className="w-4 h-4" />
                    Services
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'basic' && (
                  <div className="venue-form-section">
                  <h4 className="venue-form-section__title">Basic Information</h4>
                  <div className="unified-schedule-management__form-row">
                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="unified-schedule-management__form-input"
                        required
                      />
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="unified-schedule-management__form-input"
                      />
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                        className="unified-schedule-management__form-input"
                      />
                    </div>
                  </div>

                  <div className="unified-schedule-management__form-row">
                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Capacity *</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                        className="unified-schedule-management__form-input"
                        min="1"
                        required
                      />
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Max Group Size</label>
                      <input
                        type="number"
                        value={formData.maxGroupSize}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxGroupSize: parseInt(e.target.value) || 0 }))}
                        className="unified-schedule-management__form-input"
                        min="0"
                      />
                    </div>

                    <div className="unified-schedule-management__form-group">
                      <label className="unified-schedule-management__form-label">Display Order</label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                        className="unified-schedule-management__form-input"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Description and Address Section */}
                  <div className="venue-form-section">
                    <h4 className="venue-form-section__title">Description & Location</h4>
                    <div className="unified-schedule-management__form-group unified-schedule-management__form-group--full">
                      <label className="unified-schedule-management__form-label">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="unified-schedule-management__form-textarea"
                        rows={3}
                        placeholder="Describe the venue, its features, and what makes it special..."
                      />
                    </div>

                    <div className="unified-schedule-management__form-group unified-schedule-management__form-group--full">
                      <label className="unified-schedule-management__form-label">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="unified-schedule-management__form-textarea"
                        rows={2}
                        placeholder="Full address including street, city, state, and postal code..."
                      />
                    </div>
                  </div>
                  </div>                )}

                {activeTab === 'amenities' && (
                  <div className="venue-form-section">
                    <h4 className="venue-form-section__title">Amenities & Features</h4>
                    <div className="unified-schedule-management__form-group unified-schedule-management__form-group--full">
                      <label className="unified-schedule-management__form-label">Available Amenities</label>
                      <div className="amenities-grid">
                        {amenities
                          .sort((a, b) => {
                            // Sort by displayOrder first, then by name
                            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
                              return a.displayOrder - b.displayOrder;
                            }
                            return a.name.localeCompare(b.name);
                          })
                          .map((amenity) => (
                          <label key={amenity.id} className="amenity-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.amenityIds.includes(amenity.id)}
                              onChange={() => toggleAmenity(amenity.id)}
                              className="amenity-checkbox__input"
                            />
                            <div className="amenity-checkbox__content">
                              <div className="amenity-checkbox__icon">
                                {(() => {
                                  const iconMap: { [key: string]: string } = {
                                    'wifi': '📶', 'parking': '🅿️', 'air conditioning': '❄️', 'heating': '🔥',
                                    'kitchen': '🍳', 'bathroom': '🚿', 'shower': '🚿', 'toilet': '🚽',
                                    'bedroom': '🛏️', 'living room': '🛋️', 'dining room': '🍽️', 'garden': '🌿',
                                    'balcony': '🌅', 'terrace': '🏞️', 'pool': '🏊', 'gym': '💪', 'spa': '🧘',
                                    'sauna': '🧖', 'jacuzzi': '🛁', 'tv': '📺', 'internet': '🌐', 'phone': '📞',
                                    'security': '🔒', 'elevator': '🛗', 'stairs': '🪜', 'fireplace': '🔥',
                                    'workspace': '💻', 'office': '🏢', 'meeting room': '👥', 'conference room': '🎤',
                                    'library': '📚', 'music room': '🎵', 'art studio': '🎨', 'yoga room': '🧘',
                                    'meditation room': '🧘‍♀️', 'storage': '📦', 'laundry': '🧺', 'cleaning': '🧹',
                                    'maintenance': '🔧', 'accessibility': '♿', 'pet friendly': '🐕', 'smoking': '🚬',
                                    'non-smoking': '🚭', 'quiet': '🤫', 'private': '🔐', 'shared': '🤝',
                                    'outdoor': '🌳', 'indoor': '🏠', 'rooftop': '🏗️', 'basement': '⬇️'
                                  };
                                  
                                  if (amenity.icon && (amenity.icon.startsWith('http') || amenity.icon.startsWith('/'))) {
                                    return (
                                      <Image 
                                        src={amenity.icon} 
                                        alt={amenity.name} 
                                        width={20} 
                                        height={20} 
                                        className="amenity-icon-image" 
                                      />
                                    );
                                  }
                                  
                                  if (amenity.icon && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(amenity.icon)) {
                                    return <span className="amenity-icon">{amenity.icon}</span>;
                                  }
                                  
                                  const lowerName = amenity.name.toLowerCase();
                                  const icon = iconMap[lowerName] || iconMap[amenity.name] || '🏢';
                                  return <span className="amenity-icon">{icon}</span>;
                                })()}
                              </div>
                              <div className="amenity-checkbox__text">
                                <span className="amenity-checkbox__name">{amenity.name}</span>
                                {amenity.description && (
                                  <span className="amenity-checkbox__description">{amenity.description}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="venue-form-section">
                    <h4 className="venue-form-section__title">Associated Services</h4>
                    <div className="unified-schedule-management__form-group unified-schedule-management__form-group--full">
                      <label className="unified-schedule-management__form-label">Available Services</label>
                      <div className="services-grid">
                        {(Array.isArray(services) ? services : []).filter(service => service.isActive).map((service) => (
                          <label key={service.id} className="service-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.serviceIds.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              className="service-checkbox__input"
                            />
                            <div className="service-checkbox__content">
                              <div className="service-checkbox__text">
                                <span className="service-checkbox__name">{service.name}</span>
                                <span className="service-checkbox__category">{service.category}</span>
                                {service.description && (
                                  <span className="service-checkbox__description">{service.description}</span>
                                )}
                                {service.difficulty && (
                                  <span className="service-checkbox__difficulty">Difficulty: {service.difficulty}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Section - Always visible */}
                <div className="venue-form-section">
                  <h4 className="venue-form-section__title">Status & Settings</h4>
                  <div className="unified-schedule-management__form-group unified-schedule-management__form-group--full">
                    <div className="status-checkboxes">
                      <label className="status-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="status-checkbox__input"
                        />
                        <div className="status-checkbox__content">
                          <span className="status-checkbox__label">Active</span>
                          <span className="status-checkbox__description">Make this venue available for bookings</span>
                        </div>
                      </label>
                      <label className="status-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="status-checkbox__input"
                        />
                        <div className="status-checkbox__content">
                          <span className="status-checkbox__label">Featured</span>
                          <span className="status-checkbox__description">Highlight this venue in listings</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="unified-schedule-management__form-actions">
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
