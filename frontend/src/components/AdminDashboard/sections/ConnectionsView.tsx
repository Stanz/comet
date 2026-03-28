import { Activity } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminConnectionsQueryOptions } from "../util";

export function ConnectionsView() {
  const { data: connectionsData } = useSuspenseQuery(adminConnectionsQueryOptions());
  const { connections, global_stats: stats } = connectionsData;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Active Connections
        </h2>
        {stats && (
          <div className="text-xs text-gray-500 font-mono">
            Peak Concurrent: <span className="text-gray-300">{stats.peak_concurrent}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-white/5">
              <th className="pb-4 font-bold">Client IP</th>
              <th className="pb-4 font-bold">Content</th>
              <th className="pb-4 font-bold">Speed</th>
              <th className="pb-4 font-bold">Transferred</th>
              <th className="pb-4 font-bold text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {connections.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-500 italic">
                  No active connections
                </td>
              </tr>
            ) : (
              connections.map((conn) => (
                <tr key={conn.id} className="text-sm hover:bg-white/5 transition-colors group">
                  <td className="py-4">
                    <span className="font-mono bg-white/5 px-2 py-1 rounded text-gray-300">
                      {conn.ip}
                    </span>
                  </td>
                  <td className="py-4 max-w-[300px] truncate pr-4">
                    <span className="text-indigo-300">{conn.content}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-amber-400 font-mono">{conn.current_speed_formatted}</span>
                    <div className="text-[10px] text-gray-600">
                      Peak: {conn.peak_speed_formatted}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-emerald-400 font-mono">
                      {conn.bytes_transferred_formatted}
                    </span>
                  </td>
                  <td className="py-4 text-right">
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
  );
}
