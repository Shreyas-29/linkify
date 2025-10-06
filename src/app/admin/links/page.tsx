"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, BarChart3, TrendingUp } from "lucide-react";

export default function AdminLinksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Quản lý Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Link2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chức năng quản lý links toàn hệ thống sẽ được thêm trong phiên bản tiếp theo</p>
            <p className="text-sm mt-2">Bao gồm: xem tất cả links, thống kê chi tiết, quản lý trạng thái</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
