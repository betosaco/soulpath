'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Star,
  Share2,
  Heart,
  Play,
  ChevronLeft,
  ChevronRight,
  Award,
  Globe,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  Phone,
  CheckCircle,
  ExternalLink,
  BookOpen,
  User,
  CalendarDays
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
  teacherSchedules: Array<{
    id: number;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    maxBookings: number;
    specialties: string[];
    serviceType?: {
      id: number;
      name: string;
      category: string;
      duration: number;
      color?: string;
      icon?: string;
    };
    venue: {
      id: number;
      name: string;
      city?: string;
      address?: string;
    };
  }>;
  upcomingSessions: Array<{
    id: number;
    startTime: string;
    endTime: string;
    maxBookings: number;
    bookedCount: number;
    teacherSchedule: {
      dayOfWeek: string;
      serviceType?: {
        id: number;
        name: string;
        category: string;
        duration: number;
        color?: string;
      };
      venue: {
        id: number;
        name: string;
        city?: string;
        address?: string;
      };
    };
  }>;
  relatedTeachers: Array<{
    id: number;
    name: string;
    shortBio?: string;
    specialties: string[];
    experience: number;
    avatarUrl?: string;
    slug?: string;
    featured: boolean;
  }>;
  reviews: Array<{ id: string; rating: number; comment: string; user: { name: string } }>;
}

interface TeacherProfilePageProps {
  teacherId?: string;
  onBook?: (teacher: Teacher, serviceType?: { id: number; name: string; category: string }) => void;
  onFavorite?: (teacher: Teacher) => void;
  onShare?: (teacher: Teacher) => void;
}

// const _CATEGORY_ICONS = {
//   class: BookOpen,
//   workshop: Wrench,
//   training_program: GraduationCap
// };

export function TeacherProfilePage({ 
  teacherId, 
  onBook, 
  onFavorite, 
  onShare 
}: TeacherProfilePageProps) {
  const params = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'about' | 'schedule' | 'certifications' | 'gallery'>('about');

  const currentTeacherId = teacherId || params?.id;

  // Fetch teacher profile
  const fetchTeacher = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/teachers/${currentTeacherId}`);
      const data = await response.json();
      
      if (data.success) {
        setTeacher(data.data);
      } else {
        setError(data.message || 'Teacher not found');
      }
    } catch (err) {
      setError('Failed to fetch teacher profile');
      console.error('Error fetching teacher:', err);
    } finally {
      setLoading(false);
    }
  }, [currentTeacherId]);

  useEffect(() => {
    if (currentTeacherId) {
      fetchTeacher();
    }
  }, [currentTeacherId, fetchTeacher]);

  const handleBook = (teacher: Teacher, serviceType?: { id: number; name: string; category: string }) => {
    onBook?.(teacher, serviceType);
    console.log('Booking with teacher:', teacher.name, serviceType);
  };

  const handleFavorite = (teacher: Teacher) => {
    setIsFavorited(!isFavorited);
    onFavorite?.(teacher);
  };

  const handleShare = (teacher: Teacher) => {
    if (navigator.share) {
      navigator.share({
        title: teacher.name,
        text: teacher.shortBio || teacher.bio,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    onShare?.(teacher);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!teacher) return;
    const images = [teacher.coverImage, ...teacher.galleryImages].filter(Boolean);
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="teacher-profile-loading">
        <div className="loading-spinner"></div>
        <p>Loading teacher profile...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="teacher-profile-error">
        <div className="error-content">
          <h2>Teacher Not Found</h2>
          <p>{error || 'The teacher you are looking for does not exist.'}</p>
          <button 
            className="teacher-button teacher-button--primary"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = [teacher.coverImage, ...teacher.galleryImages].filter(Boolean);

  return (
    <div className="teacher-profile-page">
      {/* Breadcrumb */}
      <div className="teacher-profile-page__breadcrumb">
        <button 
          className="breadcrumb-item"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">Teachers</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item active">{teacher.name}</span>
      </div>

      {/* Hero Section */}
      <div className="teacher-profile-page__hero">
        <div className="teacher-hero">
          {/* Cover Image */}
          {teacher.coverImage && (
            <div className="teacher-hero__cover">
              <Image 
                src={teacher.coverImage} 
                alt={`${teacher.name} cover`}
                width={1200}
                height={400}
                className="teacher-hero__cover-image"
              />
              <div className="teacher-hero__overlay">
                <div className="teacher-hero__actions">
                  <button 
                    className={`teacher-hero__action ${isFavorited ? 'active' : ''}`}
                    onClick={() => handleFavorite(teacher)}
                  >
                    <Heart size={20} />
                  </button>
                  <button 
                    className="teacher-hero__action"
                    onClick={() => handleShare(teacher)}
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="teacher-hero__info">
            <div className="teacher-hero__avatar">
              {teacher.avatarUrl ? (
                <Image 
                  src={teacher.avatarUrl} 
                  alt={teacher.name}
                  width={120}
                  height={120}
                  className="teacher-hero__avatar-image"
                />
              ) : (
                <div className="teacher-hero__avatar-placeholder">
                  {teacher.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="teacher-hero__content">
              <div className="teacher-hero__header">
                <h1 className="teacher-hero__name">{teacher.name}</h1>
                {teacher.featured && (
                  <div className="teacher-hero__featured">
                    <Star size={20} />
                    <span>Featured Teacher</span>
                  </div>
                )}
              </div>

              <div className="teacher-hero__meta">
                <div className="teacher-meta">
                  <Award size={18} />
                  <span>{teacher.experience} years experience</span>
                </div>
                <div className="teacher-meta">
                  <Users size={18} />
                  <span>
                    {teacher.minStudents}
                    {teacher.maxStudents && `-${teacher.maxStudents}`} students
                  </span>
                </div>
                {teacher.venue && (
                  <div className="teacher-meta">
                    <MapPin size={18} />
                    <span>{teacher.venue.name}</span>
                  </div>
                )}
              </div>

              <p className="teacher-hero__bio">
                {teacher.shortBio || teacher.bio}
              </p>

              <div className="teacher-hero__specialties">
                {teacher.specialties.map((specialty, index) => (
                  <span key={index} className="teacher-specialty">
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="teacher-hero__actions">
                <button 
                  className="teacher-button teacher-button--primary teacher-button--large"
                  onClick={() => handleBook(teacher)}
                >
                  <Calendar size={20} />
                  Book a Session
                </button>
                <button 
                  className="teacher-button teacher-button--secondary"
                  onClick={() => handleShare(teacher)}
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="teacher-profile-page__tabs">
        <div className="teacher-tabs">
          <button 
            className={`teacher-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <User size={20} />
            About
          </button>
          <button 
            className={`teacher-tab ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <CalendarDays size={20} />
            Schedule
          </button>
          <button 
            className={`teacher-tab ${activeTab === 'certifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('certifications')}
          >
            <Award size={20} />
            Certifications
          </button>
          <button 
            className={`teacher-tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Play size={20} />
            Gallery
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="teacher-profile-page__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="teacher-tab-content"
          >
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="teacher-about">
                <div className="teacher-about__main">
                  {/* Bio Section */}
                  {teacher.bio && (
                    <div className="teacher-about__section">
                      <h2>About {teacher.name}</h2>
                      <div className="teacher-about__bio">
                        {teacher.bio}
                      </div>
                    </div>
                  )}

                  {/* Teaching Philosophy */}
                  {teacher.philosophy && (
                    <div className="teacher-about__section">
                      <h2>Teaching Philosophy</h2>
                      <p className="teacher-about__philosophy">{teacher.philosophy}</p>
                    </div>
                  )}

                  {/* Teaching Style */}
                  {teacher.teachingStyle && (
                    <div className="teacher-about__section">
                      <h2>Teaching Style</h2>
                      <p className="teacher-about__style">{teacher.teachingStyle}</p>
                    </div>
                  )}

                  {/* Approach */}
                  {teacher.approach && (
                    <div className="teacher-about__section">
                      <h2>Approach</h2>
                      <p className="teacher-about__approach">{teacher.approach}</p>
                    </div>
                  )}

                  {/* Languages */}
                  {teacher.languages.length > 0 && (
                    <div className="teacher-about__section">
                      <h2>Languages</h2>
                      <div className="teacher-about__languages">
                        {teacher.languages.map((language, index) => (
                          <span key={index} className="teacher-language">
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="teacher-about__section">
                    <h2>Contact Information</h2>
                    <div className="teacher-about__contact">
                      {teacher.email && (
                        <div className="contact-item">
                          <Mail size={18} />
                          <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                        </div>
                      )}
                      {teacher.phone && (
                        <div className="contact-item">
                          <Phone size={18} />
                          <a href={`tel:${teacher.phone}`}>{teacher.phone}</a>
                        </div>
                      )}
                      {teacher.website && (
                        <div className="contact-item">
                          <Globe size={18} />
                          <a href={teacher.website} target="_blank" rel="noopener noreferrer">
                            Website <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social Media */}
                  {(teacher.instagram || teacher.facebook || teacher.linkedin) && (
                    <div className="teacher-about__section">
                      <h2>Follow {teacher.name}</h2>
                      <div className="teacher-about__social">
                        {teacher.instagram && (
                          <a 
                            href={`https://instagram.com/${teacher.instagram}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link social-link--instagram"
                          >
                            <Instagram size={20} />
                            @{teacher.instagram}
                          </a>
                        )}
                        {teacher.facebook && (
                          <a 
                            href={`https://facebook.com/${teacher.facebook}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link social-link--facebook"
                          >
                            <Facebook size={20} />
                            Facebook
                          </a>
                        )}
                        {teacher.linkedin && (
                          <a 
                            href={`https://linkedin.com/in/${teacher.linkedin}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-link social-link--linkedin"
                          >
                            <Linkedin size={20} />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="teacher-about__sidebar">
                  {/* Quick Stats */}
                  <div className="teacher-stats">
                    <h3>Quick Stats</h3>
                    <div className="teacher-stats__items">
                      <div className="stat-item">
                        <Award size={20} />
                        <div>
                          <div className="stat-value">{teacher.experience}</div>
                          <div className="stat-label">Years Experience</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <Users size={20} />
                        <div>
                          <div className="stat-value">
                            {teacher.minStudents}
                            {teacher.maxStudents && `-${teacher.maxStudents}`}
                          </div>
                          <div className="stat-label">Students per Class</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <BookOpen size={20} />
                        <div>
                          <div className="stat-value">{teacher.specialties.length}</div>
                          <div className="stat-label">Specialties</div>
                        </div>
                      </div>
                      <div className="stat-item">
                        <Award size={20} />
                        <div>
                          <div className="stat-value">{teacher.certifications.length}</div>
                          <div className="stat-label">Certifications</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Session CTA */}
                  <div className="teacher-cta">
                    <h3>Ready to Learn?</h3>
                    <p>Book a session with {teacher.name} and start your wellness journey.</p>
                    <button 
                      className="teacher-button teacher-button--primary teacher-button--full"
                      onClick={() => handleBook(teacher)}
                    >
                      <Calendar size={20} />
                      Book a Session
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="teacher-schedule">
                <h2>Weekly Schedule</h2>
                {teacher.teacherSchedules.length === 0 ? (
                  <div className="teacher-schedule__empty">
                    <Calendar size={48} />
                    <h3>No Schedule Available</h3>
                    <p>This teacher doesn&apos;t have any scheduled classes yet.</p>
                  </div>
                ) : (
                  <div className="teacher-schedule__grid">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                      const daySchedules = teacher.teacherSchedules.filter(schedule => schedule.dayOfWeek === day);
                      return (
                        <div key={day} className="schedule-day">
                          <h3 className="schedule-day__title">{day}</h3>
                          <div className="schedule-day__content">
                            {daySchedules.length === 0 ? (
                              <div className="schedule-day__empty">No classes</div>
                            ) : (
                              daySchedules.map(schedule => (
                                <div key={schedule.id} className="schedule-item">
                                  <div className="schedule-item__time">
                                    <Clock size={16} />
                                    <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                                  </div>
                                  {schedule.serviceType && (
                                    <div className="schedule-item__service">
                                      <div 
                                        className="schedule-item__service-badge"
                                        style={{ backgroundColor: schedule.serviceType.color || '#4CAF50' }}
                                      >
                                        {schedule.serviceType.name}
                                      </div>
                                    </div>
                                  )}
                                  <div className="schedule-item__venue">
                                    <MapPin size={16} />
                                    <span>{schedule.venue.name}</span>
                                  </div>
                                  <div className="schedule-item__capacity">
                                    <Users size={16} />
                                    <span>Max {schedule.maxBookings}</span>
                                  </div>
                                  <button 
                                    className="schedule-item__book"
                                    onClick={() => handleBook(teacher, schedule.serviceType)}
                                  >
                                    Book Now
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming Sessions */}
                {teacher.upcomingSessions.length > 0 && (
                  <div className="teacher-upcoming">
                    <h2>Upcoming Sessions</h2>
                    <div className="upcoming-sessions">
                      {teacher.upcomingSessions.map(session => (
                        <div key={session.id} className="upcoming-session">
                          <div className="upcoming-session__date">
                            <Calendar size={16} />
                            <span>{formatDate(session.startTime)}</span>
                          </div>
                          <div className="upcoming-session__time">
                            <Clock size={16} />
                            <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
                          </div>
                          {session.teacherSchedule.serviceType && (
                            <div className="upcoming-session__service">
                              {session.teacherSchedule.serviceType.name}
                            </div>
                          )}
                          <div className="upcoming-session__venue">
                            <MapPin size={16} />
                            <span>{session.teacherSchedule.venue.name}</span>
                          </div>
                          <div className="upcoming-session__availability">
                            <Users size={16} />
                            <span>
                              {session.bookedCount}/{session.maxBookings} booked
                            </span>
                          </div>
                          <button 
                            className="upcoming-session__book"
                            onClick={() => handleBook(teacher, session.teacherSchedule.serviceType)}
                          >
                            Book
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <div className="teacher-certifications">
                <h2>Certifications & Qualifications</h2>
                {teacher.certifications.length === 0 ? (
                  <div className="teacher-certifications__empty">
                    <Award size={48} />
                    <h3>No Certifications Listed</h3>
                    <p>This teacher hasn&apos;t added any certifications yet.</p>
                  </div>
                ) : (
                  <div className="certifications-grid">
                    {teacher.certifications.map(cert => (
                      <div key={cert.id} className="certification-card">
                        <div className="certification-card__header">
                          <div className="certification-card__icon">
                            <Award size={24} />
                          </div>
                          <div className="certification-card__verified">
                            {cert.isVerified && (
                              <CheckCircle size={16} className="verified-icon" />
                            )}
                          </div>
                        </div>
                        <div className="certification-card__content">
                          <h3 className="certification-card__name">{cert.name}</h3>
                          <p className="certification-card__organization">{cert.issuingOrganization}</p>
                          {cert.description && (
                            <p className="certification-card__description">{cert.description}</p>
                          )}
                          <div className="certification-card__dates">
                            {cert.issueDate && (
                              <div className="certification-date">
                                <span className="date-label">Issued:</span>
                                <span className="date-value">{formatDate(cert.issueDate)}</span>
                              </div>
                            )}
                            {cert.expiryDate && (
                              <div className="certification-date">
                                <span className="date-label">Expires:</span>
                                <span className="date-value">{formatDate(cert.expiryDate)}</span>
                              </div>
                            )}
                          </div>
                          {cert.credentialId && (
                            <div className="certification-card__credential">
                              <span className="credential-label">Credential ID:</span>
                              <span className="credential-value">{cert.credentialId}</span>
                            </div>
                          )}
                          {cert.credentialUrl && (
                            <a 
                              href={cert.credentialUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="certification-card__verify"
                            >
                              <ExternalLink size={16} />
                              Verify Credential
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="teacher-gallery">
                <h2>Gallery</h2>
                {images.length === 0 ? (
                  <div className="teacher-gallery__empty">
                    <Play size={48} />
                    <h3>No Media Available</h3>
                    <p>This teacher hasn&apos;t added any photos or videos yet.</p>
                  </div>
                ) : (
                  <div className="teacher-gallery__content">
                    {/* Video Section */}
                    {teacher.videoUrl && (
                      <div className="gallery-video">
                        <h3>Introduction Video</h3>
                        <div className="video-container">
                          {!isVideoPlaying ? (
                            <div className="video-thumbnail" onClick={() => setIsVideoPlaying(true)}>
                              <Image 
                                src={teacher.thumbnailUrl || teacher.coverImage || ''} 
                                alt="Video thumbnail"
                                width={400}
                                height={225}
                              />
                              <button className="video-play-button">
                                <Play size={48} />
                              </button>
                            </div>
                          ) : (
                            <video 
                              className="video-player"
                              controls
                              autoPlay
                              src={teacher.videoUrl}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Image Gallery */}
                    {images.length > 0 && (
                      <div className="gallery-images">
                        <h3>Photos</h3>
                        <div className="image-gallery">
                          <div className="image-gallery__main">
                            <Image 
                              src={images[currentImageIndex] || ''} 
                              alt={`${teacher.name} photo ${currentImageIndex + 1}`}
                              width={600}
                              height={400}
                              className="gallery-main-image"
                            />
                            {images.length > 1 && (
                              <>
                                <button 
                                  className="gallery-nav gallery-nav--prev"
                                  onClick={() => handleImageNavigation('prev')}
                                >
                                  <ChevronLeft size={24} />
                                </button>
                                <button 
                                  className="gallery-nav gallery-nav--next"
                                  onClick={() => handleImageNavigation('next')}
                                >
                                  <ChevronRight size={24} />
                                </button>
                              </>
                            )}
                          </div>
                          {images.length > 1 && (
                            <div className="image-gallery__thumbnails">
                              {images.map((image, index) => (
                                <button
                                  key={index}
                                  className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                  onClick={() => setCurrentImageIndex(index)}
                                >
                                  <Image src={image || ''} alt={`Thumbnail ${index + 1}`} width={80} height={60} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Related Teachers */}
      {teacher.relatedTeachers.length > 0 && (
        <div className="teacher-profile-page__related">
          <div className="related-teachers">
            <h2 className="related-teachers__title">Other Teachers You Might Like</h2>
            <div className="related-teachers__grid">
              {teacher.relatedTeachers.map((relatedTeacher) => (
                <motion.div
                  key={relatedTeacher.id}
                  className="related-teacher-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => router.push(`/teachers/${relatedTeacher.slug || relatedTeacher.id}`)}
                >
                  <div className="related-teacher-card__avatar">
                    {relatedTeacher.avatarUrl ? (
                      <Image 
                        src={relatedTeacher.avatarUrl} 
                        alt={relatedTeacher.name}
                        width={60}
                        height={60}
                      />
                    ) : (
                      <div className="related-teacher-card__avatar-placeholder">
                        {relatedTeacher.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="related-teacher-card__content">
                    <div className="related-teacher-card__header">
                      <h3 className="related-teacher-card__name">{relatedTeacher.name}</h3>
                      {relatedTeacher.featured && (
                        <div className="related-teacher-card__featured">
                          <Star size={16} />
                        </div>
                      )}
                    </div>
                    
                    <p className="related-teacher-card__bio">
                      {relatedTeacher.shortBio}
                    </p>
                    
                    <div className="related-teacher-card__meta">
                      <div className="teacher-meta">
                        <Award size={14} />
                        <span>{relatedTeacher.experience} years</span>
                      </div>
                      <div className="teacher-meta">
                        <BookOpen size={14} />
                        <span>{relatedTeacher.specialties.length} specialties</span>
                      </div>
                    </div>
                    
                    <div className="related-teacher-card__specialties">
                      {relatedTeacher.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="teacher-specialty teacher-specialty--small">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
