'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, clearSession } from '../../../utils/api';
import { 
  ArrowLeft, Settings, User, Shield, Lock, Trash2, 
  LogOut, Globe, Moon, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

// Custom Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#FFD400]' : 'bg-gray-200'
      }`}
    >
      <motion.div
        layout
        className="bg-white w-3.5 h-3.5 rounded-full shadow-sm"
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  
  // Account Detail states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98273 88192');
  const [session, setSession] = useState<any>(null);
  
  // Alerts and loaders
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [settingsToggles, setSettingsToggles] = useState({
    publicProfile: false,
    twoFactorAuth: false,
    darkMode: false,
  });
  const [language, setLanguage] = useState('English');

  // Mock Active Sessions
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome / Windows PC', location: 'Chennai, India', current: true },
    { id: '2', device: 'Safari / iPhone 15 Pro', location: 'Mumbai, India', current: false }
  ]);

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
      await api.put('/auth/profile', { firstName, lastName });
      const sess = getSession();
      if (sess) {
        sess.firstName = firstName;
        sess.lastName = lastName;
        localStorage.setItem('session', JSON.stringify(sess));
        window.dispatchEvent(new Event('sessionUpdate'));
      }
      setMessage({ type: 'success', text: 'Profile details saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswordForm({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.dispatchEvent(new Event('userLogout'));
    router.push('/login');
  };

  const deleteAccount = () => {
    if (confirm('WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      alert('Account deletion request registered.');
      handleLogout();
    }
  };

  const revokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />

      <div className="relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
                <span>Account &</span>
                <span className="text-[#EAB308]">Settings</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Manage details, credentials, preferences, and session logs</p>
            </div>
          </div>
        </div>

        {/* Status messages */}
        <AnimatePresence mode="wait">
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-bold shadow-xs mb-6 max-w-3xl ${
                message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              <CheckCircle size={16} className="shrink-0 mt-0.5" />
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Update details & Password */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile configuration Form */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                <User className="text-[#EAB308]" size={16} />
                <span>Personal Information</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      placeholder="First name"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      placeholder="Last name"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Email (Read Only)</label>
                    <input 
                      type="email" 
                      value={email} 
                      disabled
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-400 font-semibold cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="Phone number"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl shrink-0"
                >
                  {loading ? 'Saving...' : 'Save Profile details'}
                </button>
              </form>
            </div>

            {/* Change Password form */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                <Lock className="text-[#EAB308]" size={16} />
                <span>Change Password</span>
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.current} 
                      onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                      placeholder="Current Password" 
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.newPass} 
                      onChange={e => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                      placeholder="New Password" 
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwordForm.confirm} 
                      onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                      placeholder="Confirm Password" 
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl shrink-0"
                >
                  {loading ? 'Processing...' : 'Change Password'}
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT COLUMN: Preferences, Active Sessions, Danger zone */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Preferences Config */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">System Preferences</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-150/40 last:border-b-0">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5"><Globe size={13} className="text-[#EAB308]" /> Language</h4>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Select local translate index</p>
                  </div>
                  <select 
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl p-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#FFD400]"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Kannada</option>
                  </select>
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-gray-150/40 last:border-b-0">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5"><Moon size={13} className="text-[#EAB308]" /> Dark Mode</h4>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Invert template colors</p>
                  </div>
                  <ToggleSwitch 
                    checked={settingsToggles.darkMode} 
                    onChange={v => setSettingsToggles(prev => ({ ...prev, darkMode: v }))}
                  />
                </div>

                <div className="flex justify-between items-center py-2.5 border-b border-gray-150/40 last:border-b-0">
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5"><Shield size={13} className="text-[#EAB308]" /> 2-Factor Auth</h4>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Two-step login verification</p>
                  </div>
                  <ToggleSwitch 
                    checked={settingsToggles.twoFactorAuth} 
                    onChange={v => setSettingsToggles(prev => ({ ...prev, twoFactorAuth: v }))}
                  />
                </div>
              </div>
            </div>

            {/* Active Sessions Panel */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Login Sessions</h3>
              
              <div className="space-y-3">
                {sessions.map(s => (
                  <div key={s.id} className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-b-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs text-gray-900">{s.device}</h4>
                        {s.current && (
                          <span className="text-[7px] font-black uppercase text-green-700 bg-green-50 border border-green-200 px-1 rounded">Active</span>
                        )}
                      </div>
                      <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{s.location}</p>
                    </div>
                    
                    {!s.current && (
                      <button 
                        onClick={() => revokeSession(s.id)}
                        className="text-[9px] font-black text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Danger zone / Logout */}
            <div className="bg-red-50/10 border border-red-200/40 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-5">
              <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle size={14} />
                <span>Account Control Zone</span>
              </h3>
              
              <div className="space-y-3.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-3.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-black text-xs rounded-xl transition-all shadow-3xs"
                >
                  <span className="flex items-center gap-2">
                    <LogOut size={14} className="text-gray-400" />
                    <span>Log Out of Account</span>
                  </span>
                  <span>→</span>
                </button>

                <button 
                  onClick={deleteAccount}
                  className="w-full flex items-center justify-between p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-black text-xs rounded-xl transition-all shadow-3xs"
                >
                  <span className="flex items-center gap-2">
                    <Trash2 size={14} />
                    <span>Delete Account Permanently</span>
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
