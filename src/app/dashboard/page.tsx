import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import DashboardClient from "./DashboardClient";
import ReportModal from "@/components/dashboard/ReportModal";

export default async function DashboardPage() {
  const token = cookies().get("token")?.value;

  return (
    <div className="px-4 md:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Tổng quan hoạt động và liên kết của bạn</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/links/create">Tạo liên kết mới</Link>
          </Button>
          <ReportModal />
        </div>
      </div>

      <DashboardClient />
    </div>
  );
}


