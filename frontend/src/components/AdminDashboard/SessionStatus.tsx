import { LogOut } from "lucide-react";
import { Button } from "@base-ui/react";

interface SessionStatusProps {
  onLogout: () => Promise<void>;
}

export function SessionStatus({ onLogout }: SessionStatusProps) {
  return (
    <div className="bg-white/80 dark:bg-[#1a1d20]/90 p-4 min-w-[260px] rounded-lg flex items-center gap-4 border border-gray-200 dark:border-white/5">
      <div className="flex flex-col items-end mr-4">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">
          Session TTL
        </span>
        <span className="text-sm font-mono text-emerald-400">Active</span>
      </div>
      <Button
        onClick={onLogout}
        className="px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-all flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
}
