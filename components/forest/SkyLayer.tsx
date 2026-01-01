
import React from 'react';
import { motion } from 'framer-motion';
import { C, PX, VIEW_W, VIEW_H, renderSprite } from './ForestConfig';

const MOON = [
    "  XX  ",
    " XMMX ",
    "XMMMMX",
    "XMMMMX",
    " XMMX ",
    "  XX  "
];

export const SkyLayer: React.FC = () => {
    return (
        <g id="layer-sky">
            {/* Gradient Background */}
            <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.skyTop} />
                    <stop offset="100%" stopColor={C.skyBottom} />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#skyGrad)" />
            
            {/* Stars */}
            {[...Array(50)].map((_, i) => (
                <motion.rect
                    key={`star-${i}`}
                    x={Math.random() * VIEW_W * PX}
                    y={Math.random() * (VIEW_H * 0.7) * PX}
                    width={Math.random() > 0.9 ? PX : PX/2} 
                    height={Math.random() > 0.9 ? PX : PX/2}
                    fill={Math.random() > 0.8 ? C.cyan : C.star}
                    opacity={Math.random()}
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
                />
            ))}

            {/* Pixel Moon */}
            <g transform={`translate(${260*PX}, ${30*PX})`}>
                {renderSprite(MOON, { 'X': 'rgba(255,255,255,0.1)', 'M': C.moon }, PX)}
            </g>
        </g>
    );
};
