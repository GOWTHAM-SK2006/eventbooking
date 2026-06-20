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
    <div className="w-full max-w-4xl mx-auto px-6 py-12 md:py-24 min-h-screen relative">
      <FloatingBlobs />

      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
        >
          <Ticket size={12} className="text-[#EAB308]" />
          <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">Gate Passes & QR</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 tracking-tight text-[#111827]"
        >
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Tickets</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-[#6B7280] text-base sm:text-lg max-w-xl font-medium leading-relaxed"
        >
          Access your digital entry passes, view QR validation codes, or request reservation cancellations.
        </motion.p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-2xl mb-8 overflow-x-auto hide-scrollbar max-w-md shadow-xs">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => router.push(`/tickets?tab=${t.id}`)}
            className={`flex-1 px-5 py-3 rounded-xl font-extrabold text-xs transition-all whitespace-nowrap ${tab === t.id ? 'bg-yellow-400 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(n => (
            <div key={n} className="h-44 bg-white border border-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-12 md:p-16 text-center rounded-3xl border border-gray-200 shadow-md max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
            <Ticket size={36} className="text-[#EAB308]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 font-sans">No Tickets Found</h2>
          <p className="text-gray-500 font-medium mb-8">You don't have any bookings matching this criteria currently.</p>
          <Link href="/events" className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs transition-all active:scale-95 shadow-md">
            Explore Events
          </Link>
        </motion.div>
      ) : (
        /* Bookings List */
        <div className="space-y-6">
          {filtered.map((booking, i) => (
            <motion.div 
              key={booking.id} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">Order ID: #{booking.id.slice(0, 8)}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{booking.eventTitle}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#EAB308]" />
                        {new Date(booking.eventDate).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs font-bold text-gray-400">
                    <span>Passes: <strong className="text-gray-900 font-extrabold">{booking.quantity}x</strong></span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    <span>Total Paid: <strong className="text-[#EAB308] font-black text-sm">₹{booking.totalPrice.toLocaleString('en-IN')}</strong></span>
                  </div>
                </div>

                {/* Booking actions */}
                <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5 self-stretch md:self-center justify-end">
                  {booking.ticketCodes && booking.ticketCodes.length > 0 ? (
                    <div className="flex flex-wrap gap-2 justify-end">
                      {booking.ticketCodes.map((code) => (
                        <button 
                          key={code} 
                          onClick={() => setSelectedTicket(code)}
                          className="bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-400 text-gray-900 font-extrabold px-4.5 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          <QrCode size={14} className="text-gray-500" />
                          <span>QR Pass ({code.slice(-6)})</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-1.5">
                      <AlertTriangle size={14} /> Pending Ticket Code
                    </div>
                  )}

                  {booking.status === 'CONFIRMED' && new Date(booking.eventDate) > now && (
                    <button 
                      onClick={() => cancelBooking(booking.id)} 
                      disabled={cancelling === booking.id}
                      className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 font-bold px-4 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 justify-center active:scale-95"
                    >
                      <XCircle size={14} />
                      <span>{cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}</span>
                    </button>
                  )}
                </div>
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
