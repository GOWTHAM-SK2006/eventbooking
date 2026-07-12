'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  ShoppingBag, Heart, Ticket, CreditCard, Bell, Gift, Tag,
  HelpCircle, LifeBuoy, Settings, Share2, Star, FileText,
  Shield, Info, LogOut, ChevronRight, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';

interface MenuItemProps {
  title: string;
  subtitle?: string;
  href?: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}

const MenuItem = ({ title, subtitle, href, icon, iconBg, onClick }: MenuItemProps) => {
  const content = (
    <motion.div 
      whileHover={{ x: 4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="w-full py-4 flex items-center justify-between px-5 hover:bg-black/[0.015] active:bg-black/[0.03] transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 shadow-3xs ${iconBg}`}>
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[13px] font-extrabold text-gray-800 tracking-wide group-hover:text-yellow-600 transition-colors">{title}</span>
          {subtitle && <span className="text-[10px] text-gray-400 font-semibold tracking-normal mt-0.5">{subtitle}</span>}
        </div>
      </div>
      <div className="w-7 h-7 rounded-lg bg-gray-50/50 border border-gray-100 flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all duration-200">
        <ChevronRight size={13} className="text-gray-400 group-hover:text-gray-950 transition-colors" />
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left focus:outline-none block">
        {content}
      </button>
    );
  }

  return (
    <Link href={href || '#'} className="block">
      {content}
    </Link>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
    
    // Fetch bookings
    api.get('/bookings')
      .then(setBookings)
      .catch(() => []);

    // Fetch wishlist
    api.get('/wishlist')
      .then(data => {
        setWishlistCount(data?.length || 0);
      })
      .catch(() => []);
  }, []);

  const handleLogout = () => {
    clearSession();
    window.dispatchEvent(new Event('userLogout'));
    router.push('/login');
  };

  const getMembershipLevel = () => {
    const count = bookings.filter(b => b.status === 'CONFIRMED' || !b.status).length;
    if (count >= 5) return 'Premium';
    if (count >= 2) return 'Gold';
    return 'Silver';
  };

  const memberLevel = getMembershipLevel();
  const now = new Date();
  const activeTicketsCount = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.eventDate) >= now).length;

  const getTierBadge = () => {
    switch (memberLevel) {
      case 'Premium':
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/30 animate-pulse">
            🏆 Premium VIP
          </span>
        );
      case 'Gold':
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-950 shadow-[0_0_10px_rgba(234,179,8,0.4)] border border-yellow-300/30">
            ⭐ Gold Tier
          </span>
        );
      case 'Silver':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-[0_0_8px_rgba(148,163,184,0.3)] border border-slate-300/30">
            🥈 Silver Tier
          </span>
        );
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 relative overflow-hidden">
      <FloatingBlobs />
      
      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200">
            <Sparkles size={12} className="text-[#EAB308]" />
            <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">User Portal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-950 mt-4 leading-none">
            Your <span className="text-[#EAB308]">Profile</span>
          </h1>
          <p className="text-sm md:text-base font-semibold text-gray-400 mt-3 max-w-xl leading-relaxed">
            Manage your personal settings, view active entry passes, track wishlist bookmarks, and unlock loyalty rewards.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          
          {/* LEFT COLUMN: Profile Info Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* VIP Profile Card */}
            <div className="bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden border border-white/10 group">
              {/* Decorative Glows */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-400/20 transition-all duration-500" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Avatar */}
                <div className="relative mb-5 group/avatar">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#FACC15] to-[#FFE066] rounded-full blur-md opacity-40 group-hover/avatar:opacity-75 transition-opacity" />
                  <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-tr from-[#FACC15] to-[#FFE066] text-gray-950 font-black text-3xl flex items-center justify-center border-4 border-white/10 relative z-10 shadow-lg transform group-hover/avatar:scale-105 transition-transform duration-300">
                    {session?.firstName?.charAt(0) || 'U'}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-black text-xl tracking-tight text-white mb-2">
                  {session ? `${session.firstName} ${session.lastName}` : 'Guest User'}
                </h3>
                
                {/* Tier Badge */}
                <div className="mb-4">
                  {getTierBadge()}
                </div>

                {/* Email */}
                <p className="text-xs text-slate-400 font-semibold mb-6 break-all max-w-[240px]">
                  {session?.email || 'loading...'}
                </p>

                {/* Edit Profile Action */}
                <Link 
                  href="/profile/settings" 
                  className="w-full bg-white/10 hover:bg-yellow-450 hover:text-gray-950 text-white font-extrabold text-xs py-3 px-6 rounded-2xl transition-all active:scale-95 border border-white/5 hover:border-yellow-400 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Settings size={14} />
                  <span>Edit Profile Details</span>
                </Link>

                {/* Quick Stats Grid */}
                <div className="w-full grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-white/10">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Bookings</span>
                    <span className="text-lg font-black text-white mt-1">{bookings.length}</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tickets</span>
                    <span className="text-lg font-black text-yellow-400 mt-1">{activeTicketsCount}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Wishlist</span>
                    <span className="text-lg font-black text-white mt-1">{wishlistCount}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-extrabold text-sm rounded-[24px] border border-red-100 transition-all flex items-center justify-center gap-2 shadow-3xs active:scale-98"
            >
              <LogOut size={16} />
              <span>Log Out Account</span>
            </button>

          </motion.div>

          {/* RIGHT COLUMN: Interactive Groups */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GROUP 1: Activity & Access */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-3xl overflow-hidden shadow-3xs p-3 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Activity & Access</span>
                </div>
                <div className="space-y-0.5">
                  <MenuItem 
                    title="Your Bookings & Purchases" 
                    subtitle="View order history & transaction receipts"
                    href="/profile/bookings"
                    icon={<ShoppingBag size={18} className="text-yellow-600" />}
                    iconBg="bg-yellow-50 border border-yellow-100"
                  />
                  <MenuItem 
                    title="Your Wishlist" 
                    subtitle={`Saved events you like (${wishlistCount})`}
                    href="/wishlist"
                    icon={<Heart size={18} className="text-red-500 fill-red-500" />}
                    iconBg="bg-red-50 border border-red-100"
                  />
                  <MenuItem 
                    title="My Tickets" 
                    subtitle={`Digital entry passes & active codes (${activeTicketsCount})`}
                    href="/tickets"
                    icon={<Ticket size={18} className="text-indigo-600" />}
                    iconBg="bg-indigo-50 border border-indigo-100"
                  />
                  <MenuItem 
                    title="Payments" 
                    subtitle="Manage saved payment cards & wallets"
                    href="/profile/payments"
                    icon={<CreditCard size={18} className="text-emerald-600" />}
                    iconBg="bg-emerald-50 border border-emerald-100"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 2: Inbox & Offers */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-3xl overflow-hidden shadow-3xs p-3 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Inbox & Promos</span>
                </div>
                <div className="space-y-0.5">
                  <MenuItem 
                    title="Notifications" 
                    subtitle="System messages, updates & alerts"
                    href="/profile/notifications"
                    icon={<Bell size={18} className="text-orange-600" />}
                    iconBg="bg-orange-50 border border-orange-100"
                  />
                  <MenuItem 
                    title="Rewards" 
                    subtitle="Check loyalty points & milestone badges"
                    href="/profile/rewards"
                    icon={<Sparkles size={18} className="text-yellow-600" />}
                    iconBg="bg-yellow-50 border border-yellow-100"
                  />
                  <MenuItem 
                    title="Offers" 
                    subtitle="Exclusive event discounts & coupons"
                    href="/profile/offers"
                    icon={<Tag size={18} className="text-teal-600" />}
                    iconBg="bg-teal-50 border border-teal-100"
                  />
                  <MenuItem 
                    title="Gift Cards" 
                    subtitle="Redeem, purchase & manage gift vouchers"
                    href="/profile/giftcards"
                    icon={<Gift size={18} className="text-purple-600" />}
                    iconBg="bg-purple-50 border border-purple-100"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 3: Help & Settings */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-3xl overflow-hidden shadow-3xs p-3 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Support & Settings</span>
                </div>
                <div className="space-y-0.5">
                  <MenuItem 
                    title="Help Centre" 
                    subtitle="FAQ documentation & booking support"
                    href="/profile/help"
                    icon={<HelpCircle size={18} className="text-blue-600" />}
                    iconBg="bg-blue-50 border border-blue-100"
                  />
                  <MenuItem 
                    title="Support" 
                    subtitle="Contact 24/7 client resolution agents"
                    href="/profile/support"
                    icon={<LifeBuoy size={18} className="text-pink-600" />}
                    iconBg="bg-pink-50 border border-pink-100"
                  />
                  <MenuItem 
                    title="Account & Settings" 
                    subtitle="Modify credentials & account preferences"
                    href="/profile/settings"
                    icon={<Settings size={18} className="text-slate-600" />}
                    iconBg="bg-slate-50 border border-slate-100"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 4: App & Legal */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/70 backdrop-blur-md border border-gray-200/50 rounded-3xl overflow-hidden shadow-3xs p-3 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 pb-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">App & Legal</span>
                </div>
                <div className="space-y-0.5">
                  <MenuItem 
                    title="Share App" 
                    subtitle="Recommend EventBooking to friends"
                    href="/profile/share"
                    icon={<Share2 size={18} className="text-indigo-600" />}
                    iconBg="bg-indigo-50 border border-indigo-100"
                  />
                  <MenuItem 
                    title="Rate App" 
                    subtitle="Rate us & tell us your feedback"
                    href="/profile/rate"
                    icon={<Star size={18} className="text-yellow-500 fill-yellow-500" />}
                    iconBg="bg-yellow-50 border border-yellow-100"
                  />
                  <MenuItem 
                    title="Terms & Conditions" 
                    subtitle="Platform usage guidelines & policies"
                    href="/terms"
                    icon={<FileText size={18} className="text-slate-600" />}
                    iconBg="bg-slate-50 border border-slate-100"
                  />
                  <MenuItem 
                    title="Privacy Policy" 
                    subtitle="Data security & storage guidelines"
                    href="/privacy"
                    icon={<Shield size={18} className="text-emerald-600" />}
                    iconBg="bg-emerald-50 border border-emerald-100"
                  />
                  <MenuItem 
                    title="About EventBooking" 
                    subtitle="Learn more about our events platform"
                    href="/about"
                    icon={<Info size={18} className="text-sky-600" />}
                    iconBg="bg-sky-50 border border-sky-100"
                  />
                </div>
              </div>
            </motion.div>

          </div>

        </motion.div>
      </div>
    </div>
  );
}
