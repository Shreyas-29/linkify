"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { apiCreateLink, apiListLinks, type ApiLink } from "@/lib/api";

export default function CreateLinkPage() {
  const token = getToken();
  const [destination, setDestination] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [showPw, setShowPw] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 5;

  const { data: list, refetch } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      if (!token) return { links: [] } as any;
      return apiListLinks(token);
    },
  });

  // Pagination logic
  const links = (list?.links as ApiLink[] | undefined) || [];
  const totalPages = Math.ceil(links.length / linksPerPage);
  const startIndex = (currentPage - 1) * linksPerPage;
  const endIndex = startIndex + linksPerPage;
  const currentLinks = links.slice(startIndex, endIndex);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Chưa đăng nhập");
      return apiCreateLink(token, { destination, slug: slug || undefined, password: password || undefined, expiresAt: expiresAt || undefined });
    },
    onSuccess: (res) => {
      toast.success("Tạo liên kết thành công");
      setDestination(""); setSlug(""); setPassword(""); setExpiresAt("");
      refetch();
    },
    onError: (e: any) => toast.error(e?.message || "Tạo liên kết thất bại"),
  });

  return (
    <div className="px-4 md:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Tạo liên kết</h1>
          <p className="text-muted-foreground mt-1">Rút gọn URL, tùy chọn slug, mật khẩu và hết hạn</p>
        </div>
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <a href="/dashboard">Quay về Dashboard</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin liên kết</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Destination URL</Label>
            <Input placeholder="https://example.com" value={destination} onChange={e => setDestination(e.target.value)} />
          </div>
          <div>
            <Label>Slug (tùy chọn)</Label>
            <Input placeholder="my-page" value={slug} onChange={e => setSlug(e.target.value)} />
          </div>
          <div>
            <Label>Mật khẩu (tùy chọn)</Label>
            <Input placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <Label>Hết hạn (tùy chọn)</Label>
            <Input type="datetime-local" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
            <p className="text-xs text-muted-foreground mt-1">Sau thời điểm này, liên kết sẽ tự động tạm dừng.</p>
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !destination}>
              {mutation.isPending ? "Đang tạo..." : "Tạo liên kết"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liên kết gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 pr-4">Short</th>
                  <th className="py-2 pr-4">Destination</th>
                  <th className="py-2 pr-4">Clicks</th>
                  <th className="py-2 pr-4">Trạng thái</th>
                  <th className="py-2 pr-4">Hết hạn</th>
                  <th className="py-2 pr-4">Password</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {currentLinks.map((l: ApiLink) => (
                  <tr key={l.slug} className="border-t border-border/40">
                    <td className="py-2 pr-4">{l.slug}</td>
                    <td className="py-2 pr-4 truncate max-w-[280px]" title={l.destination}>{l.destination}</td>
                    <td className="py-2 pr-4">{l.clicks}</td>
                    <td className="py-2 pr-4">{(l as any).isActive === false ? "Tạm dừng" : "Hoạt động"}</td>
                    <td className="py-2 pr-4">{l.expiresAt ? new Date(l.expiresAt as any).toLocaleDateString() : "—"}</td>
                    <td className="py-2 pr-4">
                      {(l as any).password ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="select-all">{showPw[l.slug] ? (l as any).password : "•".repeat(Math.min(8, (l as any).password.length))}</span>
                          <button
                            aria-label={showPw[l.slug] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            className="h-6 w-6 inline-flex items-center justify-center rounded hover:bg-accent"
                            onClick={(e) => { e.preventDefault(); setShowPw((s)=>({ ...s, [l.slug]: !s[l.slug] })); }}
                          >
                            {showPw[l.slug] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </span>
                      ) : ((l as any).passwordHash ? "Ẩn" : "Không")}
                    </td>
                    <td className="py-2 pr-4">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, links.length)} trong {links.length} links
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
    </div>
  );
}


