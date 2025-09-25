export interface ApiUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  isVerified?: boolean;
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

// Links
export interface ApiLink {
  slug: string;
  destination: string;
  clicks: number;
  createdAt: string;
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

export async function apiAnalyticsSummary(token: string, params: { slug?: string; days?: number; granularity?: "hour" | "day" | "month" | "year" }) {
  const query = new URLSearchParams();
  if (params.slug) query.set("slug", params.slug);
  if (params.days) query.set("days", String(params.days));
  if (params.granularity) query.set("granularity", params.granularity);
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


