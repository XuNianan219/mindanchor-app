/**
 * 睡眠记录历史弹窗
 * 打开时从 Supabase 拉取当前用户的睡眠记录，可逐条删除。
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Trash2 } from 'lucide-react';
import { listSleepRecords, deleteSleepRecord, type SleepRecord } from './api';

interface SleepHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function SleepHistoryModal({ open, onClose }: SleepHistoryModalProps) {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 每次打开都重新拉取最新记录
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    listSleepRecords()
      .then(setRecords)
      .catch((e) => setError(e.message || '加载失败'))
      .finally(() => setLoading(false));
  }, [open]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSleepRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      setError(e.message || '删除失败');
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('zh-CN', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-bg-deep/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="glass w-full max-w-md p-8 rounded-[40px] space-y-6 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center shrink-0">
              <h3 className="text-lg font-medium tracking-tight">我的睡眠记录</h3>
              <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar -mx-1 px-1">
              {loading && <p className="text-sm text-text-muted px-1">加载中...</p>}
              {error && <p className="text-sm text-accent-rose px-1 leading-relaxed">{error}</p>}

              {!loading && !error && records.length === 0 && (
                <p className="text-sm text-text-muted px-1 leading-relaxed">
                  还没有睡眠记录。完成一次"放下手机"的助眠引导后，会自动记录一条。
                </p>
              )}

              <div className="space-y-3">
                {records.map((r) => (
                  <div
                    key={r.id}
                    className="glass p-4 rounded-2xl flex items-center justify-between border border-accent-rose/5"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center shrink-0">
                        <Moon className="w-5 h-5 text-accent-blue" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-main">
                          {r.duration_minutes} 分钟
                          <span
                            className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                              r.completed
                                ? 'bg-accent-sage/20 text-accent-sage'
                                : 'bg-text-muted/15 text-text-muted'
                            }`}
                          >
                            {r.completed ? '已完成' : '中途退出'}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 truncate">
                          {formatDate(r.created_at)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 text-text-muted/50 hover:text-accent-rose transition-colors shrink-0"
                      title="删除这条记录"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
