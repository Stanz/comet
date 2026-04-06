import { Suspense, useCallback, useMemo, useState } from "react";
import { Switch } from "@base-ui/react/switch";
import { CometNumberField } from "../../ui/CometNumberField";
import { CometTextField } from "../../ui/CometTextField";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Lock,
  Pencil,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { CometTooltip } from "../../ui/CometTooltip";
import {
  adminSettingsQueryOptions,
  deleteAdminSetting,
  patchAdminSetting,
  resetAllAdminSettings,
  type SettingItem,
} from "../util";
import { ConfigSkeleton } from "./ConfigSkeleton";

// ---------------------------------------------------------------------------
// Source badge
// ---------------------------------------------------------------------------
function SourceBadge({ source }: { source: SettingItem["source"] }) {
  if (source === "env") {
    return (
      <CometTooltip content="Loaded from .env file or environment variable">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 cursor-help">
          ENV
        </span>
      </CometTooltip>
    );
  }
  if (source === "override") {
    return (
      <CometTooltip content="Admin UI override (DB)">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 cursor-help">
          OVERRIDE
        </span>
      </CometTooltip>
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Inline boolean switch used during editing
// ---------------------------------------------------------------------------
function BoolSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <Switch.Root
        checked={value}
        onCheckedChange={onChange}
        className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border transition-colors data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-500 bg-white/10 border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4 translate-x-0" />
      </Switch.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single setting row
// ---------------------------------------------------------------------------
function SettingRow({
  item,
  onSave,
  onReset,
}: {
  item: SettingItem;
  onSave: (key: string, value: unknown) => Promise<void>;
  onReset: (key: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string | boolean | number>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isReadOnly = !item.editable && !item.sensitive;
  const isBool = item.type === "bool";

  const valueDisplay = useMemo(() => {
    if (item.sensitive) return item.value as string | null;
    if (item.value === null || item.value === undefined) return null;
    if (Array.isArray(item.value)) return (item.value as unknown[]).join(", ") || "[]";
    return String(item.value);
  }, [item.value, item.sensitive]);

  const startEditing = () => {
    if (isBool) {
      setInputValue(item.value === true || String(item.value).toLowerCase() === "true");
    } else if (item.type === "int") {
      setInputValue(parseInt(String(item.value ?? "0"), 10) || 0);
    } else if (item.type === "float") {
      setInputValue(parseFloat(String(item.value ?? "0")) || 0);
    } else {
      let initial = "";
      if (item.value !== null && item.value !== undefined) {
        if (Array.isArray(item.value)) initial = (item.value as unknown[]).join(", ");
        else initial = String(item.value);
      }
      setInputValue(initial);
    }
    setError(null);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      let coerced: unknown = inputValue;
      if (isBool) {
        coerced = inputValue as boolean;
      } else if (item.type === "int") {
        coerced = parseInt(inputValue as string, 10);
      } else if (item.type === "float") {
        coerced = parseFloat(inputValue as string);
      } else if (item.type === "list") {
        coerced = (inputValue as string)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      await onSave(item.key, coerced);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setError(null);
    try {
      await onReset(item.key);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  // The clickable icon in the action slot (pencil / reveal eye / lock)
  const renderActionSlot = () => {
    if (item.editable && !editing) {
      return (
        <CometTooltip content="Edit">
          <button
            onClick={startEditing}
            aria-label="Edit"
            className="flex items-center justify-center p-1 w-6 h-6 text-gray-500 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all rounded"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="sr-only">Edit</span>
          </button>
        </CometTooltip>
      );
    }
    if (item.sensitive) {
      return (
        <CometTooltip content={revealed ? "Hide value" : "Reveal value"}>
          <button
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "Hide value" : "Reveal value"}
            className="flex items-center justify-center p-1 w-6 h-6 text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-all rounded"
          >
            {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </CometTooltip>
      );
    }
    if (isReadOnly) {
      return (
        <CometTooltip content="Read-only">
          <span className="flex items-center justify-center p-1 w-6 h-6 text-gray-600">
            <Lock className="w-3 h-3" />
          </span>
        </CometTooltip>
      );
    }
    return <span className="w-6" />;
  };

  const renderValue = () => {
    const override = item.source === "override";

    if (editing) {
      if (isBool) {
        return <BoolSwitch value={inputValue as boolean} onChange={(v) => setInputValue(v)} />;
      }
      if (item.type === "int" || item.type === "float") {
        return (
          <div
            className="w-56"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") setEditing(false);
            }}
          >
            <CometNumberField
              value={Number(inputValue)}
              onValueChange={setInputValue}
              size="sm"
              autoFocus
            />
          </div>
        );
      }
      return (
        <div
          className="w-56"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") setEditing(false);
          }}
        >
          <CometTextField value={String(inputValue)} onChange={setInputValue} size="sm" autoFocus />
        </div>
      );
    }

    if (item.sensitive) {
      return (
        <span
          className={`text-sm font-mono ${override ? "text-amber-400" : revealed ? "text-gray-300" : "text-gray-600 tracking-widest"}`}
        >
          {revealed ? (valueDisplay ?? "—") : "••••••••"}
        </span>
      );
    }

    const textClass = override
      ? "text-amber-400"
      : isReadOnly
        ? "text-gray-500"
        : "text-gray-700 dark:text-gray-300";

    if (valueDisplay === null || valueDisplay === undefined) {
      return (
        <span
          className={`text-sm font-mono ${override ? "text-amber-400" : "text-gray-600"} italic`}
        >
          —
        </span>
      );
    }

    // Bool: show a disabled-looking static switch
    if (isBool && !editing) {
      const boolVal = item.value === true || item.value === "true";
      return (
        <CometTooltip content={boolVal ? "true" : "false"}>
          <span
            className={`relative inline-flex h-5 w-9 rounded-full border transition-colors ${
              boolVal ? "bg-indigo-600/70 border-indigo-500/50" : "bg-white/10 border-white/10"
            } ${isReadOnly ? "opacity-50" : ""}`}
            aria-label={boolVal ? "true" : "false"}
          >
            <span
              className={`block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${boolVal ? "translate-x-4" : "translate-x-0"}`}
            />
          </span>
        </CometTooltip>
      );
    }

    return (
      <span className={`text-sm font-mono max-w-xs truncate ${textClass}`}>{valueDisplay}</span>
    );
  };

  return (
    <div className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-50/5 transition-colors group border-b border-gray-100 dark:border-white/5 last:border-b-0">
      <div className="flex items-center gap-3 justify-between">
        {/* Left: key + badges */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          <span
            className={`text-xs font-mono font-semibold shrink-0 ${isReadOnly ? "text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
          >
            {item.key}
          </span>
          <SourceBadge source={item.source} />
          {/* Only show restart badge on editable fields */}
          {item.restart_required && item.editable && (
            <CometTooltip content="Requires restart to take effect">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 cursor-help">
                <AlertTriangle className="w-2.5 h-2.5" />
                Restart
              </span>
            </CometTooltip>
          )}
        </div>

        {/* Right: value + actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {editing ? (
            <>
              {renderValue()}
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1.5 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
              >
                {saving ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              {/* Reset button — only for overridden fields (left of value) */}
              {item.source === "override" && (
                <CometTooltip content="Remove override">
                  <button
                    onClick={handleReset}
                    disabled={saving}
                    aria-label="Remove override"
                    className="flex items-center justify-center p-1 w-6 h-6 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded mr-1"
                  >
                    {saving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                  </button>
                </CometTooltip>
              )}

              {renderValue()}

              {/* Consistent-width action slot */}
              {renderActionSlot()}
            </>
          )}
        </div>
      </div>

      {item.description && (
        <p
          className={`text-[11px] leading-relaxed ${isReadOnly ? "text-gray-600" : "text-gray-400/70"}`}
        >
          {item.description}
        </p>
      )}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Group sidebar button
// ---------------------------------------------------------------------------
function GroupButton({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-auto md:w-full text-left px-3 md:px-3 py-1.5 md:py-2 rounded-full md:rounded-lg text-sm flex md:justify-between items-center transition-colors gap-2 whitespace-nowrap shrink-0 border md:border-transparent ${
        active
          ? "bg-indigo-500/10 md:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 md:border-transparent font-semibold"
          : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      <span>{name}</span>
      <div className="flex items-center gap-1 shrink-0 hidden md:block">
        <span className="text-[10px] text-gray-500 font-mono">{count}</span>
        {active && <ChevronRight className="w-3 h-3" />}
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Inner (data-loaded) view
// ---------------------------------------------------------------------------
function ConfigViewInner() {
  const { data, refetch } = useSuspenseQuery(adminSettingsQueryOptions());
  const queryClient = useQueryClient();
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [resetting, setResetting] = useState(false);

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
    [queryClient],
  );

  const handleSave = useCallback(
    async (key: string, value: unknown) => {
      await patchAdminSetting(key, value);
      await invalidate();
    },
    [invalidate],
  );

  const handleReset = useCallback(
    async (key: string) => {
      await deleteAdminSetting(key);
      await invalidate();
    },
    [invalidate],
  );

  const handleResetAll = async () => {
    setResetting(true);
    try {
      await resetAllAdminSettings();
      await invalidate();
    } finally {
      setResetting(false);
    }
  };

  const handleDownloadEnv = useCallback(() => {
    const overrides = data.settings.filter((s) => s.source === "override");
    if (overrides.length === 0) return;

    let envContent = "# Comet Admin Setting Overrides\n";
    envContent += `# Exported on ${new Date().toISOString()}\n\n`;

    for (const item of overrides) {
      if (item.value === null || item.value === undefined) continue;

      let valStr = "";
      if (Array.isArray(item.value)) {
        valStr = item.value.join(",");
      } else {
        valStr = String(item.value);
      }

      // If it contains spaces, wrap in quotes
      if (valStr.includes(" ")) {
        valStr = `"${valStr.replace(/"/g, '\\"')}"`;
      }

      envContent += `${item.key}=${valStr}\n`;
    }

    const blob = new Blob([envContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "comet-overrides.env";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data.settings]);

  const groupedSettings = useMemo(() => {
    const map = new Map<string, SettingItem[]>();
    for (const item of data.settings) {
      const g = map.get(item.group) ?? [];
      g.push(item);
      map.set(item.group, g);
    }
    return map;
  }, [data.settings]);

  const groupNames = useMemo(
    () => ["All", ...Array.from(groupedSettings.keys()).sort()],
    [groupedSettings],
  );

  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();
    const items = activeGroup === "All" ? data.settings : (groupedSettings.get(activeGroup) ?? []);
    const filtered = q
      ? items.filter(
          (it) =>
            it.key.toLowerCase().includes(q) ||
            (it.description ?? "").toLowerCase().includes(q) ||
            String(it.value ?? "")
              .toLowerCase()
              .includes(q),
        )
      : items;
    // Editable first, then sensitive, then read-only
    return [...filtered].sort((a, b) => {
      const rank = (s: SettingItem) => (s.editable ? 0 : s.sensitive ? 1 : 2);
      return rank(a) - rank(b);
    });
  }, [data.settings, groupedSettings, activeGroup, search]);

  const overrideCount = useMemo(
    () => data.settings.filter((s) => s.source === "override").length,
    [data.settings],
  );

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Sidebar / Top Header on Mobile */}
      <div className="w-full md:w-52 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5 p-2 md:p-3 flex md:flex-col gap-2 overflow-x-auto overflow-y-hidden md:overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-white/10">
        <p className="hidden md:block text-[10px] uppercase font-bold text-gray-500 tracking-wider px-2 mb-1 shrink-0">
          Groups
        </p>
        <div className="flex md:flex-col gap-1.5 md:gap-1">
          {groupNames.map((g) => (
            <GroupButton
              key={g}
              name={g}
              count={g === "All" ? data.settings.length : (groupedSettings.get(g)?.length ?? 0)}
              active={activeGroup === g}
              onClick={() => setActiveGroup(g)}
            />
          ))}
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search settings…"
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500">
              {filteredItems.length} settings
              {overrideCount > 0 && (
                <span className="ml-2 text-amber-400 font-semibold">
                  {overrideCount} override{overrideCount !== 1 ? "s" : ""}
                </span>
              )}
            </span>
            <CometTooltip content="Refresh Config">
              <button
                onClick={() => refetch()}
                aria-label="Refresh"
                className="p-1.5 rounded text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </CometTooltip>
            {overrideCount > 0 && (
              <>
                <button
                  onClick={handleDownloadEnv}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-400 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Export .env
                </button>
                <button
                  onClick={handleResetAll}
                  disabled={resetting}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  {resetting ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  Reset All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 flex items-center gap-4 text-[10px] text-gray-500 border-b border-gray-100 dark:border-white/5 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="px-1 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              ENV
            </span>
            Environment variable
          </span>
          <span className="flex items-center gap-1">
            <span className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              OVERRIDE
            </span>
            Admin UI override (DB)
          </span>
          <span className="flex items-center gap-1">
            <span className="px-1 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
              RESTART
            </span>
            Requires restart
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Read-only
          </span>
        </div>

        {/* Settings list */}
        <div className="overflow-y-auto flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <Settings className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No settings match your search.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <SettingRow key={item.key} item={item} onSave={handleSave} onReset={handleReset} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export (with Suspense)
// ---------------------------------------------------------------------------
export function ConfigView() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 pb-0">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-indigo-400" />
          Configuration
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          All application settings. Editable fields can be overridden at runtime without a restart
          (unless marked ⚠ Restart). Overrides are persisted to the database.
        </p>
      </div>
      <div className="flex-1 min-h-0 border border-gray-200 dark:border-white/5 rounded-xl mx-4 mb-4 overflow-hidden bg-white/50 dark:bg-white/2">
        <Suspense fallback={<ConfigSkeleton />}>
          <ConfigViewInner />
        </Suspense>
      </div>
    </div>
  );
}
