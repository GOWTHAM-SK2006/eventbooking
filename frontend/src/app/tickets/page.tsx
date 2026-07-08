'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../utils/api';
import { Download, Loader, Ticket, Calendar, XCircle, QrCode, Sparkles, MapPin, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketModal from '../../components/TicketModal';
import { FloatingBlobs } from '../../components/AnimatedBackground';
import type { Booking } from '../../types';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'active';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) { 
      router.push('/login'); 
      return; 
    }
    setSession(sess);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    setCancelling(id);
    try {
      await api.post(`/bookings/${id}/cancel`);
      await fetchBookings();
    } catch (e: any) { 
      alert(e.message || 'Cancellation failed'); 
    } finally { 
      setCancelling(null); 
    }
  };

  const now = new Date();
  const filtered = bookings.filter(b => {
    const eventDate = new Date(b.eventDate);
    if (tab === 'active' || tab === 'upcoming') return b.status === 'CONFIRMED' && eventDate >= now;
    if (tab === 'past') return b.status === 'CONFIRMED' && eventDate < now;
    if (tab === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  const tabs = [
    { id: 'active', label: 'Active Tickets' },
    { id: 'past', label: 'Past Events' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 pt-6 md:pt-12 pb-16 md:pb-24 min-h-screen relative">
      <FloatingBlobs />

      {/* Header */}
      <div className="mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200/80 mb-4"
        >
          <Ticket size={13} className="text-[#EAB308]" />
          <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">Gate Passes & QR</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-[36px] sm:text-[48px] md:text-[60px] font-black mb-6 tracking-tight text-[#111827] leading-none flex flex-wrap items-baseline gap-x-2 gap-y-1"
        >
          <span>My</span>
          <span className="text-[32px] sm:text-[42px] md:text-[52px] text-[#EAB308]">Tickets</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-[#6B7280] text-base sm:text-lg max-w-2xl font-medium leading-relaxed"
        >
          Access your digital entry passes, view QR validation codes, or request reservation cancellations.
        </motion.p>
      </div>

      {/* Navigation Tabs */}
      <div className="relative flex gap-2 p-1.5 bg-white border border-gray-200 rounded-full mb-10 md:mb-12 overflow-x-auto hide-scrollbar max-w-lg shadow-sm">
        {tabs.map(t => {
          const isActive = tab === t.id;
          return (
            <button 
              key={t.id} 
              onClick={() => router.push(`/tickets?tab=${t.id}`)}
              className="relative flex-1 px-6 py-3.5 rounded-full font-black text-xs sm:text-sm transition-all whitespace-nowrap outline-none focus:outline-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-yellow-400 rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-gray-950' : 'text-gray-500 hover:text-gray-900'}`}>
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-64 bg-white border border-gray-150 rounded-[24px] animate-pulse flex flex-col justify-between p-6 md:p-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-gray-100 rounded-full" />
                  <div className="h-4 w-16 bg-gray-100 rounded" />
                </div>
                <div className="h-8 w-3/4 bg-gray-100 rounded-xl" />
                <div className="h-5 w-1/2 bg-gray-100 rounded" />
              </div>
              <div className="h-12 w-full bg-gray-50 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <div className="flex items-center justify-center py-6 md:py-12 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-12 md:p-20 text-center rounded-[32px] border border-gray-150 shadow-[0_20px_50px_rgba(0,0,0,0.04)] max-w-3xl w-full flex flex-col items-center justify-center min-h-[450px]"
          >
            <div className="relative mb-8">
              {/* Soft decorative glow background */}
              <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full scale-125" />
              <div className="relative w-24 h-24 bg-yellow-50 border border-yellow-100 rounded-3xl flex items-center justify-center shadow-inner">
                <Ticket size={44} className="text-[#EAB308] stroke-[1.5]" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">No Tickets Found</h2>
            <p className="text-gray-500 font-medium max-w-md text-base leading-relaxed mb-10">
              You don't have any bookings matching this criteria currently. Explore our curated experiences to secure your entry pass.
            </p>
            <Link href="/events" className="group relative overflow-hidden bg-gray-900 hover:bg-gray-800 text-white font-extrabold py-4 px-10 rounded-2xl text-sm transition-all active:scale-98 shadow-lg hover:shadow-xl hover:shadow-gray-900/10 flex items-center gap-2">
              <span>Explore Events</span>
              <Sparkles size={16} className="text-yellow-400 group-hover:animate-pulse" />
            </Link>
          </motion.div>
        </div>
      ) : (
        /* Bookings List */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {filtered.map((booking, i) => (
            <motion.div 
              key={booking.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="bg-white border border-gray-200 rounded-[24px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              {/* Ticket Top Part: Event Info */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400">ID: #{booking.id.slice(0, 8)}</span>
                  </div>
                  
                  {/* Decorative Ticket Circle Cutouts on Left and Right (Desktop/Tablet) */}
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-400 tracking-wider uppercase">Entry Pass</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2 hover:text-[#EAB308] transition-colors">{booking.eventTitle}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-semibold text-gray-500">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      <Calendar size={14} className="text-[#EAB308]" />
                      {new Date(booking.eventDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-dashed border-gray-150 mt-4 pt-4">
                  <div className="text-xs font-semibold text-gray-400 flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider">Passes</span>
                    <span className="text-gray-900 font-black text-base">{booking.quantity}x</span>
                  </div>
                  <div className="text-xs font-semibold text-gray-400 flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-wider">Total Paid</span>
                    <span className="text-[#EAB308] font-black text-base">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Decorative side cuts for ticket stub feel */}
              <div className="relative flex items-center px-6 my-1">
                <div className="absolute left-0 -ml-3 w-6 h-6 rounded-full bg-white border-r border-gray-200 z-10" />
                <div className="w-full border-t-2 border-dashed border-gray-200" />
                <div className="absolute right-0 -mr-3 w-6 h-6 rounded-full bg-white border-l border-gray-200 z-10" />
              </div>

              {/* Ticket Bottom Part: Action buttons */}
              <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="w-full sm:w-auto flex flex-wrap gap-2">
                  {booking.ticketCodes && booking.ticketCodes.length > 0 ? (
                    booking.ticketCodes.map((code) => (
                      <button 
                        key={code} 
                        onClick={() => setSelectedTicket(code)}
                        className="w-full sm:w-auto bg-white hover:bg-yellow-400 hover:text-gray-950 border border-gray-200 hover:border-yellow-400 text-gray-900 font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-sm hover:shadow"
                      >
                        <QrCode size={14} className="text-gray-500" />
                        <span>QR Pass ({code.slice(-6)})</span>
                      </button>
                    ))
                  ) : (
                    <div className="text-xs font-semibold text-gray-400 bg-white border border-gray-250 p-2.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                      <AlertTriangle size={14} className="text-yellow-500" /> Pending Ticket
                    </div>
                  )}
                </div>

                {booking.status === 'CONFIRMED' && new Date(booking.eventDate) > now && (
                  <button 
                    onClick={() => cancelBooking(booking.id)} 
                    disabled={cancelling === booking.id}
                    className="w-full sm:w-auto bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 flex items-center gap-1.5 justify-center active:scale-95 shadow-sm"
                  >
                    <XCircle size={14} />
                    <span>{cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedTicket && <TicketModal ticketCode={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}
