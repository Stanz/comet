import {
  Info,
  GitBranch,
  GitCommit,
  Calendar,
  Tag,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminConfigQueryOptions, adminUpdateCheckQueryOptions } from "../util";

export function SystemView() {
  const { data: config } = useSuspenseQuery(adminConfigQueryOptions());
  const { data: updateStatus } = useSuspenseQuery(adminUpdateCheckQueryOptions());
  const version = config.version_info;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
        <Info className="w-5 h-5 text-indigo-400" />
        System Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Version Info */}
        <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
            <Tag className="w-4 h-4" /> Version Details
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
              <span className="text-emerald-400 flex items-center gap-2 font-medium">
                <GitBranch className="w-4 h-4" /> Branch
              </span>
              <span className="font-mono text-emerald-700 dark:text-white bg-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                {version?.branch || "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
              <span className="text-purple-400 flex items-center gap-2 font-medium">
                <GitCommit className="w-4 h-4" /> Commit
              </span>
              {version?.commit_hash ? (
                <a
                  href={`https://github.com/g0ldyy/comet/commit/${version.commit_hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-purple-700 dark:text-white bg-purple-500/20 hover:bg-purple-500/30 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30 transition-colors flex items-center gap-1"
                >
                  {version.commit_hash.substring(0, 7)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-gray-500 italic">Unknown</span>
              )}
            </div>

            <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/5">
              <span className="text-amber-400 flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4" /> Build Date
              </span>
              <span className="font-mono text-amber-900 dark:text-amber-200">
                {version?.build_date ? version.build_date.split("T")[0] : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Update Check */}
        <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Update Status
          </h3>

          <div className="flex flex-col items-center justify-center p-6 h-[160px] bg-gray-100/50 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/5">
            {updateStatus.error ? (
              <div className="flex flex-col items-center gap-2 text-red-400">
                <AlertTriangle className="w-8 h-8 opacity-80" />
                <span className="font-medium text-sm">Failed to check for updates</span>
                <span className="text-xs opacity-70">{updateStatus.error}</span>
              </div>
            ) : updateStatus.has_update ? (
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  Update Available
                </div>
                <div className="text-sm text-gray-300">
                  Latest Commit:{" "}
                  <span className="font-mono text-gray-900 dark:text-white font-bold">
                    {updateStatus.latest_commit_hash?.substring(0, 7)}
                  </span>
                </div>
                {updateStatus.latest_url && (
                  <a
                    href={updateStatus.latest_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Release
                  </a>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-8 h-8 opacity-80" />
                <span className="font-medium">System is up to date</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
