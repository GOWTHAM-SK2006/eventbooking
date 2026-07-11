'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  User, Mail, Calendar, LogOut, Sparkles, Ticket, 
  CreditCard, Gift, Settings, PhoneCall, Globe, Bell, 
  ArrowRight, Heart, Award, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  
  // Data counts
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [rewardPoints] = useState(750);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsData, wishlistData] = await Promise.all([
        api.get('/bookings').catch(() => []),
        api.get('/wishlist').catch(() => []),
      ]);
      setBookings(bookingsData);
      setWishlist(wishlistData);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipInfo = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED' || !b.status).length;
    if (bookingCount >= 5) {
      return { level: 'Premium', badgeColor: 'bg-yellow-50 border-yellow-300 text-yellow-700' };
    }
    if (bookingCount >= 2) {
      return { level: 'Gold', badgeColor: 'bg-amber-50 border-amber-300 text-amber-700' };
    }
    return { level: 'Silver', badgeColor: 'bg-slate-50 border-slate-200 text-slate-700' };
  };

  const member = getMembershipInfo();
  const userName = session ? `${session.firstName} ${session.lastName}` : 'User Account';
  const userEmail = session ? session.email : 'user@eventbooking.com';

  const menuCards = [
    {
      title: 'My Activity',
      desc: 'View recent bookings, upcoming schedules, wishlist, and download passes.',
      href: '/profile/activity',
      icon: <Ticket size={20} className="text-[#EAB308]" />,
      bg: 'bg-yellow-50/50 border-yellow-100'
    },
    {
      title: 'Payments',
      desc: 'Manage cards, view transaction histories, invoices, and refund updates.',
      href: '/profile/payments',
      icon: <CreditCard size={20} className="text-blue-500" />,
      bg: 'bg-blue-50/45 border-blue-100'
    },
    {
      title: 'Notifications',
      desc: 'Control system reminder emails, booking updates, and price alerts.',
      href: '/profile/notifications',
      icon: <Bell size={20} className="text-orange-500" />,
      bg: 'bg-orange-50/45 border-orange-100'
    },
    {
      title: 'Rewards',
      desc: 'Check points balance, redeem available coupons, and view referral status.',
      href: '/profile/rewards',
      icon: <Gift size={20} className="text-emerald-500" />,
      bg: 'bg-emerald-50/45 border-emerald-100'
    },
    {
      title: 'Settings',
      desc: 'Modify account details, update credentials, and system preferences.',
      href: '/profile/settings',
      icon: <Settings size={20} className="text-slate-500" />,
      bg: 'bg-slate-50/50 border-slate-200'
    },
    {
      title: 'Support Desk',
      desc: 'Create service tickets, review support history, and browse FAQs.',
      href: '/profile/support',
      icon: <PhoneCall size={20} className="text-purple-500" />,
      bg: 'bg-purple-50/45 border-purple-100'
    },
    {
      title: 'More Details',
      desc: 'Review legal terms, privacy policies, application details, and share app.',
      href: '/profile/more',
      icon: <Globe size={20} className="text-indigo-500" />,
      bg: 'bg-indigo-50/45 border-indigo-100'
    }
  ];

  const handleLogout = () => {
    clearSession();
    window.dispatchEvent(new Event('userLogout'));
    router.push('/login');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      {/* Blurry glassmorphism blobs background decoration */}
      <FloatingBlobs />
      
      <div className="relative z-10">
        
        {/* Header Title */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-250 mb-4"
          >
            <User size={12} className="text-[#EAB308]" />
            <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">User Dashboard</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-5xl font-black tracking-tight text-[#111827] leading-none flex items-baseline gap-2"
          >
            <span>My</span>
            <span className="text-[#EAB308]">Profile</span>
          </motion.h1>
        </div>

        {/* User Card & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          
          {/* USER CARD (4-columns on laptop) */}
          <div className="lg:col-span-4">
            <div className="bg-white/80 border border-gray-200/60 rounded-[20px] p-6 shadow-xs backdrop-blur-md relative overflow-hidden h-full flex flex-col justify-between group">
              {/* Header colored banner splash */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-yellow-50 to-orange-50/50 border-b border-gray-150 -z-10" />
              
              <div className="pt-6">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FFD400] to-[#FFF3B0] text-gray-900 font-black text-xl flex items-center justify-center border-2 border-white shadow-md">
                      {session?.firstName?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-[#111827] text-[#FFD400] p-1 rounded-full border border-white shadow-3xs" title="Verified Account">
                      <Sparkles size={8} className="fill-[#FFD400]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900 leading-tight">{userName}</h3>
                    <div className="mt-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border shadow-3xs ${member.badgeColor}`}>
                        {member.level} Member
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-gray-500 font-semibold pl-1">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gray-400 shrink-0" />
                    <span className="truncate">{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} className="text-gray-400 shrink-0" />
                    <span>Member since June 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATISTICS CARDS (8-columns on laptop) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Stat Card 1: Total Bookings */}
            <div className="bg-white/80 border border-gray-200/60 rounded-[20px] p-6 shadow-xs backdrop-blur-md flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100 shadow-3xs mb-4">
                <Ticket size={20} className="text-[#EAB308]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bookings</p>
                <h4 className="text-3xl font-black text-gray-900 mt-1">{loading ? '...' : bookings.length}</h4>
                <p className="text-[9px] text-gray-400 font-semibold mt-1">Confirmed event reservations</p>
              </div>
            </div>

            {/* Stat Card 2: Wishlist */}
            <div className="bg-white/80 border border-gray-200/60 rounded-[20px] p-6 shadow-xs backdrop-blur-md flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shadow-3xs mb-4">
                <Heart size={20} className="text-red-500 fill-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saved Items</p>
                <h4 className="text-3xl font-black text-gray-900 mt-1">{loading ? '...' : wishlist.length}</h4>
                <p className="text-[9px] text-gray-400 font-semibold mt-1">Events saved in your wishlist</p>
              </div>
            </div>

            {/* Stat Card 3: Reward Points */}
            <div className="bg-white/80 border border-gray-200/60 rounded-[20px] p-6 shadow-xs backdrop-blur-md flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-3xs mb-4">
                <Award size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loyalty Points</p>
                <h4 className="text-3xl font-black text-[#EAB308] mt-1">{rewardPoints}</h4>
                <p className="text-[9px] text-gray-400 font-semibold mt-1">Points available for checkout discounts</p>
              </div>
            </div>

          </div>
        </div>

        {/* Menu Cards Title */}
        <div className="border-t border-gray-150 pt-8 mb-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Modules</h3>
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {menuCards.map((card, idx) => (
            <Link 
              key={idx} 
              href={card.href}
              className="bg-white/80 border border-gray-200/60 rounded-[20px] p-6 shadow-3xs backdrop-blur-md hover:border-[#FFD400]/40 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between items-start group"
            >
              <div className="w-full">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shadow-3xs mb-4 ${card.bg}`}>
                  {card.icon}
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-[#EAB308] transition-colors">{card.title}</h4>
                <p className="text-[11px] text-gray-400 font-semibold mt-2 leading-relaxed">{card.desc}</p>
              </div>
              
              <div className="w-full flex justify-end mt-6">
                <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-950 group-hover:bg-yellow-50 group-hover:border-yellow-200 transition-colors">
                  <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Log Out Button bottom */}
        {!session?.roles?.includes('ROLE_ADMIN') && (
          <div className="mt-12 pt-8 flex justify-center border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-600 font-extrabold px-10 py-3.5 rounded-2xl transition-all flex items-center gap-2.5 active:scale-95 shadow-3xs text-xs"
            >
              <LogOut size={15} />
              <span>Log Out of Account</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
