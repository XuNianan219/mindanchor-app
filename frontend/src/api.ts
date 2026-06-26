/**
 * 数据访问层：前端直连 Supabase
 * - 账号：用 Supabase 自带的 Auth（不再手写认证、不再连自己的后端）
 * - 数据：用 supabase-js 直接读写 Supabase 数据库
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { User } from '@supabase/supabase-js';

export { isSupabaseConfigured };

// 前端用到的用户信息结构（从 Supabase 用户对象里挑需要的字段）
export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
}

// 把 Supabase 的原始用户对象，转成前端用的简洁结构
function mapUser(u: User | null | undefined): AuthUser | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? '',
    // 昵称存在用户的 metadata 里
    nickname: (u.user_metadata?.nickname as string) ?? null,
  };
}

// 未配置 Supabase 时的统一报错
function ensureClient() {
  if (!supabase) {
    throw new Error('尚未配置 Supabase，请先在 frontend/.env.local 填入网址和公钥');
  }
  return supabase;
}

// ---------- 账号（Supabase Auth）----------

// 注册：用邮箱+密码，昵称存进 metadata
export async function register(
  email: string,
  password: string,
  nickname?: string,
): Promise<AuthUser> {
  const client = ensureClient();
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: { nickname: nickname || null } },
  });
  if (error) throw new Error(error.message);

  // 如果项目开启了"邮箱确认"，注册后不会立刻有登录态
  if (!data.session) {
    throw new Error(
      '注册成功，请到邮箱点击确认链接后再登录（或在 Supabase 后台关闭邮箱确认）',
    );
  }
  return mapUser(data.user)!;
}

// 登录：邮箱+密码
export async function login(email: string, password: string): Promise<AuthUser> {
  const client = ensureClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return mapUser(data.user)!;
}

// 退出登录
export async function logout(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// 获取当前登录用户（没登录或没配置则返回 null，不报错）
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return mapUser(data.user);
}

// 订阅登录状态变化（登录/退出时自动回调），返回取消订阅的函数
export function onAuthChange(cb: (user: AuthUser | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(mapUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}

// ---------- 睡眠记录（直接读写 Supabase 数据库表 sleep_records）----------
// 注意：这些函数已就绪，但前端 UI 目前还没调用它们（保持原功能不变）。
// 需要它们生效，先在 Supabase 里建好 sleep_records 表（见最终说明里的建表 SQL）。

export interface SleepRecord {
  id: string;
  duration_minutes: number;
  completed: boolean;
  note: string | null;
  created_at: string;
}

// 新增一条睡眠记录（user_id 由数据库默认值 auth.uid() 自动填）
export async function addSleepRecord(input: {
  durationMinutes: number;
  completed?: boolean;
  note?: string;
}): Promise<SleepRecord> {
  const client = ensureClient();
  const { data, error } = await client
    .from('sleep_records')
    .insert({
      duration_minutes: input.durationMinutes,
      completed: input.completed ?? false,
      note: input.note ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as SleepRecord;
}

// 查询自己的睡眠记录（RLS 保证只看到自己的）
export async function listSleepRecords(): Promise<SleepRecord[]> {
  const client = ensureClient();
  const { data, error } = await client
    .from('sleep_records')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as SleepRecord[];
}

// 删除一条睡眠记录
export async function deleteSleepRecord(id: string): Promise<void> {
  const client = ensureClient();
  const { error } = await client.from('sleep_records').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
