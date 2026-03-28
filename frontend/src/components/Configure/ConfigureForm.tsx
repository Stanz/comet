import { DebridServices } from "./sections/DebridServices/DebridServices";
import { resolutions } from "./constants";
import { CometButton } from "../ui/CometButton";
import { CometAccordion } from "../ui/CometAccordion";
import { SiKodi } from "@icons-pack/react-simple-icons";
import { Download, Copy } from "lucide-react";
import {
  UiServerConfig,
  StreamConfigFormValues,
  streamConfigToFormValues,
  formValuesToStreamConfig,
  getBase64FromStreamConfigSchema,
  StreamConfig,
  resolutionKeys,
} from "./util";
import { useCometForm } from "../../hooks/useCometForm";
import { LanguageSettings } from "./sections/LanguageSettings";
import { AdvancedSettings } from "./sections/AdvancedSettings";
import { isKeyOf } from "../../util/guards";

const getManifestUrl = (
  uiConfig: UiServerConfig,
  values: StreamConfigFormValues,
  forInstall: boolean,
) => {
  const settings = formValuesToStreamConfig(values, uiConfig);
  const defaultValues = streamConfigToFormValues(uiConfig);
  const DEFAULT_SETTINGS_B64 = getBase64FromStreamConfigSchema(
    formValuesToStreamConfig(defaultValues, uiConfig),
  );
  const isDefaultConfig = getBase64FromStreamConfigSchema(settings) === DEFAULT_SETTINGS_B64;
  const host = window.location.host;
  const prefix = uiConfig.stremioApiPrefix || "";

  if (isDefaultConfig) {
    return forInstall
      ? `stremio://${host}${prefix}/manifest.json`
      : `${window.location.origin}${prefix}/manifest.json`;
  } else {
    const settingsString = getBase64FromStreamConfigSchema(settings);
    return forInstall
      ? `stremio://${host}${prefix}/${settingsString}/manifest.json`
      : `${window.location.origin}${prefix}/${settingsString}/manifest.json`;
  }
};

interface ConfigureFormProps {
  uiConfig: UiServerConfig;
  initialStreamConfig?: Partial<StreamConfig>;
}

export default function ConfigureForm({ uiConfig, initialStreamConfig }: ConfigureFormProps) {
  const defaultValues = streamConfigToFormValues(uiConfig, initialStreamConfig);
  const form = useCometForm({
    defaultValues,
  });

  const handleInstall = () => {
    window.location.href = getManifestUrl(
      uiConfig,
      form.state.values as StreamConfigFormValues,
      true,
    );
  };

  const handleCopy = () => {
    const url = getManifestUrl(uiConfig, form.state.values as StreamConfigFormValues, false);
    navigator.clipboard.writeText(url).then(() => {
      alert("URL copied to clipboard: " + url);
    });
  };

  return (
    <div className="text-white w-full space-y-4">
      <div className="grid gap-4">
        <form.AppField name="selectedResolutions">
          {(field) => (
            <field.FormMultiSelect
              label="Enabled Resolutions"
              options={resolutionKeys}
              renderValue={(val: string) => (isKeyOf(val, resolutions) ? resolutions[val] : val)}
              renderOption={(opt: string) => (isKeyOf(opt, resolutions) ? resolutions[opt] : opt)}
            />
          )}
        </form.AppField>

        <div className="columns-1 md:columns-2">
          <form.AppField name="maxResultsPerResolution">
            {(field) => (
              <field.FormNumberField
                label="Max Results Per Resolution"
                min={0}
                placeholder="Unlimited"
                renderValue={(val) => (val === 0 ? "Unlimited" : null)}
              />
            )}
          </form.AppField>

          <form.AppField name="maxSize">
            {(field) => (
              <field.FormNumberField
                label="Max Size (GB)"
                min={0}
                placeholder="Unlimited"
                renderValue={(val) => (val === 0 ? "Unlimited" : null)}
              />
            )}
          </form.AppField>
        </div>

        {uiConfig.proxyDebridStream && (
          <form.AppField name="debridStreamProxyPassword">
            {(field) => (
              <field.FormPasswordField
                label="Proxy Password"
                placeholder="Enter password"
                description="Debrid Stream Proxying allows you to use your Debrid Service from multiple IPs simultaneously."
              />
            )}
          </form.AppField>
        )}
      </div>

      <DebridServices form={form} disableTorrentStreams={uiConfig.disableTorrentStreams} />

      <CometAccordion defaultValue={[]}>
        <LanguageSettings form={form} />
        <AdvancedSettings form={form} uiConfig={uiConfig} />
      </CometAccordion>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
        <CometButton onClick={handleInstall} className="flex-1 max-w-[200px]">
          <Download className="w-5 h-5" />
          Install
        </CometButton>
        <CometButton onClick={handleCopy} variant="secondary" className="flex-1 max-w-[200px]">
          <Copy className="w-5 h-5" />
          Copy Manifest
        </CometButton>
        <CometButton variant="secondary" className="flex-1 max-w-[200px]">
          <SiKodi className="w-5 h-5" />
          Setup Kodi
        </CometButton>
      </div>
    </div>
  );
}
