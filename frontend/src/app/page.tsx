'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../utils/api';
import { Sparkles, ArrowRight, Activity, Users, ShieldCheck, Star } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const data = await api.get('/events/featured');
      setFeatured(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Tech', count: '12 Events', color: '#3B82F6' },
    { name: 'Music', count: '24 Events', color: '#EC4899' },
    { name: 'Arts', count: '8 Events', color: '#10B981' },
    { name: 'Business', count: '15 Events', color: '#F59E0B' }
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Decorative Glow Spots */}
      <div className="glow-spot" style={{ top: '10%', left: '5%' }}></div>
      <div className="glow-spot" style={{ top: '40%', right: '5%' }}></div>

      {/* Hero Section */}
      <section style={{
        padding: '5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '900px',
        width: '100%',
        animation: 'fadeIn 0.8s ease-out'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 107, 0, 0.1)',
          border: '1px solid rgba(255, 107, 0, 0.2)',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: '#FF8C42',
          fontWeight: 600,
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} />
          <span>The Future of Event Bookings is Here</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          fontWeight: 800,
          background: 'linear-gradient(to right, #FFFFFF, #A3A3A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Discover & Book <br />
          <span style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Extraordinary Experiences
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          lineHeight: 1.6,
          marginBottom: '2.5rem'
        }}>
          Secure your spot at the most exclusive technology symposiums, music concerts, business workshops, and creative arts festivals around the globe.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/events" className="btn-primary">
            Browse All Events
            <ArrowRight size={18} />
          </Link>
          <Link href="/signup" className="btn-secondary">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '3rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {[
          { label: 'Total Tickets Sold', value: '45,000+', icon: <Activity size={20} color="#FF6B00" /> },
          { label: 'Active Users', value: '12,500+', icon: <Users size={20} color="#FF6B00" /> },
          { label: 'Verified Partners', value: '350+', icon: <ShieldCheck size={20} color="#FF6B00" /> }
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ background: 'rgba(255, 107, 0, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Events */}
      <section style={{ width: '100%', maxWidth: '1200px', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Featured Events</h2>
            <p style={{ color: 'var(--text-muted)' }}>Top events handpicked for you this week.</p>
          </div>
          <Link href="/events" style={{ color: '#FF6B00', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3].map((n) => (
              <div key={n} className="glass-card" style={{ height: '350px', background: 'rgba(255,255,255,0.02)' }} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No featured events currently available. Check back soon!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {featured.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: '200px', background: '#222', position: 'relative' }}>
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
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>{event.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {event.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF6B00' }}>
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section style={{ width: '100%', maxWidth: '1200px', padding: '4rem 1.5rem' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>Loved by Attendees Worldwide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { quote: "Booking tickets for the Tech Summit was incredibly fast. I got my tickets, and checked in at the event via the QR code within seconds.", author: "Sarah Jenkins", role: "Software Engineer" },
            { quote: "Beautiful, responsive UI. Truly a premium feel. The custom alerts kept me updated about the seat availability in real time.", author: "David Carter", role: "Product Designer" },
            { quote: "A seamless payment process and excellent dashboard statistics. I can track all my bookings and print tickets easily.", author: "Elena Rostova", role: "Creative Director" }
          ].map((item, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="#FF6B00" color="#FF6B00" />)}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                "{item.quote}"
              </p>
              <div>
                <h4 style={{ fontWeight: 600 }}>{item.author}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        width: '100%',
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        padding: '3rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '5rem'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>EVNT.</h3>
            <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', maxWidth: '280px' }}>Elevating your event-going experiences with a state-of-the-art SaaS booking platform.</p>
          </div>
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Link href="/events">Browse Events</Link>
                <Link href="/login">Sign In</Link>
                <Link href="/signup">Sign Up</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
                <span style={{ cursor: 'pointer' }}>Terms of Service</span>
                <span style={{ cursor: 'pointer' }}>Contact Support</span>
              </div>
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-dark)', fontSize: '0.8rem' }}>© 2026 EVNT Inc. All rights reserved.</p>
      </footer>

    </div>
  );
}
