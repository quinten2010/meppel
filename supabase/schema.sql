-- Meippel Database Schema
-- PostgreSQL via Supabase

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- Users (managed by Supabase Auth, extended with profile data)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'MapPin',
  color TEXT NOT NULL DEFAULT '#D98A6C',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Places
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  description TEXT,
  short_description TEXT,
  price_level SMALLINT NOT NULL DEFAULT 1 CHECK (price_level BETWEEN 1 AND 3),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  postcode TEXT,
  city TEXT NOT NULL DEFAULT 'Meppel',
  phone TEXT,
  website TEXT,
  instagram TEXT,
  hours JSONB,
  photos TEXT[] DEFAULT '{}',
  photo_blurhashes TEXT[] DEFAULT '{}',
  avg_rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  trending_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lists (user-created collections of places)
CREATE TABLE public.lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saves (places saved to lists)
CREATE TABLE public.saves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES public.lists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id, list_id)
);

-- Reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('music', 'food', 'art', 'sports', 'markets', 'workshops', 'nightlife')),
  venue_name TEXT,
  venue_address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ,
  price NUMERIC(8,2),
  price_currency TEXT NOT NULL DEFAULT 'EUR',
  photo TEXT,
  photo_blurhash TEXT,
  organizer_name TEXT,
  organizer_url TEXT,
  attendee_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('going', 'interested')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Indexes
CREATE INDEX idx_places_category ON public.places(category_id);
CREATE INDEX idx_places_trending ON public.places(trending_score DESC);
CREATE INDEX idx_places_location ON public.places USING gist(ll_to_earth(latitude, longitude));
CREATE INDEX idx_places_tags ON public.places USING gin(tags);
CREATE INDEX idx_places_slug ON public.places(slug);
CREATE INDEX idx_places_featured ON public.places(is_featured) WHERE is_featured = true;
CREATE INDEX idx_saves_user ON public.saves(user_id);
CREATE INDEX idx_saves_place ON public.saves(place_id);
CREATE INDEX idx_reviews_place ON public.reviews(place_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_events_start ON public.events(start_datetime);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_lists_user ON public.lists(user_id);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users public read" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users self update" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Places public read" ON public.places FOR SELECT USING (true);
CREATE POLICY "Places admin insert" ON public.places FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Places admin update" ON public.places FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Lists public read" ON public.lists FOR SELECT USING (is_public OR auth.uid() = user_id);
CREATE POLICY "Lists user own" ON public.lists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Lists user update" ON public.lists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Lists user delete" ON public.lists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Saves user own" ON public.saves FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews user own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Reviews user update" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Reviews user delete" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Events public read" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events authenticated insert" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Event RSVPs user own" ON public.event_rsvps FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION public.update_place_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.places
  SET
    avg_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE place_id = NEW.place_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE place_id = NEW.place_id)
  WHERE id = NEW.place_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_place_rating();
