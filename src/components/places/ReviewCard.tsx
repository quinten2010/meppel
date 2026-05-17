'use client'

import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Rating } from '@/components/shared/Rating'
import { formatTimeAgo } from '@/lib/utils/format'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const user = review.user
  const username = user?.username || 'Anonymous'
  const avatarUrl = user?.avatar_url

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn('p-4 rounded-2xl bg-white/5 border border-border', className)}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gradient-card flex items-center justify-center">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={username}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-text-tertiary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-text-primary truncate">
              {username}
            </span>
            <span className="text-xs text-text-tertiary shrink-0">
              {formatTimeAgo(review.created_at)}
            </span>
          </div>

          <div className="mt-1">
            <Rating value={review.rating} size="sm" />
          </div>

          {review.text && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {review.text}
            </p>
          )}

          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.photos.slice(0, 3).map((photo, i) => (
                <Image
                  key={i}
                  src={photo}
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-lg object-cover border border-border"
                />
              ))}
              {review.photos.length > 3 && (
                <div className="w-16 h-16 rounded-lg bg-white/5 border border-border flex items-center justify-center">
                  <span className="text-xs text-text-tertiary font-medium">
                    +{review.photos.length - 3}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
