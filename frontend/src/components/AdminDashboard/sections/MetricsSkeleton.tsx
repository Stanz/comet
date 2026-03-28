function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className ?? ""}`} />;
}

export function MetricsSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-48 bg-white/10 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonBlock key={i} className="h-52" />
        ))}
      </div>
    </div>
  );
}
