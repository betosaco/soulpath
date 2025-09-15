'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck, 
  Mail, 
  Phone,
  Star,
  Check,
  X,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  shortBio?: string;
  experience: number;
  avatarUrl?: string;
  coverImage?: string;
  galleryImages: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  teachingStyle?: string;
  philosophy?: string;
  approach?: string;
  maxStudents?: number;
  minStudents?: number;
  preferredTimes: string[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  venueId?: number;
  createdAt: string;
  updatedAt: string;
  venue?: {
    id: number;
    name: string;
    city?: string;
    country?: string;
  };
  specialties?: Array<{
    id: number;
    specialty: {
      id: number;
      name: string;
      description?: string;
      category?: string;
    };
  }>;
  languages?: Array<{
    id: number;
    language: {
      id: number;
      name: string;
      code: string;
      nativeName?: string;
    };
  }>;
  certifications?: Array<{
    id: number;
    name: string;
    issuingOrganization: string;
    issueDate?: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    isVerified: boolean;
    displayOrder: number;
  }>;
  testimonials?: Array<{
    id: number;
    text: string;
    authorName: string;
    authorTitle?: string;
    authorImage?: string;
    rating?: number;
    isVerified: boolean;
  }>;
  faqs?: Array<{
    id: number;
    question: string;
    answer: string;
    category?: string;
  }>;
  teacherSchedules?: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    venue: {
      id: number;
      name: string;
      city?: string;
    };
  }>;
}

interface TeacherFormData {
  name: string;
  email: string;
  phone: string;
  bio: string;
  shortBio: string;
  experience: number;
  avatarUrl: string;
  coverImage: string;
  galleryImages: string[];
  videoUrl: string;
  thumbnailUrl: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  teachingStyle: string;
  philosophy: string;
  approach: string;
  maxStudents: number;
  minStudents: number;
  preferredTimes: string[];
  isActive: boolean;
  displayOrder: number;
  featured: boolean;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  venueId: number;
  specialtyIds: number[];
  languageIds: number[];
}

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [venues, setVenues] = useState<Array<{ id: number; name: string; city?: string }>>([]);
  const [specialties, setSpecialties] = useState<Array<{ id: number; name: string; description?: string; category?: string }>>([]);
  const [languages, setLanguages] = useState<Array<{ id: number; name: string; code: string; nativeName?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [filterVenue, setFilterVenue] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    shortBio: '',
    experience: 0,
    avatarUrl: '',
    coverImage: '',
    galleryImages: [],
    videoUrl: '',
    thumbnailUrl: '',
    website: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    teachingStyle: '',
    philosophy: '',
    approach: '',
    maxStudents: 10,
    minStudents: 1,
    preferredTimes: [],
    isActive: true,
    displayOrder: 0,
    featured: false,
    slug: '',
    metaTitle: '',
    metaDescription: '',
    venueId: 0,
    specialtyIds: [],
    languageIds: []
  });

  // Fetch teachers and related data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/teachers?include=all');
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
      const data = await response.json();
      
      if (data.success) {
        setVenues(data.venues);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch('/api/admin/specialties');
      const data = await response.json();
      
      if (data.success) {
        setSpecialties(data.specialties);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages');
      const data = await response.json();
      
      if (data.success) {
        setLanguages(data.languages);
      }
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

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialties?.some(s => s.specialty.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesActiveFilter = filterActive === 'all' || 
                               (filterActive === 'active' && teacher.isActive) ||
                               (filterActive === 'inactive' && !teacher.isActive);
    
    const matchesVenueFilter = filterVenue === 'all' || 
                              (filterVenue === 'unassigned' && !teacher.venueId) ||
                              teacher.venueId?.toString() === filterVenue;
    
    return matchesSearch && matchesActiveFilter && matchesVenueFilter;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTeacher ? `/api/admin/teachers?id=${editingTeacher.id}` : '/api/admin/teachers';
      const method = editingTeacher ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        venueId: formData.venueId || null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success || response.ok) {
        await fetchTeachers();
        resetForm();
        setShowForm(false);
        setEditingTeacher(null);
      } else {
        setError(data.message || 'Failed to save teacher');
      }
    } catch (err) {
      setError('Failed to save teacher');
      console.error('Error saving teacher:', err);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    
    try {
      const response = await fetch(`/api/admin/teachers?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchTeachers();
      } else {
        setError(data.message || 'Failed to delete teacher');
      }
    } catch (err) {
      setError('Failed to delete teacher');
      console.error('Error deleting teacher:', err);
    }
  };

  // Handle edit
  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email || '',
      phone: teacher.phone || '',
      bio: teacher.bio || '',
      shortBio: teacher.shortBio || '',
      experience: teacher.experience,
      avatarUrl: teacher.avatarUrl || '',
      coverImage: teacher.coverImage || '',
      galleryImages: teacher.galleryImages || [],
      videoUrl: teacher.videoUrl || '',
      thumbnailUrl: teacher.thumbnailUrl || '',
      website: teacher.website || '',
      instagram: teacher.instagram || '',
      facebook: teacher.facebook || '',
      linkedin: teacher.linkedin || '',
      teachingStyle: teacher.teachingStyle || '',
      philosophy: teacher.philosophy || '',
      approach: teacher.approach || '',
      maxStudents: teacher.maxStudents || 10,
      minStudents: teacher.minStudents || 1,
      preferredTimes: teacher.preferredTimes || [],
      isActive: teacher.isActive,
      displayOrder: teacher.displayOrder,
      featured: teacher.featured,
      slug: teacher.slug || '',
      metaTitle: teacher.metaTitle || '',
      metaDescription: teacher.metaDescription || '',
      venueId: teacher.venueId || 0,
      specialtyIds: teacher.specialties?.map(s => s.specialty.id) || [],
      languageIds: teacher.languages?.map(l => l.language.id) || []
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      shortBio: '',
      experience: 0,
      avatarUrl: '',
      coverImage: '',
      galleryImages: [],
      videoUrl: '',
      thumbnailUrl: '',
      website: '',
      instagram: '',
      facebook: '',
      linkedin: '',
      teachingStyle: '',
      philosophy: '',
      approach: '',
      maxStudents: 10,
      minStudents: 1,
      preferredTimes: [],
      isActive: true,
      displayOrder: 0,
      featured: false,
      slug: '',
      metaTitle: '',
      metaDescription: '',
      venueId: 0,
      specialtyIds: [],
      languageIds: []
    });
  };

  // Toggle specialty
  const toggleSpecialty = (specialtyId: number) => {
    setFormData(prev => ({
      ...prev,
      specialtyIds: prev.specialtyIds.includes(specialtyId)
        ? prev.specialtyIds.filter(id => id !== specialtyId)
        : [...prev.specialtyIds, specialtyId]
    }));
  };

  // Toggle language
  const toggleLanguage = (languageId: number) => {
    setFormData(prev => ({
      ...prev,
      languageIds: prev.languageIds.includes(languageId)
        ? prev.languageIds.filter(id => id !== languageId)
        : [...prev.languageIds, languageId]
    }));
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
    <div className="teacher-management">
      <div className="teacher-management__header">
        <h2 className="teacher-management__title">Teacher Management</h2>
        <button
          className="admin-button admin-button--primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
            setEditingTeacher(null);
          }}
        >
          <Plus size={16} />
          Add Teacher
        </button>
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

      {/* Teachers List */}
      <div className="teacher-management__list">
        {filteredTeachers.length === 0 ? (
          <div className="admin-empty-state">
            <UserCheck size={48} />
            <h3>No teachers found</h3>
            <p>Create your first teacher to get started</p>
          </div>
        ) : (
          <div className="teacher-grid">
            {filteredTeachers.map((teacher) => (
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
                  
                  <div className="teacher-card__contact">
                    {teacher.email && (
                      <div className="teacher-contact">
                        <Mail size={14} />
                        <span>{teacher.email}</span>
                      </div>
                    )}
                    {teacher.phone && (
                      <div className="teacher-contact">
                        <Phone size={14} />
                        <span>{teacher.phone}</span>
                      </div>
                    )}
                  </div>

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
                      <span className="languages-list">
                        {teacher.languages.map(l => l.language.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="teacher-card__actions">
                  <button
                    className="admin-button admin-button--secondary admin-button--sm"
                    onClick={() => handleEdit(teacher)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    className="admin-button admin-button--danger admin-button--sm"
                    onClick={() => handleDelete(teacher.id)}
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
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowForm(false);
              setEditingTeacher(null);
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
                <h3>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h3>
                <button
                  className="admin-modal__close"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTeacher(null);
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
                    <label className="admin-form-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      className="admin-form-input"
                      min="0"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Venue</label>
                    <select
                      value={formData.venueId}
                      onChange={(e) => setFormData(prev => ({ ...prev, venueId: parseInt(e.target.value) || 0 }))}
                      className="admin-form-select"
                    >
                      <option value={0}>No venue assigned</option>
                      {venues.map(venue => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name}
                        </option>
                      ))}
                    </select>
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
                    <label className="admin-form-label">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="admin-form-textarea"
                      rows={3}
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Avatar URL</label>
                    <input
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      className="admin-form-input"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Specialties</label>
                    <div className="checkbox-grid">
                      {specialties.map((specialty) => (
                        <label key={specialty.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.specialtyIds.includes(specialty.id)}
                            onChange={() => toggleSpecialty(specialty.id)}
                          />
                          <span className="checkbox-label">
                            {specialty.name}
                            {specialty.description && (
                              <span className="checkbox-description">{specialty.description}</span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">Languages</label>
                    <div className="checkbox-grid">
                      {languages.map((language) => (
                        <label key={language.id} className="checkbox-item">
                          <input
                            type="checkbox"
                            checked={formData.languageIds.includes(language.id)}
                            onChange={() => toggleLanguage(language.id)}
                          />
                          <span className="checkbox-label">
                            {language.name} ({language.code})
                            {language.nativeName && (
                              <span className="checkbox-description">{language.nativeName}</span>
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

                <div className="admin-modal__actions">
                  <button
                    type="button"
                    className="admin-button admin-button--secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTeacher(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button--primary"
                  >
                    {editingTeacher ? 'Update Teacher' : 'Create Teacher'}
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
