import { Settings } from "lucide-react";
import { AdminConfig } from "../util";

export function ConfigView({ config }: { config: AdminConfig }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-indigo-400" />
        Live Configuration
      </h2>
      <div className="bg-black/30 rounded-xl border border-white/5 p-6 overflow-auto max-h-[500px] scrollbar-hide">
        <pre className="text-xs text-emerald-400/80 font-mono leading-relaxed">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>
    </div>
  );
}
