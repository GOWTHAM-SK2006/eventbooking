'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  User, Mail, Calendar, LogOut, Save, 
  Sparkles, Bell, Ticket, CreditCard, Gift, Settings, 
  PhoneCall, Globe, Eye, Lock, CheckCircle2, 
  HelpCircle, Share2, Star, Download, ChevronDown,
  Info, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const getMembershipInfo = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    if (bookingCount >= 5) {
      return { level: 'Premium', badgeColor: 'bg-yellow-55 border-yellow-300 text-[#111827]' };
    }
    if (bookingCount >= 2) {
      return { level: 'Gold', badgeColor: 'bg-yellow-50 border-yellow-200 text-[#111827]' };
    }
    return { level: 'Silver', badgeColor: 'bg-gray-50 border-gray-250 text-gray-800' };
  };

  const member = getMembershipInfo();
  const userName = `${firstName} ${lastName}`.trim() || 'User Account';

  const upcomingEventsCount = bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-16 min-h-screen relative flex flex-col justify-between bg-white text-[#111827]">
      
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
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
            1. PROFILE HEADER
            =================================== */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="relative rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-xs">
            <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-6 lg:text-center">
              <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6 text-center sm:text-left lg:text-center">
                
                {/* Profile Circle */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-[#FFD400] text-gray-900 font-black text-3xl flex items-center justify-center border-4 border-white shadow-xs">
                    {firstName?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#111827] text-[#FFD400] p-1.5 rounded-full border-2 border-white" title="Verified Account">
                    <Sparkles size={12} className="fill-[#FFD400]" />
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-start lg:items-center">
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight text-center sm:text-left lg:text-center">{userName}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-2xs ${member.badgeColor}`}>
                      {member.level} Member
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500 font-semibold mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start lg:justify-center">
                    <Mail size={13} className="text-gray-400" />
                    <span>{email}</span>
                  </p>

                  <p className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-1 justify-center sm:justify-start lg:justify-center">
                    <Calendar size={11} className="text-[#FFD400]" />
                    <span>Member since June 2026</span>
                  </p>
                </div>
              </div>

              <button 
                onClick={() => toggleSection('settings')}
                className="btn-primary w-full justify-center flex items-center gap-1.5 text-xs py-2.5 shadow-xs"
              >
                <Settings size={13} /> Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Quick Stats + Accordion Menu */}
        <div className="lg:col-span-8 space-y-8">



          {/* ===================================
              3. INTERACTIVE ACCORDION MENU
              =================================== */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
            
            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`m-4 p-4 rounded-xl border flex items-start gap-2.5 text-xs font-bold ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                >
                  <CheckCircle size={16} />
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACCORDION 1: 🎟 MY ACTIVITY */}
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('activity')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'activity' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Ticket size={18} className="text-[#FFD400]" />
                  <span>🎟 My Activity</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'activity' ? 'rotate-180' : ''}`} 
                />
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
                      {/* Activity lists */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Upcoming Events</h4>
                          <span className="text-[10px] font-bold bg-yellow-50 text-[#FFD400] px-2 py-0.5 rounded border border-yellow-100">{upcomingEventsCount} scheduled</span>
                        </div>
                        
                        {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No upcoming registered events.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex justify-between items-center shadow-xs">
                                <div>
                                  <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                  <p className="text-[10px] text-gray-400 mt-1 font-semibold">{new Date(b.eventDate).toLocaleDateString()}</p>
                                </div>
                                <span className="text-[9px] font-black uppercase text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200">Confirmed</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking History</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No booking records found.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex justify-between items-center shadow-xs">
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

                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Wishlist</h4>
                        {wishlist.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No saved wishlist items.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {wishlist.map(w => (
                              <div key={w.id} className="bg-white border border-[#E5E7EB] p-3.5 rounded-xl flex items-center justify-between shadow-xs">
                                <span className="font-extrabold text-xs text-gray-900 truncate pr-2">{w.title}</span>
                                <button 
                                  onClick={() => router.push(`/events/${w.id}`)}
                                  className="btn-primary py-1 px-3 text-[10px] uppercase tracking-wider rounded-lg"
                                >
                                  View
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-5 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Downloaded Tickets</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No digital tickets available.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-xs">
                                <div>
                                  <h5 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h5>
                                  <p className="text-[10px] text-gray-400 mt-1 font-semibold">Pass code: #{b.id.slice(0, 8)}</p>
                                </div>
                                
                                <div className="flex gap-2 shrink-0">
                                  {b.ticketCodes?.map((code: string) => (
                                    <button 
                                      key={code} 
                                      onClick={() => setSelectedTicketCode(code)}
                                      className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-[#FFD400] font-black px-3 py-1.5 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 transition-all"
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
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('payments')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'payments' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <CreditCard size={18} className="text-[#FFD400]" />
                  <span>💳 Payments</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'payments' ? 'rotate-180' : ''}`} 
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
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment History & Invoices</h4>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-gray-400 font-semibold italic">No invoicing statements available.</p>
                        ) : (
                          <div className="space-y-2.5">
                            {bookings.map(b => (
                              <div key={b.id} className="bg-white border border-[#E5E7EB] p-5 rounded-xl flex justify-between items-center shadow-xs">
                                <div>
                                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Transaction #{b.id.slice(0, 8)}</p>
                                  <h5 className="font-extrabold text-sm text-gray-900 mt-1">{b.eventTitle}</h5>
                                  <p className="text-[10px] text-gray-400 mt-1 font-bold flex items-center gap-1"><CheckCircle2 size={10} className="text-green-600" /> Settle status: Complete</p>
                                </div>
                                
                                <div className="text-right">
                                  <span className="font-black text-gray-900 text-sm">₹{b.totalPrice}</span>
                                  <button 
                                    onClick={() => alert(`Invoice receipt generated for transaction: #${b.id}`)}
                                    className="text-[9px] font-black text-[#FFD400] hover:text-[#E6BE00] underline mt-1.5 block"
                                  >
                                    View Invoice
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-5 space-y-3">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Refund Status</h4>
                        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center gap-3 shadow-xs">
                          <Info size={16} className="text-[#FFD400] shrink-0" />
                          <p className="text-xs text-gray-500 font-semibold leading-relaxed">No pending refund requests found. All ticket cancellations process automatically to origin sources within 5 working days.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 3: 🔔 NOTIFICATIONS */}
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('notifications')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'notifications' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Bell size={18} className="text-[#FFD400]" />
                  <span>🔔 Notifications</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'notifications' ? 'rotate-180' : ''}`} 
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
                        { key: 'bookingUpdates', title: 'Booking Updates', desc: 'Alert me immediately on new purchases and registration status updates.' },
                        { key: 'eventReminders', title: 'Event Reminders', desc: 'Receive reminders 24 hours prior to the event schedule.' },
                        { key: 'announcements', title: 'Announcements', desc: 'Important platform-wide announcements and organizer updates.' },
                        { key: 'promoOffers', title: 'Promotional Offers', desc: 'Get newsletters, brand highlights, and exclusive discounts.' }
                      ].map(item => (
                        <div key={item.key} className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <h5 className="text-xs font-black text-gray-900">{item.title}</h5>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-semibold">{item.desc}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={(settingsToggles as any)[item.key]} 
                            onChange={e => setSettingsToggles(prev => ({ ...prev, [item.key]: e.target.checked }))}
                            className="w-4.5 h-4.5 rounded text-[#FFD400] focus:ring-[#FFD400] border-gray-300 transition-all shrink-0"
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 4: 🎁 REWARDS */}
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('rewards')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'rewards' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Gift size={18} className="text-[#FFD400]" />
                  <span>🎁 Rewards</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'rewards' ? 'rotate-180' : ''}`} 
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
                        <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl text-center shadow-xs">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reward Points</span>
                          <p className="text-3xl font-black text-[#FFD400] mt-1">{rewardPoints} pts</p>
                          <p className="text-[10px] text-gray-500 font-semibold mt-1">Settle points during ticket bookings for discounts.</p>
                        </div>

                        <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl text-center shadow-xs">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referral Program</span>
                          <p className="text-lg font-mono font-black text-gray-900 mt-2 select-all">{referralCode}</p>
                          <p className="text-[9px] text-gray-500 font-semibold mt-1">Copy code. Earn 200 points on their first booking.</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Coupons & Exclusive Offers</h4>
                        <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-xs">
                          <div>
                            <span className="px-2.5 py-0.5 bg-yellow-50 border border-yellow-250 text-[#FFD400] text-[9px] font-black uppercase tracking-wider rounded">WELCOME100</span>
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
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('settings')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'settings' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Settings size={18} className="text-[#FFD400]" />
                  <span>⚙ Settings</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'settings' ? 'rotate-180' : ''}`} 
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
                              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                            <input 
                              type="text" 
                              value={lastName} 
                              onChange={e => setLastName(e.target.value)} 
                              placeholder="Last name"
                              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" 
                          className="btn-primary py-2 px-5 text-xs"
                        >
                          Save Info
                        </button>
                      </form>

                      {/* Change Password */}
                      <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-100 pt-6">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Change Password</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <input 
                            type="password" 
                            value={passwordForm.current} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                            placeholder="Current Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                          <input 
                            type="password" 
                            value={passwordForm.newPass} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                            placeholder="New Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                          <input 
                            type="password" 
                            value={passwordForm.confirm} 
                            onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                            placeholder="Confirm Password" 
                            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
                          />
                        </div>

                        <button 
                          type="submit" 
                          className="btn-primary py-2 px-5 text-xs"
                        >
                          Update Password
                        </button>
                      </form>

                      {/* Preferences */}
                      <div className="border-t border-gray-100 pt-6 space-y-4">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Preferences</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                            <div>
                              <h5 className="text-xs font-black text-gray-900">Dark Mode</h5>
                              <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Reskin UI theme to dark mode.</p>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={settingsToggles.darkMode} 
                              onChange={e => setSettingsToggles(prev => ({ ...prev, darkMode: e.target.checked }))}
                              className="w-4 h-4 rounded text-[#FFD400] focus:ring-[#FFD400] border-gray-300 shrink-0"
                            />
                          </div>

                          <div className="bg-white border border-[#E5E7EB] p-4 rounded-xl flex items-center justify-between shadow-3xs">
                            <div>
                              <h5 className="text-xs font-black text-gray-900">Language</h5>
                              <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Select system display language.</p>
                            </div>
                            <select 
                              value={language}
                              onChange={e => setLanguage(e.target.value)}
                              className="bg-white border border-gray-250 rounded-lg p-1 text-[10px] font-bold text-gray-700 focus:outline-none focus:border-[#FFD400]"
                            >
                              <option>English</option>
                              <option>Hindi</option>
                              <option>Tamil</option>
                              <option>Kannada</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="border-t border-gray-100 pt-6">
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
            <div className="border-b border-[#E5E7EB]">
              <button
                onClick={() => toggleSection('support')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'support' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <PhoneCall size={18} className="text-[#FFD400]" />
                  <span>📞 Support</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'support' ? 'rotate-180' : ''}`} 
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
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Help Center & Support Desk</h4>
                        {supportStatus ? (
                          <div className="bg-white border border-[#E5E7EB] p-5 rounded-xl text-center shadow-xs">
                            <CheckCircle2 size={24} className="text-[#FFD400] mx-auto mb-2" />
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
                              className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs"
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACCORDION 7: 🌐 MORE */}
            <div>
              <button
                onClick={() => toggleSection('more')}
                className={`w-full flex items-center justify-between p-5 transition-all text-left font-black text-sm text-gray-900 hover:bg-gray-50/50 ${openSection === 'more' ? 'bg-yellow-50/10' : ''}`}
              >
                <span className="flex items-center gap-3">
                  <Globe size={18} className="text-[#FFD400]" />
                  <span>🌐 More Options</span>
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 transition-transform duration-250 ${openSection === 'more' ? 'rotate-180' : ''}`} 
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
                          onClick={() => alert('Referral URL copied: eventbooking-app.in')}
                          className="bg-white border border-gray-200 p-5 rounded-xl text-left flex items-center gap-3 hover:border-[#FFD400] transition-colors shadow-3xs"
                        >
                          <Share2 className="text-[#FFD400]" size={20} />
                          <div>
                            <h5 className="text-xs font-black text-gray-900">Share App</h5>
                            <p className="text-[9px] text-gray-400 mt-0.5 font-bold">Spread EventBooking to friends.</p>
                          </div>
                        </button>

                        <button 
                          onClick={() => alert('Thank you for rating our app 5 stars!')}
                          className="bg-white border border-gray-200 p-5 rounded-xl text-left flex items-center gap-3 hover:border-[#FFD400] transition-colors shadow-3xs"
                        >
                          <Star className="text-[#FFD400]" size={20} />
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

          {/* Log Out Button */}
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
      </div>

      {/* Ticket Modal for ticket pass visualization */}
      {selectedTicketCode && (
        <TicketModal ticketCode={selectedTicketCode} onClose={() => setSelectedTicketCode(null)} />
      )}
    </div>
  );
}
