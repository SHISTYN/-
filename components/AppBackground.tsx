
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    theme: 'dark' | 'light';
}

const MotionDiv = motion.div as any;

const AppBackground: React.FC<Props> = ({ theme }) => {
    const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 bg-[#000000]">
            
            {/* --- DARK MODE: LIQUID GLASS ATMOSPHERE --- */}
            <div 
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Главный луч (God Ray) - имитация дыхания */}
                <MotionDiv 
                    animate={{ 
                        opacity: [0.4, 0.7, 0.4],
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ 
                        duration: 12, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[160%] h-[900px]"
                    style={{
                        background: 'radial-gradient(ellipse 50% 50% at 50% 0%, rgba(34, 211, 238, 0.15), transparent 80%)',
                        filter: 'blur(100px)', 
                        transform: 'translateZ(0)',
                    }} 
                />

                {/* Пурпурное свечение (Aurora) */}
                <MotionDiv 
                    animate={{ 
                        x: [-50, 50, -50],
                        y: [-30, 30, -30],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[900px] h-[900px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1), transparent 70%)',
                        filter: 'blur(120px)',
                        transform: 'translateZ(0)'
                    }}
                />

                {/* Текстурный виньет */}
                <div 
                    className="absolute inset-0"
                    style={{
                         background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                    }}
                />
            </div>

            {/* --- LIGHT MODE: ZEN CLEAN (WARMER TINT) --- */}
            <div 
                className={`absolute inset-0 bg-[#F5F5F7] transition-opacity duration-1000 ease-in-out ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}
            >
                 <MotionDiv 
                    animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 opacity-40"
                    style={{
                         background: 'radial-gradient(circle at 50% 0%, #e0f2fe, transparent 80%)',
                         filter: 'blur(60px)',
                    }}
                 />
                 {/* Warm ambient glow bottom right */}
                 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-100/30 blur-[80px] rounded-full pointer-events-none"></div>
            </div>

            {/* Глобальный шум (Cinematic Grain) */}
            <div 
                className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
                style={{ backgroundImage: NOISE_SVG }}
            />
        </div>
    );
};

export default AppBackground;
