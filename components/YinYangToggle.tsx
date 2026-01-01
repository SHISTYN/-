
import React from 'react';
import { motion } from 'framer-motion';

interface YinYangToggleProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    className?: string;
}

const YinYangToggle: React.FC<YinYangToggleProps> = ({ theme, toggleTheme, className }) => {
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110 active:scale-95 ${className}`}
            title="Сменить тему"
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-6 h-6 md:w-7 md:h-7"
            >
                {/* SVG Yin Yang */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                    <circle cx="12" cy="12" r="11.5" stroke={isDark ? "white" : "#18181b"} strokeWidth="1" className="opacity-20" />
                    <mask id="yin-yang-mask">
                        <circle cx="12" cy="12" r="12" fill="white" />
                    </mask>
                    <g mask="url(#yin-yang-mask)">
                        {/* Main Body */}
                        <circle cx="12" cy="12" r="12" fill={isDark ? "white" : "#18181b"} className="transition-colors duration-500" />
                        {/* Cutout for the other half color */}
                        <rect x="12" y="0" width="12" height="24" fill={isDark ? "#18181b" : "white"} className="transition-colors duration-500" />
                        
                        {/* Top Circle (Head) */}
                        <circle cx="12" cy="6" r="6" fill={isDark ? "white" : "#18181b"} className="transition-colors duration-500" />
                        {/* Top Dot (Eye) */}
                        <circle cx="12" cy="6" r="2" fill={isDark ? "#18181b" : "white"} className="transition-colors duration-500" />
                        
                        {/* Bottom Circle (Head) */}
                        <circle cx="12" cy="18" r="6" fill={isDark ? "#18181b" : "white"} className="transition-colors duration-500" />
                        {/* Bottom Dot (Eye) */}
                        <circle cx="12" cy="18" r="2" fill={isDark ? "white" : "#18181b"} className="transition-colors duration-500" />
                    </g>
                </svg>
            </motion.div>
            
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
        </button>
    );
};

export default YinYangToggle;
