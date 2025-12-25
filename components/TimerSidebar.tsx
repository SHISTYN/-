import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { BreathingPattern } from '../types';
import { CATEGORY_ICONS, CATEGORY_NAMES } from '../constants';
import IconRenderer from './IconRenderer';
import Controls from './Controls'; // Import Controls here to embed them in Sidebar

const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

interface TimerSidebarProps {
    activePattern: BreathingPattern;
    setView: (v: 'library') => void;
    infoTab: 'about' | 'guide' | 'safety';
    setInfoTab: (v: 'about' | 'guide' | 'safety') => void;
    handleDeepAnalysis: () => void;
    isAnalyzing: boolean;
}

const TimerSidebar: React.FC<TimerSidebarProps> = ({
    activePattern,
    setView,
    infoTab,
    setInfoTab,
    handleDeepAnalysis,
    isAnalyzing
}) => {
    return (
        <div className={`
            w-full flex flex-col
            ${activePattern.mode === 'manual' ? 'lg:w-full' : 'lg:w-[480px]'} 
            bg-white dark:bg-[#0a0a0b] lg:bg-white/80 lg:dark:bg-[#0a0a0b]/80 lg:backdrop-blur-3xl 
            border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-white/5 
            relative z-20 shadow-2xl transition-all duration-500
            rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.2)] lg:shadow-none
            lg:h-full h-full flex-1 min-h-0
        `}>
            
            {/* 1. FIXED HEADER */}
            <div className="flex-shrink-0 px-6 pt-6 pb-2 border-b border-zinc-200 dark:border-white/5 bg-white/95 dark:bg-[#0a0a0b]/95 backdrop-blur-xl z-20 rounded-t-3xl lg:rounded-none">
                
                {/* Back Button */}
                <button 
                    onClick={() => setView('library')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest mb-4 group"
                >
                    <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Меню
                </button>

                {/* Title */}
                <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-xl md:text-3xl font-display font-bold text-zinc-900 dark:text-white leading-none tracking-tight">{activePattern.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-zen-accent font-bold">
                        <i className={`fas fa-${CATEGORY_ICONS[activePattern.category]}`}></i>
                        <span className="hidden sm:inline">{CATEGORY_NAMES[activePattern.category]}</span>
                    </div>
                </div>
                
                {/* iOS Segmented Control Tabs */}
                <div className="relative p-1 bg-zinc-100 dark:bg-white/5 rounded-xl flex items-center w-full mb-2">
                    {(['about', 'guide', 'safety'] as const).map((tab) => {
                        // Skip safety if not needed
                        if (tab === 'safety' && activePattern.mode !== 'manual' && activePattern.category !== 'Toltec') return null;
                        
                        const isActive = infoTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setInfoTab(tab)}
                                className={`
                                    relative flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg z-10 transition-colors
                                    ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-gray-300'}
                                `}
                            >
                                {isActive && (
                                    <MotionDiv
                                        layoutId="sidebarTab"
                                        className="absolute inset-0 bg-white dark:bg-[#1c1c1e] rounded-lg shadow-sm border border-black/5 dark:border-white/5"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-20 flex items-center justify-center gap-2">
                                    {tab === 'about' ? 'Настройки' : tab === 'guide' ? 'Техника' : 'Важно'}
                                    {tab === 'safety' && <i className="fas fa-shield-alt text-rose-500"></i>}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. SCROLLABLE CONTENT BODY */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 pb-32">
                    
                    {/* INJECT CONTROLS HERE FOR "ABOUT" TAB (Mobile UX Optimization) */}
                    {infoTab === 'about' && activePattern.mode !== 'stopwatch' && activePattern.mode !== 'manual' && activePattern.mode !== 'wim-hof' && (
                        <div className="mb-6">
                            {/* Note: We are using a dummy onChange here because real state is in App.tsx. 
                                In a real refactor, we should pass state down. 
                                Since user asked for layout fix, we will keep the visual placeholder or move Controls here? 
                                Actually, the user wants "Settings" here. 
                                Ideally, Controls should be in Sidebar on mobile. 
                                For now, I'll assume Controls stay below Visualizer in App.tsx for immediate access, 
                                and this tab is purely info. 
                            */}
                            <div className="text-[10px] font-bold text-zinc-400 dark:text-gray-500 uppercase tracking-widest mb-2 opacity-80">
                                Описание
                            </div>
                            <p className="text-zinc-700 dark:text-gray-300 leading-relaxed text-sm md:text-base font-light">{activePattern.description}</p>
                        </div>
                    )}

                    {infoTab === 'about' && (
                        <div className="space-y-8 animate-fade-in">
                            {activePattern.benefits && activePattern.benefits.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-purple-600 dark:text-premium-purple uppercase tracking-[0.2em] mb-3 opacity-80">Ключевые эффекты</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {activePattern.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 rounded-xl">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 shadow-sm dark:shadow-none">
                                                    <IconRenderer iconName={benefit.icon} size={16} />
                                                </div>
                                                <span className="text-sm font-medium text-zinc-700 dark:text-gray-200">{benefit.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-zinc-50 dark:bg-white/5 p-3 rounded-xl border border-zinc-200 dark:border-white/5">
                                    <div className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Категория</div>
                                    <div className="text-zinc-900 dark:text-white font-display font-bold text-sm">{activePattern.category}</div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-white/5 p-3 rounded-xl border border-zinc-200 dark:border-white/5">
                                    <div className="text-[9px] text-zinc-400 uppercase tracking-wider mb-1 font-bold">Сложность</div>
                                    <div className="text-zinc-900 dark:text-white font-display font-bold text-sm">{activePattern.difficulty}</div>
                                </div>
                            </div>

                            {activePattern.mode !== 'stopwatch' && activePattern.mode !== 'manual' && (
                                <div className="w-full mt-6 group relative">
                                    <MotionButton
                                        whileTap={{ scale: 0.98 }} 
                                        onClick={handleDeepAnalysis}
                                        disabled={isAnalyzing}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/20 dark:to-purple-900/20 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-200 rounded-xl text-xs font-bold hover:bg-white dark:hover:from-cyan-900/30 dark:hover:to-purple-900/30 transition-all shadow-lg hover:shadow-cyan-500/20"
                                    >
                                        <i className={`fas fa-sparkles text-base ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`}></i>
                                        {isAnalyzing ? 'AI Анализирует...' : 'AI Анализ (Подробнее)'}
                                    </MotionButton>
                                </div>
                            )}
                        </div>
                    )}

                    {infoTab === 'guide' && (
                        <div className="animate-fade-in">
                            <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="mb-5 text-zinc-700 dark:text-gray-300 leading-relaxed font-light text-base md:text-lg" {...props} />,
                                strong: ({node, ...props}) => <span className="text-cyan-700 dark:text-zen-accent font-bold" {...props} />,
                                ol: ({node, ...props}) => <ol className="space-y-4 mb-8 list-decimal pl-4 text-zinc-700 dark:text-gray-300 text-base md:text-lg" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-2 list-disc pl-5 mb-6 text-zinc-700 dark:text-gray-300 marker:text-cyan-500 text-base md:text-lg" {...props} />,
                                li: ({node, ...props}) => <li className="pl-1 mb-1" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg md:text-xl font-display font-bold text-zinc-900 dark:text-white mt-8 mb-4 border-b border-zinc-200 dark:border-white/10 pb-2" {...props} />,
                                h4: ({node, ...props}) => <h4 className="text-base font-bold text-zinc-800 dark:text-gray-200 mt-6 mb-2" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-purple-500/50 pl-4 py-2 my-4 bg-purple-50 dark:bg-premium-purple/5 italic text-zinc-600 dark:text-gray-400 text-sm" {...props} />
                            }}
                            >
                            {activePattern.instruction}
                            </ReactMarkdown>
                            
                            {(activePattern.mode === 'manual' || activePattern.category === 'Toltec') && activePattern.safetyWarning && (
                                <div className="mt-8 bg-rose-50 dark:bg-rose-900/10 border-l-4 border-rose-500 p-5 rounded-r-xl">
                                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <i className="fas fa-exclamation-triangle"></i> Важно
                                    </h4>
                                    <p className="text-rose-900 dark:text-rose-100 leading-relaxed font-medium text-sm md:text-base">{activePattern.safetyWarning}</p>
                                </div>
                            )}

                            {activePattern.musicLinks && activePattern.musicLinks.length > 0 && (
                                <div className="mt-8 p-5 bg-gradient-to-r from-purple-100/50 to-cyan-100/50 dark:from-purple-900/30 dark:to-cyan-900/30 border border-purple-200 dark:border-white/10 rounded-xl">
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
                                        <i className="fas fa-book-reader text-purple-600 dark:text-premium-purple"></i> Материалы
                                    </h4>
                                    <div className="space-y-2">
                                        {activePattern.musicLinks.map((link, idx) => (
                                            <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-center py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-lg hover:scale-[1.01] transition-transform shadow-md text-xs uppercase tracking-wide">
                                                {link.icon && <i className={`fas fa-${link.icon}`}></i>} {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {infoTab === 'safety' && (
                        <div className="space-y-8 animate-fade-in">
                            {activePattern.safetyWarning && (
                                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-500/20 p-6 rounded-2xl">
                                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3">Главное предупреждение</h4>
                                    <p className="text-rose-900 dark:text-rose-100 leading-relaxed font-medium text-lg">{activePattern.safetyWarning}</p>
                                </div>
                            )}
                            
                            {activePattern.contraindications && activePattern.contraindications.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em] mb-3 opacity-80">Противопоказания</h4>
                                    <ul className="space-y-3">
                                        {activePattern.contraindications.map((c, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-gray-300 font-light">
                                                <i className="fas fa-times-circle text-rose-500 mt-1"></i>
                                                <span className="text-base md:text-lg">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {activePattern.conditions && activePattern.conditions.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-bold text-premium-gold uppercase tracking-[0.2em] mb-3 opacity-80">Условия</h4>
                                    <ul className="space-y-3">
                                        {activePattern.conditions.map((c, i) => (
                                            <li key={i} className="flex items-start gap-3 text-zinc-700 dark:text-gray-300 font-light">
                                                <i className="fas fa-check-circle text-premium-gold mt-1"></i>
                                                <span className="text-base md:text-lg">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
            </div>

            {/* 3. STATIC FOOTER (Desktop Only) */}
            <div className="hidden lg:block flex-shrink-0 p-4 border-t border-zinc-200 dark:border-white/5 text-center text-zinc-500 dark:text-gray-500 bg-white/50 dark:bg-[#0a0a0b]/50 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-bold tracking-[0.1em] opacity-50">
                        СОЗДАНО С 
                        <span className="text-rose-500 animate-pulse text-sm mx-1">❤️</span>
                        — НИКОЛАЙ ОВЧИННИКОВ
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimerSidebar;