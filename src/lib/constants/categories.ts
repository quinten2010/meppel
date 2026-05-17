export interface CategoryConfig {
  slug: string
  name: string
  description: string
  icon: string
  color: string
  gradient: string
  count: number
}

export const CATEGORIES: CategoryConfig[] = [
  { slug: 'cafes', name: 'Cafés', description: 'Coffee, tea, and cozy corners', icon: 'Coffee', color: '#D98A6C', gradient: 'from-amber-500/20 to-orange-600/10', count: 12 },
  { slug: 'bars', name: 'Bars & Cafés', description: 'Borrel, cocktails, and late nights', icon: 'Wine', color: '#A78BFA', gradient: 'from-purple-500/20 to-pink-600/10', count: 8 },
  { slug: 'shopping', name: 'Shopping', description: 'Boutiques, markets, and stores', icon: 'ShoppingBag', color: '#60A5FA', gradient: 'from-blue-500/20 to-indigo-600/10', count: 15 },
  { slug: 'attractions', name: 'Attractions', description: 'Museums, monuments, and landmarks', icon: 'Landmark', color: '#F59E0B', gradient: 'from-yellow-500/20 to-amber-600/10', count: 10 },
  { slug: 'parks', name: 'Parks & Nature', description: 'Green spaces and outdoor escapes', icon: 'Trees', color: '#4ADE80', gradient: 'from-green-500/20 to-emerald-600/10', count: 10 },
  { slug: 'hidden-gems', name: 'Hidden Gems', description: 'Off the beaten path', icon: 'MapPin', color: '#FB7185', gradient: 'from-rose-500/20 to-pink-600/10', count: 6 },
  { slug: 'events', name: 'Events', description: 'What\'s happening in Meppel', icon: 'Sun', color: '#F472B6', gradient: 'from-pink-500/20 to-rose-600/10', count: 9 },
]

export const MOODS = [
  { slug: 'cozy', label: 'Cozy', icon: 'Flame' },
  { slug: 'romantic', label: 'Romantic', icon: 'Heart' },
  { slug: 'lively', label: 'Lively', icon: 'Zap' },
  { slug: 'quiet', label: 'Quiet', icon: 'Moon' },
  { slug: 'instagrammable', label: 'Photogenic', icon: 'Camera' },
  { slug: 'student-friendly', label: 'Student Friendly', icon: 'GraduationCap' },
  { slug: 'family-friendly', label: 'Family Friendly', icon: 'Users' },
]

export const PRICE_LABELS = { 0: 'Free', 1: '€', 2: '€€', 3: '€€€', 4: '€€€€' }
export const PRICE_DESCRIPTIONS = { 0: 'Free', 1: 'Budget-friendly', 2: 'Moderate', 3: 'Premium', 4: 'Fine dining' }

export const SORT_OPTIONS = [
  { value: 'trending', label: 'Trending' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'distance', label: 'Nearest' },
]
