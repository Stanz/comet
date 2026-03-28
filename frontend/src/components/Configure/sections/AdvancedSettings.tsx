import { Settings2 } from "lucide-react";
import { CometAccordion } from "../../ui/CometAccordion";
import { configureFormOptions, UiServerConfig } from "../util";
import { withCometForm } from "../../../hooks/useCometForm";

export const AdvancedSettings = withCometForm({
  ...configureFormOptions,
  props: {
    uiConfig: {} as UiServerConfig,
  },
  render: function Render({ form, uiConfig }) {
    return (
      <CometAccordion.Item value="advanced" title="Advanced Settings" icon={Settings2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="space-y-4 pt-1">
            <form.AppField name="rankThreshold">
              {(field) => (
                <field.FormNumberField
                  label="Minimum Rank Threshold"
                  description="Only show torrents with a rank score higher than this value."
                />
              )}
            </form.AppField>
            <form.AppField name="resultFormat">
              {(field) => (
                <field.FormMultiSelect
                  label="Result Format"
                  options={uiConfig.webConfig.resultFormat || []}
                />
              )}
            </form.AppField>
          </div>

          <div className="space-y-4 pt-1">
            <form.AppField name="cachedOnly">
              {(field) => (
                <field.FormCheckbox
                  label="Show Cached Only"
                  description="Only show results that are immediately available on debrid."
                />
              )}
            </form.AppField>
            <form.AppField name="sortCachedTogether">
              {(field) => (
                <field.FormCheckbox
                  label="Unified Sort"
                  description="Sort cached and uncached results together by rank."
                />
              )}
            </form.AppField>
            <form.AppField name="removeTrash">
              {(field) => (
                <field.FormCheckbox
                  label="Remove Trash"
                  description="Automatically hide poor quality clinical results and duplicates."
                />
              )}
            </form.AppField>
          </div>
        </div>
      </CometAccordion.Item>
    );
  },
});
