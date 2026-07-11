'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '../../../utils/api';
import { 
  ArrowLeft, Bell, Settings, Check, Trash2, 
  Info, Star, Calendar, MessageSquare, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

// Custom Toggle Switch Component
const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#FFD400]' : 'bg-gray-200'
      }`}
    >
      <motion.div
        layout
        className="bg-white w-3.5 h-3.5 rounded-full shadow-sm"
        animate={{ x: checked ? 18 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
};

export default function NotificationsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  // Settings states
  const [settingsToggles, setSettingsToggles] = useState({
    bookingUpdates: true,
    eventReminders: true,
    announcements: true,
    promoOffers: false,
    publicProfile: false,
  });

  // Mock Notification List
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Ticket Reservation Confirmed', desc: 'Your ticket order for International Developer Summit is confirmed.', time: '1 hour ago', read: false, type: 'booking' },
    { id: '2', title: 'Pre-Event Schedule Reminder', desc: 'Tech Expo starts in 24 hours. Keep your digital entry pass ready.', time: '5 hours ago', read: false, type: 'reminder' },
    { id: '3', title: 'Payment Invoice Settled', desc: 'Invoiced payment for Order #EV-82937 has processed successfully.', time: '1 day ago', read: true, type: 'payment' },
    { id: '4', title: 'Flash Price Drop Alert', desc: 'Tickets to Jazz Night Gala have dropped by 10%. Book yours now.', time: '3 days ago', read: true, type: 'promo' },
    { id: '5', title: 'Wishlist Availability Update', desc: 'An event on your wishlist "Startup Pitch Contest" is running low on slots.', time: '4 days ago', read: true, type: 'wishlist' }
  ]);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'booking':
        return <Check className="text-green-600" size={15} />;
      case 'reminder':
        return <Calendar className="text-blue-500" size={15} />;
      case 'payment':
        return <Info className="text-purple-500" size={15} />;
      case 'promo':
        return <Star className="text-orange-500" size={15} />;
      case 'wishlist':
        return <Bell className="text-red-500" size={15} />;
      default:
        return <MessageSquare className="text-gray-500" size={15} />;
    }
  };

  const getBgForType = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-green-50 border-green-100';
      case 'reminder': return 'bg-blue-50 border-blue-100';
      case 'payment': return 'bg-purple-50 border-purple-100';
      case 'promo': return 'bg-orange-50 border-orange-100';
      case 'wishlist': return 'bg-red-50 border-red-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />

      <div className="relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
                <span>Alerts &</span>
                <span className="text-[#EAB308]">Notifications</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Manage live system alerts and configurations</p>
            </div>
            
            {notifications.some(n => !n.read) && (
              <button 
                onClick={markAllRead}
                className="bg-yellow-50 hover:bg-yellow-100 border border-yellow-250 text-[#FFD400] font-black text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Alert Feeds */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                <Bell className="text-[#EAB308]" size={16} />
                <span>All Notifications ({notifications.length})</span>
              </h2>

              {notifications.length === 0 ? (
                <div className="text-center py-16">
                  <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-400 font-bold">No active notification messages.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {notifications.map(n => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        key={n.id} 
                        className={`border rounded-2xl p-4.5 transition-all shadow-3xs flex items-start justify-between gap-4 ${
                          n.read ? 'bg-white border-gray-200' : 'bg-yellow-50/5 border-yellow-200/50'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Alert Icon Box */}
                          <div className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-3xs ${getBgForType(n.type)}`}>
                            {getIconForType(n.type)}
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-extrabold text-xs text-gray-900">{n.title}</h4>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
                              )}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-relaxed">{n.desc}</p>
                            <span className="text-[8px] text-gray-400 font-black mt-2 block uppercase tracking-wider">{n.time}</span>
                          </div>
                        </div>

                        {/* Interactive operations */}
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => toggleReadStatus(n.id)}
                            className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                            title={n.read ? "Mark as unread" : "Mark as read"}
                          >
                            <Check size={14} className={n.read ? "text-gray-400" : "text-green-600"} />
                          </button>
                          <button 
                            onClick={() => deleteNotification(n.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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

          {/* RIGHT SIDE: Alert Settings */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-5">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Settings className="text-[#EAB308]" size={16} />
                <span>Alert Configurations</span>
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'bookingUpdates', title: 'Booking Alerts', desc: 'Instantly notify on tickets confirmed.' },
                  { key: 'eventReminders', title: 'Event Reminders', desc: 'Receive agenda notifications 24 hours prior.' },
                  { key: 'announcements', title: 'System Notifications', desc: 'Platform announcements & server logs.' },
                  { key: 'promoOffers', title: 'Price Drop Alerts', desc: 'Get updates on discounts or flash rates.' }
                ].map(item => (
                  <div key={item.key} className="flex justify-between items-center py-2.5 border-b border-gray-150/40 last:border-b-0">
                    <div className="pr-4">
                      <h4 className="font-extrabold text-xs text-gray-900">{item.title}</h4>
                      <p className="text-[9px] text-gray-400 font-semibold mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                    <ToggleSwitch 
                      checked={(settingsToggles as any)[item.key]} 
                      onChange={v => setSettingsToggles(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
