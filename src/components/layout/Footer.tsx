import Link from 'next/link'
import { Camera, Globe, ExternalLink, Heart } from 'lucide-react'
import { SITE_CONFIG, NAV_LINKS } from '@/lib/constants/site'

const socialLinks = [
  { href: SITE_CONFIG.links.instagram, label: 'Instagram', icon: Camera },
  { href: SITE_CONFIG.links.twitter, label: 'Twitter', icon: Globe },
  { href: SITE_CONFIG.links.github, label: 'GitHub', icon: ExternalLink },
]

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-gradient"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="text-sm text-text-tertiary max-w-xs text-center">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          <nav className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>

          <p className="text-xs text-text-tertiary flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-error inline-block" /> in Meppel &mdash;{' '}
            {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
