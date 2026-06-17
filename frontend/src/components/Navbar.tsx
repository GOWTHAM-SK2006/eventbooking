'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { getSession, clearSession } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSession(getSession());
    
    // Listen for custom login event
    const handleLogin = () => setSession(getSession());
    window.addEventListener('userLogin', handleLogin);
    return () => window.removeEventListener('userLogin', handleLogin);
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Explore', href: '/events' },
    { name: 'My Tickets', href: '/history' },
  ];

  return (
    <nav className="w-full fixed top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,107,0,0.5)]">
              <Calendar size={20} color="white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">EVNT<span className="text-[#FF6B00]">.</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className={`text-sm font-semibold transition-colors hover:text-white ${pathname === link.href ? 'text-[#FF6B00]' : 'text-[#A0A0A0]'}`}>
                {link.name}
              </Link>
            ))}

            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 bg-[#121212] border border-[#1E1E1E] py-2 px-4 rounded-full hover:border-[#FF6B00] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] flex items-center justify-center text-sm font-bold text-white">
                    {session.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-white truncate max-w-[100px]">{session.firstName || 'User'}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-[#121212] border border-[#1E1E1E] rounded-2xl shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-[#1E1E1E] mb-2">
                        <p className="text-sm font-bold text-white truncate">{session.firstName} {session.lastName}</p>
                        <p className="text-xs text-[#A0A0A0] truncate">{session.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#A0A0A0] hover:text-white hover:bg-[#1E1E1E] transition-colors">
                        <User size={16} /> Profile Settings
                      </Link>
                      {session.roles?.includes('ROLE_ADMIN') && (
                        <Link href="/dashboard" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors">
                          <LayoutDashboard size={16} /> Admin Console
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors mt-2 border-t border-[#1E1E1E] pt-3">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-sm font-semibold text-[#A0A0A0] hover:text-white py-2 px-4 transition-colors">Log In</Link>
                <Link href="/signup" className="text-sm font-semibold bg-white text-black py-2 px-6 rounded-full hover:bg-[#FF6B00] hover:text-white transition-all transform hover:scale-105">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
