import { Suspense, useEffect } from "react";
import { Route } from "../../routes/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  BarChart3,
  Terminal,
  Settings,
  Shield,
  Share2,
  Info,
  WifiOff,
} from "lucide-react";
import { adminConfigQueryOptions } from "./util";
import { GlobalStatsBar } from "./GlobalStatsBar";
import { SettingsControls } from "./SettingsControls";
import { SessionStatus } from "./SessionStatus";
import Branding from "../Branding";

import { TabButton } from "./TabButton";
import { ConnectionsView } from "./sections/ConnectionsView";
import { MetricsView } from "./sections/MetricsView";
import { ScraperView } from "./sections/ScraperView";
import { LogsView } from "./sections/LogsView";
import { ConfigView } from "./sections/ConfigView";
import { CometNetView } from "./sections/CometNetView";
import { SystemView } from "./sections/SystemView";

import * as v from "valibot";
import { apiClient } from "../../util/api";
import { StatCardSkeleton } from "./StatCardSkeleton";
import { ConnectionsSkeleton } from "./sections/ConnectionsSkeleton";
import { MetricsSkeleton } from "./sections/MetricsSkeleton";
import { ScraperSkeleton } from "./sections/ScraperSkeleton";
import { LogsSkeleton } from "./sections/LogsSkeleton";
import { ConfigSkeleton } from "./sections/ConfigSkeleton";
import { CometNetSkeleton } from "./sections/CometNetSkeleton";
import { SystemSkeleton } from "./sections/SystemSkeleton";
import { ErrorBoundary } from "../ui/ErrorBoundary";

export function AdminDashboard() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const activeTab = search.tab || "connections";

  const setActiveTab = (
    tab: "connections" | "metrics" | "scraper" | "logs" | "config" | "cometnet" | "system",
  ) => {
    navigate({ search: { tab }, replace: true });
  };

  const {
    isLoading,
    isSuccess,
    data: config,
    error: configError,
  } = useQuery(adminConfigQueryOptions());

  useEffect(() => {
    if (configError?.message === "UNAUTHORIZED") {
      navigate({ to: "/admin/login" });
    }
  }, [configError, navigate]);

  const handleLogout = async () => {
    await apiClient.post("/admin/api/logout");
    navigate({ to: "/admin/login" });
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
    return (
      <div className="flex flex-col items-center justify-center w-full px-4">
        <div className="px-4 py-6 md:p-8 w-full max-w-[1200px] mb-12 animate-pulse">
          <div className="h-10 w-64 bg-white/5 rounded-xl mb-8" />
          <StatCardSkeleton />
          <div className="h-12 w-[480px] bg-white/5 rounded-xl mb-6" />
          <div className="bg-[#1a1d20]/90 rounded-2xl border border-white/5 min-h-[500px] p-6">
            <div className="h-6 w-48 bg-white/10 rounded mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-52 bg-white/5 rounded-xl" />
              <div className="h-52 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-8">
      <div className="py-6 md:py-8 w-full max-w-[1200px] mb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-8 gap-4 md:gap-0">
          <Branding subtitle="Admin Dashboard" />

          <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto ml-auto">
            <SettingsControls />
            <SessionStatus onLogout={handleLogout} />
          </div>
        </header>

        <GlobalStatsBar />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/80 dark:bg-[#1a1d20]/90 rounded-xl border border-gray-200 dark:border-white/5 w-full md:w-fit max-w-full">
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
          <TabButton
            active={activeTab === "cometnet"}
            onClick={() => setActiveTab("cometnet")}
            icon={<Share2 className="w-4 h-4" />}
            label="CometNet"
          />
          <TabButton
            active={activeTab === "system"}
            onClick={() => setActiveTab("system")}
            icon={<Info className="w-4 h-4" />}
            label="System"
          />
        </div>

        {/* Content Area */}
        <div className="bg-white/80 dark:bg-[#1a1d20]/90 0 rounded-2xl border border-gray-200 dark:border-white/5 shadow-2xl overflow-hidden min-h-[500px]">
          {activeTab === "connections" && (
            <Suspense fallback={<ConnectionsSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading connections. Please try again later.">
                <ConnectionsView />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "metrics" && (
            <Suspense fallback={<MetricsSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading metrics. Please try again later.">
                <MetricsView />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "scraper" && (
            <Suspense fallback={<ScraperSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading scraper. Please try again later.">
                <ScraperView triggerAction={triggerAction} />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "logs" && (
            <Suspense fallback={<LogsSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading logs. Please try again later.">
                <LogsView />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "config" && (
            <Suspense fallback={<ConfigSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading configuration. Please try again later.">
                <ConfigView config={config} />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "cometnet" && (
            <Suspense fallback={<CometNetSkeleton />}>
              {config.cometnet_enabled ? (
                <ErrorBoundary fallbackMessage="There was an error loading CometNet configuration. Please try again later.">
                  <CometNetView />
                </ErrorBoundary>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <WifiOff className="w-12 h-12 text-gray-500 mb-4" />
                  <h2 className="text-xl font-bold text-gray-200 mb-2">CometNet Not Available</h2>
                  <p className="text-gray-400 max-w-md">
                    CometNet is not enabled on this node. Enable it via the{" "}
                    <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">
                      COMETNET_ENABLED
                    </code>{" "}
                    environment variable.
                  </p>
                </div>
              )}
            </Suspense>
          )}
          {activeTab === "system" && (
            <Suspense fallback={<SystemSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading system information. Please try again later.">
                <SystemView />
              </ErrorBoundary>
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
