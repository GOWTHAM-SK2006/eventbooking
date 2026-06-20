'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  User, Mail, Calendar, LogOut, Save, Loader, Check, AlertCircle, 
  Sparkles, Shield, Bell, Ticket, CreditCard, Gift, Settings, 
  PhoneCall, Globe, Eye, Lock, Trash2, Heart, Award, CheckCircle2, 
  HelpCircle, Share2, Star, Download, ChevronRight, FileText, RefreshCw 
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
  
  // Loading & Alerts
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active Category tab selector
  const [activeTab, setActiveTab] = useState<'activity' | 'payments' | 'notifications' | 'rewards' | 'settings' | 'support' | 'more'>('activity');

  // Dynamic Data States
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string | null>(null);

  // Settings Toggles
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [settingsToggles, setSettingsToggles] = useState({
    emailReminders: true,
    bookingUpdates: true,
    promoEmails: false,
    publicProfile: false,
  });

  // Rewards Mock
  const [rewardPoints, setRewardPoints] = useState(750);
  const [referralCode] = useState('EVBOOK-7729');

  // Support inputs
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSent, setSupportSent] = useState(false);

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

    // Fetch dynamic user data
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
      console.error('Error fetching dashboard data:', err);
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
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      // Mocking update password or routing request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Password changed successfully' });
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
    if (confirm('WARNING: Are you sure you want to permanently delete your account? This action is irreversible.')) {
      alert('Account deletion request initiated.');
      handleLogout();
    }
  };

  // Determine membership badge
  const getMembershipBadge = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED').length;
    if (bookingCount >= 5) return { name: 'Premium', color: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' };
    if (bookingCount >= 2) return { name: 'Gold', color: 'bg-yellow-100 border border-yellow-300 text-yellow-800' };
    return { name: 'Silver', color: 'bg-gray-100 border border-gray-300 text-gray-800' };
  };

  const membership = getMembershipBadge();
  const userName = `${firstName} ${lastName}`.trim() || 'User Account';

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 min-h-screen relative flex flex-col justify-between">
      <FloatingBlobs />

      <div>
        {/* 1. 👤 PROFILE HEADER SECTION */}
        <div className="w-full bg-white border border-gray-200 rounded-3xl p-6 md:p-8 mb-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              {/* Profile Photo */}
              <div className="w-20 h-20 rounded-full bg-yellow-400 text-gray-900 font-black text-2xl flex items-center justify-center border-4 border-yellow-50/50 shadow-md">
                {firstName?.charAt(0) || 'U'}
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900">{userName}</h1>
                  {/* Membership Badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${membership.color}`}>
                    {membership.name} Member
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-semibold mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail size={14} />
                  <span>{email}</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('settings')}
              className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold px-6 py-3 rounded-xl text-xs transition-all active:scale-95 shadow-xs"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Outer Frame with Sidebar Navigation & Main Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2 bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
            <button
              onClick={() => setActiveTab('activity')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'activity' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Ticket size={16} /> 🎟 My Activity
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'payments' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <CreditCard size={16} /> 💳 Payments
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'notifications' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Bell size={16} /> 🔔 Notifications
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'rewards' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Gift size={16} /> 🎁 Rewards
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'settings' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Settings size={16} /> ⚙️ Settings
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'support' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <PhoneCall size={16} /> 📞 Support
              </span>
              <ChevronRight size={12} />
            </button>

            <button
              onClick={() => setActiveTab('more')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all font-extrabold text-xs ${activeTab === 'more' ? 'bg-yellow-400 text-gray-900' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-2">
                <Globe size={16} /> 🌐 More
              </span>
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 min-h-[460px] shadow-xs">
            <AnimatePresence mode="wait">
              
              {/* Alert message notification */}
              {message && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start gap-2.5 text-xs font-bold ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* 🎟 TAB: ACTIVITY */}
              {activeTab === 'activity' && (
                <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">My Activity</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Monitor your active entry tickets, historical event logs, and wishlisted events.</p>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-2xl font-black text-gray-900">{bookings.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 block mt-1 uppercase tracking-wider">Bookings</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-2xl font-black text-gray-900">
                        {bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status === 'CONFIRMED').length}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 block mt-1 uppercase tracking-wider">Upcoming</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-2xl font-black text-gray-900">{wishlist.length}</span>
                      <span className="text-[9px] font-bold text-gray-400 block mt-1 uppercase tracking-wider">Wishlist</span>
                    </div>
                  </div>

                  {/* Bookings & Passes List */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Tickets</h3>
                    {bookings.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold italic">No booking records found.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings.map(b => (
                          <div key={b.id} className="border border-gray-100 p-4 rounded-xl flex items-center justify-between gap-4">
                            <div>
                              <h4 className="font-extrabold text-sm text-gray-900">{b.eventTitle}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 font-semibold">{new Date(b.eventDate).toLocaleDateString()}</p>
                            </div>

                            <div className="flex gap-2">
                              {b.ticketCodes?.map((code: string) => (
                                <button 
                                  key={code} 
                                  onClick={() => setSelectedTicketCode(code)}
                                  className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800 font-extrabold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5 transition-colors"
                                >
                                  <Download size={12} /> Download
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* 💳 TAB: PAYMENTS */}
              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">Payments</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Track payment transactions, view billing invoices, and check refund actions.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment History & Invoices</h3>
                    {bookings.length === 0 ? (
                      <p className="text-xs text-gray-400 font-semibold italic">No billing statements available.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings.map(b => (
                          <div key={b.id} className="bg-[#FAFAFA] border border-gray-100 p-4.5 rounded-xl flex justify-between items-center gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction #{b.id.slice(0, 8)}</p>
                              <h4 className="font-extrabold text-sm text-gray-900 mt-1">{b.eventTitle}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5 font-bold flex items-center gap-1"><RefreshCw size={10} /> Status: Success</p>
                            </div>

                            <div className="text-right">
                              <span className="font-black text-gray-900 text-sm block">₹{b.totalPrice}</span>
                              <button 
                                onClick={() => alert(`Invoice receipt generated for transaction: #${b.id}`)}
                                className="text-[9px] font-black text-yellow-600 hover:text-yellow-700 underline mt-1 block"
                              >
                                View Invoice
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-6 space-y-3">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Saved Payment Methods</h4>
                      <p className="text-xs text-gray-400 font-semibold">No payment methods currently saved. Cards are saved securely on checkout using Razorpay.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 🔔 TAB: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">Notifications</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Configure which system reminders and alerts you would like to receive.</p>
                  </div>

                  <div className="space-y-4.5">
                    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Event Reminders</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Receive reminders 24 hours prior to the event schedule.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsToggles.emailReminders} 
                        onChange={e => setSettingsToggles(prev => ({ ...prev, emailReminders: e.target.checked }))}
                        className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400 border-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Booking Updates</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Alert me immediately on new purchases and booking updates.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsToggles.bookingUpdates} 
                        onChange={e => setSettingsToggles(prev => ({ ...prev, bookingUpdates: e.target.checked }))}
                        className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400 border-gray-300"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Promotional Notifications</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Get newsletters, new event highlights, and coupon updates.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsToggles.promoEmails} 
                        onChange={e => setSettingsToggles(prev => ({ ...prev, promoEmails: e.target.checked }))}
                        className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400 border-gray-300"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 🎁 TAB: REWARDS */}
              {activeTab === 'rewards' && (
                <motion.div key="rewards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">Rewards</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Use collected loyalty points or copy referrals to get promotional coupons.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 p-5 rounded-2xl bg-yellow-50/20 text-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loyalty Wallet</span>
                      <p className="text-3xl font-black text-yellow-600 mt-1">{rewardPoints} pts</p>
                      <p className="text-[10px] text-gray-500 font-semibold mt-1">100 points = ₹10 discount on next tickets.</p>
                    </div>

                    <div className="border border-gray-200 p-5 rounded-2xl text-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Referral Code</span>
                      <p className="text-xl font-mono font-black text-gray-900 mt-2 select-all">{referralCode}</p>
                      <p className="text-[9px] text-gray-500 font-semibold mt-1">Get 200 points on friend's first reservation checkout.</p>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Coupon Codes</h3>
                    <div className="border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-yellow-100 border border-yellow-200 text-yellow-800 text-[9px] font-black uppercase tracking-wider rounded">WELCOME100</span>
                        <p className="text-[10px] text-gray-400 mt-1 font-semibold">Flat ₹100 discount on your first event purchase.</p>
                      </div>
                      <span className="text-xs font-black text-green-700">Active</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ⚙️ TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">Account Settings</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Manage credentials, details, password configurations, or close user accounts.</p>
                  </div>

                  {/* Personal details update */}
                  <form onSubmit={handleSave} className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Personal Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        placeholder="First name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        placeholder="Last name"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-4 py-2 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Save size={12} /> Save Info
                    </button>
                  </form>

                  {/* Password update form */}
                  <form onSubmit={handlePasswordChange} className="space-y-4 border-t border-gray-100 pt-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Change Password</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input 
                        type="password" 
                        value={passwordForm.current} 
                        onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                        placeholder="Current Password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                      <input 
                        type="password" 
                        value={passwordForm.newPass} 
                        onChange={e => setPasswordForm(prev => ({ ...prev, newPass: e.target.value }))}
                        placeholder="New Password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                      <input 
                        type="password" 
                        value={passwordForm.confirm} 
                        onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                        placeholder="Confirm Password" 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black px-4 py-2 rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <Lock size={12} /> Update Password
                    </button>
                  </form>

                  {/* Account Deletion */}
                  <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-xs font-black text-red-500 uppercase tracking-widest">Danger Zone</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 mb-4">Deleting your account removes all booking history, ticket passes, and points.</p>
                    <button 
                      onClick={deleteAccount} 
                      className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold px-4.5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                    >
                      Delete Account
                    </button>
                  </div>
                </motion.div>
              )}

              {/* 📞 TAB: SUPPORT */}
              {activeTab === 'support' && (
                <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">Support Center</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Contact help desks, review FAQs, or report transactional issues.</p>
                  </div>

                  {supportSent ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl text-center">
                      <CheckCircle2 size={24} className="text-[#EAB308] mx-auto mb-3" />
                      <h4 className="font-extrabold text-gray-900 text-sm">Issue Ticket Submitted</h4>
                      <p className="text-[10px] text-gray-500 mt-1 font-semibold">Our operational team will update you on email within 24 hours.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Submit Issue / Query</h3>
                      <textarea 
                        rows={4} 
                        placeholder="Write support inquiry or transaction issue..." 
                        value={supportMessage}
                        onChange={e => setSupportMessage(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs focus:outline-none focus:border-yellow-400 focus:bg-white text-gray-800 font-semibold"
                      />
                      <button 
                        onClick={() => { if(supportMessage.trim()) setSupportSent(true); }}
                        className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95"
                      >
                        Submit Query
                      </button>
                    </div>
                  )}

                  {/* FAQs list */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Frequently Asked Questions</h3>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <h4 className="font-black text-gray-900 flex items-center gap-1.5"><HelpCircle size={14} /> How do I request refund?</h4>
                        <p className="text-gray-500 mt-1 font-semibold leading-relaxed">Cancel tickets prior to 24 hours of event schedule. Amount settles back to source automatically.</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <h4 className="font-black text-gray-900 flex items-center gap-1.5"><HelpCircle size={14} /> Can I share ticket passes?</h4>
                        <p className="text-gray-500 mt-1 font-semibold leading-relaxed">Yes. Download PDF with gate QR codes and share with details securely.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 🌐 TAB: MORE */}
              {activeTab === 'more' && (
                <motion.div key="more" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">More Options</h2>
                    <p className="text-gray-400 text-[10px] font-bold">Share event booking platform details, rate the web application, or read rules.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => alert('Referral Link copied: eventbooking-platform.com')}
                      className="border border-gray-200 p-4.5 rounded-xl text-left flex items-center gap-3 hover:border-yellow-400 transition-colors"
                    >
                      <Share2 className="text-yellow-600" size={20} />
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Share App</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Copy referral platform address.</p>
                      </div>
                    </button>

                    <button 
                      onClick={() => alert('Thank you for rating EventBooking!')}
                      className="border border-gray-200 p-4.5 rounded-xl text-left flex items-center gap-3 hover:border-yellow-400 transition-colors"
                    >
                      <Star className="text-yellow-600" size={20} />
                      <div>
                        <h4 className="text-xs font-black text-gray-900">Rate App</h4>
                        <p className="text-[9px] text-gray-400 mt-0.5">Give feedback on user experience.</p>
                      </div>
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-3.5 text-xs font-semibold text-gray-500 leading-relaxed">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Company Information</h3>
                    <p>EventBooking Platform version: <strong>v2.1.0-Release</strong></p>
                    <p>Terms & Conditions and Privacy Policy apply for every booking transaction.</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* 🚪 Separate Red Logout Button for users at the bottom of the page */}
        {!session?.roles?.includes('ROLE_ADMIN') && (
          <div className="mt-8 border-t border-gray-200 pt-8 flex justify-center">
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold px-10 py-3.5 rounded-2xl transition-all flex items-center gap-2 active:scale-95 shadow-2xs text-xs"
            >
              <LogOut size={16} />
              <span>Log Out of Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Ticket Modal for ticket pass visualization */}
      {selectedTicketCode && (
        <TicketModal ticketCode={selectedTicketCode} onClose={() => setSelectedTicketCode(null)} />
      )}
    </div>
  );
}
