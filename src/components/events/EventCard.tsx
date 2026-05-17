'use client'

import { useState } from 'react'
import { Clock, MapPin, Users, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StaggerItem } from '@/components/animation/StaggerContainer'
import { formatDayNumber, formatMonth, formatTime, formatPriceAmount } from '@/lib/utils/format'
import type { Event } from '@/types'

interface EventCardProps {
  event?: Event
  isLoading?: boolean
  className?: string
}

export function EventCard({ event, isLoading, className }: EventCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (isLoading || !event) {
    return <EventCardSkeleton className={className} />
  }

  const startDate = new Date(event.start_datetime)
  const dayNumber = formatDayNumber(startDate)
  const month = formatMonth(startDate)
  const time = formatTime(startDate)
  const hasPhoto = event.photo && !imgError

  return (
    <StaggerItem>
      <Link
        href={`/events/${event.slug}`}
        className={cn(
          'group block rounded-2xl overflow-hidden border border-border bg-bg-secondary transition-all duration-300',
          'hover:border-border-hover hover:shadow-lg hover:-translate-y-1',
          className
        )}
      >
        <div className="flex">
          <div className="relative w-28 md:w-32 shrink-0">
            {!imgLoaded && (
              <Skeleton variant="rectangular" className="absolute inset-0" />
            )}
            {hasPhoto ? (
              <Image
                src={event.photo!}
                alt={event.name}
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
                <Calendar className="w-6 h-6 text-text-tertiary" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-black/60 backdrop-blur-sm px-2 py-1.5 min-w-[48px]">
              <span className="text-xs font-bold text-white leading-none">{month}</span>
              <span className="text-lg font-bold text-white leading-tight">{dayNumber}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  {event.category && (
                    <Badge variant="category" size="sm">
                      {event.category}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors duration-200 line-clamp-1">
                  {event.name}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                <Clock className="w-3.5 h-3.5" />
                <span>{time}</span>
              </div>
              {event.venue_name && (
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{event.venue_name}</span>
                </div>
              )}
              {event.price !== null && (
                <span className="text-xs font-medium text-text-secondary">
                  {formatPriceAmount(event.price, event.price_currency)}
                </span>
              )}
              {event.attendee_count > 0 && (
                <div className="flex items-center gap-1 text-xs text-text-tertiary ml-auto">
                  <Users className="w-3.5 h-3.5" />
                  <span>{event.attendee_count} going</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </StaggerItem>
  )
}

function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl overflow-hidden border border-border', className)}>
      <div className="flex">
        <Skeleton variant="rectangular" className="w-28 md:w-32 h-32 shrink-0" />
        <div className="flex-1 p-4 space-y-3">
          <Skeleton variant="text" className="h-4 w-20" />
          <Skeleton variant="text" className="h-5 w-3/4" />
          <Skeleton variant="text" className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}
