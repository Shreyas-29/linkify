"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";

let registered = false;

export function ensureChartJSRegistered() {
  if (registered) return;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
    TimeScale,
  );
  registered = true;
}

export function chartColors() {
  const toHsl = (v: string, a = 1) => `hsl(${v} / ${a})`;

  if (typeof window === "undefined" || typeof document === "undefined") {
    const primary = "222.2 47.4% 11.2%";
    const fg = "210 40% 98%";
    const muted = "215.4 16.3% 46.9%";
    return {
      primary: toHsl(primary),
      primarySoft: toHsl(primary, 0.2),
      foreground: toHsl(fg),
      muted: toHsl(muted),
    };
  }

  const style = getComputedStyle(document.documentElement);
  const primary = style.getPropertyValue("--primary").trim() || "222.2 47.4% 11.2%";
  const fg = style.getPropertyValue("--foreground").trim() || "210 40% 98%";
  const muted = style.getPropertyValue("--muted-foreground").trim() || "215.4 16.3% 46.9%";
  return {
    primary: toHsl(primary),
    primarySoft: toHsl(primary, 0.2),
    foreground: toHsl(fg),
    muted: toHsl(muted),
  };
}


