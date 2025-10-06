"use client";

import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getToken } from "@/lib/auth";
import { apiAnalyticsSummary, apiListLinks } from "@/lib/api";
import { Download } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RBarChart, Bar, PieChart as RPieChart, Pie, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportModal = () => {
  const token = getToken();
  const reportRef = useRef<HTMLDivElement>(null);
  const days = 14 as const;
  const granularity = "day" as const;
  
  // TODO: Thay đổi thành true khi user đã nạp tiền/premium
  const isPremium = false;

  const { data } = useQuery({
    queryKey: ["report-analytics", days, granularity],
    queryFn: async () => token ? apiAnalyticsSummary(token, { days, granularity }) : null,
    enabled: !!token,
  });

  const { data: linksData } = useQuery({
    queryKey: ["report-links"],
    queryFn: async () => token ? apiListLinks(token) : { links: [] },
    enabled: !!token,
  });

  const clicksSeries = useMemo(() => {
    return (data?.clicksOverTime || []).map((d: any) => ({ label: d.label, value: d.value }));
  }, [data]);

  const platformBars = useMemo(() => {
    const referrers: any[] = (data?.referrers as any[]) || [];
    const toHost = (url: string) => {
      try { return new URL(url).hostname.toLowerCase().replace(/^www\./, ""); } catch { return String(url || "").toLowerCase(); }
    };
    const toPlatform = (raw: string) => {
      const h = toHost(raw);
      if (h.includes("facebook") || h.includes("fb.")) return "Facebook";
      if (h.includes("tiktok")) return "TikTok";
      if (h.includes("instagram")) return "Instagram";
      if (h.includes("twitter") || h === "x.com") return "Twitter/X";
      if (h.includes("youtube") || h.includes("youtu.be")) return "YouTube";
      if (h.includes("zalo")) return "Zalo";
      if (h.includes("telegram")) return "Telegram";
      if (h.includes("whatsapp")) return "WhatsApp";
      if (h.includes("google") || h.includes("bing") || h.includes("yandex")) return "Search";
      if (!h || h === "") return "Direct";
      return "Other";
    };
    const map = new Map<string, number>();
    for (const r of referrers) {
      const p = toPlatform(r?.label || "");
      map.set(p, (map.get(p) || 0) + Number(r?.value || 0));
    }
    const order = ["Facebook","TikTok","YouTube","Instagram","Twitter/X","Zalo","Telegram","WhatsApp","Search","Direct","Other"];
    const arr = Array.from(map.entries()).map(([label,value])=>({ label, value }));
    arr.sort((a,b)=> order.indexOf(a.label) - order.indexOf(b.label));
    return arr;
  }, [data]);

  const topLinks = useMemo(() => {
    const links = (linksData?.links || []).map((l: any) => ({
      short: l.slug,
      destination: l.destination,
      clicks: l.clicks || 0,
    }));
    return links.sort((a, b) => b.clicks - a.clicks).slice(0, 10);
  }, [linksData]);

  const formatUrl = (raw: string, maxLen = 40) => {
    if (!raw) return "";
    try {
      const u = new URL(raw);
      const host = (u.hostname || "").replace(/^www\./, "");
      const base = `${u.protocol}//${host}`;
      const path = (u.pathname + (u.search || "")).replace(/\/$/, "");
      let display = base + (path && path !== "/" ? path : "");
      if (display.length <= maxLen) return display;
      return display.slice(0, 20) + "..." + display.slice(-15);
    } catch (_) {
      return raw.length <= maxLen ? raw : raw.slice(0, 20) + "..." + raw.slice(-15);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    const el = reportRef.current;
    const canvas = await html2canvas(el, { backgroundColor: "#ffffff", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 48; // margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let y = 24;
    if (imgHeight <= pageHeight - 48) {
      pdf.addImage(imgData, "PNG", 24, y, imgWidth, imgHeight);
    } else {
      // paginate
      let remaining = imgHeight;
      let position = 24;
      let canvasPageHeight = (canvas.width * (pageHeight - 48)) / imgWidth;
      let sY = 0;
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = canvasPageHeight;
      while (remaining > 0) {
        if (!pageCtx) break;
        pageCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
        pageCtx.drawImage(canvas, 0, sY, canvas.width, canvasPageHeight, 0, 0, canvas.width, canvasPageHeight);
        const img = pageCanvas.toDataURL("image/png");
        pdf.addImage(img, "PNG", 24, 24, imgWidth, pageHeight - 48);
        remaining -= (pageHeight - 48);
        sY += canvasPageHeight;
        if (remaining > 0) pdf.addPage();
      }
    }
    pdf.save("bao-cao-ccme-shortlink.pdf");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto sm:ml-2">
          <Download className="h-4 w-4 mr-2" />Tải báo cáo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="text-xs text-muted-foreground -mt-1 mb-1 opacity-70">
            ccme-Company
          </div>
          <DialogTitle>Báo cáo tổng quan</DialogTitle>
          <DialogDescription>
            Số liệu 14 ngày gần nhất. Bạn có thể xuất và chia sẻ cho đội ngũ.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 flex items-center justify-end flex-shrink-0">
          <Button onClick={handleDownloadPdf} variant="primary" size="sm">
            <Download className="h-4 w-4 mr-2" />Tải về PDF
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto relative min-h-0 overscroll-contain">
          <div ref={reportRef} className="space-y-6 bg-white p-4 rounded-md relative">
            {/* Watermark markdown - chỉ hiển thị khi chưa premium */}
            {!isPremium && (
              <div className="absolute inset-0 pointer-events-none z-10">
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 text-red-500 font-bold text-4xl opacity-20 select-none"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(239, 68, 68, 0.1) 50%, transparent 70%)',
                    width: '200%',
                    height: '200%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#ef4444',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                    letterSpacing: '0.2em'
                  }}
                >
                  ccme-Company
                </div>
              </div>
            )}
          {/* Tổng quan số liệu */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">Tổng link</div>
              <div className="text-2xl font-semibold text-black">{data?.totals?.totalLinks ?? "—"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">Tổng click</div>
              <div className="text-2xl font-semibold text-black">{data?.totals?.totalClicks ?? "—"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">Unique visitors</div>
              <div className="text-2xl font-semibold text-black">{data?.totals?.uniqueVisitors ?? "—"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-600">CTR</div>
              <div className="text-2xl font-semibold text-black">{data?.totals?.ctr != null ? `${data?.totals?.ctr}%` : "—"}</div>
            </div>
          </div>

          {/* Top 10 Links */}
          <div className="rounded-lg border p-4">
            <div className="text-lg font-semibold text-black mb-3">Top 10 Links có nhiều click nhất</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-600">
                  <tr className="text-left border-b">
                    <th className="py-2 pr-4 font-medium">Link</th>
                    <th className="py-2 pr-4 font-medium">Destination</th>
                    <th className="py-2 pr-4 font-medium">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {topLinks.map((l, i) => (
                    <tr key={l.short} className="border-b border-gray-100">
                      <td className="py-2 pr-4 text-black font-mono text-xs">{l.short}</td>
                      <td className="py-2 pr-4 text-black" title={l.destination}>{formatUrl(l.destination, 50)}</td>
                      <td className="py-2 pr-4 text-black font-semibold">{l.clicks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Biểu đồ grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Clicks theo thời gian */}
            <div className="rounded-lg border p-4">
              <div className="text-lg font-semibold text-black mb-3">Clicks theo thời gian</div>
              <div className="h-[200px]">
                {clicksSeries.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={clicksSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" tick={{ fill: '#000000', fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fill: '#000000', fontSize: 12 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#000000' }} />
                      <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e22" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                    {token ? "Đang tải dữ liệu..." : "Vui lòng đăng nhập"}
                  </div>
                )}
              </div>
            </div>

            {/* Devices */}
            <div className="rounded-lg border p-4">
              <div className="text-lg font-semibold text-black mb-3">Thiết bị</div>
              <div className="h-[200px]">
                {data?.devices?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RPieChart>
                      <Pie
                        data={data.devices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name as string} ${(Number(percent) * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.devices.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#22c55e', '#3b82f6', '#f59e0b'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#000000' }} />
                    </RPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                    {token ? "Đang tải dữ liệu..." : "Vui lòng đăng nhập"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Platform engagement */}
          <div className="rounded-lg border p-4">
            <div className="text-lg font-semibold text-black mb-3">Engagement theo Platform</div>
            <div className="h-[200px]">
              {platformBars.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RBarChart data={platformBars}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="label" tick={{ fill: '#000000', fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#000000', fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#000000' }} />
                    <Bar dataKey="value" fill="#22c55e" radius={[3,3,0,0]} />
                  </RBarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-gray-500">
                  {token ? "Đang tải dữ liệu..." : "Vui lòng đăng nhập"}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;


