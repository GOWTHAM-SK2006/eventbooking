'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../utils/api';
import { Calendar, MapPin, Tag, Users, ShieldAlert, Sparkles, CreditCard, ChevronRight, Star, Loader, CheckCircle, X, QrCode, Settings, Edit, Trash2, FileText, LayoutDashboard } from 'lucide-react';
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

  // Payment UI State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [activePaymentTab, setActivePaymentTab] = useState<'RAZORPAY' | 'UPI_QR'>('RAZORPAY');
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

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

      try {
        const paymentData = await api.get('/settings/payment');
        if (paymentData && paymentData.value) {
          setPaymentSettings(JSON.parse(paymentData.value));
        }
      } catch (e) {
        console.warn("Could not load payment settings", e);
      }
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
    setBookingError(null);
    setShowPaymentModal(true);
  };

  const confirmPaymentAndBook = async (finalPaymentMethod: string) => {
    setProcessingPayment(true);
    setBookingError(null);

    try {
      // Simulate Razorpay window or UPI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const data = await api.post('/bookings', {
        eventId: id,
        quantity,
        paymentMethod: finalPaymentMethod
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
      setShowPaymentModal(false);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to complete booking.');
    } finally {
      setProcessingPayment(false);
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
          
          {/* Admin Management Panel */}
          {session?.roles?.includes('ROLE_ADMIN') && (
            <div className="glass-card fade-in" style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
                <Settings size={20} color="#10B981" />
                <h2 style={{ fontSize: '1.5rem', color: '#10B981' }}>Admin Management</h2>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                You have administrative privileges for this event. Quick actions:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}>
                  <Edit size={16} /> Edit Event
                </button>
                <button onClick={async () => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    try {
                      await api.delete(`/events/${id}`);
                      router.push('/events');
                    } catch (e) {
                      alert('Failed to delete event');
                    }
                  }
                }} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.2)' }}>
                  <Trash2 size={16} /> Delete Event
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}>
                  <Users size={16} /> View Bookings & Attendees
                </button>
                <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1rem' }}>
                  <CreditCard size={16} /> View Payment Details
                </button>
              </div>
            </div>
          )}

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

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)', marginTop: '0.8rem' }}>TICKET CODES / QR IDENTIFIERS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.3rem' }}>
                    {bookingSuccess.ticketCodes.map((code: string) => (
                      <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${code}`} 
                          alt="Ticket QR" 
                          style={{ width: '60px', height: '60px', borderRadius: '4px' }}
                        />
                        <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', color: '#FFFFFF' }}>{code}</div>
                      </div>
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

                {/* Payment Options visual (Informational only before modal) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Accepted Payments</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#A3A3A3' }}>RAZORPAY</div>
                    <div style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#A3A3A3' }}>UPI QR</div>
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

      {/* PAYMENT MODAL */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 300,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card fade-in" style={{
            width: '100%', maxWidth: '480px', padding: '2.5rem', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem'
          }}>
            <button
              onClick={() => !processingPayment && setShowPaymentModal(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Complete Payment</h2>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#FF6B00', marginTop: '0.5rem' }}>
                ${totalPrice.toFixed(2)}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>For {quantity} ticket(s) to {event.title}</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.3rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <button
                onClick={() => setActivePaymentTab('RAZORPAY')}
                style={{
                  flex: 1, padding: '0.8rem', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s',
                  background: activePaymentTab === 'RAZORPAY' ? '#FF6B00' : 'transparent',
                  color: activePaymentTab === 'RAZORPAY' ? '#FFF' : '#A3A3A3'
                }}
              >
                Razorpay
              </button>
              <button
                onClick={() => setActivePaymentTab('UPI_QR')}
                style={{
                  flex: 1, padding: '0.8rem', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s',
                  background: activePaymentTab === 'UPI_QR' ? '#FF6B00' : 'transparent',
                  color: activePaymentTab === 'UPI_QR' ? '#FFF' : '#A3A3A3'
                }}
              >
                UPI QR Code
              </button>
            </div>

            {activePaymentTab === 'RAZORPAY' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
                <CreditCard size={48} color="#A3A3A3" />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  You will be securely redirected to Razorpay's checkout gateway to process your card, net banking, or wallet payment.
                </p>
                <button
                  onClick={() => confirmPaymentAndBook('RAZORPAY')}
                  disabled={processingPayment}
                  className="btn-primary" style={{ width: '100%', padding: '1rem' }}
                >
                  {processingPayment ? 'Processing Gateway...' : 'Pay with Razorpay'}
                </button>
              </div>
            )}

            {activePaymentTab === 'UPI_QR' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
                {paymentSettings?.qrCodeUrl ? (
                  <img src={paymentSettings.qrCodeUrl} alt="UPI QR" style={{ width: '180px', height: '180px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)' }} />
                ) : (
                  <div style={{ width: '180px', height: '180px', borderRadius: '12px', border: '2px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={40} color="#6B7280" />
                  </div>
                )}
                
                <div style={{ fontSize: '0.9rem' }}>
                  <div style={{ color: 'var(--text-muted)' }}>UPI ID</div>
                  <div style={{ fontWeight: 600, letterSpacing: '1px' }}>{paymentSettings?.upiId || 'Not Configured'}</div>
                </div>

                <div style={{ width: '100%', textAlign: 'left', marginTop: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>Enter UPI Reference / UTR Number</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. 312345678901"
                    value={upiTransactionId}
                    onChange={(e) => setUpiTransactionId(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => confirmPaymentAndBook(`UPI-${upiTransactionId}`)}
                  disabled={processingPayment || upiTransactionId.trim().length < 6}
                  className="btn-primary" style={{ width: '100%', padding: '1rem' }}
                >
                  {processingPayment ? 'Verifying Payment...' : 'Verify & Book Ticket'}
                </button>
              </div>
            )}
            
            {bookingError && (
              <div style={{ color: '#EF4444', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
                {bookingError}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
