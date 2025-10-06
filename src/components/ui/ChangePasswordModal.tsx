"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToken } from "@/lib/auth";
import { apiChangePassword } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({ open, onOpenChange }: Props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null); setSuccess(null);
    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải từ 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp");
      return;
    }
    const token = getToken();
    if (!token) { setError("Bạn chưa đăng nhập"); return; }
    setLoading(true);
    try {
      const res = await apiChangePassword(token, { currentPassword, newPassword });
      setSuccess(res?.message || "Đổi mật khẩu thành công");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (e: any) {
      setError(e?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <div className="text-sm mb-1">Mật khẩu hiện tại</div>
            <Input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
          </div>
          <div>
            <div className="text-sm mb-1">Mật khẩu mới</div>
            <Input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
          </div>
          <div>
            <div className="text-sm mb-1">Xác nhận mật khẩu mới</div>
            <Input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          {success && <div className="text-sm text-green-600">{success}</div>}
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="ghost" onClick={()=>onOpenChange(false)}>Đóng</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Đang lưu..." : "Cập nhật"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;


