'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { 
  BarChart3, Calendar, Users, DollarSign, Plus, Edit3, Trash2, 
  CheckCircle2, ArrowUpRight, CheckSquare, Search, Tag, MapPin, 
  Clock, X, Check, Loader, ShieldAlert 
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'bookings' | 'checkin'>('overview');
  
  // Data States
  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // QR / Ticket Code Check-in Verification States
  const [ticketCodeInput, setTicketCodeInput] = useState('');
  const [checkinSuccess, setCheckinSuccess] = useState<any>(null);
  const [checkinError, setCheckinError] = useState<string | null>(null);

  // Create/Edit Event Modal State
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Event Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('0');
  const [capacity, setCapacity] = useState('100');
  const [imageUrl, setImageUrl] = useState('');
  const [eventStatus, setEventStatus] = useState('PUBLISHED');

  useEffect(() => {
    const session = getSession();
    if (!session || !session.roles.includes('ROLE_ADMIN')) {
      router.push('/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = await api.get('/analytics/dashboard');
      setStats(statsData);

      const eventsData = await api.get('/events');
      setEvents(eventsData);

      const bookingsData = await api.get('/bookings');
      setBookings(bookingsData);

      const usersData = await api.get('/auth/users');
      setUsers(usersData);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch dashboard records');
    } finally {
      setLoading(false);
    }
  };

  // Create or Update Event Form Submission
  const handleEventFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    const payload = {
      title,
      category,
      description,
      location,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      price: parseFloat(price),
      capacity: parseInt(capacity),
      imageUrl: imageUrl.trim() ? imageUrl : null,
      status: eventStatus
    };

    try {
      if (editingEventId) {
        await api.put(`/events/${editingEventId}`, payload);
      } else {
        await api.post('/events', payload);
      }
      
      // Reset form and reload
      setShowEventModal(false);
      clearEventForm();
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const clearEventForm = () => {
    setEditingEventId(null);
    setTitle('');
    setCategory('Tech');
    setDescription('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setPrice('0');
    setCapacity('100');
    setImageUrl('');
    setEventStatus('PUBLISHED');
  };

  const openEditModal = (event: any) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setCategory(event.category);
    setDescription(event.description || '');
    setLocation(event.location || '');
    
    // Format LocalDateTime string to datetime-local input format
    if (event.startDate) {
      const d = new Date(event.startDate);
      setStartDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
    if (event.endDate) {
      const d = new Date(event.endDate);
      setEndDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    }
    
    setPrice(event.price.toString());
    setCapacity(event.capacity.toString());
    setImageUrl(event.imageUrl || '');
    setEventStatus(event.status);
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This is a soft-delete action.')) return;
    try {
      await api.delete(`/events/${eventId}`);
      await loadData();
    } catch (e) {
      alert('Failed to delete event');
    }
  };

  // Ticket check-in handler
  const handleTicketCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckinSuccess(null);
    setCheckinError(null);

    try {
      const data = await api.post(`/tickets/verify?ticketCode=${ticketCodeInput.trim()}`);
      setCheckinSuccess(data);
      setTicketCodeInput('');
      await loadData(); // refresh bookings/sales lists
    } catch (err: any) {
      setCheckinError(err.message || 'Verification failed. Code is invalid or already used.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', width: '100%' }}>
        <Loader size={40} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#FF6B00' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Overview analytics, event catalog, slot booking reports, and QR ticket check-ins.</p>
        </div>
        
        <button onClick={() => { clearEventForm(); setShowEventModal(true); }} className="btn-primary">
          <Plus size={18} />
          Create Event
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'events', label: 'Manage Events' },
          { id: 'bookings', label: 'Booking Logs' },
          { id: 'checkin', label: 'Check-in Verify' }
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: active ? 'rgba(255, 107, 0, 0.08)' : 'transparent',
                border: 'none',
                color: active ? '#FF6B00' : '#A3A3A3',
                padding: '0.6rem 1.2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: '0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="fade-in">
          {/* Analytics Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign size={20} color="#FF6B00" /> },
              { label: 'Confirmed Bookings', value: stats.totalBookings, icon: <CheckSquare size={20} color="#FF6B00" /> },
              { label: 'Total Events', value: stats.totalEvents, icon: <Calendar size={20} color="#FF6B00" /> },
              { label: 'Registered Users', value: stats.totalUsers, icon: <Users size={20} color="#FF6B00" /> }
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', fontFamily: 'var(--font-title)' }}>{stat.value}</div>
                </div>
                <div style={{ background: 'rgba(255, 107, 0, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Category breakdown */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem' }}>Sales by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.keys(stats.categorySales).length === 0 ? (
                  <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>No sales records yet.</p>
                ) : (
                  Object.entries(stats.categorySales).map(([cat, qty]: any) => (
                    <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span>{cat}</span>
                        <span style={{ fontWeight: 600 }}>{qty} ticket(s)</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#FF6B00', width: `${Math.min(100, (qty / 100) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Monthly revenues */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.2rem' }}>Monthly Revenue Trends</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.keys(stats.monthlyRevenue).length === 0 ? (
                  <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>No monthly transactions recorded.</p>
                ) : (
                  Object.entries(stats.monthlyRevenue).map(([month, val]: any) => (
                    <div key={month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{month}</span>
                      <span style={{ fontWeight: 700, color: '#10B981' }}>${val.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EVENTS TAB */}
      {activeTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Title</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Category</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Price</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Availability</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{evt.title}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{evt.category}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>${evt.price}</td>
                    <td style={{ padding: '1rem' }}>
                      {evt.availableSlots} / {evt.capacity}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: evt.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        color: evt.status === 'PUBLISHED' ? '#10B981' : 'var(--text-muted)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>{evt.status}</span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => openEditModal(evt)} style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', padding: '0.2rem' }}>
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteEvent(evt.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.2rem' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="fade-in">
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>User Email</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Event Title</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Qty</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Price</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Booking Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{booking.userEmail}</td>
                    <td style={{ padding: '1rem' }}>{booking.eventTitle}</td>
                    <td style={{ padding: '1rem' }}>{booking.quantity}</td>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>${booking.totalPrice}</td>
                    <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: booking.status === 'CONFIRMED' ? '#10B981' : '#EF4444',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>{booking.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CHECK-IN / VERIFY TAB */}
      {activeTab === 'checkin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }} className="fade-in">
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Ticket QR / Code Verification</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Input the unique ticket pass code (e.g. TKT-XXXX-XXXX) printed on the attendee ticket pass to mark their arrival check-in.
            </p>

            <form onSubmit={handleTicketCheckIn} style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Enter Ticket Code (TKT-XXXX-XXXX)"
                value={ticketCodeInput}
                onChange={(e) => setTicketCodeInput(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ padding: '0 2rem' }}>
                Verify
              </button>
            </form>

            {checkinSuccess && (
              <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '1.25rem',
                borderRadius: '10px',
                color: '#10B981'
              }}>
                <CheckCircle2 size={32} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Admission Confirmed</h4>
                  <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginTop: '0.2rem' }}>
                    Code: <strong style={{ color: '#FFFFFF' }}>{checkinSuccess.ticketCode}</strong> is verified successfully!
                  </p>
                </div>
              </div>
            )}

            {checkinError && (
              <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '1.25rem',
                borderRadius: '10px',
                color: '#EF4444'
              }}>
                <ShieldAlert size={32} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>Invalid Ticket</h4>
                  <p style={{ fontSize: '0.85rem', color: '#A3A3A3', marginTop: '0.2rem' }}>{checkinError}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EVENT FORM MODAL (CREATE / EDIT) */}
      {showEventModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card fade-in" style={{
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.8rem',
            position: 'relative'
          }}>
            
            {/* Modal Close */}
            <button
              onClick={() => setShowEventModal(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'none',
                border: 'none',
                color: '#A3A3A3',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                {editingEventId ? 'Modify Event Settings' : 'Create New Event'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                Fill out the catalog configuration metadata parameters.
              </p>
            </div>

            <form onSubmit={handleEventFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Event Title</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. NextJS 15 Dev Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Category & Price */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Category</label>
                  <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Arts">Arts</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="form-input"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Tell attendees what this event is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Location Venue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Venue Location</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Silicon Valley, Hall B or Online"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Dates */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Start Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>End Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Capacity & Image URL */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Max Capacity (Slots)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="form-input"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</label>
                  <select className="form-input" value={eventStatus} onChange={(e) => setEventStatus(e.target.value)}>
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/banner.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEventModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="btn-primary" style={{ flex: 1 }}>
                  {actionLoading ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
