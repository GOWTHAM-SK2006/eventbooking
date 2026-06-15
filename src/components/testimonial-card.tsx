'use client'

import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/glass-card'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  testimonial: {
    name: string
    role: string
    content: string
    rating: number
    avatar?: string
  }
  index?: number
}

export function TestimonialCard({ testimonial, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <GlassCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-slate-700 dark:text-slate-300 mb-6 flex-grow italic">
            &ldquo;{testimonial.content}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex-shrink-0" />
            <div>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}