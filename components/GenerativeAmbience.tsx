
import React from 'react';
import { useAudioEngine } from '../context/AudioContext';
import { Wind, PlayCircle, PauseCircle } from 'lucide-react';

export const GenerativeAmbience: React.FC = () => {
    const { activeAmbience, toggleAmbience } = useAudioEngine();

    return (
        <button 
            onClick={(e) => { e.stopPropagation(); toggleAmbience(); }}
            className={`w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between transition-colors group relative ${
                activeAmbience 
                ? 'bg-cyan-50 dark:bg-zen-accent/10 text-cyan-700 dark:text-zen-accent' 
                : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
            }`}
        >
            {activeAmbience && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>}
            
            <div className="flex items-center gap-4">
                <div className="w-6 text-center">
                    <Wind size={18} className={activeAmbience ? 'animate-pulse' : ''} />
                </div>
                <div className="flex flex-col">
                     <span className="font-medium">Ветер (Природа)</span>
                     <span className="text-[10px] opacity-60 font-normal">Генеративный поток</span>
                </div>
            </div>
            
            <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                {activeAmbience ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
            </div>
        </button>
    );
};
