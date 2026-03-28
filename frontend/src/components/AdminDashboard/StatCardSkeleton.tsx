export function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-[#1a1d20]/90 border border-white/5 rounded-2xl p-4 h-30 animate-pulse"
        >
          <div className="h-3 w-20 bg-white/10 rounded mb-3" />
          <div className="h-6 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
