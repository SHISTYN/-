import React, { useState, useMemo } from 'react';
import { BreathingPattern } from '../types';
import { DEFAULT_PATTERNS, CATEGORY_NAMES, CATEGORY_ICONS } from '../constants';
import TechniqueCard from './library/TechniqueCard';
import LibraryHeader from './library/LibraryHeader';

interface LibraryViewProps {
    selectPattern: (p: BreathingPattern) => void;
}

const LibraryView: React.FC<LibraryViewProps> = ({ selectPattern }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Memoize filtering to prevent re-calc on every render
    const filteredGroupedPatterns = useMemo(() => {
        let patterns = DEFAULT_PATTERNS;
        
        // 1. Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            patterns = patterns.filter(p => 
                p.name.toLowerCase().includes(lowerQuery) || 
                p.description.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery)
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'All') {
            patterns = patterns.filter(p => p.category === selectedCategory);
        }

        // 3. Group by Category
        return patterns.reduce((acc, pattern) => {
            if (!acc[pattern.category]) acc[pattern.category] = [];
            acc[pattern.category].push(pattern);
            return acc;
        }, {} as Record<string, BreathingPattern[]>);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="animate-fade-in p-6 md:p-16 pb-32">
            <div className="max-w-7xl mx-auto">
                
                {/* ISOLATED HEADER COMPONENT */}
                <LibraryHeader 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    totalCount={DEFAULT_PATTERNS.length}
                />
                
                {/* GRID SECTION */}
                <div className="space-y-20">
                    {Object.entries(filteredGroupedPatterns).map(([category, patterns], catIdx) => (
                        <div key={category} className="animate-fade-in-up" style={{ animationDelay: `${catIdx * 100}ms` }}>
                            
                            {/* Category Title */}
                            <div className="flex items-center gap-5 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-100/50 dark:bg-white/5 flex items-center justify-center border border-cyan-200/50 dark:border-white/5 text-cyan-600 dark:text-zen-accent text-xl shadow-lg backdrop-blur-sm">
                                    <i className={`fas fa-${CATEGORY_ICONS[category] || 'wind'}`}></i>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                                    {CATEGORY_NAMES[category] || category}
                                </h3>
                            </div>
                            
                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {patterns.map((p) => (
                                    <TechniqueCard 
                                        key={p.id} 
                                        pattern={p} 
                                        onClick={() => selectPattern(p)} 
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {Object.keys(filteredGroupedPatterns).length === 0 && (
                        <div className="text-center py-20 opacity-50">
                            <i className="fas fa-wind text-4xl mb-4 text-gray-400"></i>
                            <p className="text-xl font-display">Техники не найдены</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* FOOTER */}
            <footer className="mt-32 pb-10 text-center animate-fade-in text-gray-500 dark:text-gray-500">
                <div className="flex flex-col items-center gap-6">
                    <div className="text-sm font-bold tracking-[0.1em] opacity-70">
                        СОЗДАНО С 
                        <a 
                            href="https://t.me/+D78P1fpaduBlOTc6" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mx-1 align-middle cursor-default"
                        >
                            <span className="text-rose-500 animate-pulse text-lg">❤️</span>
                        </a> 
                        — <a href="https://t.me/nikolaiovchinnikov" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors border-b border-transparent hover:border-cyan-500">НИКОЛАЙ ОВЧИННИКОВ</a>
                    </div>
                    <a 
                        href="https://t.me/nikolaiovchinnikov" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-[#1c1c1e] border border-gray-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-500 hover:scale-105 transition-all text-xs font-bold uppercase tracking-widest shadow-lg"
                    >
                        <i className="fab fa-telegram-plane text-cyan-500 text-lg"></i>
                        Предложения и обратная связь
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LibraryView;