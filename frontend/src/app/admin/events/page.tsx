'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Plus, Edit3, Trash2, Search, X, Loader, Calendar, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const emptyEvent = {
  title: '', description: '', location: '', category: 'Tech',
  startDate: '', endDate: '', price: 0, capacity: 100, imageUrl: '',
  status: 'PUBLISHED', venueName: '', venueAddress: '', featured: false,
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Editing modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyEvent);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await api.get('/events');
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (ev: any) => {
    setEditingEvent(ev);
    setForm({
      ...ev,
      startDate: ev.startDate?.slice(0, 16) || '',
      endDate: ev.endDate?.slice(0, 16) || '',
    });
    setShowEditModal(true);
  };

  const saveEditedEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...form, 
      startDate: new Date(form.startDate).toISOString().slice(0, 19), 
      endDate: new Date(form.endDate).toISOString().slice(0, 19) 
    };
    try {
      await api.put(`/events/${editingEvent.id}`, payload);
      setShowEditModal(false);
      loadEvents();
    } catch (err) {
      alert('Error updating event');
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action is irreversible.')) return;
    try {
      await api.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const categories = ['ALL', 'Tech', 'Music', 'Business', 'Arts', 'Sports', 'Workshop', 'Conference', 'Startup', 'AI', 'Hackathon', 'Seminar', 'Meetup'];

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || ev.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-black text-gray-900 leading-none">Events</div>
          <p className="text-sm text-gray-500 font-semibold mt-1">Manage events, pricing, and configurations</p>
        </div>
        <Link 
          href="/admin/events/create" 
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={16} /> Create Event
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search events by title or city..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-yellow-400 text-gray-900' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(ev => (
          <div key={ev.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between">
            <div>
              {/* Event Image */}
              <div className="h-44 bg-gray-100 relative">
                {ev.imageUrl ? (
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-50 text-yellow-600">
                    <Calendar size={40} />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                  <span className="bg-white/90 backdrop-blur-xs text-gray-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs">
                    {ev.category}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-xs ${
                    ev.status === 'PUBLISHED' 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {ev.status === 'PUBLISHED' ? 'Active' : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-6">
                <h3 className="font-extrabold text-lg text-gray-900 leading-tight line-clamp-1">{ev.title}</h3>
                <p className="text-xs font-semibold text-gray-400 mt-1">{new Date(ev.startDate).toLocaleString()} · {ev.location}</p>
                <p className="text-xs text-gray-500 mt-3 line-clamp-2">{ev.description}</p>
              </div>
            </div>

            {/* Event Pricing & Slots Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price / Slots</p>
                <p className="font-black text-gray-900 text-sm mt-0.5">
                  {ev.price === 0 ? 'Free' : `₹${ev.price}`} <span className="text-gray-400 font-medium">· {ev.availableSlots}/{ev.capacity} slots</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEdit(ev)} 
                  className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all shadow-xs"
                >
                  <Edit3 size={15} />
                </button>
                <button 
                  onClick={() => deleteEvent(ev.id)} 
                  className="p-2.5 rounded-xl border border-red-100 bg-white hover:bg-red-50 text-red-500 transition-all shadow-xs"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-2 text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 font-medium">
            No events found in database.
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-black text-gray-900">Edit Event Settings</div>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-900 transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={saveEditedEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Event Title</label>
                  <input 
                    placeholder="Event Title" 
                    value={form.title} 
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
                  <textarea 
                    placeholder="Event Description..." 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 h-24 resize-none" 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
                    <select 
                      value={form.category} 
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400"
                    >
                      <option value="Tech">Tech</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Arts">Arts</option>
                      <option value="Sports">Sports</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Conference">Conference</option>
                      <option value="Startup">Startup</option>
                      <option value="AI">AI</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Meetup">Meetup</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Location / City</label>
                    <input 
                      placeholder="e.g. Mumbai, India" 
                      value={form.location} 
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Time</label>
                    <input 
                      type="datetime-local" 
                      value={form.startDate} 
                      onChange={e => setForm({ ...form, startDate: e.target.value })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Time</label>
                    <input 
                      type="datetime-local" 
                      value={form.endDate} 
                      onChange={e => setForm({ ...form, endDate: e.target.value })} 
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
                      value={form.price} 
                      onChange={e => setForm({ ...form, price: Number(e.target.value) })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Capacity (Slots Limit)</label>
                    <input 
                      type="number" 
                      placeholder="Capacity" 
                      value={form.capacity} 
                      onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} 
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Banner Image URL</label>
                  <input 
                    placeholder="https://images.unsplash.com/..." 
                    value={form.imageUrl} 
                    onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Name</label>
                    <input 
                      placeholder="Venue Name" 
                      value={form.venueName} 
                      onChange={e => setForm({ ...form, venueName: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Address</label>
                    <input 
                      placeholder="Venue Address" 
                      value={form.venueAddress} 
                      onChange={e => setForm({ ...form, venueAddress: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <select 
                    value={form.status} 
                    onChange={e => setForm({ ...form, status: e.target.value })} 
                    className="bg-white border border-gray-300 rounded-xl p-2 text-xs focus:outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={form.featured} 
                      onChange={e => setForm({ ...form, featured: e.target.checked })} 
                      className="rounded border-gray-300"
                    />
                    Featured Event
                  </label>
                </div>
                <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 w-full rounded-xl transition-all shadow-md mt-4">
                  Update Event Settings
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
