'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { overlayFade } from '@/lib/animations/transitions'
import { scaleIn } from '@/lib/animations/primitives'

const DialogRoot = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = ({ children, ...props }: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props}>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {children}
    </div>
  </DialogPrimitive.Portal>
)

function DialogOverlay() {
  return (
    <AnimatePresence>
      <DialogPrimitive.Overlay asChild forceMount>
        <motion.div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          {...overlayFade}
        />
      </DialogPrimitive.Overlay>
    </AnimatePresence>
  )
}

const DialogContent = forwardRef<HTMLDivElement, DialogPrimitive.DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content asChild ref={ref} {...props}>
          <motion.div
            className={cn(
              'relative z-50 w-full max-w-lg rounded-2xl bg-bg-elevated border border-border p-6 shadow-2xl',
              className
            )}
            {...scaleIn}
          >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1 text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </DialogPrimitive.Close>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  }
)
DialogContent.displayName = 'DialogContent'

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('mb-6 space-y-1.5', className)} {...props} />
)

const DialogTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-xl font-semibold text-text-primary', className)} {...props} />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

export { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription }
