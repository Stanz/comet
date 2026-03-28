import { useRef, useEffect, useState, ReactNode } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
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
  },
  render: function Render({ form, index, entry, onRemove, onMove, info }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const dragHandleRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isOver, setIsOver] = useState(false);

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
          getData: () => ({ index, id: entry.id }),
          onDragEnter: () => setIsOver(true),
          onDragLeave: () => setIsOver(false),
          onDrop: ({ source }) => {
            setIsOver(false);
            const sourceData = source.data as { index: number; id: string };
            if (sourceData.id === entry.id) return;
            onMove(sourceData.index, index);
          },
        }),
      );
    }, [index, entry.id, onMove]);

    return (
      <div
        ref={rootRef}
        className={`relative flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all ${
          isDragging
            ? "opacity-30 bg-white/5 shadow-2xl scale-[1.02] z-50 border-indigo-500/50"
            : ""
        } ${isOver ? "border-indigo-500 bg-indigo-500/5 shadow-inner" : ""}`}
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
      </div>
    );
  },
});
