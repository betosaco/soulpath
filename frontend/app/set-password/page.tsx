'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';

export default function SetPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [token, setToken] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token') || '';
    setToken(t);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!token || !password || !confirm) {
      setError('Please provide token and passwords');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const j = await res.json();
      if (!res.ok || !j.success) {
        setError(j.error || 'Failed to set password');
      } else {
        setMessage('Password saved. You can now log in.');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-6 max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Set Your Password</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button className="w-full border rounded px-3 py-2" disabled={loading}>
            {loading ? 'Saving...' : 'Save Password'}
          </button>
        </form>
        {message && <p className="text-green-600 mt-3">{message}</p>}
        {error && <p className="text-red-600 mt-3">{error}</p>}
      </div>
    </AppShell>
  );
}


