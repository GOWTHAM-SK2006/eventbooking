'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../utils/api';
import { ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '../../../../components/ImageUpload';

const emptyEvent = {
  title: '', description: '', location: '', category: 'Tech',
  startDate: '', endDate: '', price: 0, capacity: 100, imageUrl: '',
  galleryImages: [] as string[],
  status: 'PUBLISHED', venueName: '', venueAddress: '', featured: false,
};

const CATEGORY_FALLBACKS: Record<string, string> = {
  Tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  Music: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  Business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  Arts: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
  Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
  Workshop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
  Conference: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
  Startup: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
  AI: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
  Hackathon: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
  Seminar: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
  Meetup: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
};

export default function AdminCreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>(emptyEvent);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fallbackUrl = CATEGORY_FALLBACKS[form.category] || CATEGORY_FALLBACKS['Tech'];
      
      const payload = { 
        ...form, 
        // imageUrl is populated from the first uploaded image, or falls back to category stock image
        imageUrl: form.imageUrl || fallbackUrl,
        startDate: new Date(form.startDate).toISOString().slice(0, 19), 
        endDate: new Date(form.endDate).toISOString().slice(0, 19) 
      };
      
      await api.post('/events', payload);
      router.push('/admin/events');
    } catch (err) {
      alert('Error creating event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-2xl mx-auto">
      {/* Top Navigation / Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link 
          href="/admin/events" 
          className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 transition-all shadow-xs"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-black tracking-tight text-gray-900 leading-none flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span>Create</span>
            <span className="text-[#EAB308]">Event</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">Publish a new event to the catalog</p>
        </div>
      </div>

      {/* Creation Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Event Title</label>
            <input 
              placeholder="e.g. Developer Summit 2026" 
              value={form.title} 
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Description</label>
            <textarea 
              placeholder="Provide a detailed description of the event scheduling, speakers, topics, and instructions..." 
              value={form.description} 
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400 h-32 resize-none" 
              required 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Category</label>
              <select 
                value={form.category} 
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400"
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
                placeholder="e.g. Delhi, India" 
                value={form.location} 
                onChange={e => setForm({ ...form, location: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Start Date & Time</label>
              <input 
                type="datetime-local" 
                value={form.startDate} 
                onChange={e => setForm({ ...form, startDate: e.target.value })} 
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">End Date & Time</label>
              <input 
                type="datetime-local" 
                value={form.endDate} 
                onChange={e => setForm({ ...form, endDate: e.target.value })} 
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Ticket Price (₹)</label>
              <input 
                type="number" 
                placeholder="0 for free" 
                value={form.price} 
                onChange={e => setForm({ ...form, price: Number(e.target.value) })} 
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Slots Limit (Capacity)</label>
              <input 
                type="number" 
                placeholder="100" 
                value={form.capacity} 
                onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} 
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
              />
            </div>
          </div>

          {/* Professional Image Upload Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Event Images & Gallery
            </label>
            <ImageUpload 
              images={form.galleryImages || []} 
              onChange={(newImages) => {
                const featured = newImages[0] || '';
                setForm({
                  ...form,
                  imageUrl: featured, // first image becomes the featured image
                  galleryImages: newImages
                });
              }}
              maxCount={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Name</label>
              <input 
                placeholder="e.g. Pragati Maidan" 
                value={form.venueName} 
                onChange={e => setForm({ ...form, venueName: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Venue Address</label>
              <input 
                placeholder="e.g. New Delhi" 
                value={form.venueAddress} 
                onChange={e => setForm({ ...form, venueAddress: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:outline-none focus:border-yellow-400" 
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <select 
              value={form.status} 
              onChange={e => setForm({ ...form, status: e.target.value })} 
              className="bg-white border border-gray-300 rounded-xl p-2.5 text-xs focus:outline-none focus:border-yellow-400 font-bold"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={form.featured} 
                onChange={e => setForm({ ...form, featured: e.target.checked })} 
                className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              Mark as Featured Event
            </label>
          </div>
          <button 
            type="submit" 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-black py-4 w-full rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            disabled={saving}
          >
            {saving ? <Loader className="animate-spin" size={16} /> : 'Save & Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
