/**
 * 后端 API 调用封装 + 登录 token 的本地保存
 * 前端各处只从这里调后端，统一管理地址、请求头和错误。
 */

// 后端地址：默认本地 4000 端口；如需改，可在 frontend 下建 .env 写 VITE_API_BASE_URL
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';

// token 存在 localStorage 里，刷新页面也不会丢
const TOKEN_KEY = 'mindanchor_token';

export interface AuthUser {
  id: string;
  account: string;
  nickname: string | null;
  createdAt: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// 统一的请求函数：自动带上 JSON 头和（如有）token，并统一处理错误
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 后端正常情况下都返回 JSON
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // 把后端给的中文错误信息抛出去，组件里能直接显示
    throw new Error((data as any).error || '请求失败，请稍后再试');
  }
  return data as T;
}

// ---------- 账号相关 ----------

// 注册：成功后自动保存 token，返回用户信息
export async function register(
  account: string,
  password: string,
  nickname?: string,
): Promise<AuthUser> {
  const data = await request<{ token: string; user: AuthUser }>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify({ account, password, nickname }),
    },
  );
  setToken(data.token);
  return data.user;
}

// 登录：成功后自动保存 token，返回用户信息
export async function login(
  account: string,
  password: string,
): Promise<AuthUser> {
  const data = await request<{ token: string; user: AuthUser }>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ account, password }),
    },
  );
  setToken(data.token);
  return data.user;
}

// 获取当前登录用户信息（需要已保存 token）
export async function getMe(): Promise<AuthUser> {
  const data = await request<{ user: AuthUser }>('/api/auth/me');
  return data.user;
}

// 退出登录：清掉本地 token
export function logout(): void {
  clearToken();
}
