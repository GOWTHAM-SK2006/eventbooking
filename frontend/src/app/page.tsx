'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';
import { ArrowRight, Search, Calendar as CalendarIcon, MapPin, Users, Star, PlayCircle, Building2, Code, Music, Presentation } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: 'Tech', icon: <Code size={20} />, color: 'from-blue-500 to-cyan-400' },
    { name: 'Business', icon: <Building2 size={20} />, color: 'from-[#FF6B00] to-[#FF8C42]' },
    { name: 'Music', icon: <Music size={20} />, color: 'from-purple-500 to-pink-500' },
    { name: 'Workshops', icon: <Presentation size={20} />, color: 'from-green-500 to-emerald-400' },
  ];

  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Product Manager', text: 'EVNT completely transformed how we organize our annual tech summit. The ticketing process is flawless.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
    { name: 'Michael Chen', role: 'Event Producer', text: 'The analytics and attendee management dashboard is the best Ive seen in the industry. Highly recommended.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
    { name: 'Priya Patel', role: 'Startup Founder', text: 'We sold out our networking event in 48 hours. The platform feels incredibly premium and trustworthy.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' }
  ];

  return (
    <div className="w-full flex flex-col items-center overflow-hidden bg-[#050505]">
      
      {/* 1. HERO SECTION WITH FLOATING PARTICLES AND COLLAGE */}
      <section className="relative w-full min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#FF6B00]/20 rounded-full blur-[150px] mix-blend-screen" />
          <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text & Search */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121212] border border-[#1E1E1E] w-max mb-8 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
              <span className="text-sm font-bold text-[#A0A0A0]">Over 1,200+ events live right now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] text-white">
              Discover & Book <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C42] to-yellow-500">
                Extraordinary Events
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#A0A0A0] mb-10 max-w-xl font-medium leading-relaxed">
              Experience the world's best tech conferences, music festivals, and professional networking meetups. Secure your spot at exclusive gatherings.
            </p>

            {/* Hero Search */}
            <form onSubmit={handleSearch} className="relative w-full max-w-xl mb-10 group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-[#121212] border border-[#1E1E1E] rounded-2xl p-2 shadow-2xl gap-2">
                <div className="flex flex-1 items-center px-2">
                  <Search className="text-[#A0A0A0] shrink-0" size={24} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, cities..."
                    className="w-full bg-transparent border-none text-white px-3 py-3 focus:outline-none placeholder-[#555] font-medium text-base sm:text-lg"
                  />
                </div>
                <button type="submit" className="bg-[#FF6B00] hover:bg-[#e66000] text-white px-8 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto">
                  Search
                </button>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm font-bold text-[#555] uppercase tracking-wider">Quick browse:</span>
              {categories.map((cat, i) => (
                <Link key={i} href={`/events?category=${cat.name}`} className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF6B00] px-4 py-2 rounded-lg transition-colors group">
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${cat.color} group-hover:scale-110 transition-transform`}>{cat.icon}</span>
                  <span className="text-sm font-bold text-white">{cat.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Right: Premium Collage */}
          <motion.div style={{ y: y1 }} className="hidden lg:grid grid-cols-2 gap-4 relative h-[600px] perspective-1000">
            <div className="space-y-4 pt-12">
              <motion.img initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="Conference" className="w-full h-64 object-cover rounded-3xl border border-[#1E1E1E] shadow-2xl" />
              <motion.img initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&q=80" alt="Networking" className="w-full h-48 object-cover rounded-3xl border border-[#1E1E1E] shadow-2xl" />
            </div>
            <div className="space-y-4">
              <motion.img initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" alt="Concert" className="w-full h-48 object-cover rounded-3xl border border-[#1E1E1E] shadow-2xl" />
              <motion.img initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80" alt="Workshop" className="w-full h-64 object-cover rounded-3xl border border-[#1E1E1E] shadow-2xl" />
            </div>
            
            {/* Floating UI Elements */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050505]/80 backdrop-blur-xl border border-[#FF6B00]/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(255,107,0,0.3)] flex items-center gap-4 z-20">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-full flex items-center justify-center">
                <CalendarIcon size={24} color="white" />
              </div>
              <div>
                <p className="text-white font-black text-lg leading-tight">Sold Out</p>
                <p className="text-[#FF6B00] text-xs font-bold uppercase">Tech Summit 2026</p>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* 2. SPONSORS / PARTNERS SECTION */}
      <section className="w-full border-y border-[#1E1E1E] bg-[#0A0A0A] py-10 relative z-10 overflow-hidden flex flex-col items-center">
        <p className="text-[#555] text-sm font-bold uppercase tracking-widest mb-6">Trusted by innovative companies worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-black text-white flex items-center gap-2"><div className="w-6 h-6 bg-white rounded-md"/> ACME Corp</div>
          <div className="text-2xl font-black text-white flex items-center gap-2"><div className="w-6 h-6 rounded-full border-4 border-white"/> Globex</div>
          <div className="text-2xl font-black text-white flex items-center gap-2"><div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-white"/> Apex</div>
          <div className="text-2xl font-black text-white italic">Initech</div>
          <div className="text-2xl font-black text-white">Soylent</div>
        </div>
      </section>

      {/* 3. LIVE STATISTICS */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Events Hosted', value: '1,200+' },
            { label: 'Tickets Sold', value: '150K+' },
            { label: 'Cities Covered', value: '85+' }
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 text-center border-t-4 border-t-[#FF6B00]">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED EVENTS CAROUSEL (Trending) */}
      <section className="w-full py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Trending Now.</h2>
            <p className="text-[#A0A0A0] text-lg font-medium">The most anticipated premium events this month.</p>
          </div>
          <Link href="/events" className="hidden md:flex items-center gap-2 text-[#FF6B00] font-bold hover:text-white transition-colors">
            View All Trending <ArrowRight size={20} />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="h-96 glass-card animate-pulse" />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="glass-card p-12 text-center text-[#A0A0A0]">No featured events currently available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((event, i) => (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/events/${event.id}`} className="block glass-card overflow-hidden group h-[480px] flex flex-col border border-[#1E1E1E] hover:border-[#FF6B00]/50 transition-colors">
                    <div className="relative h-64 overflow-hidden bg-[#1A1A1A]">
                      <img 
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                        alt={event.title} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90" />
                      <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white border border-white/20">
                        {event.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col relative bg-[#121212] -mt-10">
                      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3 inline-flex flex-col items-center justify-center w-16 shadow-2xl mb-4 group-hover:border-[#FF6B00] transition-colors z-10">
                        <span className="text-[#FF6B00] text-xs font-bold uppercase">{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-white text-xl font-black">{new Date(event.startDate).getDate()}</span>
                      </div>
                      
                      <h3 className="text-2xl font-black mb-2 group-hover:text-[#FF6B00] transition-colors line-clamp-1">{event.title}</h3>
                      <p className="text-[#A0A0A0] text-sm line-clamp-2 mb-4 flex-1">{event.description}</p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-[#1E1E1E]">
                        <span className="text-2xl font-black text-white">
                          {event.price === 0 ? 'Free' : <span className="text-[#FF6B00]">₹{event.price.toLocaleString('en-IN')}</span>}
                        </span>
                        <span className="text-sm font-bold bg-[#1E1E1E] px-3 py-1.5 rounded-lg text-[#A0A0A0] flex items-center gap-2">
                          <Users size={16} /> {event.availableSlots} left
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. UPCOMING EVENTS (List View) */}
      <section className="w-full bg-[#0A0A0A] py-24 relative z-10 border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-black mb-3 text-white">Upcoming Events.</h2>
            <p className="text-[#A0A0A0] text-lg font-medium">Mark your calendars for these exciting experiences.</p>
          </div>

          <div className="space-y-4">
            {allEvents.slice(0, 5).map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/events/${event.id}`} className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-[#FF6B00]/50 transition-colors">
                  <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-[#1A1A1A] shrink-0">
                    <img src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#FF6B00] font-bold text-sm uppercase">{event.category}</span>
                      <span className="text-[#555]">•</span>
                      <span className="text-[#A0A0A0] text-sm flex items-center gap-1"><CalendarIcon size={14}/> {new Date(event.startDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-[#FF6B00] transition-colors mb-2">{event.title}</h3>
                    <p className="text-[#A0A0A0] text-sm line-clamp-1">{event.location}</p>
                  </div>
                  <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-[#1E1E1E] pt-4 md:pt-0 md:pl-6">
                    <div className="text-2xl font-black text-white">
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </div>
                    <button className="btn-secondary py-2 px-6 rounded-lg text-sm group-hover:bg-[#FF6B00] group-hover:border-[#FF6B00] group-hover:text-white transition-all">
                      Get Tickets
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/events" className="inline-flex items-center gap-2 text-white font-bold bg-[#1A1A1A] hover:bg-[#2A2A2A] border border-[#333] px-8 py-4 rounded-xl transition-all">
              View Entire Directory <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="w-full py-24 relative z-10 overflow-hidden bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Loved by Creators.</h2>
          <p className="text-[#A0A0A0] text-lg font-medium max-w-2xl mx-auto">Don't just take our word for it. Here's what event organizers and attendees have to say.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-8 border border-[#1E1E1E] relative">
              <div className="text-[#FF6B00] mb-6 flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#FF6B00" />)}
              </div>
              <p className="text-white text-lg font-medium leading-relaxed mb-8">"{test.text}"</p>
              <div className="flex items-center gap-4">
                <img src={test.avatar} alt={test.name} className="w-14 h-14 rounded-full border-2 border-[#2A2A2A]" />
                <div>
                  <h4 className="font-bold text-white">{test.name}</h4>
                  <p className="text-[#A0A0A0] text-sm">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="w-full max-w-5xl mx-auto px-4 py-24 relative z-10">
        <div className="glass-card p-12 md:p-20 text-center border border-[#FF6B00]/30 relative overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/20 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6">Ready to host your own event?</h2>
            <p className="text-xl text-[#A0A0A0] mb-10 max-w-2xl mx-auto font-medium">Join thousands of creators who trust EVNT to manage their ticketing, analytics, and check-ins seamlessly.</p>
            <Link href="/signup" className="btn-primary text-xl px-10 py-5 rounded-2xl shadow-[0_0_40px_rgba(255,107,0,0.4)]">
              Create Organizer Account
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#050505] border-t border-[#1E1E1E] py-16 text-center">
        <h2 className="text-3xl font-black tracking-tight text-white mb-6">EVNT<span className="text-[#FF6B00]">.</span></h2>
        <p className="text-[#A0A0A0] max-w-md mx-auto mb-8 font-medium">The premium platform for creators, artists, and professionals to host world-class events.</p>
        <div className="flex justify-center gap-8 mb-12">
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-bold text-sm uppercase tracking-wider">Twitter</Link>
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-bold text-sm uppercase tracking-wider">LinkedIn</Link>
          <Link href="#" className="text-[#A0A0A0] hover:text-[#FF6B00] transition-colors font-bold text-sm uppercase tracking-wider">Instagram</Link>
        </div>
        <p className="text-[#555] text-sm font-medium">© 2026 EVNT Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
