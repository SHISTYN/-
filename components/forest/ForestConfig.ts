
import React from 'react';

// --- FOREST CONFIGURATION ---

// SCALING
export const PX = 4; // Perfect retro scale
export const VIEW_W = 320; 
export const VIEW_H = 200; 

// PALETTE (Deep Mystical Night)
export const C = {
    // Void
    void: '#050505',
    
    // Sky
    skyTop: '#0f0518',
    skyBottom: '#1e1b4b',
    star: '#ffffff',
    moon: '#fefce8',
    
    // Background Layers
    mtnFar: '#0c0a1f',
    mtnNear: '#171717',
    
    // Trees & Wood
    woodDark: '#0a0a0a', // Almost black silhouette
    woodLight: '#27272a', // Moonlight highlight
    
    // Flora
    foliageDark: '#022c22',
    foliageMid: '#15803d',
    foliageNeon: '#4ade80', // Radioactive green highlight
    
    // Teacher Plants
    cactusSkin: '#166534',
    cactusLight: '#22c55e',
    vine: '#3f6212',
    vineLeaf: '#84cc16',
    
    // The King (Mushroom)
    mushroomStalk: '#fefce8',
    mushroomCap: '#dc2626',
    mushroomShadow: '#991b1b',
    
    // Animals
    cat: '#000000',
    frogSkin: '#65a30d',
    frogBelly: '#bef264',
    
    // Accents
    gold: '#fbbf24',
    cyan: '#22d3ee',
    purple: '#a855f7',
    stone: '#3f3f46'
};

// HELPER: Sprite Renderer
export const renderSprite = (
    matrix: string[], 
    colorMap: Record<string, string>, 
    pixelSize: number = PX
) => {
    const rects: React.ReactNode[] = [];
    matrix.forEach((row, y) => {
        row.split('').forEach((char, x) => {
            if (char !== ' ' && char !== '.') {
                const color = colorMap[char];
                if (color) {
                    rects.push(
                        React.createElement('rect', {
                            key: `${x}-${y}`,
                            x: x * pixelSize,
                            y: y * pixelSize,
                            width: pixelSize,
                            height: pixelSize,
                            fill: color
                        })
                    );
                }
            }
        });
    });
    return rects;
};
