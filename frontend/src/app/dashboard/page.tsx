'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { BarChart3, Calendar, Users, IndianRupee, Plus, Edit3, Trash2, CheckSquare, Settings, Check, Loader, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'bookings' | 'checkin' | 'payment'>('overview');
  
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showEventModal, setShowEventModal] = useState(false);
  const [ticketCodeInput, setTicketCodeInput] = useState('');
  const [checkinSuccess, setCheckinSuccess] = useState<any>(null);
  const [checkinError, setCheckinError] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session || !session.roles.includes('ROLE_ADMIN')) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.get('/analytics/dashboard');
      setStats(statsData);
      const eventsData = await api.get('/events');
      setEvents(eventsData);
      const bookingsData = await api.get('/bookings');
      setBookings(bookingsData);
      const usersData = await api.get('/auth/users');
      setUsers(usersData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinSuccess(null);
    setCheckinError(null);
    try {
      const data = await api.post(`/tickets/verify?ticketCode=${ticketCodeInput.trim()}`);
      setCheckinSuccess(data);
      setTicketCodeInput('');
      await loadData();
    } catch (err: any) {
      setCheckinError(err.message || 'Verification failed. Code is invalid or already used.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="spin text-[#FF6B00]" /></div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-white">Console<span className="text-[#FF6B00]">.</span></h1>
          <p className="text-[#A0A0A0] font-medium">Manage events, track revenue, and scan tickets.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Event
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
        {[
          { id: 'overview', label: 'Metrics', icon: <BarChart3 size={16} /> },
          { id: 'events', label: 'Events', icon: <Calendar size={16} /> },
          { id: 'bookings', label: 'Bookings', icon: <CheckSquare size={16} /> },
          { id: 'checkin', label: 'Scanner', icon: <Check size={16} /> },
          { id: 'payment', label: 'Settings', icon: <Settings size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 whitespace-nowrap px-6 py-3 rounded-xl font-bold transition-all ${activeTab === tab.id ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-[#121212] border border-[#1E1E1E] text-[#A0A0A0] hover:text-white hover:border-[#FF6B00]'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && stats && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: <IndianRupee size={24} className="text-[#FF6B00]" /> },
                { label: 'Bookings', value: stats.totalBookings, icon: <CheckSquare size={24} className="text-[#FF6B00]" /> },
                { label: 'Events', value: stats.totalEvents, icon: <Calendar size={24} className="text-[#FF6B00]" /> },
                { label: 'Users', value: stats.totalUsers, icon: <Users size={24} className="text-[#FF6B00]" /> }
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 border border-[#1E1E1E]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center border border-[#FF6B00]/20">
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                  <p className="text-[#A0A0A0] font-bold text-sm uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 border border-[#1E1E1E]">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><ArrowUpRight className="text-[#FF6B00]" /> Monthly Revenue</h3>
              <div className="space-y-4">
                {stats.monthlyRevenue && Object.entries(stats.monthlyRevenue).map(([month, val]: any) => (
                  <div key={month} className="flex justify-between items-center bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E1E]">
                    <span className="text-[#A0A0A0] font-bold">{month}</span>
                    <span className="font-black text-[#FF6B00]">₹{val.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card overflow-hidden border border-[#1E1E1E]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A] border-b border-[#1E1E1E]">
                    <th className="p-4 font-bold text-[#A0A0A0] uppercase text-xs tracking-wider">Event</th>
                    <th className="p-4 font-bold text-[#A0A0A0] uppercase text-xs tracking-wider">Category</th>
                    <th className="p-4 font-bold text-[#A0A0A0] uppercase text-xs tracking-wider">Price</th>
                    <th className="p-4 font-bold text-[#A0A0A0] uppercase text-xs tracking-wider">Status</th>
                    <th className="p-4 font-bold text-[#A0A0A0] uppercase text-xs tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E1E1E]">
                  {events.map(evt => (
                    <tr key={evt.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                      <td className="p-4 font-bold text-white">{evt.title}</td>
                      <td className="p-4 text-[#A0A0A0]">{evt.category}</td>
                      <td className="p-4 font-bold text-[#FF6B00]">₹{evt.price.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${evt.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                          {evt.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-[#A0A0A0] hover:text-white p-2"><Edit3 size={18} /></button>
                        <button className="text-[#A0A0A0] hover:text-red-500 p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'checkin' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md mx-auto">
            <div className="glass-card p-8 border border-[#1E1E1E] text-center">
              <div className="w-20 h-20 bg-[#FF6B00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF6B00]/30">
                <ShieldAlert size={32} className="text-[#FF6B00]" />
              </div>
              <h2 className="text-2xl font-black mb-2 text-white">Ticket Scanner</h2>
              <p className="text-[#A0A0A0] mb-8 font-medium">Enter or scan the 16-character alphanumeric ticket code to admit a guest.</p>
              
              <form onSubmit={handleTicketCheckIn} className="space-y-4">
                <input 
                  type="text" 
                  value={ticketCodeInput} 
                  onChange={e => setTicketCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. A1B2-C3D4-E5F6"
                  className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-center text-xl font-mono text-white focus:border-[#FF6B00] outline-none transition-colors"
                />
                <button type="submit" className="btn-primary w-full py-4 text-lg">Verify Ticket</button>
              </form>

              {checkinSuccess && (
                <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <Check size={32} className="text-green-500 mx-auto mb-2" />
                  <h3 className="text-green-500 font-black text-xl mb-1">Valid Ticket</h3>
                  <p className="text-white font-bold">{checkinSuccess.eventTitle}</p>
                  <p className="text-[#A0A0A0] text-sm">Pass verified successfully.</p>
                </div>
              )}

              {checkinError && (
                <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-500 font-bold">
                  {checkinError}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
