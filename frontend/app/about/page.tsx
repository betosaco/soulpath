'use client';

import React, { useState } from 'react';
import { CentralizedHeader } from '@/components/CentralizedHeader';
import { Footer } from '@/components/Footer';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
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
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  // Helper function to safely access nested translation properties
  const getTranslation = (path: string, fallback: string = ''): string => {
    const keys = path.split('.');
    let current: any = (t && typeof t === 'object') ? t : {};

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }

    return typeof current === 'string' ? current : fallback;
  };
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const whatsappMessage = language === 'es' 
        ? `¡Hola! Me gustaría contactar con ustedes:

📋 *Información de Contacto:*
• Nombre: ${contactForm.name}
• Email: ${contactForm.email}
• Teléfono: ${contactForm.phone}

💬 *Mensaje:*
${contactForm.message}

📍 *Ubicación del Estudio:*
MatMax Yoga. Calle Alcanfores 425, Miraflores. Lima - Peru

¿Podrían ayudarme? ¡Gracias!`
        : `Hello! I would like to contact you:

📋 *Contact Information:*
• Name: ${contactForm.name}
• Email: ${contactForm.email}
• Phone: ${contactForm.phone}

💬 *Message:*
${contactForm.message}

📍 *Studio Location:*
MatMax Yoga. Calle Alcanfores 425, Miraflores. Lima - Peru

Could you help me? Thank you!`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const phoneNumber = '51916172368';
      
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      toast.success(language === 'es' ? '¡Redirigido a WhatsApp! Te ayudaremos allí.' : 'Redirected to WhatsApp! We\'ll help you there.');
      
      setContactForm({ name: '', email: '', phone: '', message: '' });
      
    } catch (error) {
      console.error('Error creating WhatsApp message:', error);
      toast.error(language === 'es' ? 'Error al enviar el mensaje. Inténtalo de nuevo.' : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <CentralizedHeader
        user={null}
        isAdmin={false}
      />
      
      <main className="pt-20">
        {/* Our Story Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {getTranslation('about.ourStoryTitle', 'Our Story')}
                </h2>
                <p 
                  className="text-lg text-gray-600 mb-6 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.ourStoryText', 'MatMax Yoga was founded with a simple yet powerful mission: to help people discover their potential through the practice of yoga and wellness. Located in the beautiful district of Miraflores, Lima, we\'ve created a welcoming space where individuals can focus on their physical and mental well-being.')}
                </p>
                <p 
                  className="text-lg text-gray-600 mb-8 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.ourApproachText', 'Our approach is grounded in evidence-based wellness practices, combining traditional yoga techniques with modern understanding of physical and mental health. We believe that everyone deserves access to quality wellness education and support.')}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-gray-700 font-medium">{getTranslation('about.certifiedInstructors', 'Certified Instructors')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-gray-700 font-medium">{getTranslation('about.evidenceBased', 'Evidence-Based Approach')}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#6ea058]/10 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#6ea058]" />
                    </div>
                    <span className="text-gray-700 font-medium">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-[#6ea058] to-[#558b2f] rounded-3xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <h3 
                      className="text-3xl font-bold mb-6"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {getTranslation('about.ourMission', 'Our Mission')}
                    </h3>
                    <p 
                      className="text-lg mb-8 leading-relaxed"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {getTranslation('about.missionText', 'To provide accessible, high-quality yoga and wellness education that empowers individuals to improve their physical health, mental clarity, and overall quality of life.')}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">500+</div>
                        <div className="text-sm opacity-90">{getTranslation('about.studentsHelped', 'Students Helped')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">5+</div>
                        <div className="text-sm opacity-90">{getTranslation('about.yearsExperience', 'Years Experience')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {getTranslation('about.valuesTitle', 'Our Core Values')}
              </h2>
              <p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {getTranslation('about.valuesDescription', 'The principles that guide everything we do at MatMax Yoga')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.value1Title', 'Compassion')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.value1Description', 'We approach every client with deep empathy and understanding, creating a safe space for healing and growth.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.value2Title', 'Authenticity')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.value2Description', 'Our guidance comes from genuine spiritual wisdom and personal experience, not from textbooks or theories.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Leaf className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.value3Title', 'Transformation')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.value3Description', 'We believe in the power of real change and are committed to helping you achieve lasting transformation.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {getTranslation('about.whatWeOffer', 'What We Offer')}
              </h2>
              <p 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {getTranslation('about.whatWeOfferDescription', 'Our comprehensive wellness programs are designed to support your journey to better health and well-being')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.personalizedSessions', 'Personalized Sessions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.personalizedSessionsDescription', 'One-on-one yoga sessions tailored to your specific needs, goals, and fitness level.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Heart className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.wellnessFocus', 'Wellness Focus')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.wellnessFocusDescription', 'Evidence-based approaches to physical and mental wellness through yoga and mindfulness.')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="text-center p-8 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-[#6ea058]/5 to-[#8bc34a]/5">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6ea058] to-[#8bc34a] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-10 h-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">{getTranslation('about.flexibleScheduling', 'Flexible Scheduling')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {getTranslation('about.flexibleSchedulingDescription', '60-minute sessions with 30-day validity, designed to fit your busy lifestyle.')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-gradient-to-br from-[#6ea058] to-[#558b2f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Info */}
              <div className="text-white">
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-8"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {getTranslation('about.getInTouch', 'Get in Touch')}
                </h2>
                <p 
                  className="text-xl text-white/90 mb-12 leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {getTranslation('about.getInTouchDescription', 'Ready to start your wellness journey? We\'d love to hear from you and answer any questions you might have.')}
                </p>

                <div className="space-y-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{getTranslation('about.location', 'Location')}</h3>
                      <p className="text-white/90 text-lg">Calle Alcanfores 425, Miraflores, Lima - Peru</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{getTranslation('about.phone', 'Phone')}</h3>
                      <p className="text-white/90 text-lg">+51 916 172 368</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{getTranslation('about.email', 'Email')}</h3>
                      <p className="text-white/90 text-lg">info@matmax.world</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-3xl text-gray-900 text-center">
                      {getTranslation('about.sendMessage', 'Send us a Message')}
                    </CardTitle>
                    <p className="text-gray-600 text-center text-lg">
                      {getTranslation('about.sendMessageDescription', 'Fill out the form below and we\'ll get back to you via WhatsApp')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            {getTranslation('about.name', 'Name')} *
                          </label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full h-12 text-lg"
                            placeholder={getTranslation('about.namePlaceholder', 'Your full name')}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            {getTranslation('about.email', 'Email')} *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full h-12 text-lg"
                            placeholder={getTranslation('about.emailPlaceholder', 'your@email.com')}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          {getTranslation('about.phone', 'Phone')}
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full h-12 text-lg"
                          placeholder={getTranslation('about.phonePlaceholder', '+51 999 999 999')}
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                          {getTranslation('about.message', 'Message')} *
                        </label>
                        <Textarea
                          id="message"
                          required
                          rows={5}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full text-lg"
                          placeholder={getTranslation('about.messagePlaceholder', 'Tell us about your wellness goals and how we can help...')}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-[#6ea058] hover:bg-[#558b2f] text-white text-lg font-semibold transition-all duration-300 hover:scale-105"
                      >
                        {isSubmitting 
                          ? (language === 'es' ? 'Enviando...' : 'Sending...') 
                          : (language === 'es' ? 'Enviar por WhatsApp' : 'Send via WhatsApp')
                        }
                      </Button>
                    </form>
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