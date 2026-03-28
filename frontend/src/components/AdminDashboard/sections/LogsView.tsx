import { Terminal } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminLogsQueryOptions } from "../util";

export function LogsView() {
  const { data: logsData } = useSuspenseQuery(adminLogsQueryOptions());
  const { logs } = logsData;
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-emerald-400 font-mono">
        <Terminal className="w-5 h-5" />
        Application Logs
      </h2>
      <div className="bg-black/40 rounded-xl p-4 font-mono text-xs border border-white/5 h-[500px] overflow-y-auto space-y-2 shadow-inner">
        {logs.length === 0 ? (
          <div className="text-gray-600 italic">Listening for logs...</div>
        ) : (
          logs
            .map((log, i) => (
              <div
                key={i}
                className="flex gap-4 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 transition-colors"
              >
                <span className="text-gray-600 shrink-0">
                  {new Date(log.created * 1000).toLocaleTimeString()}
                </span>
                <span
                  className={`shrink-0 font-bold uppercase w-12 ${
                    log.levelname === "ERROR"
                      ? "text-red-500"
                      : log.levelname === "WARNING"
                        ? "text-amber-500"
                        : "text-indigo-400"
                  }`}
                >
                  {log.levelname}
                </span>
                <span className="text-gray-400 truncate w-32 shrink-0 italic">[{log.name}]</span>
                <span className="text-gray-200">{log.message}</span>
              </div>
            ))
            .reverse()
        )}
      </div>
    </div>
  );
}
