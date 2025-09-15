'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ServiceDisplay } from './ServiceDisplay';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Star,
  Share2,
  Heart,
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
      avatarUrl?: string;
      bio?: string;
    };
    venue: {
      id: number;
      name: string;
      city?: string;
      address?: string;
    };
  }>;
}

interface ServiceDetailPageProps {
  serviceId?: string;
  onBook?: (service: ServiceType) => void;
  onFavorite?: (service: ServiceType) => void;
  onShare?: (service: ServiceType) => void;
}

export function ServiceDetailPage({ 
  serviceId, 
  onBook, 
  onFavorite, 
  onShare 
}: ServiceDetailPageProps) {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedServices, setRelatedServices] = useState<ServiceType[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  const currentServiceId = serviceId || params?.id;

  // Fetch service details
  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${currentServiceId}`);
      const data = await response.json();
      
      if (data.success) {
        setService(data.data);
      } else {
        setError(data.message || 'Service not found');
      }
    } catch (err) {
      setError('Failed to fetch service details');
      console.error('Error fetching service:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related services
  const fetchRelatedServices = async (category: string, excludeId: number) => {
    try {
      const response = await fetch(`/api/services?category=${category}&limit=4`);
      const data = await response.json();
      
      if (data.success) {
        setRelatedServices(data.data.services.filter((s: ServiceType) => s.id !== excludeId));
      }
    } catch (err) {
      console.error('Error fetching related services:', err);
    }
  };

  useEffect(() => {
    if (currentServiceId) {
      fetchService();
    }
  }, [currentServiceId]);

  useEffect(() => {
    if (service) {
      fetchRelatedServices(service.category, service.id);
    }
  }, [service]);

  const handleBook = (service: ServiceType) => {
    onBook?.(service);
    // In a real app, you might redirect to a booking page
    console.log('Booking service:', service.name);
  };

  const handleFavorite = (service: ServiceType) => {
    setIsFavorited(!isFavorited);
    onFavorite?.(service);
  };

  const handleShare = (service: ServiceType) => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: service.shortDescription || service.description,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(service);
  };

  if (loading) {
    return (
      <div className="service-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="service-detail-error">
        <div className="error-content">
          <h2>Service Not Found</h2>
          <p>{error || 'The service you are looking for does not exist.'}</p>
          <button 
            className="service-button service-button--primary"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-page">
      {/* Breadcrumb */}
      <div className="service-detail-page__breadcrumb">
        <button 
          className="breadcrumb-item"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">Services</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">{service.category.replace('_', ' ')}</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">{service.name}</span>
      </div>

      {/* Main Content */}
      <div className="service-detail-page__content">
        <ServiceDisplay
          serviceType={service}
          onBook={handleBook}
          onFavorite={handleFavorite}
          onShare={handleShare}
          layout="detailed"
        />
      </div>

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <div className="service-detail-page__related">
          <div className="related-services">
            <h2 className="related-services__title">You Might Also Like</h2>
            <div className="related-services__grid">
              {relatedServices.map((relatedService) => (
                <motion.div
                  key={relatedService.id}
                  className="related-service-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => router.push(`/services/${relatedService.slug || relatedService.id}`)}
                >
                  {relatedService.coverImage && (
                    <div className="related-service-card__image">
                      <img 
                        src={relatedService.coverImage} 
                        alt={relatedService.name}
                      />
                    </div>
                  )}
                  
                  <div className="related-service-card__content">
                    <div className="related-service-card__header">
                      <h3 className="related-service-card__title">{relatedService.name}</h3>
                      <div className="related-service-card__category">
                        {relatedService.category.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    
                    <p className="related-service-card__description">
                      {relatedService.shortDescription || relatedService.description}
                    </p>
                    
                    <div className="related-service-card__meta">
                      <div className="service-meta">
                        <Clock size={14} />
                        <span>{Math.floor(relatedService.duration / 60)}h {relatedService.duration % 60}m</span>
                      </div>
                      <div className="service-meta">
                        <Users size={14} />
                        <span>
                          {relatedService.minParticipants}
                          {relatedService.maxParticipants && `-${relatedService.maxParticipants}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="related-service-card__footer">
                      <div className="related-service-card__price">
                        {relatedService.price 
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: relatedService.currency || 'USD'
                            }).format(relatedService.price)
                          : 'Contact for pricing'
                        }
                      </div>
                      <button className="related-service-card__button">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {service.faq && (
        <div className="service-detail-page__faq">
          <div className="faq-section">
            <h2 className="faq-section__title">Frequently Asked Questions</h2>
            <div className="faq-section__content">
              {/* This would be rendered based on the FAQ content format */}
              <div dangerouslySetInnerHTML={{ __html: service.faq }} />
            </div>
          </div>
        </div>
      )}

      {/* Booking CTA */}
      <div className="service-detail-page__cta">
        <div className="booking-cta">
          <div className="booking-cta__content">
            <h2>Ready to Get Started?</h2>
            <p>Book your {service.name} session today and begin your wellness journey.</p>
            <div className="booking-cta__features">
              <div className="cta-feature">
                <Calendar size={20} />
                <span>Flexible scheduling</span>
              </div>
              <div className="cta-feature">
                <Users size={20} />
                <span>Expert instructors</span>
              </div>
              <div className="cta-feature">
                <MapPin size={20} />
                <span>Multiple locations</span>
              </div>
            </div>
          </div>
          <div className="booking-cta__action">
            <button 
              className="service-button service-button--primary service-button--large"
              onClick={() => handleBook(service)}
            >
              <Calendar size={24} />
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
