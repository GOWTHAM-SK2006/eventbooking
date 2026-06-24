'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../../utils/api';
import { Download, RefreshCw } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        api.get('/payments').catch(() => []),
        api.get('/payments/refunds/all').catch(() => [])
      ]);
      setPayments(p);
      setRefunds(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefund = async (id: string, status: string) => {
    try {
      await api.put(`/payments/refunds/${id}?status=${status}`);
      alert(`Refund has been ${status.toLowerCase()}!`);
      loadData();
    } catch (err) {
      alert('Failed to process refund');
    }
  };

  const exportPayments = () => {
    const headers = ['Payment ID', 'Event Title', 'Invoice Number', 'Method', 'Amount', 'GST Amount', 'Status', 'Date'];
    const rows = payments.map(p => [
      p.id,
      p.eventTitle || 'N/A',
      p.invoiceNumber || 'N/A',
      p.paymentMethod || 'N/A',
      p.amount,
      p.gstAmount || 0,
      p.status || 'SUCCESS',
      new Date(p.createdAt || '').toLocaleString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payments_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-3xl font-black text-gray-900 leading-none">Payments</div>
          <p className="text-sm text-gray-500 font-semibold mt-1">Audit transactions, refunds, and financial logs</p>
        </div>
        <button onClick={exportPayments} className="bg-white border border-gray-200 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-gray-50 flex items-center gap-1.5 shadow-xs transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Payment History Block */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
        <div className="text-lg font-black text-gray-900">Transaction History</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50 text-gray-400 font-semibold"><th className="text-left py-3 px-4">Invoice Number</th><th className="text-left py-3 px-4">Event Title</th><th className="text-left py-3 px-4">Method</th><th className="text-right py-3 px-4">GST (18%)</th><th className="text-right py-3 px-4">Amount</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-yellow-50/40 transition-colors duration-150">
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-900">{p.invoiceNumber || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-gray-600 font-bold max-w-[200px] truncate">{p.eventTitle || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-gray-400 font-semibold uppercase">{p.paymentMethod || 'Razorpay'}</td>
                  <td className="py-3.5 px-4 text-right text-gray-500 font-semibold">₹{(p.gstAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right text-gray-950 font-black">₹{p.amount.toLocaleString('en-IN')}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No transactions recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Management Block */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="text-red-500" size={18} />
          <div className="text-lg font-black text-gray-900">Refund Requests</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50/50 text-gray-400 font-semibold"><th className="text-left py-3 px-4">Refund ID</th><th className="text-left py-3 px-4">Status</th><th className="text-left py-3 px-4">Requested At</th><th className="text-right py-3 px-4">Refund Amount</th><th className="text-right py-3 px-4">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refunds.map(rf => (
                <tr key={rf.id} className="hover:bg-yellow-50/40 transition-colors duration-150">
                  <td className="py-3.5 px-4 font-mono text-xs text-gray-400">{rf.id.slice(0, 8)}...</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      rf.status === 'COMPLETED' || rf.status === 'APPROVED'
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : rf.status === 'PENDING'
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                      {rf.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-400 text-xs font-semibold">{new Date(rf.createdAt || '').toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-gray-950 font-black">₹{(rf.refundAmount || rf.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-right">
                    {rf.status === 'PENDING' && (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleProcessRefund(rf.id, 'APPROVED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all shadow-xs"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleProcessRefund(rf.id, 'REJECTED')}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-all shadow-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">No refund requests recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
