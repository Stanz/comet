import { queryOptions } from "@tanstack/react-query";

import * as v from "valibot";
import { validatedGet } from "../../util/api";

export const AdminConnectionSchema = v.object({
  id: v.string(),
  ip: v.string(),
  content: v.string(),
  timestamp: v.number(),
  duration: v.number(),
  formatted_time: v.string(),
  bytes_transferred: v.number(),
  bytes_transferred_formatted: v.string(),
  current_speed: v.number(),
  current_speed_formatted: v.string(),
  peak_speed: v.number(),
  peak_speed_formatted: v.string(),
  avg_speed_formatted: v.string(),
});

export type AdminConnection = v.InferOutput<typeof AdminConnectionSchema>;

export const GlobalStatsSchema = v.object({
  total_bytes_alltime: v.number(),
  total_bytes_alltime_formatted: v.string(),
  total_bytes_session: v.number(),
  total_bytes_session_formatted: v.string(),
  total_current_speed: v.number(),
  total_current_speed_formatted: v.string(),
  active_connections: v.number(),
  peak_concurrent: v.number(),
});

export type GlobalStats = v.InferOutput<typeof GlobalStatsSchema>;

export const AdminConnectionsDataSchema = v.object({
  connections: v.array(AdminConnectionSchema),
  global_stats: GlobalStatsSchema,
});

export type AdminConnectionsData = v.InferOutput<typeof AdminConnectionsDataSchema>;

export const VersionInfoSchema = v.object({
  branch: v.string(),
  commit_hash: v.string(),
  build_date: v.string(),
});
export type VersionInfo = v.InferOutput<typeof VersionInfoSchema>;

export const UpdateStatusSchema = v.object({
  has_update: v.boolean(),
  latest_commit_hash: v.nullable(v.string()),
  latest_url: v.nullable(v.string()),
  error: v.nullable(v.string()),
});
export type UpdateStatus = v.InferOutput<typeof UpdateStatusSchema>;

export const AdminConfigSchema = v.object({
  success: v.boolean(),
  background_scraper_interval: v.number(),
  version_info: v.optional(VersionInfoSchema),
  cometnet_enabled: v.boolean(),
});

export type AdminConfig = v.InferOutput<typeof AdminConfigSchema>;

export const AdminMetricsSchema = v.object({
  torrents: v.object({
    total: v.number(),
    by_tracker: v.array(
      v.object({
        tracker: v.string(),
        count: v.number(),
        avg_seeders: v.number(),
        avg_size_formatted: v.string(),
      }),
    ),
    size_distribution: v.array(v.object({ range: v.string(), count: v.number() })),
    quality: v.object({
      avg_seeders: v.number(),
      max_seeders: v.number(),
      min_seeders: v.number(),
      avg_size_formatted: v.string(),
      max_size_formatted: v.string(),
    }),
    media_distribution: v.array(v.object({ type: v.string(), count: v.number() })),
  }),
  searches: v.object({
    total_unique: v.number(),
    last_24h: v.number(),
    last_7d: v.number(),
    last_30d: v.number(),
  }),
  scrapers: v.object({
    active_locks: v.number(),
  }),
  debrid_cache: v.object({
    total: v.number(),
    by_service: v.array(
      v.object({
        service: v.string(),
        count: v.number(),
        avg_size_formatted: v.string(),
        total_size_formatted: v.string(),
      }),
    ),
  }),
});

export type AdminMetrics = v.InferOutput<typeof AdminMetricsSchema>;

export const LogEntrySchema = v.object({
  created: v.number(),
  timestamp: v.string(),
  level: v.string(),
  icon: v.string(),
  color: v.string(),
  module: v.string(),
  function: v.string(),
  message: v.string(),
});

export type LogEntry = v.InferOutput<typeof LogEntrySchema>;

export const AdminLogsDataSchema = v.object({
  logs: v.array(LogEntrySchema),
  total_logs: v.number(),
  new_logs: v.number(),
});

export type AdminLogsData = v.InferOutput<typeof AdminLogsDataSchema>;

export const AdminScraperRunSchema = v.object({
  run_id: v.string(),
  started_at: v.number(),
  finished_at: v.nullable(v.number()),
  status: v.string(),
  processed: v.number(),
  success: v.number(),
  failed: v.number(),
  torrents_found: v.number(),
  duration_ms: v.nullable(v.number()),
  worker_count: v.number(),
  last_error: v.nullable(v.string()),
});
export type AdminScraperRun = v.InferOutput<typeof AdminScraperRunSchema>;

export const AdministrativeScraperQueueSchema = v.object({
  movies: v.number(),
  series: v.number(),
  episodes: v.number(),
  oldest_age_s: v.number(),
});

export const ScraperStatusSchema = v.object({
  running: v.boolean(),
  paused: v.boolean(),
  current_run_id: v.nullable(v.string()),
  last_error: v.nullable(v.string()),
  stats: v.object({
    run_id: v.string(),
    processed: v.number(),
    success: v.number(),
    failed: v.number(),
    torrents_found: v.number(),
    discovered_items: v.number(),
    errors: v.number(),
    duration_s: v.number(),
  }),
  queue: AdministrativeScraperQueueSchema,
  health: v.object({
    status: v.string(),
    reasons: v.array(v.string()),
  }),
  latest_run: v.nullable(AdminScraperRunSchema),
});

export type ScraperStatus = v.InferOutput<typeof ScraperStatusSchema>;

export const adminConfigQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "config"],
    queryFn: () => validatedGet("/admin/api/config", AdminConfigSchema),
    staleTime: 60000,
    retry: 0,
  });

export const adminConnectionsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "connections"],
    queryFn: () => validatedGet("/admin/api/connections", AdminConnectionsDataSchema),
    refetchInterval: 5000,
    staleTime: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min((attemptIndex + 1) * 5000, 30000),
  });

export const adminMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "metrics"],
    queryFn: () => validatedGet("/admin/api/metrics", AdminMetricsSchema),
    staleTime: 30000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min((attemptIndex + 1) * 5000, 30000),
  });

export const adminLogsQueryOptions = (since: number = 0) =>
  queryOptions({
    queryKey: ["admin", "logs", since],
    queryFn: () => validatedGet(`/admin/api/logs?since=${since}`, AdminLogsDataSchema),
    refetchInterval: 10000,
  });

export const adminScraperStatusQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "scraper", "status"],
    queryFn: () => validatedGet("/admin/api/background-scraper/status", ScraperStatusSchema),
    refetchInterval: 5000,
  });

export const AdminScraperRunsResponseSchema = v.object({
  runs: v.array(AdminScraperRunSchema),
});

export const adminScraperRunsQueryOptions = (limit: number = 20) =>
  queryOptions({
    queryKey: ["admin", "scraper", "runs", limit],
    queryFn: () =>
      validatedGet(
        `/admin/api/background-scraper/runs?limit=${limit}`,
        AdminScraperRunsResponseSchema,
      ),
    staleTime: 30000,
  });

export const adminUpdateCheckQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "update-check"],
    queryFn: () => validatedGet("/admin/api/update-check", UpdateStatusSchema),
    staleTime: 60 * 60 * 1000,
  });

export const CometNetSecurityAlertSchema = v.object({
  level: v.string(),
  type: v.string(),
  message: v.string(),
});

export const CometNetStatsSchema = v.object({
  enabled: v.boolean(),
  node_id: v.nullable(v.string()),
  public_key: v.nullable(v.string()),
  uptime_seconds: v.number(),
  connection_stats: v.record(v.string(), v.unknown()),
  discovery_stats: v.record(v.string(), v.unknown()),
  gossip_stats: v.record(v.string(), v.unknown()),
  reputation_summary: v.record(v.string(), v.unknown()),
  keystore_stats: v.record(v.string(), v.unknown()),
  security_alerts: v.array(CometNetSecurityAlertSchema),
  contribution_mode: v.string(),
  pool_stats: v.record(v.string(), v.unknown()),
  private_network: v.boolean(),
  network_id: v.nullable(v.string()),
});
export type CometNetStats = v.InferOutput<typeof CometNetStatsSchema>;

export const CometNetPeerSchema = v.object({
  node_id: v.string(),
  address: v.nullable(v.string()),
  connected_at: v.number(),
  last_activity: v.number(),
  is_outbound: v.boolean(),
  latency_ms: v.number(),
  alias: v.nullable(v.string()),
  torrents_received: v.optional(v.number()),
  invalid_contributions: v.optional(v.number()),
  reputation: v.optional(v.number()),
  trust_level: v.optional(v.string()),
});
export type CometNetPeer = v.InferOutput<typeof CometNetPeerSchema>;

export const CometNetPeersResponseSchema = v.object({
  peers: v.array(CometNetPeerSchema),
  count: v.number(),
});
export type CometNetPeersResponse = v.InferOutput<typeof CometNetPeersResponseSchema>;

export const CometNetPoolMemberSchema = v.object({
  public_key: v.string(),
  node_id: v.string(),
  role: v.string(),
  added_at: v.number(),
  added_by: v.string(),
  contribution_count: v.number(),
  last_seen: v.number(),
});

export const CometNetPoolManifestSchema = v.object({
  pool_id: v.string(),
  display_name: v.string(),
  description: v.string(),
  creator_key: v.string(),
  join_mode: v.string(),
  version: v.number(),
  created_at: v.number(),
  updated_at: v.number(),
  members: v.array(CometNetPoolMemberSchema),
});

export const CometNetPoolsResponseSchema = v.object({
  pools: v.record(v.string(), CometNetPoolManifestSchema),
  memberships: v.array(v.string()),
  subscriptions: v.array(v.string()),
});
export type CometNetPoolsResponse = v.InferOutput<typeof CometNetPoolsResponseSchema>;

export const adminCometNetStatsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "cometnet", "stats"],
    queryFn: () => validatedGet("/admin/api/cometnet/stats", CometNetStatsSchema),
    refetchInterval: 10000,
  });

export const adminCometNetPeersQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "cometnet", "peers"],
    queryFn: () => validatedGet("/admin/api/cometnet/peers", CometNetPeersResponseSchema),
    refetchInterval: 10000,
  });

export const adminCometNetPoolsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "cometnet", "pools"],
    queryFn: () => validatedGet("/admin/api/cometnet/pools", CometNetPoolsResponseSchema),
    refetchInterval: 10000,
  });
