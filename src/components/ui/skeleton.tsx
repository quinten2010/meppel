import { cn } from '@/lib/utils/cn'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
}

export function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton-shimmer rounded-lg',
        variant === 'circular' && 'rounded-full',
        variant === 'card' && 'rounded-2xl',
        className
      )}
      {...props}
    />
  )
}
