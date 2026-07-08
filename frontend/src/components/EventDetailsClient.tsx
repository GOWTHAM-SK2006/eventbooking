'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession, resolveImageUrl } from '../utils/api';
import { Calendar, MapPin, Users, ShieldAlert, Sparkles, CreditCard, Star, CheckCircle, X, QrCode, Heart, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface EventDetailsClientProps {
  id: string;
}

export default function EventDetailsClient({ id: propsId }: EventDetailsClientProps) {
  const router = useRouter();
  const [actualId, setActualId] = useState<string>('');

  useEffect(() => {
    let resolvedId = propsId;
    if (resolvedId === '%5Bid%5D' || resolvedId === '[id]' || resolvedId === 'fallback') {
      resolvedId = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() || '' : '';
    }
    if (resolvedId && resolvedId !== 'fallback') {
      setActualId(resolvedId);
    }
  }, [propsId]);

  const [event, setEvent] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking State
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState<any>(null);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [razorpayKey, setRazorpayKey] = useState('rzp_test_T2NUwSm1uqZZrX');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const session = getSession();

  useEffect(() => {
    if (actualId) loadData();
  }, [actualId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      const remainingImages = event?.galleryImages?.slice(1) || [];
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
        setZoomLevel(1);
      } else if (e.key === 'ArrowRight') {
        if (activeLightboxIndex < remainingImages.length - 1) {
          setActiveLightboxIndex(activeLightboxIndex + 1);
          setZoomLevel(1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeLightboxIndex > 0) {
          setActiveLightboxIndex(activeLightboxIndex - 1);
          setZoomLevel(1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, event]);

  const loadData = async () => {
    setLoading(true);
    try {
      const eventData = await api.get(`/events/${actualId}`);
      setEvent(eventData);
      
      const reviewsData = await api.get(`/reviews/event/${actualId}`);
      setReviews(reviewsData);

      // Fetch Related Events in the same category
      try {
        const relatedRes = await api.get('/events', { params: { category: eventData.category } });
        if (Array.isArray(relatedRes)) {
          setRelatedEvents(relatedRes.filter((e: any) => e.id !== eventData.id).slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load related events:', e);
      }

      try {
        const pData = await api.get('/settings/payment');
        if (pData && pData.value) setPaymentSettings(JSON.parse(pData.value));
      } catch (e) { /* optional */ }

      try {
        const config = await api.get('/payments/config');
        if (config?.keyId) setRazorpayKey(config.keyId);
      } catch (e) { /* optional */ }

      if (session) {
        try {
          const wl = await api.get(`/events/${actualId}/wishlist`);
          setInWishlist(wl.inWishlist);
        } catch (e) { /* optional */ }
      }

      if (eventData.seatSelectionEnabled) {
        const seatData = await api.get(`/events/${actualId}/seats`);
        setSeats(seatData);
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

  const confirmPaymentAndBook = async (finalPaymentMethod: string, razorpayData?: { orderId: string; paymentId: string; signature: string }) => {
    setProcessingPayment(true);
    setBookingError(null);

    try {
      const payload: any = {
        eventId: actualId,
        quantity,
        paymentMethod: event.price === 0 ? 'FREE' : (razorpayData ? 'RAZORPAY' : finalPaymentMethod),
        couponCode: couponCode || undefined,
        selectedSeats: selectedSeats.length > 0 ? selectedSeats : undefined,
      };

      if (razorpayData) {
        payload.razorpayOrderId = razorpayData.orderId;
        payload.razorpayPaymentId = razorpayData.paymentId;
        payload.razorpaySignature = razorpayData.signature;
      } else if (finalPaymentMethod.startsWith('UPI-')) {
        payload.paymentMethod = finalPaymentMethod;
      }

      const bookingRes = await api.post('/bookings', payload);
      setBookingSuccess(bookingRes);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 }, colors: ['#FFD400', '#111827', '#ffffff'] });
      setTimeout(() => router.push('/tickets'), 2500);
    } catch (err: any) {
      setBookingError(err.message || 'Booking failed');
    } finally {
      setProcessingPayment(false);
    }
  };

  const openRazorpayCheckout = () => {
    if (!window.Razorpay) {
      setBookingError('Payment gateway unavailable. Please use UPI/QR or try later.');
      return;
    }
    const subtotal = quantity * event.price;
    const total = Math.max(0, subtotal - discount);
    const amountInCents = Math.round(total * 100);

    const options = {
      key: razorpayKey,
      amount: amountInCents,
      currency: 'INR',
      name: 'EventBooking Premium',
      description: `Access Pass: ${event.title}`,
      handler: function (response: any) {
        confirmPaymentAndBook('RAZORPAY', {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: session?.firstName ? `${session.firstName} ${session.lastName}` : 'Guest',
        email: session?.email || '',
      },
      theme: { color: '#FFD400' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentNext = () => {
    if (paymentMethod === 'CARD') {
      if (event.price === 0) confirmPaymentAndBook('FREE-TXN');
      else openRazorpayCheckout();
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) { router.push('/login'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/reviews`, { eventId: actualId, rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      setReviewRating(5);
      const reviewsData = await api.get(`/reviews/event/${actualId}`);
      setReviews(reviewsData);
    } catch (err) {
      alert('Failed to post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFD400]"></div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="font-black mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>Event not found</h1>
        <Link href="/events" className="btn-secondary">Back to Events</Link>
      </div>
    );
  }

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await api.post('/coupons/validate', { code: couponCode, amount: quantity * event.price });
      if (res.valid) {
        setDiscount(res.discountAmount);
        setBookingError(null);
      } else {
        setBookingError(res.message);
        setDiscount(0);
      }
    } catch (e: any) { setBookingError(e.message); }
  };

  const toggleWishlist = async () => {
    if (!session) { router.push('/login'); return; }
    try {
      if (inWishlist) {
        await api.delete(`/wishlist/${actualId}`);
        setInWishlist(false);
      } else {
        await api.post(`/wishlist/${actualId}`);
        setInWishlist(true);
      }
    } catch (e) { console.error(e); }
  };

  const totalPrice = Math.max(0, quantity * event.price - discount);

  return (
    <div className="w-full pb-24 bg-white">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      {/* Hero Banner */}
      <div className="w-full h-[40vh] md:h-[55vh] relative bg-white border-b border-[#E5E7EB]">
        <img 
          src={resolveImageUrl((event.galleryImages && event.galleryImages[0]) || event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80')} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="absolute bottom-0 w-full px-6 pb-8 pt-20">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="flex-1">
              <span className="inline-block px-3.5 py-1 bg-[#FFD400] text-[#111827] font-bold text-xs uppercase tracking-wider rounded-lg mb-4">
                {event.category}
              </span>
              <h1 className="font-black leading-none mb-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[36px] sm:text-[48px] md:text-[60px] tracking-tight">
                {(() => {
                  const words = event.title.split(' ');
                  if (words.length <= 1) {
                    return <span className="text-[#111827]">{event.title}</span>;
                  }
                  const last = words.pop();
                  const rest = words.join(' ');
                  return (
                    <>
                      <span className="text-[#111827]">{rest}</span>
                      <span className="text-[32px] sm:text-[42px] md:text-[52px] text-[#FFD400]">{last}</span>
                    </>
                  );
                })()}
              </h1>
              {session && (
                <button onClick={toggleWishlist} className="mb-4 flex items-center gap-2 text-sm font-bold text-[#111827]">
                  <Heart size={18} fill={inWishlist ? '#FFD400' : 'none'} className={inWishlist ? 'text-[#FFD400]' : 'text-gray-400'} />
                  {inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-[#6B7280] font-medium text-sm">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-[#FFD400]" /> {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-2"><MapPin size={16} className="text-[#FFD400]" /> {event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section>
            <h2 className="font-black mb-6 flex items-center gap-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
              <Sparkles className="text-[#FFD400]" size={24} /> Experience Overview
            </h2>
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 md:p-10 text-gray-600 text-base leading-relaxed whitespace-pre-line shadow-xs">
              {event.description}
            </div>
          </section>

          {/* Gallery Section */}
          {event.galleryImages && event.galleryImages.length > 1 && (
            <section>
              <h2 className="font-black mb-6 flex items-center gap-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <Sparkles className="text-[#FFD400]" size={24} /> Event Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.galleryImages.slice(1).map((imgUrl: string, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      setActiveLightboxIndex(idx);
                      setZoomLevel(1);
                    }}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-[#E5E7EB] bg-gray-50 cursor-pointer group hover:border-[#FFD400] hover:shadow-md transition-all duration-300"
                  >
                    <img 
                      src={resolveImageUrl(imgUrl)} 
                      alt={`Gallery Image ${idx + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                      <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm">
                        View Image
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Location & Time */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 shadow-xs">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <Calendar size={20} className="text-[#FFD400]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#111827]">Date and Time</h3>
              <p className="text-[#6B7280] text-sm">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-[#6B7280] text-sm font-semibold mt-1">{new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 shadow-xs">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                <MapPin size={20} className="text-[#FFD400]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#111827]">Location</h3>
              <p className="text-[#6B7280] text-sm">{event.location}</p>
              <p className="text-[#FFD400] text-xs font-bold mt-3 cursor-pointer hover:underline">Get Directions →</p>
            </div>
          </section>

          {/* Organizer details */}
          <section className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 shadow-xs">
            <h3 className="text-lg font-bold text-[#111827] mb-2">Organizer Information</h3>
            <p className="text-sm text-gray-500 mb-1">Organized by:</p>
            <p className="text-base font-extrabold text-[#111827]">{event.organizerName || 'Premium Event Organizers'}</p>
            <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
              Professional event hosting dedicated to delivering curated networking, cultural masterclasses, and executive summits.
            </p>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="font-black mb-6 text-[#111827]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Guest Reviews</h2>
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] p-8 space-y-8 shadow-xs">
              {session ? (
                <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] space-y-4">
                  <h4 className="font-bold text-[#111827] text-sm">Share your experience</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110 duration-150">
                        <Star size={20} fill={star <= reviewRating ? '#FFD400' : 'none'} color={star <= reviewRating ? '#FFD400' : '#E5E7EB'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required
                    className="w-full bg-white border border-gray-300 rounded-xl p-4 text-[#111827] focus:outline-none focus:border-[#FFD400] transition-colors resize-none text-sm"
                    placeholder="What did you think of this event?" rows={3}
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary py-2.5 px-6 text-xs">
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] text-center">
                  <p className="text-[#6B7280] text-sm mb-4">You must be logged in to leave a review.</p>
                  <Link href="/login" className="btn-secondary py-2.5 px-6 inline-block text-xs">Log In</Link>
                </div>
              )}

              <div className="space-y-6 pt-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-[#6B7280] py-8 italic text-sm">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((r: any, idx) => (
                    <div key={idx} className="border-b border-[#E5E7EB] pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FFD400] text-gray-900 rounded-full flex items-center justify-center font-bold">
                            {r.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-[#111827] text-sm">{r.userName || 'Anonymous'}</p>
                            <p className="text-xs text-[#9CA3AF]">{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < r.rating ? '#FFD400' : 'none'} color={i < r.rating ? '#FFD400' : '#E5E7EB'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#6B7280] text-sm mt-3 pl-12 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1" id="booking-section">
          <div className="sticky top-28 bg-white border border-[#E5E7EB] rounded-[16px] p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-[#6B7280] text-xs uppercase tracking-wider font-bold">Access Pass</span>
              <div className="text-3xl font-black text-[#111827] mt-1">
                {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
              </div>
              <div className="text-xs text-gray-400 font-bold mt-2">
                <span className="text-[#FFD400] font-black">{event.availableSlots}</span> seats remaining
              </div>
            </div>

            {event.availableSlots <= 0 ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-500 font-bold text-sm">
                <ShieldAlert size={20} /> Event Sold Out
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Quantity</label>
                  <select 
                    value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-white border border-[#D1D5DB] rounded-xl p-3 text-sm text-[#111827] font-bold focus:outline-none focus:border-[#FFD400] cursor-pointer"
                  >
                    {[...Array(Math.min(10, event.availableSlots))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Pass{i > 0 ? 'es' : ''}</option>
                    ))}
                  </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex justify-between items-center text-xs mb-2 text-[#6B7280]">
                    <span>Passes ({quantity}x)</span>
                    <span>{event.price === 0 ? 'Free' : `₹${(event.price * quantity).toLocaleString('en-IN')}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-xs mb-2 text-green-600">
                      <span>Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex gap-2 mb-4">
                    <input type="text" placeholder="Coupon" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-[#111827]" />
                    <button type="button" onClick={applyCoupon} className="btn-secondary py-1 px-3 text-xs">Apply</button>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB] text-sm">
                    <span className="font-bold text-[#111827]">Total</span>
                    <span className="font-black text-[#111827]">₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                  </div>
                </div>

                <button type="submit" className="w-full btn-primary py-3.5 text-sm font-bold shadow-xs">
                  Register Now
                </button>
                <p className="text-center text-[10px] text-gray-400 font-bold flex justify-center items-center gap-1 mt-4">
                  <ShieldAlert size={12} /> Safe & Secure Checkout
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {relatedEvents.length > 0 && (
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 mt-16 pt-16 border-t border-[#E5E7EB]">
          <h2 className="font-black mb-8 text-[#111827]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>Related Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedEvents.map((e: any) => (
              <div key={e.id} className="premium-card flex flex-col justify-between h-full bg-white border border-[#E5E7EB] rounded-[16px] overflow-hidden transition-all duration-[250ms] hover:translate-y-[-4px] hover:shadow-md">
                <Link href={`/events/${e.id}`} className="group block">
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={resolveImageUrl((e.galleryImages && e.galleryImages[0]) || e.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600')} 
                      alt={e.title} 
                      loading="lazy" 
                      className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 bg-gray-900/90 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                      {e.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 group-hover:text-yellow-600 line-clamp-1 mb-2 transition-colors">{e.title}</h4>
                    <p className="text-xs text-gray-400 font-semibold mb-3">{e.location}</p>
                    <span className="font-black text-gray-900 text-base">{e.price === 0 ? 'Free' : `₹${e.price}`}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }} transition={{ duration: 0.2 }} className="bg-white border border-[#E5E7EB] rounded-2xl w-full max-w-md overflow-hidden shadow-lg">
              
              {bookingSuccess ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={32} className="text-[#FFD400]" />
                  </div>
                  <h2 className="text-2xl font-black text-[#111827] mb-2">Ticket Confirmed!</h2>
                  <p className="text-[#6B7280] text-sm mb-6">We've stored your passes in your profile.</p>
                  <button onClick={() => router.push('/tickets')} className="btn-primary w-full py-3">View My Tickets</button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-white">
                    <h3 className="text-lg font-bold text-[#111827]">Checkout</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-[#6B7280] hover:text-[#111827] bg-gray-50 p-1.5 rounded-full"><X size={16} /></button>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-[#E5E7EB] mb-6 text-center">
                      <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wider mb-1">Total Amount Due</p>
                      <h4 className="text-3xl font-black text-gray-900">₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</h4>
                    </div>

                    {event.price > 0 && (
                      <div className="space-y-3 mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Payment Method</p>
                        
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-[#FFD400] bg-yellow-50/10' : 'border-[#E5E7EB] bg-white hover:border-[#FFD400]'}`}>
                          <input type="radio" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="hidden" />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'CARD' ? 'border-[#FFD400]' : 'border-gray-300'}`}>
                            {paymentMethod === 'CARD' && <div className="w-2 h-2 bg-[#FFD400] rounded-full" />}
                          </div>
                          <CreditCard className="mr-3 text-[#6B7280]" size={18} />
                          <span className="font-bold text-sm text-[#111827]">Online Cards / UPI (Razorpay)</span>
                        </label>

                        {paymentSettings?.upiId && (
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[#FFD400] bg-yellow-50/10' : 'border-[#E5E7EB] bg-white hover:border-[#FFD400]'}`}>
                            <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'UPI' ? 'border-[#FFD400]' : 'border-gray-300'}`}>
                              {paymentMethod === 'UPI' && <div className="w-2 h-2 bg-[#FFD400] rounded-full" />}
                            </div>
                            <QrCode className="mr-3 text-[#6B7280]" size={18} />
                            <span className="font-bold text-sm text-[#111827]">Manual UPI QR Check</span>
                          </label>
                        )}
                      </div>
                    )}

                    {paymentMethod === 'UPI' && event.price > 0 ? (
                      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] space-y-4 mb-6">
                        <div className="flex justify-center mb-2">
                          {paymentSettings?.qrCodeUrl ? (
                            <img src={paymentSettings.qrCodeUrl} alt="UPI QR" className="w-40 h-40 rounded-xl border border-[#E5E7EB]" />
                          ) : (
                            <div className="w-40 h-40 bg-[#F9FAFB] rounded-xl flex items-center justify-center text-[#9CA3AF] border border-[#E5E7EB]">No QR Code</div>
                          )}
                        </div>
                        <p className="text-center font-mono font-bold text-xs text-[#111827] bg-[#F9FAFB] py-2 rounded-lg">{paymentSettings?.upiId}</p>
                        <input 
                          type="text" placeholder="Enter 12-digit UPI Ref / UTR No" value={upiTransactionId} onChange={(e) => setUpiTransactionId(e.target.value)} required
                          className="w-full bg-[#F9FAFB] border border-[#D1D5DB] text-[#111827] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FFD400] text-sm"
                        />
                      </div>
                    ) : null}

                    {bookingError && <p className="text-red-500 text-xs font-bold text-center mb-4 bg-red-50 p-2.5 rounded-lg border border-red-100">{bookingError}</p>}

                    <button 
                      onClick={paymentMethod === 'UPI' && event.price > 0 ? () => confirmPaymentAndBook(`UPI-${upiTransactionId}`) : handlePaymentNext}
                      disabled={processingPayment || (paymentMethod === 'UPI' && event.price > 0 && !upiTransactionId.trim())}
                      className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
                    >
                      {processingPayment ? 'Processing...' : `Pay & Book`}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Booking Bar */}
      {!loading && event && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 z-40 flex justify-between items-center shadow-md">
          <div>
            <p className="text-[#6B7280] text-[10px] font-bold uppercase">Price</p>
            <p className="text-lg font-black text-[#111827]">{event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}</p>
          </div>
          <button 
            onClick={() => {
              document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary py-2.5 px-6 text-xs"
          >
            Get Passes
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {activeLightboxIndex !== null && event?.galleryImages && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 bg-black/95 select-none"
            onClick={() => {
              setActiveLightboxIndex(null);
              setZoomLevel(1);
            }}
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center z-20">
              <span className="text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full">
                {activeLightboxIndex + 1} / {event.galleryImages.length - 1}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1);
                  }}
                  className="text-white hover:text-yellow-400 bg-white/10 p-2.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <ZoomIn size={16} /> Zoom ({zoomLevel}x)
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveLightboxIndex(null);
                    setZoomLevel(1);
                  }}
                  className="text-white hover:text-yellow-400 bg-white/10 p-2.5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {/* Prev Button */}
              {activeLightboxIndex > 0 && (
                <button 
                  onClick={() => {
                    setActiveLightboxIndex(activeLightboxIndex - 1);
                    setZoomLevel(1);
                  }}
                  className="absolute left-0 md:left-4 z-10 text-white hover:text-yellow-400 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              {/* Next Button */}
              {activeLightboxIndex < event.galleryImages.length - 2 && (
                <button 
                  onClick={() => {
                    setActiveLightboxIndex(activeLightboxIndex + 1);
                    setZoomLevel(1);
                  }}
                  className="absolute right-0 md:right-4 z-10 text-white hover:text-yellow-400 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              )}

              {/* Image Container */}
              <div className="overflow-hidden max-w-[90%] max-h-full rounded-xl flex items-center justify-center">
                <motion.img 
                  animate={{ scale: zoomLevel }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  src={resolveImageUrl(event.galleryImages.slice(1)[activeLightboxIndex])} 
                  alt="Gallery Lightbox" 
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl cursor-zoom-in"
                  onClick={() => setZoomLevel(prev => prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
