
import React from 'react';
import { C, PX } from './ForestConfig';

export const PredatorTree: React.FC = () => {
    return (
        <g id="layer-predator" transform={`translate(${280*PX}, ${80*PX})`}>
            {/* Just a dark mass on the right to frame the scene */}
            <rect x={0} y={0} width={40*PX} height={120*PX} fill={C.woodDark} />
            <rect x={-10*PX} y={20*PX} width={20*PX} height={4*PX} fill={C.woodDark} />
            <rect x={-20*PX} y={10*PX} width={30*PX} height={20*PX} fill={C.foliageDark} opacity="0.8" />
        </g>
    );
};
