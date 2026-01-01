
import React from 'react';
import { C, PX } from './ForestConfig';

export const BackdropLayer: React.FC = () => {
    const pointsFar = `0,${140*PX} ${80*PX},${100*PX} ${160*PX},${130*PX} ${240*PX},${90*PX} ${320*PX},${140*PX} ${320*PX},${200*PX} 0,${200*PX}`;
    
    return (
        <g id="layer-backdrop">
            <polygon points={pointsFar} fill={C.mtnFar} />
            
            {/* Fog line */}
            <rect x={0} y={130*PX} width="100%" height={10*PX} fill={C.cyan} opacity="0.05" />
        </g>
    );
};
