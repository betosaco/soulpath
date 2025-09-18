'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Package, 
  User, 
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BaseButton } from './ui/BaseButton';
import { formatDate, formatTime } from '@/lib/utils';

interface CustomerPackage {
  id: string;
  name: string;
  description: string;
  sessionsRemaining: number;
  totalSessions: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'completed';
  purchaseDate: string;
  price: number;
  sessionDuration: number;
}

interface AvailableSchedule {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  capacity: number;
  bookedCount: number;
  sessionType: string;
  price: number;
  teacher?: {
    name: string;
    bio?: string;
    experience?: number;
  };
  venue?: {
    name: string;
    address?: string;
    city?: string;
  };
  serviceType?: {
    name: string;
    description?: string;
    difficulty?: string;
  };
}

interface BookingFormData {
  selectedPackage: CustomerPackage | null;
  selectedSchedule: AvailableSchedule | null;
  selectedPaymentMethod: any;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
  specialRequests: string;
  language: string;
}

interface BookingSummaryPageProps {
  formData: BookingFormData;
  onBack: () => void;
  onProceedToPayment: () => void;
  onProceedToWhatsApp: () => void;
  showPaymentButton?: boolean;
}

export function BookingSummaryPage({ 
  formData, 
  onBack, 
  onProceedToPayment, 
  onProceedToWhatsApp,
  showPaymentButton = true 
}: BookingSummaryPageProps) {
  
  const formatWhatsAppMessage = () => {
    if (!formData.selectedSchedule) return '';
    
    const schedule = formData.selectedSchedule;
    const packageData = formData.selectedPackage;
    
    return `¡Hola! Me interesa reservar una sesión:

📅 *Detalles de la Sesión:*
• Fecha: ${new Date(schedule.date).toLocaleDateString('es-ES', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })}
• Hora: ${new Date(`${schedule.date}T${schedule.time}`).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}
• Duración: ${packageData?.sessionDuration || 60} minutos
• Tipo de servicio: ${schedule.serviceType?.name || 'Spiritual Reading'}
• Descripción: ${schedule.serviceType?.description || 'Servicio de bienestar'}
• Dificultad: ${schedule.serviceType?.difficulty || 'Todos los niveles'}

👨‍🏫 *Información del Instructor:*
• Nombre: ${schedule.teacher?.name || 'Spiritual Guide'}
• Experiencia: ${schedule.teacher?.experience || 5} años
• Biografía: ${schedule.teacher?.bio || 'Instructor certificado'}

📍 *Ubicación:*
• Lugar: ${schedule.venue?.name || 'MatMax Studio'}
• Dirección: ${schedule.venue?.address || 'Calle Alcanfores 425, Miraflores. Lima - Peru'}
• Ciudad: ${schedule.venue?.city || 'Lima'}

👤 *Información Personal:*
• Nombre: ${formData.clientName}
• Email: ${formData.clientEmail}
• Teléfono: ${formData.clientPhone || 'No proporcionado'}
• Fecha de nacimiento: ${new Date(formData.birthDate).toLocaleDateString('es-ES')}
• Hora de nacimiento: ${formData.birthTime || 'No proporcionada'}
• Lugar de nacimiento: ${formData.birthPlace}
• Idioma: ${formData.language === 'en' ? 'Inglés' : 'Español'}

❓ *Pregunta/Áreas de enfoque:*
${formData.question}

${formData.specialRequests ? `📝 *Solicitudes especiales:*
${formData.specialRequests}

` : ''}💰 *Información de Pago:*
• Paquete: ${packageData?.name || 'Sesión individual'}
• Sesiones restantes: ${packageData?.sessionsRemaining || 0}/${packageData?.totalSessions || 1}
• Precio: $${((schedule.price || 8000) / 100).toFixed(2)} USD

💬 *Información adicional:*
• ID de sesión: slot_${schedule.id}
• Fecha de solicitud: ${new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}
• Hora de solicitud: ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

¿Podrían ayudarme a completar mi reserva? ¡Gracias!`;
  };


  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Review Your Booking</h2>
        <p className="text-gray-400">Please review all information before proceeding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Details */}
        <Card className="bg-[#1a1a2e] border-[#16213e]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar size={20} className="mr-2 text-[#ffd700]" />
              Session Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
              <Package size={24} className="text-[#ffd700]" />
              <div className="flex-1">
                <p className="text-white font-medium">{formData.selectedPackage?.name}</p>
                <p className="text-sm text-gray-400">
                  {formData.selectedPackage?.sessionsRemaining} sessions remaining
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
              <Clock size={24} className="text-[#ffd700]" />
              <div className="flex-1">
                <p className="text-white font-medium">
                  {formatDate(formData.selectedSchedule!.date)}
                </p>
                <p className="text-sm text-gray-400">
                  {formatTime(formData.selectedSchedule!.time)} • {formData.selectedPackage?.sessionDuration} min
                </p>
              </div>
            </div>

            {formData.selectedSchedule?.teacher && (
              <div className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
                <User size={24} className="text-[#ffd700]" />
                <div className="flex-1">
                  <p className="text-white font-medium">{formData.selectedSchedule.teacher.name}</p>
                  <p className="text-sm text-gray-400">
                    {formData.selectedSchedule.teacher.experience} years experience
                  </p>
                </div>
              </div>
            )}

            {formData.selectedSchedule?.venue && (
              <div className="flex items-center space-x-3 p-3 bg-[#16213e] rounded-lg">
                <MapPin size={24} className="text-[#ffd700]" />
                <div className="flex-1">
                  <p className="text-white font-medium">{formData.selectedSchedule.venue.name}</p>
                  <p className="text-sm text-gray-400">
                    {formData.selectedSchedule.venue.address}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-[#1a1a2e] border-[#16213e]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User size={20} className="mr-2 text-[#ffd700]" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User size={16} className="text-[#ffd700]" />
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-medium">{formData.clientName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-[#ffd700]" />
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-medium">{formData.clientEmail}</p>
                </div>
              </div>

              {formData.clientPhone && (
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-[#ffd700]" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">{formData.clientPhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-[#ffd700]" />
                <div>
                  <p className="text-gray-400 text-sm">Birth Date</p>
                  <p className="text-white font-medium">{formatDate(formData.birthDate)}</p>
                </div>
              </div>

              {formData.birthTime && (
                <div className="flex items-center space-x-3">
                  <Clock size={16} className="text-[#ffd700]" />
                  <div>
                    <p className="text-gray-400 text-sm">Birth Time</p>
                    <p className="text-white font-medium">{formData.birthTime}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-[#ffd700]" />
                <div>
                  <p className="text-gray-400 text-sm">Birth Place</p>
                  <p className="text-white font-medium">{formData.birthPlace}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Globe size={16} className="text-[#ffd700]" />
                <div>
                  <p className="text-gray-400 text-sm">Language</p>
                  <p className="text-white font-medium">
                    {formData.language === 'en' ? 'English' : 'Español'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question and Special Requests */}
      <Card className="bg-[#1a1a2e] border-[#16213e]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare size={20} className="mr-2 text-[#ffd700]" />
            Your Questions & Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Question/Focus Areas</p>
            <p className="text-gray-300 bg-[#16213e] p-3 rounded-lg">
              {formData.question}
            </p>
          </div>
          
          {formData.specialRequests && (
            <div>
              <p className="text-gray-400 text-sm mb-2">Special Requests</p>
              <p className="text-gray-300 bg-[#16213e] p-3 rounded-lg">
                {formData.specialRequests}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card className="bg-[#1a1a2e] border-[#16213e]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle size={20} className="mr-2 text-[#ffd700]" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center p-4 bg-[#16213e] rounded-lg">
            <div>
              <p className="text-white font-medium">{formData.selectedPackage?.name}</p>
              <p className="text-sm text-gray-400">
                {formatDate(formData.selectedSchedule!.date)} at {formatTime(formData.selectedSchedule!.time)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[#ffd700]">
                ${((formData.selectedSchedule!.price || 8000) / 100).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">USD</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <BaseButton
          variant="outline"
          onClick={onBack}
          className="border-[#2a2a4a] text-gray-400 hover:bg-[#2a2a4a] hover:text-white mobile-touch-target mobile-button"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Details
        </BaseButton>

        <div className="flex flex-col sm:flex-row gap-3">
          {showPaymentButton && (
            <BaseButton
              onClick={onProceedToPayment}
              className="dashboard-button-primary mobile-touch-target mobile-button"
            >
              Proceed to Payment
              <ArrowRight size={16} className="ml-2" />
            </BaseButton>
          )}
          
          <BaseButton
            onClick={onProceedToWhatsApp}
            className="bg-green-600 hover:bg-green-700 text-white mobile-touch-target mobile-button"
          >
            <MessageSquare size={16} className="mr-2" />
            Continue via WhatsApp
          </BaseButton>
        </div>
      </div>

      {/* WhatsApp Preview */}
      <Card className="bg-[#1a1a2e] border-[#16213e]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare size={20} className="mr-2 text-green-500" />
            WhatsApp Message Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#16213e] p-4 rounded-lg max-h-64 overflow-y-auto">
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
              {formatWhatsAppMessage()}
            </pre>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            This message will be sent to +51 916 172 368 when you click "Continue via WhatsApp"
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
