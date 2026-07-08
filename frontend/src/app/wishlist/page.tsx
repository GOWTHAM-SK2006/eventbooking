'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, resolveImageUrl } from '../../utils/api';
import { Heart, Loader, Calendar, MapPin, Sparkles, Trash2, ArrowRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';
import type { Event } from '../../types';

export default function WishlistPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) { 
      router.push('/login'); 
      return; 
    }
    setSession(sess);
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await api.get('/wishlist');
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.delete(`/wishlist/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative">
      <FloatingBlobs />

      {/* Header */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
        >
          <Heart size={12} className="text-[#EAB308] fill-[#EAB308]" />
          <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">Saved Collections</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-[36px] sm:text-[48px] md:text-[60px] font-black mb-4 tracking-tight text-[#111827] leading-none flex flex-wrap items-baseline gap-x-2 gap-y-1"
        >
          <span>My</span>
          <span className="text-[32px] sm:text-[42px] md:text-[52px] text-[#EAB308]">Wishlist</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-[#6B7280] text-base sm:text-lg max-w-2xl font-medium leading-relaxed"
        >
          Keep track of exclusive conferences, workshops, and concerts you are interested in attending.
        </motion.p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-[400px] bg-white border border-gray-200 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-12 md:p-16 text-center rounded-3xl border border-gray-200 shadow-md max-w-xl mx-auto flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
            <Heart size={36} className="text-[#EAB308]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">No Saved Events Yet</h2>
          <p className="text-gray-500 font-medium mb-8">Start exploring the premium event catalog to curate your itinerary.</p>
          <Link href="/events" className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs transition-all active:scale-95 shadow-md">
            Explore Events
          </Link>
        </motion.div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {events.map((event, i) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <Link href={`/events/${event.id}`} className="block">
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600')} alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    <button 
                      onClick={(e) => remove(event.id, e)} 
                      className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-xs rounded-xl shadow-xs text-gray-400 hover:text-red-500 transition-colors z-20"
                    >
                      <Trash2 size={15} />
                    </button>

                    <span className="absolute top-4 left-4 bg-gray-900/90 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold">
                      <Calendar size={13} className="text-[#EAB308]" />
                      <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    
                    <h3 className="text-lg font-extrabold mb-1.5 text-gray-900 group-hover:text-yellow-600 transition-colors truncate">{event.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-4">
                      <MapPin size={12} />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                </Link>

                <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-b-3xl">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                    <span className="font-black text-gray-900 text-base">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <Link href={`/events/${event.id}`} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold px-4 py-2 rounded-xl text-xs transition-all active:scale-95 shadow-xs flex items-center gap-1">
                    Book <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
