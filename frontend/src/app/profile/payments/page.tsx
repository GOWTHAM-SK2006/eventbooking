'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, getSession } from '../../../utils/api';
import { 
  ArrowLeft, CreditCard, Calendar, CheckCircle2, 
  Download, HelpCircle, Info, Filter, Search, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function PaymentsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [minAmount, setMinAmount] = useState('');

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push('/login');
      return;
    }
    setSession(sess);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings').catch(() => []);
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings for payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = bookings.filter(b => {
    const matchesSearch = b.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAmount = !minAmount || b.totalPrice >= parseFloat(minAmount);
    return matchesSearch && matchesAmount;
  });

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
                <span>Billing &</span>
                <span className="text-[#EAB308]">Payments</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Manage your digital wallet, invoices, and payment card details</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Saved Cards & Payment methods */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Visual Credit Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 rounded-[20px] shadow-lg relative overflow-hidden aspect-[1.586/1]"
            >
              {/* Card design accents */}
              <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 rounded-full bg-yellow-500/10 blur-xl" />
              <div className="absolute left-[-20px] top-[-20px] w-24 h-24 rounded-full bg-white/5 blur-lg" />
              
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Cardmember</p>
                  <h4 className="text-sm font-black mt-1 tracking-wide">{session ? `${session.firstName} ${session.lastName}` : 'Cardholder Name'}</h4>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                  <CreditCard size={16} className="text-yellow-400" />
                </div>
              </div>

              <div className="mt-10">
                <p className="text-lg font-mono font-black tracking-widest">•••• •••• •••• 9283</p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <div>
                  <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Expiry</p>
                  <p className="text-xs font-black mt-0.5">09/29</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-red-500 opacity-80" />
                  <div className="w-4 h-4 rounded-full bg-yellow-500 -ml-2.5 opacity-80" />
                </div>
              </div>
            </motion.div>

            {/* Wallet & UPI panel */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Other Payment Options</h3>
              
              <div className="space-y-2.5">
                {/* UPI row */}
                <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-white shadow-3xs">
                  <div>
                    <h5 className="font-extrabold text-xs text-gray-900">Google Pay / PhonePe</h5>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">gowtham@okaxis</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 uppercase">Linked</span>
                </div>

                {/* Wallet row */}
                <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl bg-white shadow-3xs">
                  <div>
                    <h5 className="font-extrabold text-xs text-gray-900">Event Wallet Balance</h5>
                    <p className="text-[9px] text-gray-400 font-bold mt-0.5">Quick purchase settlements</p>
                  </div>
                  <span className="font-black text-gray-900 text-xs">₹0.00</span>
                </div>
              </div>

              <button 
                onClick={() => alert('Add payment methods feature is under development.')}
                className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                + Add New Card/UPI
              </button>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-3 p-4 bg-yellow-50/20 border border-yellow-250/50 rounded-2xl">
              <ShieldCheck className="text-[#EAB308] shrink-0" size={18} />
              <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">Payments are processed securely via SSL encryption and PCI-compliant servers.</p>
            </div>

          </div>

          {/* RIGHT SIDE: Transactions & filters */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter controls */}
            <div className="bg-white/80 border border-gray-200/60 rounded-2xl p-5 shadow-3xs backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50/50 border border-gray-200 focus:border-[#FFD400] rounded-xl pl-10 pr-4 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter size={13} className="text-gray-400 shrink-0" />
                <input 
                  type="number"
                  placeholder="Min Amount (₹)..."
                  value={minAmount}
                  onChange={e => setMinAmount(e.target.value)}
                  className="w-full sm:w-40 bg-gray-50/50 border border-gray-200 focus:border-[#FFD400] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>
            </div>

            {/* Transactions Panel */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="text-[#EAB308]" size={16} />
                <span>Transaction & Invoice History</span>
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(n => (
                    <div key={n} className="h-20 bg-gray-150 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Info size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 font-bold">No completed transactions found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map(b => (
                    <div 
                      key={b.id} 
                      className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-center shadow-3xs hover:border-[#FFD400]/40 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest">
                            TXN-{b.id.slice(0, 8).toUpperCase()}
                          </span>
                          <span className="text-[8px] font-black text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded uppercase">
                            Successful
                          </span>
                        </div>
                        <h4 className="font-extrabold text-xs text-gray-900 mt-2">{b.eventTitle}</h4>
                        <p className="text-[9px] text-gray-400 mt-1 font-bold flex items-center gap-1"><CheckCircle2 size={10} className="text-green-600" /> Card Settle Complete</p>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-gray-900 text-sm">₹{b.totalPrice}</p>
                        <button
                          onClick={() => alert(`Invoice statement PDF generated for Order: #${b.id}`)}
                          className="text-[9px] font-black text-[#EAB308] hover:text-[#E6BE00] underline mt-1.5 flex items-center gap-1 justify-end ml-auto"
                        >
                          <Download size={10} />
                          <span>PDF Invoice</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refunds Card */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md">
              <h2 className="text-base font-black text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="text-[#EAB308]" size={16} />
                <span>Refund Requests</span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">No pending ticket cancellation refund statements are registered. Cancelled event order balances automatically reimburse the source account within 5 bank business days.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
