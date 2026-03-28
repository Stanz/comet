import { Input } from "@base-ui/react/input";
import { Eye, EyeOff } from "lucide-react";
import { useState, useId } from "react";
import { FieldWrapper, type BaseFieldProps } from "./FieldWrapper";

export const CometPasswordField = ({
  id: providedId,
  label,
  description,
  error,
  autoFocus,
  value,
  onChange,
  placeholder,
  className,
}: BaseFieldProps & {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const [show, setShow] = useState(false);
  const id = providedId ?? useId();

  return (
    <FieldWrapper
      id={id}
      label={label}
      description={description}
      error={error}
      className={className}
    >
      <div className="relative">
        <Input
          id={id}
          autoFocus={autoFocus}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-12 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-600"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </FieldWrapper>
  );
};
