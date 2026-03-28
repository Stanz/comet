import { Combobox } from "@base-ui/react/combobox";
import { Check, ChevronDown, X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { FieldWrapper, type BaseFieldProps } from "./FieldWrapper";

export const CometMultiSelect = ({
  id: providedId,
  label,
  description,
  error,
  value,
  onValueChange,
  options,
  placeholder = "Select options...",
  renderOption,
  renderValue,
  className,
}: BaseFieldProps & {
  value: string[];
  onValueChange: (val: string[]) => void;
  options: string[];
  placeholder?: string;
  renderOption?: (val: string) => ReactNode;
  renderValue?: (val: string) => ReactNode;
}) => {
  const id = providedId ?? useId();

  return (
    <FieldWrapper
      id={id}
      label={label}
      description={description}
      error={error}
      className={className}
    >
      <Combobox.Root multiple value={value} onValueChange={onValueChange} items={options}>
        <Combobox.InputGroup className="relative flex flex-wrap gap-1.5 p-1.5 min-h-[46px] bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 group">
          <div className="flex flex-wrap gap-1.5 items-center">
            {value.length > 0 && value.length === options.length ? (
              <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-indigo-500/30">
                All {value.length} Selected
              </span>
            ) : (
              <>
                {value.slice(0, 3).map((val) => (
                  <span
                    key={val}
                    className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap border border-indigo-500/30 flex items-center gap-1.5 animate-in fade-in zoom-in-95"
                  >
                    {renderValue ? renderValue(val) : val}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onValueChange(value.filter((v) => v !== val));
                      }}
                      className="hover:text-white transition-all rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </span>
                ))}
                {value.length > 3 && (
                  <span className="text-xs text-white/40 font-medium px-1 pointer-events-none select-none">
                    +{value.length - 3} more
                  </span>
                )}
              </>
            )}
          </div>

          <Combobox.Input
            id={id}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[60px] bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20 px-2 py-1"
          />

          <div className="flex items-center gap-1 ml-auto shrink-0 pr-1">
            <Combobox.Clear
              className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-40 hover:opacity-100 data-[hidden]:hidden"
              aria-label="Clear all"
            >
              <X className="w-4 h-4" />
            </Combobox.Clear>
            <Combobox.Trigger
              className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-40 hover:opacity-100 group"
              aria-label="Open options"
            >
              <ChevronDown className="w-4 h-4 group-data-[open]:rotate-180 transition-transform" />
            </Combobox.Trigger>
          </div>
        </Combobox.InputGroup>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={8} className="z-50">
            <Combobox.Popup className="bg-[#1e2227] border border-white/10 rounded-xl shadow-2xl w-[var(--anchor-width)] min-w-fit max-h-[300px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 outline-none">
              <Combobox.List className="overflow-auto scrollbar-thin scrollbar-thumb-white/10 p-1">
                {options.map((item) => (
                  <Combobox.Item
                    key={item}
                    value={item}
                    className="group flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-white/5 cursor-pointer outline-none data-[selected]:text-indigo-400 data-[selected]:bg-indigo-500/10 data-[highlighted]:bg-white/5 transition-colors"
                  >
                    <div className="flex-1 overflow-hidden truncate">
                      {renderOption ? renderOption(item) : item}
                    </div>
                    <Combobox.ItemIndicator className="text-indigo-400">
                      <Check className="w-4 h-4" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
              </Combobox.List>
              <Combobox.Empty className="text-center text-xs text-white/40">
                No matches found
              </Combobox.Empty>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </FieldWrapper>
  );
};
