import { useState, useMemo, useRef, useEffect } from "react";
import { Terminal, Trash2, Download, EyeOff, Eye, RefreshCw, Pause } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { LogEntry } from "../util";
import { adminLogsQueryOptions } from "../util";
import { Button } from "@base-ui/react";

export function LogsView() {
  const [clearedAt, setClearedAt] = useState<number>(0);
  const [hideApi, setHideApi] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Accumulated logs stored in state; watermark tracked in a ref so it never
  // causes a re-render and doesn't stale-close over the query.
  const [accumulatedLogs, setAccumulatedLogs] = useState<LogEntry[]>([]);
  const watermarkRef = useRef<number>(0);

  // Always query with the current watermark. The query key includes the
  // watermark so React Query knows to re-run when it advances.
  const { data: logsData } = useQuery({
    ...adminLogsQueryOptions(watermarkRef.current),
    refetchInterval: autoRefresh ? 5000 : false,
    // Override the queryKey to always reflect the current watermark.
    queryKey: ["admin", "logs", "stream"],
  });

  // When new data arrives, merge ONLY truly new entries and advance the watermark.
  useEffect(() => {
    if (!logsData?.logs || logsData.logs.length === 0) return;

    const incoming = logsData.logs;
    const current = watermarkRef.current;

    // Keep entries strictly newer than the last watermark to avoid duplicates.
    const novel = current === 0 ? incoming : incoming.filter((l) => l.created > current);

    if (novel.length === 0) return;

    const newWatermark = Math.max(...novel.map((l) => l.created));
    watermarkRef.current = newWatermark;

    setAccumulatedLogs((prev) => [...prev, ...novel]);
  }, [logsData]);

  const displayLogs = useMemo(() => {
    let filtered = accumulatedLogs;
    if (clearedAt > 0) {
      filtered = filtered.filter((l) => l.created > clearedAt);
    }
    if (hideApi) {
      filtered = filtered.filter((l) => !l.message.includes("/admin/api/"));
    }
    return filtered;
  }, [accumulatedLogs, clearedAt, hideApi]);

  const handleClear = () => {
    setClearedAt(Date.now() / 1000);
  };

  const handleDownload = () => {
    const text = displayLogs
      .map((l) => `[${l.timestamp}] [${l.level}] [${l.module}.${l.function}] ${l.message}`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comet-logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400 font-mono">
          <Terminal className="w-5 h-5" />
          Application Logs
        </h2>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </Button>
          <Button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </Button>
          <div className="w-px h-6 bg-white/10 mx-1 self-center" />
          <Button
            onClick={() => setHideApi(!hideApi)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 ${hideApi ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300" : "border-white/10 hover:bg-white/5 text-gray-300"}`}
          >
            {hideApi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {hideApi ? "API Hidden" : "Show API"}
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-2 ${autoRefresh ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" : "border-white/10 hover:bg-white/5 text-gray-300"}`}
          >
            {autoRefresh ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            ) : (
              <Pause className="w-3.5 h-3.5" />
            )}
            {autoRefresh ? "Auto-refreshing" : "Paused"}
          </Button>
        </div>
      </div>

      <div className="bg-black/40 rounded-xl p-4 font-mono text-xs border border-white/5 h-[500px] overflow-y-auto space-y-2 shadow-inner custom-scrollbar relative">
        {displayLogs.length === 0 ? (
          <div className="text-gray-600 italic absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            No logs to display...
          </div>
        ) : (
          displayLogs
            .slice()
            .reverse()
            .map((log, i) => (
              <div
                key={`${log.created}-${i}`}
                className="flex gap-4 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-600 shrink-0">
                  {new Date(log.created * 1000).toLocaleTimeString()}
                </span>
                <span
                  className={`shrink-0 font-bold uppercase w-20 ${
                    log.level === "ERROR" || log.level === "CRITICAL"
                      ? "text-red-500"
                      : log.level === "WARNING"
                        ? "text-amber-500"
                        : log.level === "INFO"
                          ? "text-sky-400"
                          : "text-gray-400"
                  }`}
                >
                  {log.icon} {log.level}
                </span>
                <span className="text-gray-400 truncate w-32 shrink-0 italic">
                  [{log.module}.{log.function}]
                </span>
                <span className="text-gray-200 whitespace-pre-wrap font-sans break-all">
                  {log.message}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
