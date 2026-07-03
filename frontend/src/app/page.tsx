'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, getSession, resolveImageUrl } from '../utils/api';
import { ArrowRight, Calendar as CalendarIcon, MapPin, Users, Sparkles, Star, Search, Flame, Clock, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '../components/ScrollReveal';

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [session, setSession] = useState<any>(null);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    setSession(getSession());
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [featData, trendData, upcomingData] = await Promise.all([
        api.get('/events/featured').catch(() => []),
        api.get('/events/trending').catch(() => []),
        api.get('/events/upcoming').catch(() => []),
      ]);

      setFeatured(featData.slice(0, 3));
      setPopular(trendData.slice(0, 4));
      setUpcoming(upcomingData.slice(0, 4));

      const sess = getSession();
      if (sess) {
        const wl = await api.get('/wishlist').catch(() => []);
        setWishlistIds(wl.map((e: any) => e.id));
      }
    } catch (e) {
      console.error('Error loading events:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/events');
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
    { name: 'Tech', icon: '💻', count: 'Latest Tech' },
    { name: 'Music', icon: '🎵', count: 'Live Shows' },
    { name: 'Business', icon: '💼', count: 'Summits' },
    { name: 'Arts', icon: '🎨', count: 'Exhibitions' },
    { name: 'Sports', icon: '⚽', count: 'Matches' },
    { name: 'Workshop', icon: '🛠️', count: 'Bootcamps' },
  ];

  const testimonials = [
    {
      quote: "The easiest way to book corporate summits. The interface is clean, lightning fast, and reliable.",
      author: "Sarah Jenkins",
      role: "VP of Operations, TechCorp",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "I've booked over 15 music festivals here. Absolutely no friction, tickets are stored instantly on my profile.",
      author: "Marcus Aurelius",
      role: "Subscriber since 2024",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      quote: "Outstanding checkout speed. Stripe integration works flawlessly, and ticket details are clean.",
      author: "Emily Chen",
      role: "Event Organizer & Attendee",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
    }
  ];

  const hasAnyEvents = featured.length > 0 || upcoming.length > 0 || popular.length > 0;

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-[#111827] flex flex-col items-center relative overflow-hidden pb-12">
      
      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-24 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-6 shadow-xs"
        >
          <Sparkles size={14} className="text-[#FFD400]" />
          <span className="text-[11px] font-black text-[#111827] tracking-wider uppercase">Premium Experiences Await</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-[#111827] max-w-5xl leading-[1.08] mb-8"
        >
          Discover & Book <br />
          <span className="text-[#FFD400]">
            Premium Events
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="text-base sm:text-lg md:text-xl text-[#6B7280] max-w-2xl font-medium leading-relaxed mb-10 text-balance"
        >
          Seamlessly discover, register, and experience world-class events. Uncompromising quality and direct booking for exclusive gatherings.
        </motion.p>

        {/* Elegant Search Bar */}
        <motion.form
          onSubmit={handleSearchSubmit}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.15 }}
          className="w-full max-w-2xl bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 mb-12 hover:border-[#D1D5DB] transition-all duration-[250ms]"
        >
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="text-gray-400 absolute left-3" size={20} />
            <input
              type="text"
              placeholder="Search premium events, workshops, concerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-sm focus:outline-none text-[#111827] placeholder-gray-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-[#FFD400] hover:bg-[#E6BE00] text-gray-900 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 active:scale-95 whitespace-nowrap"
          >
            Find Events
          </button>
        </motion.form>

        {/* Quick Category Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.25 }}
          className="flex flex-wrap justify-center gap-3 w-full max-w-4xl"
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/events?category=${encodeURIComponent(cat.name)}`}
              className="bg-white border border-[#E5E7EB] hover:border-[#FFD400] hover:shadow-xs px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 transition-all duration-200 flex items-center gap-2 active:scale-95"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* MAIN CONTAINER */}
      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFD400]"></div>
        </div>
      ) : !hasAnyEvents ? (
        <div className="w-full max-w-6xl mx-auto px-6 py-20 text-center text-gray-400">
          <CalendarIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p className="font-semibold text-lg">No active events found. Check back later!</p>
        </div>
      ) : (
        <div className="w-full space-y-24">
          
          {/* FEATURED EVENTS */}
          {featured.length > 0 && (
            <section className="w-full max-w-6xl mx-auto px-6">
              <ScrollReveal direction="up" className="flex justify-between items-end mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="text-[#FFD400]" size={18} />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Handpicked Selection</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">Featured Events</h2>
                </div>
                <Link
                  href="/events"
                  className="text-sm font-bold text-[#FFD400] hover:text-[#111827] transition-colors flex items-center gap-1 group"
                >
                  View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featured.map((event) => {
                  const isFav = wishlistIds.includes(event.id);
                  return (
                    <div key={event.id} className="relative premium-card flex flex-col justify-between h-full bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden transition-all duration-[250ms] hover:translate-y-[-4px] hover:shadow-md">
                      <button
                        onClick={(e) => toggleWishlist(event.id, e)}
                        className="absolute top-4 right-4 p-2 bg-white/95 backdrop-blur-xs rounded-xl shadow-xs text-gray-400 hover:text-red-500 transition-colors z-20"
                      >
                        <Heart size={16} fill={isFav ? '#EF4444' : 'none'} className={isFav ? 'text-red-500' : ''} />
                      </button>
                      <Link href={`/events/${event.id}`} className="group block">
                        <div className="relative h-52 bg-gray-100 overflow-hidden">
                          {(event.galleryImages && event.galleryImages.length > 0) || event.imageUrl ? (
                            <img
                              src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl)}
                              alt={event.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-yellow-50/50 text-yellow-600">
                              <Sparkles size={40} className="opacity-80" />
                            </div>
                          )}

                          <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                            <span className="bg-[#111827]/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                              {event.category}
                            </span>
                            {event.featured && (
                              <span className="bg-[#FFD400] text-gray-900 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3 text-xs text-gray-400 font-bold">
                            <CalendarIcon size={13} className="text-[#FFD400]" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-1 mb-2 leading-snug">
                            {event.title}
                          </h3>
                          <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </Link>

                      <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 rounded-b-2xl">
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
            </section>
          )}

          {/* POPULAR EVENTS */}
          {popular.length > 0 && (
            <section className="w-full bg-[#FFFFFF] border-y border-gray-100 py-16">
              <div className="w-full max-w-6xl mx-auto px-6">
                <ScrollReveal direction="up" className="flex justify-between items-end mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Flame className="text-[#FFD400]" size={18} />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Now</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Popular Events</h2>
                  </div>
                  <Link
                    href="/events"
                    className="text-sm font-bold text-[#FFD400] hover:text-[#111827] transition-all flex items-center gap-1 group"
                  >
                    Explore More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popular.map((event) => {
                    const isFav = wishlistIds.includes(event.id);
                    return (
                      <div
                        key={event.id}
                        className="group relative bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#FFD400] hover:shadow-xs transition-all duration-[250ms]"
                      >
                        <button
                          onClick={(e) => toggleWishlist(event.id, e)}
                          className="absolute top-3 right-3 p-1.5 bg-white/95 backdrop-blur-xs rounded-lg shadow-xs text-gray-400 hover:text-red-500 transition-colors z-20"
                        >
                          <Heart size={14} fill={isFav ? '#EF4444' : 'none'} className={isFav ? 'text-red-500' : ''} />
                        </button>
                        <Link
                          href={`/events/${event.id}`}
                          className="block"
                        >
                          <div className="relative h-40 bg-gray-100">
                            {(event.galleryImages && event.galleryImages.length > 0) || event.imageUrl ? (
                              <img
                                src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl)}
                                alt={event.title}
                                loading="lazy"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-yellow-50 text-yellow-600">
                                <Star size={32} />
                              </div>
                            )}
                          </div>
                          <div className="p-4.5">
                            <span className="text-[9px] font-black uppercase text-[#FFD400] tracking-widest">{event.category}</span>
                            <h4 className="font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-600 mt-1 mb-1.5 transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-extrabold text-gray-900">
                                {event.price === 0 ? 'Free' : `₹${event.price}`}
                              </span>
                              <span className="text-gray-400 font-semibold flex items-center gap-1">
                                <MapPin size={11} /> {event.location}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* POPULAR CATEGORIES */}
          <section className="w-full max-w-6xl mx-auto px-6">
            <ScrollReveal direction="up" className="mb-8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Browse by Topic</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Popular Categories</h2>
            </ScrollReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/events?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white border border-[#E5E7EB] hover:border-[#FFD400] p-6 rounded-2xl text-center transition-all duration-[200ms] hover:translate-y-[-2px] group block"
                >
                  <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                  <span className="font-bold text-sm text-gray-900 block">{cat.name}</span>
                  <span className="text-xs text-gray-400 block mt-1">{cat.count}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* UPCOMING EVENTS */}
          {upcoming.length > 0 && (
            <section className="w-full max-w-6xl mx-auto px-6">
              <ScrollReveal direction="up" className="flex justify-between items-end mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="text-[#FFD400]" size={18} />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chronological Experience</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Upcoming Events</h2>
                </div>
                <Link
                  href="/events"
                  className="text-sm font-bold text-[#FFD400] hover:text-[#111827] transition-all flex items-center gap-1 group"
                >
                  View Schedule <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((event) => {
                  const isFav = wishlistIds.includes(event.id);
                  return (
                    <div
                      key={event.id}
                      className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-start gap-5 hover:border-[#FFD400] hover:shadow-xs transition-all duration-[250ms]"
                    >
                      <div className="relative w-28 h-28 flex-shrink-0">
                        <Link href={`/events/${event.id}`} className="block w-full h-full rounded-xl overflow-hidden bg-gray-50">
                          {(event.galleryImages && event.galleryImages.length > 0) || event.imageUrl ? (
                            <img
                              src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl)}
                              alt={event.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-yellow-600 bg-yellow-50">
                              <CalendarIcon size={24} />
                            </div>
                          )}
                        </Link>
                        <button
                          onClick={(e) => toggleWishlist(event.id, e)}
                          className="absolute top-2 right-2 p-1.5 bg-white/95 backdrop-blur-xs rounded-lg shadow-xs text-gray-400 hover:text-red-500 transition-colors z-20"
                        >
                          <Heart size={12} fill={isFav ? '#EF4444' : 'none'} className={isFav ? 'text-red-500' : ''} />
                        </button>
                      </div>

                      <Link href={`/events/${event.id}`} className="flex-1 min-w-0 block">
                        <span className="bg-yellow-50 text-[#FFD400] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {event.category}
                        </span>
                        <h4 className="font-extrabold text-gray-900 text-lg group-hover:text-yellow-600 mt-2 mb-1.5 truncate transition-colors leading-tight">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5 mb-1">
                          <CalendarIcon size={12} />
                          {new Date(event.startDate).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                          <MapPin size={12} />
                          {event.location}
                        </p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* TESTIMONIALS SECTION */}
          <section className="w-full bg-[#FFFFFF] border-t border-gray-100 py-16">
            <div className="w-full max-w-6xl mx-auto px-6">
              <ScrollReveal direction="up" className="text-center mb-12">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Trusted Reviews</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900">What Our Users Say</h2>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-white border border-[#E5E7EB] p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                    <p className="text-sm text-gray-600 italic leading-relaxed mb-6">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
                      <div>
                        <span className="font-bold text-sm text-[#111827] block">{t.author}</span>
                        <span className="text-xs text-gray-400 block">{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-12 mt-16 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs font-semibold">
        <div>
          <span className="text-[#111827] font-black tracking-tight">EventBooking.</span> Premium Event Management
        </div>
        <div>
          © 2026 EventBooking Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
