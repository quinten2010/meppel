import Link from 'next/link'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <EmptyState
        icon="map"
        title="Page not found"
        description="This page doesn&apos;t exist or has been moved."
      />
      <div className="mt-4">
        <Link href="/">
          <Button variant="primary" size="md">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}
