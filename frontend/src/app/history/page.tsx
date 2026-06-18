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

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="animate-spin text-[#FACC15]" /></div>;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#111827]">My <span className="text-[#FACC15]">Tickets</span></h1>
        <p className="text-[#6B7280] text-lg font-medium">Access your event passes and booking history.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket size={32} className="text-[#9CA3AF]" />
          </div>
          <h3 className="text-2xl font-bold text-[#111827] mb-2">No tickets yet</h3>
          <p className="text-[#6B7280] font-medium mb-8">You haven't booked any events. Discover what's happening!</p>
          <Link href="/events" className="inline-flex bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg">Explore Events</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {bookings.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row relative group shadow-sm hover:shadow-md transition-shadow">
              
              <div className="bg-gray-50 p-8 md:w-2/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200 relative">
                {booking.status === 'CANCELLED' && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                    <span className="border-4 border-red-600 text-red-600 font-black text-4xl uppercase tracking-widest px-8 py-2 rotate-[-15deg] opacity-90">Cancelled</span>
                  </div>
                )}
                
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[#6B7280] text-sm font-medium">Booked {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-3xl font-black text-[#111827] mb-4 line-clamp-2">{booking.eventTitle}</h3>
                  <div className="space-y-2 text-[#6B7280] font-medium">
                    <p className="flex items-center gap-2"><Calendar size={16} className="text-[#FACC15]" /> {new Date(booking.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })} at {new Date(booking.eventDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    <p className="flex items-center gap-2"><Tag size={16} className="text-[#FACC15]" /> Order #{booking.id.substring(0,8).toUpperCase()}</p>
                  </div>
                </div>

                {booking.status === 'CONFIRMED' && (
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                    <Link href={`/events/${booking.eventId}`} className="text-[#FACC15] font-bold flex items-center gap-1 hover:text-[#EAB308] transition-colors">View Event Details <ArrowRight size={16} /></Link>
                    <button onClick={() => handleCancel(booking.id)} className="text-[#6B7280] hover:text-red-600 text-sm font-bold transition-colors">Cancel Ticket</button>
                  </div>
                )}
              </div>

              <div className="bg-white p-8 md:w-1/3 flex flex-col items-center justify-center relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full hidden md:block border-r border-gray-200" />
                
                <h4 className="text-[#6B7280] text-sm font-bold uppercase tracking-widest mb-6">Access Passes</h4>
                <div className="w-full space-y-4">
                  {booking.ticketCodes?.map((code: string, idx: number) => (
                    <div key={idx} className="bg-gray-50 border border-gray-300 rounded-xl p-4 flex flex-col items-center group-hover:border-[#FACC15] transition-colors">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${code}`} alt="QR" className="w-24 h-24 mb-3 rounded-lg bg-white p-2 border border-gray-200" />
                      <span className="font-mono font-bold text-[#111827] tracking-widest text-sm">{code}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <p className="text-3xl font-black text-[#FACC15]">₹{booking.totalPrice.toLocaleString('en-IN')}</p>
                  <p className="text-[#6B7280] text-sm font-medium">{booking.quantity} Pass{booking.quantity > 1 ? 'es' : ''}</p>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
