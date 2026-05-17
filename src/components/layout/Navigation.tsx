'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { Home, Compass, Bookmark, User, Search, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants/site'
import { Button } from '@/components/ui/button'

const bottomNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/explore', label: 'Discover', icon: Compass },
  { href: '/saved', label: 'Saved', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
]

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem('meppel-theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavVisible, setMobileNavVisible] = useState(true)
  const [isDark, setIsDark] = useState(getInitialTheme)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50)
    if (latest > lastScrollY.current && latest > 100) {
      setMobileNavVisible(false)
    } else {
      setMobileNavVisible(true)
    }
    lastScrollY.current = latest
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('meppel-theme', next ? 'dark' : 'light')
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8"
        style={{ opacity: 1 }}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl flex items-center justify-between h-16 md:h-20 px-4 md:px-8 rounded-2xl md:rounded-full mt-2 md:mt-4 transition-all duration-500',
            scrolled
              ? 'bg-bg-primary/80 backdrop-blur-xl border border-border shadow-lg'
              : 'bg-bg-primary/40 backdrop-blur-lg border border-transparent'
          )}
        >
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gradient shrink-0"
          >
            {SITE_CONFIG.name}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200',
                    isActive
                      ? 'text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-full bg-accent/10 border border-accent/20"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="primary" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileNavVisible && (
          <motion.nav
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="glass-strong rounded-2xl mx-3 mb-3 px-2 py-1 flex items-center justify-around border border-border">
              {bottomNavItems.map((item) => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center gap-0.5 py-2 px-4 rounded-xl transition-all duration-200 relative',
                      isActive
                        ? 'text-accent'
                        : 'text-text-tertiary hover:text-text-secondary'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobile-nav-indicator"
                        className="absolute inset-0 rounded-xl bg-accent/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
