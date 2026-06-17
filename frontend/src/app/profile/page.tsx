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
      
      // Update session storage
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

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="spin text-[#FF6B00]" /></div>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8C42]">Settings.</span></h1>
        <p className="text-[#A0A0A0] text-lg font-medium">Manage your personal information and preferences.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card border border-[#1E1E1E] overflow-hidden">
        
        <div className="p-8 md:p-10 border-b border-[#1E1E1E] flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl">
            {profile?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white mb-1">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-[#A0A0A0] font-medium flex items-center gap-2"><Mail size={16} /> {profile?.email}</p>
            {profile?.roles?.includes('ROLE_ADMIN') && (
              <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold uppercase rounded-md border border-[#FF6B00]/30">
                <Shield size={12} /> Administrator
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 md:p-10 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl font-bold text-sm mb-6 border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#A0A0A0] ml-1">First Name</label>
              <input 
                type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                className="input-field w-full" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#A0A0A0] ml-1">Last Name</label>
              <input 
                type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                className="input-field w-full" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#A0A0A0] ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" size={20} />
              <input 
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="input-field w-full pl-12" placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-[#1E1E1E] flex flex-col md:flex-row gap-4 justify-between items-center">
            <button 
              type="button" 
              onClick={() => { clearSession(); router.push('/login'); }}
              className="text-red-500 font-bold hover:bg-red-500/10 py-3 px-6 rounded-xl transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <LogOut size={18} /> Sign Out
            </button>
            <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-10">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
