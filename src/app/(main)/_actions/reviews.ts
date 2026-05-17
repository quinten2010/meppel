'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { reviewSchema } from '@/lib/utils/validations'
import type { ReviewInput } from '@/lib/utils/validations'

export async function createReview(placeId: string, data: ReviewInput) {
  const parsed = reviewSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid review data')
  }

  const supabase = await createServerSupabase()
  if (!supabase) throw new Error('Database not configured')
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in to leave a review')
  }

  const { data: review, error: reviewError } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      place_id: placeId,
      rating: parsed.data.rating,
      text: parsed.data.text,
      photos: parsed.data.photos || [],
    })
    .select()
    .single()

  if (reviewError) throw reviewError

  // Update place avg_rating
  const { data: ratingData } = await supabase
    .from('reviews')
    .select('rating')
    .eq('place_id', placeId)

  if (ratingData && ratingData.length > 0) {
    const avgRating = ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length

    await supabase
      .from('places')
      .update({
        avg_rating: Math.round(avgRating * 10) / 10,
        review_count: ratingData.length,
      })
      .eq('id', placeId)
  }

  revalidatePath(`/places/${placeId}`)
  return review
}

export async function deleteReview(reviewId: string) {
  const supabase = await createServerSupabase()
  if (!supabase) throw new Error('Database not configured')
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in to delete reviews')
  }

  const { data: review } = await supabase
    .from('reviews')
    .select('place_id')
    .eq('id', reviewId)
    .single()

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) throw error

  if (review) {
    revalidatePath(`/places/${review.place_id}`)
  }
}
