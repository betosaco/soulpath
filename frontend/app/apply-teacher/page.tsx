import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
  description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles. Flexible schedule and competitive rates.',
  keywords: [
    'yoga instructor jobs lima',
    'yoga teacher application',
    'yoga instructor positions',
    'teach yoga lima',
    'yoga instructor opportunities',
    'yoga teacher jobs peru',
    'certified yoga instructor',
    'yoga studio employment',
    'yoga teaching positions',
    'wellness instructor jobs'
  ],
  openGraph: {
    title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
    description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles.',
    type: 'website',
    url: 'https://matmax.world/apply-teacher',
    images: [
      {
        url: '/matpass-logo.png',
        width: 1200,
        height: 630,
        alt: 'Apply to Teach Yoga at MatMax Yoga Studio',
      },
    ],
  },
  twitter: {
    title: 'Apply to Teach Yoga | Join Our Team | MatMax Yoga Studio',
    description: 'Join MatMax Yoga Studio as a certified yoga instructor in Miraflores, Lima. Apply now to teach Hatha, Vinyasa, and other yoga styles.',
    images: ['/matpass-logo.png'],
  },
  alternates: {
    canonical: '/apply-teacher',
  },
};

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Calendar, FileText, Upload, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { AppShell } from '@/components/AppShell';

interface TeacherApplicationForm {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Information
  yogaStyle: string;
  experienceYears: string;
  certifications: string;
  teachingLanguages: string[];
  availability: string;
  motivation: string;
  
  // Terms and Conditions
  agreeToTerms: boolean;
  agreeToDataProcessing: boolean;
}

const YOGA_STYLES = [
  'Hatha Yoga',
  'Vinyasa Flow',
  'Ashtanga Yoga',
  'Yin Yoga',
  'Restorative Yoga',
  'Power Yoga',
  'Hot Yoga',
  'Yoga Prenatal',
  'Yoga para Adultos Mayores',
  'Meditación',
  'Pranayama',
  'Otro'
];

const LANGUAGES = [
  'Español',
  'English',
  'Português',
  'Français',
  'Italiano',
  'Deutsch',
  'Otro'
];

const EXPERIENCE_LEVELS = [
  '0-1 años',
  '1-3 años',
  '3-5 años',
  '5-10 años',
  '10+ años'
];

export default function ApplyTeacherPage() {
  const [formData, setFormData] = useState<TeacherApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    yogaStyle: '',
    experienceYears: '',
    certifications: '',
    teachingLanguages: [],
    availability: '',
    motivation: '',
    agreeToTerms: false,
    agreeToDataProcessing: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: keyof TeacherApplicationForm, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      teachingLanguages: prev.teachingLanguages.includes(language)
        ? prev.teachingLanguages.filter(l => l !== language)
        : [...prev.teachingLanguages, language]
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof TeacherApplicationForm)[] = [
      'firstName', 'lastName', 'email', 'phone', 'yogaStyle', 'experienceYears', 'motivation'
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field].trim() === '')) {
        const fieldNames: Record<string, string> = {
          firstName: 'nombre',
          lastName: 'apellido',
          email: 'correo electrónico',
          phone: 'teléfono',
          yogaStyle: 'estilo de yoga',
          experienceYears: 'años de experiencia',
          motivation: 'motivación'
        };
        toast.error(`Por favor completa el campo ${fieldNames[field] || field}`);
        return false;
      }
    }

    if (formData.teachingLanguages.length === 0) {
      toast.error('Por favor selecciona al menos un idioma de enseñanza');
      return false;
    }

    if (!formData.agreeToTerms || !formData.agreeToDataProcessing) {
      toast.error('Por favor acepta los términos y condiciones');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor ingresa una dirección de correo electrónico válida');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/teacher-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setIsSubmitted(true);
      toast.success('¡Solicitud enviada exitosamente! Te contactaremos pronto.');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error al enviar la solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AppShell>
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">¡Solicitud Enviada!</h2>
                <p className="text-muted-foreground mb-6">
                  Gracias por tu interés en unirte al equipo de MatMax. Hemos recibido tu solicitud y la revisaremos cuidadosamente.
                </p>
                <p className="text-sm text-muted-foreground">
                  Te contactaremos dentro de 5-7 días hábiles para discutir los siguientes pasos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-accent-50)] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Únete a Nuestro Equipo</h1>
            <p className="text-xl text-muted-foreground">
              Postula para ser profesor de yoga en MatMax Wellness
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-6 h-6 text-[var(--color-primary-500)]" />
                Formulario de Solicitud de Profesor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Ingresa tu apellido"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu.correo@ejemplo.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Número de Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+51 999 999 999"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Información Profesional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yogaStyle">Estilo Principal de Yoga *</Label>
                    <Select value={formData.yogaStyle} onValueChange={(value) => handleInputChange('yogaStyle', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu estilo principal de yoga" />
                      </SelectTrigger>
                      <SelectContent>
                        {YOGA_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experienceYears">Años de Experiencia Enseñando *</Label>
                    <Select value={formData.experienceYears} onValueChange={(value) => handleInputChange('experienceYears', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel de experiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="certifications">Certificaciones y Entrenamientos</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => handleInputChange('certifications', e.target.value)}
                    placeholder="Lista tus certificaciones de yoga, programas de entrenamiento y calificaciones relevantes"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Idiomas de Enseñanza *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {LANGUAGES.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.teachingLanguages.includes(language)}
                          onCheckedChange={() => handleLanguageToggle(language)}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="availability">Disponibilidad</Label>
                  <Textarea
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    placeholder="Describe tu disponibilidad (días, horarios, flexibilidad)"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="motivation">¿Por qué quieres enseñar en MatMax? *</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    placeholder="Cuéntanos sobre tu pasión por enseñar y por qué te gustaría unirte a nuestro equipo"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Términos y Condiciones</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      Acepto los <a href="/terms" className="text-[var(--color-primary-500)] hover:underline">Términos de Servicio</a> y la <a href="/privacy" className="text-[var(--color-primary-500)] hover:underline">Política de Privacidad</a> *
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToDataProcessing"
                      checked={formData.agreeToDataProcessing}
                      onCheckedChange={(checked) => handleInputChange('agreeToDataProcessing', checked as boolean)}
                    />
                    <Label htmlFor="agreeToDataProcessing" className="text-sm">
                      Consiento el procesamiento de mis datos personales para el propósito de esta solicitud *
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Solicitud
                    </>
                  )}
                </Button>
              </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
