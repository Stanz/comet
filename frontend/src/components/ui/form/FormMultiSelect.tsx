import { type ReactNode } from "react";
import { useFieldContext } from "../../../hooks/useCometForm";
import { CometMultiSelect } from "../CometMultiSelect";
import { type BaseFieldProps } from "../FieldWrapper";

export function FormMultiSelect({
  label,
  description,
  options,
  placeholder,
  renderOption,
  renderValue,
  className,
}: BaseFieldProps & {
  options: string[];
  placeholder?: string;
  renderOption?: (val: string) => ReactNode;
  renderValue?: (val: string) => ReactNode;
}) {
  const field = useFieldContext<string[]>();
  const error = !field.state.meta.isValid && field.state.meta.errors.join(", ");

  return (
    <CometMultiSelect
      label={label}
      description={description}
      error={error?.toString()}
      options={options}
      placeholder={placeholder}
      renderOption={renderOption}
      renderValue={renderValue}
      className={className}
      value={field.state.value}
      onValueChange={field.handleChange}
    />
  );
}
