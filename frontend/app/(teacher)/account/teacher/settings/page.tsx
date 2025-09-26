'use client';

import React from 'react';
import { teacherUI } from '@/lib/styles/teacher-ui';
import { SettingsIcon } from 'lucide-react';

export default function TeacherSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<any>({
    bankName: '',
    accountNumber: '',
    accountType: '',
    ruc: '',
    payoutEmail: '',
    payoutPhone: '',
    documentType: '',
    documentNumber: ''
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/settings/payment', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load settings');
      const j = await res.json();
      if (j.data) setForm({ ...form, ...j.data });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error loading settings');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const onSave = async () => {
    setError(null);
    try {
      const res = await fetch('/api/teacher/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      await load();
      alert('Payment settings saved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error saving settings');
    }
  };

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
            <div className="space-y-8">
              {/* Bank Details */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Bank details</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Where to send payouts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Bank name</label>
                    <input name="bankName" value={form.bankName || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Account number</label>
                    <input name="accountNumber" value={form.accountNumber || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Account type</label>
                    <input name="accountType" value={form.accountType || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                </div>
              </section>

              <hr className="border-[var(--unified-border-light)]" />

              {/* Payout Contact */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Payout contact</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">How we confirm or notify payouts.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Payout email</label>
                    <input type="email" name="payoutEmail" value={form.payoutEmail || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Payout phone</label>
                    <input type="tel" name="payoutPhone" value={form.payoutPhone || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                </div>
              </section>

              <hr className="border-[var(--unified-border-light)]" />

              {/* Tax & Documents */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-[var(--unified-text-primary)]">Tax & documents</h3>
                  <p className="text-sm text-[var(--unified-text-secondary)]">Identification for invoicing and compliance.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">RUC</label>
                    <input name="ruc" value={form.ruc || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Document type</label>
                    <input name="documentType" value={form.documentType || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--unified-text-secondary)] mb-1">Document number</label>
                    <input name="documentNumber" value={form.documentNumber || ''} onChange={onChange} className="w-full border rounded px-3 py-2 bg-[var(--unified-bg-surface)] text-[var(--unified-text-primary)]" />
                  </div>
                </div>
              </section>

              <div className="flex justify-end border-t border-[var(--unified-border-light)] pt-4">
                <button onClick={onSave} className="px-4 py-2 bg-[var(--unified-primary)] text-white rounded hover:bg-[var(--unified-primary-hover)] transition-colors">Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


