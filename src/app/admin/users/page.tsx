"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { apiAdminUsers, apiAdminUpdateUser, apiAdminDeleteUser } from "@/lib/api";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck,
  User,
  Mail,
  Calendar,
  Link2,
  MousePointer
} from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const token = getToken();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: () => apiAdminUsers(token!, { page, limit: 20, search }),
    enabled: !!token,
  });

  const updateUserMutation = useMutation({
    mutationFn: (payload: { userId: string; data: any }) => 
      apiAdminUpdateUser(token!, payload.userId, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setEditingUser(null);
      toast.success("Cập nhật user thành công");
    },
    onError: (err: any) => toast.error(err.message || "Cập nhật user thất bại"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiAdminDeleteUser(token!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setDeleteUser(null);
      toast.success("Xóa user thành công");
    },
    onError: (err: any) => toast.error(err.message || "Xóa user thất bại"),
  });

  const handleUpdateUser = (formData: FormData) => {
    if (!editingUser) return;
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const newPassword = formData.get("newPassword") as string;
    const isAdmin = formData.get("isAdmin") === "on";
    const isVerified = formData.get("isVerified") === "on";

    const updateData: any = { name, email, isAdmin, isVerified };
    
    // Chỉ thêm newPassword nếu có giá trị
    if (newPassword && newPassword.trim()) {
      updateData.newPassword = newPassword.trim();
    }

    updateUserMutation.mutate({
      userId: editingUser._id,
      data: updateData
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Quản lý Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thống kê</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name || "Chưa có tên"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.isAdmin && (
                          <Badge variant="destructive" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                          {user.linkCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3 text-muted-foreground" />
                          {user.clickCount}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Sửa
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <form action={handleUpdateUser}>
                              <DialogHeader>
                                <DialogTitle>Chỉnh sửa User</DialogTitle>
                                <DialogDescription>
                                  Cập nhật thông tin user
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="name">Tên</Label>
                                  <Input
                                    id="name"
                                    name="name"
                                    defaultValue={user.name || ""}
                                    placeholder="Tên user"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    placeholder="Email"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="newPassword">Mật khẩu mới (tùy chọn)</Label>
                                  <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    placeholder="Để trống nếu không muốn đổi mật khẩu"
                                  />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Chỉ điền nếu muốn đổi mật khẩu cho user này
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isAdmin"
                                    name="isAdmin"
                                    defaultChecked={user.isAdmin}
                                  />
                                  <Label htmlFor="isAdmin">Admin</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="isVerified"
                                    name="isVerified"
                                    defaultChecked={user.isVerified}
                                  />
                                  <Label htmlFor="isVerified">Verified</Label>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                                  Hủy
                                </Button>
                                <Button type="submit" disabled={updateUserMutation.isPending}>
                                  {updateUserMutation.isPending ? "Đang cập nhật..." : "Cập nhật"}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setDeleteUser(user)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Xóa
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                              <DialogDescription>
                                Bạn có chắc chắn muốn xóa user &quot;{user.name || user.email}&quot;? 
                                Hành động này sẽ xóa tất cả links và dữ liệu liên quan.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteUser(null)}>
                                Hủy
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => deleteUserMutation.mutate(user._id)}
                                disabled={deleteUserMutation.isPending}
                              >
                                {deleteUserMutation.isPending ? "Đang xóa..." : "Xóa"}
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
                Hiển thị {((data.pagination.page - 1) * data.pagination.limit) + 1} - {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} trong {data.pagination.total} users
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
