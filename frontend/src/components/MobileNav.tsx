'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Heart, Ticket, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Tickets', href: '/tickets', icon: Ticket },
    { name: 'Account', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-50 transition-all duration-300">
      <div 
        className="flex justify-around items-center px-2"
        style={{ 
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)', 
          height: 'calc(4rem + env(safe-area-inset-bottom, 0px))',
          paddingTop: '8px'
        }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);

          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="flex-1 flex flex-col items-center justify-center h-full relative cursor-pointer select-none"
            >
              {/* Active Background Glow */}
              {isActive && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute w-12 h-12 bg-[#FACC15]/10 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container with Micro-Interactions */}
              <motion.div
                animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-[#EAB308]' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>

              {/* Label */}
              <span 
                className={`text-[10px] font-bold tracking-tight transition-colors duration-200 mt-0.5 ${
                  isActive ? 'text-[#111827]' : 'text-gray-400 font-semibold'
                }`}
              >
                {item.name}
              </span>

              {/* Little Active Dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute bottom-1 w-1.5 h-1.5 bg-[#FACC15] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
