import { useEffect } from "react";
import { DEBRID_SERVICES } from "../../constants";
import { configureFormOptions } from "../../util";
import { withCometForm } from "../../../../hooks/useCometForm";
import { isKeyOf } from "../../../../util/guards";
import { DebridServiceItem } from "./DebridServiceItem";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

export const DebridServicesList = withCometForm({
  ...configureFormOptions,
  render: function Render({ form }) {
    useEffect(() => {
      return monitorForElements({
        onDrop({ location, source }) {
          const target = location.current.dropTargets[0];
          if (!target) return;

          const sourceData = source.data as { index?: number; id?: string };
          const targetData = target.data as { index?: number; id?: string };
          if (typeof sourceData.index !== "number" || typeof targetData.index !== "number") return;
          if (sourceData.id === targetData.id) return;

          const closestEdgeOfTarget = extractClosestEdge(targetData);
          const finishIndex = getReorderDestinationIndex({
            startIndex: sourceData.index,
            closestEdgeOfTarget,
            indexOfTarget: targetData.index,
            axis: "vertical",
          });

          if (finishIndex === sourceData.index) return;

          form.getFieldValue("debridServices"); // read to ensure subscribed
          // Use the API directly on the underlying array field
          const current = (form as unknown as { getFieldValue: (n: string) => unknown }).getFieldValue("debridServices");
          if (!Array.isArray(current)) return;

          // We trigger reorder via the form's field API
          // moveValue is only accessible inside Field render, so we dispatch via form.setFieldValue
          const next = [...current];
          const [removed] = next.splice(sourceData.index, 1);
          next.splice(finishIndex, 0, removed);
          form.setFieldValue("debridServices", next);
        },
      });
    }, [form]);

    return (
      <div className="space-y-3 mb-6">
        <form.Field name="debridServices" mode="array">
          {(field) =>
            field.state.value.map((s, i: number) => (
              <form.Subscribe key={s.id} selector={(state) => state.values.debridServices[i]}>
                {(item) => {
                  if (!item) return null;

                  const info = isKeyOf(item.service, DEBRID_SERVICES)
                    ? DEBRID_SERVICES[item.service]
                    : undefined;

                  const infoJsx = (
                    <>
                      {info?.referralUrl && (
                        <a
                          href={info.referralUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] text-indigo-400/80 hover:text-indigo-300 hover:underline transition-colors"
                        >
                          Sign up
                        </a>
                      )}
                      {info?.apiKeyUrl && (
                        <a
                          href={info.apiKeyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] text-indigo-400/80 hover:text-indigo-300 hover:underline transition-colors"
                        >
                          Get API key
                        </a>
                      )}
                      {info?.helpText && (
                        <span className="text-[0.7rem] text-gray-500 italic ml-auto">
                          {info.helpText}
                        </span>
                      )}
                    </>
                  );

                  return (
                    <DebridServiceItem
                      index={i}
                      entry={item}
                      form={form}
                      onRemove={(idx: number) => field.removeValue(idx)}
                      onMove={() => {
                        /* handled by monitorForElements */
                      }}
                      totalItems={field.state.value.length}
                      info={infoJsx}
                    />
                  );
                }}
              </form.Subscribe>
            ))
          }
        </form.Field>
      </div>
    );
  },
});
