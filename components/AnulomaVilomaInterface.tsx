import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase, BreathingPattern } from '../types';

const MotionPath = motion.path as any;
const MotionCircle = motion.circle as any;
const MotionG = motion.g as any;
const MotionSpan = motion.span as any;
const MotionDiv = motion.div as any;

interface Props {
    phase: BreathingPhase;
    timeLeft: number;
    totalTime: number;
    currentRound: number;
    onPatternUpdate?: (pattern: Partial<BreathingPattern>) => void;
    activePattern?: BreathingPattern;
}

type NostrilState = 'filling' | 'full' | 'emptying' | 'idle';

// --- PARTICLE SYSTEM SUB-COMPONENT ---
const AirParticles: React.FC<{ 
    type: 'inhale' | 'exhale'; 
    side: 'left' | 'right';
}> = ({ type, side }) => {
    
    // Configuration
    const PARTICLE_COUNT = 35; // Increased count
    
    // Coordinates (Matches parent SVG)
    const nostrilX = side === 'left' ? 115 : 185;
    const nostrilY = 235;
    
    // NEON PALETTE (High Saturation)
    // Cyan for Inhale (Cool Energy)
    const COLORS_INHALE = ["#22d3ee", "#67e8f9", "#ffffff"]; 
    // Orange/Gold for Exhale (Warm Release)
    const COLORS_EXHALE = ["#fb923c", "#fcd34d", "#ffffff"];

    // Generate static random data for this batch
    const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        // Physics
        delay: Math.random() * 1.5, // Tighter spread
        duration: 1 + Math.random() * 1.5, // Faster movement
        
        // Spacial
        xOffsetStart: (Math.random() - 0.5) * 50, // Start wide
        xOffsetEnd: (Math.random() - 0.5) * 10, // End narrow (converge)
        
        // Appearance
        size: 0.5 + Math.random() * 2.5, // Varied sizes
        colorIdx: Math.floor(Math.random() * 3),
        blur: Math.random() > 0.5 ? 0 : Math.random() * 2 // Mix of sharp and blurry
    })), []);

    return (
        <g className="pointer-events-none" style={{ mixBlendMode: 'screen' }}>
            {particles.map((p) => {
                if (type === 'inhale') {
                    // --- SUCTION (VORTEX) ---
                    // Start: Below and Wide
                    // End: Inside Nostril and Narrow
                    return (
                        <MotionCircle
                            key={`in-${p.id}`}
                            r={p.size}
                            fill={COLORS_INHALE[p.colorIdx]}
                            initial={{ 
                                cx: nostrilX + (p.xOffsetStart * 1.5), // Wide base
                                cy: nostrilY + 60 + (Math.random() * 40), // Start low
                                opacity: 0, 
                                scale: 0 
                            }}
                            animate={{
                                cx: nostrilX + p.xOffsetEnd, // Converge to center
                                cy: nostrilY - 5, // Enter nostril
                                opacity: [0, 1, 0], // Flash bright then vanish
                                scale: [0.2, 1.2, 0.1] // Grow then shrink
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "circIn" // Accelerate IN
                            }}
                            style={{ filter: `blur(${p.blur}px)` }}
                        />
                    );
                } else {
                    // --- DISPERSION (STEAM) ---
                    // Start: Inside Nostril
                    // End: Down and Wide (Turbulent)
                    
                    // Add some sine wave motion to X for realism
                    const turbulence = (Math.random() - 0.5) * 80;

                    return (
                         <MotionCircle
                            key={`out-${p.id}`}
                            r={p.size}
                            fill={COLORS_EXHALE[p.colorIdx]}
                            initial={{ 
                                cx: nostrilX, 
                                cy: nostrilY,
                                opacity: 0, 
                                scale: 0.2 
                            }}
                            animate={{
                                cx: nostrilX + turbulence, // Fan out wildly
                                cy: nostrilY + 80 + (Math.random() * 40), // Fall down
                                opacity: [0, 0.8, 0], // Fade out slowly
                                scale: [0.5, 1.5, 0] // Dissipate
                            }}
                            transition={{
                                duration: p.duration * 1.5, // Slower fall
                                repeat: Infinity,
                                delay: p.delay,
                                ease: "easeOut" // Decelerate OUT
                            }}
                            style={{ filter: `blur(${p.blur}px)` }}
                        />
                    );
                }
            })}
        </g>
    );
};

const AnulomaVilomaInterface: React.FC<Props> = ({ 
    phase, 
    timeLeft, 
    totalTime,
    currentRound
}) => {
    
    // --- 1. CORE LOGIC ---
    const isOddRound = currentRound % 2 !== 0; 
    
    // State Definitions
    let mainLabel = "";
    let subLabel = "";
    
    // Track Logic
    let leftState: NostrilState = 'idle';
    let rightState: NostrilState = 'idle';

    // --- MAPPING LOGIC (STATE MACHINE) ---
    if (phase === BreathingPhase.Inhale) {
        if (isOddRound) {
            // Inhale Left
            leftState = 'filling';
            rightState = 'idle';
            mainLabel = "Вдох Левой";
            subLabel = "Правая закрыта";
        } else {
            // Inhale Right
            leftState = 'idle';
            rightState = 'filling';
            mainLabel = "Вдох Правой";
            subLabel = "Левая закрыта";
        }
    } else if (phase === BreathingPhase.HoldIn) {
        if (isOddRound) {
            // Hold after Left Inhale -> Left stays full
            leftState = 'full';
            rightState = 'idle';
        } else {
            // Hold after Right Inhale -> Right stays full
            leftState = 'idle';
            rightState = 'full';
        }
        mainLabel = "Задержка";
        subLabel = "Держите энергию внутри";
    } else if (phase === BreathingPhase.Exhale) {
        if (isOddRound) {
            // Exhale Right (Left was full, now switching flow to Right Out)
            // Visually: Right starts full and empties. Left goes idle.
            leftState = 'idle';
            rightState = 'emptying';
            mainLabel = "Выдох Правой";
            subLabel = "Левая закрыта";
        } else {
            // Exhale Left
            leftState = 'emptying';
            rightState = 'idle';
            mainLabel = "Выдох Левой";
            subLabel = "Правая закрыта";
        }
    } else if (phase === BreathingPhase.HoldOut) {
        leftState = 'idle';
        rightState = 'idle';
        mainLabel = "Пауза";
        subLabel = "Легкие пусты";
    } else {
        // Ready / Done
        mainLabel = "Приготовьтесь";
        subLabel = "Спина прямая";
    }

    // --- SVG PATHS (Reversed: Bottom -> Top) ---
    const noseLeftPath = "M 80 215 Q 110 230 130 200 Q 142 160 142 80";
    const noseRightPath = "M 220 215 Q 190 230 170 200 Q 158 160 158 80";
    const septumPath = "M 130 210 Q 150 225 170 210";

    // Arrows
    const arrowLeftIn = "M 80 300 Q 100 280 115 240"; 
    const arrowLeftOut = "M 115 240 Q 90 280 50 300";
    const arrowRightIn = "M 220 300 Q 200 280 185 240";
    const arrowRightOut = "M 185 240 Q 210 280 250 300";

    // Cross
    const drawCross = (cx: number, cy: number, size: number = 8) => (
        `M ${cx-size} ${cy-size} L ${cx+size} ${cy+size} M ${cx+size} ${cy-size} L ${cx-size} ${cy+size}`
    );

    // --- ANIMATION COMPONENT ---
    const NostrilPath: React.FC<{ 
        path: string; 
        state: NostrilState; 
        duration: number 
    }> = ({ path, state, duration }) => {
        
        const CYAN = "#22d3ee";
        const ORANGE = "#fb923c";

        let variants = {};
        let initial = {};
        let animate = {};
        let color = "transparent";

        switch (state) {
            case 'filling':
                color = CYAN;
                initial = { pathLength: 0, opacity: 1 };
                animate = { pathLength: 1, opacity: 1, transition: { duration: duration, ease: "linear" } };
                break;
            case 'full':
                color = CYAN;
                initial = { pathLength: 1, opacity: 1 };
                animate = { 
                    opacity: [1, 0.6, 1], 
                    strokeWidth: [4, 6, 4], // Throb thicker
                    filter: ["drop-shadow(0 0 5px #22d3ee)", "drop-shadow(0 0 15px #22d3ee)", "drop-shadow(0 0 5px #22d3ee)"],
                    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                };
                break;
            case 'emptying':
                color = ORANGE;
                initial = { pathLength: 1, opacity: 1 };
                animate = { pathLength: 0, opacity: 1, transition: { duration: duration, ease: "linear" } };
                break;
            case 'idle':
            default:
                color = "transparent";
                initial = { pathLength: 0, opacity: 0 };
                animate = { pathLength: 0, opacity: 0 };
                break;
        }

        return (
            <MotionPath 
                key={state} 
                d={path} 
                fill="none" 
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={initial}
                animate={animate}
                style={{ filter: state === 'emptying' ? `drop-shadow(0 0 10px ${ORANGE})` : `drop-shadow(0 0 10px ${CYAN})` }}
            />
        );
    };

    return (
        <div className="relative w-full flex flex-col items-center justify-start py-4 select-none font-sans flex-grow min-h-[500px]">
            
            {/* --- TIMER --- */}
            <div className="flex flex-col items-center justify-center z-20 mb-8 pointer-events-none mt-8">
                 <MotionSpan 
                    key={Math.ceil(timeLeft)}
                    initial={{ scale: 0.98, opacity: 0.9 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl md:text-7xl font-mono font-bold text-white tabular-nums tracking-widest drop-shadow-2xl"
                 >
                    00:00:{Math.ceil(timeLeft).toString().padStart(2, '0')}
                 </MotionSpan>
                 <MotionDiv
                    key={mainLabel}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mt-4"
                 >
                    <span className="text-xl md:text-2xl font-bold text-cyan-400 uppercase tracking-widest text-center">
                        {mainLabel}
                    </span>
                    {subLabel && (
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            {subLabel}
                        </span>
                    )}
                 </MotionDiv>
            </div>

            {/* --- VISUALIZATION --- */}
            <div className="relative w-full max-w-[340px] aspect-[3/4] flex-shrink-0">
                <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                        <marker id="arrowHeadCyan" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                            <path d="M0,0 L4,2 L0,4 L0,0" fill="#22d3ee" />
                        </marker>
                        <marker id="arrowHeadOrange" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                            <path d="M0,0 L4,2 L0,4 L0,0" fill="#fb923c" />
                        </marker>
                        {/* Glow Filter for Particles */}
                        <filter id="particleGlow">
                            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* --- PARTICLE LAYER (BEHIND NOSE) --- */}
                    <AnimatePresence mode="popLayout">
                        {leftState === 'filling' && (
                            <MotionG key="left-in-p" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                <AirParticles type="inhale" side="left" />
                            </MotionG>
                        )}
                        {leftState === 'emptying' && (
                            <MotionG key="left-out-p" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                <AirParticles type="exhale" side="left" />
                            </MotionG>
                        )}
                        
                        {rightState === 'filling' && (
                             <MotionG key="right-in-p" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                <AirParticles type="inhale" side="right" />
                            </MotionG>
                        )}
                        {rightState === 'emptying' && (
                             <MotionG key="right-out-p" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                <AirParticles type="exhale" side="right" />
                            </MotionG>
                        )}
                    </AnimatePresence>

                    {/* LAYER 1: TRACK (Static) */}
                    <g 
                        fill="none" 
                        stroke="rgba(255,255,255,0.1)" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d={noseLeftPath} />
                        <path d={noseRightPath} />
                        <path d={septumPath} strokeWidth="1.5" opacity="0.3" />
                    </g>

                    {/* LAYER 2: ACTIVE FLOW (State-Driven) */}
                    <NostrilPath path={noseLeftPath} state={leftState} duration={Math.max(0.5, totalTime)} />
                    <NostrilPath path={noseRightPath} state={rightState} duration={Math.max(0.5, totalTime)} />

                    {/* LAYER 3: INDICATORS (Arrows) */}
                    <AnimatePresence mode="wait">
                        {/* LEFT ARROWS */}
                        {leftState === 'filling' && (
                            <MotionG initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <path d={arrowLeftIn} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowHeadCyan)" style={{ filter: "drop-shadow(0 0 5px #22d3ee)" }} />
                                <circle cx="115" cy="235" r="3" fill="#22d3ee" filter="blur(4px)" opacity="0.8" />
                            </MotionG>
                        )}
                        {leftState === 'emptying' && (
                            <MotionG initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <path d={arrowLeftOut} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowHeadOrange)" style={{ filter: "drop-shadow(0 0 5px #fb923c)" }} />
                            </MotionG>
                        )}
                         
                        {leftState === 'idle' && phase !== BreathingPhase.HoldOut && (
                             <MotionG initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring" }}>
                                <path d={drawCross(110, 250)} fill="none" stroke="#52525b" strokeWidth="4" strokeLinecap="round" />
                            </MotionG>
                        )}


                        {/* RIGHT ARROWS */}
                        {rightState === 'filling' && (
                            <MotionG initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <path d={arrowRightIn} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowHeadCyan)" style={{ filter: "drop-shadow(0 0 5px #22d3ee)" }} />
                                <circle cx="185" cy="235" r="3" fill="#22d3ee" filter="blur(4px)" opacity="0.8" />
                            </MotionG>
                        )}
                        {rightState === 'emptying' && (
                            <MotionG initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <path d={arrowRightOut} fill="none" stroke="#fb923c" strokeWidth="3" strokeLinecap="round" markerEnd="url(#arrowHeadOrange)" style={{ filter: "drop-shadow(0 0 5px #fb923c)" }} />
                            </MotionG>
                        )}
                         {rightState === 'idle' && phase !== BreathingPhase.HoldOut && (
                             <MotionG initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring" }}>
                                <path d={drawCross(190, 250)} fill="none" stroke="#52525b" strokeWidth="4" strokeLinecap="round" />
                            </MotionG>
                        )}
                    </AnimatePresence>
                </svg>
            </div>
            
            <div className="flex-grow"></div>
        </div>
    );
};

export default AnulomaVilomaInterface;