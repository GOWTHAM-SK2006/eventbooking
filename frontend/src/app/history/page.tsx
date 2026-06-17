'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Calendar, MapPin, Tag, Users, CheckCircle, Ticket, XCircle, ArrowRight, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HistoryPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const session = getSession();

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await api.get('/bookings/my-bookings');
      setBookings(data.sort((a: any, b: any) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Cancel this booking? This action cannot be undone.')) return;
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      await loadBookings();
    } catch (e) {
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="spin text-[#FF6B00]" /></div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8C42]">Tickets.</span></h1>
        <p className="text-[#A0A0A0] text-lg font-medium">Access your event passes and booking history.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed border-2 border-[#1E1E1E]">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket size={32} className="text-[#555]" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No tickets yet</h3>
          <p className="text-[#A0A0A0] font-medium mb-8">You haven't booked any events. Discover what's happening!</p>
          <Link href="/events" className="btn-primary inline-flex">Explore Events</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card border border-[#1E1E1E] overflow-hidden flex flex-col md:flex-row relative group">
              
              <div className="bg-[#121212] p-8 md:w-2/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1E1E1E] relative">
                {booking.status === 'CANCELLED' && (
                  <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <span className="border-4 border-red-500 text-red-500 font-black text-4xl uppercase tracking-widest px-8 py-2 rotate-[-15deg] opacity-80">Cancelled</span>
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${booking.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[#A0A0A0] text-sm font-medium">Booked {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 line-clamp-2">{booking.eventTitle}</h3>
                  <div className="space-y-2 text-[#A0A0A0] font-medium">
                    <p className="flex items-center gap-2"><Calendar size={16} className="text-[#FF6B00]" /> {new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} at {new Date(booking.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="flex items-center gap-2"><Tag size={16} className="text-[#FF6B00]" /> Order #{booking.id.substring(0,8).toUpperCase()}</p>
                  </div>
                </div>

                {booking.status === 'CONFIRMED' && (
                  <div className="mt-8 pt-6 border-t border-[#1E1E1E] flex justify-between items-center">
                    <Link href={`/events/${booking.eventId}`} className="text-[#FF6B00] font-bold flex items-center gap-1 hover:text-white transition-colors">View Event Details <ArrowRight size={16} /></Link>
                    <button onClick={() => handleCancel(booking.id)} className="text-[#A0A0A0] hover:text-red-500 text-sm font-bold transition-colors">Cancel Ticket</button>
                  </div>
                )}
              </div>

              <div className="bg-[#0A0A0A] p-8 md:w-1/3 flex flex-col items-center justify-center relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050505] rounded-full hidden md:block border-r border-[#1E1E1E]" />
                
                <h4 className="text-[#A0A0A0] text-sm font-bold uppercase tracking-widest mb-6">Access Passes</h4>
                <div className="w-full space-y-4">
                  {booking.ticketCodes?.map((code: string, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 flex flex-col items-center group-hover:border-[#FF6B00]/50 transition-colors">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${code}`} alt="QR" className="w-24 h-24 mb-3 rounded-lg bg-white p-2" />
                      <span className="font-mono font-bold text-white tracking-widest">{code}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-3xl font-black text-[#FF6B00]">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                  <p className="text-[#A0A0A0] text-sm font-medium">{booking.quantity} Pass{booking.quantity > 1 ? 'es' : ''}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
