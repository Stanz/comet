export function ConfigSkeleton() {
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden animate-pulse">
      {/* Sidebar / Top Header on Mobile skeleton */}
      <div className="w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 p-2 md:p-3 flex md:flex-col gap-2 overflow-hidden">
        <div className="hidden md:block h-3 w-16 bg-gray-200 dark:bg-white/10 rounded px-2 mb-1 shrink-0" />
        <div className="flex md:flex-col gap-1.5 md:gap-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-8 md:h-9 w-24 md:w-full bg-gray-100 dark:bg-white/5 rounded-full md:rounded-lg shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Main area skeleton */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Toolbar skeleton */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3">
          <div className="flex-1 min-w-48 h-8 bg-gray-100 dark:bg-white/5 rounded-lg" />
          <div className="ml-auto flex items-center gap-2">
            <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded mr-2 hidden sm:block" />
            <div className="h-8 w-8 bg-gray-100 dark:bg-white/5 rounded" />
          </div>
        </div>

        {/* Legend skeleton */}
        <div className="px-4 py-3 flex items-center gap-4 text-[10px] border-b border-gray-100 dark:border-white/5 hidden md:flex">
          <div className="h-3 w-28 bg-gray-100 dark:bg-white/5 rounded" />
          <div className="h-3 w-32 bg-gray-100 dark:bg-white/5 rounded" />
          <div className="h-3 w-24 bg-gray-100 dark:bg-white/5 rounded" />
        </div>

        {/* Settings list skeleton */}
        <div className="overflow-y-auto flex-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 flex flex-col gap-2 border-b border-gray-100 dark:border-white/5"
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-2 w-full max-w-xs">
                  <div className="h-4 w-32 md:w-48 bg-gray-200 dark:bg-white/10 rounded" />
                </div>
                <div className="flex items-center gap-2 ml-auto shrink-0">
                  <div className="h-4 w-12 md:w-32 bg-gray-100 dark:bg-white/5 rounded" />
                  <div className="w-6 h-6 bg-gray-100 dark:bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-3 w-3/4 md:w-1/2 bg-gray-100 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
