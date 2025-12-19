import React from 'react';
import { CATEGORY_NAMES } from '../../constants';

interface LibraryHeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    totalCount: number;
}

const LibraryHeader: React.FC<LibraryHeaderProps> = ({ 
    searchQuery, 
    onSearchChange, 
    selectedCategory, 
    onCategoryChange,
    totalCount 
}) => {
    const allCategories = ['All', ...Object.keys(CATEGORY_NAMES)];

    return (
        <header className="mb-20 text-center relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[100px] -z-10 opacity-50 pointer-events-none"></div>

            {/* Counter Badge */}
            <div className="inline-flex items-center justify-center mb-6 animate-fade-in">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-zen-accent text-[10px] font-bold uppercase tracking-[0.2em] shadow-glow-cyan backdrop-blur-md transition-transform hover:scale-105 cursor-default">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-zen-accent animate-pulse"></span>
                    {totalCount} Техник в базе
                </div>
            </div>

            {/* Hero Title */}
            <h2 className="text-5xl md:text-7xl font-display font-medium mb-8 text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-500 tracking-tight leading-[1.1]">
                Библиотека <br className="md:hidden" /> <span className="italic font-light text-zen-accent dark:text-zen-accent">Дыхания</span>
            </h2>
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Search Input */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <i className="fas fa-search text-gray-400 dark:text-gray-500 group-focus-within:text-zen-accent transition-colors duration-300"></i>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Поиск техник..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:border-zen-accent focus:ring-1 focus:ring-zen-accent/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 transition-all shadow-lg dark:shadow-none backdrop-blur-md hover:shadow-xl"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => onCategoryChange(cat)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all border duration-300 ${
                                selectedCategory === cat 
                                ? 'bg-cyan-100 dark:bg-zen-accent/20 text-cyan-700 dark:text-zen-accent border-cyan-200 dark:border-zen-accent/30 shadow-glow-cyan' 
                                : 'bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            {cat === 'All' ? 'Все' : CATEGORY_NAMES[cat]}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default LibraryHeader;