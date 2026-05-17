'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  link?: { href: string; label: string }
  className?: string
}

export function SectionHeader({ title, subtitle, link, className }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('flex items-end justify-between mb-8', className)}
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-primary">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-secondary mt-1 text-sm">{subtitle}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="hidden sm:flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors group"
        >
          {link.label}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </motion.div>
  )
}
