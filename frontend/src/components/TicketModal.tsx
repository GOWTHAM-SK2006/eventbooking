'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Download } from 'lucide-react';
import { api } from '../utils/api';
import type { Ticket } from '../types';

interface TicketModalProps {
  ticketCode: string;
  onClose: () => void;
}

export default function TicketModal({ ticketCode, onClose }: TicketModalProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/tickets/${ticketCode}`).then(setTicket).catch(console.error).finally(() => setLoading(false));
  }, [ticketCode]);

  const downloadTicket = () => {
    if (!ticket?.qrImageBase64) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${ticket.qrImageBase64}`;
    link.download = `ticket-${ticket.ticketCode}.png`;
    link.click();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h3 className="text-xl font-black text-[#111827]">Your Ticket</h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={20} /></button>
          </div>
          <div className="p-6 text-center">
            {loading ? (
              <p className="text-[#6B7280]">Loading ticket...</p>
            ) : ticket ? (
              <>
                <p className="text-sm text-[#6B7280] mb-1">{ticket.eventTitle}</p>
                <p className="font-mono font-bold text-[#FACC15] mb-4">{ticket.ticketCode}</p>
                {ticket.qrImageBase64 ? (
                  <img src={`data:image/png;base64,${ticket.qrImageBase64}`} alt="QR" className="w-48 h-48 mx-auto rounded-xl border-2 border-[#FACC15]" />
                ) : (
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center"><QrCode size={48} className="text-gray-400" /></div>
                )}
                {ticket.seatLabel && <p className="mt-4 font-bold">Seat: {ticket.seatLabel}</p>}
                <p className="text-xs text-[#9CA3AF] mt-2">{new Date(ticket.eventDate).toLocaleString()}</p>
                <button onClick={downloadTicket} className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2">
                  <Download size={18} /> Download QR Ticket
                </button>
              </>
            ) : (
              <p className="text-red-500">Failed to load ticket</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
