import { createFileRoute, useParams } from "@tanstack/react-router";
import Configure from "../components/Configure/Configure";
import { getStreamConfigSchemaFromBase64 } from "../components/Configure/util";

export const Route = createFileRoute("/$b64config/configure")({
  component: B64ConfigurePage,
});

function B64ConfigurePage() {
  const { b64config } = useParams({ from: "/$b64config/configure" });
  const initialStreamConfig = getStreamConfigSchemaFromBase64(b64config);

  return <Configure initialStreamConfig={initialStreamConfig} />;
}
