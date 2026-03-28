import { createFileRoute } from "@tanstack/react-router";
import Configure from "../components/Configure/Configure";

export const Route = createFileRoute("/configure")({
  component: Configure,
});
