'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Calendar, Users, IndianRupee, BarChart3, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e, b, u] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/events'),
        api.get('/bookings'),
        api.get('/auth/users'),
      ]);
      setStats(s);
      setEvents(e);
      setBookings(b);
      setUsers(u);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate upcoming events
  const upcomingEvents = events
    .filter(ev => new Date(ev.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 font-semibold mt-1">Platform overview and performance metrics</p>
        </div>
        <Link 
          href="/admin/events/create" 
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={16} /> Create Event
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: stats?.totalEvents || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50 border-blue-100' },
          { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: Users, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-yellow-600 bg-yellow-50 border-yellow-100' },
          { label: 'Active Users', value: users.filter(u => !u.blocked).length, icon: BarChart3, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${s.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Left Column (Events/Bookings) & Right Column (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-gray-900 mb-4">Upcoming Events</h2>
            <div className="divide-y divide-gray-100">
              {upcomingEvents.map((ev, idx) => (
                <div key={idx} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <span className="bg-gray-100 text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{ev.category}</span>
                    <h4 className="font-extrabold text-gray-900 mt-1 truncate">{ev.title}</h4>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">{new Date(ev.startDate).toLocaleDateString()} · {ev.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gray-900 text-sm">{ev.price === 0 ? 'Free' : `₹${ev.price}`}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{ev.availableSlots}/{ev.capacity} slots left</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm font-medium text-gray-400 py-4 text-center">No upcoming events scheduled.</p>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-black text-gray-900">Recent Bookings</h2>
              <Link href="/admin/bookings" className="text-xs font-bold text-yellow-600 hover:text-yellow-700 flex items-center gap-0.5">
                View All <ArrowUpRight size={14} />
              </Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-gray-400 font-semibold"><th className="text-left py-3">User</th><th className="text-left py-3">Event</th><th className="text-left py-3">Quantity</th><th className="text-right py-3">Amount</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.slice(0, 5).map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="py-3 text-gray-900 font-bold">{b.userEmail}</td>
                    <td className="py-3 text-gray-600 max-w-[150px] truncate">{b.eventTitle}</td>
                    <td className="py-3 text-gray-500 font-bold">{b.quantity}</td>
                    <td className="py-3 text-right text-gray-900 font-black">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-8">
          
          {/* Revenue Analytics Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-yellow-500" size={18} />
              <h2 className="text-lg font-black text-gray-900">Revenue Analytics</h2>
            </div>
            <div className="h-44 w-full flex items-end">
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <defs>
                  <linearGradient id="revGradDash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 140 Q 60 110 120 120 T 240 70 L 300 30 L 300 150 L 0 150 Z" fill="url(#revGradDash)" />
                <motion.path 
                  d="M 0 140 Q 60 110 120 120 T 240 70 L 300 30" 
                  fill="none" 
                  stroke="#EAB308" 
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2 }}
                />
                <circle cx="120" cy="120" r="3.5" fill="#EAB308" stroke="white" strokeWidth="1" />
                <circle cx="240" cy="70" r="3.5" fill="#EAB308" stroke="white" strokeWidth="1" />
                <circle cx="300" cy="30" r="3.5" fill="#EAB308" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 mt-2">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          {/* Event Performance Chart */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-black text-gray-900 mb-4">Event Performance</h2>
            <div className="space-y-4">
              {events.slice(0, 4).map((ev, i) => {
                const sold = ev.capacity - ev.availableSlots;
                const ratio = ev.capacity > 0 ? Math.round((sold / ev.capacity) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-600">
                      <span className="truncate max-w-[160px]">{ev.title}</span>
                      <span>{ratio}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full rounded-full" 
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {events.length === 0 && (
                <p className="text-xs font-semibold text-gray-400 py-4 text-center">No performance data.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
