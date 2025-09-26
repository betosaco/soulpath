'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { SettingsIcon, CreditCard, User, Bell, Save } from 'lucide-react';

export default function TeacherSettingsPage() {
  const [activeTab, setActiveTab] = React.useState('payment');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [paymentForm, setPaymentForm] = React.useState<any>({
    bankName: '',
    accountNumber: '',
    accountType: '',
    ruc: '',
    payoutEmail: '',
    payoutPhone: '',
    documentType: '',
    documentNumber: ''
  });
  const [profileForm, setProfileForm] = React.useState<any>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    shortBio: '',
    website: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });
  const [preferencesForm, setPreferencesForm] = React.useState<any>({
    maxStudents: '',
    minStudents: '',
    preferredTimes: [],
    teachingStyle: '',
    philosophy: '',
    approach: '',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const loadPaymentSettings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/settings/payment', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load payment settings');
      const j = await res.json();
      if (j.data) setPaymentForm({ ...paymentForm, ...j.data });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading payment settings');
    }
  }, [paymentForm]);

  const loadProfileSettings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/profile', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load profile settings');
      const j = await res.json();
      if (j.data) setProfileForm({ ...profileForm, ...j.data });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading profile settings');
    }
  }, [profileForm]);

  const loadPreferencesSettings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/teacher/preferences', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load preferences settings');
      const j = await res.json();
      if (j.data) setPreferencesForm({ ...preferencesForm, ...j.data });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading preferences settings');
    }
  }, [preferencesForm]);

  const loadAllSettings = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadPaymentSettings(),
        loadProfileSettings(),
        loadPreferencesSettings()
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading settings');
    } finally {
      setLoading(false);
    }
  }, [loadPaymentSettings, loadProfileSettings, loadPreferencesSettings]);

  React.useEffect(() => { loadAllSettings(); }, [loadAllSettings]);

  const onChangePayment = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentForm((f: any) => ({ ...f, [name]: value }));
  };

  const onChangeProfile = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((f: any) => ({ ...f, [name]: value }));
  };

  const onChangePreferences = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : undefined;
    if (type === 'checkbox') {
      const [parentKey, childKey] = name.split('.');
      setPreferencesForm((f: any) => ({
        ...f,
        [parentKey]: { ...f[parentKey], [childKey]: checked }
      }));
    } else {
      setPreferencesForm((f: any) => ({ ...f, [name]: value }));
    }
  };

  const onSavePayment = async () => {
    setError(null);
    try {
      const res = await fetch('/api/teacher/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });
      if (!res.ok) throw new Error('Failed to save payment settings');
      await loadPaymentSettings();
      alert('Payment settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error saving payment settings');
    }
  };

  const onSaveProfile = async () => {
    setError(null);
    try {
      const res = await fetch('/api/teacher/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      if (!res.ok) throw new Error('Failed to save profile settings');
      await loadProfileSettings();
      alert('Profile settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error saving profile settings');
    }
  };

  const onSavePreferences = async () => {
    setError(null);
    try {
      const res = await fetch('/api/teacher/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferencesForm)
      });
      if (!res.ok) throw new Error('Failed to save preferences settings');
      await loadPreferencesSettings();
      alert('Preferences settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error saving preferences settings');
    }
  };

  const tabs = [
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      <div className={teacherUI.card.container}>
        <div className={teacherUI.card.header}>
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-5 w-5 text-[var(--color-primary-500)]" />
            <h2 className="text-xl font-semibold text-[var(--unified-text-primary)]">Settings</h2>
          </div>
        </div>
        <div className={teacherUI.card.body}>
          {loading && <p className="text-[var(--unified-text-secondary)]">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-[var(--unified-border-light)] mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-[var(--unified-primary)] text-[var(--unified-primary)]'
                          : 'border-transparent text-[var(--unified-text-secondary)] hover:text-[var(--unified-text-primary)] hover:border-[var(--unified-border-light)]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="space-y-4">
                {activeTab === 'payment' && (
                  <div className="space-y-4">
              {/* Bank Details */}
                    <section className="space-y-2">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Bank details</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Where to send payouts.</p>
                </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Bank name</label>
                          <input 
                            name="bankName" 
                            value={paymentForm.bankName || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Account number</label>
                          <input 
                            name="accountNumber" 
                            value={paymentForm.accountNumber || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Account type</label>
                          <input 
                            name="accountType" 
                            value={paymentForm.accountType || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                </div>
              </section>

              <hr className="border-[var(--unified-border-light)]" />

              {/* Payout Contact */}
                    <section className="space-y-2">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Payout contact</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">How we confirm or notify payouts.</p>
                </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Payout email</label>
                          <input 
                            type="email" 
                            name="payoutEmail" 
                            value={paymentForm.payoutEmail || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Payout phone</label>
                          <input 
                            type="tel" 
                            name="payoutPhone" 
                            value={paymentForm.payoutPhone || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                </div>
              </section>

              <hr className="border-[var(--unified-border-light)]" />

              {/* Tax & Documents */}
                    <section className="space-y-2">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Tax & documents</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Identification for invoicing and compliance.</p>
                </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">RUC</label>
                          <input 
                            name="ruc" 
                            value={paymentForm.ruc || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Document type</label>
                          <input 
                            name="documentType" 
                            value={paymentForm.documentType || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Document number</label>
                          <input 
                            name="documentNumber" 
                            value={paymentForm.documentNumber || ''} 
                            onChange={onChangePayment} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                  </div>
                </div>
              </section>

              <div className="flex justify-end border-t border-[var(--unified-border-light)] pt-4">
                      <button 
                        onClick={onSavePayment} 
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--unified-primary)] text-white rounded hover:bg-[var(--unified-primary-hover)] transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Payment Settings
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <section className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Basic Information</h3>
                        <p className="text-sm text-[var(--unified-text-secondary)]">Your personal details and contact information.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Full Name</label>
                          <input 
                            name="name" 
                            value={profileForm.name || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Email</label>
                          <input 
                            type="email" 
                            name="email" 
                            value={profileForm.email || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Phone</label>
                          <input 
                            type="tel" 
                            name="phone" 
                            value={profileForm.phone || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                      </div>
                    </section>

                    <hr className="border-[var(--unified-border-light)]" />

                    {/* Bio Information */}
                    <section className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Bio Information</h3>
                        <p className="text-sm text-[var(--unified-text-secondary)]">Tell students about yourself and your teaching approach.</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Short Bio (max 500 characters)</label>
                          <textarea 
                            name="shortBio" 
                            value={profileForm.shortBio || ''} 
                            onChange={onChangeProfile} 
                            rows={3}
                            maxLength={500}
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                          <p className="text-xs text-[var(--unified-text-secondary)] mt-1">
                            {profileForm.shortBio?.length || 0}/500 characters
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Full Bio</label>
                          <textarea 
                            name="bio" 
                            value={profileForm.bio || ''} 
                            onChange={onChangeProfile} 
                            rows={6}
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                      </div>
                    </section>

                    <hr className="border-[var(--unified-border-light)]" />

                    {/* Social Links */}
                    <section className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Social Links</h3>
                        <p className="text-sm text-[var(--unified-text-secondary)]">Connect your social media and website.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Website</label>
                          <input 
                            type="url" 
                            name="website" 
                            value={profileForm.website || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Instagram</label>
                          <input 
                            name="instagram" 
                            value={profileForm.instagram || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Facebook</label>
                          <input 
                            name="facebook" 
                            value={profileForm.facebook || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">LinkedIn</label>
                          <input 
                            name="linkedin" 
                            value={profileForm.linkedin || ''} 
                            onChange={onChangeProfile} 
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                      </div>
                    </section>

                    <div className="flex justify-end border-t border-[var(--unified-border-light)] pt-4">
                      <button 
                        onClick={onSaveProfile} 
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--unified-primary)] text-white rounded hover:bg-[var(--unified-primary-hover)] transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Profile Settings
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-4">
                    {/* Teaching Preferences */}
                    <section className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Teaching Preferences</h3>
                        <p className="text-sm text-[var(--unified-text-secondary)]">Configure your teaching style and class preferences.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Minimum Students</label>
                          <input 
                            type="number" 
                            name="minStudents" 
                            value={preferencesForm.minStudents || ''} 
                            onChange={onChangePreferences} 
                            min="1"
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Maximum Students</label>
                          <input 
                            type="number" 
                            name="maxStudents" 
                            value={preferencesForm.maxStudents || ''} 
                            onChange={onChangePreferences} 
                            min="1"
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Teaching Style</label>
                          <textarea 
                            name="teachingStyle" 
                            value={preferencesForm.teachingStyle || ''} 
                            onChange={onChangePreferences} 
                            rows={3}
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Teaching Philosophy</label>
                          <textarea 
                            name="philosophy" 
                            value={preferencesForm.philosophy || ''} 
                            onChange={onChangePreferences} 
                            rows={3}
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Teaching Approach</label>
                          <textarea 
                            name="approach" 
                            value={preferencesForm.approach || ''} 
                            onChange={onChangePreferences} 
                            rows={3}
                            className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)] border-[var(--unified-border-light)]" 
                          />
                        </div>
                      </div>
                    </section>

                    <hr className="border-[var(--unified-border-light)]" />

                    {/* Notification Preferences */}
                    <section className="space-y-2">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Notification Preferences</h3>
                        <p className="text-sm text-[var(--unified-text-secondary)]">Choose how you want to receive notifications.</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            name="notifications.email" 
                            checked={preferencesForm.notifications?.email || false} 
                            onChange={onChangePreferences} 
                            className="rounded border-[var(--unified-border-light)]"
                          />
                          <label className="text-sm text-[var(--unified-text-primary)]">Email notifications</label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            name="notifications.sms" 
                            checked={preferencesForm.notifications?.sms || false} 
                            onChange={onChangePreferences} 
                            className="rounded border-[var(--unified-border-light)]"
                          />
                          <label className="text-sm text-[var(--unified-text-primary)]">SMS notifications</label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            name="notifications.push" 
                            checked={preferencesForm.notifications?.push || false} 
                            onChange={onChangePreferences} 
                            className="rounded border-[var(--unified-border-light)]"
                          />
                          <label className="text-sm text-[var(--unified-text-primary)]">Push notifications</label>
                        </div>
                      </div>
                    </section>

                    <div className="flex justify-end border-t border-[var(--unified-border-light)] pt-4">
                      <button 
                        onClick={onSavePreferences} 
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--unified-primary)] text-white rounded hover:bg-[var(--unified-primary-hover)] transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        Save Preferences
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


