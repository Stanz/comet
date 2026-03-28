import { useSuspenseQuery } from "@tanstack/react-query";
import Branding from "../Branding";
import ConfigureForm from "./ConfigureForm";
import ConfigureLogin from "./ConfigureLogin";
import { configQueryOptions, StreamConfig } from "./util";

export default function Configure({
  initialStreamConfig,
}: {
  initialStreamConfig?: Partial<StreamConfig>;
}) {
  const { data: uiConfig } = useSuspenseQuery(configQueryOptions());

  if (uiConfig.passwordEnabled) {
    return <ConfigureLogin />;
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Branding customHtml={uiConfig.CUSTOM_HEADER_HTML} />
      <div className="bg-[#1a1d20]/90 p-8 rounded-lg shadow-2xl w-[90vw] max-w-[950px] mb-12">
        <ConfigureForm uiConfig={uiConfig} initialStreamConfig={initialStreamConfig} />
      </div>
    </div>
  );
}
