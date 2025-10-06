"use client";

import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ensureChartJSRegistered, chartColors } from "./chart-setup";

interface PieItem { label: string; value: number }

export default function PieChart({ data }: { data: PieItem[] }) {
  ensureChartJSRegistered();
  const colors = chartColors();
  const palette = [colors.primary, "#22c55e", "#eab308", "#ef4444", "#06b6d4"];
  return (
    <Doughnut
      data={{
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map((_, i) => palette[i % palette.length]),
          borderWidth: 0,
        }]
      }}
      options={{ plugins: { legend: { position: "bottom" } } }}
    />
  );
}


