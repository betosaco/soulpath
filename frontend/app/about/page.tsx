'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
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
    <AppShell>
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
      
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">About MatMax Yoga Studio</h1>
            <p className="text-xl text-muted-foreground">
              Your sanctuary for wellness, growth, and transformation in the heart of Miraflores, Lima
            </p>
          </div>

          {/* Our Story Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    {getTranslation('about.ourStoryTitle', 'Our Story')}
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {getTranslation('about.ourStoryText', 'MatMax Yoga was founded with a simple yet powerful mission: to help people discover their potential through the practice of yoga and wellness. Located in the beautiful district of Miraflores, Lima, we\'ve created a welcoming space where individuals can focus on their physical and mental well-being.')}
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {getTranslation('about.ourApproachText', 'Our approach is grounded in evidence-based wellness practices, combining traditional yoga techniques with modern understanding of physical and mental health. We believe that everyone deserves access to quality wellness education and support.')}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{getTranslation('about.certifiedInstructors', 'Certified Instructors')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{getTranslation('about.evidenceBased', 'Evidence-Based Approach')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-4">
                        {getTranslation('about.ourMission', 'Our Mission')}
                      </h3>
                      <p className="text-white/90 mb-6 leading-relaxed">
                        {getTranslation('about.missionText', 'To provide accessible, high-quality yoga and wellness education that empowers individuals to improve their physical health, mental clarity, and overall quality of life.')}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-1">500+</div>
                          <div className="text-sm opacity-90">{getTranslation('about.studentsHelped', 'Students Helped')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-1">5+</div>
                          <div className="text-sm opacity-90">{getTranslation('about.yearsExperience', 'Years Experience')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {getTranslation('about.valuesTitle', 'Our Core Values')}
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {getTranslation('about.valuesDescription', 'The principles that guide everything we do at MatMax Yoga')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.value1Title', 'Compassion')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.value1Description', 'We approach every client with deep empathy and understanding, creating a safe space for healing and growth.')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.value2Title', 'Authenticity')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.value2Description', 'Our guidance comes from genuine spiritual wisdom and personal experience, not from textbooks or theories.')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.value3Title', 'Transformation')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.value3Description', 'We believe in the power of real change and are committed to helping you achieve lasting transformation.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* What We Offer Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {getTranslation('about.whatWeOffer', 'What We Offer')}
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {getTranslation('about.whatWeOfferDescription', 'Our comprehensive wellness programs are designed to support your journey to better health and well-being')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[var(--color-primary-500)]/5 to-[var(--color-accent-500)]/5">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.personalizedSessionsDescription', 'One-on-one yoga sessions tailored to your specific needs, goals, and fitness level.')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[var(--color-primary-500)]/5 to-[var(--color-accent-500)]/5">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.wellnessFocus', 'Wellness Focus')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.wellnessFocusDescription', 'Evidence-based approaches to physical and mental wellness through yoga and mindfulness.')}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[var(--color-primary-500)]/5 to-[var(--color-accent-500)]/5">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent-500)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{getTranslation('about.flexibleScheduling', 'Flexible Scheduling')}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">
                      {getTranslation('about.flexibleSchedulingDescription', '1-hour sessions with 30-day validity, designed to fit your busy lifestyle.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">
                    {getTranslation('about.getInTouch', 'Get in Touch')}
                  </h2>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {getTranslation('about.getInTouchDescription', 'Ready to start your wellness journey? We\'d love to hear from you and answer any questions you might have.')}
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{getTranslation('about.location', 'Location')}</h3>
                        <p className="text-muted-foreground">Calle Alcanfores 425, Miraflores, Lima - Peru</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{getTranslation('about.phone', 'Phone')}</h3>
                        <p className="text-muted-foreground">+51 916 172 368</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[var(--color-primary-500)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-[var(--color-primary-500)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{getTranslation('about.email', 'Email')}</h3>
                        <p className="text-muted-foreground">info@matmax.world</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <Card className="bg-white border shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl text-foreground text-center">
                        {getTranslation('about.sendMessage', 'Send us a Message')}
                      </CardTitle>
                      <p className="text-muted-foreground text-center">
                        {getTranslation('about.sendMessageDescription', 'Fill out the form below and we\'ll get back to you via email')}
                      </p>
                    </CardHeader>
                    <CardContent className="px-6">
                      {isSubmitted ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {language === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!'}
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            {language === 'es' 
                              ? 'Gracias por contactarnos. Te responderemos pronto por email.' 
                              : 'Thank you for contacting us. We will respond to you soon via email.'
                            }
                          </p>
                          <Button
                            onClick={resetForm}
                            className="bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white"
                          >
                            {language === 'es' ? 'Enviar Otro Mensaje' : 'Send Another Message'}
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                {getTranslation('about.name', 'Name')} *
                              </label>
                              <Input
                                id="name"
                                type="text"
                                required
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                className="w-full"
                                placeholder={getTranslation('about.namePlaceholder', 'Your full name')}
                              />
                            </div>
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                {getTranslation('about.email', 'Email')} *
                              </label>
                              <Input
                                id="email"
                                type="email"
                                required
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                className="w-full"
                                placeholder={getTranslation('about.emailPlaceholder', 'your@email.com')}
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                              {getTranslation('about.phone', 'Phone')}
                            </label>
                            <Input
                              id="phone"
                              type="tel"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              className="w-full"
                              placeholder={getTranslation('about.phonePlaceholder', '+51 999 999 999')}
                            />
                          </div>

                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                              {getTranslation('about.message', 'Message')} *
                            </label>
                            <Textarea
                              id="message"
                              required
                              rows={4}
                              value={contactForm.message}
                              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                              className="w-full resize-none"
                              placeholder={getTranslation('about.messagePlaceholder', 'Tell us about your wellness goals and how we can help...')}
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>{language === 'es' ? 'Enviando...' : 'Sending...'}</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}