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

interface MenuItemProps {
  title: string;
  href?: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}

const MenuItem = ({ title, href, icon, iconBg, onClick }: MenuItemProps) => {
  const content = (
    <div className="w-full h-[64px] flex items-center justify-between px-5 hover:bg-gray-50/50 active:bg-gray-100/70 transition-all duration-200 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center shadow-3xs shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <span className="text-[13px] font-extrabold text-gray-800 tracking-wide">{title}</span>
      </div>
      <ChevronRight size={15} className="text-gray-400 mr-1" />
    </div>
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

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
    api.get('/bookings').then(setBookings).catch(() => []);
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F8FA] py-8 md:py-16 px-4">
      {/* Maximum 560px centered container to mimic native mobile app format */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-[560px] mx-auto space-y-5"
      >
        
        {/* ===================================
            TOP PROFILE CARD
            =================================== */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-gray-200/50 rounded-[24px] p-5 shadow-3xs flex items-center gap-4.5"
        >
          {/* Circular Photo */}
          <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-tr from-[#FFD400] to-[#FFF3B0] text-gray-900 font-black text-2xl flex items-center justify-center border-2 border-white shadow-sm shrink-0">
            {session?.firstName?.charAt(0) || 'U'}
          </div>

          {/* Info Details */}
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[15px] text-gray-900 leading-tight">
                {session ? `Hi, ${session.firstName}!` : 'Hi!'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-yellow-50 border border-yellow-200 text-[#CA8A04] shadow-3xs shrink-0">
                {memberLevel} Tier
              </span>
            </div>
            <p className="text-xs text-gray-400 font-semibold truncate">{session?.email || 'loading...'}</p>
            
            <Link 
              href="/profile/settings" 
              className="text-xs text-[#EAB308] hover:text-[#CA8A04] font-black inline-flex items-center gap-1 pt-1 transition-colors"
            >
              <span>Edit Profile</span>
              <span className="text-[9px]">➔</span>
            </Link>
          </div>
        </motion.div>

        {/* ===================================
            GROUP 1
            =================================== */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-gray-200/50 rounded-[22px] overflow-hidden shadow-3xs"
        >
          <MenuItem 
            title="Your Bookings & Purchases" 
            href="/profile/bookings"
            icon={<ShoppingBag size={18} className="text-[#EAB308]" />}
            iconBg="bg-yellow-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Your Wishlist" 
            href="/wishlist"
            icon={<Heart size={18} className="text-red-500 fill-red-500" />}
            iconBg="bg-red-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="My Tickets" 
            href="/tickets"
            icon={<Ticket size={18} className="text-[#EAB308]" />}
            iconBg="bg-yellow-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Payments" 
            href="/profile/payments"
            icon={<CreditCard size={18} className="text-blue-500" />}
            iconBg="bg-blue-50"
          />
        </motion.div>

        {/* ===================================
            GROUP 2
            =================================== */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-gray-200/50 rounded-[22px] overflow-hidden shadow-3xs"
        >
          <MenuItem 
            title="Notifications" 
            href="/profile/notifications"
            icon={<Bell size={18} className="text-orange-500" />}
            iconBg="bg-orange-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Rewards" 
            href="/profile/rewards"
            icon={<Gift size={18} className="text-emerald-500" />}
            iconBg="bg-emerald-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Offers" 
            href="/profile/offers"
            icon={<Tag size={18} className="text-[#EAB308]" />}
            iconBg="bg-yellow-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Gift Cards" 
            href="/profile/giftcards"
            icon={<Gift size={18} className="text-indigo-500" />}
            iconBg="bg-indigo-50"
          />
        </motion.div>

        {/* ===================================
            GROUP 3
            =================================== */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-gray-200/50 rounded-[22px] overflow-hidden shadow-3xs"
        >
          <MenuItem 
            title="Help Centre" 
            href="/profile/help"
            icon={<HelpCircle size={18} className="text-[#EAB308]" />}
            iconBg="bg-yellow-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Support" 
            href="/profile/support"
            icon={<LifeBuoy size={18} className="text-purple-500" />}
            iconBg="bg-purple-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Account & Settings" 
            href="/profile/settings"
            icon={<Settings size={18} className="text-slate-500" />}
            iconBg="bg-slate-50"
          />
        </motion.div>

        {/* ===================================
            GROUP 4
            =================================== */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-gray-200/50 rounded-[22px] overflow-hidden shadow-3xs"
        >
          <MenuItem 
            title="Share App" 
            href="/profile/share"
            icon={<Share2 size={18} className="text-indigo-500" />}
            iconBg="bg-indigo-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Rate App" 
            href="/profile/rate"
            icon={<Star size={18} className="text-yellow-500 fill-yellow-500" />}
            iconBg="bg-yellow-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Terms & Conditions" 
            href="/terms"
            icon={<FileText size={18} className="text-slate-500" />}
            iconBg="bg-slate-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Privacy Policy" 
            href="/privacy"
            icon={<Shield size={18} className="text-emerald-500" />}
            iconBg="bg-emerald-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="About EventBooking" 
            href="/about"
            icon={<Info size={18} className="text-blue-500" />}
            iconBg="bg-blue-50"
          />
          <div className="border-t border-gray-100" />
          <MenuItem 
            title="Logout" 
            onClick={handleLogout}
            icon={<LogOut size={18} className="text-red-500" />}
            iconBg="bg-red-50"
          />
        </motion.div>

      </motion.div>
    </div>
  );
}
