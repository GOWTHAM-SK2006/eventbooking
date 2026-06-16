'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getSession, UserSession } from '../utils/api';
import { Home, Calendar, BookOpen, User, ShieldAlert } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    setSessionState(getSession());
  }, [pathname]);

  const isAdmin = session?.roles.includes('ROLE_ADMIN');

  return (
    <div 
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(15, 15, 15, 0.9)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'none', // Managed by CSS, but set block in media queries
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 99,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <Link href="/" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: pathname === '/' ? '#FF6B00' : '#A3A3A3',
        gap: '2px'
      }}>
        <Home size={20} />
        <span style={{ fontSize: '0.65rem' }}>Home</span>
      </Link>

      <Link href="/events" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: pathname === '/events' ? '#FF6B00' : '#A3A3A3',
        gap: '2px'
      }}>
        <Calendar size={20} />
        <span style={{ fontSize: '0.65rem' }}>Events</span>
      </Link>

      {session && (
        isAdmin ? (
          <Link href="/dashboard" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: pathname.startsWith('/dashboard') ? '#FF6B00' : '#A3A3A3',
            gap: '2px'
          }}>
            <ShieldAlert size={20} />
            <span style={{ fontSize: '0.65rem' }}>Admin</span>
          </Link>
        ) : (
          <Link href="/history" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: pathname === '/history' ? '#FF6B00' : '#A3A3A3',
            gap: '2px'
          }}>
            <BookOpen size={20} />
            <span style={{ fontSize: '0.65rem' }}>Bookings</span>
          </Link>
        )
      )}

      <Link href={session ? "/profile" : "/login"} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: (pathname === '/profile' || pathname === '/login') ? '#FF6B00' : '#A3A3A3',
        gap: '2px'
      }}>
        <User size={20} />
        <span style={{ fontSize: '0.65rem' }}>{session ? 'Profile' : 'Sign In'}</span>
      </Link>
    </div>
  );
}
