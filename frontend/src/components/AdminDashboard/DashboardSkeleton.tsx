export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Header Stat Cards Shimmer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 h-24">
            <div className="h-3 w-20 bg-white/10 rounded mb-3" />
            <div className="h-6 w-24 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Tabs Shimmer */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-28 bg-white/10 rounded-lg" />
        ))}
      </div>

      {/* Content Area Shimmer */}
      <div className="bg-[#1a1d20] rounded-2xl border border-white/5 shadow-2xl overflow-hidden min-h-[500px] p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-6 h-6 bg-white/10 rounded" />
          <div className="h-6 w-40 bg-white/10 rounded" />
        </div>

        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatBarSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 h-24">
          <div className="h-3 w-20 bg-white/10 rounded mb-3" />
          <div className="h-6 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
