"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { ensureChartJSRegistered, chartColors } from "./chart-setup";

interface BarItem { label: string; value: number }

export default function BarChart({ data }: { data: BarItem[] }) {
  ensureChartJSRegistered();
  const colors = chartColors();
  return (
    <Bar
      data={{
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: colors.primary,
          borderRadius: 6,
        }]
      }}
      options={{
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: "rgba(120,120,120,0.15)" }, ticks: { precision: 0 } } },
        responsive: true,
      }}
    />
  );
}


