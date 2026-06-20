'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { TrendingUp, Award, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/events')
      ]);
      setStats(s);
      setEvents(e);
    } catch (e) {
      console.error(e);
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

  // Calculate most popular event
  const sortedByPopularity = [...events].sort((a, b) => {
    const soldA = a.capacity - a.availableSlots;
    const soldB = b.capacity - b.availableSlots;
    return soldB - soldA;
  });

  const popularEvent = sortedByPopularity[0];

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Deep analysis, daily registration metrics, and revenue charts</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center text-yellow-600 shrink-0">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gross Bookings Revenue</p>
            <p className="text-2xl font-black text-gray-900 mt-1">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Most Popular Event</p>
            <p className="text-sm font-extrabold text-gray-900 mt-1 truncate max-w-[200px]">{popularEvent?.title || 'None'}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{popularEvent ? `${popularEvent.capacity - popularEvent.availableSlots} tickets sold` : ''}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average Capacity Filled</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {events.length > 0 
                ? `${Math.round(events.reduce((acc, ev) => acc + ((ev.capacity - ev.availableSlots) / (ev.capacity || 1) * 100), 0) / events.length)}%` 
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Revenue Progress Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-gray-900">Revenue Progression</h2>
          <div className="h-56 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 140 Q 50 120 100 130 T 200 90 L 300 40 L 300 150 L 0 150 Z" fill="url(#revGrad)" />
              <motion.path 
                d="M 0 140 Q 50 120 100 130 T 200 90 L 300 40" 
                fill="none" 
                stroke="#EAB308" 
                strokeWidth="3.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              <circle cx="100" cy="130" r="4" fill="#EAB308" stroke="white" strokeWidth="1.5" />
              <circle cx="200" cy="90" r="4" fill="#EAB308" stroke="white" strokeWidth="1.5" />
              <circle cx="300" cy="40" r="4" fill="#EAB308" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
            <span>Jan - Mar</span>
            <span>Apr - Jun</span>
            <span>Jul - Sep</span>
            <span>Oct - Dec</span>
          </div>
        </div>

        {/* Daily Registrations Bar Chart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-gray-900">Daily Registrations</h2>
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
            {[35, 60, 45, 90, 75, 110, 85].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="text-[10px] font-bold text-gray-400">{val}</div>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val / 1.2}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                  className="w-full bg-yellow-400 rounded-t-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-gray-400 mt-2 px-4">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

      </div>

      {/* Detailed Event Performance Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-lg font-black text-gray-900">Event Performance Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50 text-gray-400 font-semibold"><th className="text-left py-3 px-4">Event Name</th><th className="text-left py-3 px-4">Category</th><th className="text-right py-3 px-4">Tickets Sold</th><th className="text-right py-3 px-4">Capacity</th><th className="text-right py-3 px-4">Occupancy Ratio</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedByPopularity.map(ev => {
                const sold = ev.capacity - ev.availableSlots;
                const ratio = ev.capacity > 0 ? Math.round((sold / ev.capacity) * 100) : 0;
                return (
                  <tr key={ev.id} className="hover:bg-gray-50/10">
                    <td className="py-3.5 px-4 font-bold text-gray-950 max-w-[250px] truncate">{ev.title}</td>
                    <td className="py-3.5 px-4"><span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{ev.category}</span></td>
                    <td className="py-3.5 px-4 text-right text-gray-500 font-bold">{sold}</td>
                    <td className="py-3.5 px-4 text-right text-gray-400 font-medium">{ev.capacity}</td>
                    <td className="py-3.5 px-4 text-right font-black text-gray-900">{ratio}%</td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No events analysis data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
