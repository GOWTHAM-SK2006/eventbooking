'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { PageTransition } from './PageTransition';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
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
