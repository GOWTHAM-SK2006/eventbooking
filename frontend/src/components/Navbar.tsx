'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, clearSession, api, UserSession } from '../utils/api';
import { Calendar, Bell, User as UserIcon, LogOut, Menu, X, CheckSquare, Sparkles } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sess = getSession();
    setSessionState(sess);
    if (sess) {
      fetchNotifications();
    }
  }, [pathname]);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    clearSession();
    setSessionState(null);
    router.push('/');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isAdmin = session?.roles.includes('ROLE_ADMIN');

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(15, 15, 15, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        padding: '1rem 1.5rem',
      }}>
        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C42 100%)',
            padding: '0.4rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={20} color="#FFFFFF" />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1.4rem',
            letterSpacing: '-0.03em',
            color: '#FFFFFF'
          }}>
            EVNT<span style={{ color: '#FF6B00' }}>.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }} className="desktop-links">
          <Link href="/events" style={{
            color: pathname === '/events' ? '#FF6B00' : '#A3A3A3',
            fontSize: '0.95rem',
            fontWeight: 500
          }}>
            Explore Events
          </Link>
          
          {session && (
            <>
              {isAdmin ? (
                <Link href="/dashboard" style={{
                  color: pathname.startsWith('/dashboard') ? '#FF6B00' : '#A3A3A3',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}>
                  Admin Dashboard
                </Link>
              ) : (
                <Link href="/history" style={{
                  color: pathname === '/history' ? '#FF6B00' : '#A3A3A3',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}>
                  My Bookings
                </Link>
              )}
              <Link href="/profile" style={{
                color: pathname === '/profile' ? '#FF6B00' : '#A3A3A3',
                fontSize: '0.95rem',
                fontWeight: 500
              }}>
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
              {/* Notification Bell */}
              <button 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '0.4rem',
                  borderRadius: '50%',
                  transition: '0.2s',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#FF6B00',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    fontSize: '0.65rem',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.75rem',
                  width: '320px',
                  background: '#171717',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  padding: '1rem',
                  zIndex: 200
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead}
                        style={{ background: 'none', border: 'none', color: '#FF6B00', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {notifications.length === 0 ? (
                      <p style={{ color: '#6B7280', fontSize: '0.8rem', textAlign: 'center', padding: '1rem 0' }}>No notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          style={{
                            padding: '0.6rem',
                            borderRadius: '6px',
                            background: notif.read ? 'transparent' : 'rgba(255, 107, 0, 0.05)',
                            borderLeft: notif.read ? 'none' : '3px solid #FF6B00',
                            fontSize: '0.8rem'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.2rem' }}>{notif.title}</div>
                          <div style={{ color: '#A3A3A3' }}>{notif.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Logged-in User indicator */}
              <div className="desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#A3A3A3' }}>Hi, {session.firstName}</span>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#FFFFFF' }}>
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', borderRadius: '6px' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
