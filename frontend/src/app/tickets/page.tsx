'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Download, Loader, Ticket, Calendar, XCircle, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import TicketModal from '../../components/TicketModal';
import type { Booking } from '../../types';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'active';
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (!getSession()) { router.push('/login'); return; }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      await api.post(`/bookings/${id}/cancel`);
      await fetchBookings();
    } catch (e: any) { alert(e.message); }
    finally { setCancelling(null); }
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
    { id: 'active', label: 'Active' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">My <span className="text-[#FACC15]">Tickets</span></h1>
      <p className="text-[#6B7280] mb-8">View, download, and manage your event tickets.</p>

      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => router.push(`/tickets?tab=${t.id}`)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${tab === t.id ? 'bg-[#FACC15] text-[#111827]' : 'bg-white border border-gray-300 text-[#6B7280]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="premium-card p-16 text-center">
          <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-[#6B7280]">No tickets in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="premium-card p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <span className={`badge-${booking.status === 'CONFIRMED' ? 'success' : 'warning'} text-xs`}>{booking.status}</span>
                  <h3 className="text-xl font-black mt-2 mb-2">{booking.eventTitle}</h3>
                  <p className="text-sm text-[#6B7280] flex items-center gap-2"><Calendar size={14} />{new Date(booking.eventDate).toLocaleString()}</p>
                  <p className="text-sm text-[#6B7280] mt-1">{booking.quantity} ticket(s) · ₹{booking.totalPrice}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {booking.ticketCodes?.map(code => (
                    <button key={code} onClick={() => setSelectedTicket(code)}
                      className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
                      <QrCode size={16} /> {code}
                    </button>
                  ))}
                  {booking.status === 'CONFIRMED' && new Date(booking.eventDate) > now && (
                    <button onClick={() => cancelBooking(booking.id)} disabled={cancelling === booking.id}
                      className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
                      <XCircle size={14} /> {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
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
    <Suspense fallback={<div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>}>
      <HistoryContent />
    </Suspense>
  );
}
