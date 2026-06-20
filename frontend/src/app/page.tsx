'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, getSession } from '../utils/api';
import { ArrowRight, Calendar as CalendarIcon, MapPin, Users, Code, Building2, Music, Presentation, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground, { FloatingBlobs } from '../components/AnimatedBackground';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ScrollReveal';

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getSession());
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const [featData, trendData, upcomingData] = await Promise.all([
        api.get('/events/featured'),
        api.get('/events/trending').catch(() => []),
        api.get('/events/upcoming').catch(() => api.get('/events')),
      ]);
      setFeatured(featData.slice(0, 3));
      const sortedEvents = [...(upcomingData.length ? upcomingData : trendData)].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
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

  const trustIndicators = [
    { label: '10K+', value: 'Events' },
    { label: '100K+', value: 'Users' },
    { label: '99%', value: 'Satisfaction' },
  ];

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
    <div className="w-full min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col items-center relative overflow-hidden">
      <FloatingBlobs />

      {/* HERO SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-32 text-center flex flex-col items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15]" />
          <span className="text-xs font-semibold text-[#111827] tracking-wide uppercase">Premium Event Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#111827] max-w-4xl leading-tight mb-8"
        >
          Discover & Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Premium Events</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-[#6B7280] max-w-2xl font-medium leading-relaxed mb-12"
        >
          Seamlessly discover, book, and manage events. A modern platform built for event enthusiasts and professionals worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto mb-12"
        >
          <Link
            href="/events"
            className="group relative w-full sm:w-auto bg-[#FACC15] text-[#111827] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg overflow-hidden flex items-center justify-center gap-2 text-base"
          >
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <span className="relative">Explore Events</span>
            <ArrowRight size={18} className="relative" />
          </Link>
          {session?.roles?.includes('ROLE_ADMIN') && (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white text-[#111827] font-bold py-4 px-8 rounded-xl border border-gray-300 hover:border-[#FACC15] hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
            >
              Create Event
            </Link>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-8 md:gap-12 justify-center flex-wrap"
        >
          {trustIndicators.map((indicator, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-[#FACC15] mb-1">{indicator.label}</div>
              <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{indicator.value}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20">
        <ScrollReveal direction="up" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] text-center mb-4">Browse Categories</h2>
          <p className="text-center text-[#6B7280] max-w-2xl mx-auto">Find events that match your interests</p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map((cat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link
                href={`/events?category=${cat.name}`}
                className="group premium-card p-6 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-[#6B7280] group-hover:text-[#FACC15] group-hover:scale-110 transition-all duration-300">
                  {cat.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827] mb-0.5">{cat.name}</h4>
                  <p className="text-xs text-[#9CA3AF] font-semibold">{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURED EVENTS SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20">
        <ScrollReveal direction="up" className="flex justify-between items-baseline mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-2">Featured Events</h2>
            <p className="text-[#6B7280] text-sm">Handpicked experiences of exceptional quality.</p>
          </div>
          <Link href="/events" className="text-sm font-bold text-[#FACC15] hover:text-[#EAB308] transition-colors flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 bg-white border border-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 rounded-2xl text-center text-[#6B7280] text-sm">
            No featured events at this time.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featured.map((event, index) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  href={`/events/${event.id}`}
                  className="block premium-card overflow-hidden flex flex-col group h-full hover:shadow-lg hover:-translate-y-1"
                >
                  {event.imageUrl ? (
                    <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-b border-gray-200 text-gray-400">
                      <Sparkles size={32} />
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge badge-primary">
                        {event.category}
                      </span>
                      <span className="text-xs text-[#6B7280] font-semibold flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#111827] mb-2 group-hover:text-[#FACC15] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                      {event.description}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-lg font-extrabold text-[#111827]">
                        {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                      </span>
                      <span className="text-xs text-[#6B7280] font-semibold bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 flex items-center gap-1.5">
                        <Users size={12} /> {event.availableSlots}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* UPCOMING EVENTS SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-gray-200">
        <ScrollReveal direction="up" className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-[#111827] mb-2">Upcoming Schedule</h2>
          <p className="text-[#6B7280] text-sm">Events happening in the coming weeks.</p>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-white border border-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="bg-white border border-gray-200 p-12 rounded-2xl text-center text-[#6B7280] text-sm">
            No upcoming events scheduled.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="space-y-3"
          >
            {upcoming.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link
                  href={`/events/${event.id}`}
                  className="block premium-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-yellow-50 border border-yellow-200 flex flex-col items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-[10px] font-bold uppercase text-[#FACC15]">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-sm font-extrabold text-[#111827] leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-[#111827] group-hover:text-[#FACC15] transition-colors line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-[#6B7280] font-semibold">
                        <span>{event.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0 shrink-0">
                    <span className="text-lg font-extrabold text-[#111827]">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                    <div className="text-xs font-bold text-[#FACC15] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Book Now <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* FOOTER */}
      <div className="w-full max-w-6xl mx-auto px-6 py-12 mt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[#6B7280] text-xs font-semibold">
        <div>
          <span className="text-[#111827] font-extrabold tracking-tight">EventBooking.</span> Premium Event Management
        </div>
        <div>
          © 2026 EventBooking Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
