"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Shield, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cài đặt hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chức năng cài đặt hệ thống sẽ được thêm trong phiên bản tiếp theo</p>
            <p className="text-sm mt-2">Bao gồm: cấu hình hệ thống, quản lý database, bảo mật</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
