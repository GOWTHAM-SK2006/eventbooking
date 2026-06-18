'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, setSession, clearSession } from '../../utils/api';
import { User, Mail, Phone, Loader, LogOut, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.get('/auth/profile');
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhone(data.phone || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await api.put('/auth/profile', { firstName, lastName, phone });
      setProfile(updated);
      
      const s = getSession();
      if (s) {
        setSession({ ...s, firstName: updated.firstName, lastName: updated.lastName });
        window.dispatchEvent(new Event('userLogin'));
      }
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="animate-spin text-[#FACC15]" /></div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#111827]">Account <span className="text-[#FACC15]">Settings</span></h1>
        <p className="text-[#6B7280] text-lg font-medium">Manage your personal information and preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        
        <div className="p-8 md:p-10 border-b border-gray-200 flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#FACC15] to-[#EAB308] rounded-full flex items-center justify-center text-4xl font-black text-[#111827] shadow-md">
            {profile?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#111827] mb-1">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-[#6B7280] font-medium flex items-center gap-2"><Mail size={16} /> {profile?.email}</p>
            {profile?.roles?.includes('ROLE_ADMIN') && (
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-yellow-50 text-[#FACC15] text-xs font-bold uppercase rounded-md border border-yellow-200">
                <Shield size={12} /> Administrator
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 md:p-10 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl font-bold text-sm mb-6 border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">First Name</label>
              <input 
                type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111827] ml-1">Last Name</label>
              <input 
                type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#111827] ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input 
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <button 
              type="button" 
              onClick={() => { clearSession(); router.push('/login'); }}
              className="text-red-600 font-bold hover:bg-red-50 py-3 px-6 rounded-xl transition-colors flex items-center gap-2 w-full md:w-auto justify-center border border-red-200"
            >
              <LogOut size={18} /> Sign Out
            </button>
            <button type="submit" disabled={saving} className="w-full md:w-auto bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-3 px-10 rounded-xl transition-all shadow-md hover:shadow-lg">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
