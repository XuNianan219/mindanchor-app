/**
 * Supabase 客户端初始化（前端直连）
 * 从环境变量读网址和公钥；没配置时不报错，App 仍能正常显示，
 * 只是登录/数据功能会提示"尚未配置"。
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

// 是否已填好 Supabase 配置
export const isSupabaseConfigured = Boolean(url && anonKey);

// 只有配置齐全时才创建客户端，避免缺值时报错把整个页面搞崩
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
