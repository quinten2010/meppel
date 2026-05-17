'use server'

import { getPlaces as queryPlaces, getPlaceBySlug as queryPlaceBySlug, getTrendingPlaces as queryTrendingPlaces, getFeaturedPlaces as queryFeaturedPlaces, getPlacesByCategory as queryPlacesByCategory } from '@/lib/supabase/queries'
import type { PlaceFilters } from '@/types'
import type { Place } from '@/types'

export async function getPlaces(filters?: PlaceFilters): Promise<Place[]> {
  return queryPlaces(filters) as unknown as Promise<Place[]>
}

export async function getPlaceBySlug(slug: string): Promise<Place> {
  return queryPlaceBySlug(slug) as unknown as Promise<Place>
}

export async function getTrendingPlaces(limit?: number): Promise<Place[]> {
  return queryTrendingPlaces(limit) as unknown as Promise<Place[]>
}

export async function getFeaturedPlaces(): Promise<Place[]> {
  return queryFeaturedPlaces() as unknown as Promise<Place[]>
}

export async function getPlacesByCategory(categorySlug: string): Promise<Place[]> {
  return queryPlacesByCategory(categorySlug) as unknown as Promise<Place[]>
}
