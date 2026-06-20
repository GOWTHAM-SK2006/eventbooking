'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { 
  BarChart3, Calendar, Users, IndianRupee, Plus, Edit3, Trash2, 
  CheckSquare, Loader, X, FileSpreadsheet, CreditCard, Bell, 
  TrendingUp, Shield, ShieldAlert, Ban, RefreshCw, Mail, 
  Settings, Check, Download, Info, Search, Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Event, Booking, DashboardStats } from '../../types';

const emptyEvent = {
  title: '', description: '', location: '', category: 'Tech',
  startDate: '', endDate: '', price: 0, capacity: 100, imageUrl: '',
  status: 'PUBLISHED', venueName: '', venueAddress: '', featured: false,
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  
  // Filtering & Search
  const [eventSearch, setEventSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [userSearch, setUserSearch] = useState('');
  
  // Loading & Modals
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showUserHistoryModal, setShowUserHistoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventForm, setEventForm] = useState<any>(emptyEvent);
  
  // Razorpay settings
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
  const [paymentMode, setPaymentMode] = useState('test');
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Notification form
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  
  const [reminderEventId, setReminderEventId] = useState('');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);

  // Email Notification template
  const [emailSubject, setEmailSubject] = useState('Important Update - EventBooking');
  const [emailTemplate, setEmailTemplate] = useState('Hello [User],\n\nWe would like to inform you about...');

  // QR Checkin state
  const [ticketCode, setTicketCode] = useState('');
  const [checkinResult, setCheckinResult] = useState<any>(null);
  const [checkinError, setCheckinError] = useState('');
  const [verifyingCheckin, setVerifyingCheckin] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    if (!session.roles?.includes('ROLE_ADMIN')) { router.push('/'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e, b, u, p, r] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/events'),
        api.get('/bookings'),
        api.get('/auth/users'),
        api.get('/payments').catch(() => []),
        api.get('/payments/refunds/all').catch(() => []),
      ]);
      setStats(s); 
      setEvents(e); 
      setBookings(b); 
      setUsers(u); 
      setPayments(p);
      setRefunds(r);

      // Load Razorpay Settings
      try {
        const rSettings = await api.get('/settings/razorpay');
        if (rSettings && rSettings.value) {
          const parsed = JSON.parse(rSettings.value);
          setRazorpayKeyId(parsed.keyId || '');
          setRazorpayKeySecret(parsed.keySecret || '');
          setPaymentMode(parsed.mode || 'test');
        }
      } catch (err) {
        console.log('No existing Razorpay settings key found in database.');
      }
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  // Event handlers
  const openCreateEvent = () => { 
    setEditingEvent(null); 
    setEventForm(emptyEvent); 
    setShowEventModal(true); 
  };
  
  const openEditEvent = (ev: Event) => {
    setEditingEvent(ev);
    setEventForm({
      ...ev,
      startDate: ev.startDate?.slice(0, 16) || '',
      endDate: ev.endDate?.slice(0, 16) || '',
    });
    setShowEventModal(true);
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...eventForm, 
      startDate: new Date(eventForm.startDate).toISOString().slice(0, 19), 
      endDate: new Date(eventForm.endDate).toISOString().slice(0, 19) 
    };
    if (editingEvent) {
      await api.put(`/events/${editingEvent.id}`, payload);
    } else {
      await api.post('/events', payload);
    }
    setShowEventModal(false);
    loadData();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This will remove all associated tickets and bookings.')) return;
    await api.delete(`/events/${id}`);
    loadData();
  };

  // User Actions
  const toggleBlockUser = async (user: any) => {
    try {
      await api.put(`/auth/users/${user.id}/block?blocked=${!user.blocked}`);
      loadData();
    } catch (e) {
      alert('Error updating user block status');
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/users/${id}`);
      loadData();
    } catch (e) {
      alert('Error deleting user');
    }
  };

  const viewUserHistory = (user: any) => {
    setSelectedUser(user);
    const filtered = bookings.filter(b => b.userEmail === user.email);
    setUserBookings(filtered);
    setShowUserHistoryModal(true);
  };

  // Settings Save
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/settings/razorpay', {
        value: JSON.stringify({ keyId: razorpayKeyId, keySecret: razorpayKeySecret, mode: paymentMode })
      });
      alert('Razorpay settings saved successfully to database!');
    } catch (err) {
      alert('Failed to save Razorpay settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Announcement Send
  const sendAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;
    setSendingAnnouncement(true);
    try {
      await api.post('/notifications/announcement', {
        title: announcementTitle,
        message: announcementMessage
      });
      alert('Announcement sent to all registered users!');
      setAnnouncementTitle('');
      setAnnouncementMessage('');
    } catch (e) {
      alert('Error sending announcement');
    } finally {
      setSendingAnnouncement(false);
    }
  };

  // Reminder Send
  const sendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEventId || !reminderTitle.trim() || !reminderMessage.trim()) return;
    setSendingReminder(true);
    try {
      await api.post('/notifications/reminder', {
        eventId: reminderEventId,
        title: reminderTitle,
        message: reminderMessage
      });
      alert('Reminders sent to all attendees of this event!');
      setReminderTitle('');
      setReminderMessage('');
      setReminderEventId('');
    } catch (e) {
      alert('Error sending reminders');
    } finally {
      setSendingReminder(false);
    }
  };

  // Refund actions
  const handleProcessRefund = async (id: string, status: string) => {
    try {
      await api.put(`/payments/refunds/${id}?status=${status}`);
      alert(`Refund has been ${status.toLowerCase()}!`);
      loadData();
    } catch (err) {
      alert('Failed to process refund');
    }
  };

  // Checkin QR Scan action
  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinError(''); 
    setCheckinResult(null);
    if (!ticketCode.trim()) return;
    setVerifyingCheckin(true);
    try {
      const res = await api.post(`/tickets/verify?ticketCode=${ticketCode.trim()}`);
      setCheckinResult(res);
      setTicketCode('');
      loadData();
    } catch (err: any) { 
      setCheckinError(err.message || 'Ticket verification failed'); 
    } finally {
      setVerifyingCheckin(false);
    }
  };

  // CSV Export
  const exportBookings = () => {
    const filtered = bookings.filter(b => {
      const matchesSearch = b.userEmail?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                            b.eventTitle?.toLowerCase().includes(bookingSearch.toLowerCase());
      const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
      return matchesSearch && matchesStatus;
    });

    const headers = ['Booking ID', 'Event Title', 'User Email', 'Quantity', 'Total Price', 'Status', 'Booking Date'];
    const rows = filtered.map((b: any) => [
      b.id,
      b.eventTitle,
      b.userEmail,
      b.quantity,
      b.totalPrice,
      b.status,
      new Date(b.bookingDate || b.createdAt || '').toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPayments = () => {
    const headers = ['Payment ID', 'Event Title', 'Invoice Number', 'Method', 'Amount', 'GST Amount', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.id,
      p.eventTitle || 'N/A',
      p.invoiceNumber || 'N/A',
      p.paymentMethod || 'N/A',
      p.amount,
      p.gstAmount || 0,
      p.status || 'SUCCESS',
      new Date(p.createdAt || '').toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payments_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: <BarChart3 size={18} /> },
    { id: 'events', label: 'Event Management', icon: <Calendar size={18} /> },
    { id: 'bookings', label: 'Booking Management', icon: <FileSpreadsheet size={18} /> },
    { id: 'payments', label: 'Payment Management', icon: <CreditCard size={18} /> },
    { id: 'users', label: 'User Management', icon: <Users size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
  ];

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-3">
      <Loader className="animate-spin text-[#FACC15]" size={48} />
      <span className="text-sm font-bold text-gray-500">Loading admin parameters...</span>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <div className="mb-6 px-2">
          <h1 className="text-2xl font-black tracking-tight">Admin <span className="text-[#FACC15]">Console</span></h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">Platform Control Panel</p>
        </div>
        <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-3 lg:pb-0 hide-scrollbar">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap text-sm ${
                activeTab === t.id 
                  ? 'bg-[#FACC15] text-[#111827] shadow-md shadow-yellow-100' 
                  : 'bg-white border border-gray-200 text-[#6B7280] hover:text-[#111827] hover:border-gray-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Quick QR check-in widget at the bottom of sidebar */}
        <div className="hidden lg:block mt-8 bg-yellow-50/50 border border-yellow-200/60 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={16} className="text-[#EAB308]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#854D0E]">Scan Ticket QR</h4>
          </div>
          <form onSubmit={handleCheckin} className="flex flex-col gap-2">
            <input 
              value={ticketCode} 
              onChange={e => setTicketCode(e.target.value)} 
              placeholder="Enter ticket code..." 
              className="bg-white border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:border-[#FACC15]" 
            />
            <button 
              type="submit" 
              className="bg-[#111827] text-white hover:bg-black font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-1"
              disabled={verifyingCheckin}
            >
              {verifyingCheckin ? <Loader className="animate-spin" size={12} /> : 'Verify'}
            </button>
          </form>
          {checkinResult && <p className="text-[11px] text-green-700 font-bold mt-2">✓ Verified: {checkinResult.ticketCode}</p>}
          {checkinError && <p className="text-[11px] text-red-600 font-bold mt-2">✗ {checkinError}</p>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        {/* DASHBOARD TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Events', value: stats?.totalEvents || 0, icon: <Calendar className="text-[#3B82F6]" size={20} /> },
                { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: <Users className="text-[#10B981]" size={20} /> },
                { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <IndianRupee className="text-[#FACC15]" size={20} /> },
                { label: 'Active Users', value: users.filter(u => !u.blocked).length, icon: <Shield className="text-[#8B5CF6]" size={20} /> },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className="text-2xl sm:text-3xl font-black mt-2 text-[#111827]">{s.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                    {s.icon}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-black text-xl text-[#111827]">Recent Bookings</h2>
                  <p className="text-xs font-medium text-gray-400">Latest transactions and tickets issued</p>
                </div>
                <button onClick={() => setActiveTab('bookings')} className="text-xs font-bold text-[#FACC15] hover:underline">
                  View All Bookings
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold"><th className="text-left py-3">User Email</th><th className="text-left py-3">Event Title</th><th className="text-left py-3">Quantity</th><th className="text-left py-3">Total Amount</th><th className="text-left py-3">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.slice(0, 6).map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="py-4 text-[#111827] font-medium">{b.userEmail}</td>
                      <td className="py-4 text-gray-600 line-clamp-1 max-w-[200px]">{b.eventTitle}</td>
                      <td className="py-4 text-gray-500 font-bold">{b.quantity}</td>
                      <td className="py-4 text-[#111827] font-extrabold">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                      <td className="py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                          b.status === 'CONFIRMED' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No bookings have been made yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVENT MANAGEMENT TAB */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search events by title..." 
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FACC15]"
                />
              </div>
              <button onClick={openCreateEvent} className="bg-[#111827] hover:bg-black text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-sm transition-all">
                <Plus size={18} /> Create Event
              </button>
            </div>

            <div className="grid gap-4">
              {events
                .filter(ev => ev.title.toLowerCase().includes(eventSearch.toLowerCase()))
                .map(ev => (
                  <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-yellow-50 border border-yellow-200 text-[#854D0E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{ev.category}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          ev.status === 'PUBLISHED' 
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : ev.status === 'CANCELLED' 
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}>
                          {ev.status === 'PUBLISHED' ? 'Active' : 'Closed'}
                        </span>
                        {ev.featured && <span className="bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">★ Featured</span>}
                      </div>
                      <h3 className="font-black text-lg mt-2 text-[#111827]">{ev.title}</h3>
                      <p className="text-xs font-semibold text-gray-400 mt-1">
                        Slots: <span className="text-gray-700 font-bold">{ev.availableSlots}</span> / {ev.capacity} · Price: <span className="text-gray-700 font-bold">{ev.price === 0 ? 'Free' : `₹${ev.price}`}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                      <button onClick={() => openEditEvent(ev)} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deleteEvent(ev.id)} className="p-2.5 rounded-xl border border-red-100 hover:bg-red-50 text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

              {events.length === 0 && (
                <div className="text-center bg-white border border-gray-200 rounded-2xl py-12 text-gray-400 font-medium">
                  No events found in PostgreSQL database.
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKING MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
              <div className="flex flex-wrap gap-2">
                {['ALL', 'CONFIRMED', 'CANCELLED'].map(s => (
                  <button
                    key={s}
                    onClick={() => setBookingStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      bookingStatusFilter === s 
                        ? 'bg-[#111827] text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {s === 'ALL' ? 'View All Bookings' : s === 'CONFIRMED' ? 'Approved Bookings' : 'Cancelled Bookings'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Filter by user or event..."
                  value={bookingSearch}
                  onChange={e => setBookingSearch(e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#FACC15] w-full md:w-60"
                />
                <button onClick={exportBookings} className="bg-white border border-gray-200 text-[#111827] font-bold px-4 py-2 rounded-xl text-xs hover:bg-gray-50 flex items-center gap-1.5 shrink-0 shadow-sm">
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold"><th className="text-left p-4">Booking ID</th><th className="text-left p-4">User Email</th><th className="text-left p-4">Event Title</th><th className="text-left p-4">Slots</th><th className="text-left p-4">Status</th><th className="text-left p-4 text-right">Price</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings
                    .filter(b => {
                      const matchesSearch = b.userEmail?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
                                            b.eventTitle?.toLowerCase().includes(bookingSearch.toLowerCase());
                      const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(b => (
                      <tr key={b.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-mono text-xs text-gray-400">{b.id.slice(0, 8)}...</td>
                        <td className="p-4 text-[#111827] font-medium">{b.userEmail}</td>
                        <td className="p-4 text-gray-600">{b.eventTitle}</td>
                        <td className="p-4 text-gray-500 font-bold">{b.quantity}</td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                            b.status === 'CONFIRMED' 
                              ? 'bg-green-50 border-green-200 text-green-700' 
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-[#111827] font-extrabold">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENT MANAGEMENT TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-8">
            {/* Razorpay Settings Block */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="text-[#FACC15]" size={20} />
                <h2 className="font-black text-xl text-[#111827]">Razorpay Settings</h2>
              </div>
              <form onSubmit={saveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Razorpay Key ID</label>
                    <input 
                      value={razorpayKeyId} 
                      onChange={e => setRazorpayKeyId(e.target.value)} 
                      placeholder="rzp_test_..." 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Razorpay Key Secret</label>
                    <input 
                      type="password"
                      value={razorpayKeySecret} 
                      onChange={e => setRazorpayKeySecret(e.target.value)} 
                      placeholder="••••••••••••••••" 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <input 
                        type="radio" 
                        name="paymentMode" 
                        value="test" 
                        checked={paymentMode === 'test'} 
                        onChange={() => setPaymentMode('test')} 
                      />
                      Test Mode
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                      <input 
                        type="radio" 
                        name="paymentMode" 
                        value="live" 
                        checked={paymentMode === 'live'} 
                        onChange={() => setPaymentMode('live')} 
                      />
                      Live Mode
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-[#111827] text-white hover:bg-black font-bold py-2.5 px-6 rounded-xl text-xs transition-all flex items-center gap-1.5"
                    disabled={savingSettings}
                  >
                    {savingSettings ? <Loader className="animate-spin" size={14} /> : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>

            {/* Payment History Block */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-black text-xl text-[#111827]">Payment History</h2>
                  <p className="text-xs font-medium text-gray-400 font-semibold">Incoming gateways and completed invoices</p>
                </div>
                <button onClick={exportPayments} className="bg-white border border-gray-200 text-[#111827] font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1">
                  <Download size={12} /> Export CSV
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold"><th className="text-left py-3">Invoice Number</th><th className="text-left py-3">Event Title</th><th className="text-left py-3">Method</th><th className="text-left py-3 text-right">GST (18%)</th><th className="text-left py-3 text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono text-xs text-[#111827]">{p.invoiceNumber || 'N/A'}</td>
                      <td className="py-3 text-gray-600 line-clamp-1 max-w-[180px]">{p.eventTitle || 'N/A'}</td>
                      <td className="py-3 text-gray-500 font-bold uppercase">{p.paymentMethod || 'Razorpay'}</td>
                      <td className="py-3 text-right text-gray-500 font-medium">₹{(p.gstAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right text-[#111827] font-extrabold">₹{p.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No payment history available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Refund Management Block */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <div className="flex items-center gap-2 mb-6">
                <RefreshCw className="text-red-500" size={18} />
                <h2 className="font-black text-xl text-[#111827]">Refund Management</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold"><th className="text-left py-3">Refund ID</th><th className="text-left py-3">Status</th><th className="text-left py-3">Requested At</th><th className="text-left py-3 text-right">Amount</th><th className="text-right py-3">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {refunds.map(rf => (
                    <tr key={rf.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono text-xs text-gray-400">{rf.id.slice(0, 8)}...</td>
                      <td className="py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                          rf.status === 'COMPLETED' || rf.status === 'APPROVED'
                            ? 'bg-green-50 border-green-200 text-green-700' 
                            : rf.status === 'PENDING'
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                          {rf.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{new Date(rf.createdAt || '').toLocaleString()}</td>
                      <td className="py-3 text-right text-[#111827] font-extrabold">₹{(rf.refundAmount || rf.amount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right">
                        {rf.status === 'PENDING' && (
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleProcessRefund(rf.id, 'APPROVED')}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleProcessRefund(rf.id, 'REJECTED')}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {refunds.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No refund requests pending or completed.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USER MANAGEMENT TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm text-[#111827]">
                <thead>
                  <tr className="border-b text-gray-400 font-semibold"><th className="text-left p-4">User</th><th className="text-left p-4">Email</th><th className="text-left p-4">Role</th><th className="text-left p-4">Status</th><th className="text-right p-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users
                    .filter(u => {
                      const name = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
                      return name.includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
                    })
                    .map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold">{u.firstName} {u.lastName}</td>
                        <td className="p-4 font-medium text-gray-500">{u.email}</td>
                        <td className="p-4">
                          <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                            {u.roles?.join(', ') || 'USER'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.blocked 
                              ? 'bg-red-50 border-red-200 text-red-700' 
                              : 'bg-green-50 border-green-200 text-green-700'
                          }`}>
                            {u.blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end items-center gap-2">
                          <button 
                            onClick={() => viewUserHistory(u)} 
                            className="bg-white border border-gray-200 text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                          >
                            <Info size={12} /> History
                          </button>
                          <button 
                            onClick={() => toggleBlockUser(u)} 
                            className={`p-2 rounded-lg border transition-all ${
                              u.blocked 
                                ? 'border-green-100 hover:bg-green-50 text-green-600' 
                                : 'border-red-100 hover:bg-red-50 text-red-500'
                            }`}
                          >
                            {u.blocked ? <Shield size={14} /> : <ShieldAlert size={14} />}
                          </button>
                          <button 
                            onClick={() => deleteUser(u.id)} 
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all"
                          >
                            <Ban size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Announcement Broadcast */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="text-[#FACC15]" size={20} />
                <h2 className="font-black text-xl text-[#111827]">Send Announcement</h2>
              </div>
              <p className="text-xs font-semibold text-gray-400">Broadcast updates to all platform users instantly</p>
              <form onSubmit={sendAnnouncement} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Announcement Title</label>
                  <input 
                    value={announcementTitle} 
                    onChange={e => setAnnouncementTitle(e.target.value)} 
                    placeholder="e.g. Schedule Update or Maintenance notice" 
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Message Body</label>
                  <textarea 
                    value={announcementMessage} 
                    onChange={e => setAnnouncementMessage(e.target.value)} 
                    placeholder="Type details of your announcement here..." 
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15] h-32 resize-none" 
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#111827] hover:bg-black text-white font-bold py-3 w-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  disabled={sendingAnnouncement}
                >
                  {sendingAnnouncement ? <Loader className="animate-spin" size={14} /> : 'Broadcast Announcement'}
                </button>
              </form>
            </div>

            {/* Event Reminders */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="text-blue-500" size={20} />
                <h2 className="font-black text-xl text-[#111827]">Send Event Reminder</h2>
              </div>
              <p className="text-xs font-semibold text-gray-400">Send direct push notifications & alerts to event ticket holders</p>
              <form onSubmit={sendReminder} className="space-y-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Target Event</label>
                  <select 
                    value={reminderEventId}
                    onChange={e => setReminderEventId(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]"
                    required
                  >
                    <option value="">Select Event...</option>
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Reminder Subject</label>
                  <input 
                    value={reminderTitle} 
                    onChange={e => setReminderTitle(e.target.value)} 
                    placeholder="e.g. Starting in 1 Hour!" 
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Message Content</label>
                  <textarea 
                    value={reminderMessage} 
                    onChange={e => setReminderMessage(e.target.value)} 
                    placeholder="Provide details about the gates opening, QR tickets, location..." 
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15] h-24 resize-none" 
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#111827] hover:bg-black text-white font-bold py-3 w-full rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  disabled={sendingReminder}
                >
                  {sendingReminder ? <Loader className="animate-spin" size={14} /> : 'Send Ticket Holder Reminders'}
                </button>
              </form>
            </div>

            {/* Email Notifications Customizer */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="text-[#8B5CF6]" size={20} />
                <h2 className="font-black text-xl text-[#111827]">Email Notifications Templates</h2>
              </div>
              <p className="text-xs font-semibold text-gray-400">Configure visual mailings triggered on user booking & signups</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Subject Header</label>
                    <input 
                      value={emailSubject}
                      onChange={e => setEmailSubject(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Template Body</label>
                    <textarea 
                      value={emailTemplate}
                      onChange={e => setEmailTemplate(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm font-mono focus:outline-none h-40 resize-none"
                    />
                  </div>
                </div>
                {/* Visual Mail Mockup */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center border-b pb-3 mb-3 text-xs text-gray-400">
                      <span>Preview Email</span>
                      <span className="font-bold text-[#FACC15]">Active template</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-sm space-y-3">
                      <p className="font-extrabold text-[#111827]">Subject: {emailSubject}</p>
                      <p className="text-xs text-gray-500 whitespace-pre-line">{emailTemplate}</p>
                      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-[10px] text-[#854D0E] font-bold">
                        Powered by EventBooking Email Gateway
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Email template saved successfully!')} 
                    className="bg-[#111827] text-white hover:bg-black font-bold py-2 w-full rounded-xl text-xs mt-4"
                  >
                    Save Email Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue line chart */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-lg text-[#111827] mb-1">Revenue Chart</h3>
                <p className="text-xs font-semibold text-gray-400 mb-6">Historical cumulative earnings progression</p>
                <div className="h-64 w-full flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FACC15" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FACC15" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#F3F4F6" strokeWidth="1" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#F3F4F6" strokeWidth="1" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#F3F4F6" strokeWidth="1" />
                    <line x1="0" y1="190" x2="400" y2="190" stroke="#F3F4F6" strokeWidth="1" />
                    
                    {/* Area fill under curve */}
                    <path d="M 0 190 Q 80 150 160 160 T 320 80 L 400 40 L 400 190 Z" fill="url(#revGrad)" />
                    
                    {/* Animated Line */}
                    <motion.path 
                      d="M 0 190 Q 80 150 160 160 T 320 80 L 400 40" 
                      fill="none" 
                      stroke="#FACC15" 
                      strokeWidth="3.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    {/* Dots on coordinate peaks */}
                    <circle cx="160" cy="160" r="4.5" fill="#EAB308" stroke="white" strokeWidth="1.5" />
                    <circle cx="320" cy="80" r="4.5" fill="#EAB308" stroke="white" strokeWidth="1.5" />
                    <circle cx="400" cy="40" r="4.5" fill="#EAB308" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Daily Registrations bar chart */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-lg text-[#111827] mb-1">Daily Registrations</h3>
                <p className="text-xs font-semibold text-gray-400 mb-6">Aggregate reservation frequency spikes</p>
                <div className="h-64 w-full flex items-end justify-between gap-2 px-4 border-b border-gray-100">
                  {[20, 45, 30, 60, 80, 50, 95, 75, 40, 85].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <motion.div 
                        className="w-full bg-[#111827] hover:bg-[#FACC15] rounded-t-lg transition-colors cursor-pointer"
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                      />
                      <span className="text-[9px] font-bold text-gray-400">Day {i+1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Most Popular Event Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-lg text-[#111827] mb-1">Most Popular Event</h3>
                  <p className="text-xs font-semibold text-gray-400 mb-6">Highest aggregate ticketing demand</p>
                </div>
                {events.length > 0 ? (
                  (() => {
                    const topEvent = events.reduce((prev, current) => {
                      const prevBooked = prev.capacity - prev.availableSlots;
                      const currBooked = current.capacity - current.availableSlots;
                      return (currBooked > prevBooked) ? current : prev;
                    }, events[0]);
                    
                    const totalSold = topEvent.capacity - topEvent.availableSlots;
                    const percentSold = Math.round((totalSold / topEvent.capacity) * 100);

                    return (
                      <div className="bg-yellow-50/50 border border-yellow-200/60 rounded-2xl p-5">
                        <span className="bg-[#FACC15] text-[#111827] text-[9px] font-black px-2 py-0.5 rounded uppercase">Leader</span>
                        <h4 className="font-black text-xl text-[#111827] mt-2 line-clamp-1">{topEvent.title}</h4>
                        <p className="text-xs text-gray-500 font-semibold mt-1">Category: {topEvent.category} · Price: {topEvent.price === 0 ? 'Free' : `₹${topEvent.price}`}</p>
                        
                        <div className="mt-6 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-500">Tickets Sold</span>
                            <span className="text-[#111827]">{totalSold} / {topEvent.capacity} ({percentSold}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-[#FACC15] h-full" style={{ width: `${percentSold}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <p className="text-sm font-medium text-gray-400 py-6 text-center">No event data available yet.</p>
                )}
              </div>

              {/* Event Performance grid */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
                <h3 className="font-black text-lg text-[#111827] mb-1">Event Performance</h3>
                <p className="text-xs font-semibold text-gray-400 mb-4">Summary of capacity utilization</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-gray-400 font-bold"><th className="text-left py-2">Event</th><th className="text-left py-2">Capacity</th><th className="text-left py-2">Sold</th><th className="text-right py-2">Utilization</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.slice(0, 5).map(ev => {
                      const sold = ev.capacity - ev.availableSlots;
                      const ratio = Math.round((sold / ev.capacity) * 100);
                      return (
                        <tr key={ev.id}>
                          <td className="py-2 text-[#111827] font-extrabold line-clamp-1 max-w-[120px]">{ev.title}</td>
                          <td className="py-2 text-gray-500 font-medium">{ev.capacity}</td>
                          <td className="py-2 text-gray-700 font-bold">{sold}</td>
                          <td className="py-2 text-right">
                            <span className={`font-bold px-2 py-0.5 rounded ${
                              ratio > 75 
                                ? 'bg-green-50 text-green-700' 
                                : ratio > 40 
                                ? 'bg-yellow-50 text-yellow-700' 
                                : 'bg-gray-50 text-gray-600'
                            }`}>{ratio}%</span>
                          </td>
                        </tr>
                      );
                    })}
                    {events.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-gray-400">No events present.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EVENT CREATE/EDIT MODAL */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-[#111827]">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
                <button onClick={() => setShowEventModal(false)} className="text-gray-400 hover:text-[#111827] transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={saveEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Event Title</label>
                  <input 
                    placeholder="Enter event title" 
                    value={eventForm.title} 
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    placeholder="Describe what attendees can expect..." 
                    value={eventForm.description} 
                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15] h-24 resize-none" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                    <select 
                      value={eventForm.category} 
                      onChange={e => setEventForm({ ...eventForm, category: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]"
                    >
                      <option value="Tech">Tech</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                      <option value="Sports">Sports</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Location / City</label>
                    <input 
                      placeholder="e.g. Bangalore, India" 
                      value={eventForm.location} 
                      onChange={e => setEventForm({ ...eventForm, location: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={eventForm.startDate} 
                      onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Time</label>
                    <input 
                      type="datetime-local" 
                      value={eventForm.endDate} 
                      onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      placeholder="Price" 
                      value={eventForm.price} 
                      onChange={e => setEventForm({ ...eventForm, price: Number(e.target.value) })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Slots Limit</label>
                    <input 
                      type="number" 
                      placeholder="Capacity" 
                      value={eventForm.capacity} 
                      onChange={e => setEventForm({ ...eventForm, capacity: Number(e.target.value) })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Banner Image URL</label>
                  <input 
                    placeholder="https://images.unsplash.com/photo-..." 
                    value={eventForm.imageUrl} 
                    onChange={e => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Name</label>
                    <input 
                      placeholder="e.g. Jio Garden" 
                      value={eventForm.venueName} 
                      onChange={e => setEventForm({ ...eventForm, venueName: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Address</label>
                    <input 
                      placeholder="e.g. BKC, Mumbai" 
                      value={eventForm.venueAddress} 
                      onChange={e => setEventForm({ ...eventForm, venueAddress: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-[#FACC15]" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <select 
                    value={eventForm.status} 
                    onChange={e => setEventForm({ ...eventForm, status: e.target.value })} 
                    className="bg-white border border-gray-300 rounded-xl p-2 text-xs focus:outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={eventForm.featured} 
                      onChange={e => setEventForm({ ...eventForm, featured: e.target.checked })} 
                      className="rounded border-gray-300"
                    />
                    Featured Event
                  </label>
                </div>
                <button type="submit" className="bg-[#FACC15] text-[#111827] hover:bg-[#EAB308] font-black py-3.5 w-full rounded-xl transition-all shadow-md mt-4">
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* USER BOOKING HISTORY MODAL */}
      <AnimatePresence>
        {showUserHistoryModal && selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-[#111827]">User Booking History</h2>
                  <p className="text-xs font-bold text-gray-400 mt-1">{selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</p>
                </div>
                <button onClick={() => setShowUserHistoryModal(false)} className="text-gray-400 hover:text-[#111827] transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {userBookings.map(b => (
                  <div key={b.id} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#111827]">{b.eventTitle}</h4>
                      <p className="text-xs text-gray-500 mt-1">Quantity: <span className="font-bold">{b.quantity}</span> · Booked on: {new Date(b.bookingDate || (b as any).createdAt || '').toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        b.status === 'CONFIRMED' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-red-50 border-red-200 text-red-700'
                      }`}>{b.status}</span>
                      <p className="font-extrabold text-sm mt-1">₹{b.totalPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}

                {userBookings.length === 0 && (
                  <p className="text-center text-gray-400 py-12 font-medium">This user hasn't booked any events yet.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
