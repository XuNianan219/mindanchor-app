/**
 * 呼吸引导：圆圈跟随呼吸平滑放大/缩小（CSS transition，不抖动），
 * 中心显示阶段文字（吸气/屏息/呼气），圆圈下方显示每一次呼吸的逐秒倒计时。
 * 节奏可通过 phases 传入，默认 4-7-8 呼吸法。
 */

import { useEffect, useRef, useState } from 'react';
import './BreathingGuide.css';

// 每个阶段：name 文字、dur 时长(秒)、scale 该阶段结束时圆圈目标大小（1=最大，MIN=最小）
export interface BreathPhase { name: string; dur: number; scale: number; }

const MIN = 0.55;

// 默认：4-7-8 呼吸法（吸气 4 → 屏息 7 → 呼气 8）
const DEFAULT_PHASES: BreathPhase[] = [
  { name: '吸气', dur: 4, scale: 1 },
  { name: '屏息', dur: 7, scale: 1 },
  { name: '呼气', dur: 8, scale: MIN },
];

export function BreathingGuide({ phases = DEFAULT_PHASES }: { phases?: BreathPhase[] }) {
  const [idx, setIdx] = useState(-1); // -1 = 尚未开始（圆圈停在最小）
  const [count, setCount] = useState(phases[0].dur);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = performance.now();
    const cycle = phases.reduce((s, p) => s + p.dur, 0); // 一个完整循环的总秒数
    // 各阶段的累计时间边界
    const bounds: number[] = [];
    let acc = 0;
    for (const p of phases) { acc += p.dur; bounds.push(acc); }

    let last = -1;
    const id = setInterval(() => {
      const elapsed = ((performance.now() - startRef.current) / 1000) % cycle;
      let i = bounds.findIndex((b) => elapsed < b);
      if (i === -1) i = phases.length - 1;
      const phaseStart = i === 0 ? 0 : bounds[i - 1];
      // 逐秒倒计时
      const remaining = Math.max(1, Math.ceil(phases[i].dur - (elapsed - phaseStart)));
      if (i !== last) { last = i; setIdx(i); }
      setCount(remaining);
    }, 200);
    return () => clearInterval(id);
  }, [phases]);

  const scale = idx < 0 ? MIN : phases[idx].scale;
  const dur = idx < 0 ? 0 : phases[idx].dur;
  const name = phases[idx < 0 ? 0 : idx].name;

  return (
    <div className="breath-wrap" aria-hidden="true">
      <div className="breath-stage">
        <div
          className="breath-circle"
          style={{ transform: `scale(${scale})`, transition: `transform ${dur}s ease-in-out` }}
        />
        <div className="breath-text" key={idx}>{name}</div>
      </div>
      {/* 每一次呼吸的逐秒倒计时 */}
      <div className="breath-count">{count}</div>
    </div>
  );
}
