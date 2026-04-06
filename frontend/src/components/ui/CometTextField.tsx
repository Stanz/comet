import { Input } from "@base-ui/react/input";
import { useId } from "react";
import { FieldWrapper, type BaseFieldProps } from "./FieldWrapper";

export const CometTextField = ({
  id: providedId,
  label,
  description,
  error,
  autoFocus,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
  inputClassName = "",
  size = "md",
}: BaseFieldProps & {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  size?: "md" | "sm";
}) => {
  const id = providedId ?? useId();
  const sizeClass =
    size === "sm" ? "px-2.5 py-1.5 rounded-lg text-sm" : "px-4 py-2.5 rounded-xl text-sm";

  return (
    <FieldWrapper
      id={id}
      label={label}
      description={description}
      error={error}
      className={className}
    >
      <Input
        id={id}
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white/5 border border-white/10 ${sizeClass} focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600 ${inputClassName}`}
      />
    </FieldWrapper>
  );
};
