'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { CATEGORIES } from '@/lib/constants/categories'
import {
  Utensils, Coffee, Wine, Trees, ShoppingBag, Landmark, MapPin, Sun,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Utensils, Coffee, Wine, Trees, ShoppingBag, Landmark, MapPin, Sun,
}

interface CategoryPillProps {
  slug: string
  selected?: boolean
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function CategoryPill({ slug, selected, onClick, size = 'md' }: CategoryPillProps) {
  const category = CATEGORIES.find(c => c.slug === slug)
  if (!category) return null

  const Icon = iconMap[category.icon]

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border transition-all duration-300',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
        selected
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border bg-white/5 text-text-secondary hover:border-border-hover hover:text-text-primary'
      )}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />}
      <span className="font-medium">{category.name}</span>
    </motion.button>
  )
}
