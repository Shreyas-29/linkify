"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { apiAnalyticsSummary, apiListLinks, apiUpdateLink, apiDeleteLink } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, EyeOff, Filter, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { APP_DOMAIN } from "@/utils/constants/site";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { mockTimeSeries } from "@/lib/mock";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ShareModal from "@/components/dashboard/ShareModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart as RBarChart, Bar } from "recharts";

interface LinkItem {
  id: string;
  short: string;
  destination: string;
  clicks: number;
  createdAt: string;
  active?: boolean;
  expiresAt?: string | null;
  hasPassword?: boolean;
  passwordPlain?: string;
}

export default function DashboardClient() {
  const [selectedLinkId, setSelectedLinkId] = useState<string>("all");
  const [qrSlug, setQrSlug] = useState<string | null>(null);
  const [showPw, setShowPw] = useState<Record<string, boolean>>({});
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedDevices, setSelectedDevices] = useState<string[]>(["desktop","mobile","tablet"]);
  const [rangePreset, setRangePreset] = useState<"1h" | "3h" | "24h" | "1m" | "1y">("24h");
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 5;

  const token = getToken();
  const queryClient = useQueryClient();
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
      // backend trả isActive; giữ backward-compat nếu có active
      active: (typeof l.isActive === "boolean" ? l.isActive : l.active) !== false,
      expiresAt: l.expiresAt || null,
      hasPassword: !!l.passwordHash || !!l.password,
      passwordPlain: l.password || "",
    }))
  ), [data]);

  // Pagination logic
  const totalPages = Math.ceil(links.length / linksPerPage);
  const startIndex = (currentPage - 1) * linksPerPage;
  const endIndex = startIndex + linksPerPage;
  const currentLinks = links.slice(startIndex, endIndex);

  const [granularity, setGranularity] = useState<"hour" | "day" | "month" | "year">("day");
  const [days, setDays] = useState<number>(14);
  const { data: analytics } = useQuery({
    queryKey: ["analytics", selectedLinkId, granularity, days, selectedDevices.join(',')],
    queryFn: async () => token ? apiAnalyticsSummary(token, { slug: selectedLinkId === "all" ? undefined : selectedLinkId, days, granularity, devices: selectedDevices }) : null,
  });

  const clicks = mockTimeSeries(14);

  const hourlyData = useMemo(() => {
    const base = Array.from({ length: 24 }, (_, h) => ({ hour: String(h).padStart(2, '0'), value: 0 }));
    const src: any[] = (analytics?.clicksOverTime as any[]) || [];
    for (const d of src) {
      const label = String((d as any)?.label || "");
      const value = Number((d as any)?.value || 0);
      const match = label.match(/\b(\d{2}):?\d{2}\b/);
      const h = match ? parseInt(match[1], 10) : NaN;
      if (!Number.isNaN(h) && h >= 0 && h < 24) {
        base[h].value += value;
      }
    }
    return base;
  }, [analytics]);

  const clicksSeries = useMemo(() => {
    const src: any[] = (analytics?.clicksOverTime as any[]) || [];
    return src.map((d: any) => ({ label: String(d?.label || ''), value: Number(d?.value || 0) }));
  }, [analytics]);

  const platformBars = useMemo(() => {
    const referrers: any[] = (analytics?.referrers as any[]) || [];
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
  }, [analytics]);

  const shortBaseUrl = useMemo(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined;
    try {
      if (apiBase) return new URL(apiBase).origin;
    } catch (_) {}
    return APP_DOMAIN;
  }, []);

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

  const toggleActive = async (slug: string, currentActive: boolean | undefined) => {
    if (!token) return;
    const next = !currentActive;
    try {
      await apiUpdateLink(token, slug, { active: next });
      await queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success(next ? "Đã chuyển sang Hoạt động" : "Đã tạm dừng link");
    } catch (e: any) {
      toast.error(e?.message || "Cập nhật trạng thái thất bại");
    }
  };

  const deleteLink = async (slug: string) => {
    if (!token) return;
    if (!confirm("Xóa link này?")) return;
    try {
      await apiDeleteLink(token, slug);
      await queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success("Đã xóa link");
    } catch (e: any) {
      toast.error(e?.message || "Xóa link thất bại");
    }
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

  const formatUrl = (raw: string, maxLen = 34) => {
    if (!raw) return "";
    try {
      const u = new URL(raw);
      const host = (u.hostname || "").replace(/^www\./, "");
      const base = `${u.protocol}//${host}`;
      const path = (u.pathname + (u.search || "")).replace(/\/$/, "");
      let display = base + (path && path !== "/" ? path : "");
      if (display.length <= maxLen) return display;
      return display.slice(0, 14) + "..." + display.slice(-10);
    } catch (_) {
      return raw.length <= maxLen ? raw : raw.slice(0, 14) + "..." + raw.slice(-10);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tổng số liên kết" value={analytics?.totals?.totalLinks ?? "—"} subtitle="Số liên kết đã tạo" />
        <StatCard title="Tổng lượt nhấp" value={analytics?.totals?.totalClicks ?? "—"} subtitle={`Trong ${days} ngày`} />
        <StatCard title="Người truy cập duy nhất" value={analytics?.totals?.uniqueVisitors ?? "—"} subtitle="Số người dùng khác nhau" />
        <StatCard title="CTR trung bình" value={analytics?.totals?.ctr != null ? `${analytics?.totals?.ctr}%` : "—"} subtitle="Tỷ lệ click" />
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
        <Dialog open={showFilters} onOpenChange={setShowFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-9 rounded-md px-3">
              <Filter className="h-4 w-4 mr-2" />Bộ lọc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bộ lọc nâng cao</DialogTitle>
              <DialogDescription>Tùy chỉnh dữ liệu hiển thị</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm mb-1">Từ ngày</div>
                  <Input type="date" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm mb-1">Đến ngày</div>
                  <Input type="date" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="text-sm">Thiết bị</div>
                <div className="flex gap-4 mt-2">
                  {(["desktop","mobile","tablet"] as const).map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm capitalize">
                      <Checkbox
                        checked={selectedDevices.includes(d)}
                        onCheckedChange={(ck) => {
                          if (ck) {
                            setSelectedDevices((prev) => [...prev, d]);
                          } else {
                            setSelectedDevices((prev) => prev.filter((x) => x !== d));
                          }
                        }}
                      />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={()=>{setDateFrom("");setDateTo("");setSelectedDevices(["desktop","mobile","tablet"]);}}>Đặt lại</Button>
                <Button className="flex-1" onClick={()=>{
                  if (dateFrom && dateTo) {
                    const from = new Date(dateFrom).getTime();
                    const to = new Date(dateTo).getTime();
                    const diffDays = Math.max(1, Math.ceil((to - from) / 86400000));
                    setDays(diffDays);
                    setGranularity(diffDays<=2?"hour":diffDays<=90?"day":diffDays<=365?"month":"year");
                  }
                  setShowFilters(false);
                }}>Áp dụng</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Liên kết gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="text-left">
                    <th className="py-2 pr-4">Rút gọn</th>
                    <th className="py-2 pr-4">Đích đến</th>
                    <th className="py-2 pr-4">Lượt click</th>
                    <th className="py-2 pr-4">Trạng thái</th>
                    <th className="py-2 pr-4">Hết hạn</th>
                    <th className="py-2 pr-4">Mật khẩu</th>
                    <th className="py-2 pr-4">Thời gian tạo </th>
                    <th className="py-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLinks.map((l) => (
                    <tr key={l.id} className="border-t border-border/40">
                      <td className="py-2 pr-4">{`${shortBaseUrl}/${l.short}`}</td>
                      <td className="py-2 pr-4 truncate max-w-[220px]" title={l.destination}>{l.destination}</td>
                      <td className="py-2 pr-4">{l.clicks}</td>
                      <td className="py-2 pr-4">{l.active === false ? "Tạm dừng" : "Hoạt động"}</td>
                      <td className="py-2 pr-4">{l.expiresAt ? new Date(l.expiresAt).toLocaleString() : "—"}</td>
                      <td className="py-2 pr-4">
                        {l.hasPassword ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="select-all">
                              {l.passwordPlain
                                ? (showPw[l.short] ? l.passwordPlain : "•".repeat(Math.min(8, l.passwordPlain.length)))
                                : "Ẩn"}
                            </span>
                            {l.passwordPlain ? (
                              <button
                                aria-label={showPw[l.short] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-accent"
                                onClick={(e) => { e.preventDefault(); setShowPw((s:any)=>({ ...s, [l.short]: !s?.[l.short] })); }}
                              >
                                {showPw[l.short] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            ) : null}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="py-2 pr-4">{l.createdAt}</td>
                      <td className="py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(`${shortBaseUrl}/${l.short}`)}>Sao chép link</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setQrSlug(l.short)}>QR Code</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`${shortBaseUrl}/${l.short}`, "_blank")}>Mở link</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShareUrl(`${shortBaseUrl}/${l.short}`)}>Chia sẻ</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Chức năng chỉnh sửa sẽ có sau")}>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleActive(l.short, l.active)}> {l.active === false ? "Hoạt động" : "Tạm dừng"}</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => deleteLink(l.short)}>Xóa link</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, links.length)} trong {links.length} liên kết
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Đích đến nổi bật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="text-left">
                    <th className="py-2 pr-4">Đích đến</th>
                    <th className="py-2 pr-4">Lượt click</th>
                  </tr>
                </thead>
                <tbody>
                  {links
                    .slice()
                    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                    .slice(0, 10)
                    .map((l) => (
                      <tr key={l.id} className="border-t border-border/40">
                        <td className="py-2 pr-4 truncate max-w-[260px]" title={l.destination}>{formatUrl(l.destination, 36)}</td>
                        <td className="py-2 pr-4">{l.clicks}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ShareModal open={!!shareUrl} onOpenChange={(o)=>!o && setShareUrl(null)} url={shareUrl} title="Chia sẻ liên kết" text="Xem link này trên ccme-shortlink" />

      <Dialog open={!!qrSlug} onOpenChange={(open) => !open && setQrSlug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mã QR</DialogTitle>
            <DialogDescription>Quét mã để mở liên kết</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3">
            {qrSlug && (
              <img
                alt="QR"
                className="rounded-md border"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=png&data=${encodeURIComponent(`${shortBaseUrl}/${qrSlug}`)}`}
              />
            )}
            {qrSlug && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(`${shortBaseUrl}/${qrSlug}`)}>Sao chép liên kết</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&format=png&data=${encodeURIComponent(`${shortBaseUrl}/${qrSlug}`)}&t=${Date.now()}`;
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = () => {
                      try {
                        const canvas = document.createElement('canvas');
                        canvas.width = 240; canvas.height = 240;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return window.open(url, '_blank');
                        ctx.drawImage(img, 0, 0, 240, 240);
                        const dataUrl = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = dataUrl;
                        a.download = `${qrSlug}-qr.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      } catch (_) {
                        window.open(url, '_blank');
                      }
                    };
                    img.onerror = () => window.open(url, '_blank');
                    img.src = url;
                  }}
                >
                  Tải xuống
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Thiết bị</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={analytics?.devices || []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tương tác theo nền tảng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RBarChart data={platformBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" radius={[3,3,0,0]} />
                </RBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Clicks theo thời gian</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              {clicksSeries.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clicksSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#22c55e" fill="#22c55e22" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                  Đang tải dữ liệu...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


