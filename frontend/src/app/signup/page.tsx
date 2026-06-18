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
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 my-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md p-8 md:p-10 border border-gray-200 shadow-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#111827] tracking-tight mb-2">Create Account</h1>
          <p className="text-[#6B7280] font-medium">Join EventBooking to discover premium events</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
                <input 
                  type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                  placeholder="John"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">Last Name</label>
              <input 
                type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111827] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111827] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 mt-6 text-base shadow-md hover:shadow-lg">
            {loading ? <Loader className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
          </button>
        </form>

        <p className="text-center text-[#6B7280] mt-8 font-medium">
          Already have an account? <Link href="/login" className="text-[#FACC15] font-bold hover:text-[#EAB308] transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
