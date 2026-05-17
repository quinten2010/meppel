'use client'

import Link from 'next/link'
import { MapPin, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mb-8">
        <MapPin className="w-10 h-10 text-accent" />
      </div>
      <h1 className="text-6xl md:text-8xl font-display font-semibold text-text-primary mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-display font-semibold text-text-primary mb-4">
        Page not found
      </h2>
      <p className="text-text-secondary max-w-md mb-8">
        Looks like this place doesn&apos;t exist in Meppel. It might have been moved, deleted, or never existed.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-primary hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    </div>
  )
}
