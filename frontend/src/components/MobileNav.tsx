'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, History, User } from 'lucide-react';
import { getSession } from '../utils/api';

export default function MobileNav() {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  const navItems = [
    { name: 'Home', href: '/', icon: <Home size={20} /> },
    { name: 'Events', href: '/events', icon: <Calendar size={20} /> },
    ...(session ? [
      { name: 'Tickets', href: '/history', icon: <History size={20} /> },
      { name: 'Profile', href: '/profile', icon: <User size={20} /> },
    ] : [
      { name: 'Log In', href: '/login', icon: <User size={20} /> },
    ])
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-[#050505]/90 backdrop-blur-xl border-t border-[#1E1E1E] pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-[#FF6B00]' : 'text-[#A0A0A0]'}`}>
              <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
