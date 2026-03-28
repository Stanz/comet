import { useFieldContext } from "../../../hooks/useCometForm";
import { CometCheckbox } from "../CometCheckbox";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormCheckbox({ label, description, className }: BaseFieldProps) {
  const field = useFieldContext<boolean>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometCheckbox
      label={label}
      description={description}
      error={error}
      className={className}
      checked={field.state.value}
      onCheckedChange={field.handleChange}
    />
  );
}
