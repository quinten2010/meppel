'use client'

import { useState, useRef, useCallback, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { PlaceCard } from '@/components/places/PlaceCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { searchOverlay } from '@/lib/animations/transitions'
import type { Place } from '@/types'

const STORAGE_KEY = 'meppel-recent-searches'
const MAX_RECENT = 5

const trendingSearches = [
  'cozy cafés', 'restaurants', 'parks', 'nightlife', 'hidden gems',
  'student-friendly', 'family activities', 'weekend markets',
]

async function searchPlaces(query: string): Promise<Place[]> {
  const { getPlaces } = await import('@/lib/supabase/queries')
  return getPlaces({ query, pageSize: 10 })
}

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {}
  }
  return []
}

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const recentSearches = getRecentSearches()

  const handleSaveRecent = useCallback((search: string) => {
    const trimmed = search.trim()
    if (!trimmed) return
    const current = getRecentSearches()
    const updated = [trimmed, ...current.filter((s) => s !== trimmed)].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }, [])

  const handleRemoveRecent = useCallback((search: string) => {
    const current = getRecentSearches()
    const updated = current.filter((s) => s !== search)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.location.reload()
  }, [])

  const handleClearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }, [])

  const handleSelect = useCallback((search: string) => {
    handleSaveRecent(search)
    setQuery(search)
  }, [handleSaveRecent])

  const handleSubmit = useCallback(() => {
    if (!query.trim()) return
    handleSaveRecent(query)
    onClose()
    router.push(`/explore?q=${encodeURIComponent(query.trim())}`)
  }, [query, handleSaveRecent, onClose, router])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < 9 ? prev + 1 : 0))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 9))
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    },
    [onClose, handleSubmit]
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
  }, [])

  const hasResults = query.trim().length > 0
  const hasRecent = recentSearches.length > 0

  const results = hasResults ? use(searchPlaces(query.trim())) : []

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col"
          variants={searchOverlay}
          initial="closed"
          animate="open"
          exit="closed"
          onAnimationComplete={() => inputRef.current?.focus()}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />

          <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-16 md:pt-24">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search places, events, and more..."
                className="w-full bg-white/10 border border-border rounded-2xl pl-14 pr-14 py-4 text-lg text-text-primary placeholder:text-text-tertiary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              )}
            </div>

            <div className="mt-6 pb-32">
              {!hasResults && (
                <div className="space-y-6">
                  {hasRecent && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Recent Searches</span>
                        </div>
                        <button
                          onClick={handleClearRecent}
                          className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search) => (
                          <div key={search} className="group relative">
                            <button
                              onClick={() => handleSelect(search)}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
                            >
                              <Clock className="w-3 h-3" />
                              <span>{search}</span>
                            </button>
                            <button
                              onClick={() => handleRemoveRecent(search)}
                              className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-bg-elevated border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-2.5 h-2.5 text-text-tertiary" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">Trending in Meppel</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSelect(search)}
                          className="px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-sm text-accent hover:bg-accent/10 transition-all duration-200"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasResults && results.length === 0 && (
                <EmptyState
                  icon="search"
                  title="No results found"
                  description={`We couldn't find anything for "${query}". Try a different search term.`}
                />
              )}

              {hasResults && results.length > 0 && (
                <div ref={resultsRef} className="space-y-1">
                  <p className="text-xs text-text-tertiary mb-3">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                  </p>
                  {results.map((place, index) => (
                    <div
                      key={place.id}
                      className={cn(
                        'rounded-2xl transition-colors duration-150',
                        selectedIndex === index && 'bg-white/5'
                      )}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <PlaceCard
                        place={place}
                        variant="compact"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
