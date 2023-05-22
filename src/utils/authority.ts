export const TOKEN_KEY = 'pmo-dashboard-token';

// 获取token
export function getToken(): string | null {
  return localStorage ? localStorage.getItem(TOKEN_KEY) : null;
}

// 设置token
export function setToken(token: string | null): void {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}
