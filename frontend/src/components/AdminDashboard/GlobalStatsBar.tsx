import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Activity, HardDrive, Users, Zap } from "lucide-react";

import { adminConnectionsQueryOptions, adminMetricsQueryOptions } from "./util";
import { StatCard } from "./StatCard";
import { StatCardSkeleton } from "./StatCardSkeleton";
import { ErrorBoundary } from "../ui/ErrorBoundary";

function GlobalStatsBarContent() {
  const { data: connectionsData } = useSuspenseQuery(adminConnectionsQueryOptions());
  const { data: metricsData } = useSuspenseQuery(adminMetricsQueryOptions());

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Active Connections"
        value={connectionsData.global_stats.active_connections}
        icon={<Users className="w-4 h-4" />}
        color="text-sky-400"
      />
      <StatCard
        title="Current Speed"
        value={connectionsData.global_stats.total_current_speed_formatted}
        icon={<Zap className="w-4 h-4" />}
        color="text-amber-400"
      />
      <StatCard
        title="Session Traffic"
        value={connectionsData.global_stats.total_bytes_session_formatted}
        icon={<Activity className="w-4 h-4" />}
        color="text-emerald-400"
      />
      <StatCard
        title="Total Torrents"
        value={metricsData.torrents.total}
        icon={<HardDrive className="w-4 h-4" />}
        color="text-indigo-400"
      />
    </div>
  );
}

export function GlobalStatsBar() {
  return (
    <ErrorBoundary fallbackMessage="Failed to load global statistics. Retrying...">
      <Suspense fallback={<StatCardSkeleton />}>
        <GlobalStatsBarContent />
      </Suspense>
    </ErrorBoundary>
  );
}
