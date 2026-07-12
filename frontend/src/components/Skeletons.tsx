'use client';

import React from 'react';
import { motion } from 'framer-motion';

// A single shimmering bar helper
export const ShimmerBar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`shimmer rounded-md ${className}`} />
  );
};

// 1. Hero Skeleton (Home Page)
export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center py-16 px-6 text-center">
      {/* Sparkles capsule */}
      <ShimmerBar className="w-48 h-8 rounded-full mb-6" />
      {/* Big Header Title */}
      <ShimmerBar className="w-full max-w-2xl h-14 sm:h-20 mb-4" />
      <ShimmerBar className="w-3/4 max-w-md h-14 mb-8" />
      {/* Description */}
      <ShimmerBar className="w-11/12 max-w-xl h-5 mb-3" />
      <ShimmerBar className="w-5/6 max-w-lg h-5 mb-10" />
      {/* Search Input Box */}
      <ShimmerBar className="w-full max-w-2xl h-16 rounded-2xl mb-12" />
      {/* Categories Grid */}
      <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ShimmerBar key={i} className="w-28 h-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

// 2. Event Card Skeleton
export const EventCardSkeleton: React.FC = () => {
  return (
    <div className="border border-[#E5E7EB] rounded-[16px] overflow-hidden bg-white shadow-xs flex flex-col justify-between h-[416px]">
      <div>
        {/* Image Area */}
        <ShimmerBar className="w-full h-52 rounded-none" />
        <div className="p-6 space-y-4">
          {/* Date row */}
          <div className="flex items-center gap-2">
            <ShimmerBar className="w-4 h-4 rounded-full" />
            <ShimmerBar className="w-24 h-4" />
          </div>
          {/* Title */}
          <ShimmerBar className="w-11/12 h-6" />
          {/* Description lines */}
          <div className="space-y-2">
            <ShimmerBar className="w-full h-4" />
            <ShimmerBar className="w-5/6 h-4" />
          </div>
        </div>
      </div>
      {/* Footer Area */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div className="space-y-1">
          <ShimmerBar className="w-10 h-3" />
          <ShimmerBar className="w-16 h-5" />
        </div>
        <ShimmerBar className="w-20 h-7 rounded-lg" />
      </div>
    </div>
  );
};

// 3. Grid of Event Cards
export const EventGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
};

// 4. Horizontal/Upcoming Event Card Skeleton
export const UpcomingEventCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-start gap-5 w-full">
      <ShimmerBar className="w-28 h-28 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-3">
        <ShimmerBar className="w-16 h-4 rounded-md" />
        <ShimmerBar className="w-11/12 h-6" />
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <ShimmerBar className="w-3.5 h-3.5 rounded-full" />
            <ShimmerBar className="w-32 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <ShimmerBar className="w-3.5 h-3.5 rounded-full" />
            <ShimmerBar className="w-24 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Event Details Page Skeleton
export const EventDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content (Left Column) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Banner image */}
        <ShimmerBar className="w-full h-80 sm:h-[450px] rounded-2xl" />
        {/* Title & Tags */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <ShimmerBar className="w-20 h-6 rounded-full" />
            <ShimmerBar className="w-28 h-6 rounded-full" />
          </div>
          <ShimmerBar className="w-full h-12" />
          <ShimmerBar className="w-3/4 h-12" />
        </div>
        {/* Host/Organizer */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-100">
          <ShimmerBar className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <ShimmerBar className="w-32 h-4.5" />
            <ShimmerBar className="w-24 h-3.5" />
          </div>
        </div>
        {/* Details section */}
        <div className="space-y-4 pt-4">
          <ShimmerBar className="w-36 h-6" />
          <div className="space-y-2.5">
            <ShimmerBar className="w-full h-4" />
            <ShimmerBar className="w-full h-4" />
            <ShimmerBar className="w-11/12 h-4" />
            <ShimmerBar className="w-5/6 h-4" />
          </div>
        </div>
      </div>

      {/* Ticket/Checkout Panel (Right Column) */}
      <div className="lg:col-span-4">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="space-y-2">
            <ShimmerBar className="w-20 h-4" />
            <ShimmerBar className="w-28 h-8" />
          </div>
          <hr className="border-gray-100" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <ShimmerBar className="w-24 h-4.5" />
              <ShimmerBar className="w-16 h-4.5" />
            </div>
            <div className="flex justify-between">
              <ShimmerBar className="w-32 h-4.5" />
              <ShimmerBar className="w-12 h-4.5" />
            </div>
          </div>
          <ShimmerBar className="w-full h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

// 6. User Profile Page Skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <ShimmerBar className="w-48 h-8" />
        <ShimmerBar className="w-96 h-5" />
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Profile Card */}
        <div className="lg:col-span-4 space-y-6 bg-white border border-slate-200/60 rounded-3xl p-8 shadow-3xs flex flex-col items-center">
          <ShimmerBar className="w-24 h-24 rounded-full" />
          <ShimmerBar className="w-40 h-6" />
          <ShimmerBar className="w-24 h-5 rounded-full" />
          <ShimmerBar className="w-56 h-4" />
          <ShimmerBar className="w-full h-11 rounded-xl" />
          {/* Stats bar */}
          <div className="w-full grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <ShimmerBar className="w-10 h-3" />
                <ShimmerBar className="w-6 h-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Content Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((group) => (
            <div key={group} className="bg-white border border-slate-200/60 rounded-3xl p-6 space-y-4 h-fit">
              {/* Card Header */}
              <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100">
                <ShimmerBar className="w-6 h-6 rounded-md" />
                <ShimmerBar className="w-32 h-4" />
              </div>
              {/* Card Items */}
              <div className="space-y-3.5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <ShimmerBar className="w-8 h-8 rounded-lg" />
                      <div className="space-y-1.5">
                        <ShimmerBar className="w-36 h-4" />
                        <ShimmerBar className="w-48 h-3" />
                      </div>
                    </div>
                    <ShimmerBar className="w-6 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Admin Dashboard Skeleton
export const AdminSkeleton: React.FC = () => {
  return (
    <div className="w-full p-6 md:p-8 space-y-8">
      {/* Title block */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <ShimmerBar className="w-48 h-7" />
          <ShimmerBar className="w-32 h-4.5" />
        </div>
        <ShimmerBar className="w-36 h-10 rounded-xl" />
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 border border-gray-150 rounded-2xl space-y-3">
            <div className="flex justify-between">
              <ShimmerBar className="w-24 h-4.5" />
              <ShimmerBar className="w-8 h-8 rounded-lg" />
            </div>
            <ShimmerBar className="w-20 h-8" />
          </div>
        ))}
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart skeleton */}
        <div className="lg:col-span-2 bg-white p-6 border border-gray-150 rounded-2xl space-y-4">
          <ShimmerBar className="w-36 h-5" />
          <ShimmerBar className="w-full h-64 rounded-xl" />
        </div>
        {/* Secondary Table skeleton */}
        <div className="bg-white p-6 border border-gray-150 rounded-2xl space-y-4">
          <ShimmerBar className="w-28 h-5" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <ShimmerBar className="w-9 h-9 rounded-full" />
                  <div className="space-y-1">
                    <ShimmerBar className="w-24 h-4" />
                    <ShimmerBar className="w-16 h-3" />
                  </div>
                </div>
                <ShimmerBar className="w-12 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
