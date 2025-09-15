'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  Share2,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Wrench,
  GraduationCap
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
  currency?: string;
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

interface ServiceDisplayProps {
  serviceType: ServiceType;
  onBook?: (serviceType: ServiceType) => void;
  onFavorite?: (serviceType: ServiceType) => void;
  onShare?: (serviceType: ServiceType) => void;
  showBookingButton?: boolean;
  layout?: 'card' | 'detailed' | 'list';
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

const DIFFICULTY_COLORS = {
  beginner: '#4CAF50',
  intermediate: '#FF9800',
  advanced: '#F44336'
};

export function ServiceDisplay({ 
  serviceType, 
  onBook, 
  onFavorite, 
  onShare, 
  showBookingButton = true,
  layout = 'card'
}: ServiceDisplayProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const CategoryIcon = CATEGORY_ICONS[serviceType.category];
  const categoryColor = serviceType.color || CATEGORY_COLORS[serviceType.category];
  const difficultyColor = serviceType.difficulty ? DIFFICULTY_COLORS[serviceType.difficulty as keyof typeof DIFFICULTY_COLORS] : undefined;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const formatPrice = (price?: number, currency = 'USD') => {
    if (!price) return 'Contact for pricing';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    const images = [serviceType.coverImage, ...serviceType.galleryImages].filter(Boolean);
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(serviceType);
  };

  const images = [serviceType.coverImage, ...serviceType.galleryImages].filter(Boolean);

  if (layout === 'list') {
    return (
      <div className="service-list-item">
        <div className="service-list-item__image">
          {serviceType.coverImage && (
            <img 
              src={serviceType.coverImage} 
              alt={serviceType.name}
              className="service-list-item__cover"
            />
          )}
          <div className="service-list-item__category" style={{ backgroundColor: categoryColor }}>
            <CategoryIcon size={16} />
          </div>
        </div>
        
        <div className="service-list-item__content">
          <div className="service-list-item__header">
            <h3 className="service-list-item__title">{serviceType.name}</h3>
            <div className="service-list-item__meta">
              <span className="service-meta">
                <Clock size={14} />
                {formatDuration(serviceType.duration)}
              </span>
              <span className="service-meta">
                <Users size={14} />
                {serviceType.minParticipants}
                {serviceType.maxParticipants && `-${serviceType.maxParticipants}`}
              </span>
              {serviceType.difficulty && (
                <span 
                  className="service-meta service-meta--difficulty"
                  style={{ color: difficultyColor }}
                >
                  {serviceType.difficulty}
                </span>
              )}
            </div>
          </div>
          
          <p className="service-list-item__description">
            {serviceType.shortDescription || serviceType.description}
          </p>
          
          <div className="service-list-item__footer">
            <div className="service-list-item__price">
              {formatPrice(serviceType.price, serviceType.currency)}
            </div>
            {showBookingButton && (
              <button 
                className="service-button service-button--primary"
                onClick={() => onBook?.(serviceType)}
              >
                Book Now
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'card') {
    return (
      <motion.div 
        className="service-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="service-card__image-container">
          {images.length > 0 && (
            <>
              <img 
                src={images[currentImageIndex]} 
                alt={serviceType.name}
                className="service-card__image"
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="service-card__nav service-card__nav--prev"
                    onClick={() => handleImageNavigation('prev')}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    className="service-card__nav service-card__nav--next"
                    onClick={() => handleImageNavigation('next')}
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="service-card__indicators">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`service-card__indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          
          <div className="service-card__overlay">
            <div className="service-card__badges">
              <div className="service-card__category" style={{ backgroundColor: categoryColor }}>
                <CategoryIcon size={16} />
                <span>{serviceType.category.replace('_', ' ').toUpperCase()}</span>
              </div>
              {serviceType.featured && (
                <div className="service-card__featured">
                  <Star size={16} />
                  <span>Featured</span>
                </div>
              )}
            </div>
            
            <div className="service-card__actions">
              <button 
                className={`service-card__action ${isFavorited ? 'active' : ''}`}
                onClick={handleFavorite}
              >
                <Heart size={20} />
              </button>
              <button 
                className="service-card__action"
                onClick={() => onShare?.(serviceType)}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="service-card__content">
          <div className="service-card__header">
            <h3 className="service-card__title">{serviceType.name}</h3>
            <div className="service-card__meta">
              <span className="service-meta">
                <Clock size={14} />
                {formatDuration(serviceType.duration)}
              </span>
              <span className="service-meta">
                <Users size={14} />
                {serviceType.minParticipants}
                {serviceType.maxParticipants && `-${serviceType.maxParticipants}`}
              </span>
            </div>
          </div>

          <p className="service-card__description">
            {serviceType.shortDescription || serviceType.description}
          </p>

          {serviceType.highlights.length > 0 && (
            <div className="service-card__highlights">
              {serviceType.highlights.slice(0, 3).map((highlight, index) => (
                <div key={index} className="service-highlight">
                  <CheckCircle size={14} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          )}

          <div className="service-card__footer">
            <div className="service-card__price">
              {formatPrice(serviceType.price, serviceType.currency)}
            </div>
            {showBookingButton && (
              <button 
                className="service-button service-button--primary"
                onClick={() => onBook?.(serviceType)}
              >
                Book Now
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Detailed layout
  return (
    <div className="service-detailed">
      <div className="service-detailed__hero">
        <div className="service-detailed__media">
          {serviceType.videoUrl && !isVideoPlaying ? (
            <div className="service-detailed__video-container">
              <img 
                src={serviceType.thumbnailUrl || serviceType.coverImage} 
                alt={serviceType.name}
                className="service-detailed__video-thumbnail"
              />
              <button 
                className="service-detailed__play-button"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play size={48} />
              </button>
            </div>
          ) : serviceType.videoUrl && isVideoPlaying ? (
            <video 
              className="service-detailed__video"
              controls
              autoPlay
              src={serviceType.videoUrl}
            />
          ) : images.length > 0 ? (
            <div className="service-detailed__image-gallery">
              <img 
                src={images[currentImageIndex]} 
                alt={serviceType.name}
                className="service-detailed__main-image"
              />
              {images.length > 1 && (
                <>
                  <button 
                    className="service-detailed__nav service-detailed__nav--prev"
                    onClick={() => handleImageNavigation('prev')}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    className="service-detailed__nav service-detailed__nav--next"
                    onClick={() => handleImageNavigation('next')}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          ) : null}
        </div>

        <div className="service-detailed__info">
          <div className="service-detailed__header">
            <div className="service-detailed__badges">
              <div className="service-detailed__category" style={{ backgroundColor: categoryColor }}>
                <CategoryIcon size={20} />
                <span>{serviceType.category.replace('_', ' ').toUpperCase()}</span>
              </div>
              {serviceType.difficulty && (
                <div 
                  className="service-detailed__difficulty"
                  style={{ backgroundColor: difficultyColor }}
                >
                  {serviceType.difficulty}
                </div>
              )}
              {serviceType.featured && (
                <div className="service-detailed__featured">
                  <Star size={20} />
                  <span>Featured</span>
                </div>
              )}
            </div>

            <h1 className="service-detailed__title">{serviceType.name}</h1>
            
            <div className="service-detailed__meta">
              <div className="service-meta">
                <Clock size={18} />
                <span>{formatDuration(serviceType.duration)}</span>
              </div>
              <div className="service-meta">
                <Users size={18} />
                <span>
                  {serviceType.minParticipants}
                  {serviceType.maxParticipants && `-${serviceType.maxParticipants}`} participants
                </span>
              </div>
              <div className="service-meta">
                <Calendar size={18} />
                <span>Available now</span>
              </div>
            </div>

            <div className="service-detailed__price">
              {formatPrice(serviceType.price, serviceType.currency)}
            </div>
          </div>

          <div className="service-detailed__actions">
            {showBookingButton && (
              <button 
                className="service-button service-button--primary service-button--large"
                onClick={() => onBook?.(serviceType)}
              >
                <Calendar size={20} />
                Book This Service
                <ArrowRight size={20} />
              </button>
            )}
            <button 
              className={`service-button service-button--secondary ${isFavorited ? 'active' : ''}`}
              onClick={handleFavorite}
            >
              <Heart size={20} />
              {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </button>
            <button 
              className="service-button service-button--secondary"
              onClick={() => onShare?.(serviceType)}
            >
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="service-detailed__content">
        <div className="service-detailed__main">
          <div className="service-detailed__section">
            <h2>About This Service</h2>
            <div className="service-detailed__description">
              {serviceType.description}
            </div>
          </div>

          {serviceType.highlights.length > 0 && (
            <div className="service-detailed__section">
              <h2>What You'll Learn</h2>
              <div className="service-detailed__highlights">
                {serviceType.highlights.map((highlight, index) => (
                  <div key={index} className="service-highlight">
                    <CheckCircle size={18} />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {serviceType.benefits.length > 0 && (
            <div className="service-detailed__section">
              <h2>Benefits</h2>
              <div className="service-detailed__benefits">
                {serviceType.benefits.map((benefit, index) => (
                  <div key={index} className="service-benefit">
                    <CheckCircle size={18} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {serviceType.requirements.length > 0 && (
            <div className="service-detailed__section">
              <h2>Requirements</h2>
              <div className="service-detailed__requirements">
                {serviceType.requirements.map((requirement, index) => (
                  <span key={index} className="service-requirement">
                    {requirement}
                  </span>
                ))}
              </div>
            </div>
          )}

          {serviceType.teacherSchedules && serviceType.teacherSchedules.length > 0 && (
            <div className="service-detailed__section">
              <h2>Available Sessions</h2>
              <div className="service-detailed__sessions">
                {serviceType.teacherSchedules.map((schedule) => (
                  <div key={schedule.id} className="service-session">
                    <div className="service-session__time">
                      <Clock size={16} />
                      <span>{schedule.dayOfWeek} {schedule.startTime} - {schedule.endTime}</span>
                    </div>
                    <div className="service-session__teacher">
                      <User size={16} />
                      <span>{schedule.teacher.name}</span>
                    </div>
                    <div className="service-session__venue">
                      <MapPin size={16} />
                      <span>{schedule.venue.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {serviceType.testimonials.length > 0 && (
            <div className="service-detailed__section">
              <h2>What People Say</h2>
              <div className="service-detailed__testimonials">
                {serviceType.testimonials.map((testimonial, index) => (
                  <div key={index} className="service-testimonial">
                    <div className="service-testimonial__stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                    <p className="service-testimonial__text">{testimonial}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="service-detailed__sidebar">
          <div className="service-detailed__booking-card">
            <h3>Book This Service</h3>
            <div className="service-detailed__booking-info">
              <div className="booking-info-item">
                <Clock size={16} />
                <span>{formatDuration(serviceType.duration)}</span>
              </div>
              <div className="booking-info-item">
                <Users size={16} />
                <span>
                  {serviceType.minParticipants}
                  {serviceType.maxParticipants && `-${serviceType.maxParticipants}`} people
                </span>
              </div>
              <div className="booking-info-item">
                <Calendar size={16} />
                <span>Flexible scheduling</span>
              </div>
            </div>
            <div className="service-detailed__booking-price">
              {formatPrice(serviceType.price, serviceType.currency)}
            </div>
            {showBookingButton && (
              <button 
                className="service-button service-button--primary service-button--full"
                onClick={() => onBook?.(serviceType)}
              >
                <Calendar size={20} />
                Book Now
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
