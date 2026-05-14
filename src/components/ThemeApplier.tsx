import { useEffect } from "react";
import { useSiteData } from "@/hooks/use-site-data";

/**
 * Applies live theme settings from the database as CSS variables on :root.
 * Renders nothing.
 */
export function ThemeApplier() {
  const { settings } = useSiteData();
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--background", settings.theme_bg);
    root.style.setProperty("--foreground", settings.theme_foreground);
    root.style.setProperty("--primary", settings.theme_primary);
    root.style.setProperty("--primary-glow", settings.theme_primary_glow);
    root.style.setProperty("--accent", settings.theme_primary);
    root.style.setProperty("--ring", settings.theme_primary);
    root.style.setProperty("--cursor-color", settings.cursor_color);
  }, [settings]);
  return null;
}
