'use client'

import { motion } from 'framer-motion'

interface SponsorLogoProps {
  name: string
}

export function SponsorLogo({ name }: SponsorLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-2xl font-bold text-slate-400 dark:text-slate-600"
    >
      {name}
    </motion.div>
  )
}