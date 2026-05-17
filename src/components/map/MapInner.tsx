'use client'

import { MapPin, Navigation } from 'lucide-react'

interface MapInnerProps {
  latitude: number
  longitude: number
  zoom: number
  interactive: boolean
}

export default function MapInner({ latitude, longitude, zoom, interactive }: MapInnerProps) {
  return (
    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-accent/5 via-bg-primary to-accent/10 flex flex-col items-center justify-center gap-4 border border-border rounded-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mapgrid)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center animate-pulse">
          <MapPin className="w-10 h-10 text-accent" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-text-primary">Explore Meppel</h3>
          <p className="text-sm text-text-tertiary">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </p>
          <p className="text-xs text-text-tertiary">
            Zoom level: {zoom}
          </p>
        </div>

        {interactive && (
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors cursor-not-allowed opacity-60"
            disabled
          >
            <Navigation className="w-4 h-4" />
            Map requires API key
          </button>
        )}
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary/50">Meppel, Netherlands</span>
      </div>
    </div>
  )
}
