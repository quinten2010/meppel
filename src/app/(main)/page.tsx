import { SearchBar } from "@/components/search/SearchBar";
import { PlaceCard } from "@/components/places/PlaceCard";
import { EventCard } from "@/components/events/EventCard";
import { MapView } from "@/components/map/MapView";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { PageTransition } from "@/components/animation/PageTransition";
import { StaggerContainer } from "@/components/animation/StaggerContainer";
import { MotionWrapper } from "@/components/animation/MotionWrapper";
import { CATEGORIES } from "@/lib/constants/categories";
import { getTrendingPlaces, getFeaturedPlaces, getCategories, getEvents } from "@/lib/supabase/queries";
import { Heart, CloudSun, Coffee, Calendar } from "lucide-react";

const collections = [
  {
    slug: "date-night",
    title: "Date Night Spots",
    description: "Romantic bars, cozy cafés, and evening walks",
    icon: Heart,
    gradient: "from-pink-500/20 to-rose-600/10",
  },
  {
    slug: "rainy-day",
    title: "Rainy Day Refuge",
    description: "Cozy indoor spots for when the weather turns",
    icon: CloudSun,
    gradient: "from-blue-500/20 to-indigo-600/10",
  },
  {
    slug: "breakfast",
    title: "Best Breakfast",
    description: "Start your day right with Meppel's finest mornings",
    icon: Coffee,
    gradient: "from-amber-500/20 to-orange-600/10",
  },
];

export default async function HomePage() {
  const [trendingPlaces, featuredPlaces, categories, events] = await Promise.all([
    getTrendingPlaces(10),
    getFeaturedPlaces(),
    getCategories(),
    getEvents({}),
  ]);

  return (
    <PageTransition>
      <StaggerContainer>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
          <div className="absolute inset-0 gradient-hero" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold tracking-tight text-balance">
              Discover Meppel.
              <br />
              <span className="text-gradient">Beautifully.</span>
            </h1>
            <p className="mt-6 text-lg text-text-secondary max-w-lg">
              The most beautiful way to discover Meppel — curated spots, events,
              and hidden gems.
            </p>

            <div className="mt-10 w-full max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <CategoryPill key={cat.slug} slug={cat.slug} size="sm" />
              ))}
            </div>
          </div>
        </section>

        {/* Trending Now */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader
            title="Trending Now in Meppel"
            link={{ href: "/explore", label: "View all" }}
          />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-6 md:-mx-8 px-6 md:px-8">
            {trendingPlaces.map((place) => (
              <div key={place.id} className="min-w-[320px] md:min-w-[400px] flex-shrink-0">
                <PlaceCard place={place} variant="hero" />
              </div>
            ))}
          </div>
        </section>

        {/* Category Grid */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader title="Browse by Category" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => {
              const category = categories?.find((c) => c.slug === cat.slug)
              const count = category?.count ?? cat.count
              return (
                <a
                  key={cat.slug}
                  href={`/explore?category=${cat.slug}`}
                  className={`relative group rounded-2xl overflow-hidden border border-border bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-300 hover:border-border-hover hover:-translate-y-1`}
                >
                  <div className="relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <h3 className="font-semibold text-text-primary text-lg">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1">
                      {count} places
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Collections */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader
            title="Discover Collections"
            subtitle="Curated by locals who love Meppel"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {collections.map((col) => {
              const Icon = col.icon
              return (
                <a
                  key={col.slug}
                  href={`/collections/${col.slug}`}
                  className={`relative group rounded-2xl overflow-hidden border border-border bg-gradient-to-br ${col.gradient} p-8 transition-all duration-300 hover:border-border-hover hover:-translate-y-1`}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-primary text-xl mb-2">
                      {col.title}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {col.description}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* Featured Places */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader
            title="Featured Places"
            subtitle="Handpicked favorites from our community"
            link={{ href: "/explore?sort=rating", label: "Top rated" }}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} variant="detailed" />
            ))}
          </div>
        </section>

        {/* What's On */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader
            title="What's On"
            subtitle="Upcoming events in Meppel"
            link={{ href: "/events", label: "View all events" }}
          />
          <div className="space-y-4">
            {events.slice(0, 4).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Map Preview */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <SectionHeader
            title="Explore the Map"
            subtitle="Find places near you in Meppel"
          />
          <MotionWrapper className="h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-border">
            <MapView interactive={false} className="w-full h-full" />
          </MotionWrapper>
        </section>

        {/* Newsletter CTA */}
        <section className="px-6 md:px-8 max-w-7xl mx-auto mb-24">
          <MotionWrapper>
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/10 via-bg-primary to-accent/5 p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-7 h-7 text-accent" />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-semibold text-text-primary mb-4">
                  Never miss an event
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  Get weekly updates on the best places and events in Meppel, delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-300"
                  />
                  <button className="px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-colors shrink-0">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-text-tertiary mt-4">
                  No spam, unsubscribe at any time.
                </p>
              </div>
            </div>
          </MotionWrapper>
        </section>
      </StaggerContainer>
    </PageTransition>
  );
}
