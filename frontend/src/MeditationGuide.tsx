/**
 * 冥想引导（Step 2 内容）：播放语音 mp3，字幕跟随语音逐句同步显示。
 * 字幕柔和淡入淡出；可循环。可调参数集中在文件顶部。
 */

import { useEffect, useRef, useState } from 'react';

/* ===================== 可调参数（集中在此） ===================== */
const AUDIO_SRC = '/meditation.mp3'; // 冥想音频：把 mp3 放到 frontend/public/ 下，文件名对应即可
const LOOP = true;                   // true=播完自动从头循环；false=播完即停
const FADE_MS = 600;                 // 字幕淡入淡出时长(毫秒)

// 字幕时间轴：time=该句开始显示的秒数，text=字幕文字（按你的实际字幕替换）
const cues = [
  { time: 0,  text: '现在，请闭上眼睛，让身体放松下来' },
  { time: 9,  text: '想象你正坐在阿尔卑斯山脚下' },
  { time: 18, text: '微风轻轻拂过你的脸庞' },
  { time: 27, text: '深深吸一口气……' },
  { time: 34, text: '再慢慢地吐出来……' },
];
/* ============================================================== */

export function MeditationGuide() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeRef = useRef(-1); // 当前字幕序号
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(0);
  const [playing, setPlaying] = useState(false);

  // 进入 Step 2 时尝试自动播放（从轻触进入时通常允许）
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = LOOP;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    return () => {
      a.pause();
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  // 柔和切换字幕：先淡出 → 换字 → 再淡入
  const showSubtitle = (t: string) => {
    setOpacity(0);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => {
      setText(t);
      setOpacity(t ? 1 : 0);
    }, FADE_MS);
  };

  // 声音念到哪一句，字幕就切到哪一句
  const handleTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    let idx = -1;
    for (let i = 0; i < cues.length; i++) {
      if (a.currentTime >= cues[i].time) idx = i;
      else break;
    }
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      showSubtitle(idx >= 0 ? cues[idx].text : '');
    }
  };

  // 播完即停（LOOP=false 时）
  const handleEnded = () => {
    if (!LOOP) {
      setPlaying(false);
      activeRef.current = -1;
      showSubtitle('');
    }
  };

  // 播放 / 暂停（暂停时音频与字幕都停住）
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* 屏幕中央字幕（柔和淡入淡出） */}
      <p
        className="min-h-[6rem] flex items-center justify-center text-center px-4 max-w-[20rem] text-xl sm:text-2xl font-light leading-relaxed text-accent-rose"
        style={{ opacity, transition: `opacity ${FADE_MS}ms ease` }}
      >
        {text}
      </p>

      {/* 柔和的播放/暂停 */}
      <button
        onClick={toggle}
        className="text-accent-rose/70 hover:text-accent-rose text-xs tracking-[0.4em] transition-colors"
      >
        {playing ? '暂 停' : '播 放'}
      </button>
    </div>
  );
}
