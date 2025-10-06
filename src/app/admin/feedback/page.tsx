"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { apiAdminFeedbacks, apiAdminFeedbackStats, apiAdminUpdateFeedback, apiAdminSendThankYou, apiAdminDeleteFeedback } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Search, 
  Edit, 
  Trash2, 
  Heart,
  Star,
  Filter,
  TrendingUp,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const categoryLabels = {
  ui_ux: "UI/UX",
  performance: "Hiệu năng",
  feature: "Tính năng",
  bug: "Lỗi",
  suggestion: "Đề xuất",
  other: "Khác"
};

const statusLabels = {
  new: "Mới",
  reviewed: "Đã xem",
  in_progress: "Đang xử lý",
  resolved: "Đã giải quyết",
  closed: "Đã đóng"
};

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp"
};

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  reviewed: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-orange-100 text-orange-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800"
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export default function AdminFeedbackPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingFeedback, setEditingFeedback] = useState<any>(null);
  const [deleteFeedback, setDeleteFeedback] = useState<any>(null);
  const [thankYouFeedback, setThankYouFeedback] = useState<any>(null);
  const token = getToken();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-feedbacks", page, search, statusFilter, categoryFilter, priorityFilter],
    queryFn: () => apiAdminFeedbacks(token!, { 
      page, 
      limit: 20, 
      search, 
      status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
      category: categoryFilter && categoryFilter !== "all" ? categoryFilter : undefined,
      priority: priorityFilter && priorityFilter !== "all" ? priorityFilter : undefined
    }),
    enabled: !!token,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-feedback-stats"],
    queryFn: () => apiAdminFeedbackStats(token!),
    enabled: !!token,
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: (payload: { feedbackId: string; data: any }) => 
      apiAdminUpdateFeedback(token!, payload.feedbackId, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["admin-feedback-stats"] });
      setEditingFeedback(null);
      toast.success("Cập nhật feedback thành công");
    },
    onError: (err: any) => toast.error(err.message || "Cập nhật feedback thất bại"),
  });

  const sendThankYouMutation = useMutation({
    mutationFn: (payload: { feedbackId: string; thankYouMessage: string }) => 
      apiAdminSendThankYou(token!, payload.feedbackId, { thankYouMessage: payload.thankYouMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["admin-feedback-stats"] });
      setThankYouFeedback(null);
      toast.success("Gửi lời cảm ơn thành công");
    },
    onError: (err: any) => toast.error(err.message || "Gửi lời cảm ơn thất bại"),
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: (feedbackId: string) => apiAdminDeleteFeedback(token!, feedbackId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["admin-feedback-stats"] });
      setDeleteFeedback(null);
      toast.success("Xóa feedback thành công");
    },
    onError: (err: any) => toast.error(err.message || "Xóa feedback thất bại"),
  });

  const handleUpdateFeedback = (formData: FormData) => {
    if (!editingFeedback) return;
    
    const status = formData.get("status") as string;
    const priority = formData.get("priority") as string;
    const adminNotes = formData.get("adminNotes") as string;

    updateFeedbackMutation.mutate({
      feedbackId: editingFeedback._id,
      data: { status, priority, adminNotes }
    });
  };

  const handleSendThankYou = (formData: FormData) => {
    if (!thankYouFeedback) return;
    
    const thankYouMessage = formData.get("thankYouMessage") as string;

    sendThankYouMutation.mutate({
      feedbackId: thankYouFeedback._id,
      thankYouMessage
    });
  };

  if (isLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng ý kiến</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.totalFeedbacks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.overview.recentFeedbacks} trong 30 ngày
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chưa cảm ơn</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overview.unthankedCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Cần gửi lời cảm ơn
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.ratingStats.length > 0 
                  ? (stats.ratingStats.reduce((sum, item) => sum + (item._id * item.count), 0) / 
                     stats.ratingStats.reduce((sum, item) => sum + item.count, 0)).toFixed(1)
                  : "—"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                / 5 sao
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Phân loại ý kiến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryStats}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ _id, count }) => `${categoryLabels[_id as keyof typeof categoryLabels] || _id}: ${count}`}
                    >
                      {stats.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái ý kiến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.statusStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Quản lý ý kiến đóng góp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, tiêu đề..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(value) => { setPriorityFilter(value); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ưu tiên</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.feedbacks.map((feedback) => (
                  <TableRow key={feedback._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{feedback.name}</p>
                        <p className="text-sm text-muted-foreground">{feedback.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryLabels[feedback.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[feedback.status]}>
                        {statusLabels[feedback.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[feedback.priority]}>
                        {priorityLabels[feedback.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingFeedback(feedback)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Sửa
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <form action={handleUpdateFeedback}>
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa Feedback</DialogTitle>
                                <DialogDescription>
                                  Cập nhật trạng thái và ghi chú
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="status">Trạng thái</Label>
                                    <Select name="status" defaultValue={feedback.status}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(statusLabels).map(([key, label]) => (
                                          <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="priority">Ưu tiên</Label>
                                    <Select name="priority" defaultValue={feedback.priority}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.entries(priorityLabels).map(([key, label]) => (
                                          <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="adminNotes">Ghi chú admin</Label>
                                  <Textarea
                                    id="adminNotes"
                                    name="adminNotes"
                                    defaultValue={feedback.adminNotes}
                                    placeholder="Ghi chú nội bộ..."
                                    rows={3}
                                  />
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                  <h4 className="font-medium mb-2">Nội dung feedback:</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    <strong>Tiêu đề:</strong> {feedback.subject}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Nội dung:</strong> {feedback.message}
                                  </p>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingFeedback(null)}>
                                  Hủy
                                </Button>
                                <Button type="submit" disabled={updateFeedbackMutation.isPending}>
                                  {updateFeedbackMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {!feedback.thankYouSent ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setThankYouFeedback(feedback)}
                              >
                                <Heart className="h-3 w-3 mr-1" />
                                Cảm ơn
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <form action={handleSendThankYou}>
                                <DialogHeader>
                                  <DialogTitle>Gửi lời cảm ơn</DialogTitle>
                                  <DialogDescription>
                                    Gửi lời cảm ơn đến {feedback.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <Label htmlFor="thankYouMessage">Lời cảm ơn</Label>
                                    <Textarea
                                      id="thankYouMessage"
                                      name="thankYouMessage"
                                      placeholder="Viết lời cảm ơn..."
                                      rows={4}
                                      required
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setThankYouFeedback(null)}>
                                    Hủy
                                  </Button>
                                  <Button type="submit" disabled={sendThankYouMutation.isPending}>
                                    {sendThankYouMutation.isPending ? "Đang gửi..." : "Gửi cảm ơn"}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Đã gửi lời cảm ơn
                          </div>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setDeleteFeedback(feedback)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Xóa
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                              <DialogDescription>
                                Bạn có chắc chắn muốn xóa feedback từ &quot;{feedback.name}&quot;? 
                                Hành động này không thể hoàn tác.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteFeedback(null)}>
                                Hủy
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteFeedbackMutation.mutate(feedback._id)}
                                disabled={deleteFeedbackMutation.isPending}
                              >
                                {deleteFeedbackMutation.isPending ? "Đang xóa..." : "Xóa"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Hiển thị {((data.pagination.page - 1) * data.pagination.limit) + 1} - {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} trong {data.pagination.total} feedback
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={data.pagination.page === 1}
                >
                  Trước
                </Button>
                <span className="text-sm">
                  {data.pagination.page} / {data.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                  disabled={data.pagination.page === data.pagination.pages}
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
