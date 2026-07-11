'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  User, Mail, Calendar, LogOut, Save, 
  Sparkles, Bell, Ticket, CreditCard, Gift, Settings, 
  PhoneCall, Globe, Eye, Lock, CheckCircle2, 
  HelpCircle, Share2, Star, Download, ChevronDown,
  Info, CheckCircle, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketModal from '../../components/TicketModal';
import { FloatingBlobs } from '../../components/AnimatedBackground';

// Custom Animated Toggle Switch Component for Premium Aesthetics
const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
        checked ? 'bg-[#FFD400]' : 'bg-gray-200'
      }`}
    >
      <motion.div
        layout
        className="bg-white w-4 h-4 rounded-full shadow-md"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  
  // Account Detail states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [session, setSession] = useState<any>(null);
  
  // Alerts and loaders
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Accordion state (default open to activity)
  const [openSection, setOpenSection] = useState<string | null>('activity');

  // Dynamic Data States from backend
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string | null>(null);

  // Form states inside accordions
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [settingsToggles, setSettingsToggles] = useState({
    bookingUpdates: true,
    eventReminders: true,
    announcements: true,
    promoOffers: false,
    publicProfile: false,
    darkMode: false,
  });
  const [language, setLanguage] = useState('English');
  const [supportMsg, setSupportMsg] = useState('');
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [rewardPoints] = useState(750);
  const [referralCode] = useState('EVBOOK-7729');
  const [copied, setCopied] = useState(false);

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

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [bookingsData, wishlistData] = await Promise.all([
        api.get('/bookings').catch(() => []),
        api.get('/wishlist').catch(() => []),
      ]);
      setBookings(bookingsData);
      setWishlist(wishlistData);
    } catch (err) {
      console.error('Error loading profile dashboard data:', err);
    }
  };

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

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMembershipInfo = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    if (bookingCount >= 5) {
      return { level: 'Premium', badgeColor: 'bg-yellow-50 border-yellow-300 text-yellow-700' };
    }
    if (bookingCount >= 2) {
      return { level: 'Gold', badgeColor: 'bg-amber-50 border-amber-300 text-amber-700' };
    }
    return { level: 'Silver', badgeColor: 'bg-slate-50 border-slate-200 text-slate-700' };
  };

  const member = getMembershipInfo();
  const userName = `${firstName} ${lastName}`.trim() || 'User Account';
  const upcomingEventsCount = bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative flex flex-col justify-between bg-white text-[#111827]">
      {/* Decorative blurry glassmorphism background blobs */}
      <FloatingBlobs />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-250 mb-4"
          >
            <User size={12} className="text-[#EAB308]" />
            <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">User Account</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[36px] sm:text-[48px] md:text-[60px] font-black tracking-tight text-[#111827] leading-none flex flex-wrap items-baseline gap-x-2 gap-y-1"
          >
            <span>My</span>
            <span className="text-[#EAB308]">Profile</span>
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ===================================
              1. LEFT COLUMN: PROFILE CARD
              =================================== */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-3xl border border-gray-200/60 bg-white/80 backdrop-blur-md p-8 shadow-sm overflow-hidden group"
            >
              {/* Decorative Card Header Splash */}
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-yellow-50 to-orange-50/60 -z-10 border-b border-gray-150" />
              
              <div className="flex flex-col items-center text-center">
                
                {/* Profile Circle */}
                <div className="relative mb-5">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD400] to-[#FFF4B0] text-gray-900 font-black text-3xl flex items-center justify-center border-4 border-white shadow-md transform group-hover:scale-105 transition-transform duration-300">
                    {firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#111827] text-[#FFD400] p-1.5 rounded-full border-2 border-white shadow-xs" title="Verified Account">
                    <Sparkles size={12} className="fill-[#FFD400]" />
                  </div>
                </div>

                {/* Name and Member Tag */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">{userName}</h2>
                  <div className="inline-block">
                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-3xs ${member.badgeColor}`}>
                      {member.level} Member
                    </span>
                  </div>
                </div>

                {/* Horizontal Quick Stats Dashboard */}
                <div className="grid grid-cols-3 gap-2 w-full py-4 border-t border-b border-gray-100 my-6">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Bookings</p>
                    <p className="text-base font-black text-gray-800 mt-0.5">{bookings.length}</p>
                  </div>
                  <div className="text-center border-l border-r border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Wishlist</p>
                    <p className="text-base font-black text-gray-800 mt-0.5">{wishlist.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Points</p>
                    <p className="text-base font-black text-[#EAB308] mt-0.5">{rewardPoints}</p>
                  </div>
                </div>

                {/* Contact and Metadata */}
                <div className="space-y-3 w-full text-left mb-6">
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                      <Mail size={13} className="text-gray-400" />
                    </div>
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 font-semibold">
                    <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                      <Calendar size={13} className="text-gray-400" />
                    </div>
                    <span>Member since June 2026</span>
                  </div>
                </div>

                {/* Edit Profile Action */}
                <button 
                  onClick={() => toggleSection('settings')}
                  className="w-full btn-primary justify-center flex items-center gap-2 text-xs py-3 rounded-xl transition-all shadow-xs"
                >
                  <Settings size={14} />
                  <span>Account Configuration</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* ===================================
              2. RIGHT COLUMN: ACCORDION LIST
              =================================== */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Global Alerts inside main column */}
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-2xl border flex items-start gap-3 text-xs font-bold shadow-xs ${
                    message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACCORDION 1: ACTIVITY */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('activity')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'activity' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100 shadow-3xs">
                    <Ticket size={16} className="text-[#EAB308]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">My Activity</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Tickets, order logs, and wishlist</p>
                  </div>
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase text-[#EAB308] bg-yellow-50 border border-yellow-250 px-2 py-0.5 rounded-md">
                    {upcomingEventsCount} Active
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-300 ${openSection === 'activity' ? 'rotate-180' : ''}`} 
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'activity' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-6">
                      
                      {/* Upcoming Events */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Scheduled Events</h4>
                        </div>
                        
                        {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic pl-1">No upcoming registered events.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex flex-col justify-between shadow-3xs hover:shadow-2xs transition-all">
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h5 className="font-extrabold text-sm text-gray-900 leading-tight">{b.eventTitle}</h5>
                                    <span className="text-[8px] font-black uppercase text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">Active</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-2 font-bold">{new Date(b.eventDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Downloadable passes */}
                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Digital Tickets & Passes</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic pl-1">No entry passes available.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                                <div>
                                  <h5 className="font-extrabold text-xs text-gray-900">{b.eventTitle}</h5>
                                  <p className="text-[9px] text-gray-400 mt-1 font-semibold">Ordered: {new Date(b.eventDate).toLocaleDateString()}</p>
                                </div>
                                
                                <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                                  {b.ticketCodes?.map((code: string, idx: number) => (
                                    <button 
                                      key={code} 
                                      onClick={() => setSelectedTicketCode(code)}
                                      className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-[#FFD400] font-black px-2.5 py-1.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                                    >
                                      <Download size={11} /> Pass {idx + 1}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Wishlist */}
                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Saved in Wishlist</h4>
                        {wishlist.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic pl-1">Your wishlist is currently empty.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {wishlist.map(w => (
                              <div key={w.id} className="bg-white border border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between shadow-3xs">
                                <span className="font-extrabold text-xs text-gray-900 truncate pr-2">{w.title}</span>
                                <button 
                                  onClick={() => router.push(`/events/${w.id}`)}
                                  className="btn-primary py-1.5 px-3 text-[9px] uppercase tracking-wider rounded-lg shrink-0"
                                >
                                  Details
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Order logs */}
                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Purchase History</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic pl-1">No transaction records found.</p>
                        ) : (
                          <div className="space-y-2">
                            {bookings.map(b => (
                              <div key={b.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-b-0 pl-1">
                                <div>
                                  <h5 className="font-bold text-xs text-gray-900">{b.eventTitle}</h5>
                                  <p className="text-[9px] text-gray-400 font-medium mt-0.5">Purchased on {new Date(b.eventDate).toLocaleDateString()}</p>
                                </div>
                                <span className="font-black text-gray-800 text-xs">₹{b.totalPrice}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 2: PAYMENTS */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('payments')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'payments' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-3xs">
                    <CreditCard size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Payments</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Invoices, billing details, and refunds</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'payments' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'payments' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Invoices & Statements</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic pl-1">No payment invoices available.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex justify-between items-center shadow-3xs">
                                <div>
                                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">INV-{b.id.slice(0, 8).toUpperCase()}</p>
                                  <h5 className="font-extrabold text-xs text-gray-900 mt-1">{b.eventTitle}</h5>
                                  <p className="text-[9px] text-green-700 font-semibold mt-1 flex items-center gap-1"><CheckCircle2 size={10} className="text-green-600" /> Payment Successful</p>
                                </div>
                                
                                <div className="text-right">
                                  <span className="font-black text-gray-900 text-sm">₹{b.totalPrice}</span>
                                  <button 
                                    onClick={() => alert(`Generating PDF statement for transaction ID: ${b.id}`)}
                                    className="text-[9px] font-black text-blue-500 hover:text-blue-600 underline mt-1.5 block"
                                  >
                                    Invoice Details
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-5 space-y-3">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Refund Overview</h4>
                        <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl flex items-start gap-3">
                          <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">All cancellation refunds process back to the original method of payment automatically. In case of issues, contact customer help.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 3: NOTIFICATIONS */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('notifications')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'notifications' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-3xs">
                    <Bell size={16} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Notifications</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Control mail and platform notification alerts</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'notifications' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'notifications' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-4">
                      {[
                        { key: 'bookingUpdates', title: 'Booking Confirmation Emails', desc: 'Send transactional emails when booking event tickets.' },
                        { key: 'eventReminders', title: 'Pre-Event Reminders', desc: 'Receive schedule reminder notifications 24 hours prior.' },
                        { key: 'announcements', title: 'Feature Announcements', desc: 'Alert me on platform updates and community upgrades.' },
                        { key: 'promoOffers', title: 'Special Discount Invites', desc: 'Receive promotional coupon codes and local event releases.' }
                      ].map(item => (
                        <div key={item.key} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                          <div className="pr-4">
                            <h5 className="text-xs font-black text-gray-900">{item.title}</h5>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                          </div>
                          <ToggleSwitch 
                            checked={(settingsToggles as any)[item.key]} 
                            onChange={v => setSettingsToggles(prev => ({ ...prev, [item.key]: v }))}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 4: REWARDS */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('rewards')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'rewards' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-3xs">
                    <Gift size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Rewards</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Points, coupons, and referral benefits</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'rewards' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'rewards' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-emerald-50/40 to-green-50/20 border border-emerald-100/60 p-5 rounded-2xl text-center shadow-3xs">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Available Balance</span>
                          <p className="text-3xl font-black text-emerald-600 mt-1">{rewardPoints} pts</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-2">Deduct points during purchases to secure price reductions.</p>
                        </div>

                        {/* Referral Code with Copy Micro-Animation */}
                        <div className="bg-white border border-dashed border-gray-300 p-5 rounded-2xl text-center flex flex-col justify-between shadow-3xs">
                          <div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Referral Code</span>
                            <p className="text-lg font-mono font-black text-gray-900 mt-1.5 select-all">{referralCode}</p>
                          </div>
                          <button
                            onClick={handleCopyCode}
                            className={`mt-3 py-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                              copied ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-250 text-gray-800'
                            }`}
                          >
                            {copied ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copied ? 'Copied' : 'Copy Code'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Coupon Component (Tear-off design) */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider font-bold">Active Promo Coupons</h4>
                        <div className="relative bg-white border border-gray-200 p-5 rounded-2xl flex items-center justify-between shadow-3xs overflow-hidden">
                          {/* Left dot punch hole */}
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                          {/* Right dot punch hole */}
                          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                          
                          <div className="pl-4">
                            <span className="px-2.5 py-0.5 bg-yellow-50 border border-yellow-250 text-[#FFD400] text-[9px] font-black uppercase tracking-widest rounded-md">WELCOME100</span>
                            <p className="text-[10px] text-gray-400 mt-2 font-semibold">Flat ₹100 discount coupon valid on your first booking.</p>
                          </div>
                          <span className="text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md mr-4 uppercase shrink-0">Active</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 5: SETTINGS */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('settings')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'settings' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 shadow-3xs">
                    <Settings size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Settings</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Update personal details, password, and preferences</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'settings' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'settings' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-8">
                      
                      {/* Update Account Info */}
                      <form onSubmit={handleSave} className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Account Details</h4>
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

                        <button 
                          type="submit" 
                          className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl"
                        >
                          Save Changes
                        </button>
                      </form>

                      {/* Password Config */}
                      <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-150 pt-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Update Security Password</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <input 
                            type="password" 
                            value={passwordForm.current} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                            placeholder="Current Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                          <input 
                            type="password" 
                            value={passwordForm.newPass} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                            placeholder="New Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                          <input 
                            type="password" 
                            value={passwordForm.confirm} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                            placeholder="Confirm Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl"
                        >
                          Change Password
                        </button>
                      </form>

                      {/* System Preference */}
                      <div className="border-t border-gray-150 pt-6 space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Platform Preferences</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                            <div>
                              <h5 className="text-xs font-black text-gray-900">Interface Theme</h5>
                              <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Toggle between Light and Dark interface modes.</p>
                            </div>
                            <ToggleSwitch 
                              checked={settingsToggles.darkMode} 
                              onChange={v => setSettingsToggles(prev => ({ ...prev, darkMode: v }))}
                            />
                          </div>

                          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                            <div>
                              <h5 className="text-xs font-black text-gray-900">System Language</h5>
                              <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Set translation preference for event logs.</p>
                            </div>
                            <select 
                              value={language}
                              onChange={e => setLanguage(e.target.value)}
                              className="bg-white border border-gray-250 rounded-xl p-2 text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#FFD400] cursor-pointer"
                            >
                              <option>English</option>
                              <option>Hindi</option>
                              <option>Tamil</option>
                              <option>Kannada</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Destructive zone */}
                      <div className="border-t border-gray-150 pt-6">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-wider">Destructive Actions</h4>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 mb-4">Erase account database values and orders logs irreversibly.</p>
                        <button 
                          type="button"
                          onClick={deleteAccount} 
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold px-5 py-3 rounded-xl text-xs transition-all active:scale-95 shadow-3xs"
                        >
                          Request Account Removal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 6: SUPPORT */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('support')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'support' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 shadow-3xs">
                    <PhoneCall size={16} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Support Desk</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Send a problem request or query report</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'support' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'support' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Report Platform Problem</h4>
                        {supportStatus ? (
                          <div className="bg-purple-50/20 border border-purple-100 p-6 rounded-2xl text-center shadow-3xs">
                            <CheckCircle2 size={32} className="text-purple-500 mx-auto mb-3" />
                            <h5 className="font-black text-sm text-gray-900">{supportStatus}</h5>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Our system support team will email back shortly.</p>
                          </div>
                        ) : (
                          <div className="space-y-3.5">
                            <textarea 
                              rows={4} 
                              placeholder="Explain details of booking glitches or system issues..."
                              value={supportMsg}
                              onChange={e => setSupportMsg(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                            />
                            <button 
                              onClick={() => { if (supportMsg.trim()) setSupportStatus('Trouble Ticket Registered'); }}
                              className="bg-gray-900 hover:bg-gray-800 text-white font-black px-6 py-3 rounded-xl text-xs transition-all active:scale-95 shadow-3xs"
                            >
                              Dispatch Trouble Ticket
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 7: MORE */}
            <div className="bg-white/85 backdrop-blur-md border border-gray-200/60 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300">
              <button
                onClick={() => toggleSection('more')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/30 ${openSection === 'more' ? 'bg-yellow-50/5' : ''}`}
              >
                <span className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-3xs">
                    <Globe size={16} className="text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">More Details</h3>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Share application, rates, and policies</p>
                  </div>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-300 ${openSection === 'more' ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence initial={false}>
                {openSection === 'more' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden bg-white"
                  >
                    <div className="p-6 border-t border-gray-100 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button 
                          onClick={() => alert('App link copied to clipboard!')}
                          className="bg-white border border-gray-150 p-5 rounded-2xl text-left flex items-center gap-4 hover:border-[#FFD400] transition-colors shadow-3xs group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover/item:bg-[#FFD400] group-hover/item:text-gray-900 transition-colors">
                            <Share2 size={20} />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-gray-900">Share App</h5>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">Invite friends to EventBooking.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => alert('Thank you for rating our app 5 stars!')}
                          className="bg-white border border-gray-150 p-5 rounded-2xl text-left flex items-center gap-4 hover:border-[#FFD400] transition-colors shadow-3xs group/item"
                        >
                          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-[#FFD400] group-hover/item:bg-[#FFD400] group-hover/item:text-gray-900 transition-colors">
                            <Star size={20} className="fill-current" />
                          </div>
                          <div>
                            <h5 className="text-xs font-black text-gray-900">Rate Platform</h5>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-semibold">Write reviews on application stores.</p>
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-gray-150 pt-5 space-y-3 text-xs font-semibold text-gray-500 leading-relaxed pl-1">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Polices & Terms</h4>
                        <p>Purchase guidelines and seat reservation conditions apply. Cancellations are subject to host policies.</p>
                        <p className="text-[10px] text-gray-400 mt-1">Version: <strong>v3.0.0-PROD</strong></p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Log Out Button bottom */}
        {!session?.roles?.includes('ROLE_ADMIN') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 pt-8 flex justify-center border-t border-gray-100"
          >
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-600 font-extrabold px-10 py-3.5 rounded-2xl transition-all flex items-center gap-2.5 active:scale-95 shadow-3xs text-xs"
            >
              <LogOut size={15} />
              <span>Log Out of Account</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Ticket Modal for ticket pass visualization */}
      {selectedTicketCode && (
        <TicketModal ticketCode={selectedTicketCode} onClose={() => setSelectedTicketCode(null)} />
      )}
    </div>
  );
}
