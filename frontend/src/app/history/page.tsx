'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getSession } from '../../utils/api';
import { Calendar, Ticket, Download, XCircle, ShieldAlert, CheckCircle, Loader } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This will release your reserved tickets.')) return;
    setCancelLoadingId(bookingId);
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (e) {
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleDownloadTicket = (booking: any) => {
    // Generate a simple print block or simulate downloading a PDF file
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${booking.eventTitle}</title>
          <style>
            body { font-family: sans-serif; background: #fafafa; padding: 40px; display: flex; justify-content: center; }
            .ticket { width: 500px; background: white; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; }
            .header { background: #FF6B00; color: white; padding: 24px; text-align: center; }
            .content { padding: 30px; }
            .item { margin-bottom: 15px; }
            .label { font-size: 11px; color: #888; text-transform: uppercase; font-weight: bold; }
            .value { font-size: 16px; font-weight: bold; margin-top: 3px; }
            .codes { font-family: monospace; font-size: 14px; background: #eee; padding: 10px; border-radius: 4px; margin-top: 5px; }
            .footer { border-top: 1px dashed #ddd; text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h2 style="margin: 0; font-size: 24px;">EVNT. Ticket</h2>
              <div style="font-size: 14px; margin-top: 5px;">Admission Pass</div>
            </div>
            <div class="content">
              <div class="item">
                <div class="label">Event Title</div>
                <div class="value">${booking.eventTitle}</div>
              </div>
              <div class="item">
                <div class="label">Date and Time</div>
                <div class="value">${new Date(booking.eventDate).toLocaleString()}</div>
              </div>
              <div class="item">
                <div class="label">Admission QR Code(s)</div>
                <div class="codes" style="display: flex; gap: 10px; flex-wrap: wrap;">
                  ${booking.ticketCodes.map((c: string) => `
                    <div style="text-align: center; border: 1px solid #ddd; padding: 10px; background: #fff; border-radius: 4px;">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${c}" alt="QR" width="100" />
                      <div style="margin-top: 5px; font-weight: bold; font-family: monospace;">${c}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
            <div class="footer">
              Please present these admission codes or printout at the registration desk for verification.
            </div>
          </div>
          <script>
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0', width: '100%' }}>
        <Loader size={40} className="spin" style={{ animation: 'spin 1s linear infinite', color: '#FF6B00' }} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Bookings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your reservations, download printable passes, or cancel registration.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <h3>No bookings recorded</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>You haven't reserved tickets for any events yet.</p>
          <button onClick={() => router.push('/events')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
            Find Events
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((booking) => {
            const isConfirmed = booking.status === 'CONFIRMED';
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div key={booking.id} className="glass-card fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: 'rgba(255, 107, 0, 0.1)', padding: '0.8rem', borderRadius: '12px' }}>
                      <Ticket size={24} color="#FF6B00" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>{booking.eventTitle}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                        {new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {isConfirmed ? (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <CheckCircle size={14} /> Confirmed
                      </span>
                    ) : (
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#EF4444',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}>
                        <XCircle size={14} /> Cancelled
                      </span>
                    )}

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>₹{booking.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>{booking.quantity} ticket(s)</div>
                    </div>
                  </div>
                </div>

                {/* Admission Codes Panel */}
                {isConfirmed && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dark)', fontWeight: 600, letterSpacing: '0.05em' }}>ADMISSION CODES & QR IDENTIFIERS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '0.8rem' }}>
                      {booking.ticketCodes.map((code: string) => (
                        <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${code}`} 
                            alt="Ticket QR" 
                            style={{ width: '50px', height: '50px', borderRadius: '4px', background: '#FFF', padding: '2px' }}
                          />
                          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#FF8C42', fontWeight: 600 }}>
                            {code}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Row */}
                {isConfirmed && (
                  <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.25rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelLoadingId === booking.id}
                      className="btn-secondary"
                      style={{ padding: '0.5rem 1.2rem', color: '#EF4444', borderColor: 'rgba(239,68,68,0.2)' }}
                    >
                      {cancelLoadingId === booking.id ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="btn-primary"
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                    >
                      <Download size={16} />
                      Download Ticket Pass
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
