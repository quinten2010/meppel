'use client'

import { useState, use } from 'react'
import { EventCard } from '@/components/events/EventCard'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils/cn'
import type { Event, EventCategory, EventFilters } from '@/types'

const dateFilters = [
  { value: 'today' as const, label: 'Today' },
  { value: 'tomorrow' as const, label: 'Tomorrow' },
  { value: 'weekend' as const, label: 'This Weekend' },
  { value: 'week' as const, label: 'This Week' },
]

const categoryFilters: { value: EventCategory; label: string }[] = [
  { value: 'music', label: 'Music' },
  { value: 'food', label: 'Food' },
  { value: 'art', label: 'Art' },
  { value: 'sports', label: 'Sports' },
  { value: 'markets', label: 'Markets' },
  { value: 'workshops', label: 'Workshops' },
  { value: 'nightlife', label: 'Nightlife' },
]

async function fetchEvents(filters: EventFilters): Promise<Event[]> {
  const { getEvents } = await import('@/lib/supabase/queries')
  return getEvents(filters)
}

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filters: EventFilters = {}
  if (selectedDate) filters.date = selectedDate as EventFilters['date']
  if (selectedCategory) filters.category = selectedCategory as EventCategory

  const eventsPromise = fetchEvents(filters)
  const events = use(eventsPromise)

  return (
    <PageTransition>
      <div className="pt-24 md:pt-28 pb-24">
        <div className="px-6 md:px-8 max-w-7xl mx-auto">
          <SectionHeader
            title="Events in Meppel"
            subtitle="Discover what's happening around town"
          />

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
            {dateFilters.map((df) => (
              <button
                key={df.value}
                onClick={() => setSelectedDate(selectedDate === df.value ? null : df.value)}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300',
                  selectedDate === df.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-white/5 text-text-secondary hover:border-border-hover hover:text-text-primary'
                )}
              >
                {df.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
            {categoryFilters.map((cf) => (
              <button
                key={cf.value}
                onClick={() => setSelectedCategory(selectedCategory === cf.value ? null : cf.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300',
                  selectedCategory === cf.value
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-white/5 text-text-tertiary hover:text-text-secondary hover:border-border-hover'
                )}
              >
                {cf.label}
              </button>
            ))}
          </div>

          {events.length === 0 ? (
            <EmptyState
              icon="calendar"
              title="No events found"
              description={
                selectedDate || selectedCategory
                  ? 'No events match your filters. Try a different date or category.'
                  : 'There are no upcoming events in Meppel right now.'
              }
            />
          ) : (
            <StaggerContainer>
              <div className="space-y-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </StaggerContainer>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
