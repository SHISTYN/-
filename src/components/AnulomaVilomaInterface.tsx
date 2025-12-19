import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathingPhase } from '../types';

interface AnulomaVilomaInterfaceProps {
    phase: BreathingPhase;
    currentRound: number;
}

const AnulomaVilomaInterface: React.FC<AnulomaVilomaInterfaceProps> = ({ phase, currentRound }) => {
    
    // --- LOGIC: Determine Active Side based on Round and Phase ---
    // Round 1: Inhale Left (Right Closed) -> Exhale Right (Left Closed) is usually 2 rounds in this app's logic? 
    // Let's verify App.tsx logic: Odd Round = Left Inhale / Right Exhale?
    // Based on TimerVisual legacy logic:
    // Inhale + Odd = Inhale Left (Close Right)
    // Inhale + Even = Inhale Right (Close Left)
    // Exhale + Odd = Exhale Right (Close Left)
    // Exhale + Even = Exhale Left (Close Right)
    // Hold = Both Closed.
    
    const isOddRound = currentRound % 2 !== 0;
    
    let activeChannel: 'left' | 'right' | 'none' = 'none';
    let flowDirection: 'up' | 'down' | 'none' = 'none';
    let leftShield = false;
    let rightShield = false;
    let statusText = "ПРИГОТОВЬТЕСЬ";
    let subStatus = "Оба канала открыты";

    if (phase === BreathingPhase.Inhale) {
        flowDirection = 'up';
        if (isOddRound) {
            activeChannel = 'left';
            rightShield = true;
            statusText = "ВДОХ ЛЕВОЙ";
            subStatus = "(Правая закрыта)";
        } else {
            activeChannel = 'right';
            leftShield = true;
            statusText = "ВДОХ ПРАВОЙ";
            subStatus = "(Левая закрыта)";
        }
    } else if (phase === BreathingPhase.Exhale) {
        flowDirection = 'down';
        if (isOddRound) {
            activeChannel = 'right';
            leftShield = true;
            statusText = "ВЫДОХ ПРАВОЙ";
            subStatus = "(Левая закрыта)";
        } else {
            activeChannel = 'left';
            rightShield = true;
            statusText = "ВЫДОХ ЛЕВОЙ";
            subStatus = "(Правая закрыта)";
        }
    } else if (phase === BreathingPhase.HoldIn || phase === BreathingPhase.HoldOut) {
        leftShield = true;
        rightShield = true;
        statusText = "ЗАДЕРЖКА";
        subStatus = "Оба канала закрыты";
    }

    // --- VISUAL CONSTANTS ---
    const colorNeon = "#48CFE1";
    const colorBlocked = "#334155";
    
    // SVG Paths (Symmetrical "Cyber Nose" Structure)
    // Center point approx 100, 100 in a 200x200 box
    const leftPath = "M 85 140 C 60 140, 60 100, 95 60 L 100 50"; // Bottom Left to Top Center
    const rightPath = "M 115 140 C 140 140, 140 100, 105 60 L 100 50"; // Bottom Right to Top Center

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* SVG VISUALIZER */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                
                {/* HUD Elements / Decoration */}
                <div className="absolute inset-0 border border-cyan-900/20 rounded-full border-dashed animate-spin-slow opacity-20 pointer-events-none"></div>
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent"></div>
                
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <defs>
                        <linearGradient id="flowGrad" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor={colorNeon} stopOpacity="0" />
                            <stop offset="50%" stopColor={colorNeon} stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="1" />
                        </linearGradient>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE STRUCTURE (The "Frame") */}
                    <path d={leftPath} stroke={colorBlocked} strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
                    <path d={rightPath} stroke={colorBlocked} strokeWidth="2" fill="none" strokeLinecap="round" className="opacity-30" />
                    
                    {/* Central Node */}
                    <circle cx="100" cy="50" r="4" fill={colorBlocked} className="opacity-50" />

                    {/* --- ACTIVE FLOW ANIMATION --- */}
                    
                    {/* LEFT CHANNEL FLOW */}
                    {activeChannel === 'left' && (
                        <motion.path 
                            d={leftPath}
                            stroke="url(#flowGrad)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                                pathLength: 1, 
                                opacity: 1,
                                // If Inhale (Up): Path draws 0->1. If Exhale (Down): Path draws 0->1 but we reverse path direction?
                                // Simplified: Just draw it. 
                                pathSpacing: 0
                            }}
                            transition={{ 
                                duration: 1.5, // Sync with breath speed ideally, but constant flow looks good too
                                repeat: Infinity,
                                repeatType: flowDirection === 'up' ? "loop" : "reverse",
                                ease: "linear"
                            }}
                        />
                    )}

                    {/* RIGHT CHANNEL FLOW */}
                    {activeChannel === 'right' && (
                        <motion.path 
                            d={rightPath}
                            stroke="url(#flowGrad)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ 
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: flowDirection === 'up' ? "loop" : "reverse",
                                ease: "linear"
                            }}
                        />
                    )}

                    {/* --- SHIELDS (BLOCKERS) --- */}
                    
                    {/* LEFT SHIELD */}
                    <AnimatePresence>
                        {leftShield && (
                            <motion.g
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {/* Hexagon Shield */}
                                <path 
                                    transform="translate(85, 140)" 
                                    d="M-8 -5 L8 -5 L10 0 L8 5 L-8 5 L-10 0 Z" 
                                    fill="#1e293b" 
                                    stroke="#ef4444" 
                                    strokeWidth="1.5"
                                />
                                <text x="85" y="155" fontSize="6" fill="#ef4444" textAnchor="middle" fontWeight="bold">CLOSED</text>
                            </motion.g>
                        )}
                    </AnimatePresence>

                    {/* RIGHT SHIELD */}
                    <AnimatePresence>
                        {rightShield && (
                            <motion.g
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                 <path 
                                    transform="translate(115, 140)" 
                                    d="M-8 -5 L8 -5 L10 0 L8 5 L-8 5 L-10 0 Z" 
                                    fill="#1e293b" 
                                    stroke="#ef4444" 
                                    strokeWidth="1.5"
                                />
                                <text x="115" y="155" fontSize="6" fill="#ef4444" textAnchor="middle" fontWeight="bold">CLOSED</text>
                            </motion.g>
                        )}
                    </AnimatePresence>

                </svg>

                {/* Hand Indicators (Legacy Hint replacement) */}
                <div className="absolute bottom-10 left-0 w-full flex justify-between px-10 pointer-events-none">
                     <motion.div 
                        animate={{ opacity: rightShield ? 1 : 0.2 }}
                        className="flex flex-col items-center"
                     >
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
                     </motion.div>
                     <motion.div 
                        animate={{ opacity: leftShield ? 1 : 0.2 }}
                        className="flex flex-col items-center"
                     >
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></div>
                     </motion.div>
                </div>
            </div>

            {/* TEXT INSTRUCTIONS */}
            <div className="mt-4 flex flex-col items-center z-10">
                <motion.h2 
                    key={statusText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg"
                >
                    {statusText}
                </motion.h2>
                <motion.div 
                    key={subStatus}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 px-4 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md"
                >
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                        {subStatus}
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default AnulomaVilomaInterface;