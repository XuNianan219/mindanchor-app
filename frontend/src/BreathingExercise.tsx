/**
 * 4-6 呼吸法引导组件（React）
 * 功能：呼吸圆动画 + 触觉反馈(haptic) + grounding 引导语 + 柔和收尾。
 * 圆圈与项目其他呼吸圆保持一致：纯 CSS 绘制（border-radius:50% + radial-gradient + box-shadow 柔光）。
 */

import { useEffect, useRef, useState } from 'react';
import './BreathingExercise.css';

/* ============================ 可调参数（集中在此） ============================ */
// —— 呼吸节奏 ——（一个循环 = 吸气 + 呼气，不憋气、不停顿）
const INHALE = 4;            // 吸气秒数
const EXHALE = 6;            // 呼气秒数
const TOTAL_MINUTES = 3;     // 总时长（分钟），约 18 个 10 秒循环
const TOTAL_SECONDS = TOTAL_MINUTES * 60;

// —— 触觉反馈（震动）——
const HAPTIC_ENABLED = true; // 是否在吸/呼转换点轻震
const HAPTIC_MS = 40;        // 震动时长(毫秒)，短促柔和（30–50 推荐）

// —— grounding 引导语 ——（可增删）
const GROUNDING = [
  '你现在是安全的',
  '这一刻会过去的',
  '把注意力放在呼吸上',
  '不用做任何事，只是呼吸',
];
const GROUNDING_INTERVAL = 24; // 每隔多少秒换一句（放慢、不催促）

// —— 柔和收尾 ——
const ENDING_TEXT = '做得很好，慢慢回来';
const ENDING_HOLD = 4;   // 收尾文字停留秒数
const ENDING_FADE = 1.5; // 收尾淡出秒数

// —— 圆圈样式（与项目其他呼吸圆一致，可直接填相同数值）——
const CIRCLE_DIAMETER = 220;                   // 圆圈直径(px)
const CIRCLE_BASE = '#a9b6a0';                 // 圆圈主色（雾绿）
const CIRCLE_LIGHT = '#bcc7b4';                // 圆圈高光色
const CIRCLE_GLOW = 'rgba(169, 182, 160, 0.5)';// 发光色（半透明）
const GLOW_BLUR = 70;                          // 发光模糊半径(px)
const GLOW_SPREAD = 8;                         // 发光扩散(px)
const TEXT_COLOR = '#6b6b6b';                  // 圆圈中心文字颜色
const MIN_SCALE = 0.55;                        // 呼气最小缩放
const MAX_SCALE = 1;                           // 吸气最大缩放
/* ========================================================================== */

export function BreathingExercise({ onFinish }: { onFinish?: () => void }) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [primed, setPrimed] = useState(false);   // 挂载后置 true，开始第一次吸气（从小变大）
  const [groundingIndex, setGroundingIndex] = useState(0);
  const [ended, setEnded] = useState(false);     // 进入收尾
  const [fading, setFading] = useState(false);   // 收尾淡出
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 震动：特性检测 + try-catch，不支持时静默跳过
  const vibrate = () => {
    if (!HAPTIC_ENABLED) return;
    try {
      if ('vibrate' in navigator) navigator.vibrate(HAPTIC_MS);
    } catch {
      /* 不支持则忽略 */
    }
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setPrimed(true)); // 触发第一次吸气放大
    vibrate(); // 开始时轻震一下

    let phaseLocal: 'inhale' | 'exhale' = 'inhale';
    let elapsed = 0;

    // 柔和收尾：停留 → 淡出 → 回调
    const startEnding = () => {
      setEnded(true);
      const hold = setTimeout(() => {
        setFading(true);
        const fade = setTimeout(() => onFinish?.(), ENDING_FADE * 1000);
        timers.current.push(fade);
      }, ENDING_HOLD * 1000);
      timers.current.push(hold);
    };

    // 自调度：到点切换吸/呼，并在转换点震动；总时长到了进入收尾
    const schedulePhase = () => {
      const dur = phaseLocal === 'inhale' ? INHALE : EXHALE;
      const t = setTimeout(() => {
        elapsed += dur;
        if (elapsed >= TOTAL_SECONDS) {
          startEnding();
          return;
        }
        phaseLocal = phaseLocal === 'inhale' ? 'exhale' : 'inhale';
        vibrate();              // 吸↔呼 转换点震动
        setPhase(phaseLocal);
        schedulePhase();
      }, dur * 1000);
      timers.current.push(t);
    };
    schedulePhase();

    // grounding 引导语缓慢轮换
    const g = setInterval(() => {
      setGroundingIndex((i) => (i + 1) % GROUNDING.length);
    }, GROUNDING_INTERVAL * 1000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(g);
      timers.current.forEach(clearTimeout);
      timers.current = [];
      try { (navigator as Navigator).vibrate?.(0); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 圆圈缩放：未开始时停在最小；吸气→最大、呼气→最小
  const scale = !primed ? MIN_SCALE : phase === 'inhale' ? MAX_SCALE : MIN_SCALE;
  const transitionDur = phase === 'inhale' ? INHALE : EXHALE;

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 w-full"
      style={{ opacity: fading ? 0 : 1, transition: `opacity ${ENDING_FADE}s ease` }}
    >
      {!ended ? (
        <>
          {/* 呼吸圆 + 中心阶段文字 */}
          <div
            className="relative flex items-center justify-center"
            style={{ width: CIRCLE_DIAMETER, height: CIRCLE_DIAMETER }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `radial-gradient(circle at 50% 42%, ${CIRCLE_LIGHT}, ${CIRCLE_BASE})`,
                boxShadow: `0 0 ${GLOW_BLUR}px ${GLOW_SPREAD}px ${CIRCLE_GLOW}`,
                transform: `scale(${scale})`,
                transition: `transform ${transitionDur}s ease-in-out`,
                willChange: 'transform',
              }}
            />
            <span
              key={phase}
              className="bx-fade relative z-10 text-lg tracking-[0.3em] font-light"
              style={{ color: TEXT_COLOR }}
            >
              {phase === 'inhale' ? '吸气' : '呼气'}
            </span>
          </div>

          {/* grounding 引导语（圆圈下方，不遮挡圆圈） */}
          <p
            key={groundingIndex}
            className="bx-fade text-sm sm:text-base text-text-muted tracking-wide px-6 text-center"
          >
            {GROUNDING[groundingIndex]}
          </p>
        </>
      ) : (
        // 柔和收尾画面
        <p className="bx-fade text-xl sm:text-2xl font-light text-accent-rose tracking-wide text-center px-6">
          {ENDING_TEXT}
        </p>
      )}
    </div>
  );
}
