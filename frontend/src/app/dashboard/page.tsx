'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { BarChart3, Calendar, Users, IndianRupee, Plus, Edit3, Trash2, CheckSquare, Settings, Check, Loader, ShieldAlert, ArrowUpRight, TrendingUp } from 'lucide-react';
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'bookings', label: 'Bookings', icon: <Users size={18} /> },
    { id: 'checkin', label: 'Check-in', icon: <CheckSquare size={18} /> },
    { id: 'payment', label: 'Revenue', icon: <IndianRupee size={18} /> },
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

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
        <Loader size={40} className="text-[#FACC15]" />
      </motion.div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 text-[#111827]">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Console</span>
          </h1>
          <p className="text-[#6B7280] font-medium">Manage events, track revenue, and scan tickets.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus size={20} /> New Event
        </motion.button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar"
      >
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#FACC15] text-[#111827] shadow-md'
                : 'bg-white border border-gray-300 text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Overview Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {[
                { label: 'Total Events', value: stats?.totalEvents || 0, icon: <Calendar size={24} />, color: 'from-[#FACC15] to-yellow-400' },
                { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: <Users size={24} />, color: 'from-blue-400 to-blue-500' },
                { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <IndianRupee size={24} />, color: 'from-green-400 to-green-500' },
                { label: 'Active Users', value: users.length, icon: <TrendingUp size={24} />, color: 'from-purple-400 to-purple-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#6B7280] font-bold text-sm uppercase tracking-wider">{stat.label}</h3>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-3xl font-black text-[#111827]"
                  >
                    {stat.value}
                  </motion.p>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="bg-white border border-gray-200 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-black text-[#111827] mb-6">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-bold text-[#6B7280] uppercase tracking-wider text-xs">User</th>
                      <th className="text-left py-3 px-4 font-bold text-[#6B7280] uppercase tracking-wider text-xs">Event</th>
                      <th className="text-left py-3 px-4 font-bold text-[#6B7280] uppercase tracking-wider text-xs">Tickets</th>
                      <th className="text-left py-3 px-4 font-bold text-[#6B7280] uppercase tracking-wider text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking, i) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-[#111827]">{booking.userName || 'N/A'}</td>
                        <td className="py-4 px-4 text-[#6B7280]">{booking.eventName || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-lg text-xs font-bold text-[#FACC15]">
                            {booking.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-[#111827]">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Check-in Tab */}
        {activeTab === 'checkin' && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-black text-[#111827] mb-8">Ticket Check-in</h2>
            
            {checkinSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 flex items-start gap-4"
              >
                <Check className="text-green-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-green-700 mb-1">Check-in Successful!</h3>
                  <p className="text-green-600 text-sm">{checkinSuccess.message || 'Ticket verified successfully'}</p>
                </div>
              </motion.div>
            )}

            {checkinError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 flex items-start gap-4"
              >
                <ShieldAlert className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-red-700 mb-1">Check-in Failed</h3>
                  <p className="text-red-600 text-sm">{checkinError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleTicketCheckIn} className="max-w-md">
              <label className="text-sm font-bold text-[#111827] mb-2 block">Ticket Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ticketCodeInput}
                  onChange={(e) => setTicketCodeInput(e.target.value)}
                  placeholder="Enter ticket code..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-yellow-50 transition-all"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Verify
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
