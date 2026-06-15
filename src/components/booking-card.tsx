'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, QrCode, Download } from 'lucide-react'

interface BookingCardProps {
  booking: {
    id: string
    event: string
    date: string
    bookingRef: string
    quantity: number
    total: number
    status: string
    image?: string
  }
  index?: number
}

export function BookingCard({ booking, index = 0 }: BookingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="h-48 w-full sm:w-48 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex-shrink-0" />

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{booking.event}</h3>
                <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                  {booking.status}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Total</p>
                <p className="font-bold text-lg">${booking.total}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-indigo-500" />
                <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-500">Tickets: </span>
                <span className="font-medium">{booking.quantity}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-mono mb-4">
              Ref: {booking.bookingRef}
            </p>

            <div className="flex gap-3">
              <Button size="sm" className="rounded-lg">
                <QrCode className="mr-2 h-4 w-4" />
                View Ticket
              </Button>
              <Button size="sm" variant="outline" className="rounded-lg">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}