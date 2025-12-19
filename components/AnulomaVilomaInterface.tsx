import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase, BreathingPattern } from '../types';

interface Props {
    phase: BreathingPhase;
    timeLeft: number;
    totalTime: number;
    currentRound: number;
    // Callback to update parent pattern (Essential for Level Logic)
    onPatternUpdate?: (pattern: Partial<BreathingPattern>) => void;
    activePattern?: BreathingPattern;
}

const AnulomaVilomaInterface: React.FC<Props> = ({ 
    phase, 
    timeLeft, 
    totalTime, 
    currentRound,
    onPatternUpdate,
    activePattern 
}) => {
    
    // --- 1. CORE MATH: THE 1:4:2 RATIO & LEVELS ---
    // Level 1: Inhale 4s (3+1) -> Hold 16s -> Exhale 8s
    const [level, setLevel] = useState<number>(1);

    // Sync local level with active pattern on mount to allow persistence
    useEffect(() => {
        if (activePattern) {
            // Reverse engineer level: Level = Inhale - 3
            const calculatedLevel = Math.max(1, Math.round(activePattern.inhale - 3));
            if (calculatedLevel !== level) setLevel(calculatedLevel);
        }
    }, []);

    const updateLevel = (newLevel: number) => {
        if (newLevel < 1 || newLevel > 40) return;
        setLevel(newLevel);
        
        // 1:4:2 Formula
        const inhale = 3 + newLevel;
        const hold = inhale * 4;
        const exhale = inhale * 2;

        if (onPatternUpdate) {
            onPatternUpdate({
                inhale: inhale,
                holdIn: hold,
                exhale: exhale,
                holdOut: 0 // No empty hold in Nadi Shodhana
            });
        }
    };

    // --- 2. CYCLE LOGIC (STRICT NADI SHODHANA) ---
    // Round 1 (Odd): Inhale Left -> Hold -> Exhale Right
    // Round 2 (Even): Inhale Right -> Hold -> Exhale Left
    const isOddRound = currentRound % 2 !== 0; 
    
    // Visual State
    let activeFlowSide: 'left' | 'right' | 'none' = 'none';
    let fingerState: 'block-right' | 'block-left' | 'block-both' | 'open' = 'open';
    let flowAction: 'fill' | 'drain' | 'pulsate' = 'fill';
    
    let mainLabel = "";
    let subLabel = "";

    // Mapping Phase to Visuals
    if (phase === BreathingPhase.Inhale) {
        if (isOddRound) {
            // Step 1: Inhale Left (Thumb blocks Right)
            activeFlowSide = 'left';
            fingerState = 'block-right'; 
            mainLabel = "ВДОХ ЛЕВОЙ";
            subLabel = "Безымянный открыт • Большой закрыт";
            flowAction = 'fill';
        } else {
            // Step 4: Inhale Right (Ring blocks Left)
            activeFlowSide = 'right';
            fingerState = 'block-left'; 
            mainLabel = "ВДОХ ПРАВОЙ";
            subLabel = "Большой открыт • Безымянный закрыт";
            flowAction = 'fill';
        }
    } else if (phase === BreathingPhase.Exhale) {
        if (isOddRound) {
            // Step 3: Exhale Right (Ring blocks Left)
            activeFlowSide = 'right';
            fingerState = 'block-left'; 
            mainLabel = "ВЫДОХ ПРАВОЙ";
            subLabel = "Большой открыт • Безымянный закрыт";
            flowAction = 'drain';
        } else {
            // Step 6: Exhale Left (Thumb blocks Right)
            activeFlowSide = 'left';
            fingerState = 'block-right'; 
            mainLabel = "ВЫДОХ ЛЕВОЙ";
            subLabel = "Безымянный открыт • Большой закрыт";
            flowAction = 'drain';
        }
    } else if (phase === BreathingPhase.HoldIn || phase === BreathingPhase.HoldOut) {
        // Steps 2 & 5: Retention (Both blocked)
        activeFlowSide = 'none'; // Energy at Third Eye
        fingerState = 'block-both';
        mainLabel = "ЗАДЕРЖКА";
        subLabel = "Каналы перекрыты • Внимание в центр";
        flowAction = 'pulsate';
    } else {
        fingerState = 'open';
        mainLabel = "ПРИГОТОВЬТЕСЬ";
        subLabel = "Сядьте прямо • Рука в Вишну-мудре";
    }

    // --- 3. ANIMATION PHYSICS ---

    // Liquid Neon (Prana)
    const fluidVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        fill: ({ duration }: { duration: number }) => ({
            pathLength: 1,
            opacity: 1,
            transition: { duration: duration, ease: "linear" as const }
        }),
        drain: ({ duration }: { duration: number }) => ({
            pathLength: 0,
            opacity: [1, 0.6, 0], 
            transition: { duration: duration, ease: "easeIn" as const } 
        }),
        pulsate: {
            pathLength: 1,
            opacity: [0.7, 1, 0.7],
            strokeWidth: [20, 26, 20],
            filter: ["drop-shadow(0 0 5px #48CFE1)", "drop-shadow(0 0 15px #48CFE1)", "drop-shadow(0 0 5px #48CFE1)"],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const }
        }
    };

    // Ghost Fingers (Slide In/Out)
    const fingerVariants = {
        hiddenLeft: { x: -80, opacity: 0 },
        visibleLeft: { 
            x: 0, 
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 70, damping: 18 }
        },
        hiddenRight: { x: 80, opacity: 0 },
        visibleRight: { 
            x: 0, 
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 70, damping: 18 }
        }
    };

    // --- 4. BIOMETRIC SVG PATHS ---
    
    // The Vessel (Nasal Channels converging to Third Eye)
    // ViewBox: 0 0 400 500. Center X: 200.
    const channelLeft = "M 130 460 C 130 350, 150 180, 200 90";
    const channelRight = "M 270 460 C 270 350, 250 180, 200 90";

    // Finger Silhouettes (Ghost Hands)
    // Left Ring Finger (Coming from left bottom)
    const ringFingerPath = "M -20 400 Q 60 410 100 440 Q 120 470 100 500 Q 60 530 -20 520 Z";
    // Right Thumb (Coming from right bottom)
    const thumbPath = "M 420 400 Q 340 410 300 440 Q 280 470 300 500 Q 340 530 420 520 Z";

    return (
        <div className="relative w-full h-full min-h-[550px] flex flex-col items-center justify-between py-6 select-none font-sans overflow-hidden">
            
            {/* --- VISUAL CORE --- */}
            <div className="relative w-[400px] h-[500px] flex-shrink-0">
                
                {/* AMBIENT ORB (Background) */}
                <div 
                    className={`absolute top-[20%] left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] transition-all duration-1000 ${flowAction === 'pulsate' ? 'scale-125 opacity-40' : 'scale-100 opacity-20'}`}
                />

                <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full overflow-visible z-10 pointer-events-none">
                    <defs>
                        {/* 1. GLASS & GLOW FILTERS */}
                        <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
                        </filter>

                        <filter id="neon-glow">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>

                        {/* 2. GRADIENTS */}
                        <linearGradient id="prana-gradient" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                            <stop offset="60%" stopColor="#48CFE1" stopOpacity="1" />
                            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                        </linearGradient>

                        <linearGradient id="ghost-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.02" />
                        </linearGradient>
                    </defs>

                    {/* LAYER 1: THE VESSEL (Background) */}
                    <g opacity="0.1">
                         <path d={channelLeft} fill="none" stroke="white" strokeWidth="40" strokeLinecap="round" />
                         <path d={channelRight} fill="none" stroke="white" strokeWidth="40" strokeLinecap="round" />
                         <circle cx="200" cy="90" r="25" fill="white" />
                    </g>

                    {/* LAYER 2: LIQUID PRANA (Active Energy) */}
                    <AnimatePresence>
                        {/* Left Channel */}
                        {(activeFlowSide === 'left' || (flowAction === 'pulsate' && activeFlowSide === 'none')) && (
                            <motion.path
                                d={channelLeft}
                                fill="none"
                                stroke="url(#prana-gradient)"
                                strokeWidth="22"
                                strokeLinecap="round"
                                filter="url(#neon-glow)"
                                variants={fluidVariants}
                                custom={{ duration: totalTime }}
                                initial={flowAction === 'pulsate' ? "pulsate" : flowAction === 'drain' ? { pathLength: 1, opacity: 1 } : "hidden"}
                                animate={flowAction}
                                exit="hidden"
                            />
                        )}

                        {/* Right Channel */}
                        {(activeFlowSide === 'right' || (flowAction === 'pulsate' && activeFlowSide === 'none')) && (
                            <motion.path
                                d={channelRight}
                                fill="none"
                                stroke="url(#prana-gradient)"
                                strokeWidth="22"
                                strokeLinecap="round"
                                filter="url(#neon-glow)"
                                variants={fluidVariants}
                                custom={{ duration: totalTime }}
                                initial={flowAction === 'pulsate' ? "pulsate" : flowAction === 'drain' ? { pathLength: 1, opacity: 1 } : "hidden"}
                                animate={flowAction}
                                exit="hidden"
                            />
                        )}
                        
                        {/* Third Eye Pulsation */}
                        {flowAction === 'pulsate' && (
                             <motion.circle 
                                cx="200" cy="90" r="18" 
                                fill="url(#prana-gradient)"
                                filter="url(#neon-glow)"
                                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                             />
                        )}
                    </AnimatePresence>


                    {/* LAYER 3: GHOST HANDS (Biometric Interaction) */}
                    
                    {/* Left Ring Finger (Blocks Left Channel) */}
                    <AnimatePresence>
                        {(fingerState === 'block-left' || fingerState === 'block-both') && (
                            <motion.path
                                d={ringFingerPath}
                                fill="url(#ghost-gradient)"
                                stroke="white"
                                strokeWidth="1"
                                strokeOpacity="0.3"
                                filter="url(#glass-blur)"
                                variants={fingerVariants}
                                initial="hiddenLeft"
                                animate="visibleLeft"
                                exit="hiddenLeft"
                                style={{ backdropFilter: "blur(20px)" }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Right Thumb (Blocks Right Channel) */}
                    <AnimatePresence>
                        {(fingerState === 'block-right' || fingerState === 'block-both') && (
                            <motion.path
                                d={thumbPath}
                                fill="url(#ghost-gradient)"
                                stroke="white"
                                strokeWidth="1"
                                strokeOpacity="0.3"
                                filter="url(#glass-blur)"
                                variants={fingerVariants}
                                initial="hiddenRight"
                                animate="visibleRight"
                                exit="hiddenRight"
                                style={{ backdropFilter: "blur(20px)" }}
                            />
                        )}
                    </AnimatePresence>

                </svg>

                {/* --- CENTER HUD (TIMER) --- */}
                <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
                    <motion.div 
                        key={Math.ceil(timeLeft)}
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-8xl md:text-9xl font-display font-bold text-white tabular-nums tracking-tighter drop-shadow-[0_0_35px_rgba(72,207,225,0.5)]">
                            {Math.ceil(timeLeft)}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* --- INSTRUCTIONS & UI --- */}
            <div className="flex flex-col items-center w-full max-w-md px-6 gap-6 z-20">
                
                {/* 1. Main Text */}
                <div className="text-center h-20">
                    <AnimatePresence mode="wait">
                        <motion.h2 
                            key={mainLabel}
                            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 tracking-tight drop-shadow-md"
                        >
                            {mainLabel}
                        </motion.h2>
                    </AnimatePresence>
                    
                    <motion.p 
                        key={subLabel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        className="text-xs font-bold text-cyan-100 uppercase tracking-widest mt-2 font-mono"
                    >
                        {subLabel}
                    </motion.p>
                </div>

                {/* 2. Level Controller (Glassmorphism Panel) */}
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Уровень Сложности</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-display font-bold text-white">LVL {level}</span>
                            <span className="text-[10px] font-mono text-cyan-400 opacity-80">
                                {3 + level}с — {(3 + level) * 4}с — {(3 + level) * 2}с
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => updateLevel(level - 1)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center transition-all active:scale-95"
                        >
                            <i className="fas fa-minus text-xs"></i>
                        </button>
                        <button 
                            onClick={() => updateLevel(level + 1)}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white flex items-center justify-center transition-all active:scale-95"
                        >
                            <i className="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnulomaVilomaInterface;