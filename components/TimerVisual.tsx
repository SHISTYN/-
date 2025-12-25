import React from 'react';
import { BreathingPhase } from '../types';

interface TimerVisualProps {
  phase: BreathingPhase;
  timeLeft: number;
  totalTimeForPhase: number;
  label: string;
  patternId?: string;
  currentRound?: number;
  currentBreath?: number;
  totalBreaths?: number;
  mode?: 'loop' | 'wim-hof' | 'stopwatch' | 'manual';
  theme?: 'dark' | 'light';
}

const TimerVisual: React.FC<TimerVisualProps> = ({ 
    phase, 
    timeLeft, 
    totalTimeForPhase, 
    label, 
    patternId, 
    currentRound = 1,
    currentBreath = 0,
    totalBreaths = 30,
    mode = 'loop',
    theme = 'dark'
}) => {
  
  // --- Mode Detection ---
  const isWimHof = mode === 'wim-hof';
  const isWimHofBreathing = isWimHof && (phase === BreathingPhase.Inhale || phase === BreathingPhase.Exhale);
  const isWimHofRetention = isWimHof && phase === BreathingPhase.HoldOut;
  const isWimHofRecovery = isWimHof && phase === BreathingPhase.HoldIn;

  // --- Progress Calculations ---
  // 1. Time Progress (Standard)
  const timeProgress = totalTimeForPhase > 0 ? (totalTimeForPhase - timeLeft) / totalTimeForPhase : 0;
  
  // --- Color Logic ---
  let phaseColorClass = '';
  let glowColor = '';
  let strokeColor = '';

  if (isWimHof) {
      if (isWimHofBreathing) {
          phaseColorClass = 'text-cyan-400';
          glowColor = '#22d3ee'; 
          strokeColor = '#22d3ee';
      } else if (isWimHofRetention) {
          phaseColorClass = 'text-orange-500';
          glowColor = '#f97316'; 
          strokeColor = '#f97316';
      } else if (isWimHofRecovery) {
          phaseColorClass = 'text-purple-400';
          glowColor = '#a855f7'; 
          strokeColor = '#a855f7';
      } else {
          phaseColorClass = 'text-white';
          glowColor = '#9ca3af';
          strokeColor = '#ffffff';
      }
  } else {
      switch (phase) {
          case BreathingPhase.Inhale:
              phaseColorClass = 'text-zen-accent'; 
              glowColor = '#22d3ee';
              strokeColor = '#22d3ee';
              break;
          case BreathingPhase.Exhale:
              phaseColorClass = 'text-premium-purple'; 
              glowColor = '#7C3AED';
              strokeColor = '#7C3AED';
              break;
          case BreathingPhase.HoldIn:
              phaseColorClass = 'text-premium-gold'; 
              glowColor = '#F59E0B';
              strokeColor = '#F59E0B';
              break;
          case BreathingPhase.HoldOut:
              phaseColorClass = 'text-rose-400';
              glowColor = '#fb7185';
              strokeColor = '#fb7185';
              break;
          default:
              phaseColorClass = 'text-white';
              glowColor = '#9ca3af';
              strokeColor = '#9ca3af';
      }
  }

  // --- Display Value Logic ---
  let mainValue = "";
  let subText = label;
  let bottomText = "";
  let phaseTimerText = ""; 

  if (mode === 'stopwatch') {
      const totalSeconds = timeLeft;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const ms = Math.floor((totalSeconds % 1) * 10);
      mainValue = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms}`;
      subText = "Секундомер";
  } else if (isWimHof) {
      if (isWimHofBreathing) {
          mainValue = `${currentBreath}`;
          subText = phase === BreathingPhase.Inhale ? "ВДОХ" : "ВЫДОХ";
          bottomText = `РАУНД ${currentRound} • ЦЕЛЬ: ${totalBreaths}`;
          phaseTimerText = `${timeLeft.toFixed(1)}с`;
      } else if (isWimHofRetention) {
          const m = Math.floor(timeLeft / 60);
          const s = Math.floor(timeLeft % 60);
          if (timeLeft > 60) {
              mainValue = `${m}:${s.toString().padStart(2, '0')}`;
          } else {
              mainValue = timeLeft.toFixed(1);
          }
          subText = "ЗАДЕРЖКА";
          bottomText = `РАУНД ${currentRound} • РАССЛАБЛЕНИЕ`;
      } else if (isWimHofRecovery) {
          mainValue = Math.ceil(timeLeft).toString(); // Round up
          subText = "ВОССТАНОВЛЕНИЕ";
          bottomText = "ВДОХ И ДЕРЖАТЬ";
      } else {
           mainValue = Math.ceil(timeLeft).toString();
           subText = label;
      }
  } else {
      // Standard Modes: Countdown
      mainValue = Math.ceil(timeLeft).toString();
      phaseTimerText = ""; 
  }

  // --- Visual Scaling (Breathing Animation) ---
  let scale = 1;
  if (mode !== 'stopwatch') {
      if (phase === BreathingPhase.Inhale) scale = 1.1; // Gentle expansion
      else if (phase === BreathingPhase.Exhale) scale = 0.9;
  }

  // UPDATED SIZES: Use max-height/width to fit within flex container
  // 40vh ensures it never takes more than 40% of viewport height
  const containerSize = "w-[60vmin] h-[60vmin] max-w-[280px] max-h-[280px] md:w-[320px] md:h-[320px]";
  
  return (
    <div className={`relative ${containerSize} flex items-center justify-center flex-shrink-0 mx-auto`}>
        
        {/* 1. Ambient Glow */}
        <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full blur-[60px] pointer-events-none transition-all ease-out ${isWimHofRetention ? 'opacity-50 animate-pulse' : 'opacity-20'}`}
            style={{ 
                backgroundColor: glowColor,
                transform: `translate(-50%, -50%) scale(${scale})`,
                transitionDuration: '1s'
            }}
        />

        {/* 2. PROGRESS RINGS (SVG LAYER) */}
        <svg 
            className={`absolute inset-0 w-full h-full rotate-[-90deg] pointer-events-none overflow-visible z-0`}
            viewBox="0 0 200 200"
        >
            <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={theme === 'light' ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"}
                strokeWidth="2"
            />
            {mode !== 'stopwatch' && (
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 90}
                    strokeDashoffset={2 * Math.PI * 90 * (1 - timeProgress)}
                    className="transition-all duration-100 ease-linear"
                    style={{ 
                        filter: `drop-shadow(0 0 10px ${glowColor})`
                    }}
                />
            )}
        </svg>

        {/* 3. THE ORB (Container) */}
        <div 
            className={`relative w-[85%] h-[85%] rounded-full flex flex-col items-center justify-center transition-transform ease-out z-10`}
            style={{ 
                transform: `scale(${scale})`,
                transitionDuration: '1000ms'
            }}
        >
            {/* Background Glass */}
            <div className={`absolute inset-0 rounded-full border border-white/10 bg-[#0a0a0b]/80 backdrop-blur-2xl shadow-2xl transition-all duration-500 ${isWimHofRetention ? 'shadow-orange-500/20 bg-[#1a0a05]/90' : ''}`}></div>

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                
                {/* Main Value */}
                <div className="flex flex-col items-center justify-center">
                    <span className={`text-6xl md:text-7xl font-display font-bold font-mono tabular-nums tracking-tighter ${phaseColorClass} drop-shadow-lg leading-none transition-colors duration-300`}>
                        {mainValue}
                    </span>
                    
                    {/* Phase Timer */}
                    {!isWimHof && mode !== 'stopwatch' && (
                        <div className="mt-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-black/20 px-2 py-1 rounded-full border border-white/5">
                            <span className="text-white font-mono">{timeLeft.toFixed(1)}с</span>
                        </div>
                    )}
                </div>

                {/* Status Pill */}
                <div className="mt-4 px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
                     <span className={`text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap text-gray-200`}>
                        {subText}
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TimerVisual;