'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../utils/api';
import { Heart, Loader, Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Event } from '../../types';

export default function WishlistPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getSession()) { router.push('/login'); return; }
    api.get('/wishlist').then(setEvents).catch(console.error).finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await api.delete(`/wishlist/${id}`);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">My <span className="text-[#FACC15]">Wishlist</span></h1>
      <p className="text-[#6B7280] mb-10">Events you've saved for later.</p>
      {events.length === 0 ? (
        <div className="premium-card p-16 text-center">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-[#6B7280]">No saved events yet.</p>
          <Link href="/events" className="btn-primary inline-block mt-6 py-3 px-8">Explore Events</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="premium-card overflow-hidden group">
              <Link href={`/events/${event.id}`}>
                <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600'} alt={event.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="p-6">
                <span className="badge-primary text-xs">{event.category}</span>
                <h3 className="font-black text-lg mt-2 mb-2">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-1"><Calendar size={14} />{new Date(event.startDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-4"><MapPin size={14} />{event.location}</div>
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#FACC15]">{event.price === 0 ? 'Free' : `₹${event.price}`}</span>
                  <button onClick={() => remove(event.id)} className="text-red-500 text-sm font-bold hover:underline">Remove</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
