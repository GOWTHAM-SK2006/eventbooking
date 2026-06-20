'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  User, Mail, Calendar, LogOut, Save, Check, AlertCircle, 
  Sparkles, Shield, Bell, Ticket, CreditCard, Gift, Settings, 
  PhoneCall, Globe, Eye, Lock, Trash2, Heart, Award, CheckCircle2, 
  HelpCircle, Share2, Star, Download, ChevronRight, RefreshCw, ChevronDown,
  Info, ShieldAlert, Laptop, MessageSquare, ExternalLink, HelpCircle as HelpIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';
import TicketModal from '../../components/TicketModal';

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

  // Accordion state (one open at a time)
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

  // Membership level logic
  const getMembershipInfo = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    if (bookingCount >= 5) {
      return { level: 'Premium', badgeColor: 'from-amber-400 via-[#FACC15] to-yellow-600 text-gray-900 border-yellow-300' };
    }
    if (bookingCount >= 2) {
      return { level: 'Gold', badgeColor: 'from-yellow-100 to-yellow-300 text-yellow-800 border-yellow-400' };
    }
    return { level: 'Silver', badgeColor: 'from-gray-100 to-gray-200 text-gray-800 border-gray-300' };
  };

  const member = getMembershipInfo();
  const userName = `${firstName} ${lastName}`.trim() || 'User Account';

  // Stats Counters
  const totalBookings = bookings.length;
  const upcomingEventsCount = bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length;
  const wishlistCount = wishlist.length;
  const attendedEventsCount = bookings.filter(b => new Date(b.eventDate) < new Date() && b.status === 'CONFIRMED').length;

  return (
    <div className="w-full max-w-4xl lg:max-w-7xl xl:max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen relative flex flex-col justify-between">
      <FloatingBlobs />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        
        {/* ===================================
            1. PROFILE HEADER
            =================================== */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-gray-250/60 bg-white p-6 md:p-8 shadow-md">
            {/* Luxury Yellow & Gold mesh gradient backdrop */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-yellow-300/30 via-amber-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-50/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-6 lg:text-center">
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 text-center sm:text-left lg:text-center">
                {/* Large circular profile picture */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 via-[#FACC15] to-amber-500 text-gray-900 font-black text-3xl flex items-center justify-center border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                    {firstName?.charAt(0) || 'U'}
                  </div>
                  {/* Premium / Verified badge overlay */}
                  <div className="absolute -bottom-1 -right-1 bg-gray-950 text-[#FACC15] p-1.5 rounded-full border-2 border-white shadow-md" title="Verified Account">
                    <Sparkles size={12} className="animate-spin-slow fill-[#FACC15]" />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start lg:items-center">
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-2.5">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center sm:text-left lg:text-center">{userName}</h1>
                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r ${member.badgeColor} border shadow-2xs`}>
                      {member.level} Member
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 font-semibold mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start lg:justify-center">
                    <Mail size={13} className="text-gray-400" />
                    <span>{email}</span>
                  </p>

                  <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1 justify-center sm:justify-start lg:justify-center">
                    <Calendar size={11} className="text-[#EAB308]" />
                    <span>Member since June 2026</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => toggleSection('settings')}
                className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition-all active:scale-95 shadow-sm flex items-center gap-1.5 w-full sm:w-auto lg:w-full justify-center"
              >
                <Settings size={13} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Stats + Accordion Menu */}
        <div className="lg:col-span-8 space-y-8">

        {/* ===================================
            2. QUICK STATS
            =================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Bookings', value: totalBookings, icon: <Ticket className="text-yellow-600" size={16} /> },
            { label: 'Upcoming Events', value: upcomingEventsCount, icon: <Calendar className="text-yellow-600" size={16} /> },
            { label: 'Wishlist Count', value: wishlistCount, icon: <Heart className="text-yellow-600" size={16} /> },
            { label: 'Events Attended', value: attendedEventsCount, icon: <Award className="text-yellow-600" size={16} /> }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white border border-gray-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-2xs relative group hover:border-yellow-400 transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider leading-tight">{stat.label}</span>
                <div className="p-1.5 bg-yellow-50 rounded-lg border border-yellow-100/50">
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 mt-4 tracking-tight group-hover:text-yellow-600 transition-colors text-center">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ===================================
            3. INTERACTIVE ACCORDION MENU
            =================================== */}
        <div className="bg-white border border-gray-250/70 rounded-3xl overflow-hidden shadow-md">
          
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`m-4 p-4 rounded-xl border flex items-start gap-2.5 text-xs font-bold ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
              >
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACCORDION 1: 🎟 MY ACTIVITY */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('activity')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'activity' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Ticket size={18} className="text-yellow-600" />
                <span>🎟 My Activity</span>
              </span>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform duration-300 ${openSection === 'activity' ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence initial={false}>
              {openSection === 'activity' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-6">
                    {/* Activity lists */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Upcoming Events</h4>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">{upcomingEventsCount} scheduled</span>
                      </div>
                      
                      {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No upcoming registered events.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').map(b => (
                            <div key={b.id} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-3xs">
                              <div>
                                <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                <p className="text-[10px] text-gray-400 mt-1 font-semibold">{new Date(b.eventDate).toLocaleDateString()}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase text-green-700 bg-green-50 px-2 py-1 rounded border border-green-150">Confirmed</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking History</h4>
                      {bookings.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No booking records found.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {bookings.map(b => (
                            <div key={b.id} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-3xs">
                              <div>
                                <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                <p className="text-[10px] text-gray-400 mt-1 font-semibold">Ordered: {new Date(b.eventDate).toLocaleDateString()}</p>
                              </div>
                              <span className="text-[10px] font-black text-gray-900">₹{b.totalPrice}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Attended Events</h4>
                      {bookings.filter(b => new Date(b.eventDate) < new Date() && b.status === 'CONFIRMED').length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No historical attended events.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {bookings.filter(b => new Date(b.eventDate) < new Date() && b.status === 'CONFIRMED').map(b => (
                            <div key={b.id} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-3xs">
                              <div>
                                <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                <p className="text-[10px] text-gray-400 mt-1 font-semibold">Attended: {new Date(b.eventDate).toLocaleDateString()}</p>
                              </div>
                              <span className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">Past</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Wishlist</h4>
                      {wishlist.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No saved wishlist items.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {wishlist.map(w => (
                            <div key={w.id} className="bg-white border border-gray-200 p-3.5 rounded-xl flex items-center justify-between shadow-3xs">
                              <span className="font-extrabold text-xs text-gray-900 truncate pr-2">{w.title}</span>
                              <button 
                                onClick={() => router.push(`/events/${w.id}`)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider shrink-0 transition-colors"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Downloaded Tickets</h4>
                      {bookings.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No digital tickets available.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {bookings.map(b => (
                            <div key={b.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                              <div>
                                <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                <p className="text-[10px] text-gray-400 mt-1 font-semibold">Pass code: #{b.id.slice(0, 8)}</p>
                              </div>
                              
                              <div className="flex gap-2 shrink-0">
                                {b.ticketCodes?.map((code: string) => (
                                  <button 
                                    key={code} 
                                    onClick={() => setSelectedTicketCode(code)}
                                    className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-250 text-yellow-800 font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all"
                                  >
                                    <Download size={11} /> Pass
                                  </button>
                                ))}
                              </div>
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

          {/* ACCORDION 2: 💳 PAYMENTS */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('payments')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'payments' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <CreditCard size={18} className="text-yellow-600" />
                <span>💳 Payments</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment History & Invoices</h4>
                      {bookings.length === 0 ? (
                        <p className="text-xs text-gray-400 font-semibold italic">No invoicing statements available.</p>
                      ) : (
                        <div className="space-y-2.5">
                          {bookings.map(b => (
                            <div key={b.id} className="bg-white border border-gray-200 p-5 rounded-xl flex justify-between items-center shadow-3xs">
                              <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Transaction #{b.id.slice(0, 8)}</p>
                                <h5 className="font-extrabold text-sm text-gray-900 mt-1">{b.eventTitle}</h5>
                                <p className="text-[10px] text-gray-400 mt-1 font-bold flex items-center gap-1"><CheckCircle2 size={10} className="text-green-600" /> Settle status: Complete</p>
                              </div>
                              
                              <div className="text-right">
                                <span className="font-black text-gray-900 text-sm">₹{b.totalPrice}</span>
                                <button 
                                  onClick={() => alert(`Invoice receipt generated for transaction: #${b.id}`)}
                                  className="text-[9px] font-black text-yellow-600 hover:text-yellow-700 underline mt-1.5 block"
                                >
                                  View Invoice
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Refund Status</h4>
                      <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-3 shadow-3xs">
                        <Info size={16} className="text-yellow-600 shrink-0" />
                        <p className="text-xs text-gray-500 font-semibold leading-relaxed">No pending refund requests found. All ticket cancellations process automatically to origin sources within 5 working days.</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Transaction Details</h4>
                      <p className="text-xs text-gray-400 font-semibold">Payment transactions are protected securely by Razorpay PCI-DSS standards.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACCORDION 3: 🔔 NOTIFICATIONS */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('notifications')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'notifications' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Bell size={18} className="text-yellow-600" />
                <span>🔔 Notifications</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-4">
                    {[
                      { key: 'bookingUpdates', title: 'Booking Updates', desc: 'Alert me immediately on new purchases and registration status updates.' },
                      { key: 'eventReminders', title: 'Event Reminders', desc: 'Receive reminders 24 hours prior to the event schedule.' },
                      { key: 'announcements', title: 'Announcements', desc: 'Important platform-wide announcements and organizer updates.' },
                      { key: 'promoOffers', title: 'Promotional Offers', desc: 'Get newsletters, brand highlights, and exclusive discounts.' }
                    ].map(item => (
                      <div key={item.key} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                        <div>
                          <h5 className="text-xs font-black text-gray-900">{item.title}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={(settingsToggles as any)[item.key]} 
                          onChange={e => setSettingsToggles(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="w-4.5 h-4.5 rounded text-yellow-500 focus:ring-yellow-400 border-gray-300 transition-all shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACCORDION 4: 🎁 REWARDS */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('rewards')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'rewards' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Gift size={18} className="text-yellow-600" />
                <span>🎁 Rewards</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white border border-gray-200 p-5 rounded-2xl text-center shadow-3xs">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward Points</span>
                        <p className="text-3xl font-black text-yellow-600 mt-1">{rewardPoints} pts</p>
                        <p className="text-[10px] text-gray-500 font-semibold mt-1">Settle points during ticket bookings for discounts.</p>
                      </div>

                      <div className="bg-white border border-gray-200 p-5 rounded-2xl text-center shadow-3xs">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referral Program</span>
                        <p className="text-lg font-mono font-black text-gray-900 mt-2 select-all">{referralCode}</p>
                        <p className="text-[9px] text-gray-500 font-semibold mt-1">Copy code. Earn 200 points on their first booking.</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Coupons & Exclusive Offers</h4>
                      <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                        <div>
                          <span className="px-2.5 py-0.5 bg-yellow-100 border border-yellow-200 text-yellow-800 text-[9px] font-black uppercase tracking-wider rounded">WELCOME100</span>
                          <p className="text-[10px] text-gray-400 mt-1.5 font-semibold">Flat ₹100 discount on your first event purchase.</p>
                        </div>
                        <span className="text-xs font-black text-green-700">Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACCORDION 5: ⚙ SETTINGS */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('settings')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'settings' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Settings size={18} className="text-yellow-600" />
                <span>⚙ Settings</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-8">
                    {/* Edit Profile Form */}
                    <form onSubmit={handleSave} className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Edit Profile Info</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                          <input 
                            type="text" 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)} 
                            placeholder="First name"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                          <input 
                            type="text" 
                            value={lastName} 
                            onChange={e => setLastName(e.target.value)} 
                            placeholder="Last name"
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Save size={12} /> Save Info
                      </button>
                    </form>

                    {/* Change Password */}
                    <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-150 pt-6">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Change Password</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input 
                          type="password" 
                          value={passwordForm.current} 
                          onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                          placeholder="Current Password" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                        />
                        <input 
                          type="password" 
                          value={passwordForm.newPass} 
                          onChange={e => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                          placeholder="New Password" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                        />
                        <input 
                          type="password" 
                          value={passwordForm.confirm} 
                          onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                          placeholder="Confirm Password" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5"
                      >
                        <Lock size={12} /> Update Password
                      </button>
                    </form>

                    {/* Notification, Privacy, Dark Mode & Language settings */}
                    <div className="border-t border-gray-150 pt-6 space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Preferences</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                          <div>
                            <h5 className="text-xs font-black text-gray-900">Dark Mode</h5>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Reskin UI theme to dark mode.</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settingsToggles.darkMode} 
                            onChange={e => setSettingsToggles(prev => ({ ...prev, darkMode: e.target.checked }))}
                            className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400 border-gray-300 shrink-0"
                          />
                        </div>

                        <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-3xs">
                          <div>
                            <h5 className="text-xs font-black text-gray-900">Language</h5>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Select system display language.</p>
                          </div>
                          <select 
                            value={language}
                            onChange={e => setLanguage(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg p-1 text-[10px] font-bold text-gray-700 focus:outline-none focus:border-yellow-400"
                          >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Tamil</option>
                            <option>Kannada</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="border-t border-gray-150 pt-6">
                      <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Danger Zone</h4>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 mb-4">Permanently erase your data, tickets, and order logs.</p>
                      <button 
                        type="button"
                        onClick={deleteAccount} 
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACCORDION 6: 📞 SUPPORT */}
          <div className="border-b border-gray-150/70">
            <button
              onClick={() => toggleSection('support')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'support' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <PhoneCall size={18} className="text-yellow-600" />
                <span>📞 Support</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Help Center & Support Desk</h4>
                      {supportStatus ? (
                        <div className="bg-white border border-gray-200 p-5 rounded-xl text-center shadow-3xs">
                          <CheckCircle2 size={24} className="text-yellow-600 mx-auto mb-2" />
                          <h5 className="font-extrabold text-sm text-gray-900">{supportStatus}</h5>
                          <p className="text-[10px] text-gray-500 font-semibold mt-1">We will contact you via email shortly.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea 
                            rows={3} 
                            placeholder="Report a problem or request event assistance..."
                            value={supportMsg}
                            onChange={e => setSupportMsg(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-yellow-400 text-gray-800 font-semibold shadow-3xs"
                          />
                          <button 
                            onClick={() => { if (supportMsg.trim()) setSupportStatus('Report Submitted successfully'); }}
                            className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-3xs"
                          >
                            Submit Query
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Frequently Asked Questions (FAQs)</h4>
                      <div className="space-y-2.5 text-xs font-semibold text-gray-500">
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-3xs">
                          <h5 className="font-black text-gray-900">How do I cancel my booking?</h5>
                          <p className="mt-1 leading-relaxed text-[10px]">Open your Activity tab and check active tickets list for cancellations options.</p>
                        </div>
                        <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-3xs">
                          <h5 className="font-black text-gray-900">Can I apply promo coupons at checkout?</h5>
                          <p className="mt-1 leading-relaxed text-[10px]">Yes, select coupons under rewards or apply active codes during checkout booking overlays.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACCORDION 7: 🌐 MORE */}
          <div>
            <button
              onClick={() => toggleSection('more')}
              className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'more' ? 'bg-yellow-50/20' : ''}`}
            >
              <span className="flex items-center gap-3">
                <Globe size={18} className="text-yellow-600" />
                <span>🌐 More Options</span>
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
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden bg-[#FAFAFA]"
                >
                  <div className="p-6 border-t border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => alert('Referral URL copied: eventbooking-app.in')}
                        className="bg-white border border-gray-200 p-5 rounded-xl text-left flex items-center gap-3 hover:border-yellow-400 transition-colors shadow-3xs"
                      >
                        <Share2 className="text-yellow-600" size={20} />
                        <div>
                          <h5 className="text-xs font-black text-gray-900">Share App</h5>
                          <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Spread EventBooking to friends.</p>
                        </div>
                      </button>

                      <button 
                        onClick={() => alert('Thank you for rating our app 5 stars!')}
                        className="bg-white border border-gray-200 p-5 rounded-xl text-left flex items-center gap-3 hover:border-yellow-400 transition-colors shadow-3xs"
                      >
                        <Star className="text-yellow-600" size={20} />
                        <div>
                          <h5 className="text-xs font-black text-gray-900">Rate App</h5>
                          <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Review experience on store.</p>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-gray-150 pt-5 space-y-3.5 text-xs font-semibold text-gray-500 leading-relaxed">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Legal Details & Policies</h4>
                      <p>Terms of service, Privacy policies, and cancellation structures are binding for every event pass reservation.</p>
                      <p>EventBooking monolith version: <strong>v3.0.0-PROD</strong></p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* 🚪 Premium Log Out Button separately styled at the bottom */}
        {!session?.roles?.includes('ROLE_ADMIN') && (
          <div className="mt-8 pt-6 flex justify-center border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold px-12 py-4 rounded-2xl transition-all flex items-center gap-2 active:scale-95 shadow-2xs text-xs"
            >
              <LogOut size={16} />
              <span>Log Out of Account</span>
            </button>
          </div>
        )}
      </div>
    </motion.div>

      {/* Ticket Modal for ticket pass visualization */}
      {selectedTicketCode && (
        <TicketModal ticketCode={selectedTicketCode} onClose={() => setSelectedTicketCode(null)} />
      )}
    </div>
  );
}
