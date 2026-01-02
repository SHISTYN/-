
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase } from '../types';

interface TimerVisualProps {
  phase: BreathingPhase;
  timeLeft: number;
  totalTimeForPhase: number;
  label: string;
  currentRound?: number;
  totalRounds?: number;
  currentBreath?: number;
  totalBreaths?: number;
  mode?: 'loop' | 'wim-hof' | 'stopwatch' | 'manual';
  isActive?: boolean;
}

const TimerVisual: React.FC<TimerVisualProps> = ({ 
    phase, 
    timeLeft, 
    totalTimeForPhase,
    label, 
    currentRound = 1,
    totalRounds = 0,
    currentBreath = 0,
    mode = 'loop',
    isActive = false
}) => {
  
  const isWimHof = mode === 'wim-hof';
  const isStopwatch = mode === 'stopwatch';
  const isWimHofBreathing = isWimHof && (phase === BreathingPhase.Inhale || phase === BreathingPhase.Exhale);
  const isWimHofRetention = isWimHof && phase === BreathingPhase.HoldOut;

  // --- 1. PALETTE ENGINE (Deep & Clean) ---
  const getTheme = () => {
      if (!isActive) return {
          core: '#18181b', // Neutral dark
          g1: '#27272a',
          g2: '#09090b', 
          ring: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)'],
          accent: '#71717a',
          glowColor: 'transparent'
      };

      switch (phase) {
          case BreathingPhase.Inhale: 
              return { 
                  core: '#083344', // Cyan Dark
                  g1: '#06b6d4',   // Cyan Mid
                  g2: '#22d3ee',   // Cyan Bright
                  ring: ['#0891b2', '#22d3ee'],
                  accent: '#22d3ee',
                  glowColor: 'rgba(34, 211, 238, 0.4)'
              };
          case BreathingPhase.HoldIn: 
              return { 
                  core: '#4c1d95', // Purple Dark
                  g1: '#7c3aed', 
                  g2: '#d8b4fe',
                  ring: ['#7c3aed', '#c084fc'],
                  accent: '#c084fc',
                  glowColor: 'rgba(168, 85, 247, 0.5)'
              };
          case BreathingPhase.Exhale: 
              return { 
                  core: '#431407', // Orange Dark
                  g1: '#ea580c', 
                  g2: '#fdba74',
                  ring: ['#f97316', '#fbbf24'],
                  accent: '#fb923c',
                  glowColor: 'rgba(249, 115, 22, 0.4)'
              };
          case BreathingPhase.HoldOut: 
              return { 
                  core: '#0f172a', // Navy Dark
                  g1: '#3730a3', 
                  g2: '#818cf8',
                  ring: ['#4f46e5', '#818cf8'],
                  accent: '#818cf8',
                  glowColor: 'rgba(99, 102, 241, 0.4)'
              };
          default: 
              return { 
                  core: '#18181b', 
                  g1: '#27272a', 
                  g2: '#3f3f46',
                  ring: ['#3f3f46', '#52525b'],
                  accent: '#52525b',
                  glowColor: 'transparent'
              };
      }
  };

  const theme = getTheme();

  // --- 2. PROGRESS & SCALE ---
  const progress = totalTimeForPhase > 0 
      ? Math.max(0, Math.min(1, (totalTimeForPhase - timeLeft) / totalTimeForPhase))
      : 0;
  
  const SIZE = 320;
  const STROKE = 4; // Thicker, premium ring
  const RADIUS = (SIZE / 2) - STROKE - 20; 
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  // Breathing Physics (Elastic Scale)
  let scale = 1.0;
  if (isActive && !isStopwatch) {
      if (phase === BreathingPhase.Inhale) scale = 0.9 + (progress * 0.2); // 0.9 -> 1.1
      else if (phase === BreathingPhase.HoldIn) scale = 1.1; // Hold Big
      else if (phase === BreathingPhase.Exhale) scale = 1.1 - (progress * 0.2); // 1.1 -> 0.9
      else scale = 0.9; // Hold Small
  } else {
      scale = 0.95;
  }

  // --- 3. ORGANIC FLUID ANIMATION (AMOEBA) ---
  // Softer values (45-55%) prevent "squaring".
  // Rotation adds life.
  const amoebaVariants = {
      idle: {
          borderRadius: "50%",
          rotate: 0,
          transition: { duration: 1 }
      },
      active: {
          borderRadius: [
              "50% 50% 50% 50%", 
              "55% 45% 50% 50%", 
              "50% 50% 55% 45%", 
              "45% 55% 45% 55%", 
              "50% 50% 50% 50%"
          ],
          rotate: [0, 180, 360], // Slow rotation of the container
          transition: {
              borderRadius: {
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut", 
                  repeatType: "mirror"
              },
              rotate: {
                  duration: 20, // Long slow spin
                  repeat: Infinity,
                  ease: "linear"
              }
          }
      }
  };

  // --- 4. TEXT VALUES ---
  let mainValue = "";
  if (isStopwatch) {
      const m = Math.floor(timeLeft / 60);
      const s = Math.floor(timeLeft % 60);
      mainValue = `${m}:${s.toString().padStart(2, '0')}`;
  } else if (isWimHof) {
      if (isWimHofBreathing) mainValue = `${currentBreath}`;
      else if (isWimHofRetention) {
          const m = Math.floor(timeLeft / 60);
          const s = Math.floor(timeLeft % 60);
          mainValue = timeLeft > 60 ? `${m}:${s.toString().padStart(2, '0')}` : timeLeft.toFixed(1);
      } else mainValue = Math.ceil(timeLeft).toString();
  } else {
      mainValue = Math.ceil(timeLeft).toString();
  }

  // Common Transition
  const smoothT = { duration: 1.5, ease: "easeInOut" };

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: SIZE, height: SIZE }}>
        
        {/* --- LAYER 1: THE RING (Static Container) --- */}
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
            <svg width={SIZE} height={SIZE} className="rotate-[-90deg] overflow-visible">
                <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={theme.ring[0]} />
                        <stop offset="100%" stopColor={theme.ring[1]} />
                    </linearGradient>
                    {/* Inner Shadow for depth */}
                    <filter id="innerGlow">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1"/>
                    </filter>
                </defs>
                
                {/* Track */}
                <circle 
                    cx={SIZE/2} cy={SIZE/2} r={RADIUS} 
                    fill="none" 
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={STROKE} 
                />

                {/* Progress */}
                {isActive && (
                    <motion.circle 
                        cx={SIZE/2} cy={SIZE/2} r={RADIUS} 
                        fill="none" 
                        stroke="url(#ringGrad)"
                        strokeWidth={STROKE} 
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{ filter: `drop-shadow(0 0 8px ${theme.accent})` }}
                    />
                )}
            </svg>
        </div>

        {/* --- LAYER 2: THE PLASMA BLOB (Masked Container) --- */}
        {/* We use a mask or overflow-hidden to keep the plasma inside the organic shape */}
        <motion.div 
            className="absolute z-10 flex items-center justify-center overflow-hidden"
            style={{ width: SIZE * 0.72, height: SIZE * 0.72 }} // Slightly smaller than ring
            variants={amoebaVariants}
            animate={isActive ? "active" : "idle"}
        >
            <motion.div 
                className="w-full h-full relative"
                animate={{ 
                    scale: scale,
                    backgroundColor: theme.core // NO BLACK! Use theme core color
                }}
                transition={{ 
                    scale: { duration: activePatternDuration(phase), ease: "easeInOut" },
                    backgroundColor: smoothT
                }}
                style={{ 
                    borderRadius: "inherit",
                    // Ambient Glow emitting FROM the blob
                    boxShadow: isActive ? `0 0 60px ${theme.glowColor}, inset 0 0 40px rgba(0,0,0,0.5)` : 'none'
                }}
            >
                {/* 2.1 PLASMA ORBS (Rotating inside) */}
                <div className="absolute inset-0 opacity-60 mix-blend-screen blur-[40px]">
                    {/* Orb 1: Core Light */}
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full"
                        animate={{ 
                            backgroundColor: theme.g1,
                            x: [0, 30, -20, 0],
                            y: [0, -30, 20, 0],
                            scale: [1, 1.3, 0.8, 1]
                        }}
                        transition={{ 
                            backgroundColor: smoothT,
                            default: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                    
                    {/* Orb 2: Counter Accent */}
                    <motion.div 
                        className="absolute bottom-1/4 right-1/4 w-2/3 h-2/3 rounded-full"
                        animate={{ 
                            backgroundColor: theme.g2,
                            x: [0, -40, 20, 0],
                            y: [0, 20, -40, 0],
                        }}
                        transition={{ 
                            backgroundColor: smoothT,
                            default: { duration: 12, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                </div>

                {/* 2.2 GLASS REFLECTION (Surface Shine) */}
                <div className="absolute top-0 left-0 w-full h-full rounded-[inherit] overflow-hidden opacity-30 pointer-events-none">
                     <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[50%] bg-gradient-to-b from-white to-transparent rounded-[50%]" />
                </div>

            </motion.div>
        </motion.div>

        {/* --- LAYER 3: HUD --- */}
        <div className="relative z-40 flex flex-col items-center justify-center pointer-events-none">
            
            <AnimatePresence mode="popLayout">
                <motion.span 
                    key={Math.floor(timeLeft)} // Animates on second change
                    initial={{ opacity: 0.4, scale: 0.95, filter: 'blur(2px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 1.05, position: 'absolute' }}
                    transition={{ duration: 0.2 }}
                    className="font-display font-bold text-7xl md:text-8xl tabular-nums tracking-tighter text-white drop-shadow-md"
                >
                    {mainValue}
                </motion.span>
            </AnimatePresence>

            <div className="mt-2 flex flex-col items-center gap-2">
                <motion.div 
                    layout
                    className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg flex items-center justify-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.span 
                        className="text-[10px] font-black uppercase tracking-[0.2em]"
                        animate={{ color: theme.accent }}
                        transition={{ color: smoothT }}
                    >
                        {isWimHof ? (isWimHofBreathing ? 'Дыхание' : isWimHofRetention ? 'Задержка' : 'Отдых') : label}
                    </motion.span>
                </motion.div>

                {!isWimHof && !isStopwatch && (
                    <span className="text-[10px] font-bold text-white/30 tracking-widest">
                        {currentRound} / {totalRounds === 0 ? '∞' : totalRounds}
                    </span>
                )}
            </div>
        </div>

    </div>
  );
};

// Helper to smooth animation duration based on phase length
function activePatternDuration(phase: BreathingPhase) {
    if (phase === BreathingPhase.Inhale || phase === BreathingPhase.Exhale) return 2; // Smooth expand/contract
    return 0.5; // Quick snap for holds
}

export default TimerVisual;
