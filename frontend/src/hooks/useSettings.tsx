import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface SettingsContextValue {
  theme: Theme;
  showStars: boolean;
  toggleTheme: () => void;
  toggleStars: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("comet-theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  useEffect(() => {
    if (theme) document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const [showStars, setShowStarsState] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("comet-show-stars");
    return saved !== null ? saved === "true" : true;
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    localStorage.setItem("comet-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };
  const toggleStars = () => {
    const newShowStars = !showStars;
    setShowStarsState(newShowStars);
    localStorage.setItem("comet-show-stars", String(newShowStars));
  };

  return (
    <SettingsContext.Provider value={{ theme, showStars, toggleTheme, toggleStars }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
