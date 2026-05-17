'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const placeholderTexts = [
  'Search for cozy cafés...',
  'Discover hidden gems...',
  'Browse upcoming events...',
  'Where to go tonight?',
]

interface SearchBarProps {
  onSearch?: (query: string) => void
  onFocus?: () => void
  className?: string
  autoFocus?: boolean
  value?: string
  onChange?: (value: string) => void
}

export function SearchBar({ onSearch, onFocus, className, autoFocus, value: controlledValue, onChange: controlledOnChange }: SearchBarProps) {
  const [internalValue, setInternalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = controlledOnChange || setInternalValue

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (isFocused) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isFocused])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        onSearch?.(value.trim())
      }
    },
    [value, onSearch]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    },
    []
  )

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <div
        className={cn(
          'relative flex items-center transition-all duration-300',
          'rounded-full border',
          isFocused
            ? 'border-accent bg-bg-primary shadow-lg shadow-accent/5'
            : 'border-border bg-white/5 hover:bg-white/[0.07]'
        )}
      >
        <Search
          className={cn(
            'absolute left-4 w-4 h-4 transition-colors duration-200',
            isFocused ? 'text-accent' : 'text-text-tertiary'
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            onFocus?.()
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderTexts[placeholderIndex]}
          className={cn(
            'w-full bg-transparent px-12 py-3 text-sm text-text-primary rounded-full',
            'placeholder:text-text-tertiary/60',
            'focus:outline-none',
            'transition-all duration-300'
          )}
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setValue('')}
              className="absolute right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-text-tertiary" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
