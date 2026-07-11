'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Percent, Calendar } from 'lucide-react';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function OffersPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />
      <div className="relative z-10">
        <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
          <span>Exclusive</span> <span className="text-[#EAB308]">Offers</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-3xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center border border-yellow-100 shrink-0">
              <Tag className="text-[#EAB308]" size={20} />
            </div>
            <div>
              <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-50 text-[#EAB308] border border-yellow-150 px-2 py-0.5 rounded">SUMMER26</span>
              <h4 className="font-extrabold text-sm text-gray-900 mt-2">15% Off Summer Festivals</h4>
              <p className="text-xs text-gray-400 font-semibold mt-1">Get flat 15% discount on all outdoor concerts and events.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
