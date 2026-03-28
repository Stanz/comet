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

export const AdminConfigSchema = v.object({
  success: v.boolean(),
  background_scraper_interval: v.number(),
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
  name: v.string(),
  levelname: v.string(),
  message: v.string(),
  filename: v.string(),
  lineno: v.number(),
  funcName: v.string(),
});

export type LogEntry = v.InferOutput<typeof LogEntrySchema>;

export const AdminLogsDataSchema = v.object({
  logs: v.array(LogEntrySchema),
  total_logs: v.number(),
  new_logs: v.number(),
});

export type AdminLogsData = v.InferOutput<typeof AdminLogsDataSchema>;

export const ScraperStatusSchema = v.object({
  is_running: v.boolean(),
  is_paused: v.boolean(),
  last_run_at: v.number(),
  last_run_duration: v.number(),
  next_run_at: v.number(),
  queue_size: v.number(),
  active_scrapers: v.number(),
  last_error: v.nullable(v.string()),
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
  });

export const adminMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ["admin", "metrics"],
    queryFn: () => validatedGet("/admin/api/metrics", AdminMetricsSchema),
    staleTime: 30000,
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

export const adminScraperRunsQueryOptions = (limit: number = 20) =>
  queryOptions({
    queryKey: ["admin", "scraper", "runs", limit],
    queryFn: () => validatedGet(`/admin/api/background-scraper/runs?limit=${limit}`, v.any()),
    staleTime: 30000,
  });
