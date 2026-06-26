/**
 * 登录 / 注册 弹窗组件
 * 自包含：自己管表单状态、调 api、显示错误。
 * 已登录时显示当前账号 + 退出登录按钮。
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User } from 'lucide-react';
import { login, register, logout, type AuthUser } from './api';

interface AuthModalProps {
  open: boolean;
  user: AuthUser | null;
  onClose: () => void;
  onAuthed: (user: AuthUser) => void; // 登录/注册成功
  onLogout: () => void; // 退出登录
}

export function AuthModal({ open, user, onClose, onAuthed, onLogout }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setAccount('');
    setPassword('');
    setNickname('');
    setError('');
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    if (!account || !password) {
      setError('账号和密码不能为空');
      return;
    }
    setLoading(true);
    try {
      const u =
        mode === 'login'
          ? await login(account, password)
          : await register(account, password, nickname || undefined);
      reset();
      onAuthed(u);
    } catch (e: any) {
      setError(e.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-bg-deep/80 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass w-full max-w-md p-8 rounded-[40px] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium tracking-tight">
                {user ? '我的账号' : mode === 'login' ? '登录' : '注册'}
              </h3>
              <button onClick={handleClose} className="p-2 text-text-muted hover:text-text-main">
                <X className="w-6 h-6" />
              </button>
            </div>

            {user ? (
              // ===== 已登录状态 =====
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-accent-sage/20 flex items-center justify-center">
                    <User className="w-7 h-7 text-accent-sage" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-text-main truncate">
                      {user.nickname || '未设置昵称'}
                    </div>
                    <div className="text-xs text-text-muted truncate">{user.account}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-accent-rose/10 text-accent-rose font-medium tracking-widest uppercase text-sm border border-accent-rose/20"
                >
                  退出登录
                </button>
              </div>
            ) : (
              // ===== 未登录：登录 / 注册表单 =====
              <div className="space-y-5">
                {/* 登录 / 注册 切换 */}
                <div className="flex bg-bg-card rounded-2xl p-1">
                  {(['login', 'register'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        setError('');
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        mode === m ? 'bg-accent-sage text-bg-deep shadow-sm' : 'text-text-muted'
                      }`}
                    >
                      {m === 'login' ? '登录' : '注册'}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="账号（邮箱或手机号）"
                    className="w-full px-4 py-3 rounded-2xl bg-bg-card border border-accent-rose/10 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-sage/40"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="密码（至少 6 位）"
                    className="w-full px-4 py-3 rounded-2xl bg-bg-card border border-accent-rose/10 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-sage/40"
                  />
                  {mode === 'register' && (
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="昵称（可选）"
                      className="w-full px-4 py-3 rounded-2xl bg-bg-card border border-accent-rose/10 text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-sage/40"
                    />
                  )}
                </div>

                {error && <p className="text-sm text-accent-rose px-1">{error}</p>}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent-sage text-bg-deep font-medium tracking-widest uppercase text-sm disabled:opacity-50"
                >
                  {loading ? '请稍候...' : mode === 'login' ? '登录' : '注册'}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
