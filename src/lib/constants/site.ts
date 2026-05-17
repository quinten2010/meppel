export const SITE_CONFIG = {
  name: 'meppel',
  tagline: 'Discover Meppel. Beautifully.',
  description: 'The most beautiful way to discover Meppel — curated spots, events, and hidden gems.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locale: 'nl_NL',
  themeColor: '#0A0A0B',
  backgroundColor: '#0A0A0B',
  links: {
    twitter: 'https://twitter.com/meppel',
    instagram: 'https://instagram.com/meppel',
    github: 'https://github.com/meppel',
  },
}

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Discover' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
]

export const MEPPEL_CENTER = { lat: 52.696, lng: 6.196 }
export const MEPPEL_ZOOM = 14
