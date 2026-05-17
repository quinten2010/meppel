'use client'

import { Suspense, useState, useRef, useCallback, useMemo, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, LayoutGrid, Map as MapIcon, X } from 'lucide-react'
import { PlaceCard } from '@/components/places/PlaceCard'
import { CategoryPill } from '@/components/shared/CategoryPill'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { SearchOverlay } from '@/components/search/SearchOverlay'
import { MapView } from '@/components/map/MapView'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { CATEGORIES, MOODS, PRICE_LABELS, SORT_OPTIONS } from '@/lib/constants/categories'
import type { Place, PlaceFilters, MoodTag, PriceLevel } from '@/types'

const PAGE_SIZE = 12

function ExploreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [places, setPlaces] = useState<Place[]>([])
  const [isPending, startTransition] = useTransition()
  const [hasMore, setHasMore] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const observerRef = useRef<HTMLDivElement>(null)
  const currentPageRef = useRef(1)
  const isLoadingRef = useRef(false)

  const category = searchParams.get('category') || undefined
  const mood = (searchParams.get('mood') as MoodTag) || undefined
  const price = searchParams.get('price') ? (Number(searchParams.get('price')) as PriceLevel) : undefined
  const sort = (searchParams.get('sort') as PlaceFilters['sort']) || 'trending'
  const query = searchParams.get('q') || undefined

  const filters = useMemo<PlaceFilters>(() => ({
    category,
    mood,
    price,
    sort,
    query,
  }), [category, mood, price, sort, query])

  const fetchPlaces = useCallback(async (pageNum: number, append: boolean) => {
    if (isLoadingRef.current) return
    isLoadingRef.current = true

    try {
      const { getPlaces } = await import('@/lib/supabase/queries')
      const data = await getPlaces({ ...filters, page: pageNum, pageSize: PAGE_SIZE })
      if (append) {
        setPlaces((prev) => {
          const existingIds = new Set(prev.map(p => p.id))
          const newItems = (data as unknown as Place[]).filter(p => !existingIds.has(p.id))
          return [...prev, ...newItems]
        })
      } else {
        setPlaces(data as unknown as Place[])
      }
      setHasMore(data.length >= PAGE_SIZE)
    } catch {
      if (!append) setPlaces([])
    } finally {
      isLoadingRef.current = false
    }
  }, [filters])

  function resetAndFetch() {
    currentPageRef.current = 1
    isLoadingRef.current = false
    setPlaces([])
    setHasMore(true)
    startTransition(async () => {
      await fetchPlaces(1, false)
    })
  }

  function loadMore() {
    if (isLoadingRef.current || !hasMore) return
    const nextPage = currentPageRef.current + 1
    currentPageRef.current = nextPage
    startTransition(async () => {
      await fetchPlaces(nextPage, true)
    })
  }

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/explore?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/explore')
  }

  const hasActiveFilters = filters.category || filters.mood || filters.price || filters.query

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    resetAndFetch()
  }, [filters])
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending && !isLoadingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isPending])

  return (
    <PageTransition>
      <div className="pt-24 md:pt-28 pb-24 md:pb-16">
        <div className="px-6 md:px-8 max-w-7xl mx-auto mb-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full glass rounded-2xl px-5 py-3.5 text-left text-text-tertiary text-sm hover:text-text-secondary hover:bg-white/[0.07] transition-all duration-300 border border-border"
          >
            {query ? (
              <span className="text-text-primary">Searching for &ldquo;{query}&rdquo;</span>
            ) : (
              'Search places, categories, and more...'
            )}
          </button>
        </div>

        <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        <div className="sticky top-20 md:top-24 z-40 glass-strong border-b border-border">
          <div className="px-6 md:px-8 max-w-7xl mx-auto py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-text-tertiary" />
              </div>

              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.slug}
                  slug={cat.slug}
                  selected={filters.category === cat.slug}
                  onClick={() =>
                    updateFilter('category', filters.category === cat.slug ? null : cat.slug)
                  }
                  size="sm"
                />
              ))}

              <div className="w-px h-6 bg-border mx-2 shrink-0" />

              {MOODS.map((mood) => (
                <button
                  key={mood.slug}
                  onClick={() =>
                    updateFilter('mood', filters.mood === mood.slug ? null : mood.slug)
                  }
                  className={cn(
                    'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300',
                    filters.mood === mood.slug
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-white/5 text-text-tertiary hover:text-text-secondary hover:border-border-hover'
                  )}
                >
                  {mood.label}
                </button>
              ))}

              <div className="w-px h-6 bg-border mx-2 shrink-0" />

              <select
                value={filters.price ?? ''}
                onChange={(e) => updateFilter('price', e.target.value || null)}
                className="shrink-0 bg-transparent text-xs font-medium text-text-secondary border border-border rounded-full px-3 py-1.5 focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="">Any Price</option>
                {Object.entries(PRICE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>

              <select
                value={filters.sort ?? 'trending'}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="shrink-0 bg-transparent text-xs font-medium text-text-secondary border border-border rounded-full px-3 py-1.5 focus:outline-none focus:border-accent cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="ml-auto flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={cn(
                    'w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200',
                    showMap
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-text-tertiary hover:text-text-secondary hover:border-border-hover'
                  )}
                  aria-label={showMap ? 'Show grid' : 'Show map'}
                >
                  {showMap ? <LayoutGrid className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                <span className="text-xs text-text-tertiary">Active filters:</span>
                <div className="flex items-center gap-1.5">
                  {filters.category && (
                    <Badge variant="default" size="sm">
                      {CATEGORIES.find((c) => c.slug === filters.category)?.name ?? filters.category}
                      <button onClick={() => updateFilter('category', null)} className="ml-1">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}
                  {filters.mood && (
                    <Badge variant="default" size="sm">
                      {MOODS.find((m) => m.slug === filters.mood)?.label ?? filters.mood}
                      <button onClick={() => updateFilter('mood', null)} className="ml-1">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}
                  {filters.price && (
                    <Badge variant="default" size="sm">
                      {PRICE_LABELS[filters.price]}
                      <button onClick={() => updateFilter('price', null)} className="ml-1">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-text-tertiary hover:text-text-primary ml-2 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 md:px-8 max-w-7xl mx-auto mt-8">
          {showMap ? (
            <div className="h-[600px] rounded-2xl overflow-hidden border border-border">
              <MapView className="w-full h-full" />
            </div>
          ) : (
            <>
              {isPending && places.length === 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PlaceCard key={i} isLoading variant="standard" />
                  ))}
                </div>
              ) : places.length === 0 ? (
                <EmptyState
                  icon="search"
                  title="No places found"
                  description={
                    hasActiveFilters
                      ? 'Try adjusting your filters to discover more places.'
                      : 'No places have been added yet. Be the first to submit one!'
                  }
                  action={
                    hasActiveFilters
                      ? { label: 'Clear filters', onClick: clearFilters }
                      : undefined
                  }
                />
              ) : (
                <StaggerContainer>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {places.map((place) => (
                      <PlaceCard key={place.id} place={place} variant="standard" />
                    ))}
                  </div>

                  {hasMore && (
                    <div ref={observerRef} className="h-10 mt-8" />
                  )}

                  {isPending && places.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <PlaceCard key={`loading-${i}`} isLoading variant="standard" />
                      ))}
                    </div>
                  )}
                </StaggerContainer>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  )
}
