'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { EventCard } from '@/components/event-card'
import { Heart } from 'lucide-react'

const wishlistEvents = [
  {
    id: '1',
    title: 'Tech Innovators Summit 2024',
    description: 'Join the brightest minds in technology for a day of innovation.',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    price: 199,
    category: 'conference',
    availableSeats: 250,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'AI Conference 2024',
    description: 'Explore the latest in artificial intelligence.',
    date: '2024-04-15',
    location: 'Seattle, WA',
    price: 299,
    category: 'conference',
    availableSeats: 300,
    rating: 4.9,
  },
]

export default function WishlistPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              My Wishlist
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Events you&apos;ve saved for later
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {wishlistEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        </div>
      </main>
    </>
  )
}