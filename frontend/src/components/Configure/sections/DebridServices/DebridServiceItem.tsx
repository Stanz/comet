import { useRef, useEffect, useState, ReactNode, Fragment } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { CometButton } from "../../../ui/CometButton";
import { configureFormOptions, DebridServiceEntry } from "../../util";
import { withCometForm } from "../../../../hooks/useCometForm";
import { DEBRID_SERVICES } from "../../constants";

export const DebridServiceItem = withCometForm({
  ...configureFormOptions,
  props: {
    index: 0 as number,
    entry: {} as DebridServiceEntry,
    onRemove: (() => {}) as (index: number) => void,
    onMove: (() => {}) as (from: number, to: number) => void,
    info: undefined as ReactNode,
    totalItems: 0 as number,
  },
  render: function Render({ form, index, entry, onRemove, onMove, info, totalItems }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [closestEdge, setClosestEdge] = useState<Edge | null>(null);

    useEffect(() => {
      const el = rootRef.current;
      const dragHandle = dragHandleRef.current;
      if (!el || !dragHandle) return;

      return combine(
        draggable({
          element: el,
          dragHandle: dragHandle,
          getInitialData: () => ({ index, id: entry.id }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        }),
        dropTargetForElements({
          element: el,
          getData: ({ input }) =>
            attachClosestEdge(
              { index, id: entry.id },
              { element: el, input, allowedEdges: ["top", "bottom"] },
            ),
          onDragEnter: ({ source, self }) => {
            if ((source.data as { id?: string }).id === entry.id) return;
            const sourceIndex = (source.data as { index?: number }).index;
            const edge = extractClosestEdge(self.data);
            if (
              typeof sourceIndex === "number" &&
              ((index === sourceIndex - 1 && edge === "bottom") ||
                (index === sourceIndex + 1 && edge === "top"))
            ) {
              setClosestEdge(null);
              return;
            }
            setClosestEdge(edge);
          },
          onDrag: ({ source, self }) => {
            if ((source.data as { id?: string }).id === entry.id) return;
            const sourceIndex = (source.data as { index?: number }).index;
            const edge = extractClosestEdge(self.data);
            if (
              typeof sourceIndex === "number" &&
              ((index === sourceIndex - 1 && edge === "bottom") ||
                (index === sourceIndex + 1 && edge === "top"))
            ) {
              setClosestEdge(null);
              return;
            }
            setClosestEdge(edge);
          },
          onDragLeave: () => setClosestEdge(null),
          onDrop: ({ source, self }) => {
            setClosestEdge(null);
            const sourceData = source.data as { index: number; id: string };
            if (sourceData.id === entry.id) return;
            const edge = extractClosestEdge(self.data);
            // Resolve edge to final destination index
            let to = index;
            if (edge === "bottom" && sourceData.index < index) {
              // dragging downward, drop below this item — index stays
              to = index;
            } else if (edge === "top" && sourceData.index > index) {
              // dragging upward, drop above this item
              to = index;
            } else if (edge === "bottom") {
              to = index;
            } else {
              to = index - 1 < 0 ? 0 : index - 1;
            }
            // Clamp
            to = Math.max(0, Math.min(to, totalItems - 1));
            onMove(sourceData.index, to);
          },
        }),
      );
    }, [index, entry.id, onMove, totalItems]);

    return (
      <Fragment>
        <div
          ref={rootRef}
          className={`relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl transition-all hover:border-white/20 ${
            isDragging ? "opacity-40" : ""
          }`}
        >
          <div
            ref={dragHandleRef}
            className="p-1 cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 transition-colors shrink-0"
          >
            <GripVertical className="w-5 h-5" />
          </div>

          <div className="flex-1 flex flex-col gap-4 items-stretch md:flex-row">
            <form.AppField name={`debridServices[${index}].service`}>
              {(f) => (
                <f.FormSelect
                  placeholder="Select service"
                  options={Object.entries(DEBRID_SERVICES).map(([key, svc]) => ({
                    label: svc.name,
                    value: key,
                  }))}
                />
              )}
            </form.AppField>

            <div className="flex-1">
              <form.AppField name={`debridServices[${index}].apiKey`}>
                {(f) => <f.FormPasswordField placeholder="Enter API key" />}
              </form.AppField>

              {info && <div className="flex flex-wrap gap-x-3 gap-y-1 ml-1">{info}</div>}
            </div>

            <CometButton variant="danger" onClick={() => onRemove(index)} className="h-10">
              <Trash2 className="w-5 h-5" />
            </CometButton>
          </div>

          {closestEdge && <DropIndicator edge={closestEdge} gap="12px" />}
        </div>
      </Fragment>
    );
  },
});
