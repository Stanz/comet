import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormMultiSelect } from "../components/ui/form/FormMultiSelect";
import { FormNumberField } from "../components/ui/form/FormNumberField";
import { FormPasswordField } from "../components/ui/form/FormPasswordField";
import { FormTextField } from "../components/ui/form/FormTextField";
import { FormCheckbox } from "../components/ui/form/FormCheckbox";
import { FormSelect } from "../components/ui/form/FormSelect";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm: useCometForm, withForm: withCometForm } = createFormHook({
  fieldComponents: {
    FormMultiSelect,
    FormNumberField,
    FormPasswordField,
    FormTextField,
    FormCheckbox,
    FormSelect,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
