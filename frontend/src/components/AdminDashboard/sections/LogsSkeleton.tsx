export function LogsSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-10 bg-white/5 rounded-xl mb-4" />
      <div className="space-y-2">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-6 bg-white/5 rounded"
            style={{ width: `${70 + (i % 3) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}
