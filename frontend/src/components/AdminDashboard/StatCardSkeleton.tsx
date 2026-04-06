export function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white/80 dark:bg-[#1a1d20]/90 border border-gray-200 dark:border-white/5 rounded-xl p-5 min-h-30 shadow-lg animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-gray-200 dark:bg-white/5 rounded-lg" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
