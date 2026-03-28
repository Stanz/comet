function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-white/5 rounded-xl animate-pulse ${className ?? ""}`} />;
}

export function SystemSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-48 bg-white/10 rounded mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonBlock className="h-[200px]" />
        <SkeletonBlock className="h-[200px]" />
      </div>
    </div>
  );
}
