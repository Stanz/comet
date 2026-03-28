function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className ?? ""}`} />;
}

export function ConnectionsSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-48 bg-white/10 rounded mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <SkeletonBlock key={i} className="h-[120px]" />
        ))}
      </div>
      <SkeletonBlock className="h-[300px]" />
    </div>
  );
}
