'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { TelegramAccountLink } from '@/components/TelegramAccountLink';

interface ClientProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  birthDate: string | null;
  birthTime: string | null;
  birthPlace: string | null;
  question: string | null;
  language: string;
  role: string;
  status: string;
  adminNotes: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  sessionType: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    question: '',
    language: 'en',
    notes: ''
  });

  const fetchProfile = useCallback(async () => {
    if (!user?.access_token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/client/me', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
          setFormData({
            fullName: data.data.fullName || '',
            phone: data.data.phone || '',
            birthDate: data.data.birthDate || '',
            birthTime: data.data.birthTime || '',
            birthPlace: data.data.birthPlace || '',
            question: data.data.question || '',
            language: data.data.language || 'en',
            notes: data.data.notes || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user?.access_token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!profile || !user?.access_token) return;

    setSaving(true);

    try {
      const response = await fetch('/api/client/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          question: formData.question,
          language: formData.language,
          notes: formData.notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Profile updated successfully');
          setIsEditing(false);
          fetchProfile(); // Refresh profile data
        } else {
          throw new Error(data.error || 'Failed to update profile');
        }
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        birthDate: profile.birthDate || '',
        birthTime: profile.birthTime || '',
        birthPlace: profile.birthPlace || '',
        question: profile.question || '',
        language: profile.language || 'en',
        notes: profile.notes || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-[var(--color-background-primary)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent-500)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)] text-lg font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--unified-text-primary)]">Profile</h1>
          <p className="text-[var(--unified-text-secondary)] mt-2">Manage your personal information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="unified-button unified-button--primary">
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleCancel} variant="outline" className="unified-button unified-button--outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="unified-button unified-button--primary">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="unified-card">
          <CardHeader className="unified-card__header">
            <CardTitle className="unified-card__title">Basic Information</CardTitle>
            <CardDescription className="unified-card__subtitle">Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="unified-card__content space-y-4">
            <div className="unified-form-group">
              <Label htmlFor="email" className="unified-form-label">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="unified-form-input"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="fullName" className="unified-form-label">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!isEditing}
                className="unified-form-input"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="phone" className="unified-form-label">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="unified-form-input"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="birthDate" className="unified-form-label">Date of Birth</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={!isEditing}
                className="unified-form-input"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="birthTime" className="unified-form-label">Time of Birth</Label>
              <Input
                id="birthTime"
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                disabled={!isEditing}
                className="unified-form-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="unified-card">
          <CardHeader className="unified-card__header">
            <CardTitle className="unified-card__title">Additional Information</CardTitle>
            <CardDescription className="unified-card__subtitle">Help us provide better service</CardDescription>
          </CardHeader>
          <CardContent className="unified-card__content space-y-4">
            <div className="unified-form-group">
              <Label htmlFor="birthPlace" className="unified-form-label">Place of Birth</Label>
              <Input
                id="birthPlace"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                disabled={!isEditing}
                className="unified-form-input"
                placeholder="City, Country"
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="language" className="unified-form-label">Preferred Language</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData({ ...formData, language: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className="unified-form-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="unified-form-select">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="unified-form-group">
              <Label htmlFor="question" className="unified-form-label">Spiritual Question/Preferences</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                disabled={!isEditing}
                className="unified-form-textarea"
                rows={3}
                placeholder="Your spiritual questions or preferences..."
              />
            </div>

            <div className="unified-form-group">
              <Label htmlFor="notes" className="unified-form-label">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={!isEditing}
                className="unified-form-textarea"
                rows={2}
                placeholder="Any additional information you'd like to share..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Telegram Account Linking */}
      <div className="mt-8">
        <TelegramAccountLink />
      </div>
    </div>
  );
}
