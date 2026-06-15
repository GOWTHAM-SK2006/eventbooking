'use client'

import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const glassCardVariants = cva(
  'rounded-2xl backdrop-blur-xl backdrop-saturate-[180%] bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/10 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/20',
        elevated: 'bg-white/80 dark:bg-slate-900/80 shadow-2xl',
        subtle: 'bg-white/40 dark:bg-slate-900/40 border-white/10 dark:border-white/5',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface GlassCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(glassCardVariants({ variant, size, className }))}
      {...props}
    />
  )
)
GlassCard.displayName = 'GlassCard'

export { GlassCard, glassCardVariants }