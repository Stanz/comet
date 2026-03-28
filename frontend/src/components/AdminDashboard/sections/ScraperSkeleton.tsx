function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className ?? ""}`} />;
}

export function ScraperSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-48 bg-white/10 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <SkeletonBlock className="h-[180px]" />
          <SkeletonBlock className="h-[180px]" />
        </div>
        <SkeletonBlock className="h-[400px]" />
      </div>
    </div>
  );
}
