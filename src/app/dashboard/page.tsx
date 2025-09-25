import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const token = cookies().get("token")?.value;

  return (
    <div className="px-4 md:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Tổng quan hoạt động và liên kết của bạn</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/links/create">Tạo liên kết mới</Link>
        </Button>
      </div>

      <DashboardClient />
    </div>
  );
}


