export default function Loading() {
  return (
    <div className="pt-24 md:pt-28 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="rounded-2xl overflow-hidden h-64 md:h-80 bg-white/5 animate-pulse mb-10" />
      <div className="space-y-3 mb-10">
        <div className="h-8 w-48 bg-white/5 animate-pulse rounded" />
        <div className="h-12 w-96 bg-white/5 animate-pulse rounded" />
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="h-4 w-full bg-white/5 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-white/5 animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-white/5 animate-pulse rounded" />
        </div>
        <div className="space-y-6">
          <div className="h-48 bg-white/5 animate-pulse rounded-2xl" />
          <div className="h-32 bg-white/5 animate-pulse rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
