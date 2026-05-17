import Link from 'next/link'
import { MapPin, Mail, Code } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary">
      <div className="px-6 md:px-8 max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-accent" />
              <span className="text-xl font-display font-semibold text-text-primary">meppel</span>
            </div>
            <p className="text-sm text-text-secondary max-w-sm mb-6">
              The most beautiful way to discover Meppel. Curated spots, local events, and hidden gems — all in one place.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/quinten2010/meppel"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-border text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
                aria-label="GitHub"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@meppel.app"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-border text-text-tertiary hover:text-text-primary hover:border-border-hover transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  All Places
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/collections/date-night" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Submit a Place
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore?category=restaurants" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/explore?category=cafes" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Cafés
                </Link>
              </li>
              <li>
                <Link href="/explore?category=bars" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Bars
                </Link>
              </li>
              <li>
                <Link href="/explore?category=shopping" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                  Shopping
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            © {new Date().getFullYear()} meppel. Made with love for Meppel.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
              About
            </Link>
            <Link href="/about#privacy" className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
              Privacy
            </Link>
            <Link href="/about#terms" className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
