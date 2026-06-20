'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-8">
      <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
        <Lock className="text-[#FACC15]" size={28} />
      </div>
      <h1 className="text-3xl font-black mb-2">Reset Password</h1>
      <p className="text-[#6B7280] mb-8">Enter your new password below.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
          className="input-field" placeholder="New password" />
        <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
          className="input-field" placeholder="Confirm password" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !token} className="btn-primary w-full py-3">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16">
      <Link href="/login" className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-8 text-sm font-semibold">
        <ArrowLeft size={16} /> Back to Login
      </Link>
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
