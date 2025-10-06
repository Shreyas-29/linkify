"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiCreateFeedback } from "@/lib/api";
import { toast } from "sonner";
import { Star, Send, Loader2 } from "lucide-react";

const categoryOptions = [
  { value: "ui_ux", label: "Giao diện/Trải nghiệm" },
  { value: "performance", label: "Hiệu năng" },
  { value: "feature", label: "Tính năng" },
  { value: "bug", label: "Báo lỗi" },
  { value: "suggestion", label: "Đề xuất" },
  { value: "other", label: "Khác" }
];

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 5,
    category: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiCreateFeedback(formData);
      toast.success("Cảm ơn bạn đã đóng góp ý kiến!");
      setFormData({
        name: "",
        email: "",
        rating: 5,
        category: "",
        subject: "",
        message: ""
      });
    } catch (err: any) {
      toast.error(err.message || "Gửi feedback thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name">Tên / Tổ chức *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Nhập tên hoặc tổ chức"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="email@example.com"
          required
        />
      </div>

      <div>
        <Label>Đánh giá tổng thể *</Label>
        <div className="flex items-center gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
              className="focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 ${
                  star <= formData.rating 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            </button>
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            {formData.rating}/5 sao
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="category">Loại ý kiến</Label>
        <Select value={formData.category || undefined} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại ý kiến" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="subject">Tiêu đề *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          placeholder="Tóm tắt ý kiến của bạn"
          required
        />
      </div>

      <div>
        <Label htmlFor="message">Nội dung chi tiết *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Mô tả chi tiết ý kiến, đề xuất hoặc báo cáo lỗi..."
          rows={4}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Đang gửi...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Gửi ý kiến
          </>
        )}
      </Button>
    </form>
  );
}
