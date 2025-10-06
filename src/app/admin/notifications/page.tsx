"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/lib/auth";
import { apiAdminUsersForNotification, apiAdminSendNotification } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Bell, 
  Send, 
  Users, 
  Globe,
  UserCheck
} from "lucide-react";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(true);
  const token = getToken();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["admin-users-for-notification"],
    queryFn: () => apiAdminUsersForNotification(token!),
    enabled: !!token,
  });

  const sendNotificationMutation = useMutation({
    mutationFn: (payload: { title: string; message: string; targetUsers?: string[] | "all" }) => 
      apiAdminSendNotification(token!, payload),
    onSuccess: () => {
      setTitle("");
      setMessage("");
      setTargetUsers([]);
      setSendToAll(true);
      toast.success("Gửi thông báo thành công");
    },
    onError: (err: any) => toast.error(err.message || "Gửi thông báo thất bại"),
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    sendNotificationMutation.mutate({
      title: title.trim(),
      message: message.trim(),
      targetUsers: sendToAll ? "all" : targetUsers
    });
  };

  const handleUserToggle = (userId: string) => {
    if (targetUsers.includes(userId)) {
      setTargetUsers(prev => prev.filter(id => id !== userId));
    } else {
      setTargetUsers(prev => [...prev, userId]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
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
            <Bell className="h-5 w-5" />
            Gửi thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendNotification} className="space-y-6">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề thông báo"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Nội dung</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nội dung thông báo"
                rows={4}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendToAll"
                  checked={sendToAll}
                  onCheckedChange={(checked) => {
                    setSendToAll(checked as boolean);
                    if (checked) setTargetUsers([]);
                  }}
                />
                <Label htmlFor="sendToAll" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Gửi cho tất cả users
                </Label>
              </div>

              {!sendToAll && (
                <div className="space-y-3">
                  <Label>Chọn users cụ thể</Label>
                  <div className="max-h-60 overflow-y-auto border rounded-md p-3 space-y-2">
                    {usersData?.users.map((user) => (
                      <div key={user._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user._id}`}
                          checked={targetUsers.includes(user._id)}
                          onCheckedChange={() => handleUserToggle(user._id)}
                        />
                        <Label htmlFor={`user-${user._id}`} className="flex-1">
                          <div>
                            <p className="font-medium">{user.name || "Chưa có tên"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Đã chọn {targetUsers.length} users
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {sendToAll ? (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Sẽ gửi cho tất cả {usersData?.users.length || 0} users
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Sẽ gửi cho {targetUsers.length} users được chọn
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={sendNotificationMutation.isPending || (!sendToAll && targetUsers.length === 0)}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {sendNotificationMutation.isPending ? "Đang gửi..." : "Gửi thông báo"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Thông báo gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Chức năng xem lịch sử thông báo sẽ được thêm trong phiên bản tiếp theo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
