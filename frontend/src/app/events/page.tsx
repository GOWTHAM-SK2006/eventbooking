'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../utils/api';
import { Search, Calendar, MapPin, Users, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [category, search]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const data = await api.get(`/events?${params.toString()}`);
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tech', 'Music', 'Business', 'Arts', 'Sports', 'Workshop'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
      
      {/* Header Section */}
      <div className="mb-12 md:mb-16">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF8C42]">Events.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-[#A0A0A0] text-xl max-w-2xl font-medium">
          Discover incredible experiences curated from around the world. Secure your spot at the most exclusive gatherings.
        </motion.p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 md:p-6 mb-12 md:mb-16 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center shadow-2xl relative z-20">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]" size={20} />
          <input 
            type="text" 
            placeholder="Search events by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 md:py-4 pl-12 pr-4 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all font-medium text-sm md:text-base"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          <button 
            onClick={() => setCategory('')}
            className={`whitespace-nowrap px-6 py-4 rounded-xl font-bold transition-all ${category === '' ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white hover:border-[#FF6B00]'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-6 py-4 rounded-xl font-bold transition-all ${category === cat ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#A0A0A0] hover:text-white hover:border-[#FF6B00]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-[450px] glass-card animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed border-2 border-[#1E1E1E]">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter size={32} className="text-[#555]" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No events found</h3>
          <p className="text-[#A0A0A0] font-medium">Try adjusting your search criteria or explore other categories.</p>
          <button onClick={() => {setSearch(''); setCategory('');}} className="mt-8 btn-secondary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link href={`/events/${event.id}`} className="block glass-card overflow-hidden group h-[450px] flex flex-col border border-[#1E1E1E] hover:border-[#FF6B00]/50 transition-colors relative">
                <div className="h-56 bg-[#1A1A1A] relative overflow-hidden">
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                    alt={event.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent opacity-90" />
                  <span className="absolute top-4 left-4 bg-[#050505]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-[#333]">
                    {event.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col relative bg-[#121212] -mt-12">
                  <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 inline-flex flex-col items-center justify-center w-16 shadow-2xl mb-4 group-hover:border-[#FF6B00] transition-colors z-10">
                    <span className="text-[#FF6B00] text-xs font-bold uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-white text-xl font-black">{new Date(event.startDate).getDate()}</span>
                  </div>

                  <h3 className="text-xl font-black mb-2 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{event.title}</h3>
                  <p className="text-[#A0A0A0] text-sm line-clamp-2 mb-4 font-medium flex-1">{event.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-[#1E1E1E] flex justify-between items-end">
                    <div>
                      <span className="text-xs font-semibold text-[#777] block mb-1 uppercase tracking-wider">Price</span>
                      <span className="text-2xl font-black text-white">
                        {event.price === 0 ? 'Free' : <span className="text-[#FF6B00]">₹{event.price.toLocaleString('en-IN')}</span>}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#777] block mb-1 uppercase tracking-wider">Status</span>
                      <span className={`text-sm font-bold flex items-center justify-end gap-1 ${event.availableSlots < 10 ? 'text-red-500' : 'text-[#A0A0A0]'}`}>
                        <Users size={14} /> {event.availableSlots} left
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
