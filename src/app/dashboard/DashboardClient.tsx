"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { apiAnalyticsSummary, apiListLinks } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { mockTimeSeries } from "@/lib/mock";

interface LinkItem {
  id: string;
  short: string;
  destination: string;
  clicks: number;
  createdAt: string;
}

export default function DashboardClient() {
  const [selectedLinkId, setSelectedLinkId] = useState<string>("all");

  const token = getToken();
  const { data } = useQuery({
    queryKey: ["links"],
    queryFn: async () => token ? apiListLinks(token) : { links: [] as any[] } as any,
  });
  const links: LinkItem[] = useMemo(() => (
    (data?.links || []).map((l: any) => ({
      id: l.slug,
      short: l.slug,
      destination: l.destination,
      clicks: l.clicks,
      createdAt: new Date(l.createdAt).toLocaleDateString(),
    }))
  ), [data]);

  const [granularity, setGranularity] = useState<"hour" | "day" | "month" | "year">("day");
  const [days, setDays] = useState<number>(14);
  const { data: analytics } = useQuery({
    queryKey: ["analytics", selectedLinkId, granularity, days],
    queryFn: async () => token ? apiAnalyticsSummary(token, { slug: selectedLinkId === "all" ? undefined : selectedLinkId, days, granularity }) : null,
  });

  const clicks = mockTimeSeries(14);

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success("Đã copy link vào clipboard");
        return;
      }
    } catch (_) {}
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      toast.success("Đã copy link vào clipboard");
    } catch (_) {}
    document.body.removeChild(textarea);
  };

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
        {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng số link" value={analytics?.totals?.totalLinks ?? "—"} subtitle="Số link đã tạo" />
        <StatCard title="Tổng lượt click" value={analytics?.totals?.totalClicks ?? "—"} subtitle={`Trong ${days} ngày"`} />
        <StatCard title="Người dùng duy nhất" value={analytics?.totals?.uniqueVisitors ?? "—"} subtitle="Unique visitors" />
        <StatCard title="CTR trung bình" value={analytics?.totals?.ctr != null ? `${analytics?.totals?.ctr}%` : "—"} subtitle="Click-through rate" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-1">
        <div className="text-sm text-muted-foreground">Thống kê theo:</div>
        <select
          value={selectedLinkId}
          onChange={(e) => setSelectedLinkId(e.target.value)}
          className="ml-auto h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">Tất cả liên kết</option>
          {links.map((l) => (
            <option key={l.id} value={l.id}>{l.short}</option>
          ))}
        </select>
        <select
          value={String(days)}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value={1}>24 giờ</option>
          <option value={7}>7 ngày</option>
          <option value={14}>14 ngày</option>
          <option value={30}>30 ngày</option>
          <option value={90}>90 ngày</option>
          <option value={365}>1 năm</option>
        </select>
        <select
          value={granularity}
          onChange={(e) => setGranularity(e.target.value as any)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="hour">Giờ</option>
          <option value="day">Ngày</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="text-left">
                    <th className="py-2 pr-4">Short</th>
                    <th className="py-2 pr-4">Destination</th>
                    <th className="py-2 pr-4">Clicks</th>
                    <th className="py-2 pr-4">Created</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((l) => (
                    <tr key={l.id} className="border-t border-border/40">
                      <td className="py-2 pr-4">{`${process.env.NEXT_PUBLIC_APP_URL}/${l.short}`}</td>
                      <td className="py-2 pr-4 truncate max-w-[220px]" title={l.destination}>{l.destination}</td>
                      <td className="py-2 pr-4">{l.clicks}</td>
                      <td className="py-2 pr-4">{l.createdAt}</td>
                      <td className="py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`${process.env.NEXT_PUBLIC_APP_URL}/${l.short}`)}
                        >
                          Copy
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Clicks over time</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={analytics?.clicksOverTime || []} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics?.devices || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics?.countries || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Age</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={[]} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}


