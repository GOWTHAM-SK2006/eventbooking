'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, MapPin, Users, Clock, Share2, Heart, Ticket } from 'lucide-react'
import { useState } from 'react'

const event = {
  id: '1',
  title: 'Tech Innovators Summit 2024',
  description: `Join the brightest minds in technology for a day of innovation and networking. This summit brings together industry leaders, innovators, and enthusiasts to explore the future of technology.

  **What to Expect:**
  - Keynote presentations from tech industry leaders
  - Interactive workshops and hands-on sessions
  - Networking opportunities with professionals
  - Latest technology showcases and demos
  - Career development sessions`,
  shortDescription: 'Join the brightest minds in technology for a day of innovation and networking.',
  category: 'conference',
  date: '2024-03-15',
  endDate: '2024-03-15',
  time: '09:00 AM - 6:00 PM',
  venue: 'Moscone Center',
  address: '747 Howard St, San Francisco, CA 94103',
  city: 'San Francisco',
  country: 'USA',
  image: '/event-tech.jpg',
  totalSeats: 500,
  availableSeats: 243,
  price: 199,
  organizer: {
    name: 'Tech Events Inc.',
    email: 'contact@techevents.com',
  },
}

export default function EventDetailsPage() {
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Event Banner */}
          <div className="lg:col-span-2">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20" />
              <Badge className="absolute top-4 right-4 capitalize bg-indigo-500 text-white">
                {event.category}
              </Badge>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {event.shortDescription}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-pink-500 text-pink-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Venue</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{event.address}</p>
                  
                  {/* Map placeholder */}
                  <div className="mt-4 h-48 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <span className="text-slate-500">Google Maps Integration</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{event.organizer.name}</p>
                    <p className="text-slate-600 dark:text-slate-400">{event.organizer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-8"
            >
              <div className="rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl p-6">
                <h3 className="text-xl font-bold mb-4">Book Tickets</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-slate-500">Date</p>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-slate-500">Time</p>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-slate-500">Available Seats</p>
                      <p className="font-medium">{event.availableSeats} / {event.totalSeats}</p>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-2">Select Tickets</p>
                  <div className="flex items-center gap-4">
                    <select
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                      className="flex-1 h-12 rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4"
                    >
                      {Array.from({ length: Math.min(event.availableSeats, 5) }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num} Ticket{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-600 dark:text-slate-400">Total</span>
                  <span className="text-2xl font-bold">${event.price * selectedQuantity}</span>
                </div>

                <Button className="w-full h-12 rounded-xl font-semibold" size="lg">
                  <Ticket className="mr-2 h-5 w-5" />
                  Book Now
                </Button>

                <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                  Secure payment powered by Stripe
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}