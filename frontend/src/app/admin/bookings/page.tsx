'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Download, Search, FileSpreadsheet } from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const filtered = bookings.filter(b => {
      const matchesSearch = b.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            b.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const headers = ['Booking ID', 'Event Title', 'User Email', 'Quantity', 'Total Price', 'Status', 'Booking Date'];
    const rows = filtered.map(b => [
      b.id,
      b.eventTitle,
      b.userEmail,
      b.quantity,
      b.totalPrice,
      b.status,
      new Date(b.bookingDate || b.createdAt || '').toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bookings_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.eventTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-black text-gray-900 leading-none">Bookings</div>
          <p className="text-sm text-gray-500 font-semibold mt-1">Audit customer ticket reservations and registration records</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-stretch md:items-center">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'CONFIRMED', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s 
                  ? 'bg-yellow-400 text-gray-900 shadow-xs' 
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900'
              }`}
            >
              {s === 'ALL' ? 'View All Bookings' : s === 'CONFIRMED' ? 'Approved Bookings' : 'Cancelled Bookings'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-60">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user or event..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400 w-full"
            />
          </div>
          <button onClick={exportToCSV} className="bg-white border border-gray-200 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-gray-50 flex items-center gap-1.5 shrink-0 shadow-xs">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50 text-gray-400 font-semibold"><th className="text-left p-4">Booking ID</th><th className="text-left p-4">User Email</th><th className="text-left p-4">Event Title</th><th className="text-left p-4">Tickets</th><th className="text-left p-4">Status</th><th className="text-right p-4">Total Price</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-yellow-50/40 transition-colors duration-150">
                  <td className="p-4 font-mono text-xs text-gray-400">{b.id.slice(0, 8)}...</td>
                  <td className="p-4 text-gray-950 font-bold">{b.userEmail}</td>
                  <td className="p-4 text-gray-600 font-medium">{b.eventTitle}</td>
                  <td className="p-4 text-gray-500 font-black">{b.quantity}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                      b.status === 'CONFIRMED' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-gray-950 font-black">₹{b.totalPrice.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 font-medium">No bookings match the parameters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
