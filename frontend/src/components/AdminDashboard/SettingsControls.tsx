import { Sun, Moon, Sparkles } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

export function SettingsControls() {
  const { theme, showStars, toggleTheme, toggleStars } = useSettings();

  return (
    <div className="bg-white/80 dark:bg-[#1a1d20]/90 p-1.5 rounded-lg flex items-center gap-1 border border-gray-200 dark:border-white/5">
      <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-amber-500 dark:text-emerald-400"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
      <button
        onClick={toggleStars}
        className={`p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
          showStars ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"
        }`}
        title={`${showStars ? "Disable" : "Enable"} stars effect`}
      >
        <Sparkles className="w-4 h-4" />
      </button>
    </div>
  );
}
