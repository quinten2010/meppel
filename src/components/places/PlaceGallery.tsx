'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface PlaceGalleryProps {
  photos: string[]
  blurhashes?: string[]
  className?: string
}

export function PlaceGallery({ photos, blurhashes, className }: PlaceGalleryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set())
  const [lightboxError, setLightboxError] = useState(false)

  const handleImageError = useCallback((index: number) => {
    setErrorImages((prev) => new Set(prev).add(index))
  }, [])

  const handleLightboxImageError = useCallback(() => {
    setLightboxError(true)
  }, [])

  const openGallery = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    setLightboxError(false)
  }, [])

  const handlePrev = useCallback(() => {
    setLightboxError(false)
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }, [photos.length])

  const handleNext = useCallback(() => {
    setLightboxError(false)
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }, [photos.length])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'Escape') setIsOpen(false)
    },
    [handlePrev, handleNext]
  )

  if (!photos || photos.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center rounded-2xl bg-gradient-card border border-border h-64',
        className
      )}>
        <div className="flex flex-col items-center gap-2 text-text-tertiary">
          <ImageIcon className="w-8 h-8" />
          <span className="text-sm">No photos yet</span>
        </div>
      </div>
    )
  }

  const mainPhoto = photos[0]
  const sidePhotos = photos.slice(1, 3)

  return (
    <>
      <div className={cn('grid grid-cols-4 gap-2 rounded-2xl overflow-hidden h-64 md:h-80', className)}>
        <button
          onClick={() => openGallery(0)}
          className="col-span-2 md:col-span-2 relative overflow-hidden group cursor-pointer"
        >
          {!loadedImages.has(0) && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: blurhashes?.[0] ? 'url(placeholder)' : undefined }}
            />
          )}
{errorImages.has(0) ? (
            <div className="absolute inset-0 bg-gradient-card flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-text-tertiary" />
            </div>
          ) : (
            <Image
              src={mainPhoto}
              alt=""
              fill
              className={cn(
                'object-cover transition-all duration-500 group-hover:scale-105',
                loadedImages.has(0) ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setLoadedImages((prev) => new Set(prev).add(0))}
              onError={() => handleImageError(0)}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </button>

        <div className="col-span-2 grid grid-rows-2 gap-2">
          {sidePhotos.map((photo, i) => {
            const idx = i + 1
            return (
              <button
                key={idx}
                onClick={() => openGallery(idx)}
                className="relative overflow-hidden group cursor-pointer"
              >
                {!loadedImages.has(idx) && !errorImages.has(idx) && (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: blurhashes?.[idx] ? 'url(placeholder)' : undefined }}
                  />
                )}
                {errorImages.has(idx) ? (
                  <div className="absolute inset-0 bg-gradient-card flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-text-tertiary" />
                  </div>
                ) : (
                  <Image
                    src={photo}
                    alt=""
                    fill
                    className={cn(
                      'object-cover transition-all duration-500 group-hover:scale-105',
                      loadedImages.has(idx) ? 'opacity-100' : 'opacity-0'
                    )}
                    onLoad={() => setLoadedImages((prev) => new Set(prev).add(idx))}
                    onError={() => handleImageError(idx)}
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </button>
            )
          })}
        </div>

        {photos.length > 3 && (
          <button
            onClick={() => openGallery(3)}
            className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors"
          >
            +{photos.length - 3} photos
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-2 absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {photos.length}
            </div>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl max-h-[85vh] px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {lightboxError ? (
                <div className="w-full h-full flex items-center justify-center bg-white/10 rounded-2xl">
                  <ImageIcon className="w-12 h-12 text-white/40" />
                </div>
              ) : (
                <Image
                  src={photos[currentIndex]}
                  alt=""
                  fill
                  className="object-contain rounded-2xl"
                  onError={handleLightboxImageError}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
