'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../utils/api';
import { BarChart3, Calendar, Users, IndianRupee, Loader } from 'lucide-react';
import type { Event, Booking, DashboardStats } from '../../types';

export default function OrganizerPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession?.roles.some((r: string) => ['ROLE_ORGANIZER', 'ROLE_ADMIN'].includes(r))) {
      router.push('/login');
      return;
    }
    setSession(currentSession);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, e] = await Promise.all([
        api.get('/organizer/dashboard'),
        api.get('/organizer/events'),
      ]);
      setStats(s);
      setEvents(e);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadAttendees = async (eventId: string) => {
    setSelectedEvent(eventId);
    const data = await api.get(`/organizer/events/${eventId}/attendees`);
    setAttendees(data);
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader className="spin text-[#FACC15]" size={40} /></div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-black tracking-tight text-gray-900 leading-none flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
        <span>Organizer</span>
        <span className="text-[32px] sm:text-[42px] md:text-[52px] text-[#FACC15]">Hub</span>
      </h1>
      <p className="text-[#6B7280] mb-10">Manage your events and track performance</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'My Events', value: stats?.totalEvents, icon: <Calendar /> },
          { label: 'Bookings', value: stats?.totalBookings, icon: <Users /> },
          { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <IndianRupee /> },
          { label: 'Growth', value: '+12%', icon: <BarChart3 /> },
        ].map((s, i) => (
          <div key={i} className="premium-card p-6">
            <div className="text-[#FACC15] mb-2">{s.icon}</div>
            <p className="text-xs font-bold text-[#6B7280] uppercase">{s.label}</p>
            <p className="text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-black text-xl mb-4">Your Events</h2>
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="premium-card p-8 text-center text-[#6B7280]">
                No events yet. {session?.roles?.includes('ROLE_ADMIN') && (
                  <Link href="/dashboard" className="text-[#FACC15] font-bold">Create one</Link>
                )}
              </div>
            ) : events.map(ev => (
              <button key={ev.id} onClick={() => loadAttendees(ev.id)}
                className={`w-full premium-card p-5 text-left transition-all ${selectedEvent === ev.id ? 'border-[#FACC15]' : ''}`}>
                <h3 className="font-bold">{ev.title}</h3>
                <p className="text-sm text-[#6B7280]">{ev.availableSlots} slots left · ₹{ev.price}</p>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-black text-xl mb-4">Attendee List</h2>
          {selectedEvent ? (
            <div className="premium-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-3">Email</th><th className="text-left p-3">Qty</th><th className="text-left p-3">Tickets</th></tr></thead>
                <tbody>
                  {attendees.map(a => (
                    <tr key={a.id} className="border-b border-gray-100">
                      <td className="p-3">{a.userEmail}</td>
                      <td className="p-3">{a.quantity}</td>
                      <td className="p-3 font-mono text-xs">{a.ticketCodes?.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="premium-card p-8 text-center text-[#6B7280]">Select an event to view attendees</div>
          )}
        </div>
      </div>
    </div>
  );
}
