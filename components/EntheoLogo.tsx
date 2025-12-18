import React from 'react';

const EntheoLogo: React.FC<{ size?: number; animated?: boolean; idSuffix?: string }> = ({ size = 60, animated = true, idSuffix = 'main' }) => {
    // Generate unique IDs to prevent gradient conflicts between multiple instances of the logo
    const magicCapId = `magicCap-${idSuffix}`;
    const windFadeId = `windFade-${idSuffix}`;
    const goldAuraId = `goldAura-${idSuffix}`;

    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 200 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', filter: 'drop-shadow(0 0 15px rgba(124, 58, 237, 0.2))' }}
        >
            <defs>
                <linearGradient id={magicCapId} x1="60" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ef4444" />
                    <stop offset="1" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id={windFadeId} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="20%" stopColor="white" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <radialGradient id={goldAuraId} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60 60) rotate(90) scale(60)">
                    <stop stopColor="#F59E0B" stopOpacity="0.3" /> 
                    <stop offset="0.8" stopColor="#7C3AED" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Aura */}
            <circle cx="60" cy="70" r="50" fill={`url(#${goldAuraId})`} className={animated ? "animate-pulse-slow" : ""} />

            {/* Wind Effects */}
            {animated && (
                <g className="mix-blend-overlay">
                    <path d="M 120 35 Q 150 25 180 35" stroke={`url(#${windFadeId})`} strokeWidth="1" fill="none" strokeLinecap="round" strokeDasharray="40 100" className="animate-flow" style={{ animationDuration: '4s' }} />
                    <path d="M 110 50 Q 140 55 170 45" stroke={`url(#${windFadeId})`} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="30 80" className="animate-flow" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />
                </g>
            )}

            {/* Mushroom Shape */}
            <g transform="translate(0, 5)">
                {/* Stem */}
                <path d="M 50 65 Q 48 95 45 100 L 75 100 Q 72 95 70 65" fill="#FFF9E5" />
                <path d="M 50 65 L 70 65 L 70 100 L 45 100 Z" fill="rgba(0,0,0,0.05)" />
                <path d="M 50 70 Q 60 80 70 70 L 72 66 L 48 66 Z" fill="#FFF" />
                
                {/* Cap with Animation */}
                <g className={animated ? "animate-mushroom-breath" : ""} style={{ transformOrigin: '60px 65px' }}>
                    <path d="M 25 65 C 25 25, 95 25, 95 65 Q 60 55 25 65 Z" fill={`url(#${magicCapId})`} style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.2))" }} />
                    
                    {/* Spots */}
                    <g fill="#FFFFFF" fillOpacity="0.9">
                        <ellipse cx="45" cy="40" rx="5" ry="3" transform="rotate(-20 45 40)" />
                        <circle cx="65" cy="35" r="4" />
                        <circle cx="82" cy="50" r="3" />
                        <circle cx="35" cy="55" r="2.5" />
                    </g>
                    
                    {/* Spores */}
                    {animated && (
                        <g>
                            <circle cx="85" cy="50" r="1.5" className="fill-cyan-100 animate-spores" style={{ opacity: 0, animationDelay: '0s' }} />
                            <circle cx="95" cy="40" r="1" className="fill-purple-100 animate-spores" style={{ opacity: 0, animationDelay: '1.5s' }} />
                        </g>
                    )}
                </g>
            </g>
        </svg>
    );
};

export default EntheoLogo;