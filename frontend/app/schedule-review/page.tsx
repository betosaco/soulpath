'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Package, 
  ArrowLeft, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CentralizedHeader } from '@/components/CentralizedHeader';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useTranslations';
import { toast } from 'sonner';

interface Teacher {
  id: number;
  name: string;
  bio?: string;
  shortBio?: string;
  experience: number;
  avatarUrl?: string;
}

interface ServiceType {
  id: number;
  name: string;
  description?: string;
  shortDescription?: string;
  duration: number;
  difficulty?: string;
  color?: string;
  icon?: string;
}

interface Venue {
  id: number;
  name: string;
  address?: string;
  city?: string;
}

interface ScheduleSlot {
  id: number;
  date: string;
  time: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
  duration: number;
  teacher: Teacher;
  serviceType: ServiceType;
  venue: Venue;
  dayOfWeek: string;
}

interface PersonalInfo {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  countryCode: string;
  language: 'en' | 'es';
  specialRequests?: string;
}

export default function ScheduleReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const [slotData, setSlotData] = useState<ScheduleSlot | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    countryCode: '+51',
    language: 'en'
  });
  const [packageInfo, setPackageInfo] = useState<{
    id: string;
    name: string;
    price: string;
    currency: string;
    sessions: string;
    duration: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load slot data from URL parameters
  useEffect(() => {
    const loadSlotData = async () => {
      try {
        const slotId = searchParams.get('slotId');
        const teacherId = searchParams.get('teacherId');
        const serviceTypeId = searchParams.get('serviceTypeId');
        const venueId = searchParams.get('venueId');
        const date = searchParams.get('date');
        const time = searchParams.get('time');

        if (!slotId || !teacherId || !serviceTypeId || !venueId || !date || !time) {
          toast.error('Missing booking information. Please try again.');
          router.push('/packages');
          return;
        }

        // Create mock slot data from URL parameters
        // In a real app, you'd fetch this from your API
        const mockSlot: ScheduleSlot = {
          id: parseInt(slotId),
          date: date,
          time: time,
          isAvailable: true,
          capacity: 1,
          bookedCount: 0,
          duration: 60,
          teacher: {
            id: parseInt(teacherId),
            name: 'Available Instructor',
            experience: 5,
            bio: 'Experienced wellness instructor'
          },
          serviceType: {
            id: parseInt(serviceTypeId),
            name: 'Wellness Session',
            description: 'Personalized wellness session',
            duration: 60,
            difficulty: 'all levels'
          },
          venue: {
            id: parseInt(venueId),
            name: 'MatMax Yoga Studio',
            address: 'Calle Alcanfores 425, Miraflores',
            city: 'Lima'
          },
          dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' })
        };

        setSlotData(mockSlot);
        
        // Load package information from URL parameters
        const packageId = searchParams.get('packageId');
        const packageName = searchParams.get('packageName');
        const packagePrice = searchParams.get('packagePrice');
        const packageCurrency = searchParams.get('packageCurrency');
        const packageSessions = searchParams.get('packageSessions');
        const packageDuration = searchParams.get('packageDuration');
        
        if (packageId && packageName && packagePrice) {
          setPackageInfo({
            id: packageId,
            name: packageName,
            price: packagePrice,
            currency: packageCurrency || 'S/',
            sessions: packageSessions || '1',
            duration: packageDuration || '60'
          });
        }
        
        // Load personal information from URL parameters
        const clientName = searchParams.get('clientName');
        const clientEmail = searchParams.get('clientEmail');
        const clientPhone = searchParams.get('clientPhone');
        const countryCode = searchParams.get('countryCode');
        const language = searchParams.get('language');
        
        if (clientName || clientEmail || clientPhone) {
          setPersonalInfo({
            clientName: clientName || '',
            clientEmail: clientEmail || '',
            clientPhone: clientPhone || '',
            countryCode: countryCode || '+51',
            language: (language as 'en' | 'es') || 'en'
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading slot data:', error);
        toast.error('Error loading booking information');
        router.push('/packages');
      }
    };

    loadSlotData();
  }, [searchParams, router]);

  const handleWhatsAppBooking = async () => {
    if (!slotData) return;

    setSending(true);
    
    try {
      // Create comprehensive WhatsApp message
      const whatsappMessage = `¡Hola! Me interesa realizar una reserva:

📋 *Información del Cliente:*
• Nombre completo: ${personalInfo.clientName || 'No especificado'}
• Email: ${personalInfo.clientEmail || 'No especificado'}
• Teléfono: ${personalInfo.countryCode}${personalInfo.clientPhone || 'No especificado'}
• Idioma preferido: ${personalInfo.language === 'en' ? 'English' : 'Español'}

📦 *Paquete Seleccionado:*
• Nombre: ${packageInfo?.name || 'No especificado'}
• Precio: ${packageInfo?.currency || 'S/'}${packageInfo?.price || '0.00'}
• Número de sesiones: ${packageInfo?.sessions || 'No especificado'}
• Duración por sesión: ${packageInfo?.duration || 'No especificado'} minutos

📅 *Detalles de la Reserva:*
• Fecha: ${new Date(slotData.date).toLocaleDateString('es-ES', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  })}
• Hora: ${new Date(`2000-01-01T${slotData.time}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
• Instructor: ${slotData.teacher.name}
• Tipo de servicio: ${slotData.serviceType.name}
• Duración: ${slotData.duration} minutos
• Lugar: ${slotData.venue.name}
• Dirección: ${slotData.venue.address}, ${slotData.venue.city}

📍 *Ubicación del Estudio:*
MatMax Yoga. Calle Alcanfores 425, Miraflores. Lima - Peru

💬 *Información adicional:*
• ID de orden: order_${Date.now()}
• Fecha de solicitud: ${new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
• Hora de solicitud: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

¿Podrían ayudarme a completar mi reserva? ¡Gracias!`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const phoneNumber = '51916172368'; // +51 916 172 368
      
      // Create WhatsApp URLs
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      toast.success('¡Redirigido a WhatsApp! Completa tu reserva allí.');
      
    } catch (error) {
      console.error('Error creating WhatsApp message:', error);
      toast.error('Error al procesar la reserva. Por favor, contacta directamente al +51 916 172 368');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted text-lg">Loading booking information...</p>
        </div>
      </div>
    );
  }

  if (!slotData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 text-lg mb-4">Error loading booking information</p>
          <Button 
            onClick={() => router.push('/packages')}
            className="bg-[#6ea058] hover:bg-[#5a8a47] text-white"
          >
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CentralizedHeader
        user={null}
        isAdmin={false}
      />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4 text-primary"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Review Your Booking
            </h1>
            <p 
              className="text-xl text-muted"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Please review your session details and personal information before confirming
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Session Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Session Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date & Time */}
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-lg">{formatDate(slotData.date)}</p>
                      <p className="text-muted">{slotData.dayOfWeek}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-lg">{formatTime(slotData.time)}</p>
                      <p className="text-muted">{slotData.duration} minutes</p>
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-lg mb-2">Service Type</h4>
                    <p className="text-muted">{slotData.serviceType.name}</p>
                    {slotData.serviceType.description && (
                      <p className="text-sm text-gray-600 mt-1">{slotData.serviceType.description}</p>
                    )}
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{slotData.teacher.name}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{slotData.venue.name}</p>
                      <p className="text-sm text-muted">{slotData.venue.address}, {slotData.venue.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Package Information */}
            {packageInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="card-base">
                  <CardHeader>
                    <CardTitle className="text-2xl text-primary flex items-center gap-2">
                      <Package className="w-6 h-6" />
                      Selected Package
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold text-lg text-primary mb-2">{packageInfo.name}</h4>
                      <div className="text-2xl font-bold text-primary">
                        {packageInfo.currency}{packageInfo.price}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted">Sessions:</span>
                        <span className="font-semibold ml-2">{packageInfo.sessions}</span>
                      </div>
                      <div>
                        <span className="text-muted">Duration:</span>
                        <span className="font-semibold ml-2">{packageInfo.duration} min each</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Personal Information Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-base">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Your Information
                  </CardTitle>
                  <p className="text-muted">Please provide your details for the booking</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-black text-lg font-medium mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={personalInfo.clientName}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, clientName: e.target.value }))}
                      className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 w-full"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-black text-lg font-medium mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={personalInfo.clientEmail}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, clientEmail: e.target.value }))}
                      className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 w-full"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-black text-lg font-medium mb-2 block">
                      Phone Number *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={personalInfo.countryCode}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, countryCode: e.target.value }))}
                        className="h-14 px-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="+51">🇵🇪 +51</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+55">🇧🇷 +55</option>
                      </select>
                      <input
                        type="tel"
                        value={personalInfo.clientPhone}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="h-14 px-4 text-lg border-2 border-gray-300 text-black placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200 flex-1"
                        placeholder="987654321"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-black text-lg font-medium mb-2 block">
                      Preferred Language
                    </label>
                    <select
                      value={personalInfo.language}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, language: e.target.value as 'en' | 'es' }))}
                      className="h-14 w-full px-4 text-lg border-2 border-gray-300 text-black focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg transition-all duration-200"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button
              variant="outline"
              onClick={() => router.push('/packages')}
              className="px-8 py-4 text-lg text-[#6ea058] border-2 border-[#6ea058] hover:bg-[#6ea058] hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Packages
            </Button>
            
            <Button
              onClick={handleWhatsAppBooking}
              disabled={!personalInfo.clientName || !personalInfo.clientEmail || !personalInfo.clientPhone || sending}
              className="px-8 py-4 text-lg bg-[#6ea058] hover:bg-[#5a8a47] text-white"
            >
              {sending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send to WhatsApp
                </>
              )}
            </Button>
          </motion.div>

          {/* Confirmation Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center"
          >
            <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 font-medium">
              By clicking "Send to WhatsApp", you'll be redirected to WhatsApp to complete your booking with our team.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
