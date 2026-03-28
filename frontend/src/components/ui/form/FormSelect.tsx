import { useFieldContext } from "../../../hooks/useCometForm";
import { CometSelect } from "../CometSelect";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormSelect({
  label,
  description,
  options,
  placeholder,
  className,
}: BaseFieldProps & {
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometSelect
      label={label}
      description={description}
      error={error?.toString()}
      options={options}
      placeholder={placeholder}
      className={className}
      value={field.state.value}
      onValueChange={field.handleChange}
    />
  );
}
