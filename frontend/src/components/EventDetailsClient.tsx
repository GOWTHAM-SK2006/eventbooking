'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../utils/api';
import { Calendar, MapPin, Tag, Users, ShieldAlert, Sparkles, CreditCard, ChevronRight, Star, Loader, CheckCircle, X, QrCode } from 'lucide-react';
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

  const session = getSession();

  useEffect(() => {
    if (actualId) loadData();
  }, [actualId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const eventData = await api.get(`/events/${actualId}`);
      setEvent(eventData);
      
      const reviewsData = await api.get(`/reviews/event/${actualId}`);
      setReviews(reviewsData);

      try {
        const pData = await api.get('/settings/payment');
        if (pData && pData.value) setPaymentSettings(JSON.parse(pData.value));
      } catch (e) { console.warn("No payment settings"); }
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

    const isRazorpay = finalPaymentMethod.startsWith('RAZORPAY');

    try {
      const payload = {
        eventId: actualId,
        quantity,
        paymentMethod: isRazorpay ? 'CARD' : 'UPI',
        transactionId: isRazorpay ? finalPaymentMethod.split('-')[1] : finalPaymentMethod.split('-')[1] || 'CASH-TXN'
      };

      const bookingRes = await api.post('/bookings', payload);
      
      setBookingSuccess(bookingRes);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FF6B00', '#FF8C42', '#ffffff'] });
      setTimeout(() => {
        router.push('/history');
      }, 3000);
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
    const totalPrice = quantity * event.price;
    const amountInCents = Math.round(totalPrice * 100);

    const options = {
      key: 'rzp_test_T2NUwSm1uqZZrX',
      amount: amountInCents,
      currency: 'INR',
      name: 'EventBooking Premium',
      description: `Access Pass: ${event.title}`,
      handler: function (response: any) {
        confirmPaymentAndBook(`RAZORPAY-${response.razorpay_payment_id}`);
      },
      prefill: {
        name: session?.firstName ? `${session.firstName} ${session.lastName}` : 'Guest',
        email: session?.email || '',
      },
      theme: { color: '#FF6B00' }
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

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><Loader size={40} className="spin text-[#FF6B00]" /></div>;
  
  if (!event) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-3xl font-black mb-4">Event not found</h1>
      <Link href="/events" className="btn-secondary">Back to Events</Link>
    </div>
  );

  const totalPrice = quantity * event.price;

  return (
    <div className="w-full pb-24">
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

      {/* Hero Banner */}
      <div className="w-full h-[50vh] md:h-[65vh] relative bg-[#050505]">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        
        <div className="absolute bottom-0 w-full px-4 pb-12 pt-32">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="flex-1">
              <span className="inline-block px-4 py-1.5 bg-[#FF6B00] text-white font-bold text-sm uppercase tracking-wider rounded-lg mb-4 shadow-[0_0_20px_rgba(255,107,0,0.4)]">
                {event.category}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                {event.title}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-white/80 font-medium">
                <span className="flex items-center gap-2 text-lg"><Calendar size={20} className="text-[#FF6B00]" /> {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span className="flex items-center gap-2 text-lg"><MapPin size={20} className="text-[#FF6B00]" /> {event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3"><Sparkles className="text-[#FF6B00]" /> Experience Overview</h2>
            <div className="glass-card p-8 md:p-10 text-[#A0A0A0] text-lg leading-relaxed whitespace-pre-line border-l-4 border-l-[#FF6B00]">
              {event.description}
            </div>
          </section>

          {/* Location & Time */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 border border-[#1E1E1E]">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6 border border-[#2A2A2A]">
                <Calendar size={24} className="text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Date and Time</h3>
              <p className="text-[#A0A0A0]">{new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-[#A0A0A0] font-medium mt-1">{new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            
            <div className="glass-card p-8 border border-[#1E1E1E]">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mb-6 border border-[#2A2A2A]">
                <MapPin size={24} className="text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Location</h3>
              <p className="text-[#A0A0A0]">{event.location}</p>
              <p className="text-[#FF6B00] text-sm font-semibold mt-3 cursor-pointer hover:underline">Get Directions →</p>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-black mb-6">Guest Reviews</h2>
            <div className="glass-card p-8 space-y-8">
              {session ? (
                <form onSubmit={handleReviewSubmit} className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1E1E1E]">
                  <h4 className="font-bold mb-4 text-white">Share your experience</h4>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star size={24} fill={star <= reviewRating ? '#FF6B00' : 'none'} color={star <= reviewRating ? '#FF6B00' : '#333'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} required
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl p-4 text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-colors mb-4 resize-none"
                    placeholder="What did you think of this event?" rows={3}
                  />
                  <button type="submit" disabled={submittingReview} className="btn-primary py-2 px-6 text-sm">
                    {submittingReview ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1E1E1E] text-center">
                  <p className="text-[#A0A0A0] mb-4">You must be logged in to leave a review.</p>
                  <Link href="/login" className="btn-secondary py-2 px-6 inline-block text-sm">Log In</Link>
                </div>
              )}

              <div className="space-y-6 pt-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-[#A0A0A0] py-8 italic">No reviews yet. Be the first!</p>
                ) : (
                  reviews.map((r: any, idx) => (
                    <div key={idx} className="border-b border-[#1E1E1E] pb-6 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                            {r.userName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white">{r.userName || 'Anonymous'}</p>
                            <p className="text-xs text-[#555]">{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < r.rating ? '#FF6B00' : 'none'} color={i < r.rating ? '#FF6B00' : '#333'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#A0A0A0] mt-3 pl-13 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1" id="booking-section">
          <div className="sticky top-28 glass-card border-t-4 border-t-[#FF6B00] shadow-2xl">
            <div className="p-8">
              <div className="mb-8">
                <span className="text-[#A0A0A0] text-sm uppercase tracking-wider font-bold">Access Pass</span>
                <div className="text-4xl font-black text-white mt-1">
                  {event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}
                </div>
              </div>

              {event.availableSlots <= 0 ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-500 font-bold">
                  <ShieldAlert size={24} /> Event Sold Out
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Select Quantity</label>
                    <select 
                      value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-white font-bold focus:outline-none focus:border-[#FF6B00] appearance-none cursor-pointer"
                    >
                      {[...Array(Math.min(10, event.availableSlots))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} Pass{i > 0 ? 'es' : ''}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1E1E1E]">
                    <div className="flex justify-between items-center text-sm mb-2 text-[#A0A0A0]">
                      <span>Passes ({quantity}x)</span>
                      <span>{event.price === 0 ? 'Free' : `₹${(event.price * quantity).toLocaleString('en-IN')}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-4 text-[#A0A0A0]">
                      <span>Fees & Taxes</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[#1E1E1E]">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-black text-xl text-[#FF6B00]">₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                    </div>
                  </div>

                  <button type="submit" className="w-full btn-primary py-4 text-lg font-black shadow-[0_10px_30px_rgba(255,107,0,0.3)]">
                    Reserve Spot Now
                  </button>
                  <p className="text-center text-xs text-[#555] mt-4 flex justify-center items-center gap-1">
                    <ShieldAlert size={12} /> Secure checkout powered by EventBooking
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#121212] border border-[#1E1E1E] rounded-3xl w-full max-w-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              {bookingSuccess ? (
                <div className="p-6 sm:p-10 text-center flex flex-col items-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-24 h-24 bg-[#FF6B00]/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle size={48} className="text-[#FF6B00]" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-white mb-2">Ticket Confirmed!</h2>
                  <p className="text-[#A0A0A0] mb-8">We've sent the details to your email.</p>
                  <button onClick={() => router.push('/history')} className="btn-primary w-full py-4">View My Tickets</button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-[#1E1E1E] flex justify-between items-center bg-[#0A0A0A]">
                    <h3 className="text-xl font-bold text-white">Checkout</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-[#A0A0A0] hover:text-white transition-colors bg-[#1A1A1A] p-2 rounded-full"><X size={20} /></button>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-[#050505] p-4 sm:p-6 rounded-2xl border border-[#1E1E1E] mb-6 sm:mb-8 text-center">
                      <p className="text-[#A0A0A0] text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">Total Amount Due</p>
                      <h4 className="text-3xl sm:text-4xl font-black text-[#FF6B00]">₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits:2})}</h4>
                    </div>

                    {event.price > 0 && (
                      <div className="space-y-3 mb-8">
                        <p className="text-sm font-bold text-white mb-4">Select Payment Method</p>
                        
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'CARD' ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#444]'}`}>
                          <input type="radio" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="hidden" />
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'CARD' ? 'border-[#FF6B00]' : 'border-[#555]'}`}>
                            {paymentMethod === 'CARD' && <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full" />}
                          </div>
                          <CreditCard className="mr-3 text-[#A0A0A0]" size={20} />
                          <span className="font-bold text-white">Cards, NetBanking, Wallets</span>
                        </label>

                        {paymentSettings?.upiId && (
                          <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[#FF6B00] bg-[#FF6B00]/5' : 'border-[#2A2A2A] bg-[#1A1A1A] hover:border-[#444]'}`}>
                            <input type="radio" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} className="hidden" />
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${paymentMethod === 'UPI' ? 'border-[#FF6B00]' : 'border-[#555]'}`}>
                              {paymentMethod === 'UPI' && <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-full" />}
                            </div>
                            <QrCode className="mr-3 text-[#A0A0A0]" size={20} />
                            <span className="font-bold text-white">Manual UPI / QR Code</span>
                          </label>
                        )}
                      </div>
                    )}

                    {paymentMethod === 'UPI' && event.price > 0 ? (
                      <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1E1E1E] space-y-4 mb-8">
                        <div className="flex justify-center mb-4">
                          {paymentSettings?.qrCodeUrl ? (
                            <img src={paymentSettings.qrCodeUrl} alt="UPI QR" className="w-48 h-48 rounded-xl border border-[#333]" />
                          ) : (
                            <div className="w-48 h-48 bg-[#1A1A1A] rounded-xl flex items-center justify-center text-[#555] border border-[#333]">No QR Set</div>
                          )}
                        </div>
                        <p className="text-center font-mono font-bold text-white bg-[#1A1A1A] py-2 rounded-lg">{paymentSettings?.upiId}</p>
                        <input 
                          type="text" placeholder="Enter 12-digit UTR/Ref No" value={upiTransactionId} onChange={(e) => setUpiTransactionId(e.target.value)} required
                          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF6B00] font-medium"
                        />
                      </div>
                    ) : null}

                    {bookingError && <p className="text-red-500 text-sm font-bold text-center mb-6 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{bookingError}</p>}

                    <button 
                      onClick={paymentMethod === 'UPI' && event.price > 0 ? () => confirmPaymentAndBook(`UPI-${upiTransactionId}`) : handlePaymentNext}
                      disabled={processingPayment || (paymentMethod === 'UPI' && event.price > 0 && !upiTransactionId.trim())}
                      className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                    >
                      {processingPayment ? <Loader className="spin" size={24} /> : `Pay ₹${totalPrice.toLocaleString('en-IN')} & Book`}
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
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-[#121212] border-t border-[#1E1E1E] p-4 z-40 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div>
            <p className="text-[#A0A0A0] text-xs font-bold uppercase">Price</p>
            <p className="text-xl font-black text-white">{event.price === 0 ? 'Free' : `₹${event.price.toLocaleString('en-IN')}`}</p>
          </div>
          <button 
            onClick={() => {
              document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary py-3 px-8 text-sm"
          >
            Get Passes
          </button>
        </div>
      )}

    </div>
  );
}
