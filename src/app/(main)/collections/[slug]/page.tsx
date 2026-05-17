import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Heart, CloudSun, Coffee, MapPin } from 'lucide-react'
import { PlaceCard } from '@/components/places/PlaceCard'
import { PageTransition } from '@/components/animation/PageTransition'
import { StaggerContainer } from '@/components/animation/StaggerContainer'
import { MotionWrapper } from '@/components/animation/MotionWrapper'
import { cn } from '@/lib/utils/cn'
import { getTrendingPlaces, getPlacesByCategory } from '@/lib/supabase/queries'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

const collectionData: Record<string, { title: string; description: string; icon: string; gradient: string; categorySlug?: string }> = {
  'date-night': {
    title: 'Date Night Spots',
    description: 'Romantic bars, cozy cafés, and evening walks in Meppel. Perfect for that special someone.',
    icon: 'heart',
    gradient: 'from-pink-500/20 to-rose-600/10',
    categorySlug: 'bars',
  },
  'rainy-day': {
    title: 'Rainy Day Refuge',
    description: 'Cozy indoor spots for when the weather turns. Warm drinks, good books, and hygge vibes.',
    icon: 'cloud',
    gradient: 'from-blue-500/20 to-indigo-600/10',
    categorySlug: 'cafes',
  },
  'breakfast': {
    title: 'Best Breakfast',
    description: 'Start your day right with Meppel\'s finest breakfast and brunch spots.',
    icon: 'coffee',
    gradient: 'from-amber-500/20 to-orange-600/10',
    categorySlug: 'cafes',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = collectionData[slug]
  if (!collection) return { title: 'Collection Not Found — meppel' }

  return {
    title: `${collection.title} — meppel Collections`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = collectionData[slug]

  if (!collection) {
    notFound()
  }

  let places: Place[]
  try {
    const rawPlaces = collection.categorySlug
      ? await getPlacesByCategory(collection.categorySlug)
      : await getTrendingPlaces(6)
    places = rawPlaces as unknown as Place[]
  } catch {
    places = []
  }

  const renderIcon = () => {
    switch (collection.icon) {
      case 'heart': return <Heart className="w-7 h-7 text-accent" />
      case 'cloud': return <CloudSun className="w-7 h-7 text-accent" />
      case 'coffee': return <Coffee className="w-7 h-7 text-accent" />
      default: return <MapPin className="w-7 h-7 text-accent" />
    }
  }

  return (
    <PageTransition>
      <StaggerContainer>
        <div className="pt-24 md:pt-28 pb-24">
          {/* Collection Header */}
          <div className={cn(
            'relative overflow-hidden border-b border-border mb-12',
            collection.gradient
          )}>
            <div className="px-6 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
              <MotionWrapper>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    {renderIcon()}
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-display font-semibold text-text-primary">
                      {collection.title}
                    </h1>
                    <p className="text-text-secondary mt-2 max-w-xl">
                      {collection.description}
                    </p>
                    <p className="text-sm text-text-tertiary mt-4">
                      {places.length} place{places.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            </div>
          </div>

          {/* Places Grid */}
          <div className="px-6 md:px-8 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place) => (
                <PlaceCard key={place.id} place={place} variant="standard" />
              ))}
            </div>

            {places.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                  <MapPin className="w-8 h-8 text-text-tertiary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No places yet</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  This collection doesn&apos;t have any places yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </StaggerContainer>
    </PageTransition>
  )
}
