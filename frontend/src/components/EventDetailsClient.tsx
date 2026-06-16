'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../utils/api';
import { Calendar, MapPin, Tag, Users, ShieldAlert, Sparkles, CreditCard, ChevronRight, Star, Loader, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EventDetailsClientProps {
  id: string;
}

export default function EventDetailsClient({ id }: EventDetailsClientProps) {
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const session = getSession();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const eventData = await api.get(`/events/${id}`);
      setEvent(eventData);
      
      const reviewsData = await api.get(`/reviews/event/${id}`);
      setReviews(reviewsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const data = await api.post('/bookings', {
        eventId: id,
        quantity,
        paymentMethod
      });
      
      setBookingSuccess(data);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // reload event to get fresh available slots
      const eventData = await api.get(`/events/${id}`);
      setEvent(eventData);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to place booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setReviewLoading(true);
    try {
      const newReview = await api.post('/reviews', {
        eventId: id,
        rating,
        comment
      });
      setReviews([newReview, ...reviews]);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', width: '100%' }}>
        <Loader size={40} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#FF6B00' }} />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#A3A3A3' }}>
        <h2>Event not found</h2>
        <button onClick={() => router.push('/events')} className="btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Events
        </button>
      </div>
    );
  }

  const isSoldOut = event.availableSlots <= 0;
  const totalPrice = event.price * quantity;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Event Header Banner */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        background: '#222'
      }}>
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'} 
          alt={event.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.5)' }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, #0F0F0F 0%, rgba(15,15,15,0) 100%)',
          padding: '3rem 1.5rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{ width: '100%', maxWidth: '1200px' }}>
            <span style={{
              background: '#FF6B00',
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#FFFFFF'
            }}>{event.category}</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginTop: '1rem', color: '#FFFFFF' }}>
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        padding: '3rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem'
      }}>
        
        {/* Left Column: Details & Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* About Event */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>About this Event</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.98rem', whiteSpace: 'pre-wrap' }}>
              {event.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Schedule & Location */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>Event Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Calendar size={22} color="#FF6B00" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Date and Time</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {new Date(event.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                    {new Date(event.startDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} to {new Date(event.endDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <MapPin size={22} color="#FF6B00" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Location Venue</h4>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Section */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>Feedback & Reviews</h2>
            
            {/* Review form */}
            {session ? (
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Rating:</span>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Star size={20} fill={s <= rating ? '#FF6B00' : 'none'} color={s <= rating ? '#FF6B00' : '#A3A3A3'} />
                    </button>
                  ))}
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  required
                  placeholder="Share your thoughts about this event..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" disabled={reviewLoading} className="btn-secondary" style={{ alignSelf: 'flex-end', padding: '0.5rem 1.5rem', borderRadius: '6px' }}>
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', marginBottom: '2rem' }}>Please sign in to write a review.</p>
            )}

            {/* Reviews list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.length === 0 ? (
                <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', textAlign: 'center' }}>No reviews yet. Be the first to leave one!</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rev.userName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.1rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} fill={s <= rev.rating ? '#FF6B00' : 'none'} color={s <= rev.rating ? '#FF6B00' : '#A3A3A3'} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Booking Widget */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
            
            {bookingSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
                <CheckCircle size={48} color="#10B981" />
                <div>
                  <h3 style={{ fontSize: '1.3rem' }}>Booking Confirmed!</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Your tickets are secured.</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', width: '100%' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>TRANSACTION ID</div>
                  <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 600, color: '#FF6B00', marginTop: '0.2rem' }}>
                    {bookingSuccess.transactionId}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginTop: '0.8rem' }}>TICKET CODES</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
                    {bookingSuccess.ticketCodes.map((code: string) => (
                      <div key={code} style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#FFFFFF' }}>{code}</div>
                    ))}
                  </div>
                </div>

                <button onClick={() => router.push('/history')} className="btn-primary" style={{ width: '100%' }}>
                  View Booking History
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket Price</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B00', marginTop: '0.2rem' }}>
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </div>
                </div>

                {/* Ticket quantity selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Quantity</label>
                  <select
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={isSoldOut}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={n}>{n} Ticket(s)</option>
                    ))}
                  </select>
                </div>

                {/* Payment Selection */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment Method</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['CARD', 'STRIPE', 'PAYPAL'].map((method) => {
                      const active = paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          style={{
                            flex: 1,
                            background: active ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
                            border: '1px solid',
                            borderColor: active ? '#FF6B00' : 'rgba(255,255,255,0.08)',
                            color: '#FFFFFF',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: '0.2s'
                          }}
                        >
                          {method}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Total Calc */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>${totalPrice.toFixed(2)}</span>
                </div>

                {bookingError && (
                  <div style={{ color: '#EF4444', fontSize: '0.8rem', textAlign: 'center' }}>
                    {bookingError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSoldOut || bookingLoading}
                  className="btn-primary"
                  style={{ width: '100%', background: isSoldOut ? '#2A2A2A' : undefined }}
                >
                  {bookingLoading ? (
                    'Processing Order...'
                  ) : isSoldOut ? (
                    'Sold Out'
                  ) : session ? (
                    'Secure Ticket Now'
                  ) : (
                    'Sign In to Book'
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
