'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '../../../utils/api';
import { 
  ArrowLeft, PhoneCall, Mail, MessageSquare, AlertTriangle, 
  HelpCircle, ChevronDown, CheckCircle2, Ticket, LifeBuoy 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function SupportPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  // Form states
  const [supportMsg, setSupportMsg] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Booking Issue');
  const [supportStatus, setSupportStatus] = useState<string | null>(null);

  // FAQ state
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Mock Tickets
  const [tickets, setTickets] = useState([
    { id: 'TKT-8291', category: 'Refund Request', subject: 'Refund delay for Jazz Night Gala ticket', date: 'July 09, 2026', status: 'Pending Review' },
    { id: 'TKT-7182', category: 'Tech Support', subject: 'Digital QR code failing to load on mobile', date: 'June 28, 2026', status: 'Resolved' }
  ]);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
  }, []);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketCategory,
      subject: supportMsg.slice(0, 50) + (supportMsg.length > 50 ? '...' : ''),
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Open'
    };

    setTickets(prev => [newTicket, ...prev]);
    setSupportStatus('Ticket Dispatch Successful');
    setSupportMsg('');
    setTimeout(() => setSupportStatus(null), 4000);
  };

  const faqs = [
    { q: 'How do I download my ticket entry pass?', a: 'Under My Activity, locate digital tickets and click Pass. Your unique ticket pass containing the barcode code will display as an overlay.' },
    { q: 'Can I cancel my event reservation?', a: 'Cancellations and refunds are dictated by the event organizer. If cancellation is allowed, a refund button will automatically display next to the booking record.' },
    { q: 'Where do refund transactions settle?', a: 'Refund balances are processed and credited directly to your origin method of payment (bank debit card, credit card, or UPI wallet).' },
    { q: 'What is referral rewards scoring?', a: 'Referral points are accumulated when users invite friends via their unique referral link. Points are earned once they complete their first event ticket order.' }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />

      <div className="relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
                <span>Support</span>
                <span className="text-[#EAB308]">Desk</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Dispatch support tickets, browse FAQs, and contact help support teams</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Submit ticket & Contact options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Create Support Ticket Form */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                <LifeBuoy className="text-[#EAB308]" size={16} />
                <span>Create Support Ticket</span>
              </h2>

              <AnimatePresence mode="wait">
                {supportStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold shadow-3xs mb-4 flex items-center gap-2"
                  >
                    <CheckCircle2 size={15} />
                    <span>{supportStatus}. Our support desk will address your inquiry shortly.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Issue Category</label>
                  <select 
                    value={ticketCategory}
                    onChange={e => setTicketCategory(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs cursor-pointer"
                  >
                    <option>Booking Issue</option>
                    <option>Payment & Refund Glitch</option>
                    <option>Technical Error</option>
                    <option>Bug Report</option>
                    <option>General Feedback</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider ml-1">Inquiry / Problem Description</label>
                  <textarea 
                    rows={4} 
                    required
                    placeholder="Specify details of event reservation glitches or billing conflicts..."
                    value={supportMsg}
                    onChange={e => setSupportMsg(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 text-xs focus:outline-none focus:border-[#FFD400] text-gray-800 font-semibold shadow-3xs outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary py-2.5 px-6 text-xs font-bold rounded-xl"
                >
                  Dispatch Trouble Ticket
                </button>
              </form>
            </div>

            {/* Quick help channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between items-start shadow-3xs">
                <Mail className="text-[#EAB308] mb-3" size={20} />
                <div>
                  <h5 className="font-extrabold text-xs text-gray-900">Email Support</h5>
                  <p className="text-[9px] text-gray-400 font-semibold mt-0.5">support@eventbooking.com</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between items-start shadow-3xs">
                <PhoneCall className="text-[#EAB308] mb-3" size={20} />
                <div>
                  <h5 className="font-extrabold text-xs text-gray-900">Call Support</h5>
                  <p className="text-[9px] text-gray-400 font-semibold mt-0.5">+1 (800) 289-9832</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-5 rounded-2xl flex flex-col justify-between items-start shadow-3xs">
                <MessageSquare className="text-[#EAB308] mb-3" size={20} />
                <div>
                  <h5 className="font-extrabold text-xs text-gray-900">Live Concierge</h5>
                  <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Online hours: 9AM - 8PM</p>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: Active Support Tickets & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* My Tickets list */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Ticket size={14} />
                <span>My Active Tickets ({tickets.length})</span>
              </h3>

              <div className="space-y-3">
                {tickets.map(t => {
                  const isOpen = t.status === 'Open' || t.status === 'Pending Review';
                  return (
                    <div key={t.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-3xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-black text-gray-400 uppercase">{t.id}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            isOpen ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-900 mt-2 truncate max-w-xs">{t.subject}</h4>
                        <p className="text-[9px] text-gray-400 font-medium mt-0.5">Submitted on {t.date}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#EAB308] bg-yellow-50/40 border border-yellow-250/20 px-2 py-0.5 rounded">
                        {t.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accordion FAQ Box */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle size={14} />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpened = openFaqIdx === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-3xs">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpened ? null : idx)}
                        className="w-full flex justify-between items-center p-3.5 text-left text-xs font-bold text-gray-800 hover:bg-gray-50/50"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpened ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpened && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="p-3.5 pt-0 text-[10px] text-gray-400 font-semibold leading-relaxed border-t border-gray-50">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
