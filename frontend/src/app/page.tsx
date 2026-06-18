'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { ArrowRight, Calendar as CalendarIcon, MapPin, Users, Code, Building2, Music, Presentation, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const [featData, allData] = await Promise.all([
        api.get('/events/featured'),
        api.get('/events')
      ]);
      setFeatured(featData.slice(0, 3));
      // Filter out featured from upcoming, or just show the next 4 events
      const sortedEvents = [...allData].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      setUpcoming(sortedEvents.slice(0, 4));
    } catch (e) {
      console.error('Error loading events:', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Tech', icon: <Code size={20} />, count: '45+ Events' },
    { name: 'Business', icon: <Building2 size={20} />, count: '32+ Events' },
    { name: 'Music', icon: <Music size={20} />, count: '20+ Events' },
    { name: 'Workshops', icon: <Presentation size={20} />, count: '18+ Events' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col items-center selection:bg-[#FF6B00]">
      
      {/* HERO SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 pt-24 pb-20 md:pt-36 md:pb-28 text-center flex flex-col items-center relative z-10">
        {/* Subtle, soft top gradient ambient glow (very minimal) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#FF6B00]/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121212] border border-[#1E1E1E] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-semibold text-[#A0A0A0] tracking-wide uppercase">Enterprise Event Management</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] mb-6">
            Find & Book Events Easily
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-[#A0A0A0] max-w-2xl font-normal leading-relaxed mb-10">
            Manage registrations, bookings, payments, and event participation in one unified, high-performance platform. Built for professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Link 
              href="/events" 
              className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2 text-base shadow-[0_4px_20px_rgba(255,107,0,0.15)]"
            >
              Explore Events
              <ArrowRight size={16} />
            </Link>
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto bg-[#121212] hover:bg-[#1A1A1A] text-white font-bold py-3.5 px-8 rounded-xl border border-[#1E1E1E] hover:border-[#333] transition-all flex items-center justify-center text-base"
            >
              Create Event
            </Link>
          </div>
        </motion.div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12 border-t border-[#121212]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={`/events?category=${cat.name}`}
              className="bg-[#0A0A0A] border border-[#121212] hover:border-[#FF6B00]/40 p-5 rounded-2xl transition-all group flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#121212] flex items-center justify-center text-[#A0A0A0] group-hover:text-[#FF6B00] group-hover:bg-[#FF6B00]/5 transition-colors">
                {cat.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{cat.name}</h4>
                <p className="text-xs text-[#555] font-semibold">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Events</h2>
            <p className="text-[#A0A0A0] text-sm mt-1">Handpicked experiences of exceptional quality.</p>
          </div>
          <Link href="/events" className="text-sm font-bold text-[#FF6B00] hover:text-white transition-colors flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 bg-[#0A0A0A] border border-[#121212] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#121212] p-12 rounded-2xl text-center text-[#A0A0A0] text-sm">
            No featured events at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((event) => (
              <Link 
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-[#0A0A0A] border border-[#121212] hover:border-[#FF6B00]/30 rounded-2xl overflow-hidden flex flex-col group transition-all"
              >
                {event.imageUrl ? (
                  <div className="relative h-44 w-full bg-[#121212] overflow-hidden">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-[#121212] to-[#0A0A0A] flex items-center justify-center border-b border-[#121212] text-[#333]">
                    <Sparkles size={32} />
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B00] bg-[#FF6B00]/5 px-2.5 py-1 rounded-md border border-[#FF6B00]/10">
                      {event.category}
                    </span>
                    <span className="text-xs text-[#555] font-semibold flex items-center gap-1">
                      <CalendarIcon size={12} />
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-[#A0A0A0] text-xs leading-relaxed line-clamp-2 mb-6 flex-1">
                    {event.description}
                  </p>

                  <div className="flex justify-between items-center pt-4 border-t border-[#121212]">
                    <span className="text-base font-extrabold text-white">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                    <span className="text-[11px] text-[#A0A0A0] font-semibold bg-[#121212] px-2.5 py-1 rounded-md border border-[#1E1E1E] flex items-center gap-1.5">
                      <Users size={12} /> {event.availableSlots} slots left
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12 border-t border-[#121212]">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Upcoming Schedule</h2>
          <p className="text-[#A0A0A0] text-sm mt-1">Calendar events scheduled for the coming weeks.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-[#0A0A0A] border border-[#121212] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#121212] p-12 rounded-2xl text-center text-[#A0A0A0] text-sm">
            No upcoming events scheduled.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((event) => (
              <Link 
                key={event.id}
                href={`/events/${event.id}`}
                className="bg-[#0A0A0A] border border-[#121212] hover:border-[#FF6B00]/20 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-[#121212] border border-[#1E1E1E] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase text-[#FF6B00]">
                      {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-sm font-extrabold text-white leading-none">
                      {new Date(event.startDate).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-[#FF6B00] transition-colors line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#555] font-semibold">
                      <span className="text-[#A0A0A0]">{event.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#121212] pt-3 sm:pt-0 shrink-0">
                  <span className="text-base font-extrabold text-white">
                    {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                  </span>
                  <div className="text-xs font-bold text-[#FF6B00] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Book Ticket <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-12 mt-16 border-t border-[#121212] flex flex-col md:flex-row justify-between items-center gap-4 text-[#555] text-xs font-semibold">
        <div>
          <span className="text-white font-extrabold tracking-tight">EventBooking.</span> Enterprise Event Management
        </div>
        <div>
          © 2026 EventBooking Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
