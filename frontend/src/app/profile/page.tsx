'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { User, Mail, Calendar, LogOut, Save, Loader, Check, AlertCircle, Sparkles, Shield, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';

export default function ProfilePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
    setFirstName(sess.firstName || '');
    setLastName(sess.lastName || '');
    setEmail(sess.email || '');
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/auth/profile', {
        firstName,
        lastName,
      });

      // Update session storage
      const sess = getSession();
      if (sess) {
        sess.firstName = firstName;
        sess.lastName = lastName;
        localStorage.setItem('session', JSON.stringify(sess));
        // dispatch custom event to alert Navbar / other clients
        window.dispatchEvent(new Event('sessionUpdate'));
      }

      setMessage({ type: 'success', text: 'Profile details saved successfully!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.dispatchEvent(new Event('userLogout'));
    router.push('/login');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 md:py-24 min-h-screen relative">
      <FloatingBlobs />
      
      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
        >
          <User size={12} className="text-[#EAB308]" />
          <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">User Preferences</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-[#111827] mb-2 leading-tight"
        >
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Settings</span>
        </motion.h1>
        <p className="text-[#6B7280] font-semibold text-sm">Manage your profile information and configure security defaults.</p>
      </div>

      {/* Profile Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden"
        >
          {/* Decorative backdrop indicator */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-yellow-100/30 rounded-full blur-xl pointer-events-none" />

          <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2.5">
            <User size={20} className="text-[#EAB308]" /> Personal Details
          </h2>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {message.type === 'success' ? (
                  <Check size={18} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                )}
                <p className="text-xs font-bold leading-normal">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-yellow-400 rounded-2xl text-gray-900 focus:outline-none transition-all font-semibold text-sm"
                    placeholder="Enter first name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-yellow-400 rounded-2xl text-gray-900 focus:outline-none transition-all font-semibold text-sm"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed font-semibold text-sm"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold ml-1">Email address is locked and verified for this account.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-gray-200 text-gray-900 font-extrabold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-sm active:scale-95 text-sm"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900"></div>
              ) : (
                <>
                  <Save size={18} /> <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Security & Metadata Info */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-[#EAB308]">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Role Status</p>
              <div className="flex gap-1.5 mt-1">
                {session?.roles?.map((role: string) => (
                  <span key={role} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase tracking-wider border border-gray-200/50">
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-[#EAB308]">
              <Calendar size={22} />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Account Type</p>
              <p className="text-xs text-gray-400 font-bold mt-0.5">Verified Member</p>
            </div>
          </div>
        </motion.div>

        {/* Sign out */}
        <motion.div variants={itemVariants}>
          <button
            onClick={handleLogout}
            className="w-full bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 font-extrabold py-3.5 rounded-2xl transition-all flex justify-center items-center gap-2 active:scale-95 shadow-xs text-sm"
          >
            <LogOut size={18} /> <span>Sign Out of Account</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
