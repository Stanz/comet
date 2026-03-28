import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import * as v from "valibot";
import { useCometForm } from "../../hooks/useCometForm";
import { apiClient } from "../../util/api";
import { CometButton } from "../ui/CometButton";
import { CometPasswordField } from "../ui/CometPasswordField";
import { configQueryOptions } from "./util";

export default function ConfigureLogin() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useCometForm({
    defaultValues: {
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient
          .post("api/configure/login", {
            body: new URLSearchParams({ password: value.password }),
          })
          .json();

        const schema = v.object({
          success: v.boolean(),
          error: v.optional(v.string()),
        });

        const validated = v.parse(schema, data);

        if (validated.success) {
          // Success! Invalidate the config query to trigger a re-render of the parent
          await queryClient.invalidateQueries(configQueryOptions());
        } else {
          setError(validated.error || "Invalid password");
        }
      } catch (_e) {
        setError("Error communicating with server");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto animate-in fade-in zoom-in-95">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
        <Lock className="w-8 h-8 text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
      <p className="text-gray-400 text-sm mb-8 text-center">
        Please enter the configuration password to proceed.
      </p>

      {error && (
        <div className="mb-6 w-full animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div className="text-sm font-semibold">{error}</div>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="w-full space-y-4"
      >
        <form.AppField name="password">
          {(field) => (
            <CometPasswordField
              value={field.state.value}
              onChange={field.handleChange}
              placeholder="Enter password"
              autoFocus
            />
          )}
        </form.AppField>

        <CometButton
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Unlocking..." : "Unlock Configuration"}
        </CometButton>
      </form>
    </div>
  );
}
