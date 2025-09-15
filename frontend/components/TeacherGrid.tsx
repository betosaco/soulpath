'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  Star,
  Award,
  Users,
  MapPin,
  Heart,
  Share2,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface Teacher {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  shortBio?: string;
  specialties: string[];
  languages: string[];
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
  featured: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  venue?: {
    id: number;
    name: string;
    address?: string;
    city?: string;
    country?: string;
    capacity: number;
    amenities: string[];
  };
  certifications: Array<{
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
}

interface TeacherGridProps {
  teachers: Teacher[];
  onBook?: (teacher: Teacher) => void;
  onFavorite?: (teacher: Teacher) => void;
  onShare?: (teacher: Teacher) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  showViewToggle?: boolean;
  initialLayout?: 'grid' | 'list';
  itemsPerPage?: number;
}

export function TeacherGrid({ 
  teachers, 
  onBook, 
  onFavorite, 
  onShare,
  showFilters = true,
  showSearch = true,
  showViewToggle = true,
  initialLayout = 'grid',
  itemsPerPage = 12
}: TeacherGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>(initialLayout);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Get unique specialties, venues, and experience ranges
  const specialties = ['all', ...Array.from(new Set(teachers.flatMap(t => t.specialties)))];
  const venues = ['all', ...Array.from(new Set(teachers.map(t => t.venue?.name).filter(Boolean)))];
  const experienceRanges = [
    { value: 'all', label: 'All Experience' },
    { value: '0-2', label: '0-2 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '6-10', label: '6-10 years' },
    { value: '10+', label: '10+ years' }
  ];

  // Filter and sort teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.shortBio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty === 'all' || teacher.specialties.includes(selectedSpecialty);
    const matchesVenue = selectedVenue === 'all' || teacher.venue?.name === selectedVenue;
    
    let matchesExperience = true;
    if (selectedExperience !== 'all') {
      const exp = teacher.experience;
      switch (selectedExperience) {
        case '0-2':
          matchesExperience = exp >= 0 && exp <= 2;
          break;
        case '3-5':
          matchesExperience = exp >= 3 && exp <= 5;
          break;
        case '6-10':
          matchesExperience = exp >= 6 && exp <= 10;
          break;
        case '10+':
          matchesExperience = exp > 10;
          break;
      }
    }
    
    return matchesSearch && matchesSpecialty && matchesVenue && matchesExperience;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        return b.experience - a.experience;
      case 'featured':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.experience - a.experience;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialty, selectedExperience, selectedVenue, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('all');
    setSelectedExperience('all');
    setSelectedVenue('all');
    setSortBy('featured');
  };

  const handleFavorite = (teacher: Teacher) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(teacher.id)) {
      newFavorites.delete(teacher.id);
    } else {
      newFavorites.add(teacher.id);
    }
    setFavorites(newFavorites);
    onFavorite?.(teacher);
  };

  if (layout === 'list') {
    return (
      <div className="teacher-grid">
        {/* Header */}
        <div className="teacher-grid__header">
          <div className="teacher-grid__title">
            <h2>Our Teachers</h2>
            <p className="teacher-grid__subtitle">
              Meet {filteredTeachers.length} amazing wellness instructors
            </p>
          </div>
          
          {showViewToggle && (
            <div className="teacher-grid__view-toggle">
              <button 
                className={`view-toggle-button ${layout === 'grid' ? 'active' : ''}`}
                onClick={() => setLayout('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`view-toggle-button ${layout === 'list' ? 'active' : ''}`}
                onClick={() => setLayout('list')}
              >
                <List size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="teacher-grid__controls">
            {showSearch && (
              <div className="teacher-grid__search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="teacher-grid__search-input"
                />
              </div>
            )}

            <div className="teacher-grid__filters">
              <button 
                className="teacher-grid__filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={20} />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="teacher-grid__sort"
              >
                <option value="featured">Featured First</option>
                <option value="name">Name A-Z</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="teacher-grid__filter-panel">
            <div className="filter-panel">
              <div className="filter-panel__header">
                <h3>Filter Teachers</h3>
                <button 
                  className="filter-panel__clear"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              <div className="filter-panel__content">
                <div className="filter-group">
                  <label className="filter-label">Specialty</label>
                  <div className="filter-options">
                    {specialties.map(specialty => (
                      <button
                        key={specialty}
                        className={`filter-option ${selectedSpecialty === specialty ? 'active' : ''}`}
                        onClick={() => setSelectedSpecialty(specialty)}
                      >
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Experience</label>
                  <div className="filter-options">
                    {experienceRanges.map(range => (
                      <button
                        key={range.value}
                        className={`filter-option ${selectedExperience === range.value ? 'active' : ''}`}
                        onClick={() => setSelectedExperience(range.value)}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Venue</label>
                  <div className="filter-options">
                    {venues.map(venue => (
                      <button
                        key={venue}
                        className={`filter-option ${selectedVenue === venue ? 'active' : ''}`}
                        onClick={() => setSelectedVenue(venue)}
                      >
                        {venue === 'all' ? 'All Venues' : venue}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="teacher-grid__results">
          {filteredTeachers.length === 0 ? (
            <div className="teacher-grid__empty">
              <div className="empty-state">
                <Search size={48} />
                <h3>No teachers found</h3>
                <p>Try adjusting your search or filter criteria</p>
                <button 
                  className="teacher-button teacher-button--secondary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="teacher-grid__items teacher-grid__items--list">
                {paginatedTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    onBook={onBook}
                    onFavorite={handleFavorite}
                    onShare={onShare}
                    layout="list"
                    isFavorited={favorites.has(teacher.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="teacher-grid__pagination">
                  <button 
                    className="pagination-button pagination-button--prev"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    className="pagination-button pagination-button--next"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div className="teacher-grid">
      {/* Header */}
      <div className="teacher-grid__header">
        <div className="teacher-grid__title">
          <h2>Our Teachers</h2>
          <p className="teacher-grid__subtitle">
            Meet {filteredTeachers.length} amazing wellness instructors
          </p>
        </div>
        
        {showViewToggle && (
          <div className="teacher-grid__view-toggle">
            <button 
              className={`view-toggle-button ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => setLayout('grid')}
            >
              <Grid size={20} />
            </button>
            <button 
              className={`view-toggle-button ${layout === 'list' ? 'active' : ''}`}
              onClick={() => setLayout('list')}
            >
              <List size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="teacher-grid__controls">
          {showSearch && (
            <div className="teacher-grid__search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="teacher-grid__search-input"
              />
            </div>
          )}

          <div className="teacher-grid__filters">
            <button 
              className="teacher-grid__filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="teacher-grid__sort"
            >
              <option value="featured">Featured First</option>
              <option value="name">Name A-Z</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="teacher-grid__filter-panel">
          <div className="filter-panel">
            <div className="filter-panel__header">
              <h3>Filter Teachers</h3>
              <button 
                className="filter-panel__clear"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>

            <div className="filter-panel__content">
              <div className="filter-group">
                <label className="filter-label">Specialty</label>
                <div className="filter-options">
                  {specialties.map(specialty => (
                    <button
                      key={specialty}
                      className={`filter-option ${selectedSpecialty === specialty ? 'active' : ''}`}
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty === 'all' ? 'All Specialties' : specialty}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Experience</label>
                <div className="filter-options">
                  {experienceRanges.map(range => (
                    <button
                      key={range.value}
                      className={`filter-option ${selectedExperience === range.value ? 'active' : ''}`}
                      onClick={() => setSelectedExperience(range.value)}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Venue</label>
                <div className="filter-options">
                  {venues.map(venue => (
                    <button
                      key={venue}
                      className={`filter-option ${selectedVenue === venue ? 'active' : ''}`}
                      onClick={() => setSelectedVenue(venue)}
                    >
                      {venue === 'all' ? 'All Venues' : venue}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="teacher-grid__results">
        {filteredTeachers.length === 0 ? (
          <div className="teacher-grid__empty">
            <div className="empty-state">
              <Search size={48} />
              <h3>No teachers found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button 
                className="teacher-button teacher-button--secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="teacher-grid__items teacher-grid__items--grid">
              {paginatedTeachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onBook={onBook}
                  onFavorite={handleFavorite}
                  onShare={onShare}
                  layout="grid"
                  isFavorited={favorites.has(teacher.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="teacher-grid__pagination">
                <button 
                  className="pagination-button pagination-button--prev"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-button pagination-button--next"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Teacher Card Component
function TeacherCard({ 
  teacher, 
  onBook, 
  onFavorite, 
  onShare, 
  layout, 
  isFavorited 
}: { 
  teacher: Teacher; 
  onBook?: (teacher: Teacher) => void; 
  onFavorite?: (teacher: Teacher) => void; 
  onShare?: (teacher: Teacher) => void; 
  layout: 'grid' | 'list';
  isFavorited: boolean;
}) {
  const handleFavorite = () => {
    onFavorite?.(teacher);
  };

  const handleShare = () => {
    onShare?.(teacher);
  };

  const handleBook = () => {
    onBook?.(teacher);
  };

  if (layout === 'list') {
    return (
      <div className="teacher-list-item">
        <div className="teacher-list-item__image">
          {teacher.coverImage && (
            <img 
              src={teacher.coverImage} 
              alt={teacher.name}
              className="teacher-list-item__cover"
            />
          )}
          <div className="teacher-list-item__avatar">
            {teacher.avatarUrl ? (
              <img 
                src={teacher.avatarUrl} 
                alt={teacher.name}
              />
            ) : (
              <div className="teacher-list-item__avatar-placeholder">
                {teacher.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        <div className="teacher-list-item__content">
          <div className="teacher-list-item__header">
            <h3 className="teacher-list-item__name">{teacher.name}</h3>
            {teacher.featured && (
              <div className="teacher-list-item__featured">
                <Star size={16} />
                <span>Featured</span>
              </div>
            )}
          </div>
          
          <div className="teacher-list-item__meta">
            <div className="teacher-meta">
              <Award size={14} />
              <span>{teacher.experience} years experience</span>
            </div>
            <div className="teacher-meta">
              <Users size={14} />
              <span>
                {teacher.minStudents}
                {teacher.maxStudents && `-${teacher.maxStudents}`} students
              </span>
            </div>
            {teacher.venue && (
              <div className="teacher-meta">
                <MapPin size={14} />
                <span>{teacher.venue.name}</span>
              </div>
            )}
          </div>
          
          <p className="teacher-list-item__bio">
            {teacher.shortBio || teacher.bio}
          </p>
          
          <div className="teacher-list-item__specialties">
            {teacher.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="teacher-specialty teacher-specialty--small">
                {specialty}
              </span>
            ))}
          </div>
          
          <div className="teacher-list-item__footer">
            <div className="teacher-list-item__certifications">
              <Award size={14} />
              <span>{teacher.certifications.length} certifications</span>
            </div>
            <div className="teacher-list-item__actions">
              <button 
                className={`teacher-action ${isFavorited ? 'active' : ''}`}
                onClick={handleFavorite}
              >
                <Heart size={16} />
              </button>
              <button 
                className="teacher-action"
                onClick={handleShare}
              >
                <Share2 size={16} />
              </button>
              <button 
                className="teacher-button teacher-button--primary"
                onClick={handleBook}
              >
                Book Session
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <motion.div 
      className="teacher-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="teacher-card__image-container">
        {teacher.coverImage && (
          <img 
            src={teacher.coverImage} 
            alt={teacher.name}
            className="teacher-card__image"
          />
        )}
        
        <div className="teacher-card__overlay">
          <div className="teacher-card__badges">
            {teacher.featured && (
              <div className="teacher-card__featured">
                <Star size={16} />
                <span>Featured</span>
              </div>
            )}
          </div>
          
          <div className="teacher-card__actions">
            <button 
              className={`teacher-card__action ${isFavorited ? 'active' : ''}`}
              onClick={handleFavorite}
            >
              <Heart size={20} />
            </button>
            <button 
              className="teacher-card__action"
              onClick={handleShare}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="teacher-card__content">
        <div className="teacher-card__avatar">
          {teacher.avatarUrl ? (
            <img 
              src={teacher.avatarUrl} 
              alt={teacher.name}
            />
          ) : (
            <div className="teacher-card__avatar-placeholder">
              {teacher.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="teacher-card__header">
          <h3 className="teacher-card__name">{teacher.name}</h3>
          <div className="teacher-card__meta">
            <div className="teacher-meta">
              <Award size={14} />
              <span>{teacher.experience} years</span>
            </div>
            <div className="teacher-meta">
              <Users size={14} />
              <span>
                {teacher.minStudents}
                {teacher.maxStudents && `-${teacher.maxStudents}`}
              </span>
            </div>
          </div>
        </div>

        <p className="teacher-card__bio">
          {teacher.shortBio || teacher.bio}
        </p>

        <div className="teacher-card__specialties">
          {teacher.specialties.slice(0, 2).map((specialty, index) => (
            <span key={index} className="teacher-specialty teacher-specialty--small">
              {specialty}
            </span>
          ))}
        </div>

        <div className="teacher-card__footer">
          <div className="teacher-card__certifications">
            <Award size={14} />
            <span>{teacher.certifications.length} certifications</span>
          </div>
          <button 
            className="teacher-button teacher-button--primary"
            onClick={handleBook}
          >
            Book Session
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
