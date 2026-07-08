'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Calendar, User, LogOut, LayoutDashboard, Bell, Heart } from 'lucide-react';
import { getSession, clearSession } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSession(getSession());
    const handleLogin = () => setSession(getSession());
    const handleLogout = () => setSession(null);
    window.addEventListener('userLogin', handleLogin);
    window.addEventListener('userLogout', handleLogout);
    window.addEventListener('sessionUpdate', handleLogin);
    return () => {
      window.removeEventListener('userLogin', handleLogin);
      window.removeEventListener('userLogout', handleLogout);
      window.removeEventListener('sessionUpdate', handleLogin);
    };
  }, [pathname]);

  const handleLogout = () => {
    clearSession();
    setSession(null);
    router.push('/login');
  };

  const navLinks = [
    { name: 'Explore', href: '/events' },
    { name: 'My Tickets', href: '/tickets' },
    ...(session ? [{ name: 'Wishlist', href: '/wishlist' }] : []),
  ];

  return (
    <nav className="w-full fixed top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 w-full">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all">
              <Calendar size={20} className="text-[#111827]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#111827]">EventBooking<span className="text-[#FACC15]">.</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className={`text-sm font-semibold transition-colors ${pathname === link.href ? 'text-[#FACC15]' : 'text-[#6B7280] hover:text-[#111827]'}`}>
                {link.name}
              </Link>
            ))}

            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 bg-gray-100 border border-gray-200 py-2 px-4 rounded-full hover:border-[#FACC15] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FACC15] flex items-center justify-center text-sm font-bold text-[#111827]">
                    {session.firstName?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-[#111827] truncate max-w-[100px]">{session.firstName || 'User'}</span>
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-200 mb-2">
                        <p className="text-sm font-bold text-[#111827] truncate">{session.firstName} {session.lastName}</p>
                        <p className="text-xs text-[#6B7280] truncate">{session.email}</p>
                      </div>
                      <Link href="/notifications" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                        <Bell size={16} /> Notifications
                      </Link>
                      <Link href="/wishlist" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                        <Heart size={16} /> Wishlist
                      </Link>
                      <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors">
                        <User size={16} /> Profile Settings
                      </Link>
                      {session.roles?.includes('ROLE_ADMIN') && (
                        <Link href="/admin/dashboard" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[#FACC15] hover:bg-yellow-50 transition-colors">
                          <LayoutDashboard size={16} /> Admin Console
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-200 pt-3">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-sm font-semibold text-[#6B7280] hover:text-[#111827] py-2 px-4 transition-colors">Log In</Link>
                <Link href="/signup" className="text-sm font-semibold bg-[#FACC15] text-[#111827] py-2 px-6 rounded-full hover:bg-[#EAB308] transition-all font-bold">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
