import { Suspense, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  LogOut,
  Activity,
  BarChart3,
  Terminal,
  Settings,
  Shield,
  Zap,
  HardDrive,
  Users,
} from "lucide-react";
import { Button } from "@base-ui/react";

import Branding from "../Branding";
import {
  adminConfigQueryOptions,
  adminConnectionsQueryOptions,
  adminMetricsQueryOptions,
} from "./util";

import { StatCard } from "./StatCard";

import { TabButton } from "./TabButton";
import { ConnectionsView } from "./sections/ConnectionsView";
import { MetricsView } from "./sections/MetricsView";
import { ScraperView } from "./sections/ScraperView";
import { LogsView } from "./sections/LogsView";
import { ConfigView } from "./sections/ConfigView";

import * as v from "valibot";
import { apiClient } from "../../util/api";
import { DashboardSkeleton, StatBarSkeleton } from "./DashboardSkeleton";

function GlobalStatsBar() {
  const { data: connectionsData } = useSuspenseQuery(adminConnectionsQueryOptions());
  const { data: metricsData } = useSuspenseQuery(adminMetricsQueryOptions());

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "connections" | "metrics" | "scraper" | "logs" | "config"
  >("connections");

  const {
    isLoading,
    isSuccess,
    data: config,
    error: configError,
  } = useQuery(adminConfigQueryOptions());

  useEffect(() => {
    if (configError?.message === "UNAUTHORIZED") {
      router.navigate({ to: "/admin/login" });
    }
  }, [configError, router]);

  const handleLogout = async () => {
    await apiClient.post("/admin/api/logout");
    router.navigate({ to: "/admin/login" });
  };

  const triggerAction = async (endpoint: string, method: string = "POST") => {
    try {
      const data = await apiClient(`/admin/api/${endpoint}`, { method }).json();

      const schema = v.object({
        success: v.boolean(),
        error: v.optional(v.string()),
        message: v.optional(v.string()),
      });

      const validated = v.parse(schema, data);

      if (!validated.success) {
        alert(validated.error || "Action failed");
      } else {
        alert(validated.message || "Action executed successfully");
      }
    } catch (_e) {
      alert("Error triggering action");
    }
  };

  if (isLoading || !isSuccess) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-8 w-[90vw] max-w-[1200px] mb-12">
        <header className="flex justify-between items-center py-8">
          <Branding subtitle="Admin Dashboard" />

          <div className="bg-[#1a1d20]/90 p-4 rounded-lg flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">
                Session TTL
              </span>
              <span className="text-sm font-mono text-emerald-400">Active</span>
            </div>
            <Button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <Suspense fallback={<StatBarSkeleton />}>
          <GlobalStatsBar />
        </Suspense>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#1a1d20]/90 rounded-xl border border-white/5 w-fit">
          <TabButton
            active={activeTab === "connections"}
            onClick={() => setActiveTab("connections")}
            icon={<Activity className="w-4 h-4" />}
            label="Connections"
          />
          <TabButton
            active={activeTab === "metrics"}
            onClick={() => setActiveTab("metrics")}
            icon={<BarChart3 className="w-4 h-4" />}
            label="Metrics"
          />
          <TabButton
            active={activeTab === "scraper"}
            onClick={() => setActiveTab("scraper")}
            icon={<Shield className="w-4 h-4" />}
            label="Scraper"
          />
          <TabButton
            active={activeTab === "logs"}
            onClick={() => setActiveTab("logs")}
            icon={<Terminal className="w-4 h-4" />}
            label="Logs"
          />
          <TabButton
            active={activeTab === "config"}
            onClick={() => setActiveTab("config")}
            icon={<Settings className="w-4 h-4" />}
            label="Config"
          />
        </div>

        {/* Content Area */}
        <div className="bg-[#1a1d20]/90 0 rounded-2xl border border-white/5 shadow-2xl overflow-hidden min-h-[500px]">
          <Suspense fallback={<DashboardSkeleton />}>
            {activeTab === "connections" && <ConnectionsView />}
            {activeTab === "metrics" && <MetricsView />}
            {activeTab === "scraper" && <ScraperView triggerAction={triggerAction} />}
            {activeTab === "logs" && <LogsView />}
            {activeTab === "config" && <ConfigView config={config} />}
          </Suspense>
        </div>
      </div>
    </div>
  );
}
