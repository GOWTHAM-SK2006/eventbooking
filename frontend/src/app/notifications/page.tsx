'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Bell, Loader, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Notification } from '../../types';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getSession()) { router.push('/login'); return; }
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const markRead = async (id: string) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unread = notifications.filter(n => !n.read).length;

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black">Notifications</h1>
          {unread > 0 && <p className="text-[#6B7280]">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn-secondary py-2 px-4 text-sm flex items-center gap-2">
            <Check size={16} /> Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="premium-card p-16 text-center">
          <Bell size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-[#6B7280]">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => !n.read && markRead(n.id)}
              className={`premium-card p-5 cursor-pointer transition-all ${!n.read ? 'border-l-4 border-l-[#FACC15] bg-yellow-50/30' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#111827]">{n.title}</h3>
                  <p className="text-[#6B7280] text-sm mt-1">{n.message}</p>
                  <p className="text-xs text-[#9CA3AF] mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && <span className="w-2 h-2 bg-[#FACC15] rounded-full flex-shrink-0 mt-2" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
