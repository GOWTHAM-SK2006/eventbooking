'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GlassCard } from '@/components/ui/glass-card'
import { Search, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { EventCard } from '@/components/event-card'
import { TestimonialCard } from '@/components/testimonial-card'
import { SponsorLogo } from '@/components/sponsor-logo'

const statsData = [
  { value: '10,000+', label: 'Events Hosted', icon: Calendar },
  { value: '50,000+', label: 'Happy Users', icon: Users },
  { value: '4.9', label: 'Average Rating', icon: Star },
]

const featuredEvents = [
  {
    id: '1',
    title: 'Tech Innovators Summit 2024',
    description: 'Join the brightest minds in technology for a day of innovation and networking.',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    price: 199,
    image: '/event-tech.jpg',
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
    image: '/event-marketing.jpg',
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
    image: '/event-festival.jpg',
    category: 'concert',
    availableSeats: 500,
    rating: 4.7,
  },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Event Attendee',
    content: 'EventBook made finding and booking events so seamless. The QR tickets are amazing!',
    rating: 5,
    avatar: '/avatar-1.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Conference Organizer',
    content: 'As an organizer, the platform provides incredible analytics and easy management tools.',
    rating: 5,
    avatar: '/avatar-2.jpg',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Workshop Host',
    content: 'The booking system is flawless. Highly recommend for any event professional.',
    rating: 4,
    avatar: '/avatar-3.jpg',
  },
]

const sponsors = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta']

export default function LandingPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Discover & Book Amazing Events
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
                  Find, register, and attend the best events in your area. From conferences to workshops, concerts to meetups - all in one platform.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl mx-auto mb-12"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search events, categories, locations..."
                    className="pl-12 pr-32 h-14 rounded-xl text-base bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"
                  />
                  <Button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg h-12">
                    Search
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 mb-16"
              >
                <Button size="lg" className="rounded-xl px-8">
                  Explore Events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl px-8">
                  Create Event
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
              >
                {statsData.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <GlassCard key={stat.label} className="p-6">
                      <div className="flex items-center justify-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                          <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured Events
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Handpicked events that you won&apos;t want to miss
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Upcoming Events
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover what&apos;s happening near you
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <EventCard key={`upcoming-${event.id}`} event={event} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                What People Say
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Join thousands of satisfied users
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Sponsors */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Trusted by Leading Companies
              </h3>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {sponsors.map((sponsor) => (
                <SponsorLogo key={sponsor} name={sponsor} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">EventBook</span>
              </div>
              <p className="text-slate-400 text-sm">
                The premier platform for event discovery and booking.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/events" className="text-slate-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2024 EventBook. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}