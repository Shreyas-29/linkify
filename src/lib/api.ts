export interface ApiUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  isAdmin?: boolean;
}

export interface AuthResponse {
  token: string;
  user: ApiUser;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

function getBaseUrl(): string {
  if (!BASE_URL) {
    throw new Error("Thiếu biến môi trường NEXT_PUBLIC_API_BASE_URL");
  }
  return BASE_URL.replace(/\/$/, "");
}

export async function apiRegister(payload: { email: string; password: string; name?: string; }): Promise<AuthResponse> {
  const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Đăng ký thất bại (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiLogin(payload: { email: string; password: string; }): Promise<AuthResponse> {
  const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Đăng nhập thất bại (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiForgotPassword(email: string): Promise<{ message: string; token?: string; expiresAt?: string }>{
  const res = await fetch(`${getBaseUrl()}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Yêu cầu quên mật khẩu thất bại (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiResetPassword(payload: { token: string; password: string }): Promise<{ message: string }>{
  const res = await fetch(`${getBaseUrl()}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Đặt lại mật khẩu thất bại (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiMe(token: string): Promise<{ user: ApiUser }>{
  const res = await fetch(`${getBaseUrl()}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Lấy thông tin người dùng thất bại (${res.status})`;
    throw new Error(msg);
  }
  return res.json();
}

export async function apiChangePassword(token: string, payload: { currentPassword: string; newPassword: string }): Promise<{ message: string }>{
  const res = await fetch(`${getBaseUrl()}/api/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Đổi mật khẩu thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { message: string };
}

// Links
export interface ApiLink {
  slug: string;
  destination: string;
  clicks: number;
  createdAt: string;
  active?: boolean;
  isActive?: boolean;
  expiresAt?: string | null;
  passwordHash?: string;
  password?: string;
}

export async function apiCreateLink(token: string, payload: { destination: string; slug?: string; password?: string; expiresAt?: string }) {
  const res = await fetch(`${getBaseUrl()}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Tạo link thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { link: ApiLink };
}

export async function apiListLinks(token: string) {
  const res = await fetch(`${getBaseUrl()}/api/links`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Lấy danh sách link thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { links: ApiLink[] };
}

export async function apiUpdateLink(
  token: string,
  slug: string,
  payload: { destination?: string; active?: boolean; isActive?: boolean; password?: string; expiresAt?: string }
) {
  const res = await fetch(`${getBaseUrl()}/api/links/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      ...payload,
      // Chuẩn hóa tên field cho backend
      isActive: typeof payload.isActive === "boolean" ? payload.isActive : (typeof payload.active === "boolean" ? payload.active : undefined),
    }),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Cập nhật link thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { link: ApiLink };
}

export async function apiDeleteLink(token: string, slug: string) {
  const res = await fetch(`${getBaseUrl()}/api/links/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as any));
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Xóa link thất bại (${res.status})`;
    throw new Error(msg);
  }
  return { success: true } as const;
}

export async function apiAnalyticsSummary(token: string, params: { slug?: string; days?: number; granularity?: "hour" | "day" | "month" | "year"; devices?: string[] }) {
  const query = new URLSearchParams();
  if (params.slug) query.set("slug", params.slug);
  if (params.days) query.set("days", String(params.days));
  if (params.granularity) query.set("granularity", params.granularity);
  if (params.devices && params.devices.length) query.set("devices", params.devices.join(","));
  const res = await fetch(`${getBaseUrl()}/api/links/analytics/summary?${query.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Lấy analytics thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { clicksOverTime: { label: string; value: number }[]; devices: any[]; countries: any[]; referrers: any[]; totals: any };
}

// Notifications
export async function apiListNotifications(token: string): Promise<{ notifications: Array<{ id: string; title: string; message?: string; type?: string; createdAt: string; readAt?: string | null }> }>{
  const res = await fetch(`${getBaseUrl()}/api/notifications`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Lấy thông báo thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiReadAllNotifications(token: string): Promise<{ success: boolean }>{
  const res = await fetch(`${getBaseUrl()}/api/notifications/read-all`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const validationMsg = Array.isArray((data as any)?.errors) && (data as any).errors[0]?.msg;
    const msg = validationMsg || (data as any)?.message || `Cập nhật thông báo thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as { success: boolean };
}

// Admin APIs
export interface AdminStats {
  overview: {
    totalUsers: number;
    totalLinks: number;
    totalClicks: number;
    activeUsers: number;
    adminUsers: number;
    newUsers: number;
    newLinks: number;
    newClicks: number;
  };
  topUsers: Array<{
    _id: string;
    name?: string;
    email: string;
    linkCount: number;
    createdAt: string;
  }>;
  dailyStats: {
    users: Array<{ _id: string; users: number }>;
    links: Array<{ _id: string; links: number }>;
    clicks: Array<{ _id: string; clicks: number }>;
  };
}

export interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  linkCount: number;
  clickCount: number;
}

export async function apiAdminStats(token: string): Promise<AdminStats> {
  const res = await fetch(`${getBaseUrl()}/api/admin/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Lấy thống kê admin thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as AdminStats;
}

export async function apiAdminUsers(token: string, params: { page?: number; limit?: number; search?: string } = {}): Promise<{ users: AdminUser[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  
  const res = await fetch(`${getBaseUrl()}/api/admin/users?${query.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Lấy danh sách users thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminUpdateUser(token: string, userId: string, payload: { name?: string; email?: string; isAdmin?: boolean; isVerified?: boolean; newPassword?: string }): Promise<{ user: AdminUser }> {
  const res = await fetch(`${getBaseUrl()}/api/admin/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Cập nhật user thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminDeleteUser(token: string, userId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getBaseUrl()}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Xóa user thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminSendNotification(token: string, payload: { title: string; message: string; targetUsers?: string[] | "all" }): Promise<{ success: boolean }> {
  const res = await fetch(`${getBaseUrl()}/api/admin/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Gửi thông báo thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminUsersForNotification(token: string): Promise<{ users: Array<{ _id: string; name?: string; email: string }> }> {
  const res = await fetch(`${getBaseUrl()}/api/admin/users-for-notification`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Lấy danh sách users cho thông báo thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

// Feedback APIs
export interface Feedback {
  _id: string;
  name: string;
  email: string;
  rating: number;
  category: 'ui_ux' | 'performance' | 'feature' | 'bug' | 'suggestion' | 'other';
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  adminNotes: string;
  thankYouMessage: string;
  thankYouSent: boolean;
  thankYouSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackStats {
  overview: {
    totalFeedbacks: number;
    recentFeedbacks: number;
    unthankedCount: number;
  };
  statusStats: Array<{ _id: string; count: number }>;
  categoryStats: Array<{ _id: string; count: number }>;
  priorityStats: Array<{ _id: string; count: number }>;
  ratingStats: Array<{ _id: number; count: number }>;
  dailyStats: Array<{ _id: string; count: number }>;
}

export async function apiCreateFeedback(payload: { 
  name: string; 
  email: string; 
  rating: number; 
  category: string; 
  subject: string; 
  message: string; 
}): Promise<{ success: boolean; message: string; feedback: Feedback }> {
  const res = await fetch(`${getBaseUrl()}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Gửi feedback thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminFeedbacks(token: string, params: { 
  page?: number; 
  limit?: number; 
  search?: string; 
  status?: string; 
  category?: string; 
  priority?: string; 
} = {}): Promise<{ feedbacks: Feedback[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.category) query.set("category", params.category);
  if (params.priority) query.set("priority", params.priority);
  
  const res = await fetch(`${getBaseUrl()}/api/feedback/admin?${query.toString()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Lấy danh sách feedback thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminFeedbackStats(token: string): Promise<FeedbackStats> {
  const res = await fetch(`${getBaseUrl()}/api/feedback/admin/stats`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Lấy thống kê feedback thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data as FeedbackStats;
}

export async function apiAdminUpdateFeedback(token: string, feedbackId: string, payload: { 
  status?: string; 
  priority?: string; 
  adminNotes?: string; 
  thankYouMessage?: string; 
}): Promise<{ feedback: Feedback }> {
  const res = await fetch(`${getBaseUrl()}/api/feedback/admin/${feedbackId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Cập nhật feedback thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminSendThankYou(token: string, feedbackId: string, payload: { thankYouMessage: string }): Promise<{ success: boolean; message: string; feedback: Feedback }> {
  const res = await fetch(`${getBaseUrl()}/api/feedback/admin/${feedbackId}/thank`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Gửi lời cảm ơn thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export async function apiAdminDeleteFeedback(token: string, feedbackId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${getBaseUrl()}/api/feedback/admin/${feedbackId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data as any)?.message || `Xóa feedback thất bại (${res.status})`;
    throw new Error(msg);
  }
  return data;
}


