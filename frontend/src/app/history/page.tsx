'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Download, Loader, Ticket, Calendar, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings/user-bookings');
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
      transition: { duration: 0.5 },
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
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-2">
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FACC15] to-[#EAB308]">Tickets</span>
        </h1>
        <p className="text-[#6B7280] font-medium">View and download your event tickets.</p>
      </motion.div>

      {/* Tickets List */}
      {bookings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Ticket size={32} className="text-[#9CA3AF]" />
          </motion.div>
          <h3 className="text-2xl font-bold text-[#111827] mb-2">No tickets yet</h3>
          <p className="text-[#6B7280] font-medium">Book an event to get started!</p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-[#FACC15] transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3">
                    {booking.eventName}
                  </h3>
                  <div className="space-y-2 text-sm md:text-base">
                    <div className="flex items-center gap-3 text-[#6B7280]">
                      <Calendar size={16} className="flex-shrink-0" />
                      <span>{new Date(booking.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#6B7280]">
                      <MapPin size={16} className="flex-shrink-0" />
                      <span>{booking.eventLocation}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#6B7280]">
                      <Ticket size={16} className="flex-shrink-0" />
                      <span className="font-bold">{booking.quantity} ticket{booking.quantity !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 w-full md:w-auto">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider block mb-1">Total Paid</span>
                    <span className="text-2xl md:text-3xl font-black text-[#FACC15]">
                      ₹{(booking.totalPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 md:flex-none bg-[#FACC15] hover:bg-[#EAB308] text-[#111827] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm"
                    >
                      <Download size={16} /> Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 md:flex-none bg-white border border-gray-300 hover:border-[#FACC15] text-[#111827] font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink size={16} /> View
                    </motion.button>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-6 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-left"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {booking.tickets && booking.tickets.map((ticket: any, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-lg text-xs font-bold text-[#FACC15]"
                  >
                    Ticket #{ticket.code || i + 1}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
