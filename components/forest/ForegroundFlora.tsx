
import React from 'react';
import { C, PX, VIEW_W, renderSprite } from './ForestConfig';

const CACTUS = [
    " LLD ",
    " LLD ",
    " LLD ",
    " LLD ",
    "FL D ", // F = Flower
    " L D ",
    " L D "
];

const CACTUS_SMALL = [
    " LLD ",
    " LLD ",
    " LLD "
];

const COLORS = {
    'L': C.cactusLight,
    'D': C.cactusSkin,
    'F': C.purple // Flower
};

export const ForegroundFlora: React.FC = () => {
    // Generate vines
    const vinesX = [40, 100, 180, 240, 300];
    
    return (
        <g id="layer-flora">
            
            {/* --- GROUND --- */}
            <rect x={0} y={160*PX} width={VIEW_W*PX} height={40*PX} fill={C.foliageDark} />
            <rect x={0} y={160*PX} width={VIEW_W*PX} height={2*PX} fill={C.foliageMid} />

            {/* --- LEFT: SAN PEDRO GROUP --- */}
            <g transform={`translate(${10*PX}, ${132*PX})`}>
                {renderSprite(CACTUS, COLORS, PX)}
            </g>
            <g transform={`translate(${30*PX}, ${148*PX})`}>
                {renderSprite(CACTUS_SMALL, COLORS, PX)}
            </g>

            {/* --- TOP: HANGING VINES (AYAHUASCA) --- */}
            {vinesX.map((x, i) => {
                const height = 40 + (i % 3) * 20;
                return (
                    <g key={i} transform={`translate(${x*PX}, 0)`}>
                        <rect x={0} y={0} width={PX} height={height*PX} fill={C.vine} />
                        {/* Leaves */}
                        {[...Array(Math.floor(height/4))].map((_, j) => (
                            <rect 
                                key={j} 
                                x={(j%2 === 0 ? -PX : PX)} 
                                y={(j*4 + 2)*PX} 
                                width={PX} height={PX} 
                                fill={C.vineLeaf} 
                            />
                        ))}
                    </g>
                );
            })}

            {/* --- GRASS --- */}
            {[...Array(20)].map((_, i) => (
                <rect 
                    key={`grass-${i}`} 
                    x={(Math.random() * 300 + 10) * PX} 
                    y={(158 + Math.random() * 2) * PX} 
                    width={PX} height={2*PX} 
                    fill={C.foliageNeon} 
                    opacity="0.6"
                />
            ))}
        </g>
    );
};
