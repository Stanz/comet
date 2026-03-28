import { useFieldContext } from "../../../hooks/useCometForm";
import { CometNumberField } from "../CometNumberField";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormNumberField({
  label,
  description,
  min,
  max,
  placeholder,
  className,
  renderValue,
}: BaseFieldProps & {
  min?: number;
  max?: number;
  placeholder?: string;
  renderValue?: (val: number) => string | undefined | null;
}) {
  const field = useFieldContext<number>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometNumberField
      label={label}
      description={description}
      error={error?.toString()}
      min={min}
      max={max}
      placeholder={placeholder}
      className={className}
      value={field.state.value}
      onValueChange={field.handleChange}
      renderValue={renderValue}
    />
  );
}
