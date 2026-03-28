import { Shield, Play, Square, Pause, RotateCcw, RefreshCw, Activity } from "lucide-react";
import { Button } from "@base-ui/react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { adminScraperStatusQueryOptions, adminScraperRunsQueryOptions } from "../util";

export function ScraperView({ triggerAction }: { triggerAction: (e: string) => void }) {
  const queryClient = useQueryClient();
  const { data: status } = useSuspenseQuery(adminScraperStatusQueryOptions());
  const { data: runsData } = useSuspenseQuery(adminScraperRunsQueryOptions());

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "scraper"] });
  };

  const totalQueueSize = status.queue.movies + status.queue.series + status.queue.episodes;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Background Scraper
        </h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors flex items-center gap-2 text-gray-300"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status.running
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {status.running ? (status.paused ? "Paused" : "Running") : "Stopped"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Controls</h3>
            <div className="flex flex-wrap gap-3">
              {!status.running ? (
                <ScraperButton
                  label="Start"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => triggerAction("background-scraper/start")}
                  color="emerald"
                />
              ) : (
                <>
                  <ScraperButton
                    label="Stop"
                    icon={<Square className="w-4 h-4" />}
                    onClick={() => triggerAction("background-scraper/stop")}
                    color="red"
                  />
                  {status.paused ? (
                    <ScraperButton
                      label="Resume"
                      icon={<Play className="w-4 h-4" />}
                      onClick={() => triggerAction("background-scraper/resume")}
                      color="sky"
                    />
                  ) : (
                    <ScraperButton
                      label="Pause"
                      icon={<Pause className="w-4 h-4" />}
                      onClick={() => triggerAction("background-scraper/pause")}
                      color="amber"
                    />
                  )}
                </>
              )}
              <ScraperButton
                label="Requeue Dead"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={() => triggerAction("background-scraper/requeue-dead")}
                color="indigo"
              />
            </div>
          </div>

          {status.last_error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
              <div className="text-xs font-bold text-red-400 uppercase mb-1">Last Error</div>
              <div className="text-sm text-red-300 font-mono break-all whitespace-pre-wrap">
                {status.last_error}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <MetricRow label="Active Scrapers" value={status.latest_run?.worker_count || 0} />
            <MetricRow label="Queue Size" value={totalQueueSize} />
            <MetricRow
              label="Last Run"
              value={
                status.latest_run && status.latest_run.started_at > 0
                  ? new Date(status.latest_run.started_at * 1000).toLocaleTimeString()
                  : "Never"
              }
            />
            <MetricRow label="Duration" value={`${status.stats.duration_s.toFixed(2)}s`} />
            <MetricRow label="Health" value={status.health.status.toUpperCase()} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner flex flex-col max-h-[500px]">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Recent Runs
            </h3>

            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
              {!runsData?.runs || runsData.runs.length === 0 ? (
                <div className="py-8 text-center text-gray-500 italic text-sm">
                  No recent runs found.
                </div>
              ) : (
                <div className="space-y-3">
                  {runsData.runs.map((run) => (
                    <div
                      key={run.run_id || run.started_at}
                      className="bg-black/20 p-4 rounded-lg border border-white/5"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs text-gray-400">
                          {new Date(run.started_at * 1000).toLocaleString()}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            run.status === "completed"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : run.status === "failed"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          }`}
                        >
                          {run.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-center">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">
                            Processed
                          </span>
                          <span className="text-sm font-mono text-gray-200">
                            {run.processed || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">
                            Found
                          </span>
                          <span className="text-sm font-mono text-emerald-400">
                            {run.torrents_found || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-500 uppercase font-bold">
                            Duration
                          </span>
                          <span className="text-sm font-mono text-indigo-400">
                            {run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : "-"}
                          </span>
                        </div>
                      </div>
                      {run.last_error && (
                        <div className="mt-3 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                          {run.last_error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-bold text-gray-200 font-mono">{value}</span>
    </div>
  );
}

function ScraperButton({
  label,
  icon,
  onClick,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400",
    red: "border-red-500/20 hover:bg-red-500/10 text-red-400",
    sky: "border-sky-500/20 hover:bg-sky-500/10 text-sky-400",
    amber: "border-amber-500/20 hover:bg-amber-500/10 text-amber-400",
    indigo: "border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-400",
  };

  return (
    <Button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 active:scale-95 ${colors[color]}`}
    >
      {icon}
      {label}
    </Button>
  );
}
