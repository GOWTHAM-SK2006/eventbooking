'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Bell, Loader, Check, Trash2, MailOpen, Calendar, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../components/AnimatedBackground';
import type { Notification } from '../../types';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sess = getSession();
    if (!sess) { 
      router.push('/login'); 
      return; 
    }
    setSession(sess);
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const markRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative">
      <FloatingBlobs />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 mb-4"
          >
            <Bell size={12} className="text-[#EAB308] animate-swing" />
            <span className="text-[10px] font-black text-[#111827] tracking-wider uppercase">Live System Alerts</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[36px] sm:text-[48px] md:text-[60px] font-black tracking-tight text-[#111827] leading-none"
          >
            Notifications
          </motion.h1>
          {unreadCount > 0 && (
            <p className="text-[#6B7280] font-semibold text-xs mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              <span>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={markAllRead} 
            className="self-start sm:self-center bg-gray-50 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-400 text-gray-900 font-extrabold px-4.5 py-3 rounded-xl text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
          >
            <Check size={14} className="text-[#EAB308]" /> 
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-24 bg-white border border-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white p-12 md:p-16 text-center rounded-3xl border border-gray-200 shadow-md flex flex-col items-center justify-center"
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
            <Bell size={36} className="text-[#EAB308]" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Clear Inbox</h2>
          <p className="text-gray-500 font-medium mb-0">No new announcements or booking updates currently.</p>
        </motion.div>
      ) : (
        /* Notifications List */
        <div className="space-y-3.5">
          <AnimatePresence>
            {notifications.map((n, i) => (
              <motion.div 
                key={n.id} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => !n.read && markRead(n.id)}
                className={`group bg-white border rounded-2xl p-5 cursor-pointer transition-all flex justify-between gap-4 items-start ${
                  !n.read 
                    ? 'border-yellow-400/80 bg-yellow-50/15 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex gap-4 items-start">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 border ${
                    !n.read 
                      ? 'bg-yellow-100/50 border-yellow-200 text-yellow-600' 
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }`}>
                    {!n.read ? <Bell size={16} /> : <MailOpen size={16} />}
                  </div>

                  <div className="space-y-1">
                    <h3 className={`text-base font-extrabold text-gray-900 ${!n.read ? 'font-black' : ''}`}>{n.title}</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-1.5 pt-1.5 text-[10px] font-bold text-gray-400">
                      <Calendar size={11} />
                      <span>{new Date(n.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-center">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
                  )}
                  <button 
                    onClick={(e) => deleteNotification(n.id, e)} 
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Delete alert"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      </div>
    </div>
  );
}
