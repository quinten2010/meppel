'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import { MEPPEL_CENTER, MEPPEL_ZOOM } from '@/lib/constants/site'
import { cn } from '@/lib/utils/cn'

interface MapViewProps {
  latitude?: number
  longitude?: number
  zoom?: number
  className?: string
  interactive?: boolean
}

const DynamicMap = dynamic(
  () => import('./MapInner'),
  {
    ssr: false,
    loading: () => <MapPlaceholder />,
  }
)

export function MapView({ latitude, longitude, zoom, className, interactive = true }: MapViewProps) {
  const center = { lat: latitude ?? MEPPEL_CENTER.lat, lng: longitude ?? MEPPEL_CENTER.lng }
  const mapZoom = zoom ?? (latitude ? 15 : MEPPEL_ZOOM)

  return (
    <div className={cn('relative rounded-2xl overflow-hidden', className)}>
      <DynamicMap
        latitude={center.lat}
        longitude={center.lng}
        zoom={mapZoom}
        interactive={interactive}
      />
    </div>
  )
}

function MapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-accent/10 via-bg-primary to-accent/5 flex flex-col items-center justify-center gap-4 border border-border rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
        <MapPin className="w-8 h-8 text-accent" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text-primary">Map loading...</p>
        <p className="text-xs text-text-tertiary mt-1">
          {MEPPEL_CENTER.lat.toFixed(3)}, {MEPPEL_CENTER.lng.toFixed(3)}
        </p>
      </div>
    </div>
  )
}
