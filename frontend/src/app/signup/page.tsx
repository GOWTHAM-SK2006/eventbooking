'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setSession } from '../../utils/api';
import { Mail, Lock, User, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/signup', {
        email,
        password,
        firstName,
        lastName,
      });
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
      router.push('/events');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
              className="text-3xl font-black text-[#111827] tracking-tight mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Create Account
            </motion.h1>
            <motion.p 
              className="text-[#6B7280] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join EventBooking today
            </motion.p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-xl text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#111827] ml-1">First Name</label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={firstName} 
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all duration-200 hover:bg-white text-sm" 
                    placeholder="John"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-sm font-bold text-[#111827] ml-1">Last Name</label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={lastName} 
                    onChange={e => setLastName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all duration-200 hover:bg-white text-sm" 
                    placeholder="Doe"
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">Email Address</label>
              <motion.div className="relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
              <motion.div className="relative" whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <motion.p variants={itemVariants} className="text-center text-[#6B7280] text-sm mt-6 font-medium">
            Already have an account? <Link href="/login" className="text-[#FACC15] font-bold hover:text-[#EAB308] transition-colors hover:underline">Sign in</Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
