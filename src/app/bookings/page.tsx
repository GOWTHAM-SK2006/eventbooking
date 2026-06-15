'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { BookingCard } from '@/components/booking-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const bookings = [
  {
    id: '1',
    event: 'Tech Innovators Summit 2024',
    date: '2024-03-15',
    bookingRef: 'EB-2024-12345',
    quantity: 2,
    total: 398,
    status: 'confirmed',
    image: '/event-tech.jpg',
  },
  {
    id: '2',
    event: 'Digital Marketing Workshop',
    date: '2024-03-22',
    bookingRef: 'EB-2024-12346',
    quantity: 1,
    total: 99,
    status: 'confirmed',
    image: '/event-marketing.jpg',
  },
]

export default function BookingsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-slate-600 dark:text-slate-400">
              View and manage your event registrations
            </p>
          </motion.div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookings.map((booking, index) => (
                <BookingCard key={booking.id} booking={booking} index={index} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              <p className="text-slate-500">No past bookings found</p>
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              <p className="text-slate-500">No cancelled bookings</p>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}