'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { ArrowRight, Star, Calendar as CalendarIcon, MapPin, Users, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const featData = await api.get('/events/featured');
      setFeatured(featData);
      
      const allData = await api.get('/events');
      setAllEvents(allData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#FF8C42]/10 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
        </div>

        <div className="z-10 text-center max-w-5xl px-4 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-4 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-sm font-bold mb-6 tracking-wide uppercase">
              The New Standard
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[#A0A0A0]">
              Experiences that <br/><span className="text-transparent bg-gradient-to-r from-[#FF6B00] to-[#FF8C42]">Matter.</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A0A0A0] max-w-2xl mx-auto mb-10 font-medium">
              Discover, book, and experience premium events tailored for the modern professional. The world's top creators host their events on EVNT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events" className="btn-primary text-lg px-8 flex items-center justify-center gap-2">
                Explore Events <ArrowRight size={20} />
              </Link>
              <Link href="/signup" className="btn-secondary text-lg px-8">
                Host an Event
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="w-full border-y border-[#1E1E1E] bg-[#0A0A0A] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#1E1E1E]/50">
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Events Hosted', value: '1,200+' },
            { label: 'Tickets Sold', value: '150K+' },
            { label: 'Satisfaction', value: '4.9/5' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center px-4">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-[#A0A0A0] text-sm md:text-base font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="w-full max-w-7xl px-4 py-24 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black mb-3">Trending Now</h2>
            <p className="text-[#A0A0A0] text-lg">Curated premium events handpicked for you.</p>
          </div>
          <Link href="/events" className="hidden md:flex items-center gap-2 text-[#FF6B00] font-bold hover:text-white transition-colors">
            View All <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <div key={n} className="h-96 glass-card animate-pulse" />)}
          </div>
        ) : featured.length === 0 ? (
          <div className="glass-card p-12 text-center text-[#A0A0A0]">No featured events currently available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/events/${event.id}`} className="block glass-card overflow-hidden group h-full flex flex-col border border-[#1E1E1E] hover:border-[#FF6B00]/50 transition-colors">
                  <div className="relative h-56 overflow-hidden bg-[#1A1A1A]">
                    <img 
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                      alt={event.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-80" />
                    <span className="absolute top-4 right-4 bg-[#050505]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FF6B00] border border-[#FF6B00]/30">
                      {event.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between relative bg-[#121212]">
                    <div className="absolute -top-6 left-6 bg-[#050505] border border-[#1E1E1E] rounded-xl px-4 py-2 flex flex-col items-center justify-center shadow-xl">
                      <span className="text-[#FF6B00] text-sm font-bold uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-white text-xl font-black leading-none mt-1">{new Date(event.startDate).getDate()}</span>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{event.title}</h3>
                      <p className="text-[#A0A0A0] text-sm line-clamp-2 mb-6">{event.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-[#1E1E1E]">
                      <span className="text-2xl font-black text-white">
                        {event.price === 0 ? 'Free' : <span className="text-[#FF6B00]">₹{event.price.toLocaleString('en-IN')}</span>}
                      </span>
                      <span className="text-sm font-semibold text-[#A0A0A0] flex items-center gap-1">
                        <Users size={16} /> {event.availableSlots} left
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ALL EVENTS SECTION */}
      <section className="w-full bg-[#0A0A0A] py-24 relative z-10 border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black mb-3">Discover Directory</h2>
              <p className="text-[#A0A0A0] text-lg">Browse everything happening across the network.</p>
            </div>
            <Link href="/events" className="hidden md:flex items-center gap-2 text-[#FF6B00] font-bold hover:text-white transition-colors">
              Browse Directory <ArrowRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="h-96 glass-card animate-pulse" />)}
            </div>
          ) : allEvents.length === 0 ? (
            <div className="glass-card p-12 text-center text-[#A0A0A0]">No events available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allEvents.slice(0, 6).map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link href={`/events/${event.id}`} className="block glass-card overflow-hidden group h-full flex flex-col border border-[#1E1E1E] hover:border-[#FF6B00]/50 transition-colors">
                    <div className="relative h-48 overflow-hidden bg-[#1A1A1A]">
                      <img 
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                        alt={event.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-90" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between relative -mt-10">
                      <div className="bg-[#121212] rounded-xl p-4 border border-[#1E1E1E] shadow-xl flex-1 flex flex-col justify-between relative z-10">
                        <div>
                          <h3 className="text-lg font-bold mb-1 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{event.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-[#A0A0A0] font-medium mb-4">
                            <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(event.startDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-[#1E1E1E]">
                          <span className="text-xl font-black text-white">
                            {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                          </span>
                          <span className="text-xs font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-1 rounded-md">
                            {event.category}
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
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#050505] border-t border-[#1E1E1E] py-16 text-center">
        <h2 className="text-2xl font-black tracking-tight text-white mb-6">EVNT<span className="text-[#FF6B00]">.</span></h2>
        <p className="text-[#A0A0A0] max-w-md mx-auto mb-8 font-medium">The premium platform for creators, artists, and professionals to host world-class events.</p>
        <div className="flex justify-center gap-6 mb-12">
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-semibold text-sm">Twitter</Link>
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-semibold text-sm">LinkedIn</Link>
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-semibold text-sm">Instagram</Link>
        </div>
        <p className="text-[#A0A0A0] text-sm">© 2026 EVNT Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
