"use client";

import { useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Facebook, Twitter, Send, MessageCircle, Link as LinkIcon } from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string | null;
  title?: string;
  text?: string;
}

const ShareModal = ({ open, onOpenChange, url, title = "Chia sẻ liên kết", text = "" }: ShareModalProps) => {
  const encoded = useMemo(() => ({
    url: encodeURIComponent(url || ""),
    text: encodeURIComponent(text || ""),
  }), [url, text]);

  const doCopy = useCallback(async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
    }
  }, [url]);

  const tryWebShare = useCallback(async () => {
    if (!url) return;
    try {
      if (navigator.share) {
        await navigator.share({ url, title, text });
        onOpenChange(false);
        return;
      }
    } catch {}
  }, [url, title, text, onOpenChange]);

  const openShare = useCallback((target: string) => {
    if (!url) return;
    const u = encoded.url; const t = encoded.text;
    let href = url;
    switch (target) {
      case "facebook": href = `https://www.facebook.com/sharer/sharer.php?u=${u}`; break;
      case "twitter": href = `https://twitter.com/intent/tweet?url=${u}&text=${t}`; break;
      case "telegram": href = `https://t.me/share/url?url=${u}&text=${t}`; break;
      case "whatsapp": href = `https://api.whatsapp.com/send?text=${t}%20${u}`; break;
      default: href = url; break;
    }
    window.open(href, "_blank", "noopener,noreferrer");
  }, [encoded, url]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Chia sẻ liên kết</DialogTitle>
          <DialogDescription>Chọn nền tảng để chia sẻ nhanh, hoặc sao chép liên kết.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="rounded-lg border p-3">
            <div className="text-sm text-muted-foreground mb-2">Liên kết</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input readOnly value={url || ""} className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" onClick={doCopy}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                <Button variant="primary" onClick={tryWebShare}><Share2 className="h-4 w-4 mr-2" />Share</Button>
              </div>
            </div>
            <div className="mt-3 aspect-video w-full rounded-md overflow-hidden border bg-muted">
              {url ? (
                <iframe src={url} className="w-full h-full" sandbox="allow-scripts allow-same-origin allow-forms" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">Không có URL</div>
              )}
            </div>
          </div>

          {/* Quick share options */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Bản xem trước trang có thể bị chặn nhúng bởi website đích. Dùng “Mở tab mới” nếu cần.</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button variant="outline" className="justify-start" onClick={() => openShare("facebook")}>
                <Facebook className="h-4 w-4 mr-2" /> Facebook
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => openShare("twitter")}>
                <Twitter className="h-4 w-4 mr-2" /> Twitter/X
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => openShare("telegram")}>
                <Send className="h-4 w-4 mr-2" /> Telegram
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => openShare("whatsapp")}>
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;


