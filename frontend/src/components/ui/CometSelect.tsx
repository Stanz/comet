import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { useId } from "react";
import { FieldWrapper, type BaseFieldProps } from "./FieldWrapper";

export const CometSelect = ({
  id: providedId,
  label,
  description,
  error,
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: BaseFieldProps & {
  value: string;
  onValueChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
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
      <Select.Root value={value} onValueChange={(val) => onValueChange(val ?? "")} items={options}>
        <Select.Trigger
          id={id}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm hover:border-white/20 transition-all focus:outline-none focus:border-indigo-500/50 group"
        >
          <Select.Value placeholder={placeholder} />
          <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2 group-data-[open]:rotate-180 transition-transform" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner sideOffset={8} className="z-50">
            <Select.Popup className="bg-[#1e2227] border border-white/10 rounded-xl shadow-2xl p-1 min-w-[var(--base-ui-select-trigger-width)] max-h-80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 outline-none">
              <Select.List className="overflow-auto p-1 scrollbar-thin scrollbar-thumb-white/10">
                {options.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    className="group flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-white/5 cursor-pointer outline-none data-[selected]:text-indigo-400 data-[selected]:bg-indigo-500/10 data-[highlighted]:bg-white/5 transition-colors"
                  >
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator className="text-indigo-400">
                      <Check className="w-3.5 h-3.5" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </FieldWrapper>
  );
};
