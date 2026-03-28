import { BarChart3, HardDrive, Clock, Zap } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminMetricsQueryOptions } from "../util";

export function MetricsView() {
  const { data: metrics } = useSuspenseQuery(adminMetricsQueryOptions());

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        Application Metrics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Torrents Summary */}
        <section className="bg-white/5 p-5 rounded-xl border border-white/5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Torrents
          </h3>
          <div className="space-y-4">
            <MetricRow label="Total Indexed" value={metrics.torrents.total} />
            <MetricRow label="Avg Seeders" value={metrics.torrents.quality.avg_seeders} />
            <MetricRow label="Max Seeders" value={metrics.torrents.quality.max_seeders} />
            <MetricRow label="Avg Size" value={metrics.torrents.quality.avg_size_formatted} />
          </div>
        </section>

        {/* Searches Summary */}
        <section className="bg-white/5 p-5 rounded-xl border border-white/5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Searches
          </h3>
          <div className="space-y-4">
            <MetricRow label="Total Unique" value={metrics.searches.total_unique} />
            <MetricRow label="Last 24h" value={metrics.searches.last_24h} />
            <MetricRow label="Last 7d" value={metrics.searches.last_7d} />
            <MetricRow label="Last 30d" value={metrics.searches.last_30d} />
          </div>
        </section>

        {/* Debrid Cache */}
        <section className="bg-white/5 p-5 rounded-xl border border-white/5">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Debrid Cache
          </h3>
          <div className="space-y-4">
            <MetricRow label="Total Cached" value={metrics.debrid_cache.total} />
            <div className="mt-4 pt-4 border-t border-white/5">
              {metrics.debrid_cache.by_service.map((s) => (
                <div key={s.service} className="flex justify-between items-center mb-2">
                  <span className="text-sm truncate mr-4 capitalize">{s.service}</span>
                  <span className="text-sm font-bold text-indigo-400">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-bold text-gray-200 font-mono">{value}</span>
    </div>
  );
}
