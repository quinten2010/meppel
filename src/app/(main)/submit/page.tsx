'use client'

import { useState, useEffect } from 'react'
import { Send, MapPin, Camera, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'
import { PageTransition } from '@/components/animation/PageTransition'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { CATEGORIES } from '@/lib/constants/categories'
import { submitPlaceSchema } from '@/lib/utils/validations'
import { cn } from '@/lib/utils/cn'
import type { Category } from '@/types'

export default function SubmitPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    address: '',
    description: '',
    photo: '',
  })

  useEffect(() => {
    async function loadCategories() {
      try {
        const { getCategories } = await import('@/lib/supabase/queries')
        const data = await getCategories()
        setCategories(data ?? [])
      } catch {
        // fallback to constants
      }
    }
    loadCategories()
  }, [])

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})

    const result = submitPlaceSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)

      const firstError = result.error.issues[0]
      showToast({
        type: 'warning',
        title: 'Please fix the errors',
        description: firstError.message,
      })
      return
    }

    setIsSubmitting(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from('places').insert({
        name: formData.name,
        category_id: formData.category_id,
        address: formData.address,
        description: formData.description,
        photos: formData.photo ? [formData.photo] : [],
        created_by: user?.id ?? null,
        city: 'Meppel',
      })

      if (error) throw error

      showToast({
        type: 'success',
        title: 'Place submitted!',
        description: 'Thank you for contributing to Meppel.',
      })
      router.push('/')
    } catch {
      showToast({
        type: 'error',
        title: 'Failed to submit',
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <div className="pt-24 md:pt-28 pb-24 px-6 md:px-8 max-w-2xl mx-auto">
        <MotionWrapper>
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Store className="w-7 h-7 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-text-primary mb-3">
              Suggest a Place
            </h1>
            <p className="text-text-secondary max-w-md mx-auto">
              Know a hidden gem in Meppel? Share it with the community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Place Name
              </label>
              <Input
                placeholder="e.g. Café de Stad"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                icon={<Store className="w-4 h-4" />}
              />
              {errors.name && (
                <p className="text-xs text-error">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(categories.length > 0 ? categories : CATEGORIES).map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleChange('category_id', cat.slug)}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 text-center',
                      formData.category_id === cat.slug
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-white/5 text-text-secondary hover:border-border-hover'
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {errors.category_id && (
                <p className="text-xs text-error">{errors.category_id}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Address
              </label>
              <Input
                placeholder="e.g. Hoofdstraat 42, Meppel"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
              />
              {errors.address && (
                <p className="text-xs text-error">{errors.address}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                placeholder="Tell us what makes this place special..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                maxLength={500}
                className={cn(
                  'w-full rounded-2xl bg-white/5 border border-border px-5 py-3 text-sm text-text-primary',
                  'placeholder:text-text-tertiary resize-none',
                  'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30',
                  'transition-all duration-300'
                )}
              />
              <div className="flex justify-between">
                {errors.description && (
                  <p className="text-xs text-error">{errors.description}</p>
                )}
                <span className="text-xs text-text-tertiary ml-auto">
                  {formData.description.length}/500
                </span>
              </div>
            </div>

            {/* Photo URL (optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Photo URL <span className="text-text-tertiary font-normal">(optional)</span>
              </label>
              <Input
                placeholder="https://example.com/photo.jpg"
                value={formData.photo}
                onChange={(e) => handleChange('photo', e.target.value)}
                icon={<Camera className="w-4 h-4" />}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              <Send className="w-4 h-4" />
              Submit Place
            </Button>
          </form>
        </MotionWrapper>
      </div>
    </PageTransition>
  )
}
