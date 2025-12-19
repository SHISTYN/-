import React from 'react';
import { BreathingPattern } from '../../types';
import SpotlightCard from '../SpotlightCard';
import IconRenderer from '../IconRenderer';
import { Heart } from 'lucide-react';

interface TechniqueCardProps {
    pattern: BreathingPattern;
    onClick: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

const TechniqueCard: React.FC<TechniqueCardProps> = ({ 
    pattern, 
    onClick, 
    isFavorite = false, 
    onToggleFavorite 
}) => {
    // Helper for difficulty colors
    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Новичок': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
            case 'Средний': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400';
            case 'Профи': return 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400';
            default: return 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-400';
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggleFavorite) {
            onToggleFavorite(pattern.id);
        }
    };

    return (
        <SpotlightCard 
            onClick={onClick}
            className="bg-white/90 dark:bg-[#0f0f10]/80 backdrop-blur-xl rounded-[24px] p-5 cursor-pointer shadow-sm hover:shadow-2xl dark:shadow-black/50 border border-gray-200 dark:border-white/5 flex flex-col h-full min-h-[260px] group relative"
        >
            {/* Favorite Button */}
            <button 
                onClick={handleFavoriteClick}
                className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-90"
            >
                <Heart 
                    size={20} 
                    className={`transition-colors duration-300 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-300 dark:text-gray-600 hover:text-rose-500'}`} 
                />
            </button>

            {/* Header: Tighter vertical spacing */}
            <div className="flex flex-col gap-2 mb-3 pr-10">
                <div className="flex items-center gap-2">
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-transparent dark:border-white/5 shrink-0 ${getDifficultyColor(pattern.difficulty)}`}>
                        {pattern.difficulty}
                    </span>
                </div>
                <h3 className="text-lg font-display font-extrabold text-gray-900 dark:text-white group-hover:text-zen-accent dark:group-hover:text-zen-accent transition-colors leading-tight">
                    {pattern.name}
                </h3>
            </div>

            {/* Description: Increased line clamp for more content */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-4 leading-relaxed font-medium flex-grow opacity-95">
                {pattern.description}
            </p>
            
            {/* Benefits Grid: Larger text (11px+) and icons */}
            <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                {pattern.benefits && pattern.benefits.slice(0, 4).map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden">
                        <IconRenderer iconName={b.icon} size={13} className="text-cyan-600 dark:text-zen-accent shrink-0" />
                        <span className="truncate">{b.label}</span>
                    </div>
                ))}
            </div>

            {/* Footer Metadata: Bigger, bolder, easier to read */}
            <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-white/5 pt-3 group-hover:text-zen-accent dark:group-hover:text-zen-accent transition-colors">
                <i className="far fa-clock text-xs"></i>
                <span className="truncate">
                    {pattern.mode === 'wim-hof' ? (
                        <span>Протокол: 3 Фазы</span>
                    ) : pattern.mode === 'stopwatch' ? (
                        <span>Секундомер</span>
                    ) : pattern.mode === 'manual' ? (
                        <span>Руководство</span>
                    ) : (
                        <span className="flex items-center">
                            Паттерн: 
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                                {pattern.displayLabel ? pattern.displayLabel : `${pattern.inhale}-${pattern.holdIn}-${pattern.exhale}-${pattern.holdOut}`}
                            </span>
                        </span>
                    )}
                </span>
            </div>
        </SpotlightCard>
    );
};

export default TechniqueCard;