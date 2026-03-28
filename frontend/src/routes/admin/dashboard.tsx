import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "../../components/AdminDashboard/AdminDashboard";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});
