
import React, { useState } from 'react';
import EntheoLogo from './EntheoLogo';
import { SoundMode } from '../hooks/useAudioSystem';
import YinYangToggle from './YinYangToggle';

interface NavbarProps {
    view: 'timer' | 'library';
    setView: (v: 'timer' | 'library') => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    deferredPrompt: any;
    handleInstallClick: () => void;
    setShowPhilosophy: (v: boolean) => void;
    soundMode: SoundMode;
    changeSoundMode: (m: SoundMode) => void;
    handleShare: () => void;
    setShowMobileFaq: (v: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
    view,
    setView,
    theme,
    toggleTheme,
    deferredPrompt,
    handleInstallClick,
    setShowPhilosophy,
    soundMode,
    changeSoundMode,
    handleShare,
    setShowMobileFaq
}) => {
    const [showSoundMenu, setShowSoundMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const soundOptions: { id: SoundMode; label: string; icon: string }[] = [
        { id: 'mute', label: 'Без звука', icon: 'volume-mute' },
        { id: 'bell', label: 'Колокольчик', icon: 'bell' },
        { id: 'hang', label: 'Ханг (Hang)', icon: 'drum' },
        { id: 'bowl', label: 'Поющая чаша', icon: 'circle-notch' },
        { id: 'gong', label: 'Гонг', icon: 'record-vinyl' },
        { id: 'rain', label: 'Дождь', icon: 'cloud-showers-heavy' },
        { id: 'om', label: 'Ом (Синт)', icon: 'om' },
        { id: 'harp', label: 'Арфа', icon: 'music' },
        { id: 'flute', label: 'Флейта', icon: 'wind' },
    ];

    const handleSoundChange = (mode: SoundMode) => {
        changeSoundMode(mode);
        setShowSoundMenu(false);
        setShowMobileMenu(false);
    };

    return (
        <nav className="w-full h-20 md:h-24 bg-white/70 dark:bg-[#050505]/60 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/5 sticky top-0 z-40 flex-shrink-0 transition-colors duration-500">
            <div className="w-full px-4 md:px-6 h-full flex items-center justify-between mx-auto relative">
                
                <div className="flex items-center gap-3 cursor-pointer group relative flex-shrink-0" onClick={() => setView('library')}>
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative group-hover:scale-105 transition-transform duration-500 ease-out z-10">
                         <div className="block md:hidden"><EntheoLogo size={40} animated={true} idSuffix="nav-sm" /></div>
                         <div className="hidden md:block"><EntheoLogo size={64} animated={true} idSuffix="nav-lg" /></div>
                    </div>
                    <div className="flex flex-col z-10">
                        <h1 className="font-display font-bold text-xl md:text-3xl tracking-tight text-gray-900 dark:text-white leading-none transition-colors duration-500">
                            Entheo<span className="text-transparent bg-clip-text bg-gradient-to-r from-zen-accent via-premium-purple to-premium-gold">Breath</span>
                        </h1>
                    </div>
                </div>
                
                <div className="flex gap-2 md:gap-4 items-center relative">
                    
                    <YinYangToggle theme={theme} toggleTheme={toggleTheme} />

                    <div className="hidden md:flex items-center gap-4">
                        {deferredPrompt && (
                            <button 
                                onClick={handleInstallClick}
                                className="flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold bg-zen-accent/10 border border-zen-accent/30 text-zen-accent hover:bg-zen-accent/20 transition-all duration-300 hover:shadow-glow-cyan backdrop-blur-md animate-pulse-slow"
                            >
                                <i className="fas fa-download"></i>
                                <span className="tracking-wide">Установить</span>
                            </button>
                        )}

                        <button 
                            onClick={() => setShowPhilosophy(true)}
                            className="flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-premium-purple/30 transition-all duration-300 hover:shadow-glow-purple backdrop-blur-md"
                        >
                            <i className="fas fa-book-open text-premium-purple"></i>
                            <span className="tracking-wide">Философия</span>
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setShowSoundMenu(!showSoundMenu)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-xs font-bold transition-all border duration-300 backdrop-blur-md ${
                                    soundMode !== 'mute' 
                                    ? 'bg-zen-accent/5 border-zen-accent/20 text-cyan-600 dark:text-zen-accent shadow-glow-cyan' 
                                    : 'bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <i className={`fas fa-${soundOptions.find(o => o.id === soundMode)?.icon || 'bell'}`}></i>
                                <span className="tracking-wide">
                                    {soundOptions.find(o => o.id === soundMode)?.label || 'Звук'}
                                </span>
                                <i className="fas fa-chevron-down text-[9px] ml-1 opacity-60"></i>
                            </button>

                            {showSoundMenu && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSoundMenu(false)}></div>
                                <div className="absolute right-0 top-full mt-4 w-72 bg-white/90 dark:bg-[#121212]/90 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl py-3 z-50 animate-fade-in flex flex-col max-h-[400px] overflow-y-auto custom-scrollbar backdrop-blur-xl ring-1 ring-black/5">
                                    <div className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/5 mb-2">
                                        Атмосфера
                                    </div>
                                    {soundOptions.map((opt) => (
                                        <div 
                                            key={opt.id}
                                            className={`px-5 py-3.5 flex items-center justify-between gap-4 text-sm transition-all cursor-pointer group relative ${
                                                soundMode === opt.id 
                                                ? 'bg-cyan-50 dark:bg-zen-accent/10' 
                                                : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                            onClick={() => handleSoundChange(opt.id)}
                                        >
                                            {soundMode === opt.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-zen-accent shadow-[0_0_10px_#22d3ee]"></div>}
                                            <div className={`flex items-center gap-4 ${
                                                soundMode === opt.id ? 'text-cyan-700 dark:text-zen-accent font-bold' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'
                                            }`}>
                                                <div className="w-6 text-center"><i className={`fas fa-${opt.icon}`}></i></div>
                                                <span className="font-medium">{opt.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={handleShare} 
                            className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-400 hover:text-zen-accent dark:hover:text-zen-accent transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                            title="Поделиться"
                        >
                            <i className="fas fa-share-alt text-xl"></i>
                        </button>
                    </div>

                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 dark:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10"
                    >
                        <i className={`fas fa-${showMobileMenu ? 'times' : 'bars'} text-lg`}></i>
                    </button>

                    {showMobileMenu && (
                        <div className="absolute top-full right-0 mt-4 w-64 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl p-4 z-50 animate-fade-in origin-top-right md:hidden">
                            <div className="flex flex-col gap-2">
                                {deferredPrompt && (
                                    <button 
                                        onClick={handleInstallClick}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-zen-accent/10 text-zen-accent hover:bg-zen-accent/20 transition-colors animate-pulse-slow"
                                    >
                                        <i className="fas fa-download w-5 text-center"></i>
                                        <span className="tracking-wide">Установить приложение</span>
                                    </button>
                                )}

                                <button 
                                    onClick={() => { setShowPhilosophy(true); setShowMobileMenu(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <i className="fas fa-book-open text-premium-purple w-5 text-center"></i>
                                    <span className="tracking-wide">Философия</span>
                                </button>

                                <button 
                                    onClick={() => { handleShare(); setShowMobileMenu(false); }} 
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <i className="fas fa-share-alt text-zen-accent w-5 text-center"></i>
                                    <span className="tracking-wide">Поделиться</span>
                                </button>

                                <button 
                                    onClick={() => { setShowMobileFaq(true); setShowMobileMenu(false); }} 
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    <i className="far fa-question-circle text-gray-400 w-5 text-center"></i>
                                    <span className="tracking-wide">Помощь</span>
                                </button>

                                <div className="h-px bg-gray-200 dark:bg-white/10 my-1"></div>
                                
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 px-2 py-1">
                                    Звуки
                                </div>
                                <div className="grid grid-cols-1 gap-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {soundOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSoundChange(opt.id)}
                                            className={`px-3 py-2.5 rounded-lg flex items-center gap-3 text-xs transition-colors ${
                                                soundMode === opt.id 
                                                ? 'bg-cyan-50 dark:bg-zen-accent/10 text-cyan-700 dark:text-zen-accent font-bold border border-cyan-200 dark:border-zen-accent/30' 
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }`}
                                        >
                                            <i className={`fas fa-${opt.icon} w-5 text-center`}></i>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
