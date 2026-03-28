import { Share2, Globe, Shield, Wifi, Users } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  adminCometNetStatsQueryOptions,
  adminCometNetPeersQueryOptions,
  adminCometNetPoolsQueryOptions,
} from "../util";
import { StatCard } from "../StatCard";

export function CometNetView() {
  const { data: stats } = useSuspenseQuery(adminCometNetStatsQueryOptions());
  const { data: peersData } = useSuspenseQuery(adminCometNetPeersQueryOptions());
  const { data: poolsData } = useSuspenseQuery(adminCometNetPoolsQueryOptions());

  if (!stats.enabled) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-gray-500 gap-4">
        <Share2 className="w-12 h-12 opacity-20" />
        <h2 className="text-xl font-bold">CometNet Disabled</h2>
        <p className="text-sm">Enable CometNet in Settings to join the P2P network.</p>
      </div>
    );
  }

  // Type assertion since we used v.record(v.string(), v.unknown())
  const gossipStats = (stats.gossip_stats as Record<string, number | string>) || {};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-400" />
          CometNet P2P
        </h2>
        {stats.private_network && (
          <div className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Private Network
          </div>
        )}
      </div>

      {/* Global Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Node ID"
          value={stats.node_id ? stats.node_id.substring(0, 8) : "N/A"}
          icon={<Share2 className="w-4 h-4" />}
          color="text-indigo-400"
        />
        <StatCard
          title="Connected Peers"
          value={peersData.count}
          icon={<Users className="w-4 h-4" />}
          color="text-sky-400"
        />
        <StatCard
          title="Trust Pools"
          value={Object.keys(poolsData.pools).length}
          icon={<Shield className="w-4 h-4" />}
          color="text-purple-400"
        />
        <StatCard
          title="Torrents Received"
          value={gossipStats.messages_received || 0}
          icon={<Wifi className="w-4 h-4" />}
          color="text-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Peers Table */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Connected Peers
          </h3>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {peersData.peers.length === 0 ? (
              <div className="py-8 text-center text-gray-500 italic text-sm border border-white/5 rounded-lg bg-black/20">
                No peers connected
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-[#1e2126] z-10">
                  <tr className="text-xs text-gray-500 uppercase font-bold border-b border-white/5">
                    <th className="pb-2 pl-2">Node ID</th>
                    <th className="pb-2">Address</th>
                    <th className="pb-2 text-right pr-2">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {peersData.peers.map((p) => (
                    <tr key={p.node_id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 font-mono text-gray-300 text-xs pl-2">
                        {p.node_id.substring(0, 8)}
                        {p.is_outbound ? (
                          <span className="text-indigo-400 ml-2">↑</span>
                        ) : (
                          <span className="text-emerald-400 ml-2">↓</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-400 font-mono text-xs">
                        {p.address || "Unknown"}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <span
                          className={`font-mono text-xs ${p.latency_ms < 100 ? "text-emerald-400" : p.latency_ms < 300 ? "text-amber-400" : "text-red-400"}`}
                        >
                          {p.latency_ms}ms
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Trust Pools */}
        <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner flex flex-col max-h-[440px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
              <Shield className="w-4 h-4" /> Trust Pools
            </h3>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {Object.keys(poolsData.pools).length === 0 ? (
              <div className="py-8 text-center text-gray-500 italic text-sm border border-white/5 rounded-lg bg-black/20">
                Not a member of any trust pools
              </div>
            ) : (
              Object.values(poolsData.pools).map((pool) => (
                <div
                  key={pool.pool_id}
                  className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm">{pool.display_name}</h4>
                    <span className="bg-white/10 text-gray-300 text-[10px] uppercase px-2 py-0.5 rounded font-bold font-mono">
                      {pool.pool_id.substring(0, 8)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {pool.description || "No description provided."}
                  </p>

                  <div className="flex gap-4 border-t border-white/5 pt-3 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Members</span>
                      <span className="text-sm font-mono text-gray-200">{pool.members.length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Creator</span>
                      <span className="text-sm font-mono text-indigo-400">
                        {pool.creator_key.substring(0, 8)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
