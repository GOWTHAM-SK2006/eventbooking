'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../../utils/api';
import { 
  ArrowLeft, Gift, Award, Star, Copy, Check, 
  HelpCircle, Calendar, Sparkles, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function RewardsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Constants
  const rewardPoints = 750;
  const referralCode = 'EVBOOK-7729';

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
      const data = await api.get('/bookings').catch(() => []);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings for rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMembershipInfo = () => {
    const bookingCount = bookings.filter(b => b.status === 'CONFIRMED' || !b.status).length;
    if (bookingCount >= 5) {
      return { 
        level: 'Premium', 
        nextLevel: 'Elite (Top Tier)',
        bookingsToNext: 0,
        progress: 100, 
        badgeColor: 'bg-yellow-50 border-yellow-300 text-yellow-700',
        cardBg: 'from-amber-600 to-yellow-500'
      };
    }
    if (bookingCount >= 2) {
      return { 
        level: 'Gold', 
        nextLevel: 'Premium Tier',
        bookingsToNext: 5 - bookingCount,
        progress: (bookingCount / 5) * 100, 
        badgeColor: 'bg-amber-50 border-amber-300 text-amber-700',
        cardBg: 'from-yellow-500 to-yellow-600'
      };
    }
    return { 
      level: 'Silver', 
      nextLevel: 'Gold Tier',
      bookingsToNext: 2 - bookingCount,
      progress: (bookingCount / 2) * 100, 
      badgeColor: 'bg-slate-50 border-slate-200 text-slate-700',
      cardBg: 'from-slate-700 to-slate-800'
    };
  };

  const member = getMembershipInfo();

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
                <span>Loyalty &</span>
                <span className="text-[#EAB308]">Rewards</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Redeem promo coupons, track reward history and membership status</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Loyalty tier & progress bar */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Membership luxury card */}
            <div className={`bg-gradient-to-br ${member.cardBg} text-white p-6 rounded-[20px] shadow-lg relative overflow-hidden aspect-[1.6/1]`}>
              <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 rounded-full bg-white/10 blur-xl" />
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded bg-white/20 text-[8px] font-black uppercase tracking-widest border border-white/10 shadow-3xs">
                    {member.level} Tier
                  </span>
                  <h4 className="text-2xl font-black mt-2.5 tracking-tight flex items-center gap-1.5">
                    <span>{rewardPoints}</span>
                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Points</span>
                  </h4>
                </div>
                <Award size={32} className="text-white/20" />
              </div>

              <div className="mt-8">
                <p className="text-[8px] font-black text-white/60 uppercase tracking-widest">Cardholder ID</p>
                <p className="text-xs font-mono font-black mt-1 uppercase tracking-wider">{session ? `EV-${session.firstName.slice(0,3)}-${session.id.slice(0, 4)}` : 'EV-USR-9827'}</p>
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-1">
                <Sparkles size={13} className="text-yellow-300 animate-pulse fill-yellow-300" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/90">Club Privé</span>
              </div>
            </div>

            {/* Interactive Tier Progress Bar */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Tier Advancements</h3>
              
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-gray-800">{member.level}</span>
                  <span className="text-gray-400">{member.nextLevel}</span>
                </div>
                
                {/* Custom animated progress tracker */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 shadow-3xs">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${member.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#FFD400] to-[#EAB308]"
                  />
                </div>

                {member.bookingsToNext > 0 ? (
                  <p className="text-[10px] text-gray-400 font-semibold mt-3 leading-relaxed">
                    Reserve <strong className="text-gray-900">{member.bookingsToNext}</strong> more confirmed booking{member.bookingsToNext > 1 ? 's' : ''} to step up to the next tier level.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 font-semibold mt-3 leading-relaxed">
                    You have achieved our highest membership level! Enjoy premium reservation rates and concierge support.
                  </p>
                )}
              </div>
            </div>

            {/* Referral Voucher panel */}
            <div className="bg-white/80 border border-dashed border-gray-300 rounded-3xl p-6 shadow-xs backdrop-blur-md text-center flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Refer & Earn Program</span>
                <h4 className="text-sm font-black text-gray-900 mt-2">Get 200 Points per Referral</h4>
                <p className="text-[10px] text-gray-500 font-semibold mt-1 leading-relaxed">Refer friends to the platform. They save ₹100 on their first ticket, and you score 200 reward points!</p>
                <p className="text-base font-mono font-black text-gray-900 mt-4 select-all tracking-wider">{referralCode}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className={`mt-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                  copied ? 'bg-green-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy referral link'}</span>
              </button>
            </div>

          </div>

          {/* RIGHT SIDE: Coupon vouchers & history */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Active Coupons (Tear-off design) */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md space-y-5">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Gift className="text-[#EAB308]" size={16} />
                <span>Available Coupons</span>
              </h2>

              <div className="space-y-4">
                {/* Coupon 1 */}
                <div className="relative bg-white border border-gray-200 p-5 rounded-2xl flex justify-between items-center shadow-3xs overflow-hidden">
                  <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                  <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                  
                  <div className="pl-4">
                    <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-250 text-[#FFD400] text-[8px] font-black uppercase tracking-widest rounded-md">WELCOME100</span>
                    <h4 className="font-extrabold text-xs text-gray-900 mt-2">Flat ₹100 First Order Discount</h4>
                    <p className="text-[9px] text-gray-400 mt-1 font-semibold">Valid on your first concert or conference registration.</p>
                  </div>
                  <span className="text-[9px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mr-3 uppercase shrink-0">Active</span>
                </div>

                {/* Coupon 2 */}
                <div className="relative bg-white border border-gray-200 p-5 rounded-2xl flex justify-between items-center shadow-3xs overflow-hidden">
                  <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                  <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 border border-gray-200" />
                  
                  <div className="pl-4">
                    <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-250 text-[#FFD400] text-[8px] font-black uppercase tracking-widest rounded-md">LOYAL50</span>
                    <h4 className="font-extrabold text-xs text-gray-900 mt-2">Flat ₹50 Loyalty Discount</h4>
                    <p className="text-[9px] text-gray-400 mt-1 font-semibold">Valid on any purchase of value ₹300 or above.</p>
                  </div>
                  <span className="text-[9px] font-black text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded mr-3 uppercase shrink-0">Active</span>
                </div>
              </div>
            </div>

            {/* Expired Coupons */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} />
                <span>Expired / Redeemed Coupons</span>
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-150/40 last:border-b-0 pl-1 opacity-50">
                  <div>
                    <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 text-[8px] font-bold rounded">WINTER24</span>
                    <p className="text-[9px] text-gray-400 font-semibold mt-1">₹100 winter festival season pass reduction.</p>
                  </div>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider">Expired Jan 2026</span>
                </div>
              </div>
            </div>

            {/* Reward History */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md space-y-5">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Star className="text-[#EAB308]" size={16} />
                <span>Reward Points History</span>
              </h2>

              <div className="space-y-3">
                {[
                  { desc: 'Sign Up onboarding bonus reward', date: 'June 10, 2026', pts: '+500 pts', color: 'text-green-600' },
                  { desc: 'Referral account creation invite link', date: 'June 20, 2026', pts: '+200 pts', color: 'text-green-600' },
                  { desc: 'Platform booking event reward', date: 'July 02, 2026', pts: '+50 pts', color: 'text-green-600' }
                ].map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-b-0 pl-1">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">{log.desc}</h4>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">{log.date}</p>
                    </div>
                    <span className={`font-black text-xs ${log.color}`}>{log.pts}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
