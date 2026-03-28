export function ConfigSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-3">
      <div className="h-6 w-48 bg-white/10 rounded mb-6" />
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex justify-between items-center h-10 bg-white/5 rounded-lg px-4">
          <div className="h-3 w-32 bg-white/10 rounded" />
          <div className="h-3 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}
