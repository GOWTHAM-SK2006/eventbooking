'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Star } from 'lucide-react'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    location: string
    price: number
    image?: string
    category: string
    availableSeats: number
    rating?: number
  }
  index?: number
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const categoryColors: Record<string, string> = {
    conference: 'bg-indigo-500',
    workshop: 'bg-blue-500',
    webinar: 'bg-cyan-500',
    meetup: 'bg-purple-500',
    concert: 'bg-pink-500',
    sports: 'bg-emerald-500',
    other: 'bg-slate-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="group rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/10 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/20">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-indigo-500/30" />
          </div>
          <Badge 
            className={`absolute top-3 right-3 capitalize ${categoryColors[event.category]} text-white`}
          >
            {event.category}
          </Badge>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-xl mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              {new Date(event.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-slate-500 dark:text-slate-400">From</span>
                <span className="font-bold text-lg ml-1">${event.price}</span>
              </div>
              {event.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{event.rating}</span>
                </div>
              )}
            </div>
            <Button size="sm" className="rounded-lg">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}