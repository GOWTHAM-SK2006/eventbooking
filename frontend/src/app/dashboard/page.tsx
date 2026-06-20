'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { BarChart3, Calendar, Users, IndianRupee, Plus, Edit3, Trash2, CheckSquare, Loader, X } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyEvent);
  const [ticketCode, setTicketCode] = useState('');
  const [checkinResult, setCheckinResult] = useState<any>(null);
  const [checkinError, setCheckinError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (!session) { router.push('/login'); return; }
    if (!session.roles?.includes('ROLE_ADMIN')) { router.push('/'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, e, b, u, p] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/events'),
        api.get('/bookings'),
        api.get('/auth/users'),
        api.get('/payments').catch(() => []),
      ]);
      setStats(s); setEvents(e); setBookings(b); setUsers(u); setPayments(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditingEvent(null); setForm(emptyEvent); setShowModal(true); };
  const openEdit = (ev: Event) => {
    setEditingEvent(ev);
    setForm({
      ...ev,
      startDate: ev.startDate?.slice(0, 16) || '',
      endDate: ev.endDate?.slice(0, 16) || '',
    });
    setShowModal(true);
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, startDate: new Date(form.startDate).toISOString().slice(0, 19), endDate: new Date(form.endDate).toISOString().slice(0, 19) };
    if (editingEvent) await api.put(`/events/${editingEvent.id}`, payload);
    else await api.post('/events', payload);
    setShowModal(false);
    loadData();
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    loadData();
  };

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinError(''); setCheckinResult(null);
    try {
      const res = await api.post(`/tickets/verify?ticketCode=${ticketCode.trim()}`);
      setCheckinResult(res);
      setTicketCode('');
    } catch (err: any) { setCheckinError(err.message); }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
    { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
    { id: 'bookings', label: 'Bookings', icon: <Users size={18} /> },
    { id: 'checkin', label: 'QR Scanner', icon: <CheckSquare size={18} /> },
    { id: 'revenue', label: 'Revenue', icon: <IndianRupee size={18} /> },
  ];

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black">Admin <span className="text-[#FACC15]">Console</span></h1>
          <p className="text-[#6B7280]">Manage platform operations</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 py-3 px-6"><Plus size={20} /> New Event</button>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-8">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap ${activeTab === t.id ? 'bg-[#FACC15] text-[#111827]' : 'bg-white border border-gray-300 text-[#6B7280]'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Events', value: stats?.totalEvents },
              { label: 'Bookings', value: stats?.totalBookings },
              { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}` },
              { label: 'Users', value: users.length },
            ].map((s, i) => (
              <div key={i} className="premium-card p-6">
                <p className="text-xs font-bold text-[#6B7280] uppercase">{s.label}</p>
                <p className="text-3xl font-black mt-2">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="premium-card p-6 overflow-x-auto">
            <h2 className="font-black text-xl mb-4">Recent Bookings</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2">User</th><th className="text-left py-2">Event</th><th className="text-left py-2">Qty</th><th className="text-left py-2">Amount</th></tr></thead>
              <tbody>
                {bookings.slice(0, 8).map(b => (
                  <tr key={b.id} className="border-b border-gray-100">
                    <td className="py-3">{b.userEmail}</td>
                    <td className="py-3">{b.eventTitle}</td>
                    <td className="py-3">{b.quantity}</td>
                    <td className="py-3 font-bold">₹{b.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid gap-4">
          {events.map(ev => (
            <div key={ev.id} className="premium-card p-6 flex justify-between items-center">
              <div>
                <span className="badge-primary text-xs">{ev.category}</span>
                <h3 className="font-black text-lg mt-1">{ev.title}</h3>
                <p className="text-sm text-[#6B7280]">{ev.availableSlots}/{ev.capacity} slots · {ev.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(ev)} className="p-2 rounded-lg hover:bg-gray-100"><Edit3 size={18} /></button>
                <button onClick={() => deleteEvent(ev.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="premium-card overflow-x-auto">
          <table className="w-full text-sm p-4">
            <thead><tr className="border-b"><th className="text-left p-4">ID</th><th className="text-left p-4">User</th><th className="text-left p-4">Event</th><th className="text-left p-4">Status</th><th className="text-left p-4">Total</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{b.id.slice(0, 8)}...</td>
                  <td className="p-4">{b.userEmail}</td>
                  <td className="p-4">{b.eventTitle}</td>
                  <td className="p-4"><span className={`badge-${b.status === 'CONFIRMED' ? 'success' : 'warning'}`}>{b.status}</span></td>
                  <td className="p-4 font-bold">₹{b.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'checkin' && (
        <div className="premium-card p-8 max-w-lg">
          <h2 className="font-black text-xl mb-6">Scan Ticket QR</h2>
          {checkinResult && <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-green-700">Checked in: {checkinResult.ticketCode}</div>}
          {checkinError && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600">{checkinError}</div>}
          <form onSubmit={handleCheckin} className="flex gap-2">
            <input value={ticketCode} onChange={e => setTicketCode(e.target.value)} placeholder="Enter ticket code" className="input-field flex-1" />
            <button type="submit" className="btn-primary px-6">Verify</button>
          </form>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div>
          <div className="premium-card p-6 mb-6">
            <h2 className="font-black text-xl mb-2">Total Revenue</h2>
            <p className="text-4xl font-black text-[#FACC15]">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</p>
          </div>
          <div className="premium-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-4">Event</th><th className="text-left p-4">Method</th><th className="text-left p-4">Amount</th><th className="text-left p-4">GST</th><th className="text-left p-4">Invoice</th></tr></thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-b border-gray-100">
                    <td className="p-4">{p.eventTitle}</td>
                    <td className="p-4">{p.paymentMethod}</td>
                    <td className="p-4 font-bold">₹{p.amount}</td>
                    <td className="p-4">₹{p.gstAmount || 0}</td>
                    <td className="p-4 font-mono text-xs">{p.invoiceNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-xl font-black">{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={saveEvent} className="space-y-4">
                {['title', 'description', 'location', 'category', 'imageUrl', 'venueName', 'venueAddress'].map(f => (
                  <input key={f} placeholder={f} value={(form as any)[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })}
                    className="input-field w-full" required={f === 'title' || f === 'category'} />
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="input-field" required />
                  <input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="input-field" />
                  <input type="number" placeholder="Capacity" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} className="input-field" />
                </div>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="input-field w-full">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured Event</label>
                <button type="submit" className="btn-primary w-full py-3">{editingEvent ? 'Update' : 'Create'} Event</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
