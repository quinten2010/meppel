export default function Loading() {
  return (
    <div className="pt-24 md:pt-28 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border">
            <div className="flex">
              <div className="w-28 md:w-32 h-32 bg-white/5 animate-pulse shrink-0" />
              <div className="flex-1 p-4 space-y-3">
                <div className="h-4 w-20 bg-white/5 animate-pulse rounded" />
                <div className="h-5 w-3/4 bg-white/5 animate-pulse rounded" />
                <div className="h-3 w-1/2 bg-white/5 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
