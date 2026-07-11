'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FloatingBlobs } from '../../components/AnimatedBackground';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />
      <div className="relative z-10">
        <Link href="/profile" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
          <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </Link>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
          <span>Privacy</span> <span className="text-[#EAB308]">Policy</span>
        </h1>
        <div className="max-w-3xl bg-white border border-gray-200 p-8 rounded-3xl shadow-3xs space-y-4 text-xs font-semibold text-gray-500 leading-relaxed">
          <p>We process profile names, booking histories, and payment logs exclusively to confirm access code authorization. Your data stays encrypted. No advertising cookies or credentials details are shared with external marketing brokers.</p>
        </div>
      </div>
    </div>
  );
}
