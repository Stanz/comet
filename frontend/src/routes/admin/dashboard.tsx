import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "../../components/AdminDashboard/AdminDashboard";

type AdminDashboardSearch = {
  tab?: "connections" | "metrics" | "scraper" | "logs" | "config" | "cometnet" | "system";
};

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
  validateSearch: (search: Record<string, unknown>): AdminDashboardSearch => {
    return {
      tab: (search.tab as AdminDashboardSearch["tab"]) || "connections",
    };
  },
});
