"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { ensureChartJSRegistered, chartColors } from "./chart-setup";

interface LinePoint { label: string; value: number; }

export default function LineChart({ data }: { data: LinePoint[] }) {
  ensureChartJSRegistered();
  const colors = chartColors();
  const labels = data.map(d => d.label);
  const values = data.map(d => d.value);
  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: "Clicks",
          data: values,
          borderColor: colors.primary,
          backgroundColor: colors.primarySoft,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        }]
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "rgba(120,120,120,0.15)" }, ticks: { precision: 0 } }
        }
      }}
    />
  );
}


