'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, clearSession } from '../../utils/api';
import { 
  ShoppingBag, Heart, Ticket, CreditCard, Bell, Gift, Tag,
  HelpCircle, LifeBuoy, Settings, Share2, Star, FileText,
  Shield, Info, LogOut, ChevronRight, Sparkles, Compass, Mail
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
  badge?: React.ReactNode;
}

const MenuItem = ({ title, subtitle, href, icon, iconBg, onClick, badge }: MenuItemProps) => {
  const content = (
    <motion.div 
      whileHover={{ x: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="w-full py-3.5 flex items-center justify-between px-4 hover:bg-slate-50/80 active:bg-slate-100/50 rounded-xl transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Rounded Icon Wrapper */}
        <div className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-800 tracking-wide transition-colors group-hover:text-yellow-600">
              {title}
            </span>
            {badge && <div className="flex shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <span className="text-[10.5px] text-slate-400 font-medium tracking-normal mt-0.5 leading-tight">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      <div className="w-6.5 h-6.5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-[#FFD400] group-hover:border-[#FFD400] group-hover:shadow-3xs transition-all duration-250">
        <ChevronRight size={12} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
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
    
    // Fetch user details
    api.get('/bookings')
      .then(setBookings)
      .catch(() => []);

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
          <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-3xs border border-indigo-400/20 flex items-center gap-1">
            🏆 Premium VIP
          </span>
        );
      case 'Gold':
        return (
          <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-3xs border border-yellow-300/20 flex items-center gap-1">
            ⭐ Gold Tier
          </span>
        );
      case 'Silver':
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700/50 flex items-center gap-1">
            🥈 Silver Tier
          </span>
        );
    }
  };

  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Premium subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-55 pointer-events-none" />
      
      <FloatingBlobs />
      
      <div className="max-w-[1240px] mx-auto relative z-10">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-200/60 shadow-3xs">
            <Sparkles size={11} className="text-[#EAB308]" />
            <span className="text-[9.5px] font-black text-slate-800 tracking-wider uppercase">User Portal</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mt-3 leading-none">
            Your <span className="text-[#EAB308]">Profile</span>
          </h1>
          <p className="text-xs md:text-[13px] font-bold text-slate-400 mt-2.5 max-w-xl leading-relaxed">
            Manage your personal settings, view active entry passes, track wishlist bookmarks, and unlock loyalty rewards.
          </p>
        </motion.div>

        {/* 2-Column Responsive Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start"
        >
          
          {/* LEFT COLUMN: Profile Info Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-4 space-y-6"
          >
            {/* White & Yellow Profile Card */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden group">
              {/* Radial gradient reflections */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FFD400]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FFD400]/10 transition-all duration-500" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-550/5 rounded-full blur-3xl pointer-events-none group-hover:bg-yellow-550/10 transition-all duration-500" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                {/* Avatar with glowing ring */}
                <div className="relative w-[84px] h-[84px] mb-4 group/avatar flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#FFD400]/25 rounded-full blur-md opacity-35 group-hover/avatar:opacity-50 transition-opacity" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                    className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FFD400] via-[#FFF3B0] to-[#EAB308] opacity-75 group-hover/avatar:opacity-100 transition-opacity" 
                  />
                  <div className="w-full h-full rounded-full bg-[#FFD400] text-slate-950 font-black text-3xl flex items-center justify-center border-4 border-white relative z-10 shadow-sm transition-transform duration-300 group-hover/avatar:scale-102">
                    <span className="text-slate-950">
                      {session?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-extrabold text-lg tracking-tight text-slate-800 mb-1.5">
                  {session ? `${session.firstName} ${session.lastName}` : 'Guest User'}
                </h3>
                
                {/* Tier Badge */}
                <div className="mb-4">
                  {getTierBadge()}
                </div>

                {/* Email */}
                <p className="text-[11.5px] text-slate-400 font-bold mb-5 break-all max-w-[220px]">
                  {session?.email || 'loading...'}
                </p>

                {/* Edit Profile Action */}
                <Link 
                  href="/profile/settings" 
                  className="w-full bg-[#FFD400] hover:bg-[#E6BE00] text-slate-950 font-black text-xs py-3.5 px-6 rounded-xl transition-all border border-[#FFD400]/60 hover:border-[#E6BE00] flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Settings size={13} className="stroke-[2.5]" />
                  <span>Edit Profile Details</span>
                </Link>

                {/* Quick Stats Grid */}
                <div className="w-full grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100">
                  <div className="flex flex-col items-center">
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Bookings</span>
                    <span className="text-base font-black text-slate-800 mt-1">{bookings.length}</span>
                  </div>
                  <div className="flex flex-col items-center border-x border-slate-150/60">
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Tickets</span>
                    <span className="text-base font-black text-[#EAB308] mt-1">{activeTicketsCount}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-slate-400">Wishlist</span>
                    <span className="text-base font-black text-slate-800 mt-1">{wishlistCount}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-white hover:bg-slate-50 text-slate-705 hover:text-red-600 font-extrabold text-xs rounded-2xl border border-slate-200/80 hover:border-red-200 transition-all duration-200 flex items-center justify-center gap-1.5 shadow-3xs"
            >
              <LogOut size={13} />
              <span>Log Out Account</span>
            </button>

          </motion.div>

          {/* RIGHT COLUMN: Interactive Groups */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GROUP 1: Activity & Access */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 p-6 flex flex-col h-fit"
            >
              <div>
                <div className="flex items-center gap-2 px-1 pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="w-5.5 h-5.5 rounded-md bg-yellow-50 flex items-center justify-center border border-yellow-100/65">
                    <Compass size={11} className="text-[#EAB308]" />
                  </div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Activity & Access</span>
                </div>
                <div className="space-y-2">
                  <MenuItem 
                    title="Your Bookings & Purchases" 
                    subtitle="View order history & transaction receipts"
                    href="/profile/bookings"
                    icon={<ShoppingBag size={17} className="text-[#EAB308]" />}
                    iconBg="bg-yellow-50/50 border border-yellow-100/40"
                  />
                  <MenuItem 
                    title="Your Wishlist" 
                    subtitle="Saved events you like"
                    href="/wishlist"
                    icon={<Heart size={17} className="text-red-500 fill-red-500" />}
                    iconBg="bg-red-50/50 border border-red-100/40"
                    badge={wishlistCount > 0 ? (
                      <span className="px-1.5 py-0.5 text-[8.5px] font-black bg-red-50 border border-red-100 text-red-650 rounded-full">{wishlistCount}</span>
                    ) : null}
                  />
                  <MenuItem 
                    title="My Tickets" 
                    subtitle="Digital entry passes & active codes"
                    href="/tickets"
                    icon={<Ticket size={17} className="text-indigo-600" />}
                    iconBg="bg-indigo-50/50 border border-indigo-100/40"
                    badge={activeTicketsCount > 0 ? (
                      <span className="px-1.5 py-0.5 text-[8.5px] font-black bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-full">{activeTicketsCount}</span>
                    ) : null}
                  />
                  <MenuItem 
                    title="Payments" 
                    subtitle="Manage saved payment cards & wallets"
                    href="/profile/payments"
                    icon={<CreditCard size={17} className="text-emerald-600" />}
                    iconBg="bg-emerald-50/50 border border-emerald-100/40"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 2: Inbox & Offers */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 p-6 flex flex-col h-fit"
            >
              <div>
                <div className="flex items-center gap-2 px-1 pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="w-5.5 h-5.5 rounded-md bg-orange-50 flex items-center justify-center border border-orange-100/65">
                    <Mail size={11} className="text-orange-550" />
                  </div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Inbox & Offers</span>
                </div>
                <div className="space-y-2">
                  <MenuItem 
                    title="Notifications" 
                    subtitle="System messages, updates & alerts"
                    href="/profile/notifications"
                    icon={<Bell size={17} className="text-orange-500" />}
                    iconBg="bg-orange-50/50 border border-orange-100/40"
                  />
                  <MenuItem 
                    title="Rewards" 
                    subtitle="Check loyalty points & milestone badges"
                    href="/profile/rewards"
                    icon={<Sparkles size={17} className="text-[#EAB308] animate-pulse" />}
                    iconBg="bg-yellow-50/55 border border-yellow-100/40"
                  />
                  <MenuItem 
                    title="Offers" 
                    subtitle="Exclusive event discounts & coupons"
                    href="/profile/offers"
                    icon={<Tag size={17} className="text-teal-600" />}
                    iconBg="bg-teal-50/50 border border-teal-100/40"
                    badge={<span className="px-1.5 py-0.5 text-[7.5px] font-black uppercase bg-teal-50 border border-teal-150 text-teal-650 rounded-md">New</span>}
                  />
                  <MenuItem 
                    title="Gift Cards" 
                    subtitle="Redeem, purchase & manage gift vouchers"
                    href="/profile/giftcards"
                    icon={<Gift size={17} className="text-purple-600" />}
                    iconBg="bg-purple-50/50 border border-purple-100/40"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 3: Settings & Support */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 p-6 flex flex-col h-fit"
            >
              <div>
                <div className="flex items-center gap-2 px-1 pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="w-5.5 h-5.5 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100/65">
                    <Settings size={11} className="text-blue-550" />
                  </div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Settings & Support</span>
                </div>
                <div className="space-y-2">
                  <MenuItem 
                    title="Account & Settings" 
                    subtitle="Modify credentials & preferences"
                    href="/profile/settings"
                    icon={<Settings size={17} className="text-slate-500" />}
                    iconBg="bg-slate-50/50 border border-slate-100/40"
                  />
                  <MenuItem 
                    title="Help Centre" 
                    subtitle="FAQ documentation & booking support"
                    href="/profile/help"
                    icon={<HelpCircle size={17} className="text-blue-600" />}
                    iconBg="bg-blue-50/50 border border-blue-100/40"
                  />
                  <MenuItem 
                    title="Support Desk" 
                    subtitle="Contact 24/7 client resolution agents"
                    href="/profile/support"
                    icon={<LifeBuoy size={17} className="text-pink-600" />}
                    iconBg="bg-pink-50/50 border border-pink-100/40"
                  />
                  <MenuItem 
                    title="Privacy Policy" 
                    subtitle="Data security & storage guidelines"
                    href="/privacy"
                    icon={<Shield size={17} className="text-[#10B981]" />}
                    iconBg="bg-emerald-50/50 border border-emerald-100/40"
                  />
                </div>
              </div>
            </motion.div>

            {/* GROUP 4: App & Legal */}
            <motion.div 
              variants={itemVariants}
              className="bg-white border border-slate-200/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300 p-6 flex flex-col h-fit"
            >
              <div>
                <div className="flex items-center gap-2 px-1 pb-3.5 mb-3.5 border-b border-slate-100">
                  <div className="w-5.5 h-5.5 rounded-md bg-indigo-50 flex items-center justify-center border border-indigo-100/65">
                    <Info size={11} className="text-indigo-550" />
                  </div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">App & Legal</span>
                </div>
                <div className="space-y-2">
                  <MenuItem 
                    title="Share App" 
                    subtitle="Recommend EventBooking to friends"
                    href="/profile/share"
                    icon={<Share2 size={17} className="text-indigo-600" />}
                    iconBg="bg-indigo-50/50 border border-indigo-100/40"
                  />
                  <MenuItem 
                    title="Rate App" 
                    subtitle="Rate us & tell us your feedback"
                    href="/profile/rate"
                    icon={<Star size={17} className="text-yellow-500 fill-yellow-500" />}
                    iconBg="bg-yellow-50/50 border border-yellow-100/40"
                  />
                  <MenuItem 
                    title="About EventBooking" 
                    subtitle="Learn more about our events platform"
                    href="/about"
                    icon={<Info size={17} className="text-sky-600" />}
                    iconBg="bg-sky-50/50 border border-sky-100/40"
                  />
                  <MenuItem 
                    title="Terms & Conditions" 
                    subtitle="Platform usage guidelines & policies"
                    href="/terms"
                    icon={<FileText size={17} className="text-slate-500" />}
                    iconBg="bg-slate-50/50 border border-slate-100/40"
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
