"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/auth";
import { apiCreateLink, apiListLinks, type ApiLink } from "@/lib/api";

export default function CreateLinkPage() {
  const token = getToken();
  const [destination, setDestination] = useState("");
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>("");

  const { data: list, refetch } = useQuery({
    queryKey: ["links"],
    queryFn: async () => {
      if (!token) return { links: [] } as any;
      return apiListLinks(token);
    },
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Tạo liên kết</h1>
          <p className="text-muted-foreground mt-1">Rút gọn URL, tùy chọn slug, mật khẩu và hết hạn</p>
        </div>
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
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {(list?.links as ApiLink[] | undefined)?.map((l: ApiLink) => (
                  <tr key={l.slug} className="border-t border-border/40">
                    <td className="py-2 pr-4">{l.slug}</td>
                    <td className="py-2 pr-4 truncate max-w-[280px]" title={l.destination}>{l.destination}</td>
                    <td className="py-2 pr-4">{l.clicks}</td>
                    <td className="py-2 pr-4">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


