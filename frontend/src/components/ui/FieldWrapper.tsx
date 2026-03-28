import { Field } from "@base-ui/react/field";

export interface BaseFieldProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string | false;
  autoFocus?: boolean;
  className?: string;
}

export const FieldWrapper = ({
  id,
  label,
  description,
  error = false,
  children,
  className = "",
}: BaseFieldProps & { children: React.ReactNode }) => (
  <Field.Root id={id} className={`flex flex-col gap-2 ${className}`} invalid={!!error}>
    {label && (
      <Field.Label className="text-sm font-semibold text-gray-400 ml-1">{label}</Field.Label>
    )}
    {children}
    {description && (
      <Field.Description className="text-[0.7rem] text-gray-500 ml-1 italic leading-relaxed">
        {description}
      </Field.Description>
    )}
    {error && <Field.Error className="text-xs text-red-400 ml-1">{error}</Field.Error>}
  </Field.Root>
);
