"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Sparkles, ArrowRight } from "lucide-react";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PricingModal = ({ open, onOpenChange }: PricingModalProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2025-10-15T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" w-full sm:mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl sm:text-2xl font-bold"> CCme - Thông báo hệ thống</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            Hiện tại hệ thống đang trong giai đoạn thử nghiệm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Main message */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-4 sm:p-6 border border-primary/20">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                🚀 Hệ thống đang trong giai đoạn Beta
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Chúng tôi đang hoàn thiện các tính năng và tối ưu hóa trải nghiệm người dùng. 
                Hệ thống sẽ chính thức ra mắt vào ngày <span className="font-semibold text-primary">15/10/2025</span>.
              </p>
            </div>
          </div>

          {/* Countdown timer */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Thời gian còn lại:</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                { label: "Ngày", value: timeLeft.days },
                { label: "Giờ", value: timeLeft.hours },
                { label: "Phút", value: timeLeft.minutes },
                { label: "Giây", value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white border border-border rounded-lg p-2 sm:p-4 shadow-sm">
                    <div className="text-lg sm:text-2xl font-bold text-black">{String(item.value).padStart(2, '0')}</div>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features preview - hidden on mobile */}
          <div className="hidden sm:block space-y-4">
            <h4 className="text-lg font-semibold text-center">Tính năng sắp ra mắt</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Gói miễn phí với 1000 links/tháng",
                "Analytics chi tiết và báo cáo",
                "Custom domain và branding",
                "API integration",
                "Team collaboration",
                "Advanced security features"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA - hidden on mobile */}
          <div className="hidden sm:block text-center space-y-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Trong thời gian chờ đợi, bạn có thể sử dụng các tính năng cơ bản miễn phí
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => onOpenChange(false)} variant="ghost" className="rounded-full px-5">
                Đóng
              </Button>
              <Button onClick={() => window.location.href = "/dashboard"} variant="primary" className="rounded-full px-5">
                Thử ngay
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingModal;
