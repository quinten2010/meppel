import { type Variants } from 'framer-motion'

export const pageTransition: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export const slideUp: Variants = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export const overlayFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const searchOverlay: Variants = {
  closed: { opacity: 0, scale: 0.95, clipPath: 'circle(0% at 50% 20%)' },
  open: {
    opacity: 1,
    scale: 1,
    clipPath: 'circle(150% at 50% 20%)',
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}
