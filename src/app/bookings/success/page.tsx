'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { CheckCircle2, Download, Share2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
          </motion.div>

          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Your tickets have been successfully booked
          </p>

          <div className="mb-6">
            <QRCodeSVG
              value="EVENTBOOK-TICKET-REF-12345"
              size={160}
              level="H"
              fgColor="#4F46E5"
              bgColor="transparent"
              className="mx-auto"
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500">Booking Reference</p>
              <p className="font-mono font-bold text-lg">EB-2024-REF-12345</p>
            </div>
            <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-slate-500">Event</p>
              <p className="font-semibold">Tech Innovators Summit 2024</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-xl">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="flex-1 rounded-xl">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <Button className="w-full mt-3 rounded-xl" variant="default">
            View My Bookings
          </Button>
        </GlassCard>
      </motion.div>
    </div>
  )
}