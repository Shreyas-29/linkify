"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/utils";
import FeedbackForm from "./feedback-form";

interface InvestorInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestorInviteModal = ({ open, onOpenChange }: InvestorInviteModalProps) => {
  const [wantsContact, setWantsContact] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"letter" | "form">("letter");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1200px] h-[92vh] sm:h-[88vh] overflow-y-auto p-0 sm:rounded-2xl">
        <div className="flex flex-col lg:flex-row min-h=[92vh] sm:min-h-[88vh]">
          {/* Mobile switcher */}
          <div className="lg:hidden px-5 sm:px-8 pt-4 pb-2 sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="inline-flex rounded-lg border border-border p-1 bg-background">
              <button onClick={() => setActiveSection("letter")} className={cn("px-3 py-1.5 text-sm rounded-md", activeSection === "letter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Thư ngỏ</button>
              <button onClick={() => setActiveSection("form")} className={cn("px-3 py-1.5 text-sm rounded-md", activeSection === "form" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>Form góp ý</button>
            </div>
          </div>
          {/* Left: Feedback form */}
          <div className={cn("w-full lg:w-1/2 h-full bg-background border-r border-border flex flex-col", activeSection === "form" ? "block" : "hidden", "lg:block")}> 
            <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-3 border-b border-border bg-background/80 sticky top-0 z-10">
              <DialogHeader className="mb-0">
                <DialogTitle className="text-2xl font-bold tracking-tight">Góp ý trải nghiệm Beta</DialogTitle>
                <DialogDescription>Hãy dành 2 phút để chia sẻ ý kiến của bạn.</DialogDescription>
              </DialogHeader>
            </div>
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5">
              <div className="max-w-[560px] mx-auto">
                <FeedbackForm />
              </div>
            </div>
          </div>

          {/* Right: Letter */}
          <div className={cn("w-full lg:w-1/2 h-full overflow-y-auto bg-gradient-to-b from-background to-muted/20 relative", activeSection === "letter" ? "block" : "hidden", "lg:block")}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="relative p-6 sm:p-10">
              <div className="max-w-[640px] mx-auto bg-background/60 backdrop-blur-sm border border-border rounded-2xl shadow-sm p-6 sm:p-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500" style={{ fontFamily: 'cursive' }}>THƯ NGỎ HỢP TÁC ĐẦU TƯ</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6">Các bạn thân mến</p>
                <div className="prose prose-invert prose-p:leading-relaxed prose-p:text-justify prose-h3:mt-6 text-neutral-200 prose-strong:text-neutral-100" style={{ fontFamily: 'cursive' }}>
                <p>Chúng tớ là CCME Company – đội ngũ đang xây dựng ccme-shortlink, một nền tảng giúp bạn quản lý, theo dõi traffic và tối ưu hiệu quả công việc xoay quanh sử dụng các liên kết để tiếp thị.</p>
                <p>Sản phẩm đã có bản thử nghiệm (Beta) ổn định và đang bước vào giai đoạn hoàn thiện để vận hành chính thức. Chúng tớ tìm kiếm những nhà đầu tư đồng hành – không chỉ về tài chính mà còn là đối tác chiến lược, cùng chia sẻ tầm nhìn dài hạn để đưa sản phẩm đến với nhiều người dùng hơn.</p>
                <h3 className="text-xl text-red-300 font-semibold">Lợi ích khi đầu tư giai đoạn sớm</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ưu đãi đặc biệt: Giảm 80–99% phí gói Pro trong 3 tháng đầu sau khi qua giai đoạn BETA.</li>
                  <li>
                    Ưu tiên hợp tác chiến lược để cùng mở rộng hệ sinh thái CCME
                    <span className="block text-sm text-muted-foreground mt-1">(ví dụ: CCme-Builder để xây dựng website mà không cần biết code, CCme-AutoClick và các sản phẩm khác trong hệ sinh thái của CCME)</span>
                  </li>
                  <li>Cùng chúng tớ định hình sản phẩm theo nhu cầu thực tế của thị trường.</li>
                </ul>
                <h3 className="text-xl text-red-300 font-semibold">Vì sao nên đồng hành cùng CCME</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Lộ trình phát triển rõ ràng, tập trung xử lý bài toán thực tế.</li>
                  <li>Đội ngũ gọn, linh hoạt, triển khai nhanh và kiên định chất lượng.</li>
                  <li>Mô hình kinh doanh có tiềm năng nhân rộng trong 1–3 năm tới.</li>
                </ul>
                <p className="mt-4">Cảm ơn bạn đã dành thời gian. Chúng tớ mong được đồng hành cùng bạn trong chặng đường sắp tới.</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <button onClick={() => setQrOpen(true)} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">
                    Trở thành nhà đầu tư
                  </button>
                  <p className="text-right">Trân trọng,<br/>Đoàn Minh Dũng<br/>Founder – CCME Company</p>
                </div>
                </div>
              </div>
            </div>
          </div>
          {/* QR Dialog */}
          <Dialog open={qrOpen} onOpenChange={setQrOpen}>
            <DialogContent className="w-full max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Mã QR chuyển khoản</DialogTitle>
                <p className="text-sm text-red-300 italic">Hệ thống sẽ tự động lưu lại thông tin và sẽ chủ động liên lạc qua email ngay khi nhận được đóng góp của bạn.</p>
              </DialogHeader>
              <div className="w-full flex items-center justify-center py-2">
                <img src="/taikhoannganhang.jpg" alt="QR chuyển khoản" className="w-64 h-64 object-contain rounded-md border border-border bg-white" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestorInviteModal;


