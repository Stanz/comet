import { NumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import { FieldWrapper, type BaseFieldProps } from "./FieldWrapper";

export const CometNumberField = ({
  id: providedId,
  label,
  description,
  error,
  autoFocus,
  value,
  onValueChange,
  min,
  max,
  placeholder,
  className,
  renderValue,
  size = "md",
}: BaseFieldProps & {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  renderValue?: (val: number) => string | undefined | null;
  size?: "md" | "sm";
}) => {
  const id = providedId ?? useId();
  const displayOverride = value !== undefined ? renderValue?.(value) : undefined;

  const sizeClass =
    size === "sm" ? "px-2.5 py-1.5 rounded-lg text-sm" : "px-4 py-2.5 rounded-xl text-sm";
  const btnClass = size === "sm" ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl";

  return (
    <FieldWrapper
      id={id}
      label={label}
      description={description}
      error={error}
      className={className}
    >
      <NumberField.Root
        value={value}
        onValueChange={(val) => onValueChange(val ?? 0)}
        min={min}
        max={max}
        className="w-full"
      >
        <div className="flex items-center gap-2">
          <NumberField.Decrement
            className={`${btnClass} flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30`}
          >
            <Minus className="w-4 h-4" />
          </NumberField.Decrement>
          <div className="relative flex-1">
            <NumberField.Input
              id={id}
              autoFocus={autoFocus}
              placeholder={placeholder}
              className={`w-full bg-white/5 border border-white/10 text-center ${sizeClass} focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600 ${
                displayOverride ? "text-transparent" : "text-white"
              }`}
            />
            {displayOverride && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-sm text-white select-none">
                {displayOverride}
              </div>
            )}
          </div>
          <NumberField.Increment
            className={`${btnClass} flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-30`}
          >
            <Plus className="w-4 h-4" />
          </NumberField.Increment>
        </div>
      </NumberField.Root>
    </FieldWrapper>
  );
};
