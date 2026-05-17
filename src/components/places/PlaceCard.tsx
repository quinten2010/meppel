'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerItem } from '@/components/animation/StaggerContainer'
import { springBouncy } from '@/lib/animations/primitives'
import { formatPrice, formatRating } from '@/lib/utils/format'
import type { Place } from '@/types'

type CardVariant = 'standard' | 'compact' | 'detailed' | 'hero'

interface PlaceCardProps {
  place?: Place
  variant?: CardVariant
  isLoading?: boolean
  className?: string
}

export function PlaceCard({ place, variant = 'standard', isLoading, className }: PlaceCardProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (isLoading || !place) {
    return <PlaceCardSkeleton variant={variant} className={className} />
  }

  const photo = place.photos?.[0]
  const hasPhoto = photo && !imgError
  const categoryName = place.category?.name

  const content = (
    <>
      <div className="relative overflow-hidden">
        <div className={cn(
          'relative overflow-hidden',
          variant === 'compact' ? 'w-24 h-24 rounded-xl shrink-0' : 'w-full',
          variant === 'hero' ? 'h-72 md:h-96' : variant === 'detailed' ? 'h-52' : 'h-44'
        )}>
          {!imgLoaded && (
            <Skeleton variant="rectangular" className="absolute inset-0" />
          )}
          {hasPhoto ? (
            <Image
              src={photo}
              alt={place.name}
              fill
              className={cn(
                'object-cover transition-all duration-500',
                imgLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-card flex items-center justify-center">
              <MapPin className="w-8 h-8 text-text-tertiary" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {variant !== 'compact' && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsSaved(!isSaved)
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200"
              aria-label={isSaved ? 'Remove from saved' : 'Save place'}
            >
              <motion.div
                animate={isSaved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={springBouncy}
              >
                <Heart
                  className={cn(
                    'w-4 h-4 transition-colors duration-200',
                    isSaved ? 'fill-error text-error' : 'text-white'
                  )}
                />
              </motion.div>
            </button>
          )}
          {variant === 'hero' && place.is_featured && (
            <Badge variant="warning" size="sm" className="absolute top-3 left-3">
              Featured
            </Badge>
          )}
          {variant !== 'compact' && categoryName && (
            <Badge variant="category" size="sm" className="absolute bottom-3 left-3">
              {categoryName}
            </Badge>
          )}
        </div>
      </div>

      <div className={cn(
        variant === 'compact' ? 'flex-1 min-w-0 py-1' : 'p-4'
      )}>
        <div className={cn(
          variant === 'compact' ? 'flex items-start justify-between gap-2' : 'space-y-2'
        )}>
          <div className="min-w-0">
            <h3 className={cn(
              'font-semibold text-text-primary truncate',
              variant === 'hero' ? 'text-2xl' : variant === 'detailed' ? 'text-lg' : 'text-sm'
            )}>
              {place.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-warning text-warning" />
                <span className="text-xs font-medium text-text-secondary">
                  {formatRating(place.avg_rating)}
                </span>
                {place.review_count > 0 && (
                  <span className="text-xs text-text-tertiary">
                    ({place.review_count})
                  </span>
                )}
              </div>
              <span className="text-text-tertiary text-xs">{formatPrice(place.price_level)}</span>
            </div>
          </div>
          {variant === 'compact' && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsSaved(!isSaved)
              }}
              className="shrink-0 p-1 rounded-full hover:bg-white/5 transition-colors"
              aria-label={isSaved ? 'Remove from saved' : 'Save place'}
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-colors duration-200',
                  isSaved ? 'fill-error text-error' : 'text-text-tertiary'
                )}
              />
            </button>
          )}
        </div>

        {(variant === 'standard' || variant === 'detailed' || variant === 'hero') && (
          <>
            {place.short_description && (
              <p className={cn(
                'text-text-tertiary mt-2 line-clamp-2',
                variant === 'hero' ? 'text-base' : 'text-xs'
              )}>
                {place.short_description}
              </p>
            )}
            {place.tags && place.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {place.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="ghost" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}

        {variant === 'hero' && (
          <div className="flex items-center gap-2 mt-4">
            <MapPin className="w-4 h-4 text-text-tertiary shrink-0" />
            <span className="text-sm text-text-secondary truncate">{place.address}</span>
          </div>
        )}
      </div>
    </>
  )

  if (variant === 'compact') {
    return (
      <StaggerItem>
        <Link
          href={`/places/${place.slug}`}
          className={cn(
            'flex items-center gap-3 p-2 rounded-2xl transition-all duration-200 hover:bg-white/5 group',
            className
          )}
        >
          {content}
        </Link>
      </StaggerItem>
    )
  }

  if (variant === 'hero') {
    return (
      <StaggerItem>
        <Link
          href={`/places/${place.slug}`}
          className={cn(
            'group block rounded-3xl overflow-hidden border border-border transition-all duration-300 hover:border-border-hover',
            className
          )}
        >
          {content}
        </Link>
      </StaggerItem>
    )
  }

  return (
    <StaggerItem>
      <Link
        href={`/places/${place.slug}`}
        className={cn(
          'group block rounded-2xl overflow-hidden border border-border bg-bg-secondary transition-all duration-300',
          'hover:border-border-hover hover:shadow-lg hover:-translate-y-1',
          className
        )}
      >
        {content}
      </Link>
    </StaggerItem>
  )
}

function PlaceCardSkeleton({ variant, className }: { variant: CardVariant; className?: string }) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3 p-2', className)}>
        <Skeleton variant="rectangular" className="w-24 h-24 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="h-4 w-32" />
          <Skeleton variant="text" className="h-3 w-20" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden border border-border',
      variant === 'hero' && 'rounded-3xl',
      className
    )}>
      <Skeleton
        variant="rectangular"
        className={cn(
          'w-full',
          variant === 'hero' ? 'h-72 md:h-96' : variant === 'detailed' ? 'h-52' : 'h-44'
        )}
      />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/4" />
        <Skeleton variant="text" className="h-3 w-full" />
      </div>
    </div>
  )
}
