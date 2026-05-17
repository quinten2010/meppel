'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatRating } from '@/lib/utils/format'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (value: number) => void
}

export function Rating({ value, count, size = 'sm', interactive, onChange }: RatingProps) {
  const sizeClasses = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileTap={interactive ? { scale: 0.8 } : undefined}
            onClick={() => interactive && onChange?.(star)}
            className={cn(
              'transition-colors duration-150',
              interactive && 'cursor-pointer'
            )}
            type="button"
            disabled={!interactive}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-all duration-150',
                star <= Math.round(value)
                  ? 'fill-warning text-warning'
                  : 'fill-none text-border'
              )}
            />
          </motion.button>
        ))}
      </div>
      <span className="text-xs font-medium text-text-secondary">
        {formatRating(value)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  )
}
