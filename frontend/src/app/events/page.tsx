'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../utils/api';
import { Search, Calendar, MapPin, Tag, SlidersHorizontal, Loader } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['All', 'Tech', 'Music', 'Arts', 'Business'];

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const queryParams: any = {};
      if (category && category !== 'All') {
        queryParams.category = category;
      }
      if (search.trim()) {
        queryParams.search = search;
      }
      const data = await api.get('/events', { params: queryParams });
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Upcoming Events</h1>
        <p style={{ color: 'var(--text-muted)' }}>Discover workshops, conferences, concert series, and summits happening soon.</p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={18} color="#6B7280" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.8rem' }}
              placeholder="Search by title, keywords, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.5rem' }}>
            <SlidersHorizontal size={14} /> Filter:
          </span>
          {categories.map((cat) => {
            const active = category === cat || (cat === 'All' && !category);
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat === 'All' ? '' : cat)}
                style={{
                  background: active ? '#FF6B00' : 'rgba(255,255,255,0.03)',
                  border: '1px solid',
                  borderColor: active ? '#FF8C42' : 'rgba(255,255,255,0.08)',
                  color: '#FFFFFF',
                  padding: '0.4rem 1.1rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader size={36} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#FF6B00' }} />
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No events found</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Try clearing your filters or altering your search text.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
          {events.map((event) => {
            const isSoldOut = event.availableSlots <= 0;
            return (
              <Link href={`/events/${event.id}`} key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <div style={{ height: '220px', background: '#222', position: 'relative' }}>
                  <img 
                    src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'} 
                    alt={event.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(15,15,15,0.85)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: '#FF8C42',
                    fontWeight: 600
                  }}>
                    {event.category}
                  </span>
                  {isSoldOut && (
                    <span style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      background: 'rgba(239, 68, 68, 0.9)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: '#FFFFFF',
                      fontWeight: 700
                    }}>
                      SOLD OUT
                    </span>
                  )}
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#FFFFFF', fontWeight: 700 }}>
                      {event.title}
                    </h3>
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      lineClamp: 2,
                      WebkitLineClamp: 2,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {event.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#A3A3A3" />
                      <span>{new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#A3A3A3" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FF6B00' }}>
                      {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: event.availableSlots < 10 ? '#EF4444' : 'var(--text-muted)', fontWeight: 600 }}>
                      {event.availableSlots} slots left
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
