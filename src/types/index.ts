export interface Place {
  id: string
  name: string
  slug: string
  category_id: string
  category?: Category
  description: string | null
  short_description: string | null
  price_level: 0 | 1 | 2 | 3 | 4
  latitude: number
  longitude: number
  address: string
  postcode: string | null
  city: string
  phone: string | null
  website: string | null
  instagram: string | null
  hours: Record<string, string> | null
  photos: string[]
  photo_blurhashes: string[]
  avg_rating: number
  review_count: number
  trending_score: number
  is_featured: boolean
  tags: string[]
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  icon: string
  color: string
  sort_order: number
}

export interface Event {
  id: string
  name: string
  slug: string
  description: string | null
  category: EventCategory
  venue_name: string | null
  venue_address: string | null
  latitude: number | null
  longitude: number | null
  start_datetime: string
  end_datetime: string | null
  price: number | null
  price_currency: string
  photo: string | null
  photo_blurhash: string | null
  organizer_name: string | null
  organizer_url: string | null
  attendee_count: number
  created_by: string | null
  created_at: string
  updated_at: string
  user_rsvp?: 'going' | 'interested' | null
}

export type EventCategory = 'music' | 'food' | 'art' | 'sports' | 'markets' | 'workshops' | 'nightlife' | 'shopping'

export interface Review {
  id: string
  user_id: string
  place_id: string
  rating: number
  text: string | null
  photos: string[]
  created_at: string
  updated_at: string
  user?: UserProfile
}

export interface UserProfile {
  id: string
  email: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
}

export interface List {
  id: string
  user_id: string
  name: string
  description: string | null
  is_public: boolean
  is_default: boolean
  created_at: string
  updated_at: string
  places?: Place[]
  _count?: { places: number }
}

export interface Save {
  id: string
  user_id: string
  place_id: string
  list_id: string
  created_at: string
  place?: Place
}

export type PriceLevel = 1 | 2 | 3

export type MoodTag = 'cozy' | 'romantic' | 'lively' | 'quiet' | 'instagrammable' | 'student-friendly' | 'family-friendly'

export interface PlaceFilters {
  category?: string
  mood?: MoodTag
  price?: PriceLevel
  sort?: 'trending' | 'rating' | 'newest' | 'distance'
  query?: string
  page?: number
  pageSize?: number
}

export interface EventFilters {
  date?: 'today' | 'tomorrow' | 'weekend' | 'week' | 'custom'
  category?: EventCategory
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}
