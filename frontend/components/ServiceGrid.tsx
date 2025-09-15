'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceDisplay } from './ServiceDisplay';
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal
} from 'lucide-react';

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  category: 'class' | 'workshop' | 'training_program';
  duration: number;
  maxParticipants?: number;
  minParticipants: number;
  requirements: string[];
  benefits: string[];
  difficulty?: string;
  price?: number;
  currencyId?: number;
  currency?: {
    id: number;
    code: string;
    name: string;
    symbol: string;
  };
  isActive: boolean;
  featured: boolean;
  color?: string;
  icon?: string;
  coverImage?: string;
  galleryImages: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  content?: string;
  highlights: string[];
  testimonials: string[];
  faq?: string;
  metaTitle?: string;
  metaDescription?: string;
  slug?: string;
}

interface ServiceGridProps {
  services: ServiceType[];
  onBook?: (service: ServiceType) => void;
  onFavorite?: (service: ServiceType) => void;
  onShare?: (service: ServiceType) => void;
  // showFilters?: boolean; // Removed unused prop
  showSearch?: boolean;
  showViewToggle?: boolean;
  initialLayout?: 'grid' | 'list';
  itemsPerPage?: number;
}

export function ServiceGrid({ 
  services, 
  onBook, 
  onFavorite, 
  onShare,
  // showFilters = true, // Removed unused prop
  showSearch = true,
  showViewToggle = true,
  initialLayout = 'grid',
  itemsPerPage = 12
}: ServiceGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [layout, setLayout] = useState<'card' | 'detailed' | 'list'>(initialLayout === 'grid' ? 'card' : initialLayout as 'card' | 'detailed' | 'list');
  const [showFiltersState, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories and difficulties
  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];
  const difficulties = ['all', ...Array.from(new Set(services.map(s => s.difficulty).filter(Boolean)))];
  
  // Filter and sort services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.highlights.some(h => h.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || service.difficulty === selectedDifficulty;
    
    let matchesPrice = true;
    if (selectedPriceRange !== 'all' && service.price) {
      switch (selectedPriceRange) {
        case 'free':
          matchesPrice = service.price === 0;
          break;
        case 'under-50':
          matchesPrice = service.price < 50;
          break;
        case '50-100':
          matchesPrice = service.price >= 50 && service.price <= 100;
          break;
        case '100-200':
          matchesPrice = service.price > 100 && service.price <= 200;
          break;
        case 'over-200':
          matchesPrice = service.price > 200;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'duration':
        return a.duration - b.duration;
      case 'featured':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0; // displayOrder not available in ServiceType
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedPriceRange('all');
    setSortBy('featured');
  };

  return (
    <div className="service-grid">
      {/* Header */}
      <div className="service-grid__header">
        <div className="service-grid__title">
          <h2>Our Services</h2>
          <p className="service-grid__subtitle">
            Discover {filteredServices.length} amazing wellness services
          </p>
        </div>
        
        {showViewToggle && (
          <div className="service-grid__view-toggle">
            <button 
              className={`view-toggle-button ${layout === 'card' ? 'active' : ''}`}
              onClick={() => setLayout('card')}
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
      {(showSearch || showFiltersState) && (
        <div className="service-grid__controls">
          {showSearch && (
            <div className="service-grid__search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value || '')}
                className="service-grid__search-input"
              />
            </div>
          )}

          <div className="service-grid__filters">
            <button 
              className="service-grid__filter-toggle"
              onClick={() => setShowFilters(!showFiltersState)}
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="service-grid__sort"
            >
              <option value="featured">Featured First</option>
              <option value="name">Name A-Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {showFiltersState && (
          <motion.div
            className="service-grid__filter-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="filter-panel">
              <div className="filter-panel__header">
                <h3>Filter Services</h3>
                <button 
                  className="filter-panel__clear"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              </div>

              <div className="filter-panel__content">
                <div className="filter-group">
                  <label className="filter-label">Category</label>
                  <div className="filter-options">
                    {categories.map(category => (
                      <button
                        key={category}
                        className={`filter-option ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category === 'all' ? 'All Categories' : category.replace('_', ' ').toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Difficulty</label>
                  <div className="filter-options">
                    {difficulties.map(difficulty => (
                      <button
                        key={difficulty}
                        className={`filter-option ${selectedDifficulty === difficulty ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(difficulty || 'all')}
                      >
                        {difficulty === 'all' ? 'All Levels' : difficulty}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">Price Range</label>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'free', label: 'Free' },
                      { value: 'under-50', label: 'Under $50' },
                      { value: '50-100', label: '$50 - $100' },
                      { value: '100-200', label: '$100 - $200' },
                      { value: 'over-200', label: 'Over $200' }
                    ].map(option => (
                      <button
                        key={option.value}
                        className={`filter-option ${selectedPriceRange === option.value ? 'active' : ''}`}
                        onClick={() => setSelectedPriceRange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="service-grid__results">
        {filteredServices.length === 0 ? (
          <div className="service-grid__empty">
            <div className="empty-state">
              <Search size={48} />
              <h3>No services found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button 
                className="service-button service-button--secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`service-grid__items service-grid__items--${layout}`}>
              {paginatedServices.map((service) => (
                <ServiceDisplay
                  key={service.id}
                  serviceType={service}
                  onBook={onBook}
                  onFavorite={onFavorite}
                  onShare={onShare}
                  layout={layout}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="service-grid__pagination">
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
