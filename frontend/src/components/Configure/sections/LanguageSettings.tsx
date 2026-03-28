import { Globe } from "lucide-react";
import { CometAccordion } from "../../ui/CometAccordion";
import { languagesEmojis, languageNames } from "../constants";
import { createKeyGuard } from "../../../util/guards";
import { configureFormOptions } from "../util";
import { withCometForm } from "../../../hooks/useCometForm";

const isLanguageEmojiKey = createKeyGuard(languagesEmojis);
const isLanguageNameKey = createKeyGuard(languageNames);

const languageOptions = {
  options: Object.keys(languagesEmojis),
  renderValue: (val: string) =>
    `${isLanguageEmojiKey(val) ? languagesEmojis[val] : ""} ${isLanguageNameKey(val) ? languageNames[val] : val}`,
  renderOption: (opt: string) =>
    `${isLanguageEmojiKey(opt) ? languagesEmojis[opt] : ""} ${isLanguageNameKey(opt) ? languageNames[opt] : opt}`,
};

export const LanguageSettings = withCometForm({
  ...configureFormOptions,
  render: function Render({ form }) {
    return (
      <CometAccordion.Item value="languages" title="Language Settings" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.AppField name="langRequired">
            {(field) => <field.FormMultiSelect label="Required Languages" {...languageOptions} />}
          </form.AppField>
          <form.AppField name="langAllowed">
            {(field) => <field.FormMultiSelect label="Allowed Languages" {...languageOptions} />}
          </form.AppField>
          <form.AppField name="langExcluded">
            {(field) => <field.FormMultiSelect label="Excluded Languages" {...languageOptions} />}
          </form.AppField>
          <form.AppField name="langPreferred">
            {(field) => <field.FormMultiSelect label="Preferred Languages" {...languageOptions} />}
          </form.AppField>
        </div>

        <div className="h-px bg-white/5 my-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.AppField name="allowEnglishInLanguages">
            {(field) => (
              <field.FormCheckbox
                label="Allow English in Languages"
                description="Include English results even if other languages are required."
              />
            )}
          </form.AppField>
          <form.AppField name="removeUnknownLanguages">
            {(field) => (
              <field.FormCheckbox
                label="Remove Unknown Languages"
                description="Exclude results where the language cannot be identified."
              />
            )}
          </form.AppField>
        </div>
      </CometAccordion.Item>
    );
  },
});
