'use client'

import { motion, type Variants } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

interface MotionWrapperProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  as?: 'div' | 'section' | 'article' | 'span'
}

export function MotionWrapper({
  children,
  variants,
  className,
  as = 'div',
}: MotionWrapperProps) {
  const prefersReduced = useReducedMotion()

  const defaultVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  if (prefersReduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as as keyof typeof motion] as React.ElementType

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
