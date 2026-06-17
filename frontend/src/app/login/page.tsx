'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setSession } from '../../utils/api';
import { Mail, Lock, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      setSession({
        token: data.token,
        refreshToken: data.refreshToken,
        id: data.id,
        email: data.email,
        roles: data.roles,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      window.dispatchEvent(new Event('userLogin'));
      
      if (data.roles.includes('ROLE_ADMIN')) {
        router.push('/dashboard');
      } else {
        router.push('/events');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[#FF6B00]/20 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-[#FF8C42]/20 rounded-full blur-[120px] mix-blend-screen" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-8 md:p-10 relative z-10 border border-[#1E1E1E]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back.</h1>
          <p className="text-[#A0A0A0] font-medium">Log in to access your tickets and events.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="input-field w-full pl-12" placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2 mt-4 text-lg">
            {loading ? <Loader className="spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center text-[#A0A0A0] mt-8 font-medium">
          Don't have an account? <Link href="/signup" className="text-[#FF6B00] font-bold hover:text-white transition-colors">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
