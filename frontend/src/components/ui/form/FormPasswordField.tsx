import { useFieldContext } from "../../../hooks/useCometForm";
import { CometPasswordField } from "../CometPasswordField";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormPasswordField({
  label,
  description,
  placeholder,
  className,
}: BaseFieldProps & {
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometPasswordField
      label={label}
      description={description}
      error={error?.toString()}
      placeholder={placeholder}
      className={className}
      value={field.state.value}
      onChange={field.handleChange}
    />
  );
}
