'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16">
      <Link href="/login" className="flex items-center gap-2 text-[#6B7280] hover:text-[#111827] mb-8 text-sm font-semibold">
        <ArrowLeft size={16} /> Back to Login
      </Link>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-8">
        <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
          <Mail className="text-[#FACC15]" size={28} />
        </div>
        <h1 className="text-3xl font-black mb-2">Forgot Password?</h1>
        <p className="text-[#6B7280] mb-8">Enter your email and we'll send you a reset link.</p>
        {message ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="input-field" placeholder="you@email.com" />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
