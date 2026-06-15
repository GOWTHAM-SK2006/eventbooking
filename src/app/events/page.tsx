'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { EventCard } from '@/components/event-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Grid, List } from 'lucide-react'
import { useState } from 'react'

const categories = ['All', 'Conference', 'Workshop', 'Webinar', 'Meetup', 'Concert', 'Sports']

const allEvents = [
  {
    id: '1',
    title: 'Tech Innovators Summit 2024',
    description: 'Join the brightest minds in technology for a day of innovation and networking.',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    price: 199,
    category: 'conference',
    availableSeats: 250,
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Digital Marketing Workshop',
    description: 'Master the art of digital marketing with hands-on workshops.',
    date: '2024-03-22',
    location: 'New York, NY',
    price: 99,
    category: 'workshop',
    availableSeats: 100,
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Music & Arts Festival',
    description: 'A celebration of music, art, and culture in one unforgettable weekend.',
    date: '2024-04-05',
    location: 'Austin, TX',
    price: 149,
    category: 'concert',
    availableSeats: 500,
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Startup Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors.',
    date: '2024-03-28',
    location: 'Remote Event',
    price: 0,
    category: 'meetup',
    availableSeats: 1000,
    rating: 4.6,
  },
  {
    id: '5',
    title: 'AI Conference 2024',
    description: 'Explore the latest in artificial intelligence and machine learning.',
    date: '2024-04-15',
    location: 'Seattle, WA',
    price: 299,
    category: 'conference',
    availableSeats: 300,
    rating: 4.9,
  },
  {
    id: '6',
    title: 'Photography Masterclass',
    description: 'Learn professional photography techniques from industry experts.',
    date: '2024-04-20',
    location: 'Online',
    price: 79,
    category: 'webinar',
    availableSeats: 500,
    rating: 4.8,
  },
]

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Discover Events
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find and book tickets for the best events in your area
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search events, categories, locations..."
                className="pl-12 h-12 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-xl whitespace-nowrap"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                className="rounded-xl"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                className="rounded-xl"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}
          >
            {allEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </motion.div>
        </div>
      </main>
    </>
  )
}