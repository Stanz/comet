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
}: BaseFieldProps & {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  renderValue?: (val: number) => string | undefined | null;
}) => {
  const id = providedId ?? useId();
  const displayOverride = value !== undefined ? renderValue?.(value) : undefined;

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
          <NumberField.Decrement className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30">
            <Minus className="w-4 h-4" />
          </NumberField.Decrement>
          <div className="relative flex-1">
            <NumberField.Input
              id={id}
              autoFocus={autoFocus}
              placeholder={placeholder}
              className={`w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-center focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600 ${
                displayOverride ? "text-transparent" : "text-white"
              }`}
            />
            {displayOverride && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-sm text-white select-none">
                {displayOverride}
              </div>
            )}
          </div>
          <NumberField.Increment className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-30">
            <Plus className="w-4 h-4" />
          </NumberField.Increment>
        </div>
      </NumberField.Root>
    </FieldWrapper>
  );
};
