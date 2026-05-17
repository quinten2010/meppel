'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Rating } from '@/components/shared/Rating'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'

interface ReviewFormProps {
  onSubmit?: (rating: number, text: string) => Promise<void>
  className?: string
}

export function ReviewForm({ onSubmit, className }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (rating === 0) {
      showToast({ type: 'warning', title: 'Please select a rating' })
      return
    }

    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(rating, text)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      showToast({ type: 'success', title: 'Review submitted', description: 'Thank you for your feedback!' })
      setRating(0)
      setText('')
    } catch {
      showToast({ type: 'error', title: 'Failed to submit review', description: 'Please try again later.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={cn('p-6 rounded-2xl bg-white/5 border border-border', className)}
    >
      <h3 className="text-lg font-semibold text-text-primary mb-4">Write a Review</h3>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-text-secondary">Your rating:</span>
        <Rating
          value={rating}
          size="lg"
          interactive
          onChange={setRating}
        />
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          maxLength={1000}
          className={cn(
            'w-full rounded-2xl bg-white/5 border border-border px-4 py-3 text-sm text-text-primary',
            'placeholder:text-text-tertiary resize-none',
            'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
            'transition-all duration-300'
          )}
        />
        <span className="absolute bottom-3 right-3 text-xs text-text-tertiary">
          {text.length}/1000
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-text-tertiary">
          {rating === 0 ? 'Tap the stars to rate' : `You rated ${rating} out of 5`}
        </p>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          disabled={rating === 0}
        >
          <Send className="w-4 h-4" />
          Submit
        </Button>
      </div>
    </motion.form>
  )
}
