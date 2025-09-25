const TOKEN_KEY = "auth_token";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    // also mirror into cookie for middleware routing
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `token=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = "token=; Max-Age=0; path=/; SameSite=Lax";
  }
}


