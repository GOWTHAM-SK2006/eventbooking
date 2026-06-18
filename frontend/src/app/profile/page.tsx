'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { User, Mail, Calendar, LogOut, Save, Loader, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const session = getSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    setFirstName(session.firstName || '');
    setLastName(session.lastName || '');
    setEmail(session.email || '');
  }, [session, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.put('/auth/profile', {
        firstName,
        lastName,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 md:py-24">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-2">
          Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Settings</span>
        </h1>
        <p className="text-[#6B7280] font-medium">Manage your profile and account preferences.</p>
      </motion.div>

      {/* Messages */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-8 p-4 rounded-xl border flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <Check size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-semibold">{message.text}</p>
        </motion.div>
      )}

      {/* Profile Form */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-black text-[#111827] mb-8">Personal Information</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="text-sm font-bold text-[#111827] ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all hover:bg-white"
                    placeholder="John"
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <label className="text-sm font-bold text-[#111827] ml-1">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all hover:bg-white"
                    placeholder="Doe"
                  />
                </div>
              </motion.div>
            </div>

            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <label className="text-sm font-bold text-[#111827] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#9CA3AF] cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-[#6B7280] font-medium">Email cannot be changed</p>
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#FACC15] hover:bg-[#EAB308] disabled:bg-[#D4A516] disabled:cursor-not-allowed text-[#111827] font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                  <Loader size={20} />
                </motion.div>
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Account Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-black text-[#111827] mb-6">Account</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">Member Since</p>
                <p className="text-lg font-bold text-[#111827] mt-1">2024</p>
              </div>
              <Calendar className="text-[#FACC15]" size={24} />
            </div>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
            >
              <LogOut size={20} /> Sign Out
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
