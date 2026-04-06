import { Sun, Moon, Sparkles, LogOut } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";
import { CometTooltip } from "../ui/CometTooltip";

export function SettingsControls({ onLogout }: { onLogout: () => void }) {
  const { theme, showStars, toggleTheme, toggleStars } = useSettings();

  return (
    <div className="bg-white/80 dark:bg-[#1a1d20]/90 p-1.5 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-white/5">
      <CometTooltip content={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-amber-500 dark:text-emerald-400"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </CometTooltip>
      <CometTooltip content={`${showStars ? "Disable" : "Enable"} stars effect`}>
        <button
          onClick={toggleStars}
          className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
            showStars ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
          }`}
          aria-label={`${showStars ? "Disable" : "Enable"} stars effect`}
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </CometTooltip>
      <CometTooltip content="Logout">
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-lg border border-red-500/30 hover:bg-red-500/10 text-red-400 text-sm font-medium transition-all flex items-center gap-2"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </CometTooltip>
    </div>
  );
}
