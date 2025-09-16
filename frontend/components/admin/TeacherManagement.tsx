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
    serviceType?: {
      id: number;
      name: string;
      category: string;
    };
    level?: string;
    yearsExperience?: number;
    certification?: string;
    certificationDate?: string;
    notes?: string;
    isVerified?: boolean;
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
  serviceTypeIds: number[];
  specialtyIds: number[];
  specialtyDetails: Array<{
    specialtyId: number;
    serviceTypeId?: number;
    level?: string;
    yearsExperience?: number;
    certification?: string;
    certificationDate?: string;
    notes?: string;
    isVerified?: boolean;
  }>;
  languageIds: number[];
}

export function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [venues, setVenues] = useState<Array<{ id: number; name: string; city?: string }>>([]);
  const [serviceTypes, setServiceTypes] = useState<Array<{ id: number; name: string; description?: string; category?: string }>>([]);
  const [specialties, setSpecialties] = useState<Array<{ id: number; name: string; description?: string; category?: string; serviceTypeId?: number }>>([]);
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
    serviceTypeIds: [],
    specialtyIds: [],
    specialtyDetails: [],
    languageIds: []
  });

  // Fetch teachers and related data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/teachers?include=all');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagement: Non-JSON response received:', {

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

        console.error('❌ TeacherManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setVenues(Array.isArray(data.venues) ? data.venues : []);
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/admin/service-types');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setServiceTypes(Array.isArray(data.serviceTypes) ? data.serviceTypes : []);
      }
    } catch (err) {
      console.error('Error fetching service types:', err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await fetch('/api/admin/specialties');
      // Check content type before parsing JSON

      const contentType = response.headers.get('content-type');

      if (!contentType || !contentType.includes('application/json')) {

        const errorText = await response.text();

        console.error('❌ TeacherManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setSpecialties(Array.isArray(data.specialties) ? data.specialties : []);
      }
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

        console.error('❌ TeacherManagement: Non-JSON response received:', {

          status: response.status,

          statusText: response.statusText,

          contentType,

          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')

        });

        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);

      }

      

      const data = await response.json();
      
      if (data.success) {
        setLanguages(Array.isArray(data.languages) ? data.languages : []);
      }
    } catch (err) {
      console.error('Error fetching languages:', err);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchVenues();
    fetchServiceTypes();
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

      // Check content type before parsing JSON


      const contentType = response.headers.get('content-type');


      if (!contentType || !contentType.includes('application/json')) {


        const errorText = await response.text();


        console.error('❌ TeacherManagement: Non-JSON response received:', {


          status: response.status,


          statusText: response.statusText,


          contentType,


          body: errorText.substring(0, 200) + (errorText.length > 200 ? '...' : '')


        });


        throw new Error(`API returned ${response.status} ${response.statusText} instead of JSON`);


      }


      


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
      
      // Check content type before parsing JSON

      
      const contentType = response.headers.get('content-type');

      
      if (!contentType || !contentType.includes('application/json')) {

      
        const errorText = await response.text();

      
        console.error('❌ TeacherManagement: Non-JSON response received:', {

      
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
      serviceTypeIds: teacher.specialties?.map(s => s.serviceType?.id).filter(Boolean) as number[] || [],
      specialtyIds: teacher.specialties?.map(s => s.specialty.id) || [],
      specialtyDetails: teacher.specialties?.map(s => ({
        specialtyId: s.specialty.id,
        serviceTypeId: s.serviceType?.id,
        level: s.level,
        yearsExperience: s.yearsExperience,
        certification: s.certification,
        certificationDate: s.certificationDate,
        notes: s.notes,
        isVerified: s.isVerified
      })) || [],
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
      serviceTypeIds: [],
      specialtyIds: [],
      specialtyDetails: [],
      languageIds: []
    });
  };

  // Toggle service type
  const toggleServiceType = (serviceTypeId: number) => {
    setFormData(prev => ({
      ...prev,
      serviceTypeIds: prev.serviceTypeIds.includes(serviceTypeId)
        ? prev.serviceTypeIds.filter(id => id !== serviceTypeId)
        : [...prev.serviceTypeIds, serviceTypeId]
    }));
  };

  // Toggle specialty
  const toggleSpecialty = (specialtyId: number) => {
    setFormData(prev => ({
      ...prev,
      specialtyIds: prev.specialtyIds.includes(specialtyId)
        ? prev.specialtyIds.filter(id => id !== specialtyId)
        : [...prev.specialtyIds, specialtyId],
      specialtyDetails: prev.specialtyIds.includes(specialtyId)
        ? prev.specialtyDetails.filter(detail => detail.specialtyId !== specialtyId)
        : [...prev.specialtyDetails, { specialtyId }]
    }));
  };

  // Update specialty details - will be used in future mode
  const updateSpecialtyDetail = (specialtyId: number, field: string, value: string | number | boolean | undefined) => {
    setFormData(prev => ({
      ...prev,
      specialtyDetails: prev.specialtyDetails.map(detail => 
        detail.specialtyId === specialtyId 
          ? { ...detail, [field]: value }
          : detail
      )
    }));
  };

  // Suppress unused variable warning - function will be used in future mode
  void updateSpecialtyDetail;

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
            {(Array.isArray(venues) ? venues : []).map(venue => (
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

                  {teacher.specialties && teacher.specialties.some(s => s.serviceType) && (
                    <div className="teacher-card__service-types">
                      <div className="service-types-header">
                        <span className="service-types-icon">🎯</span>
                        <span className="service-types-label">Service Types</span>
                      </div>
                      <div className="service-types-grid">
                        {teacher.specialties
                          .filter(s => s.serviceType)
                          .slice(0, 4)
                          .map((specialty, index) => {
                          const getServiceTypeIcon = (name: string) => {
                            const iconMap: { [key: string]: string } = {
                              'yoga': '🧘', 'pilates': '🤸', 'meditation': '🧘‍♀️', 'fitness': '💪',
                              'dance': '💃', 'martial arts': '🥋', 'swimming': '🏊', 'running': '🏃',
                              'cycling': '🚴', 'boxing': '🥊', 'crossfit': '🏋️', 'aerobics': '🤸‍♀️',
                              'stretching': '🤸‍♂️', 'breathing': '🫁', 'mindfulness': '🧠', 'wellness': '🌿',
                              'nutrition': '🥗', 'massage': '💆', 'therapy': '🩺', 'rehabilitation': '🦽',
                              'sports': '⚽', 'tennis': '🎾', 'golf': '⛳', 'basketball': '🏀',
                              'football': '🏈', 'soccer': '⚽', 'volleyball': '🏐', 'baseball': '⚾'
                            };
                            const lowerName = name.toLowerCase();
                            return iconMap[lowerName] || iconMap[name] || '🎯';
                          };
                          
                          return (
                            <div key={index} className="service-type-item">
                              <span className="service-type-icon">{getServiceTypeIcon(specialty.serviceType!.name)}</span>
                              <span className="service-type-name">{specialty.serviceType!.name}</span>
                            </div>
                          );
                        })}
                        {teacher.specialties.filter(s => s.serviceType).length > 4 && (
                          <div className="service-type-item service-type-item--more">
                            <span className="service-type-icon">➕</span>
                            <span className="service-type-name">+{teacher.specialties.filter(s => s.serviceType).length - 4} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {teacher.specialties && teacher.specialties.length > 0 && (
                    <div className="teacher-card__specialties">
                      <div className="specialties-header">
                        <span className="specialties-icon">🏆</span>
                        <span className="specialties-label">Specialties & Certifications</span>
                      </div>
                      <div className="specialties-grid">
                        {(Array.isArray(teacher.specialties) ? teacher.specialties : []).slice(0, 4).map((specialty, index) => {
                          const getSpecialtyIcon = (name: string) => {
                            const iconMap: { [key: string]: string } = {
                              'yoga alliance': '🧘‍♀️', 'pilates certification': '🤸', 'meditation teacher': '🧘', 'fitness trainer': '💪',
                              'dance instructor': '💃', 'martial arts': '🥋', 'swimming coach': '🏊', 'running coach': '🏃',
                              'cycling instructor': '🚴', 'boxing trainer': '🥊', 'crossfit coach': '🏋️', 'aerobics instructor': '🤸‍♀️',
                              'stretching specialist': '🤸‍♂️', 'breathing coach': '🫁', 'mindfulness teacher': '🧠', 'wellness coach': '🌿',
                              'nutritionist': '🥗', 'massage therapist': '💆', 'therapist': '🩺', 'rehabilitation specialist': '🦽',
                              'sports coach': '⚽', 'tennis instructor': '🎾', 'golf coach': '⛳', 'basketball coach': '🏀',
                              'football coach': '🏈', 'soccer coach': '⚽', 'volleyball coach': '🏐', 'baseball coach': '⚾',
                              'certification': '📜', 'diploma': '🎓', 'license': '📋', 'degree': '🎓'
                            };
                            const lowerName = name.toLowerCase();
                            return iconMap[lowerName] || iconMap[name] || '🏆';
                          };
                          
                          return (
                            <div key={index} className="specialty-item">
                              <span className="specialty-icon">{getSpecialtyIcon(specialty.specialty.name)}</span>
                              <span className="specialty-name">{specialty.specialty.name}</span>
                              {specialty.level && (
                                <span className="specialty-level">({specialty.level})</span>
                              )}
                              {specialty.certification && (
                                <span className="specialty-cert">📜 {specialty.certification}</span>
                              )}
                            </div>
                          );
                        })}
                        {teacher.specialties.length > 4 && (
                          <div className="specialty-item specialty-item--more">
                            <span className="specialty-icon">➕</span>
                            <span className="specialty-name">+{teacher.specialties.length - 4} more</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {teacher.languages && teacher.languages.length > 0 && (
                    <div className="teacher-card__languages">
                      <div className="languages-header">
                        <span className="languages-icon">🌍</span>
                        <span className="languages-label">Languages</span>
                      </div>
                      <div className="languages-grid">
                        {(Array.isArray(teacher.languages) ? teacher.languages : []).slice(0, 3).map((lang, index) => {
                          const getLanguageFlag = (code: string) => {
                            const flagMap: { [key: string]: string } = {
                              'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
                              'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
                              'ar': '🇸🇦', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳', 'nl': '🇳🇱',
                              'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'pl': '🇵🇱',
                              'tr': '🇹🇷', 'he': '🇮🇱', 'uk': '🇺🇦', 'cs': '🇨🇿', 'hu': '🇭🇺'
                            };
                            return flagMap[code.toLowerCase()] || '🌐';
                          };
                          
                          return (
                            <div key={index} className="language-item">
                              <span className="language-flag">{getLanguageFlag(lang.language.code)}</span>
                              <span className="language-name">{lang.language.name}</span>
                              {lang.language.nativeName && lang.language.nativeName !== lang.language.name && (
                                <span className="language-native">({lang.language.nativeName})</span>
                              )}
                            </div>
                          );
                        })}
                        {teacher.languages.length > 3 && (
                          <div className="language-item language-item--more">
                            <span className="language-flag">➕</span>
                            <span className="language-name">+{teacher.languages.length - 3} more</span>
                          </div>
                        )}
                      </div>
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
                      {(Array.isArray(venues) ? venues : []).map(venue => (
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
                    <label className="admin-form-label">
                      <span className="form-label-icon">🎯</span>
                      Service Types
                    </label>
                    <div className="service-types-selection-grid">
                      {(Array.isArray(serviceTypes) ? serviceTypes : []).map((serviceType) => {
                        const getServiceTypeIcon = (name: string) => {
                          const iconMap: { [key: string]: string } = {
                            'yoga': '🧘', 'pilates': '🤸', 'meditation': '🧘‍♀️', 'fitness': '💪',
                            'dance': '💃', 'martial arts': '🥋', 'swimming': '🏊', 'running': '🏃',
                            'cycling': '🚴', 'boxing': '🥊', 'crossfit': '🏋️', 'aerobics': '🤸‍♀️',
                            'stretching': '🤸‍♂️', 'breathing': '🫁', 'mindfulness': '🧠', 'wellness': '🌿',
                            'nutrition': '🥗', 'massage': '💆', 'therapy': '🩺', 'rehabilitation': '🦽',
                            'sports': '⚽', 'tennis': '🎾', 'golf': '⛳', 'basketball': '🏀',
                            'football': '🏈', 'soccer': '⚽', 'volleyball': '🏐', 'baseball': '⚾'
                          };
                          const lowerName = name.toLowerCase();
                          return iconMap[lowerName] || iconMap[name] || '🎯';
                        };
                        
                        return (
                          <label key={serviceType.id} className="service-type-selection-item">
                            <input
                              type="checkbox"
                              checked={formData.serviceTypeIds.includes(serviceType.id)}
                              onChange={() => toggleServiceType(serviceType.id)}
                              className="service-type-checkbox"
                            />
                            <div className="service-type-selection-content">
                              <div className="service-type-selection-icon">
                                {getServiceTypeIcon(serviceType.name)}
                              </div>
                              <div className="service-type-selection-text">
                                <span className="service-type-selection-name">{serviceType.name}</span>
                                {serviceType.description && (
                                  <span className="service-type-selection-description">{serviceType.description}</span>
                                )}
                                {serviceType.category && (
                                  <span className="service-type-selection-category">{serviceType.category}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">
                      <span className="form-label-icon">🏆</span>
                      Specialties & Certifications
                    </label>
                    <div className="specialties-selection-grid">
                      {(Array.isArray(specialties) ? specialties : []).map((specialty) => {
                        const getSpecialtyIcon = (name: string) => {
                          const iconMap: { [key: string]: string } = {
                            'yoga alliance': '🧘‍♀️', 'pilates certification': '🤸', 'meditation teacher': '🧘', 'fitness trainer': '💪',
                            'dance instructor': '💃', 'martial arts': '🥋', 'swimming coach': '🏊', 'running coach': '🏃',
                            'cycling instructor': '🚴', 'boxing trainer': '🥊', 'crossfit coach': '🏋️', 'aerobics instructor': '🤸‍♀️',
                            'stretching specialist': '🤸‍♂️', 'breathing coach': '🫁', 'mindfulness teacher': '🧠', 'wellness coach': '🌿',
                            'nutritionist': '🥗', 'massage therapist': '💆', 'therapist': '🩺', 'rehabilitation specialist': '🦽',
                            'sports coach': '⚽', 'tennis instructor': '🎾', 'golf coach': '⛳', 'basketball coach': '🏀',
                            'football coach': '🏈', 'soccer coach': '⚽', 'volleyball coach': '🏐', 'baseball coach': '⚾',
                            'certification': '📜', 'diploma': '🎓', 'license': '📋', 'degree': '🎓'
                          };
                          const lowerName = name.toLowerCase();
                          return iconMap[lowerName] || iconMap[name] || '🏆';
                        };
                        
                        return (
                          <label key={specialty.id} className="specialty-selection-item">
                            <input
                              type="checkbox"
                              checked={formData.specialtyIds.includes(specialty.id)}
                              onChange={() => toggleSpecialty(specialty.id)}
                              className="specialty-checkbox"
                            />
                            <div className="specialty-selection-content">
                              <div className="specialty-selection-icon">
                                {getSpecialtyIcon(specialty.name)}
                              </div>
                              <div className="specialty-selection-text">
                                <span className="specialty-selection-name">{specialty.name}</span>
                                {specialty.description && (
                                  <span className="specialty-selection-description">{specialty.description}</span>
                                )}
                                {specialty.category && (
                                  <span className="specialty-selection-category">{specialty.category}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="admin-form-group admin-form-group--full">
                    <label className="admin-form-label">
                      <span className="form-label-icon">🌍</span>
                      Languages
                    </label>
                    <div className="languages-selection-grid">
                      {(Array.isArray(languages) ? languages : []).map((language) => {
                        const getLanguageFlag = (code: string) => {
                          const flagMap: { [key: string]: string } = {
                            'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷', 'de': '🇩🇪', 'it': '🇮🇹',
                            'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh': '🇨🇳',
                            'ar': '🇸🇦', 'hi': '🇮🇳', 'th': '🇹🇭', 'vi': '🇻🇳', 'nl': '🇳🇱',
                            'sv': '🇸🇪', 'no': '🇳🇴', 'da': '🇩🇰', 'fi': '🇫🇮', 'pl': '🇵🇱',
                            'tr': '🇹🇷', 'he': '🇮🇱', 'uk': '🇺🇦', 'cs': '🇨🇿', 'hu': '🇭🇺'
                          };
                          return flagMap[code.toLowerCase()] || '🌐';
                        };
                        
                        return (
                          <label key={language.id} className="language-selection-item">
                            <input
                              type="checkbox"
                              checked={formData.languageIds.includes(language.id)}
                              onChange={() => toggleLanguage(language.id)}
                              className="language-checkbox"
                            />
                            <div className="language-selection-content">
                              <div className="language-selection-flag">
                                {getLanguageFlag(language.code)}
                              </div>
                              <div className="language-selection-text">
                                <span className="language-selection-name">{language.name}</span>
                                <span className="language-selection-code">({language.code.toUpperCase()})</span>
                                {language.nativeName && language.nativeName !== language.name && (
                                  <span className="language-selection-native">{language.nativeName}</span>
                                )}
                              </div>
                            </div>
                          </label>
                        );
                      })}
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
