import { DEBRID_SERVICES } from "../../constants";
import { configureFormOptions } from "../../util";
import { withCometForm } from "../../../../hooks/useCometForm";
import { isKeyOf } from "../../../../util/guards";
import { DebridServiceItem } from "./DebridServiceItem";

export const DebridServicesList = withCometForm({
  ...configureFormOptions,
  render: function Render({ form }) {
    return (
      <div className="space-y-3 mb-6">
        <form.Field name="debridServices" mode="array">
          {(field) =>
            field.state.value.map((s, i: number) => (
              <form.Subscribe key={s.id} selector={(state) => state.values.debridServices[i]}>
                {(item) => {
                  if (!item) return null;

                  const info = isKeyOf(item.service, DEBRID_SERVICES)
                    ? DEBRID_SERVICES[item.service]
                    : undefined;

                  const infoJsx = (
                    <>
                      {info?.referralUrl && (
                        <a
                          href={info.referralUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] text-indigo-400/80 hover:text-indigo-300 hover:underline transition-colors"
                        >
                          Sign up
                        </a>
                      )}
                      {info?.apiKeyUrl && (
                        <a
                          href={info.apiKeyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] text-indigo-400/80 hover:text-indigo-300 hover:underline transition-colors"
                        >
                          Get API key
                        </a>
                      )}
                      {info?.helpText && (
                        <span className="text-[0.7rem] text-gray-500 italic ml-auto">
                          {info.helpText}
                        </span>
                      )}
                    </>
                  );

                  return (
                    <DebridServiceItem
                      index={i}
                      entry={item}
                      form={form}
                      onRemove={(idx: number) => field.removeValue(idx)}
                      onMove={(from: number, to: number) => field.moveValue(from, to)}
                      info={infoJsx}
                    />
                  );
                }}
              </form.Subscribe>
            ))
          }
        </form.Field>
      </div>
    );
  },
});
