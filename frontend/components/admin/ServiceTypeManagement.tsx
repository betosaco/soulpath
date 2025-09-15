'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Settings, 
  Clock,
  Users,
  Star,
  Check,
  X,
  Palette,
  Image,
  BookOpen,
  GraduationCap,
  Wrench
} from 'lucide-react';

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  category: 'class' | 'workshop' | 'training_program';
  duration: number;
  maxParticipants?: number;
  minParticipants: number;
  requirements: string[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  packageServices?: Array<{
    id: number;
    sessionsIncluded: number;
    isActive: boolean;
    packageDefinition: {
      id: number;
      name: string;
      packageType: string;
    };
  }>;
  teacherSchedules?: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    teacher: {
      id: number;
      name: string;
      specialties: string[];
    };
    venue: {
      id: number;
      name: string;
      city?: string;
    };
  }>;
}

interface ServiceTypeFormData {
  name: string;
  description: string;
  category: 'class' | 'workshop' | 'training_program';
  duration: number;
  maxParticipants: number;
  minParticipants: number;
  requirements: string[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  color: string;
  icon: string;
}

const CATEGORY_ICONS = {
  class: BookOpen,
  workshop: Wrench,
  training_program: GraduationCap
};

const CATEGORY_COLORS = {
  class: '#4CAF50',
  workshop: '#FF9800',
  training_program: '#9C27B0'
};

const PREDEFINED_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336',
  '#00BCD4', '#8BC34A', '#FFC107', '#E91E63', '#3F51B5',
  '#795548', '#607D8B', '#FF5722', '#673AB7', '#009688'
];

const PREDEFINED_ICONS = [
  'yoga', 'meditation', 'breath', 'heart', 'crystal',
  'nutrition', 'graduation-cap', 'book', 'award', 'workshop',
  'users', 'clock', 'star', 'zap', 'shield'
];

export function ServiceTypeManagement() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [formData, setFormData] = useState<ServiceTypeFormData>({
    name: '',
    description: '',
    category: 'class',
    duration: 60,
    maxParticipants: 0,
    minParticipants: 1,
    requirements: [],
    isActive: true,
    displayOrder: 0,
    featured: false,
    color: '#4CAF50',
    icon: 'yoga'
  });
  const [newRequirement, setNewRequirement] = useState('');

  // Fetch service types
  const fetchServiceTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/service-types?include=all');
      const data = await response.json();
      
      if (data.success) {
        setServiceTypes(data.data.serviceTypes);
      } else {
        setError(data.message || 'Failed to fetch service types');
      }
    } catch (err) {
      setError('Failed to fetch service types');
      console.error('Error fetching service types:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  // Filter service types
  const filteredServiceTypes = serviceTypes.filter(serviceType => {
    const matchesSearch = serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serviceType.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         serviceType.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || serviceType.category === filterCategory;
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && serviceType.isActive) ||
                         (filterActive === 'inactive' && !serviceType.isActive);
    
    return matchesSearch && matchesCategory && matchesActive;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingServiceType ? '/api/admin/service-types' : '/api/admin/service-types';
      const method = editingServiceType ? 'PUT' : 'POST';
      
      const payload = editingServiceType 
        ? { id: editingServiceType.id, ...formData, maxParticipants: formData.maxParticipants || null }
        : { ...formData, maxParticipants: formData.maxParticipants || null };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchServiceTypes();
        resetForm();
        setShowForm(false);
        setEditingServiceType(null);
      } else {
        setError(data.message || 'Failed to save service type');
      }
    } catch (err) {
      setError('Failed to save service type');
      console.error('Error saving service type:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service type?')) return;
    
    try {
      const response = await fetch(`/api/admin/service-types?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchServiceTypes();
      } else {
        setError(data.message || 'Failed to delete service type');
      }
    } catch (err) {
      setError('Failed to delete service type');
      console.error('Error deleting service type:', err);
    }
  };

  // Handle edit
  const handleEdit = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormData({
      name: serviceType.name,
      description: serviceType.description || '',
      category: serviceType.category,
      duration: serviceType.duration,
      maxParticipants: serviceType.maxParticipants || 0,
      minParticipants: serviceType.minParticipants,
      requirements: serviceType.requirements,
      isActive: serviceType.isActive,
      displayOrder: serviceType.displayOrder,
      featured: serviceType.featured,
      color: serviceType.color || '#4CAF50',
      icon: serviceType.icon || 'yoga'
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'class',
      duration: 60,
      maxParticipants: 0,
      minParticipants: 1,
      requirements: [],
      isActive: true,
      displayOrder: 0,
      featured: false,
      color: '#4CAF50',
      icon: 'yoga'
    });
    setNewRequirement('');
  };

  // Add requirement
  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  // Remove requirement
  const removeRequirement = (requirement: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p>Loading service types...</p>
      </div>
    );
  }

  return (
    <div className="service-type-management">
      <div className="service-type-management__header">
        <h2 className="service-type-management__title">Service Type Management</h2>
        <button
          className="admin-button admin-button--primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingServiceType(null);
          }}
        >
          <Plus size={16} />
          Add Service Type
        </button>
      </div>

      {error && (
        <div className="admin-alert admin-alert--error">
          <X size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="service-type-management__filters">
        <div className="admin-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search service types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search__input"
          />
        </div>
        
        <div className="admin-filter">
          <Settings size={16} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Categories</option>
            <option value="class">Classes</option>
            <option value="workshop">Workshops</option>
            <option value="training_program">Training Programs</option>
          </select>
        </div>

        <div className="admin-filter">
          <Filter size={16} />
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="admin-filter__select"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Service Types List */}
      <div className="service-type-management__list">
        {filteredServiceTypes.length === 0 ? (
          <div className="admin-empty-state">
            <Settings size={48} />
            <h3>No service types found</h3>
            <p>Create your first service type to get started</p>
          </div>
        ) : (
          <div className="service-type-grid">
            {filteredServiceTypes.map((serviceType) => {
              const CategoryIcon = CATEGORY_ICONS[serviceType.category];
              return (
                <motion.div
                  key={serviceType.id}
                  className="service-type-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    borderLeftColor: serviceType.color || CATEGORY_COLORS[serviceType.category],
                    borderLeftWidth: '4px'
                  }}
                >
                  <div className="service-type-card__header">
                    <div className="service-type-card__icon" style={{ color: serviceType.color || CATEGORY_COLORS[serviceType.category] }}>
                      <CategoryIcon size={24} />
                    </div>
                    <div className="service-type-card__info">
                      <div className="service-type-card__title">
                        <h3>{serviceType.name}</h3>
                        {serviceType.featured && <Star size={16} className="service-type-card__featured" />}
                      </div>
                      <div className="service-type-card__category">
                        <span className="category-badge" style={{ 
                          backgroundColor: serviceType.color || CATEGORY_COLORS[serviceType.category],
                          color: 'white'
                        }}>
                          {serviceType.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="service-type-card__status">
                      {serviceType.isActive ? (
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

                  <div className="service-type-card__content">
                    {serviceType.description && (
                      <p className="service-type-card__description">{serviceType.description}</p>
                    )}
                    
                    <div className="service-type-card__stats">
                      <div className="service-stat">
                        <Clock size={14} />
                        <span>{formatDuration(serviceType.duration)}</span>
                      </div>
                      <div className="service-stat">
                        <Users size={14} />
                        <span>
                          {serviceType.minParticipants}
                          {serviceType.maxParticipants && `-${serviceType.maxParticipants}`}
                        </span>
                      </div>
                      {serviceType.packageServices && (
                        <div className="service-stat">
                          <Settings size={14} />
                          <span>{serviceType.packageServices.length} packages</span>
                        </div>
                      )}
                      {serviceType.teacherSchedules && (
                        <div className="service-stat">
                          <Clock size={14} />
                          <span>{serviceType.teacherSchedules.length} schedules</span>
                        </div>
                      )}
                    </div>

                    {serviceType.requirements.length > 0 && (
                      <div className="service-type-card__requirements">
                        {serviceType.requirements.slice(0, 3).map((requirement, index) => (
                          <span key={index} className="requirement-tag">
                            {requirement}
                          </span>
                        ))}
                        {serviceType.requirements.length > 3 && (
                          <span className="requirement-tag requirement-tag--more">
                            +{serviceType.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="service-type-card__actions">
                    <button
                      className="admin-button admin-button--secondary admin-button--sm"
                      onClick={() => handleEdit(serviceType)}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="admin-button admin-button--danger admin-button--sm"
                      onClick={() => handleDelete(serviceType.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </motion.div>
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
              setEditingServiceType(null);
              resetForm();
            }}
          >
            <motion.div
              className="admin-modal admin-modal--large"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal__header">
                <h3>{editingServiceType ? 'Edit Service Type' : 'Add New Service Type'}</h3>
                <button
                  className="admin-modal__close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingServiceType(null);
                    resetForm();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-modal__content">
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
                    <label className="admin-form-label">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="admin-form-select"
                      required
                    >
                      <option value="class">Class</option>
                      <option value="workshop">Workshop</option>
                      <option value="training_program">Training Program</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Duration (minutes) *</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="admin-form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Min Participants *</label>
                    <input
                      type="number"
                      value={formData.minParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, minParticipants: parseInt(e.target.value) || 1 }))}
                      className="admin-form-input"
                      min="1"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Max Participants</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
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

                  <div className="admin-form-group">
                    <label className="admin-form-label">Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="color-picker__input"
                      />
                      <div className="color-picker__presets">
                        {PREDEFINED_COLORS.map(color => (
                          <button
                            key={color}
                            type="button"
                            className={`color-picker__preset ${formData.color === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Icon</label>
                    <div className="icon-picker">
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="admin-form-input"
                        placeholder="Icon name"
                      />
                      <div className="icon-picker__presets">
                        {PREDEFINED_ICONS.map(icon => (
                          <button
                            key={icon}
                            type="button"
                            className={`icon-picker__preset ${formData.icon === icon ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Requirements</label>
                    <div className="requirements-input">
                      <div className="requirements-input__add">
                        <input
                          type="text"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="Add requirement..."
                          className="admin-form-input"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                        />
                        <button
                          type="button"
                          onClick={addRequirement}
                          className="admin-button admin-button--secondary admin-button--sm"
                        >
                          Add
                        </button>
                      </div>
                      <div className="requirements-list">
                        {formData.requirements.map((requirement, index) => (
                          <span key={index} className="requirement-tag requirement-tag--editable">
                            {requirement}
                            <button
                              type="button"
                              onClick={() => removeRequirement(requirement)}
                              className="requirement-tag__remove"
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

                <div className="admin-modal__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingServiceType(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button--primary"
                  >
                    {editingServiceType ? 'Update Service Type' : 'Create Service Type'}
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
