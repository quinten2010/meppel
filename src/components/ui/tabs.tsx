'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils/cn'

const TabsRoot = TabsPrimitive.Root

const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={cn(
      'inline-flex items-center gap-1 rounded-2xl bg-white/5 p-1 border border-border',
      className
    )}
    {...props}
  />
)

const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-text-tertiary',
      'transition-all duration-200',
      'data-[state=active]:bg-accent/20 data-[state=active]:text-accent data-[state=active]:shadow-sm',
      'hover:text-text-primary',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      className
    )}
    {...props}
  />
)

const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content
    className={cn('mt-4 focus-visible:outline-none', className)}
    {...props}
  />
)

export { TabsRoot, TabsList, TabsTrigger, TabsContent }
