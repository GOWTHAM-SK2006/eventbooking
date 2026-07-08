'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setSession } from '../../utils/api';
import { Mail, Lock, Loader, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../../components/ScrollReveal';

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
        router.push('/admin/dashboard');
      } else {
        router.push('/events');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center px-4 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: [0.61, 1, 0.88, 1] }}
        className="bg-white rounded-3xl w-full max-w-md p-8 md:p-10 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-6"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.h1 
              className="text-[32px] sm:text-[36px] font-black text-[#111827] tracking-tight mb-2 flex justify-center items-baseline gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span>Welcome</span>
              <span className="text-[28px] sm:text-[32px] text-[#FACC15]">Back</span>
            </motion.h1>
            <motion.p 
              className="text-[#6B7280] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sign in to your EventBooking account
            </motion.p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl text-center flex items-center gap-2 justify-center"
            >
              <span className="w-1 h-1 rounded-full bg-red-700" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">Email Address</label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all duration-200 hover:bg-white" 
                  placeholder="name@company.com"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">Password</label>
              <motion.div 
                className="relative"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all duration-200 hover:bg-white" 
                  placeholder="••••••••"
                />
              </motion.div>
            </motion.div>

            <motion.button 
              type="submit" 
              disabled={loading} 
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-[#D4A516] disabled:cursor-not-allowed text-[#111827] font-bold py-3 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 mt-2 text-base shadow-md hover:shadow-lg active:shadow-sm"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Loader size={20} />
                </motion.div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center text-[#6B7280] mt-4 font-medium">
            <Link href="/forgot-password" className="text-[#FACC15] font-bold hover:underline">Forgot password?</Link>
          </motion.p>

          <motion.p variants={itemVariants} className="text-center text-[#6B7280] mt-8 font-medium">
            Don't have an account? <Link href="/signup" className="text-[#FACC15] font-bold hover:text-[#EAB308] transition-colors hover:underline">Sign up</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
