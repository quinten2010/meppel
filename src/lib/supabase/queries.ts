import { createClient } from './client'
import { isSupabaseAvailable, MOCK_PLACES, MOCK_CATEGORIES, MOCK_EVENTS } from './mock-data'
import type { Place, PlaceFilters, Event, EventFilters, Review, List } from '@/types'

const PLACE_SELECT = `
  id, name, slug, description, short_description,
  price_level, latitude, longitude, address, postcode, city,
  phone, website, instagram, hours, photos, photo_blurhashes,
  avg_rating, review_count, trending_score, is_featured, tags,
  created_at, updated_at,
  category:category_id(id, slug, name, description, icon, color, sort_order)
`

export async function getPlaces(filters?: PlaceFilters) {
  if (!isSupabaseAvailable()) {
    let results = [...MOCK_PLACES]
    if (filters?.category) results = results.filter(p => p.category?.slug === filters.category)
    if (filters?.mood) results = results.filter(p => p.tags?.includes(filters.mood!))
    if (filters?.price) results = results.filter(p => p.price_level === filters.price)
    if (filters?.query) results = results.filter(p => p.name.toLowerCase().includes(filters.query!.toLowerCase()))
    if (filters?.sort === 'rating') results.sort((a, b) => b.avg_rating - a.avg_rating)
    else results.sort((a, b) => b.trending_score - a.trending_score)
    return results.slice(0, filters?.pageSize || 30)
  }
  const supabase = createClient()
  let query = supabase.from('places').select(PLACE_SELECT)

  if (filters?.category) {
    query = query.eq('category.slug', filters.category)
  }
  if (filters?.mood) {
    query = query.contains('tags', [filters.mood])
  }
  if (filters?.price) {
    query = query.eq('price_level', filters.price)
  }
  if (filters?.query) {
    query = query.ilike('name', `%${filters.query}%`)
  }
  if (filters?.sort === 'rating') {
    query = query.order('avg_rating', { ascending: false })
  } else if (filters?.sort === 'newest') {
    query = query.order('created_at', { ascending: false })
  } else {
    query = query.order('trending_score', { ascending: false })
  }

  query = query.limit(filters?.pageSize || 30)
  if (filters?.page && filters.page > 1) {
    query = query.range((filters.page - 1) * (filters.pageSize || 30), filters.page * (filters.pageSize || 30) - 1)
  }

  const { data, error } = await query
  if (error) throw error
  return data as unknown as Place[]
}

export async function getPlaceBySlug(slug: string) {
  if (!isSupabaseAvailable()) {
    const place = MOCK_PLACES.find(p => p.slug === slug)
    if (!place) throw new Error('Not found')
    return place
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('places')
    .select(PLACE_SELECT)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as unknown as Place
}

export async function getTrendingPlaces(limit = 10) {
  if (!isSupabaseAvailable()) {
    return [...MOCK_PLACES].sort((a, b) => b.trending_score - a.trending_score).slice(0, limit)
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('places')
    .select(PLACE_SELECT)
    .order('trending_score', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data as unknown as Place[]
}

export async function getPlacesByCategory(categorySlug: string) {
  if (!isSupabaseAvailable()) {
    return MOCK_PLACES.filter(p => p.category?.slug === categorySlug)
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('places')
    .select(PLACE_SELECT)
    .eq('category.slug', categorySlug)
    .order('avg_rating', { ascending: false })

  if (error) throw error
  return data as unknown as Place[]
}

export async function getFeaturedPlaces() {
  if (!isSupabaseAvailable()) {
    return MOCK_PLACES.filter(p => p.is_featured)
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('places')
    .select(PLACE_SELECT)
    .eq('is_featured', true)
    .limit(6)

  if (error) throw error
  return data as unknown as Place[]
}

export async function getCategories() {
  if (!isSupabaseAvailable()) {
    return MOCK_CATEGORIES
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data
}

export async function getEvents(filters?: EventFilters) {
  if (!isSupabaseAvailable()) {
    let results = [...MOCK_EVENTS]
    if (filters?.category) results = results.filter(e => e.category === filters.category)
    results.sort((a, b) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime())
    return results.slice(0, filters?.pageSize || 30)
  }
  const supabase = createClient()
  let query = supabase.from('events').select('*')

  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.date === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    query = query.gte('start_datetime', today.toISOString()).lt('start_datetime', tomorrow.toISOString())
  } else if (filters?.date === 'weekend') {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const saturday = new Date(today)
    saturday.setDate(today.getDate() + (6 - dayOfWeek))
    saturday.setHours(0, 0, 0, 0)
    const monday = new Date(saturday)
    monday.setDate(monday.getDate() + 2)
    query = query.gte('start_datetime', saturday.toISOString()).lt('start_datetime', monday.toISOString())
  }

  query = query.order('start_datetime', { ascending: true }).limit(filters?.pageSize || 30)

  const { data, error } = await query
  if (error) throw error
  return data as Event[]
}

export async function getEventBySlug(slug: string) {
  if (!isSupabaseAvailable()) {
    const event = MOCK_EVENTS.find(e => e.slug === slug)
    if (!event) throw new Error('Not found')
    return event
  }
  const supabase = createClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Event
}

export async function getReviewsForPlace(placeId: string) {
  if (!isSupabaseAvailable()) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:user_id(id, username, avatar_url)')
    .eq('place_id', placeId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as unknown as Review[]
}

export async function getUserSaves(userId: string) {
  if (!isSupabaseAvailable()) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from('saves')
    .select('*, place:place_id(*)')
    .eq('user_id', userId)

  if (error) throw error
  return data
}

export async function getUserLists(userId: string) {
  if (!isSupabaseAvailable()) return []
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as List[]
}
