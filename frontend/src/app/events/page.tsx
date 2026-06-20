'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../utils/api';
import { Search, MapPin, Users, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/ScrollReveal';

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><span className="text-[#6B7280]">Loading events...</span></div>}>
      <EventsContent />
    </Suspense>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchEvents();
  }, [category, search, minPrice, maxPrice, location]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (location) params.location = location;
      
      const [data, trend] = await Promise.all([
        api.get('/events', { params }),
        api.get('/events/trending').catch(() => []),
      ]);
      setEvents(data);
      setTrending(trend);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tech', 'Music', 'Business', 'Arts', 'Sports', 'Workshop'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
      
      {/* Header Section */}
      <div className="mb-12 md:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-tight text-[#111827]"
        >
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Events</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-[#6B7280] text-lg md:text-xl max-w-2xl font-medium leading-relaxed"
        >
          Discover incredible experiences curated from around the world. Secure your spot at the most exclusive gatherings.
        </motion.p>
      </div>

      {/* Search & Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="bg-white p-4 md:p-6 mb-12 md:mb-16 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative z-20"
      >
        <motion.div 
          className="relative flex-1 w-full"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" size={20} />
          <input 
            type="text" 
            placeholder="Search events by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 md:py-4 pl-12 pr-4 text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all font-medium text-sm md:text-base hover:bg-white"
          />
        </motion.div>
        
        <motion.div 
          className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            onClick={() => setCategory('')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`whitespace-nowrap px-6 py-4 rounded-xl font-bold transition-all ${category === '' ? 'bg-[#FACC15] text-[#111827] shadow-md' : 'bg-white border border-gray-300 text-[#6B7280] hover:text-[#111827] hover:border-[#FACC15]'}`}
          >
            All
          </motion.button>
          {categories.map((cat, i) => (
            <motion.button 
              key={cat}
              onClick={() => setCategory(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className={`whitespace-nowrap px-6 py-4 rounded-xl font-bold transition-all ${category === cat ? 'bg-[#FACC15] text-[#111827] shadow-md' : 'bg-white border border-gray-300 text-[#6B7280] hover:text-[#111827] hover:border-[#FACC15]'}`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex gap-3 flex-wrap">
          <input type="number" placeholder="Min ₹" value={minPrice} onChange={e => setMinPrice(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-xl text-sm" />
          <input type="number" placeholder="Max ₹" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-xl text-sm" />
          <input type="text" placeholder="Location..." value={location} onChange={e => setLocation(e.target.value)}
            className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-xl text-sm" />
        </div>
      </motion.div>

      {trending.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Sparkles className="text-[#FACC15]" /> Trending Now</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trending.slice(0, 4).map(e => (
              <Link key={e.id} href={`/events/${e.id}`} className="flex-shrink-0 w-64 premium-card p-4 hover:border-[#FACC15]">
                <p className="font-bold line-clamp-1">{e.title}</p>
                <p className="text-[#FACC15] font-black mt-1">{e.price === 0 ? 'Free' : `₹${e.price}`}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Event Grid */}
      {loading ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <motion.div key={n} variants={itemVariants} className="h-[450px] bg-white border border-gray-200 rounded-2xl animate-pulse" />
          ))}
        </motion.div>
      ) : events.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-16 text-center rounded-2xl border-2 border-dashed border-gray-300"
        >
          <motion.div 
            className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Filter size={32} className="text-[#9CA3AF]" />
          </motion.div>
          <h3 className="text-2xl font-bold text-[#111827] mb-2">No events found</h3>
          <p className="text-[#6B7280] font-medium">Try adjusting your search criteria or explore other categories.</p>
          <motion.button 
            onClick={() => {setSearch(''); setCategory('');}}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-white text-[#111827] font-bold py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Link href={`/events/${event.id}`} className="block bg-white border border-gray-200 rounded-2xl overflow-hidden group h-[450px] flex flex-col hover:border-[#FACC15] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <motion.div 
                  className="h-56 bg-gray-200 relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                    alt={event.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent opacity-80" />
                  <motion.span 
                    className="absolute top-4 left-4 bg-[#FACC15] text-[#111827] px-3 py-1 rounded-full text-xs font-bold border border-[#EAB308]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {event.category}
                  </motion.span>
                </motion.div>

                <div className="p-6 flex-1 flex flex-col relative bg-white">
                  <motion.div 
                    className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 inline-flex flex-col items-center justify-center w-16 shadow-sm mb-4 group-hover:border-[#FACC15] transition-colors z-10 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-[#FACC15] text-xs font-bold uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                    <span className="text-[#111827] text-xl font-black">{new Date(event.startDate).getDate()}</span>
                  </motion.div>

                  <h3 className="text-lg md:text-xl font-black mb-2 text-[#111827] group-hover:text-[#FACC15] transition-colors line-clamp-1">{event.title}</h3>
                  <p className="text-[#6B7280] text-sm line-clamp-2 mb-4 font-medium flex-1 leading-relaxed">{event.description}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-end">
                    <div>
                      <span className="text-xs font-semibold text-[#9CA3AF] block mb-1 uppercase tracking-wider">Price</span>
                      <span className="text-2xl font-black text-[#111827]">
                        {event.price === 0 ? 'Free' : <span className="text-[#FACC15]">₹{event.price.toLocaleString('en-IN')}</span>}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#9CA3AF] block mb-1 uppercase tracking-wider">Available</span>
                      <span className={`text-sm font-bold flex items-center justify-end gap-1 ${event.availableSlots < 10 ? 'text-red-600' : 'text-[#6B7280]'}`}>
                        <Users size={14} /> {event.availableSlots} left
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
