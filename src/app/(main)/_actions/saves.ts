'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function savePlace(placeId: string, listId?: string) {
  const supabase = await createServerSupabase()
  if (!supabase) throw new Error('Database not configured')
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in to save places')
  }

  const { data, error } = await supabase
    .from('saves')
    .insert({
      user_id: user.id,
      place_id: placeId,
      list_id: listId || null,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/places/[slug]')
  revalidatePath('/profile')
  return data
}

export async function removeSave(saveId: string) {
  const supabase = await createServerSupabase()
  if (!supabase) throw new Error('Database not configured')
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be signed in to remove saves')
  }

  const { error } = await supabase
    .from('saves')
    .delete()
    .eq('id', saveId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/places/[slug]')
  revalidatePath('/profile')
}

export async function getSaveForUserAndPlace(placeId: string) {
  const supabase = await createServerSupabase()
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('saves')
    .select('id')
    .eq('user_id', user.id)
    .eq('place_id', placeId)
    .maybeSingle()

  return data
}
