'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, getSession, resolveImageUrl } from '../../utils/api';
import { Search, MapPin, Users, Filter, Sparkles, Calendar as CalendarIcon, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../../components/ScrollReveal';

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFD400]"></div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [location, setLocation] = useState('');
  const [session, setSession] = useState<any>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) setCategory(cat);
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
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

      const sess = getSession();
      if (sess) {
        const wl = await api.get('/wishlist').catch(() => []);
        setWishlistIds(wl.map((e: any) => e.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push('/login');
      return;
    }

    const isFav = wishlistIds.includes(eventId);
    try {
      if (isFav) {
        await api.delete(`/wishlist/${eventId}`);
        setWishlistIds(prev => prev.filter(id => id !== eventId));
      } else {
        await api.post(`/wishlist/${eventId}`);
        setWishlistIds(prev => [...prev, eventId]);
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err);
    }
  };

  const categories = [
    'Tech', 
    'Music', 
    'Business', 
    'Arts', 
    'Sports', 
    'Workshop', 
    'Conference', 
    'Startup', 
    'AI', 
    'Hackathon', 
    'Seminar', 
    'Meetup'
  ];

  const categoryEmojis: Record<string, string> = {
    'Tech': '💻',
    'Music': '🎵',
    'Business': '💼',
    'Arts': '🎨',
    'Sports': '⚽',
    'Workshop': '🛠️',
    'Conference': '🎤',
    'Startup': '🚀',
    'AI': '🤖',
    'Hackathon': '🏆',
    'Seminar': '📚',
    'Meetup': '🤝'
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative min-h-screen bg-white">
      
      {/* Header Section */}
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
        >
          <Sparkles size={12} className="text-[#FFD400]" />
          <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">Curated Gatherings</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-black mb-4 tracking-tight text-[#111827] leading-none"
        >
          Explore <span className="text-[#FFD400]">Events</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1, duration: 0.25 }}
          className="text-[#6B7280] text-base sm:text-lg max-w-2xl font-medium leading-relaxed"
        >
          Discover premium experiences, masterclass workshops, and exclusive networking events. Secure your spot at the frontier of industry and culture.
        </motion.p>
      </div>

      {/* Advanced Filter Suite */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.25 }}
        className="bg-white p-6 mb-12 rounded-3xl border border-[#E5E7EB] shadow-xs relative z-20 space-y-6"
      >
        <div className="flex flex-col gap-6">
          {/* Main search */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, category, or keyword..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#FFD400] focus:bg-white transition-all font-medium text-sm"
            />
          </div>

          {/* Category Filter Section */}
          <div className="w-full relative">
            {/* Desktop View: All categories visible, wrap into multiple rows, no hidden categories */}
            <div className="hidden md:flex flex-wrap gap-2.5 items-center">
              <button 
                onClick={() => setCategory('')}
                className={`whitespace-nowrap px-5 py-3 rounded-xl font-extrabold text-xs transition-all duration-200 active:scale-95 ${
                  category === '' 
                    ? 'bg-[#FFD400] text-gray-900 shadow-xs' 
                    : 'bg-white border border-[#E5E7EB] text-gray-600 hover:text-gray-900 hover:border-[#FFD400]'
                }`}
              >
                🌐 All Events
              </button>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-5 py-3 rounded-xl font-extrabold text-xs transition-all duration-200 active:scale-95 ${
                    category === cat 
                      ? 'bg-[#FFD400] text-gray-900 shadow-xs' 
                      : 'bg-white border border-[#E5E7EB] text-gray-600 hover:text-gray-900 hover:border-[#FFD400]'
                  }`}
                >
                  <span className="mr-1.5">{categoryEmojis[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile View: Horizontally scrollable row showing ALL categories + swipe indicator */}
            <div className="md:hidden w-full">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Categories</span>
                <span className="text-[11px] font-bold text-[#FFD400] flex items-center gap-1">Swipe categories →</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar scroll-smooth w-full">
                <button 
                  onClick={() => setCategory('')}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${
                    category === '' 
                      ? 'bg-[#FFD400] text-gray-900 shadow-xs' 
                      : 'bg-white border border-[#E5E7EB] text-gray-600'
                  }`}
                >
                  🌐 All
                </button>
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all active:scale-95 ${
                      category === cat 
                        ? 'bg-[#FFD400] text-gray-900 shadow-xs' 
                        : 'bg-white border border-[#E5E7EB] text-gray-600'
                    }`}
                  >
                    <span className="mr-1.5">{categoryEmojis[cat]}</span>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Location Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Min Price (₹)</label>
            <input 
              type="number" 
              placeholder="E.g. 500" 
              value={minPrice} 
              onChange={e => setMinPrice(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFD400] focus:bg-white transition-all text-[#111827]" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Max Price (₹)</label>
            <input 
              type="number" 
              placeholder="E.g. 5000" 
              value={maxPrice} 
              onChange={e => setMaxPrice(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFD400] focus:bg-white transition-all text-[#111827]" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Location / Venue</label>
            <input 
              type="text" 
              placeholder="E.g. Bangalore" 
              value={location} 
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FFD400] focus:bg-white transition-all text-[#111827]" 
            />
          </div>
        </div>
      </motion.div>

      {/* Dynamic Trending Row */}
      {trending.length > 0 && !search && !category && (
        <div className="mb-14">
          <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-gray-900">
            <Award className="text-[#FFD400]" size={20} /> Trending Experiences
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {trending.slice(0, 4).map(e => (
              <Link 
                key={e.id} 
                href={`/events/${e.id}`} 
                className="flex-shrink-0 w-72 bg-white border border-[#E5E7EB] rounded-2xl p-4.5 hover:border-[#FFD400] hover:shadow-xs transition-all duration-[200ms]"
              >
                <div className="h-32 bg-gray-100 rounded-xl overflow-hidden mb-3">
                  <img src={resolveImageUrl((e.galleryImages && e.galleryImages[0]) || e.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400')} alt={e.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-[9px] font-black uppercase text-[#FFD400] bg-yellow-50 px-2 py-0.5 rounded">{e.category}</span>
                <p className="font-extrabold text-gray-900 line-clamp-1 mt-2 mb-1.5">{e.title}</p>
                <p className="text-gray-900 font-black text-sm">{e.price === 0 ? 'Free' : `₹${e.price.toLocaleString('en-IN')}`}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-[400px] bg-white border border-[#E5E7EB] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-16 text-center rounded-3xl border border-[#E5E7EB] max-w-2xl mx-auto flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
            <Filter size={32} className="text-[#FFD400]" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Events Available</h3>
          <p className="text-[#6B7280] font-medium mb-6">Please check back later.</p>
          <button 
            onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setLocation(''); }}
            className="bg-gray-900 hover:bg-gray-800 text-white font-extrabold py-3.5 px-8 rounded-xl text-xs transition-all active:scale-95 shadow-md"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Event Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.map((event) => {
            const isFav = wishlistIds.includes(event.id);
            return (
              <div key={event.id} className="premium-card flex flex-col justify-between h-full bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden transition-all duration-[250ms] hover:translate-y-[-4px] hover:shadow-md">
                <Link href={`/events/${event.id}`} className="group block">
                  <div className="h-56 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800')} 
                      alt={event.title} 
                      loading="lazy"
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-300"
                    />
                    
                    <button
                      onClick={(e) => toggleWishlist(event.id, e)}
                      className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-xs rounded-xl shadow-xs text-gray-400 hover:text-red-500 transition-colors z-20"
                    >
                      <Heart size={16} fill={isFav ? '#EF4444' : 'none'} className={isFav ? 'text-red-500' : ''} />
                    </button>

                    <span className="absolute top-4 left-4 bg-gray-900/90 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {event.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold">
                      <CalendarIcon size={13} className="text-[#FFD400]" />
                      <span>
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-extrabold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed font-medium">
                      {event.description}
                    </p>
                  </div>
                </Link>

                <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-b-[16px]">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                    <span className="font-black text-gray-900 text-lg">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-2xs">
                    <Users size={12} className="text-[#FFD400]" /> {event.availableSlots} left
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
