import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import Branding from "../../components/Branding";
import { AlertTriangle, Loader2 } from "lucide-react";
import * as v from "valibot";
import { apiClient } from "../../util/api";
import { useCometForm } from "../../hooks/useCometForm";
import { CometButton } from "../../components/ui/CometButton";
import { CometPasswordField } from "../../components/ui/CometPasswordField";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
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
          .post("/admin/api/login", {
            body: new URLSearchParams({ password: value.password }),
          })
          .json();

        const schema = v.object({
          success: v.boolean(),
          error: v.optional(v.string()),
        });

        const validated = v.parse(schema, data);

        if (validated.success) {
          router.navigate({ to: "/admin/dashboard" });
        } else {
          setError(validated.error || "Login failed");
        }
      } catch (_e) {
        setError("An error occurred during login");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center w-full min-h-screen py-10 px-4">
      <Branding subtitle="Admin Login" />

      <div className="bg-[#1a1d20] p-10 rounded-2xl shadow-2xl w-full max-w-[400px] border border-white/5 animate-in fade-in zoom-in-95">
        {error && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div className="text-sm font-semibold">{error}</div>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <form.AppField name="password">
            {(field) => (
              <CometPasswordField
                label="Admin Password"
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="Enter admin password"
                autoFocus
              />
            )}
          </form.AppField>

          <CometButton
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </CometButton>
        </form>
      </div>
    </div>
  );
}
