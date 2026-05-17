import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Calendar, Clock, MapPin, Users, Globe, Tag, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { MapView } from '@/components/map/MapView'
import { formatDate, formatTime, formatDay, formatDayNumber, formatMonth, formatPriceAmount } from '@/lib/utils/format'
import { getEventBySlug } from '@/lib/supabase/queries'
import type { Event } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const event = await getEventBySlug(slug)
    return {
      title: `${event.name} — meppel Events`,
      description: event.description || `Join us for ${event.name} in Meppel`,
      openGraph: event.photo ? { images: [{ url: event.photo }] } : {},
    }
  } catch {
    return { title: 'Event Not Found — meppel' }
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params

  let event: Event
  try {
    event = await getEventBySlug(slug)
  } catch {
    notFound()
  }

  const startDate = new Date(event.start_datetime)

  return (
    <PageTransition>
      <StaggerContainer>
        <article className="pt-24 md:pt-28 pb-24">
          <div className="px-6 md:px-8 max-w-5xl mx-auto">
            {/* Hero */}
            <div className="relative rounded-3xl overflow-hidden h-64 md:h-96 mb-10 border border-border">
              {event.photo ? (
                <Image
                  src={event.photo}
                  alt={event.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent/10 via-bg-primary to-accent/5 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-accent/40" />
                </div>
              )}
              <div className="absolute inset-0 gradient-hero" />
              <div className="absolute bottom-6 left-6 flex items-start gap-4">
                <div className="flex flex-col items-center rounded-2xl bg-black/60 backdrop-blur-md px-4 py-3 min-w-[72px]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {formatMonth(startDate)}
                  </span>
                  <span className="text-3xl font-bold text-white leading-tight">
                    {formatDayNumber(startDate)}
                  </span>
                  <span className="text-xs text-white/70 mt-0.5">
                    {formatDay(startDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3">
                {event.category && (
                  <Badge variant="category" size="sm">
                    {event.category}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-semibold text-text-primary mb-4">
                {event.name}
              </h1>
            </div>

            {/* Two column layout */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Left - Description */}
              <div className="md:col-span-2 space-y-8">
                {event.description && (
                  <MotionWrapper>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">About this event</h2>
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {event.description}
                    </p>
                  </MotionWrapper>
                )}

                {/* Organizer */}
                {event.organizer_name && (
                  <MotionWrapper>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Organizer</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{event.organizer_name}</p>
                        {event.organizer_url && (
                          <a
                            href={event.organizer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-accent hover:text-accent-dark transition-colors flex items-center gap-1"
                          >
                            <Globe className="w-3 h-3" />
                            Visit website
                          </a>
                        )}
                      </div>
                    </div>
                  </MotionWrapper>
                )}

                {/* Map */}
                {event.latitude && event.longitude && (
                  <MotionWrapper>
                    <h2 className="text-xl font-semibold text-text-primary mb-4">Location</h2>
                    <div className="h-48 rounded-2xl overflow-hidden border border-border">
                      <MapView
                        latitude={event.latitude}
                        longitude={event.longitude}
                        zoom={15}
                        className="w-full h-full"
                      />
                    </div>
                    {event.venue_address && (
                      <p className="text-sm text-text-tertiary mt-2">{event.venue_address}</p>
                    )}
                  </MotionWrapper>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-28 space-y-4">
                  <div className="rounded-2xl glass-strong border border-border p-6 space-y-5">
                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                      Details
                    </h3>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {formatDate(startDate, 'EEEE d MMMM yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-text-secondary">
                          {formatTime(startDate)}
                          {event.end_datetime && ` — ${formatTime(event.end_datetime)}`}
                        </p>
                      </div>
                    </div>

                    {event.venue_name && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-text-secondary">{event.venue_name}</p>
                          {event.venue_address && (
                            <p className="text-sm text-text-tertiary">{event.venue_address}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <Tag className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                      <p className="text-sm text-text-secondary">
                        {formatPriceAmount(event.price, event.price_currency)}
                      </p>
                    </div>

                    {event.attendee_count > 0 && (
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                        <p className="text-sm text-text-secondary">
                          {event.attendee_count} attending
                        </p>
                      </div>
                    )}
                  </div>

                  {/* RSVP Buttons */}
                  <div className="space-y-3">
                    <Button variant="primary" size="lg" className="w-full">
                      <Calendar className="w-4 h-4" />
                      Going
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full">
                      <Star className="w-4 h-4" />
                      Interested
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </StaggerContainer>
    </PageTransition>
  )
}
