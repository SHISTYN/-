
import React from 'react';
import { motion } from 'framer-motion';
import { C, PX, renderSprite } from './ForestConfig';

const MUSHROOM = [
    ".....RRRR.....",
    "...RRRRRRRR...",
    "..RRWWRRWWRR..",
    ".RRRRRRRRRRRR.",
    "RRRRRRRRRRRRRR",
    "RRWWRRRRRRWWRR",
    "RRRRRRRRRRRRRR",
    ".....SSSS.....",
    ".....SSSS.....",
    ".....SSSS.....",
    "....SSSSSS....", 
];

const FROG = [
    "G.G",
    "GGG",
    "GYG"
];

const COLORS = {
    'R': C.mushroomCap,
    'W': '#ffffff',
    'S': C.mushroomStalk,
    'G': C.frogSkin,
    'Y': C.frogBelly
};

export const TheKing: React.FC = () => {
    return (
        <g id="layer-king" transform={`translate(136, 120)`}> 
            
            {/* Altar Stone */}
            <rect x={-20*PX} y={40*PX} width={54*PX} height={10*PX} fill={C.stone} />
            <rect x={-15*PX} y={50*PX} width={44*PX} height={50*PX} fill={C.stone} opacity="0.8" />

            {/* MUSHROOM */}
            <g transform={`translate(0, 0)`}>
                {renderSprite(MUSHROOM, COLORS, PX)}
            </g>

            {/* FROG (On top of mushroom) */}
            <motion.g
                initial={{ y: -3*PX }}
                animate={{ y: [-3*PX, -4*PX, -3*PX] }} // Breathing
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <g transform={`translate(${5.5*PX}, ${-3*PX})`}>
                    {renderSprite(FROG, COLORS, PX)}
                </g>
            </motion.g>

            {/* Magic Spores */}
            {[...Array(6)].map((_, i) => (
                <motion.rect
                    key={i}
                    x={Math.random() * 40}
                    y={-10 + Math.random() * 20}
                    width={PX/2} height={PX/2}
                    fill={C.gold}
                    animate={{ y: [-10, -60], opacity: [0, 1, 0] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: Math.random() }}
                />
            ))}
        </g>
    );
};
