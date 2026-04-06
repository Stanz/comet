import { Suspense, useEffect } from "react";
import { Route } from "../../routes/admin/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, Terminal, Settings, Shield, Share2, Info } from "lucide-react";
import { adminConfigQueryOptions } from "./util";
import { GlobalStatsBar } from "./GlobalStatsBar";
import { SettingsControls } from "./SettingsControls";
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
import { ConnectionsSkeleton } from "./sections/ConnectionsSkeleton";
import { MetricsSkeleton } from "./sections/MetricsSkeleton";
import { ScraperSkeleton } from "./sections/ScraperSkeleton";
import { LogsSkeleton } from "./sections/LogsSkeleton";
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

  const { error: configError } = useQuery(adminConfigQueryOptions());

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

  return (
    <div className="flex flex-col items-center w-full px-4 sm:px-8">
      <div className="py-6 md:py-8 w-full max-w-[1200px] mb-12 flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 md:py-8 gap-4 md:gap-0 w-full">
          <Branding subtitle="Admin Dashboard" className="m-0 text-left w-auto" />

          <div className="flex flex-row gap-2 p-1.5">
            <SettingsControls onLogout={handleLogout} />
          </div>
        </header>

        <GlobalStatsBar />

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/80 dark:bg-[#1a1d20]/90 rounded-xl border border-gray-200 dark:border-white/5 w-full md:w-fit md:mx-auto max-w-full">
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
        <div className="bg-white/80 dark:bg-[#1a1d20]/90 rounded-2xl border border-gray-200 dark:border-white/5 shadow-2xl overflow-hidden min-h-[500px] w-full">
          {activeTab === "connections" && (
            <ErrorBoundary fallbackMessage="There was an error loading connections. Please try again later.">
              <Suspense fallback={<ConnectionsSkeleton />}>
                <ConnectionsView />
              </Suspense>
            </ErrorBoundary>
          )}
          {activeTab === "metrics" && (
            <ErrorBoundary fallbackMessage="There was an error loading metrics. Please try again later.">
              <Suspense fallback={<MetricsSkeleton />}>
                <MetricsView />
              </Suspense>
            </ErrorBoundary>
          )}
          {activeTab === "scraper" && (
            <ErrorBoundary fallbackMessage="There was an error loading scraper. Please try again later.">
              <Suspense fallback={<ScraperSkeleton />}>
                <ScraperView triggerAction={triggerAction} />
              </Suspense>
            </ErrorBoundary>
          )}
          {activeTab === "logs" && (
            <ErrorBoundary fallbackMessage="There was an error loading logs. Please try again later.">
              <Suspense fallback={<LogsSkeleton />}>
                <LogsView />
              </Suspense>
            </ErrorBoundary>
          )}
          {activeTab === "config" && (
            <ErrorBoundary fallbackMessage="There was an error loading configuration. Please try again later.">
              <ConfigView />
            </ErrorBoundary>
          )}
          {activeTab === "cometnet" && (
            <Suspense fallback={<CometNetSkeleton />}>
              <ErrorBoundary fallbackMessage="There was an error loading CometNet configuration. Please try again later.">
                <CometNetView />
              </ErrorBoundary>
            </Suspense>
          )}
          {activeTab === "system" && (
            <ErrorBoundary fallbackMessage="There was an error loading system information. Please try again later.">
              <Suspense fallback={<SystemSkeleton />}>
                <SystemView />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}
