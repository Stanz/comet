import React from "react";

export function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-[#1a1d20]/90 border border-white/5 rounded-xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg bg-white/5 ${color}`}>{icon}</div>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{title}</span>
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
    </div>
  );
}
