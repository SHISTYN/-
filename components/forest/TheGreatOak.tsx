
import React from 'react';
import { motion } from 'framer-motion';
import { C, PX, renderSprite } from './ForestConfig';

const CAT_SITTING = [
    "......X.",
    ".....X.X", // Ears
    "....XXXX",
    "....XEYE", // E=Eye
    "...XXXXX",
    "..XXXXX.",
    ".XXXX...",
    "XXXX....", // Tail start
];

const COLORS = {
    'X': C.cat,
    'E': C.gold,
    'Y': C.cat
};

export const TheGreatOak: React.FC = () => {
    return (
        <g id="layer-oak" transform={`translate(0, 0)`}>
            
            {/* --- TRUNK (Left Side) --- */}
            {/* Main mass */}
            <rect x={-10*PX} y={0} width={40*PX} height={200*PX} fill={C.woodDark} />
            
            {/* Branch extending right */}
            <rect x={0} y={60*PX} width={80*PX} height={4*PX} fill={C.woodDark} />
            <rect x={0} y={64*PX} width={40*PX} height={2*PX} fill={C.woodDark} /> {/* Thicker base */}

            {/* Hanging Moss / Leaves from branch */}
            {[20, 35, 50, 65].map((x, i) => (
                <rect key={i} x={x*PX} y={64*PX} width={PX} height={(4 + (i%2)*4)*PX} fill={C.foliageDark} opacity="0.8" />
            ))}

            {/* --- THE CAT --- */}
            <g transform={`translate(${45*PX}, ${44*PX})`}>
                {renderSprite(CAT_SITTING, COLORS, PX)}
                
                {/* Tail Animation */}
                <motion.rect 
                    x={0} y={7*PX} width={2*PX} height={4*PX} fill={C.cat}
                    animate={{ rotate: [0, -10, 0] }}
                    style={{ originY: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Blinking Eyes */}
                <motion.g animate={{ opacity: [1, 0, 1] }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 1] }}>
                    <rect x={5*PX} y={3*PX} width={PX} height={PX} fill={C.gold} />
                </motion.g>
            </g>

        </g>
    );
};
