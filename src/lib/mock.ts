export function mockTimeSeries(days = 14) {
  const out: { label: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push({ label: `${i}d`, value: Math.round(Math.random() * 200) });
  }
  return out;
}

export function mockDistribution(keys: string[]) {
  return keys.map((k) => ({ label: k, value: Math.round(Math.random() * 100 + 10) }));
}

export function mockStats() {
  return {
    totalLinks: Math.round(Math.random() * 200 + 20),
    totalClicks30d: Math.round(Math.random() * 5000 + 500),
    uniqueVisitors: Math.round(Math.random() * 2000 + 200),
    ctr: Number((Math.random() * 5 + 1).toFixed(2)),
  };
}


