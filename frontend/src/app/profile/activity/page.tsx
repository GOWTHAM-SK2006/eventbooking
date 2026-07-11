'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../../utils/api';
import { 
  ArrowLeft, Search, Calendar, Filter, Download, 
  Clock, Heart, Ticket, XCircle, CheckCircle2, History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketModal from '../../../components/TicketModal';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function ActivityPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [bookings, setBookings] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [selectedTicketCode, setSelectedTicketCode] = useState<string | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [dateFilter, setDateFilter] = useState('');

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
      console.error('Error fetching activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    return bookings.filter(b => {
      const matchesSearch = b.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isConfirmed = b.status === 'CONFIRMED' || !b.status; // Default to confirmed if status absent
      const isCancelled = b.status === 'CANCELLED';
      const matchesStatus = 
        selectedStatus === 'ALL' ||
        (selectedStatus === 'CONFIRMED' && isConfirmed) ||
        (selectedStatus === 'CANCELLED' && isCancelled);

      const matchesDate = !dateFilter || b.eventDate.startsWith(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filtered = getFilteredBookings();
  const upcoming = bookings.filter(b => new Date(b.eventDate) >= new Date() && b.status !== 'CANCELLED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

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
                <span>My</span>
                <span className="text-[#EAB308]">Activity</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Track your event bookings, order timelines, and downloads</p>
            </div>
            
            {/* Quick Summary Pill */}
            <div className="flex gap-2">
              <span className="text-[10px] font-black text-[#EAB308] bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                {bookings.length} Orders
              </span>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl uppercase tracking-wider">
                {upcoming.length} Upcoming
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white/80 border border-gray-200/60 rounded-2xl p-5 mb-8 shadow-3xs backdrop-blur-md grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
              type="text"
              placeholder="Search by event title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-800 transition-all outline-none"
            />
          </div>

          {/* Status Dropdown */}
          <div className="sm:col-span-3 relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#FFD400] rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-700 outline-none cursor-pointer appearance-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="sm:col-span-4 relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input 
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#FFD400] rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Timeline (Main Activity Feed) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="text-[#EAB308]" size={18} />
                <span>Booking Timeline</span>
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <History size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-400 font-bold">No activity records found matching filters.</p>
                </div>
              ) : (
                /* Timeline structure */
                <div className="relative border-l border-gray-150 pl-6 ml-3 space-y-8 py-2">
                  {filtered.map((b, idx) => {
                    const isCancelled = b.status === 'CANCELLED';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={b.id} 
                        className="relative group"
                      >
                        {/* Timeline Node Badge */}
                        <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-3xs ${
                          isCancelled ? 'bg-red-500' : 'bg-[#EAB308]'
                        }`} />

                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs hover:border-[#FFD400]/40 hover:shadow-2xs transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-wider">
                                Order #{b.id.slice(0, 8)}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                isCancelled ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                {isCancelled ? 'Cancelled' : 'Confirmed'}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm text-gray-900 mt-2 leading-tight">{b.eventTitle}</h4>
                            <p className="text-[10px] text-gray-400 font-bold mt-1.5 flex items-center gap-1">
                              <Calendar size={11} />
                              <span>Event Date: {new Date(b.eventDate).toLocaleDateString()}</span>
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-end gap-3 sm:gap-1.5 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-50">
                            <span className="font-black text-gray-900 text-sm">₹{b.totalPrice}</span>
                            
                            {!isCancelled && b.ticketCodes?.length > 0 && (
                              <button 
                                onClick={() => setSelectedTicketCode(b.ticketCodes[0])}
                                className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-[#FFD400] font-black px-2.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                              >
                                <Download size={11} /> Pass
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Wishlist & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Wishlist Box */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="text-red-500 fill-red-500" size={16} />
                <span>Recent Wishlist</span>
              </h2>

              {wishlist.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold italic pl-1 py-4">No saved wishlist items.</p>
              ) : (
                <div className="space-y-2.5">
                  {wishlist.slice(0, 4).map(w => (
                    <div key={w.id} className="bg-white border border-[#E5E7EB] p-3 rounded-xl flex items-center justify-between shadow-3xs">
                      <span className="font-extrabold text-xs text-gray-900 truncate pr-2">{w.title}</span>
                      <button 
                        onClick={() => router.push(`/events/${w.id}`)}
                        className="btn-primary py-1 px-3 text-[9px] uppercase tracking-wider rounded-lg shrink-0"
                      >
                        View
                      </button>
                    </div>
                  ))}
                  {wishlist.length > 4 && (
                    <Link 
                      href="/wishlist" 
                      className="text-[10px] font-black text-[#EAB308] hover:underline block text-center mt-3 uppercase tracking-wider"
                    >
                      See All Wishlist ({wishlist.length})
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Cancelled Bookings Box */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="text-red-500" size={16} />
                <span>Cancelled Orders</span>
              </h2>

              {cancelled.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold italic pl-1 py-4">No cancelled event bookings.</p>
              ) : (
                <div className="space-y-2">
                  {cancelled.map(c => (
                    <div key={c.id} className="py-2 border-b border-gray-50 last:border-b-0">
                      <h4 className="font-bold text-xs text-gray-800 truncate">{c.eventTitle}</h4>
                      <p className="text-[9px] text-gray-400 font-medium mt-0.5">Order price: ₹{c.totalPrice}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Ticket Modal for ticket pass visualization */}
      {selectedTicketCode && (
        <TicketModal ticketCode={selectedTicketCode} onClose={() => setSelectedTicketCode(null)} />
      )}
    </div>
  );
}
