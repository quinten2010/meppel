import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { MapPin, Globe, Phone, Clock, Share2, Heart, ArrowRight, Star } from 'lucide-react'
import { PlaceGallery } from '@/components/places/PlaceGallery'
import { ReviewCard } from '@/components/places/ReviewCard'
import { ReviewForm } from '@/components/places/ReviewForm'
import { PlaceCard } from '@/components/places/PlaceCard'
import { MapView } from '@/components/map/MapView'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { formatPrice, formatRating } from '@/lib/utils/format'
import { getPlaceBySlug, getReviewsForPlace, getTrendingPlaces } from '@/lib/supabase/queries'
import type { Place, Review } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  try {
    const place = await getPlaceBySlug(slug)
    return {
      title: `${place.name} — meppel`,
      description: place.short_description || place.description || `Discover ${place.name} in Meppel`,
      openGraph: {
        images: place.photos?.[0] ? [{ url: place.photos[0] }] : [],
      },
    }
  } catch {
    return { title: 'Place Not Found — meppel' }
  }
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params

  let place: Place
  let reviews: Review[]
  let similarPlaces: Place[]

  try {
    place = await getPlaceBySlug(slug) as unknown as Place
    reviews = await getReviewsForPlace(place.id) as unknown as Review[]
    similarPlaces = await getTrendingPlaces(3) as unknown as Place[]
    similarPlaces = similarPlaces.filter((p) => p.id !== place.id).slice(0, 3)
  } catch {
    notFound()
  }

  const categoryName = place.category?.name
  const avgRating = place.avg_rating ?? 0
  const reviewCount = place.review_count ?? reviews.length

  return (
    <PageTransition>
      <StaggerContainer>
        <article className="pt-24 md:pt-28 pb-24">
          {/* Gallery */}
          <div className="px-6 md:px-8 max-w-7xl mx-auto mb-10">
            <PlaceGallery photos={place.photos} />
          </div>

          {/* Title & Actions */}
          <div className="px-6 md:px-8 max-w-7xl mx-auto mb-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {categoryName && (
                    <Badge variant="category" size="sm">
                      {categoryName}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium text-text-primary">
                      {formatRating(avgRating)}
                    </span>
                    {reviewCount > 0 && (
                      <span className="text-sm text-text-tertiary">({reviewCount})</span>
                    )}
                  </div>
                  <span className="text-sm text-text-tertiary">{formatPrice(place.price_level)}</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-semibold text-text-primary">
                  {place.name}
                </h1>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button variant="secondary" size="sm">
                  <Heart className="w-4 h-4" />
                  Save
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="px-6 md:px-8 max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-10">
              {/* Description */}
              {place.description && (
                <MotionWrapper>
                  <h2 className="text-xl font-semibold text-text-primary mb-4">About</h2>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {place.description}
                  </p>
                </MotionWrapper>
              )}

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <MotionWrapper>
                  <h2 className="text-xl font-semibold text-text-primary mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="md">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </MotionWrapper>
              )}

              {/* Reviews */}
              <MotionWrapper>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Reviews
                    {reviewCount > 0 && (
                      <span className="text-text-tertiary font-normal ml-1">({reviewCount})</span>
                    )}
                  </h2>
                </div>

                <ReviewForm />

                {reviews.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </MotionWrapper>
            </div>

            {/* Right Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Info Card */}
                <div className="rounded-2xl glass-strong border border-border p-6 space-y-5">
                  <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                    Information
                  </h3>

                  {place.hours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                      <div className="text-sm text-text-secondary">
                        {Object.entries(place.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between gap-4">
                            <span className="capitalize">{day}</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {place.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-text-secondary">{place.address}</p>
                        {place.postcode && (
                          <p className="text-sm text-text-tertiary">
                            {place.postcode}, {place.city}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-accent hover:text-accent-dark transition-colors"
                    >
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">Visit website</span>
                      <ArrowRight className="w-3 h-3 ml-auto shrink-0" />
                    </a>
                  )}

                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      className="flex items-center gap-3 text-sm text-accent hover:text-accent-dark transition-colors"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>{place.phone}</span>
                    </a>
                  )}
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden border border-border h-48">
                  <MapView
                    latitude={place.latitude}
                    longitude={place.longitude}
                    zoom={16}
                    className="w-full h-full"
                  />
                </div>

                {/* Get Directions */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
                      '_blank'
                    )
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>

          {/* Similar Places */}
          {similarPlaces.length > 0 && (
            <section className="px-6 md:px-8 max-w-7xl mx-auto mt-24">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-primary mb-8">
                Similar Places
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {similarPlaces.map((p) => (
                  <PlaceCard key={p.id} place={p} variant="standard" />
                ))}
              </div>
            </section>
          )}
        </article>
      </StaggerContainer>
    </PageTransition>
  )
}
