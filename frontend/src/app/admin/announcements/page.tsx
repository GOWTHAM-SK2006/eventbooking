'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Bell, Mail, Loader, Megaphone } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annMessage, setAnnMessage] = useState('');
  const [annSending, setAnnSending] = useState(false);

  // Reminder state
  const [remEventId, setRemEventId] = useState('');
  const [remMessage, setRemMessage] = useState('');
  const [remSending, setRemSending] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await api.get('/events');
      setEvents(data);
      if (data.length > 0) {
        setRemEventId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;
    setAnnSending(true);
    try {
      await api.post('/notifications/announcement', {
        title: annTitle,
        content: annMessage
      });
      alert('Global announcement broadcasted successfully!');
      setAnnTitle('');
      setAnnMessage('');
    } catch (err) {
      alert('Error broadcasting announcement');
    } finally {
      setAnnSending(false);
    }
  };

  const handleSendReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remEventId || !remMessage) return;
    setRemSending(true);
    try {
      await api.post('/notifications/reminder', {
        eventId: remEventId,
        content: remMessage
      });
      alert('Event reminder notifications dispatched successfully!');
      setRemMessage('');
    } catch (err) {
      alert('Error sending reminders');
    } finally {
      setRemSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-black text-gray-900 tracking-tight leading-none">Announcements</h1>
        <p className="text-sm text-gray-500 font-semibold mt-1">Broadcast real-time push alerts and ticket reminder updates to users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Global Announcement Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="text-yellow-500" size={20} />
              <div className="text-lg font-black text-gray-900">Broadcast Announcement</div>
            </div>
            <p className="text-xs text-gray-400 font-semibold mb-6">Dispatches push alerts and email copies to all active platform user accounts.</p>
            
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Title</label>
                <input 
                  placeholder="e.g. Platform System Maintenance Scheduled" 
                  value={annTitle} 
                  onChange={e => setAnnTitle(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400" 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Alert Content</label>
                <textarea 
                  placeholder="Draft system-wide update details..." 
                  value={annMessage} 
                  onChange={e => setAnnMessage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 h-28 resize-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 w-full rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                disabled={annSending}
              >
                {annSending ? <Loader className="animate-spin" size={16} /> : 'Dispatch Global Broadcast'}
              </button>
            </form>
          </div>
        </div>

        {/* Event-specific Reminder Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="text-yellow-500" size={20} />
              <div className="text-lg font-black text-gray-900">Event ticket reminder</div>
            </div>
            <p className="text-xs text-gray-400 font-semibold mb-6">Send urgent schedules, venue updates, and reminders specifically to ticket holders of the selected event.</p>
            
            <form onSubmit={handleSendReminder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Target Event</label>
                <select 
                  value={remEventId} 
                  onChange={e => setRemEventId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400"
                >
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Message Content</label>
                <textarea 
                  placeholder="e.g. Doors open at 6:00 PM tonight. Please keep QR codes ready!" 
                  value={remMessage} 
                  onChange={e => setRemMessage(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-yellow-400 h-28 resize-none" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-extrabold py-3.5 w-full rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                disabled={remSending}
              >
                {remSending ? <Loader className="animate-spin" size={16} /> : 'Send Ticket Holder Reminders'}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
