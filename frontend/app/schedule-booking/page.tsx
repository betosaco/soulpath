'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseButton } from '@/components/ui/BaseButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDate, formatTime } from '@/lib/utils';
import { CentralizedHeader } from '@/components/CentralizedHeader';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import Link from 'next/link';

interface ScheduleSlot {
  id: number;
  date: string;
  time: string;
  duration: number;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
  serviceType: {
    name: string;
    description?: string;
    difficulty?: string;
  };
  teacher: {
    id: number;
    name: string;
    bio?: string;
    experience?: number;
    avatarUrl?: string;
  };
  venue: {
    id: number;
    name: string;
    address?: string;
    city?: string;
  };
  price?: number;
}

export default function ScheduleBookingPage() {
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations(undefined, language);
  
  const [slot, setSlot] = useState<ScheduleSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    question: '',
    specialRequests: '',
    language: 'en'
  });

  // Ensure we have a valid translation object
  const safeT: Record<string, string | Record<string, string>> = 
    (t && typeof t === 'object' && Object.keys(t).length > 0) 
      ? t as Record<string, string | Record<string, string>>
      : { common: { login: 'Login' } };

  useEffect(() => {
    const loadSlotData = async () => {
      try {
        setLoading(true);
        
        // Get slot parameters from URL
        const slotId = searchParams.get('slotId');
        const teacherId = searchParams.get('teacherId');
        const serviceTypeId = searchParams.get('serviceTypeId');
        const venueId = searchParams.get('venueId');
        const date = searchParams.get('date');
        const time = searchParams.get('time');

        if (!slotId || !teacherId || !serviceTypeId || !venueId || !date || !time) {
          setError('Missing required slot information');
          return;
        }

        // Create a mock slot object with the provided data
        // In a real app, you would fetch this from an API
        const mockSlot: ScheduleSlot = {
          id: parseInt(slotId),
          date: date,
          time: time,
          duration: 60, // Default 60 minutes
          capacity: 1,
          bookedCount: 0,
          isAvailable: true,
          serviceType: {
            name: 'Spiritual Reading',
            description: 'Personalized spiritual consultation and guidance',
            difficulty: 'All Levels'
          },
          teacher: {
            id: parseInt(teacherId),
            name: 'Spiritual Guide',
            bio: 'Certified spiritual consultant with years of experience',
            experience: 5,
            avatarUrl: undefined
          },
          venue: {
            id: parseInt(venueId),
            name: 'MatMax Studio',
            address: 'Calle Alcanfores 425, Miraflores',
            city: 'Lima'
          },
          price: 8000 // $80 USD in cents
        };

        setSlot(mockSlot);
      } catch (err) {
        console.error('Error loading slot data:', err);
        setError('Failed to load schedule information');
      } finally {
        setLoading(false);
      }
    };

    loadSlotData();
  }, [searchParams]);

  const handleWhatsAppBooking = () => {
    if (!slot) return;

    const message = `¡Hola! Me interesa reservar una sesión:

📅 *Detalles de la Sesión:*
• Fecha: ${new Date(slot.date).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })}
• Hora: ${new Date(`${slot.date}T${slot.time}`).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}
• Duración: ${slot.duration} minutos
• Tipo de servicio: ${slot.serviceType.name}
• Descripción: ${slot.serviceType.description || 'Servicio de bienestar'}
• Dificultad: ${slot.serviceType.difficulty || 'Todos los niveles'}

👨‍🏫 *Información del Instructor:*
• Nombre: ${slot.teacher.name}
• Experiencia: ${slot.teacher.experience} años
• Biografía: ${slot.teacher.bio || 'Instructor certificado'}

📍 *Ubicación:*
• Lugar: ${slot.venue.name}
• Dirección: ${slot.venue.address || 'Calle Alcanfores 425, Miraflores. Lima - Peru'}
• Ciudad: ${slot.venue.city || 'Lima'}

👤 *Información Personal:*
• Nombre: ${formData.clientName || 'No proporcionado'}
• Email: ${formData.clientEmail || 'No proporcionado'}
• Teléfono: ${formData.clientPhone || 'No proporcionado'}
• Fecha de nacimiento: ${formData.birthDate ? new Date(formData.birthDate).toLocaleDateString('es-ES') : 'No proporcionada'}
• Hora de nacimiento: ${formData.birthTime || 'No proporcionada'}
• Lugar de nacimiento: ${formData.birthPlace || 'No proporcionado'}
• Idioma: ${formData.language === 'en' ? 'Inglés' : 'Español'}

❓ *Pregunta/Áreas de enfoque:*
${formData.question || 'No especificada'}

${formData.specialRequests ? `📝 *Solicitudes especiales:*
${formData.specialRequests}

` : ''}👥 *Disponibilidad:*
• Capacidad: ${slot.capacity} personas
• Reservas actuales: ${slot.bookedCount} personas
• Espacios disponibles: ${slot.capacity - slot.bookedCount} espacios

💰 *Información de Pago:*
• Precio: $${((slot.price || 8000) / 100).toFixed(2)} USD

💬 *Información adicional:*
• ID de sesión: slot_${slot.id}
• Día de la semana: ${new Date(slot.date).toLocaleDateString('es-ES', { weekday: 'long' })}
• Fecha de solicitud: ${new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
• Hora de solicitud: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

¿Podrían ayudarme a completar mi reserva? ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = '51916172368'; // +51 916 172 368
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    try {
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Error al abrir WhatsApp. Por favor, contacta directamente al +51 916 172 368');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CentralizedHeader
          user={null}
          isAdmin={false}
        />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !slot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CentralizedHeader
          user={null}
          isAdmin={false}
        />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-6 text-center">
                <div className="text-red-500 mb-4">
                  <AlertCircle size={48} className="mx-auto" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600 mb-6">{error || 'Schedule information not found'}</p>
                <Link href="/schedule">
                  <BaseButton className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Schedule
                  </BaseButton>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CentralizedHeader
        user={null}
        isAdmin={false}
      />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link href="/schedule">
                <BaseButton 
                  variant="outline" 
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Schedule
                </BaseButton>
              </Link>
            </div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Session Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Calendar className="mr-3 text-blue-600" size={28} />
                      Session Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date and Time */}
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-900">
                          {formatDate(slot.date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="text-blue-600" size={20} />
                        <span className="font-medium text-gray-900">
                          {formatTime(slot.time)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {slot.duration} minutes
                      </div>
                    </div>

                    {/* Service Type */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">{slot.serviceType.name}</h3>
                      <p className="text-gray-600 mb-2">{slot.serviceType.description}</p>
                      {slot.serviceType.difficulty && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {slot.serviceType.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Teacher Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <User className="mr-2 text-blue-600" size={20} />
                        Instructor
                      </h3>
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{slot.teacher.name}</h4>
                          {slot.teacher.experience && (
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Award className="mr-1" size={14} />
                              {slot.teacher.experience} years experience
                            </div>
                          )}
                          {slot.teacher.bio && (
                            <p className="text-sm text-gray-600">{slot.teacher.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Venue Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <MapPin className="mr-2 text-blue-600" size={20} />
                        Location
                      </h3>
                      <div>
                        <h4 className="font-medium text-gray-900">{slot.venue.name}</h4>
                        {slot.venue.address && (
                          <p className="text-sm text-gray-600">{slot.venue.address}</p>
                        )}
                        {slot.venue.city && (
                          <p className="text-sm text-gray-600">{slot.venue.city}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <User className="mr-3 text-blue-600" size={24} />
                      Your Information
                    </CardTitle>
                    <p className="text-gray-600 text-sm">
                      Please provide your details for the booking confirmation
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientName" className="text-sm font-medium">Full Name *</Label>
                        <Input
                          id="clientName"
                          value={formData.clientName}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                          className="mt-1"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientEmail" className="text-sm font-medium">Email *</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                          className="mt-1"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone" className="text-sm font-medium">Phone</Label>
                        <Input
                          id="clientPhone"
                          type="tel"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                          className="mt-1"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                        <Select
                          value={formData.language}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">🇺🇸 English</SelectItem>
                            <SelectItem value="es">🇪🇸 Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="birthDate" className="text-sm font-medium">Birth Date *</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthTime" className="text-sm font-medium">Birth Time (Optional)</Label>
                        <Input
                          id="birthTime"
                          type="time"
                          value={formData.birthTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="birthPlace" className="text-sm font-medium">Birth Place *</Label>
                      <Input
                        id="birthPlace"
                        value={formData.birthPlace}
                        onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
                        className="mt-1"
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="question" className="text-sm font-medium">Question/Focus Areas *</Label>
                      <Textarea
                        id="question"
                        value={formData.question}
                        onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                        className="mt-1"
                        placeholder="What would you like to explore in your reading?"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="specialRequests" className="text-sm font-medium">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        className="mt-1"
                        placeholder="Any special requests or additional information..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Booking Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        ${((slot.price || 8000) / 100).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 mb-4">USD</div>
                      <div className="text-sm text-gray-500">
                        One-time session fee
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Availability Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{slot.capacity} person</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booked:</span>
                        <span className="font-medium">{slot.bookedCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available:</span>
                        <span className="font-medium text-green-600">
                          {slot.capacity - slot.bookedCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp Booking Button */}
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare className="text-green-600" size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Book via WhatsApp
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Send all your booking details directly to our team for confirmation
                        </p>
                      </div>
                      <BaseButton
                        onClick={handleWhatsAppBooking}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
                      >
                        <MessageSquare size={20} />
                        <span>Book via WhatsApp</span>
                      </BaseButton>
                      <p className="text-xs text-gray-500">
                        You'll be redirected to WhatsApp with all session details pre-filled
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        <span>Personalized spiritual consultation</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        <span>Expert guidance and insights</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        <span>Follow-up support</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={16} />
                        <span>Confidential session</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
