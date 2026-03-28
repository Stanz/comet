import { Shield, Play, Square, Pause, RotateCcw } from "lucide-react";
import { Button } from "@base-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminScraperStatusQueryOptions } from "../util";

export function ScraperView({ triggerAction }: { triggerAction: (e: string) => void }) {
  const { data: status } = useSuspenseQuery(adminScraperStatusQueryOptions());

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Background Scraper
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            status.is_running
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {status.is_running ? (status.is_paused ? "Paused" : "Running") : "Stopped"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Controls</h3>
            <div className="flex flex-wrap gap-3">
              {!status.is_running ? (
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
                  {status.is_paused ? (
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
              <div className="text-sm text-red-300 font-mono">{status.last_error}</div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <MetricRow label="Active Scrapers" value={status.active_scrapers} />
          <MetricRow label="Queue Size" value={status.queue_size} />
          <MetricRow
            label="Last Run"
            value={
              status.last_run_at > 0
                ? new Date(status.last_run_at * 1000).toLocaleTimeString()
                : "Never"
            }
          />
          <MetricRow
            label="Next Run"
            value={
              status.next_run_at > 0
                ? new Date(status.next_run_at * 1000).toLocaleTimeString()
                : "N/A"
            }
          />
          <MetricRow label="Duration" value={`${status.last_run_duration.toFixed(2)}s`} />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-base font-bold text-gray-200 font-mono">{value}</span>
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
