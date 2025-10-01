import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
  description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness in Miraflores, Lima. Meet our certified instructors and learn about our personalized sessions.',
  keywords: [
    'about matmax yoga',
    'yoga studio story',
    'yoga mission lima',
    'certified yoga instructors',
    'evidence-based yoga',
    'personalized yoga sessions',
    'yoga values lima',
    'wellness approach',
    'yoga philosophy',
    'matmax team'
  ],
  openGraph: {
    title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
    description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness in Miraflores, Lima.',
    type: 'website',
    url: 'https://matmax.world/about',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'About MatMax Yoga Studio - Our Story and Mission',
      },
    ],
  },
  twitter: {
    title: 'About Us - Our Story & Mission | MatMax Yoga Studio',
    description: 'Learn about MatMax Yoga Studio\'s story, mission, and values. Discover our evidence-based approach to yoga and wellness.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

'use client';

import React, { useState, useEffect } from 'react';
import { CentralizedHeader } from '@/components/CentralizedHeader';
import { Footer } from '@/components/Footer';
import { LoadingState } from '@/components/LoadingState';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import { StructuredData } from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Heart, 
  Award,
  Shield,
  Sparkles,
  Leaf
} from 'lucide-react';
import { toast } from 'sonner';

export default function AboutPage() {
  const { language } = useLanguage();
  const { t } = useTranslations(undefined, language);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Helper function to safely access nested translation properties
  const getTranslation = (path: string, fallback: string = ''): string => {
    const keys = path.split('.');
    let current: Record<string, unknown> = (t && typeof t === 'object') ? t as Record<string, unknown> : {};

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key] as Record<string, unknown>;
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  };

  if (loading) {
    return <LoadingState message="Loading about page..." />;
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message,
          language: language
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      toast.success(language === 'es' 
        ? '¡Mensaje enviado exitosamente! Te contactaremos pronto.' 
        : 'Message sent successfully! We will contact you soon.'
      );
      
      setIsSubmitted(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast.error(language === 'es' 
        ? 'Error al enviar el mensaje. Inténtalo de nuevo.' 
        : 'Error sending message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white mobile-container mobile-safe-area">
      {/* About Page Structured Data */}
      <StructuredData
        type="AboutPage"
        data={{
          name: "About MatMax Yoga Studio",
          description: "Learn about MatMax Yoga Studio's story, mission, and values. Discover our evidence-based approach to yoga and wellness in Miraflores, Lima.",
          url: "https://matmax.world/about",
          mainEntity: {
            name: "MatMax Yoga Studio",
            description: "Premium yoga studio offering personalized yoga classes, Hatha and Vinyasa yoga, and evidence-based wellness programs in Miraflores, Lima, Peru.",
            foundingDate: "2024",
            location: {
              address: "Miraflores, Lima, Peru",
              geo: {
                latitude: "-12.1194",
                longitude: "-77.0342"
              }
            }
          }
        }}
      />
      
      <CentralizedHeader
        user={null}
        isAdmin={false}
      />
      
      <main className="pt-20 mobile-content mobile-scrollable mobile-content-safe">
        {/* Our Story Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
              <div>
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 mobile-heading-scale"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {getTranslation('about.ourStoryTitle', 'Our Story')}
                </h2>
                <p 
                  className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed mobile-text-scale"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.ourStoryText', 'MatMax Yoga was founded with a simple yet powerful mission: to help people discover their potential through the practice of yoga and wellness. Located in the beautiful district of Miraflores, Lima, we\'ve created a welcoming space where individuals can focus on their physical and mental well-being.')}
                </p>
                <p 
                  className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed mobile-text-scale"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.ourApproachText', 'Our approach is grounded in evidence-based wellness practices, combining traditional yoga techniques with modern understanding of physical and mental health. We believe that everyone deserves access to quality wellness education and support.')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  <div className="flex items-center space-x-2 sm:space-x-3 mobile-touch-feedback">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mobile-text-scale">{getTranslation('about.certifiedInstructors', 'Certified Instructors')}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 mobile-touch-feedback">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mobile-text-scale">{getTranslation('about.evidenceBased', 'Evidence-Based Approach')}</span>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 mobile-touch-feedback">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mobile-text-scale">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative order-first lg:order-last">
                <div className="bg-gradient-to-br from-[#6ea058] to-[#558b2f] rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden mobile-touch-feedback">
                  <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white/10 rounded-full -translate-y-8 sm:-translate-y-12 md:-translate-y-16 translate-x-8 sm:translate-x-12 md:translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-white/10 rounded-full translate-y-6 sm:translate-y-8 md:translate-y-12 -translate-x-6 sm:-translate-x-8 md:-translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <h3 
                      className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6 mobile-heading-scale"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {getTranslation('about.ourMission', 'Our Mission')}
                    </h3>
                    <p 
                      className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 leading-relaxed mobile-text-scale"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {getTranslation('about.missionText', 'To provide accessible, high-quality yoga and wellness education that empowers individuals to improve their physical health, mental clarity, and overall quality of life.')}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">500+</div>
                        <div className="text-xs sm:text-sm opacity-90 mobile-text-scale">{getTranslation('about.studentsHelped', 'Students Helped')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">5+</div>
                        <div className="text-xs sm:text-sm opacity-90 mobile-text-scale">{getTranslation('about.yearsExperience', 'Years Experience')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 mobile-heading-scale"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {getTranslation('about.valuesTitle', 'Our Core Values')}
              </h2>
              <p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mobile-text-scale"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {getTranslation('about.valuesDescription', 'The principles that guide everything we do at MatMax Yoga')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.value1Title', 'Compassion')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.value1Description', 'We approach every client with deep empathy and understanding, creating a safe space for healing and growth.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.value2Title', 'Authenticity')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.value2Description', 'Our guidance comes from genuine spiritual wisdom and personal experience, not from textbooks or theories.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Leaf className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.value3Title', 'Transformation')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.value3Description', 'We believe in the power of real change and are committed to helping you achieve lasting transformation.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 mobile-heading-scale"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {getTranslation('about.whatWeOffer', 'What We Offer')}
              </h2>
              <p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mobile-text-scale"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {getTranslation('about.whatWeOfferDescription', 'Our comprehensive wellness programs are designed to support your journey to better health and well-being')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5 mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.personalizedSessionsDescription', 'One-on-one yoga sessions tailored to your specific needs, goals, and fitness level.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5 mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.wellnessFocus', 'Wellness Focus')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.wellnessFocusDescription', 'Evidence-based approaches to physical and mental wellness through yoga and mindfulness.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-4 sm:p-6 md:p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5 mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-gray-900 mobile-heading-scale">{getTranslation('about.flexibleScheduling', 'Flexible Scheduling')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed mobile-text-scale">
                      {getTranslation('about.flexibleSchedulingDescription', '1-hour sessions with 30-day validity, designed to fit your busy lifestyle.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-br from-[#6ea058] to-[#558b2f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
              {/* Contact Info */}
              <div className="text-white order-2 lg:order-1">
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 mobile-heading-scale"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {getTranslation('about.getInTouch', 'Get in Touch')}
                </h2>
                <p 
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 md:mb-12 leading-relaxed mobile-text-scale"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.getInTouchDescription', 'Ready to start your wellness journey? We\'d love to hear from you and answer any questions you might have.')}
                </p>

                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 md:space-x-6 mobile-touch-feedback">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 mobile-heading-scale">{getTranslation('about.location', 'Location')}</h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-lg leading-relaxed mobile-text-scale">Calle Alcanfores 425, Miraflores, Lima - Peru</p>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 md:space-x-6 mobile-touch-feedback">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 mobile-heading-scale">{getTranslation('about.phone', 'Phone')}</h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-lg mobile-text-scale">+51 916 172 368</p>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 md:space-x-6 mobile-touch-feedback">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 mobile-heading-scale">{getTranslation('about.email', 'Email')}</h3>
                      <p className="text-white/90 text-xs sm:text-sm md:text-lg mobile-text-scale">info@matmax.world</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="order-1 lg:order-2">
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl mobile-touch-feedback">
                  <CardHeader className="pb-3 sm:pb-4 md:pb-6">
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl text-gray-900 text-center mobile-heading-scale">
                      {getTranslation('about.sendMessage', 'Send us a Message')}
                    </CardTitle>
                    <p className="text-gray-600 text-center text-sm sm:text-base md:text-lg mobile-text-scale">
                      {getTranslation('about.sendMessageDescription', 'Fill out the form below and we\'ll get back to you via email')}
                    </p>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-4 md:px-6">
                    {isSubmitted ? (
                      <div className="text-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 mobile-heading-scale">
                          {language === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!'}
                        </h3>
                        <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base mobile-text-scale">
                          {language === 'es' 
                            ? 'Gracias por contactarnos. Te responderemos pronto por email.' 
                            : 'Thank you for contacting us. We will respond to you soon via email.'
                          }
                        </p>
                        <Button
                          onClick={resetForm}
                          className="bg-[#6ea058] hover:bg-[#558b2f] text-white mobile-touch-feedback touch-manipulation"
                        >
                          {language === 'es' ? 'Enviar Otro Mensaje' : 'Send Another Message'}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3 sm:space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                          <div>
                            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 mobile-text-scale">
                              {getTranslation('about.name', 'Name')} *
                            </label>
                            <Input
                              id="name"
                              type="text"
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg touch-manipulation"
                              placeholder={getTranslation('about.namePlaceholder', 'Your full name')}
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 mobile-text-scale">
                              {getTranslation('about.email', 'Email')} *
                            </label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg touch-manipulation"
                              placeholder={getTranslation('about.emailPlaceholder', 'your@email.com')}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 mobile-text-scale">
                            {getTranslation('about.phone', 'Phone')}
                          </label>
                          <Input
                            id="phone"
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base md:text-lg touch-manipulation"
                            placeholder={getTranslation('about.phonePlaceholder', '+51 999 999 999')}
                          />
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 mobile-text-scale">
                            {getTranslation('about.message', 'Message')} *
                          </label>
                          <Textarea
                            id="message"
                            required
                            rows={3}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full text-sm sm:text-base md:text-lg resize-none touch-manipulation"
                            placeholder={getTranslation('about.messagePlaceholder', 'Tell us about your wellness goals and how we can help...')}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-11 sm:h-12 md:h-14 bg-[#6ea058] hover:bg-[#558b2f] text-white text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mobile-touch-feedback touch-manipulation"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                              <span className="text-sm sm:text-base">{language === 'es' ? 'Enviando...' : 'Sending...'}</span>
                            </div>
                          ) : (
                            language === 'es' ? 'Enviar Mensaje' : 'Send Message'
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}