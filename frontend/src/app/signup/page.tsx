'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../utils/api';
import { User, Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { firstName, lastName, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden my-12">
      <div className="absolute -top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/20 rounded-full blur-[120px] mix-blend-screen" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 border border-[#1E1E1E]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Create Account.</h1>
          <p className="text-[#A0A0A0] font-medium">Join EventBooking to discover premium experiences.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#A0A0A0] ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
                <input 
                  type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="input-field w-full pl-11" placeholder="John"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#A0A0A0] ml-1">Last Name</label>
              <input 
                type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                className="input-field w-full px-4" placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#A0A0A0] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="input-field w-full pl-12" placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#A0A0A0] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                className="input-field w-full pl-12" placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2 mt-6 text-lg">
            {loading ? <Loader className="spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center text-[#A0A0A0] mt-8 font-medium">
          Already have an account? <Link href="/login" className="text-[#FF6B00] font-bold hover:text-white transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
