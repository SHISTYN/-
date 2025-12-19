import React from 'react';
import { BreathingPattern } from '../../types';
import SpotlightCard from '../SpotlightCard';
import IconRenderer from '../IconRenderer';

interface TechniqueCardProps {
    pattern: BreathingPattern;
    onClick: () => void;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ pattern, onClick }) => {
    // Helper for difficulty colors
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Новичок': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
            case 'Средний': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400';
            case 'Профи': return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400';
            default: return 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400';
        }
    };

    return (
        <SpotlightCard 
            onClick={onClick}
            className="bg-white/80 dark:bg-[#0f0f10]/60 backdrop-blur-xl rounded-[24px] p-6 cursor-pointer shadow-sm hover:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-white/5 flex flex-col h-full min-h-[300px]"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white group-hover:text-zen-accent dark:group-hover:text-zen-accent transition-colors leading-tight line-clamp-2">
                    {pattern.name}
                </h3>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border border-transparent dark:border-white/5 shrink-0 ml-2 ${getDifficultyColor(pattern.difficulty)}`}>
                    {pattern.difficulty}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed font-light">
                {pattern.description}
            </p>
            
            {/* Benefits Grid (Max 4) */}
            <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                {pattern.benefits && pattern.benefits.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px] text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 px-2 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden">
                        <IconRenderer iconName={b.icon} size={10} className="text-cyan-600 dark:text-zen-accent shrink-0" />
                        <span className="truncate">{b.label}</span>
                    </div>
                ))}
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center gap-3 text-xs font-mono text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-white/5 pt-4 group-hover:text-zen-accent dark:group-hover:text-zen-accent transition-colors">
                <i className="far fa-clock"></i>
                {pattern.mode === 'wim-hof' ? (
                    <span>Протокол: 3 Фазы</span>
                ) : pattern.mode === 'stopwatch' ? (
                    <span>Режим: Секундомер</span>
                ) : pattern.mode === 'manual' ? (
                    <span>Режим: Руководство</span>
                ) : (
                    <span>Паттерн: <span className="text-gray-900 dark:text-white font-bold">
                        {pattern.displayLabel ? pattern.displayLabel : `${pattern.inhale}-${pattern.holdIn}-${pattern.exhale}-${pattern.holdOut}`}
                    </span></span>
                )}
            </div>
        </SpotlightCard>
    );
};

export default TechniqueCard;