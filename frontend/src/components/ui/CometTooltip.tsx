import { Tooltip } from "@base-ui/react/tooltip";
import * as React from "react";

export const CometTooltip = ({
  children,
  content,
}: {
  children: React.ReactElement;
  content: React.ReactNode;
}) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger render={children} />
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6}>
            <Tooltip.Popup className="z-[100] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white bg-gray-900 rounded border border-white/10 shadow-xl select-none outline-none">
              <Tooltip.Arrow className="fill-gray-900" />
              {content}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
