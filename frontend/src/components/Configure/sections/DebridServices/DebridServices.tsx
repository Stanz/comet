import { CometButton } from "../../../ui/CometButton";
import { CometAccordion } from "../../../ui/CometAccordion";
import { Network, PlusCircle } from "lucide-react";

import { DebridServiceEntrySchema, configureFormOptions } from "../../util";
import { DebridServicesList } from "./DebridServicesList";
import * as v from "valibot";

import { withCometForm } from "../../../../hooks/useCometForm";

export const DebridServices = withCometForm({
  ...configureFormOptions,
  props: {
    disableTorrentStreams: false as boolean,
  },
  render: function Render({ form, disableTorrentStreams }) {
    return (
      <CometAccordion defaultValue={["debrid"]}>
        <CometAccordion.Item value="debrid" title="Debrid Services" icon={Network}>
          <DebridServicesList form={form} />

          <form.Subscribe
            selector={(state) => [state.values.enableTorrent, state.values.debridServices] as const}
          >
            {([enableTorrent, services]) => (
              <CometButton
                onClick={() => {
                  const isFirst = services.length === 0;
                  if (isFirst && enableTorrent) {
                    form.setFieldValue("enableTorrent", false);
                  }
                  form.pushFieldValue("debridServices", v.getDefaults(DebridServiceEntrySchema));
                }}
                variant="secondary"
                className="w-full border-dashed"
              >
                <PlusCircle className="w-5 h-5" />
                Add Debrid Service
              </CometButton>
            )}
          </form.Subscribe>

          <div className="h-px bg-white/5 my-8" />

          <div className="space-y-4 px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {!disableTorrentStreams && (
              <form.AppField name="enableTorrent">
                {(field) => (
                  <field.FormCheckbox
                    label="Enable Torrent Mode"
                    description="Enable direct torrent/magnet links alongside debrid services."
                  />
                )}
              </form.AppField>
            )}

            <form.AppField name="deduplicateStreams">
              {(field) => (
                <field.FormCheckbox
                  label="Deduplicate Streams"
                  description="Show only one result per torrent (from the first service that has it cached)."
                />
              )}
            </form.AppField>

            <form.AppField name="scrapeAccount">
              {(field) => (
                <field.FormCheckbox
                  label="Scrape Account"
                  description="Include torrents already in your debrid account library."
                />
              )}
            </form.AppField>
          </div>
        </CometAccordion.Item>
      </CometAccordion>
    );
  },
});
