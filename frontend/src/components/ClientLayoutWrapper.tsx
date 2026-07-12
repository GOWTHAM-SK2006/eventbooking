'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { PageTransition } from './PageTransition';
import { Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');
  
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);
  // Navigation Progress Bar State
  const [navLoading, setNavLoading] = useState(false);

  useEffect(() => {
    // Hide splash screen after a short delay
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Listen to pathname changes to show a premium top loading bar
  useEffect(() => {
    setNavLoading(true);
    const timer = setTimeout(() => {
      setNavLoading(false);
    }, 450); // fast transition
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* App Splash Loader */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center space-y-6">
              {/* EventBooking Logo */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-center gap-3.5"
              >
                <div className="w-14 h-14 bg-[#FFD400] rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar size={28} className="text-slate-950" />
                </div>
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  EventBooking<span className="text-[#FFD400]">.</span>
                </span>
              </motion.div>

              {/* Progress message & indicator */}
              <div className="flex flex-col items-center space-y-3.5 pt-4">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                  Loading your experience
                </span>
                {/* Slim yellow progress bar */}
                <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: 'easeInOut'
                    }}
                    className="absolute top-0 bottom-0 w-1/2 bg-[#FFD400] rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation progress bar */}
      <AnimatePresence>
        {navLoading && (
          <motion.div
            initial={{ width: '0%', opacity: 1 }}
            animate={{ width: '90%' }}
            exit={{ width: '100%', opacity: 0 }}
            transition={{
              width: { duration: 0.45, ease: 'easeOut' },
              opacity: { duration: 0.15, delay: 0.05 }
            }}
            className="fixed top-0 left-0 h-1 bg-[#FFD400] z-[999] shadow-[0_1px_10px_rgba(250,204,21,0.5)]"
          />
        )}
      </AnimatePresence>

      {!isAdmin && <Navbar />}
      <main className={`flex-1 flex flex-col w-full ${isAdmin ? '' : 'mt-20 items-center'}`}>
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      {!isAdmin && <MobileNav />}
    </>
  );
}
