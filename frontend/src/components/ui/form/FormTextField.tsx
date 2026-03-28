import { useFieldContext } from "../../../hooks/useCometForm";
import { CometTextField } from "../CometTextField";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormTextField({
  label,
  description,
  placeholder,
  type,
  className,
}: BaseFieldProps & {
  placeholder?: string;
  type?: string;
}) {
  const field = useFieldContext<string>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometTextField
      label={label}
      description={description}
      error={error?.toString()}
      placeholder={placeholder}
      type={type}
      className={className}
      value={field.state.value}
      onChange={field.handleChange}
    />
  );
}
