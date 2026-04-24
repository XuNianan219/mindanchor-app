/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Moon, 
  Sun,
  Wind, 
  AlertCircle, 
  Home,
  ChevronLeft, 
  Clock, 
  User, 
  Smartphone,
  Activity,
  ArrowRight,
  X,
  Check,
  Volume2,
  VolumeX,
  Droplets,
  Waves,
  Trees,
  CloudRain
} from 'lucide-react';

// --- Types ---
type AppState = 'home' | 'emergency' | 'sleep' | 'health';


// --- Components ---
const BreathingCircle = ({ durationIn = 4, durationOut = 6 }) => {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => p === 'in' ? 'out' : 'in');
    }, phase === 'in' ? durationIn * 1000 : durationOut * 1000);
    
    return () => clearInterval(interval);
  }, [phase, durationIn, durationOut]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-10">
      <div className="relative flex items-center justify-center">
        {/* Outer Glow */}
        {/* 修复：移除 Y 轴位移，圆形只做原地 scale */}
        <motion.div
          animate={{
            scale: phase === 'in' ? 1.4 : 0.8,
            opacity: phase === 'in' ? 0.3 : 0.1,
            y: 0,
          }}
          transition={{
            duration: phase === 'in' ? durationIn : durationOut,
            ease: "easeInOut",
          }}
          style={{ position: 'absolute', top: '50%', left: '50%', x: '-50%', y: 0 }}
          className="w-[60vw] h-[60vw] max-w-[260px] max-h-[260px] rounded-full bg-accent-sage blur-3xl"
        />
        
        {/* Main Circle */}
        {/* 修复：移除 Y 轴位移，圆形只做原地 scale */}
        <motion.div
          animate={{
            scale: phase === 'in' ? 1.2 : 0.9,
            y: 0,
            backgroundColor: phase === 'in' ? 'rgba(163, 177, 138, 0.6)' : 'rgba(163, 177, 138, 0.2)',
            borderColor: phase === 'in' ? 'rgba(212, 163, 115, 0.4)' : 'rgba(212, 163, 115, 0.1)',
          }}
          transition={{
            duration: phase === 'in' ? durationIn : durationOut,
            ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for softer feel
          }}
          className="w-[50vw] h-[50vw] max-w-[220px] max-h-[220px] rounded-full border-2 flex items-center justify-center relative z-10"
        >
          <div className="relative flex items-center justify-center">
            {/* Inner Halo - opacity only, no scale jitter */}
            <motion.div
              animate={{
                opacity: phase === 'in' ? [0.2, 0.5, 0.2] : [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: phase === 'in' ? durationIn : durationOut,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-accent-sage/30 blur-xl"
            />

            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{
                duration: phase === 'in' ? durationIn / 2 : durationOut / 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-lg sm:text-xl font-light tracking-[0.2em] text-text-main relative z-20"
            >
              {phase === 'in' ? '吸气' : '呼气'}
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <div className="text-text-muted text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light">
        {phase === 'in' ? `Inhale ${durationIn}s` : `Exhale ${durationOut}s`}
      </div>
    </div>
  );
};

const EmergencyMode = ({ onBack }: { onBack: () => void; key?: string }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "深呼吸", component: <BreathingCircle /> },
    { title: "五感法 (5-4-3-2-1)", content: "说出你看到的5个东西" },
    { title: "五感法", content: "触摸4个你身边的东西" },
    { title: "安全确认", content: "你现在是安全的，只需要呼吸。" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-10 sm:mb-12">
        <button onClick={onBack} className="p-2 text-text-main/60 hover:text-text-main transition-colors">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <motion.h2 
          key={`title-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl font-light tracking-tight text-text-main"
        >
          {steps[step].title}
        </motion.h2>
        <div className="w-12" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 sm:space-y-16">
        
        <div className="min-h-[220px] sm:min-h-[260px] flex items-center justify-center w-full px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full"
            >
              {steps[step].component || (
                <p className="text-base sm:text-lg font-light leading-relaxed text-text-main/80 max-w-[280px] mx-auto">
                  {steps[step].content}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : onBack()}
          className="px-10 sm:px-14 py-3 sm:py-4 rounded-full bg-accent-sage text-bg-deep font-medium tracking-widest soft-shadow active:scale-95 transition-all duration-700 text-sm sm:text-base"
        >
          {step === steps.length - 1 ? "我好多了" : "继续"}
        </button>
      </div>
    </motion.div>
  );
};

const noiseOptions = [
  { id: 'rain', name: '雨声', icon: <CloudRain className="w-4 h-4" />, url: '/audio/rain.mp3' },
  { id: 'waves', name: '海浪', icon: <Waves className="w-4 h-4" />, url: '/audio/waves.mp3' },
  { id: 'forest', name: '森林', icon: <Trees className="w-4 h-4" />, url: '/audio/forest.mp3' },
  { id: 'white', name: '白噪', icon: <Wind className="w-4 h-4" />, url: '/audio/white.mp3' },
];

interface NoiseSelectorProps {
  selectedNoise: string | null;
  isMuted: boolean;
  onSelectNoise: (id: string) => void;
  onToggleMute: () => void;
}

const NoiseSelector = ({ selectedNoise, isMuted, onSelectNoise, onToggleMute }: NoiseSelectorProps) => (
  <div className="flex items-center space-x-4 bg-accent-rose/5 backdrop-blur-md px-4 py-2 rounded-full border border-accent-rose/10 soft-shadow mt-2">
    {noiseOptions.map(noise => (
      <button
        key={noise.id}
        onClick={() => onSelectNoise(noise.id)}
        className={`p-1.5 rounded-full transition-all ${selectedNoise === noise.id && !isMuted ? 'bg-accent-rose text-bg-deep scale-110 shadow-sm' : 'text-accent-rose/40 hover:text-accent-rose/60'}`}
        title={noise.name}
      >
        {noise.icon}
      </button>
    ))}
    <div className="w-px h-3 bg-accent-rose/10 mx-1" />
    <button
      onClick={onToggleMute}
      className={`p-1.5 rounded-full transition-all ${isMuted ? 'text-accent-rose' : 'text-accent-rose/40'}`}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  </div>
);

const SleepMode = ({ onBack }: { onBack: () => void; key?: string }) => {
  const [phase, setPhase] = useState<'selection' | 'preparation' | 'induction' | 'occupation'>('selection');
  const [timer, setTimer] = useState(1800);
  const [totalTime, setTotalTime] = useState(1800);
  const [countdown, setCountdown] = useState(10);
  const [occupationIndex, setOccupationIndex] = useState(0);
  const [selectedNoise, setSelectedNoise] = useState<string | null>('rain');
  const [isMuted, setIsMuted] = useState(false);
  const [isDimming, setIsDimming] = useState(false);
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guidanceStartedRef = useRef(false);

  const timeOptions = [
    { label: '5 min', value: 300 },
    { label: '10 min', value: 600 },
    { label: '20 min', value: 1200 },
    { label: '30 min', value: 1800 },
  ];

  const getInductionDuration = (total: number) => {
    if (total <= 300) return 45;
    if (total <= 600) return 90;
    if (total <= 1200) return 150;
    return 240; // 4 mins for 30 min session
  };

  const inductionDuration = getInductionDuration(totalTime);

  const occupationPrompts = [
    "从 100 开始倒数，每次减 3...",
    "想象一个房间，从门把手的触感开始...",
    "观察你的呼吸，感受空气进入鼻腔的凉意...",
    "想象一片平静的湖面，水波缓缓扩散...",
    "从 100 开始倒数：97... 94... 91...",
    "想象你在云端漫步，每一步都轻盈无声..."
  ];

  // White Noise Audio Control
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    
    if (selectedNoise && !isMuted && phase !== 'selection') {
      const noise = noiseOptions.find(n => n.id === selectedNoise);
      if (noise) {
        audio.src = noise.url;
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [selectedNoise, isMuted, phase]);




  useEffect(() => {
    let interval: any;
    if (phase !== 'selection' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (phase !== 'selection' && timer <= 0) {
      onBack();
    }
    return () => clearInterval(interval);
  }, [timer, onBack, phase]);

  // Phase transitions
  useEffect(() => {
    if (phase === 'preparation') {
      const timeout = setTimeout(() => setPhase('induction'), 6000);
      return () => clearTimeout(timeout);
    }
    if (phase === 'induction') {
      const timeout = setTimeout(() => setPhase('occupation'), inductionDuration * 1000); 
      return () => clearTimeout(timeout);
    }
  }, [phase, inductionDuration]);

  // Step 2 Countdown logic
  useEffect(() => {
    if (phase === 'induction' && countdown > 0) {
      const intervalTime = (inductionDuration / 10) * 1000;
      const timer = setInterval(() => setCountdown(c => c - 1), intervalTime); 
      return () => clearInterval(timer);
    }
  }, [phase, countdown, inductionDuration]);

  // Screen dimming + touch restore — 连贯跨 phase，不在 step 切换时重置亮度
  useEffect(() => {
    if (phase === 'selection') {
      // 退回选择界面：完全重置
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
      setIsDimming(false);
      guidanceStartedRef.current = false;
      return;
    }

    const restoreBrightness = () => {
      setIsDimming(false);
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
      dimTimerRef.current = setTimeout(() => setIsDimming(true), 5000);
    };

    // 只在第一次进入引导时启动倒计时，phase 切换不重置
    if (!guidanceStartedRef.current) {
      guidanceStartedRef.current = true;
      dimTimerRef.current = setTimeout(() => setIsDimming(true), 4000);
    }

    document.addEventListener('pointerdown', restoreBrightness);
    return () => {
      // 仅移除监听，不清 dimTimer，让计时跨 phase 连续运行
      document.removeEventListener('pointerdown', restoreBrightness);
    };
  }, [phase]);

  // Step 3 Occupation rotation
  useEffect(() => {
    if (phase === 'occupation') {
      const intervalTime = Math.max(15000, (totalTime / 60) * 1000);
      const interval = setInterval(() => {
        setOccupationIndex(prev => (prev + 1) % occupationPrompts.length);
      }, intervalTime); 
      return () => clearInterval(interval);
    }
  }, [phase, occupationPrompts.length, totalTime]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: "easeInOut" }}
      className="flex flex-col items-center h-full overflow-hidden font-serif"
    >
      {/* 渐变黑屏 overlay，触屏恢复 */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-40"
        style={{
          opacity: isDimming ? 0.85 : 0,
          transition: isDimming ? 'opacity 12s ease-in' : 'opacity 1.5s ease-out',
        }}
      />

      {/* 修复：引导 step 标题位置对齐 */}
      <div className={`flex-1 w-full flex justify-center ${phase === 'selection' ? 'items-center' : 'items-start pt-12 sm:pt-20'}`}>
      {/* Step 0: Time Selection */}
      <AnimatePresence mode="wait">
        {phase === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-10 sm:space-y-12 px-6"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extralight text-accent-rose tracking-tight">设定入眠时长</h2>
              <p className="text-text-main/60 text-xs sm:text-sm font-light tracking-widest uppercase">Select Duration</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-[280px] mx-auto">
              {timeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTotalTime(opt.value);
                    setTimer(opt.value);
                    setPhase('preparation');
                  }}
                  className="glass py-6 rounded-[24px] flex flex-col items-center justify-center space-y-2 active:scale-95 transition-all border border-accent-rose/5 hover:border-accent-rose/20"
                >
                  <span className="text-lg sm:text-xl font-light text-text-main">{opt.label.split(' ')[0]}</span>
                  <span className="text-[10px] text-text-muted uppercase tracking-tighter">Minutes</span>
                </button>
              ))}
            </div>

            <button 
              onClick={onBack}
              className="text-text-muted/60 text-sm sm:text-base font-light tracking-widest hover:text-text-main transition-colors mt-16"
            >
              取消并返回
            </button>
          </motion.div>
        )}

        {/* Step 1: Screen Dimming & Preparation */}
        {phase === 'preparation' && (
          <motion.div 
            key="prep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="text-center space-y-6 sm:space-y-8"
          >
            {/* 修复：Step 1 标题去除闪烁，与 Step 2/3 行为一致 */}
            <div className="text-accent-rose font-medium text-sm sm:text-base tracking-[0.4em] uppercase">
              Step 1: 准备入睡
            </div>
            <div className="flex justify-center">
              <NoiseSelector selectedNoise={selectedNoise} isMuted={isMuted} onSelectNoise={(id) => { setSelectedNoise(id); setIsMuted(false); }} onToggleMute={() => setIsMuted(m => !m)} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-accent-rose leading-relaxed px-4 drop-shadow-sm">
              请放下手机，<br />
              找一个最舒服的姿势躺好。
            </h2>
            <p className="text-accent-rose font-medium text-sm sm:text-base">屏幕即将变暗，引导即将开始...</p>
          </motion.div>
        )}

        {/* Step 2: Single-thread Guidance (Breathing & Countdown) */}
        {phase === 'induction' && (
          <motion.div
            key="induction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="flex flex-col items-center space-y-6 sm:space-y-8 w-full"
          >
            {/* 总计时移到最顶部 */}
            <p className="text-accent-rose/60 text-xs font-medium tracking-widest">{formatTime(timer)}</p>

            <div className="flex flex-col items-center space-y-4">
              <div className="text-accent-rose font-medium text-sm sm:text-base tracking-[0.4em] uppercase">Step 2: 呼吸与沉降</div>
              <NoiseSelector selectedNoise={selectedNoise} isMuted={isMuted} onSelectNoise={(id) => { setSelectedNoise(id); setIsMuted(false); }} onToggleMute={() => setIsMuted(m => !m)} />
              <div className="flex space-x-1">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="w-0.5 bg-accent-rose/40"
                  />
                ))}
              </div>
            </div>

            {/* 10s 倒计时上移到圆球上方 */}
            <motion.div
              key={countdown}
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="text-5xl sm:text-6xl font-light text-accent-rose/60"
            >
              {countdown > 0 ? countdown : ""}
            </motion.div>

            <div className="relative w-[60vw] h-[60vw] max-w-[260px] max-h-[260px] flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-accent-sage/20 blur-[80px] sm:blur-[100px]"
              />
              <BreathingCircle durationIn={4} durationOut={6} />
            </div>

            <p className="text-white font-medium text-sm sm:text-base tracking-[0.1em] uppercase drop-shadow-sm">跟随圆环，缓慢呼吸</p>
          </motion.div>
        )}

        {/* Step 3: Cognitive Occupation */}
        {phase === 'occupation' && (
          <motion.div 
            key="occupation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="flex flex-col items-center space-y-12 sm:space-y-16 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="text-accent-rose/60 text-sm sm:text-base tracking-[0.4em] uppercase font-medium">Step 3: 认知占用</div>
              <NoiseSelector selectedNoise={selectedNoise} isMuted={isMuted} onSelectNoise={(id) => { setSelectedNoise(id); setIsMuted(false); }} onToggleMute={() => setIsMuted(m => !m)} />
            </div>
            
            <div className="min-h-[100px] sm:min-h-[120px] flex items-center justify-center px-4 sm:px-6">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={occupationIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 3 }}
                  className="text-xl sm:text-2xl font-light text-white leading-relaxed italic max-w-[320px] drop-shadow-sm"
                >
                  "{occupationPrompts[occupationIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.div 
                animate={{ opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-accent-sage/5 blur-2xl"
              />
              <div className="absolute inset-0 flex items-center justify-center text-accent-rose/60 text-xs sm:text-sm tracking-widest font-medium">
                {formatTime(timer)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {phase !== 'selection' && (
        <button
          onClick={onBack}
          className="fixed bottom-6 sm:bottom-10 text-accent-rose font-medium text-sm sm:text-base tracking-[0.5em] uppercase border border-accent-rose/40 px-10 sm:px-12 py-4 rounded-full hover:bg-accent-rose/10 transition-all bg-bg-deep/40 backdrop-blur-md shadow-lg z-50"
        >
          退出引导
        </button>
      )}
    </motion.div>
  );
};

const HealthModule = ({ onBack }: { onBack: () => void; key?: string }) => {
  const [activeSub, setActiveSub] = useState<'list' | 'heart' | 'neck' | 'waist'>('list');
  const [reminderTime, setReminderTime] = useState(60);

  const modules = [
    { id: 'heart', title: '心脏健康', icon: <Heart className="text-accent-rose" />, desc: '压力感知与呼吸调节' },
    { id: 'neck', title: '颈椎维护', icon: <Activity className="text-accent-blue" />, desc: '3个简单动作缓解僵硬' },
    { id: 'waist', title: '腰椎关怀', icon: <Smartphone className="text-accent-sage" />, desc: '久坐提醒与站立引导' },
  ];

  const renderContent = () => {
    switch (activeSub) {
      case 'heart':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 w-full max-w-full">
            <div className="glass p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-accent-rose flex items-center gap-2">
                <Heart className="w-5 h-5" /> 压力感知方法
              </h3>
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  1. <span className="text-text-main font-medium">身体扫描：</span>从头到脚扫描，注意肩膀是否耸起，牙关是否紧咬。
                </p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  2. <span className="text-text-main font-medium">心率察觉：</span>静坐一分钟，感受心跳频率是否比平时更快、更沉重。
                </p>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  3. <span className="text-text-main font-medium">情绪贴标：</span>尝试用一个词描述现在的感受（如“焦虑”、“疲惫”）。
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-accent-rose/5 rounded-2xl border border-accent-rose/10 italic text-[10px] sm:text-xs text-text-main/70">
                “当你意识到压力存在时，它的力量就已经减弱了一半。”
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-base sm:text-lg font-medium text-center">4-6 呼吸调节法</h3>
              <BreathingCircle durationIn={4} durationOut={6} />
              <p className="text-center text-[10px] sm:text-xs text-text-muted px-4 leading-relaxed">
                吸气 4 秒，呼气 6 秒。<br />
                长呼气能有效激活副交感神经，降低心率。
              </p>
            </div>
          </motion.div>
        );
      case 'neck':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 sm:space-y-6 w-full max-w-full">
            <h3 className="text-base sm:text-lg font-medium px-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-blue" /> 颈椎缓解三步曲
            </h3>
            {[
              { 
                title: "1. 左右侧拉伸 (Side Stretch)", 
                desc: "挺胸收腹，头向左倾斜，左手轻压右侧头部，感受右侧颈部拉伸，保持 15 秒，换边重复。",
                tip: "注意：肩膀保持下沉，不要耸肩。"
              },
              { 
                title: "2. 深度收下巴 (Chin Tuck)", 
                desc: "平视前方，水平向后收缩下巴（想象在挤出双下巴），感受颈后部肌肉发力，保持 3 秒，重复 10 次。",
                tip: "注意：不要低头或抬头，保持水平移动。"
              },
              { 
                title: "3. 扩胸绕肩 (Shoulder Rolls)", 
                desc: "双手自然下垂，双肩由前向上、向后、向下做大圆周运动，感受肩胛骨靠拢，重复 15 次。",
                tip: "注意：动作要缓慢，配合深呼吸。"
              }
            ].map((step, i) => (
              <div key={i} className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-2">
                <div className="text-sm sm:text-base font-medium text-accent-blue">{step.title}</div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">{step.desc}</p>
                <div className="text-[9px] sm:text-[10px] text-accent-blue/60 font-light italic">{step.tip}</div>
              </div>
            ))}
          </motion.div>
        );
      case 'waist':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8 w-full max-w-full">
            <div className="glass p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent-sage" />
                  <h3 className="text-base sm:text-lg font-medium">久坐提醒设置</h3>
                </div>
                <div className="w-10 h-5 sm:w-12 sm:h-6 bg-accent-sage/40 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full soft-shadow" />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] sm:text-xs text-text-muted">提醒间隔 (分钟) - 建议每 45 分钟站立一次</p>
                <div className="flex justify-between items-center gap-2">
                  {[30, 45, 60, 90].map(time => (
                    <button 
                      key={time}
                      onClick={() => setReminderTime(time)}
                      className={`flex-1 py-2 rounded-xl text-[10px] sm:text-xs transition-all ${reminderTime === time ? 'bg-accent-sage text-white shadow-sm' : 'bg-white/40 text-text-muted hover:bg-white/60'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-medium px-1 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-accent-sage" /> 站立与转腰引导
              </h3>
              <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-accent-sage/20 flex items-center justify-center text-accent-sage font-bold text-[10px] sm:text-xs">1</div>
                  <div className="text-sm sm:text-base font-medium">站立重置 (Standing Reset)</div>
                </div>
                <p className="text-xs sm:text-sm text-text-muted pl-10 sm:pl-11 leading-relaxed">
                  完全离开座椅，双脚与肩同宽。双手叉腰，向后微仰，深呼吸 3 次，感受腹部和腰部的拉伸。
                </p>
              </div>
              <div className="glass p-4 sm:p-5 rounded-2xl sm:rounded-3xl space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 sm:w-8 h-8 rounded-full bg-accent-sage/20 flex items-center justify-center text-accent-sage font-bold text-[10px] sm:text-xs">2</div>
                  <div className="text-sm sm:text-base font-medium">水平转腰 (Waist Rotation)</div>
                </div>
                <p className="text-xs sm:text-sm text-text-muted pl-10 sm:pl-11 leading-relaxed">
                  保持下半身不动，双手自然垂下或平举。缓缓向左转动上半身到极限，停留 2 秒，再缓缓转向右侧。重复 10 组。
                </p>
                <div className="text-[9px] sm:text-[10px] text-accent-sage/60 font-light italic pl-10 sm:pl-11">
                  注意：动作要柔和，不要猛烈发力，视线随身体转动。
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="space-y-4 sm:space-y-5 w-full max-w-full">
            {modules.map((m, idx) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 + 0.2 }}
                onClick={() => setActiveSub(m.id as any)}
                className="glass p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] flex items-center space-x-4 sm:space-x-5 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/40 flex items-center justify-center soft-shadow shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-text-main text-sm sm:text-base truncate">{m.title}</h3>
                  <p className="text-[10px] sm:text-xs text-text-muted mt-1 line-clamp-1">{m.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 h-5 text-text-muted/50 shrink-0" />
              </motion.div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      className="flex flex-col h-full overflow-y-auto overflow-x-hidden w-full max-w-full no-scrollbar"
    >
      <div className="flex items-center justify-between mb-10 sm:mb-12">
        <button 
          onClick={() => activeSub === 'list' ? onBack() : setActiveSub('list')} 
          className="p-2 text-text-main/60 hover:text-text-main transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <h2 className="text-xl sm:text-2xl font-light tracking-tight text-text-main">
          {activeSub === 'list' ? '放松时刻' : modules.find(m => m.id === activeSub)?.title}
        </h2>
        <div className="w-12" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSub}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [antiLateNightEnabled, setAntiLateNightEnabled] = useState(false);
  const [blacklistApps, setBlacklistApps] = useState<string[]>(['抖音', '小红书', '王者荣耀', '微博']);
  const [showBlacklist, setShowBlacklist] = useState(false);

  const isWithinLateNightWindow = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 23 || hours < 6;
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-bg-deep text-text-main font-sans selection:bg-accent-sage/20 overflow-x-hidden transition-colors duration-700 p-6 sm:p-8 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center space-y-4 sm:space-y-6 pb-5">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight leading-tight flex-1">
              你好，<br />
              <span className="text-accent-rose font-light">现在感觉如何？</span>
            </h1>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-bg-card flex items-center justify-center soft-shadow border border-accent-rose/10 hover:border-accent-rose/30 transition-all shrink-0"
            >
              {isDarkMode ? <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-accent-rose" /> : <Sun className="w-6 h-6 sm:w-7 sm:h-7 text-accent-rose" />}
            </button>
          </div>
          <p className="text-text-muted font-light tracking-wide text-sm sm:text-base">让心跳慢下来，让思绪停靠。</p>
        </motion.section>

        {/* SOS Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setState('emergency')}
          className="w-full py-6 sm:py-8 rounded-[40px] sm:rounded-[48px] bg-bg-card text-text-main flex flex-col items-center justify-center space-y-3 soft-shadow transition-all duration-700 border border-accent-rose/10"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent-rose/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 sm:w-8 h-8 text-accent-rose" />
          </div>
          <span className="text-base sm:text-lg font-light tracking-[0.2em]">我现在很难受</span>
        </motion.button>

        {/* Grid Modules */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 mt-10 sm:mt-12">
          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => setState('sleep')}
            className="glass p-4 sm:p-5 rounded-[32px] sm:rounded-[40px] flex flex-col items-start space-y-4 sm:space-y-5 aspect-square transition-all duration-500"
          >
            <div className="p-3 sm:p-4 bg-accent-blue/20 rounded-xl sm:rounded-2xl">
              <Moon className="text-accent-blue w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <div className="font-medium tracking-tight text-sm sm:text-base">放下手机</div>
              <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 uppercase tracking-wider">Put Down Phone</div>
            </div>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.96 }}
            onClick={() => setState('health')}
            className="glass p-4 sm:p-5 rounded-[32px] sm:rounded-[40px] flex flex-col items-start space-y-4 sm:space-y-5 aspect-square transition-all duration-500"
          >
            <div className="p-3 sm:p-4 bg-accent-sage/20 rounded-xl sm:rounded-2xl">
              <Activity className="text-accent-sage w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <div className="font-medium tracking-tight text-sm sm:text-base">放松时刻</div>
              <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 uppercase tracking-wider">Relaxation Time</div>
            </div>
          </motion.button>
        </div>

        {/* Night System Status */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass p-4 sm:p-5 rounded-[32px] sm:rounded-[40px] flex items-center justify-between cursor-pointer mt-10 sm:mt-12"
          onClick={() => setShowBlacklist(true)}
        >
          <div className="flex items-center space-x-4 sm:space-x-5">
            <div className="p-3 sm:p-4 bg-accent-rose/10 rounded-xl sm:rounded-2xl">
              <Smartphone className="text-accent-rose w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <div className="font-medium text-xs sm:text-sm">防熬夜系统</div>
                {antiLateNightEnabled && isWithinLateNightWindow() && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-1.5 py-0.5 rounded-full bg-accent-rose/20 text-accent-rose text-[8px] tracking-tighter uppercase font-bold"
                  >
                    Active
                  </motion.div>
                )}
              </div>
              <div className="text-[9px] sm:text-[10px] text-text-muted mt-1 tracking-widest uppercase">Window: 23:00 - 06:00</div>
            </div>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setAntiLateNightEnabled(!antiLateNightEnabled);
            }}
            className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full relative transition-colors duration-300 ${antiLateNightEnabled ? 'bg-accent-sage/40' : 'bg-text-muted/20'}`}
          >
            <motion.div 
              animate={{ x: antiLateNightEnabled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute left-1 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full soft-shadow ${antiLateNightEnabled ? 'bg-accent-sage' : 'bg-text-muted'}`} 
            />
          </div>
        </motion.div>
      </main>

      {/* Blacklist Modal */}
      <AnimatePresence>
        {showBlacklist && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg-deep/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass w-full max-w-md p-8 rounded-[40px] space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium tracking-tight">黑名单应用</h3>
                <button onClick={() => setShowBlacklist(false)} className="p-2 text-text-muted hover:text-text-main">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  开启防熬夜系统后，在 23:00 - 06:00 期间，系统将通过“屏幕使用时间”限制以下应用的访问。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['抖音', '小红书', '王者荣耀', '微博', 'Bilibili', '知乎', '淘宝', '京东'].map(app => (
                    <button
                      key={app}
                      onClick={() => {
                        if (blacklistApps.includes(app)) {
                          setBlacklistApps(blacklistApps.filter(a => a !== app));
                        } else {
                          setBlacklistApps([...blacklistApps, app]);
                        }
                      }}
                      className={`p-4 rounded-2xl border text-sm transition-all flex items-center justify-between ${
                        blacklistApps.includes(app) 
                          ? 'bg-accent-sage/10 border-accent-sage text-accent-sage' 
                          : 'bg-bg-card border-accent-rose/10 text-text-muted'
                      }`}
                    >
                      {app}
                      {blacklistApps.includes(app) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setShowBlacklist(false)}
                className="w-full py-4 rounded-2xl bg-accent-sage text-bg-deep font-medium tracking-widest uppercase text-sm"
              >
                保存设置
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === 'emergency' && (
          <div className="fixed inset-0 z-50 bg-bg-deep p-6 sm:p-8 overflow-x-hidden">
            <div className="max-w-md mx-auto h-full">
              <EmergencyMode onBack={() => setState('home')} />
            </div>
          </div>
        )}
        {state === 'sleep' && (
          <div className="fixed inset-0 z-50 bg-bg-deep p-6 sm:p-8 overflow-x-hidden">
            <div className="max-w-md mx-auto h-full">
              <SleepMode onBack={() => setState('home')} />
            </div>
          </div>
        )}
        {state === 'health' && (
          <div className="fixed inset-0 z-50 bg-bg-deep p-6 sm:p-8 overflow-x-hidden">
            <div className="max-w-md mx-auto h-full">
              <HealthModule onBack={() => setState('home')} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
