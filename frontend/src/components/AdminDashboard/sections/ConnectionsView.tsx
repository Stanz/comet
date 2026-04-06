import { Activity, Users, Zap, Download, HardDrive } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminConnectionsQueryOptions } from "../util";
import { StatCard } from "../StatCard";

export function ConnectionsView() {
  const { data: connectionsData } = useSuspenseQuery(adminConnectionsQueryOptions());
  const { connections, global_stats: stats } = connectionsData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Active Connections
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Active"
          value={stats?.active_connections || 0}
          icon={<Users className="w-4 h-4" />}
          color="text-indigo-400"
        />
        <StatCard
          title="Peak Concurrent"
          value={stats?.peak_concurrent || 0}
          icon={<Activity className="w-4 h-4" />}
          color="text-purple-400"
        />
        <StatCard
          title="Current Speed"
          value={stats?.total_current_speed_formatted || "0 B/s"}
          icon={<Zap className="w-4 h-4" />}
          color="text-amber-400"
        />
        <StatCard
          title="Session Traffic"
          value={stats?.total_bytes_session_formatted || "0 B"}
          icon={<Download className="w-4 h-4" />}
          color="text-emerald-400"
        />
        <StatCard
          title="All-time Traffic"
          value={stats?.total_bytes_alltime_formatted || "0 B"}
          icon={<HardDrive className="w-4 h-4" />}
          color="text-sky-400"
        />
      </div>

      <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-gray-200 dark:border-white/5 shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                <th className="pb-4 font-bold pl-2">Client IP</th>
                <th className="pb-4 font-bold">Content</th>
                <th className="pb-4 font-bold">Speed</th>
                <th className="pb-4 font-bold">Transferred</th>
                <th className="pb-4 font-bold text-right pr-2">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {connections.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="py-20 text-center text-gray-500 italic border border-gray-100 dark:border-white/5 bg-black/20 rounded-lg mt-4 w-full">
                      No active connections
                    </div>
                  </td>
                </tr>
              ) : (
                connections.map((conn) => (
                  <tr key={conn.id} className="text-sm hover:bg-white/5 transition-colors group">
                    <td className="py-4 pl-2">
                      <span className="font-mono bg-gray-100 dark:bg-white/5 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                        {conn.ip}
                      </span>
                    </td>
                    <td className="py-4 max-w-[300px] truncate pr-4">
                      <span className="text-indigo-600 dark:text-indigo-300">{conn.content}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-amber-400 font-mono">
                        {conn.current_speed_formatted}
                      </span>
                      <div className="text-[10px] text-gray-600">
                        Peak: {conn.peak_speed_formatted}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-emerald-400 font-mono">
                        {conn.bytes_transferred_formatted}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <div className="flex flex-col items-end">
                        <span className="text-gray-400">{conn.formatted_time.split(" ")[1]}</span>
                        <span className="text-[10px] text-gray-600">
                          {Math.floor(conn.duration / 60)}m {Math.floor(conn.duration % 60)}s
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
