'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Share2, Star, Shield, Scale, Info, 
  ExternalLink, Github, Twitter, Linkedin, MessageCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingBlobs } from '../../../components/AnimatedBackground';

export default function MorePage() {
  const socialLinks = [
    { label: 'GitHub', icon: <Github size={16} />, url: 'https://github.com', color: 'hover:text-gray-900 hover:border-gray-900' },
    { label: 'Twitter', icon: <Twitter size={16} />, url: 'https://twitter.com', color: 'hover:text-blue-400 hover:border-blue-400' },
    { label: 'LinkedIn', icon: <Linkedin size={16} />, url: 'https://linkedin.com', color: 'hover:text-blue-700 hover:border-blue-700' },
    { label: 'Discord', icon: <MessageCircle size={16} />, url: 'https://discord.com', color: 'hover:text-indigo-500 hover:border-indigo-500' }
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-12 md:py-24 min-h-screen relative bg-white text-[#111827]">
      <FloatingBlobs />

      <div className="relative z-10">
        
        {/* Navigation & Header */}
        <div className="mb-10">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
                <span>More</span>
                <span className="text-[#EAB308]">Details</span>
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-1.5">Platform terms of service, licenses, rating options, and socials</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Actions & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Share & Rate Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button 
                onClick={() => alert('Referral Link copied: eventbooking-app.in')}
                className="bg-white border border-gray-200 p-5 rounded-2xl text-left flex flex-col justify-between items-start hover:border-[#FFD400] transition-colors shadow-3xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center text-[#EAB308] group-hover:bg-[#FFD400] group-hover:text-gray-900 transition-colors mb-4">
                  <Share2 size={16} />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-gray-900">Share App</h5>
                  <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Spread EventBooking to friends.</p>
                </div>
              </button>

              <button 
                onClick={() => alert('Thank you for rating our application!')}
                className="bg-white border border-gray-200 p-5 rounded-2xl text-left flex flex-col justify-between items-start hover:border-[#FFD400] transition-colors shadow-3xs group"
              >
                <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center text-[#EAB308] group-hover:bg-[#FFD400] group-hover:text-gray-900 transition-colors mb-4">
                  <Star size={16} className="fill-current" />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-gray-900">Rate Platform</h5>
                  <p className="text-[9px] text-gray-400 font-semibold mt-0.5">Write reviews on application stores.</p>
                </div>
              </button>

            </div>

            {/* Social Connect Badge */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 shadow-xs backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Connect with Us</h3>
              
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-white text-gray-700 text-xs font-bold shadow-3xs transition-all ${link.color}`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* About platform metadata */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-3xl space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Info size={14} />
                <span>About Platform</span>
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                EventBooking is a modern ticketing platform catering to local community events, live music performances, and startup developer summits.
              </p>
              <div className="border-t border-gray-200 pt-3 text-[9px] text-gray-400 font-bold space-y-1">
                <p>Monolith Version: <strong>v3.0.0-PROD</strong></p>
                <p>Author: Gowtham S</p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Terms & Policies */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Terms and policies wrapper */}
            <div className="bg-white/80 border border-gray-200/60 rounded-3xl p-6 md:p-8 shadow-xs backdrop-blur-md space-y-6">
              
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Scale size={15} />
                  <span>Terms & Conditions Summary</span>
                </h3>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                  By checking out event passes, you confirm binding adherence to organizer guidelines. Platform reserves the right to suspend accounts engaged in ticket resale or black-market transfers. Refund claims must satisfy individual host policy checklists.
                </p>
              </div>

              <div className="border-t border-gray-150 pt-5 space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={15} />
                  <span>Privacy Policy & Consent</span>
                </h3>
                <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
                  We process profile names, booking histories, and payment logs exclusively to confirm access code authorization. Your data stays encrypted. No advertising cookies or credentials details are shared with external marketing brokers.
                </p>
              </div>

              {/* External policy files */}
              <div className="border-t border-gray-150 pt-5 space-y-2">
                <a 
                  href="#terms" 
                  onClick={() => alert('Full Terms & Conditions index is simulated.')}
                  className="flex justify-between items-center py-2.5 text-xs font-extrabold text-gray-800 hover:text-[#EAB308] border-b border-gray-50 transition-colors"
                >
                  <span>Review full Terms of Service</span>
                  <ExternalLink size={13} />
                </a>

                <a 
                  href="#privacy" 
                  onClick={() => alert('Full Privacy Policy index is simulated.')}
                  className="flex justify-between items-center py-2.5 text-xs font-extrabold text-gray-800 hover:text-[#EAB308] border-b border-gray-50 last:border-0 transition-colors"
                >
                  <span>Review full Privacy Policy</span>
                  <ExternalLink size={13} />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
