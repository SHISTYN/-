import React from 'react';
import { CATEGORY_NAMES } from '../../constants';

interface LibraryHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    totalCount: number;
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
}

const QUICK_FILTERS = [
    { label: '⚡️ Взбодриться', tags: ['wakeup', 'power'] },
    { label: '🌙 Уснуть', tags: ['sleep', 'insomnia'] },
    { label: '🆘 Стоп Паника', tags: ['panic', 'anxiety'] },
    { label: '🦅 Возврат Энергии', tags: ['energy-return', 'clearing'] },
];

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ 
    searchQuery, 
    onSearchChange, 
    selectedCategory, 
    onCategoryChange,
    totalCount,
    selectedTag,
    onTagSelect
}) => {
    // Inject 'AuthorChoice' right after 'All'
    const allCategories = ['All', 'AuthorChoice', 'Favorites', ...Object.keys(CATEGORY_NAMES)];

    const getCategoryLabel = (cat: string) => {
        if (cat === 'All') return 'Все';
        if (cat === 'Favorites') return '❤️ Избранное';
        if (cat === 'AuthorChoice') return '⚡️ Выбор Автора';
        return CATEGORY_NAMES[cat] || cat;
    };

    return (
        <header className="mb-12 text-center relative max-w-4xl mx-auto">
            {/* Background Glow - Reduced size for focus */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10 opacity-60 pointer-events-none"></div>

            {/* Top Row: Counter & Title */}
            <div className="flex flex-col items-center mb-6">
                <div className="inline-flex items-center justify-center mb-3 animate-fade-in">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-zen-accent text-[9px] font-bold uppercase tracking-[0.2em] shadow-glow-cyan backdrop-blur-md cursor-default">
                        <span className="w-1 h-1 rounded-full bg-cyan-500 dark:bg-zen-accent animate-pulse"></span>
                        {totalCount} Техник
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 tracking-tight leading-none">
                    Библиотека <span className="italic font-light text-zen-accent dark:text-zen-accent">Дыхания</span>
                </h2>
            </div>
            
            {/* Controls Group */}
            <div className="space-y-4">
                {/* Search Input */}
                <div className="relative group max-w-xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400 dark:text-gray-500 text-sm group-focus-within:text-zen-accent transition-colors duration-300"></i>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Найти по названию или состоянию..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all shadow-sm dark:shadow-none backdrop-blur-md hover:shadow-md"
                    />
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up">
                    {QUICK_FILTERS.map((filter) => {
                        const isActive = filter.tags.includes(selectedTag || '');
                        return (
                            <button
                                key={filter.label}
                                onClick={() => onTagSelect(isActive ? null : filter.tags[0])}
                                className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border duration-200 ${
                                    isActive 
                                    ? 'bg-rose-500 text-white border-rose-600 shadow-glow-purple scale-105' 
                                    : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                {filter.label}
                            </button>
                        );
                    })}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {allCategories.map(cat => {
                         const isAuthorChoice = cat === 'AuthorChoice';
                         const isSelected = selectedCategory === cat;
                         
                         // Special styling for Author Choice button
                         let btnClasses = isSelected
                            ? 'bg-cyan-100 dark:bg-zen-accent/20 text-cyan-700 dark:text-zen-accent border-cyan-200 dark:border-zen-accent/30 shadow-glow-cyan' 
                            : 'bg-transparent text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white';
                         
                         if (isAuthorChoice && !isSelected) {
                             btnClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40';
                         }
                         if (isAuthorChoice && isSelected) {
                             btnClasses = 'bg-amber-500 text-white border-amber-600 shadow-glow-gold';
                         }

                         return (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                className={`px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all border duration-300 ${btnClasses}`}
                            >
                                {getCategoryLabel(cat)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default LibraryHeader;