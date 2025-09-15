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
  BookOpen,
  GraduationCap,
  Wrench,
  Grid3X3,
  Table,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  ExternalLink
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
  price?: number;
  currencyId?: number;
  currency?: {
    id: number;
    code: string;
    name: string;
    symbol: string;
  };
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

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'category' | 'duration' | 'packages' | 'schedules' | 'status';
type SortDirection = 'asc' | 'desc';

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

export function ServiceTypeManagementEnhanced() {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showQuickView, setShowQuickView] = useState<ServiceType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);

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

  // Filter and sort service types
  const filteredAndSortedServiceTypes = serviceTypes
    .filter(serviceType => {
      const matchesSearch = serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           serviceType.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           serviceType.requirements.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === 'all' || serviceType.category === filterCategory;
      const matchesActive = filterActive === 'all' || 
                           (filterActive === 'active' && serviceType.isActive) ||
                           (filterActive === 'inactive' && !serviceType.isActive);
      
      return matchesSearch && matchesCategory && matchesActive;
    })
    .sort((a, b) => {
      let aValue: string | number | boolean, bValue: string | number | boolean;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        case 'packages':
          aValue = a.packageServices?.length || 0;
          bValue = b.packageServices?.length || 0;
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

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
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
        <p>Loading service types...</p>
      </div>
    );
  }

  return (
    <div className="service-type-management-enhanced">
      <div className="service-type-management__header">
        <h2 className="service-type-management__title">Service Type Management</h2>
        <div className="service-type-management__actions">
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
              setEditingServiceType(null);
            }}
          >
            <Plus size={16} />
            Add Service Type
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
        {filteredAndSortedServiceTypes.length === 0 ? (
          <div className="admin-empty-state">
            <Settings size={48} />
            <h3>No service types found</h3>
            <p>Create your first service type to get started</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="service-type-grid">
            {filteredAndSortedServiceTypes.map((serviceType) => {
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
                      onClick={() => {
                        setEditingServiceType(serviceType);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      className="admin-button admin-button--secondary admin-button--sm"
                      onClick={() => setShowQuickView(serviceType)}
                    >
                      <Eye size={14} />
                      Quick View
                    </button>
                    <button
                      className="admin-button admin-button--danger admin-button--sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this service type?')) {
                          // Handle delete
                        }
                      }}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="service-type-table-container">
            <table className="service-type-table">
              <thead>
                <tr>
                  <th className="service-type-table__header" onClick={() => handleSort('name')}>
                    <div className="service-type-table__header-content">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="service-type-table__header" onClick={() => handleSort('category')}>
                    <div className="service-type-table__header-content">
                      Category
                      {getSortIcon('category')}
                    </div>
                  </th>
                  <th className="service-type-table__header" onClick={() => handleSort('duration')}>
                    <div className="service-type-table__header-content">
                      Duration
                      {getSortIcon('duration')}
                    </div>
                  </th>
                  <th className="service-type-table__header" onClick={() => handleSort('packages')}>
                    <div className="service-type-table__header-content">
                      Associated Packages
                      {getSortIcon('packages')}
                    </div>
                  </th>
                  <th className="service-type-table__header" onClick={() => handleSort('schedules')}>
                    <div className="service-type-table__header-content">
                      Scheduled Teachers
                      {getSortIcon('schedules')}
                    </div>
                  </th>
                  <th className="service-type-table__header" onClick={() => handleSort('status')}>
                    <div className="service-type-table__header-content">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="service-type-table__header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedServiceTypes.map((serviceType) => {
                  const CategoryIcon = CATEGORY_ICONS[serviceType.category];
                  return (
                    <tr key={serviceType.id} className="service-type-table__row">
                      <td className="service-type-table__cell">
                        <div className="service-type-table__name">
                          <div className="service-type-table__icon" style={{ color: serviceType.color || CATEGORY_COLORS[serviceType.category] }}>
                            <CategoryIcon size={16} />
                          </div>
                          <div className="service-type-table__name-info">
                            <span className="service-type-table__name-text">{serviceType.name}</span>
                            {serviceType.featured && <Star size={14} className="service-type-table__featured" />}
                          </div>
                        </div>
                      </td>
                      <td className="service-type-table__cell">
                        <span className="category-badge category-badge--table" style={{ 
                          backgroundColor: serviceType.color || CATEGORY_COLORS[serviceType.category],
                          color: 'white'
                        }}>
                          {serviceType.category.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="service-type-table__cell">
                        <span className="service-type-table__duration">{formatDuration(serviceType.duration)}</span>
                      </td>
                      <td className="service-type-table__cell">
                        <span className="service-type-table__packages">
                          {serviceType.packageServices?.length || 0}
                        </span>
                      </td>
                      <td className="service-type-table__cell">
                        <button
                          className="service-type-table__link"
                          onClick={() => setShowQuickView(serviceType)}
                        >
                          <Users size={14} />
                          {serviceType.teacherSchedules?.length || 0}
                          <ExternalLink size={12} />
                        </button>
                      </td>
                      <td className="service-type-table__cell">
                        <span className={`status-badge ${serviceType.isActive ? 'status-badge--active' : 'status-badge--inactive'}`}>
                          {serviceType.isActive ? (
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
                      <td className="service-type-table__cell">
                        <div className="service-type-table__actions">
                          <button
                            className="admin-button admin-button--secondary admin-button--sm"
                            onClick={() => {
                              setEditingServiceType(serviceType);
                              setShowForm(true);
                            }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="admin-button admin-button--secondary admin-button--sm"
                            onClick={() => setShowQuickView(serviceType)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="admin-button admin-button--danger admin-button--sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this service type?')) {
                                // Handle delete
                              }
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickView(null)}
          >
            <motion.div
              className="admin-modal admin-modal--medium"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-modal__header">
                <h3>Quick View - {showQuickView.name}</h3>
                <button
                  className="admin-modal__close"
                  onClick={() => setShowQuickView(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="admin-modal__content">
                <div className="quick-view__content">
                  <div className="quick-view__info">
                    <div className="quick-view__category">
                      <span className="category-badge" style={{ 
                        backgroundColor: showQuickView.color || CATEGORY_COLORS[showQuickView.category],
                        color: 'white'
                      }}>
                        {showQuickView.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="quick-view__stats">
                      <div className="quick-view__stat">
                        <Clock size={16} />
                        <span>Duration: {formatDuration(showQuickView.duration)}</span>
                      </div>
                      <div className="quick-view__stat">
                        <Users size={16} />
                        <span>Participants: {showQuickView.minParticipants}
                          {showQuickView.maxParticipants && `-${showQuickView.maxParticipants}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {showQuickView.teacherSchedules && showQuickView.teacherSchedules.length > 0 && (
                    <div className="quick-view__teachers">
                      <h4>Scheduled Teachers</h4>
                      <div className="quick-view__teachers-list">
                        {showQuickView.teacherSchedules.map((schedule) => (
                          <div key={schedule.id} className="quick-view__teacher">
                            <div className="quick-view__teacher-info">
                              <span className="quick-view__teacher-name">{schedule.teacher.name}</span>
                              <span className="quick-view__teacher-venue">{schedule.venue.name}</span>
                            </div>
                            <div className="quick-view__schedule-info">
                              <span className="quick-view__schedule-day">{schedule.dayOfWeek}</span>
                              <span className="quick-view__schedule-time">
                                {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showQuickView.packageServices && showQuickView.packageServices.length > 0 && (
                    <div className="quick-view__packages">
                      <h4>Associated Packages</h4>
                      <div className="quick-view__packages-list">
                        {showQuickView.packageServices.map((packageService) => (
                          <div key={packageService.id} className="quick-view__package">
                            <span className="quick-view__package-name">
                              {packageService.packageDefinition.name}
                            </span>
                            <span className="quick-view__package-sessions">
                              {packageService.sessionsIncluded} sessions
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
