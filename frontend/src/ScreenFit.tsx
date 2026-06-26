/**
 * 整屏等比缩放容器（像把一台"手机"摆在一片底色中间）
 * - 内部 App 始终按固定手机宽度(430)布局，内部排版/字号/间距完全不变。
 * - 根据窗口大小，把整块内容等比例缩放，保证永远完整显示、不被裁切。
 * - 缩放后四周多出来的空白，用与内容相同的背景色填满。
 */

import React, { useLayoutEffect, useRef, useState } from 'react';

// 手机设计宽度（内部布局以此为准，等比缩放）
const DESIGN_WIDTH = 430;

export function ScreenFit({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const compute = () => {
      // frame 的自然高度（不受 transform 影响）
      const frameHeight = frame.offsetHeight || 1;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // 取宽、高两个方向里更小的缩放比例，保证整块都能放进窗口；最大不超过 1（不放大失真）
      const next = Math.min(vw / DESIGN_WIDTH, vh / frameHeight, 1);
      setScale(next > 0 ? next : 1);
    };

    compute();

    // 内容高度变化（如切换深浅色）或窗口缩放时，重新计算
    const ro = new ResizeObserver(compute);
    ro.observe(frame);
    window.addEventListener('resize', compute);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-bg-deep overflow-hidden flex items-center justify-center transition-colors duration-700">
      <div
        ref={frameRef}
        style={{
          width: DESIGN_WIDTH,
          transformOrigin: 'center center',
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
