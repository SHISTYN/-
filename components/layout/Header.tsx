
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { 
  Music, Menu, X, Moon, Sun, Share2, Download, BookOpen, Library,
  Sparkles, Waves, Brain, PlayCircle, PauseCircle, Infinity as InfinityIcon, Clock,
  Volume2, CloudRain, Bell, Drum, CircleDot, Wind, Zap, Sliders, Radio, Gem
} from 'lucide-react';
import { PHILOSOPHY_CONTENT } from '../../constants';
import EntheoLogo from '../EntheoLogo';
import { useAudioEngine, SolfeggioFreq, PlaybackMode, NoiseColor } from '../../context/AudioContext';
import { SoundMode } from '../../hooks/useAudioSystem';

const MotionHeader = motion.header as any;
const MotionDiv = motion.div as any;

interface HeaderProps {
    view: 'timer' | 'library';
    setView: (v: 'timer' | 'library') => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    deferredPrompt: any;
    handleInstallClick: () => void;
    handleShare: () => void;
    setShowMobileFaq: (v: boolean) => void;
    soundMode: SoundMode;
    changeSoundMode: (m: SoundMode) => void;
}

const NAV_ITEMS = [
  { id: 'library', label: 'Библиотека', icon: Library },
  { id: 'philosophy', label: 'Философия', icon: BookOpen },
] as const;

const SOLFEGGIO_LIST: { freq: SolfeggioFreq; label: string; desc: string }[] = [
    { freq: 396, label: '396 Гц', desc: 'Освобождение от вины и страха' },
    { freq: 417, label: '417 Гц', desc: 'Нейтрализация и перемены' },
    { freq: 432, label: '432 Гц', desc: 'Гармония Вселенной' },
    { freq: 528, label: '528 Гц', desc: 'Трансформация ДНК' },
    { freq: 639, label: '639 Гц', desc: 'Связь и отношения' },
    { freq: 741, label: '741 Гц', desc: 'Пробуждение интуиции' },
    { freq: 852, label: '852 Гц', desc: 'Духовный порядок' },
];

const TIMER_SOUNDS: { id: SoundMode; label: string; icon: any }[] = [
    { id: 'mute', label: 'Тишина', icon: Volume2 },
    { id: 'bell', label: 'Колокольчик', icon: Bell },
    { id: 'hang', label: 'Ханг (Hang)', icon: Drum },
    { id: 'bowl', label: 'Поющая Чаша', icon: CircleDot },
    { id: 'om', label: 'ОМ (Вибрация)', icon: Sparkles },
    { id: 'rain', label: 'Дождь (Стик)', icon: CloudRain },
];

export const Header: React.FC<HeaderProps> = ({
    view,
    setView,
    theme,
    toggleTheme,
    deferredPrompt,
    handleInstallClick,
    handleShare,
    setShowMobileFaq,
    soundMode,
    changeSoundMode
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);
    const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);
    
    // Audio Engine Connection
    const { 
        activeBinaural, toggleBinaural, 
        activeSolfeggio, setSolfeggio,
        activeCrystalMode, toggleCrystalMode,
        playbackMode, setPlaybackMode,
        activeAmbience, toggleAmbience, windIntensity, setWindIntensity,
        activeNoise, toggleNoise, noiseColor, setNoiseColor
    } = useAudioEngine();

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (id: string) => {
        if (id === 'philosophy') {
            setIsPhilosophyOpen(true);
        } else if (id === 'library') {
            setView('library');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const isAudioActive = activeBinaural !== 'none' || activeSolfeggio !== 0 || activeAmbience || activeNoise || activeCrystalMode;

    return (
        <>
        {/* --- FLOATING GLASS CAPSULE --- */}
        <MotionHeader
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div 
                className={`
                    relative pointer-events-auto
                    w-full max-w-5xl
                    flex items-center justify-between
                    bg-zinc-900/60 backdrop-blur-lg
                    border border-white/10 rounded-full 
                    shadow-2xl
                    px-4 py-2 md:px-6 md:py-3
                    transition-all duration-300 ease-out
                    ${isScrolled ? 'bg-zinc-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-white/5' : ''}
                `}
            >
                {/* 1. LOGO AREA */}
                <div 
                    onClick={() => handleNavClick('library')}
                    className="flex items-center gap-2 md:gap-3 pl-1 cursor-pointer group shrink-0"
                >
                    <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 border border-white/5 group-hover:border-cyan-500/30 transition-colors shadow-inner">
                         <EntheoLogo className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <span className="font-display font-bold text-white tracking-wide text-sm md:text-base">
                        Entheo<span className="text-zinc-500">Breath</span>
                    </span>
                </div>

                {/* 2. NAVIGATION (CENTER) */}
                <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 rounded-full p-1 border border-white/5">
                    {NAV_ITEMS.map((item) => {
                        const isActive = (view === (item.id as string)) && !isPhilosophyOpen && (item.id !== 'philosophy');
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`
                                    relative px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                                    flex items-center gap-2
                                    ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}
                                `}
                            >
                                {isActive && (
                                    <MotionDiv
                                        layoutId="navPill"
                                        className="absolute inset-0 bg-white/10 rounded-full shadow-sm border border-white/5"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon size={14} className={isActive ? "text-cyan-400" : ""} />
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* 3. ACTIONS (RIGHT) */}
                <div className="flex items-center gap-1.5 md:gap-2 pr-1 shrink-0">
                    
                    {/* Sound Toggle */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all ${
                                isAudioActive
                                ? 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 shadow-glow-cyan' 
                                : 'text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Music size={18} className={isAudioActive ? 'animate-pulse' : ''} />
                        </button>

                        <AnimatePresence>
                            {isSoundMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSoundMenuOpen(false)}></div>
                                <MotionDiv
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 top-full mt-3 w-80 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 backdrop-blur-xl max-h-[85vh] flex flex-col"
                                >
                                    {/* Playback Mode Selector */}
                                    <div className="p-3 bg-black/40 border-b border-white/5 flex gap-2">
                                        <button 
                                            onClick={() => setPlaybackMode('always')}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${playbackMode === 'always' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/5 text-zinc-500'}`}
                                        >
                                            <InfinityIcon size={12} /> Всегда
                                        </button>
                                        <button 
                                            onClick={() => setPlaybackMode('practice_only')}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${playbackMode === 'practice_only' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-zinc-500'}`}
                                        >
                                            <Clock size={12} /> В таймере
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto custom-scrollbar">
                                        
                                        {/* SECTION 1: NATURE & ATMOSPHERE */}
                                        <div className="bg-black/20 border-b border-white/5 pb-2">
                                            <div className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-500/70">
                                                Атмосфера
                                            </div>

                                            {/* CRYSTAL BOWLS GENERATIVE */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleCrystalMode(); }}
                                                className={`w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between transition-colors group relative ${
                                                    activeCrystalMode 
                                                    ? 'bg-purple-500/10 text-purple-300' 
                                                    : 'hover:bg-white/5 text-gray-500 hover:text-white'
                                                }`}
                                            >
                                                {activeCrystalMode && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_purple]"></div>}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 text-center"><Gem size={18} className={activeCrystalMode ? 'animate-pulse' : ''} /></div>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">Хрустальная Сессия</span>
                                                        <span className="text-[10px] text-gray-400 font-normal">Генеративные чаши (Live)</span>
                                                    </div>
                                                </div>
                                                <div className="opacity-50 group-hover:opacity-100">{activeCrystalMode ? <PauseCircle size={16} /> : <PlayCircle size={16} />}</div>
                                            </button>
                                            
                                            {/* WIND GENERATOR + SLIDER */}
                                            <div className="relative">
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
                                                        <div className="w-6 text-center"><Wind size={18} className={activeAmbience ? 'animate-pulse' : ''} /></div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">Ветер (Природа)</span>
                                                            <span className="text-[10px] opacity-60 font-normal">Генеративный поток</span>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-50 group-hover:opacity-100">{activeAmbience ? <PauseCircle size={16} /> : <PlayCircle size={16} />}</div>
                                                </button>
                                                {/* Wind Intensity Slider */}
                                                {activeAmbience && (
                                                    <div className="px-5 pb-3 pt-0 bg-cyan-50 dark:bg-zen-accent/10 animate-fade-in">
                                                        <div className="flex items-center gap-3">
                                                            <Sliders size={12} className="text-cyan-600/50" />
                                                            <input 
                                                                type="range" 
                                                                min="0" max="1" step="0.05"
                                                                value={windIntensity}
                                                                onChange={(e) => setWindIntensity(parseFloat(e.target.value))}
                                                                className="w-full h-1 bg-cyan-200 dark:bg-cyan-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* STATIC NOISE GENERATOR + COLOR PICKER */}
                                            <div className="relative">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); toggleNoise(); }}
                                                    className={`w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between transition-colors group relative ${
                                                        activeNoise 
                                                        ? 'bg-stone-50 dark:bg-white/10 text-stone-700 dark:text-white' 
                                                        : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {activeNoise && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>}
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-6 text-center"><Radio size={18} className={activeNoise ? 'animate-pulse' : ''} /></div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">Шум (Фокус)</span>
                                                            <span className="text-[10px] opacity-60 font-normal">Спектральный шум</span>
                                                        </div>
                                                    </div>
                                                    <div className="opacity-50 group-hover:opacity-100">{activeNoise ? <PauseCircle size={16} /> : <PlayCircle size={16} />}</div>
                                                </button>
                                                
                                                {/* Noise Color Selector */}
                                                {activeNoise && (
                                                    <div className="px-5 pb-3 pt-1 bg-stone-50 dark:bg-white/10 animate-fade-in flex gap-2">
                                                        {(['brown', 'pink', 'white'] as NoiseColor[]).map((c) => (
                                                            <button 
                                                                key={c}
                                                                onClick={() => setNoiseColor(c)}
                                                                className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                                    noiseColor === c 
                                                                    ? 'bg-white text-black border-white' 
                                                                    : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400'
                                                                }`}
                                                            >
                                                                {c === 'brown' ? 'Глуб' : c === 'pink' ? 'Баланс' : 'Высок'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Binaural Controls */}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleBinaural('theta'); }}
                                                className={`w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between transition-colors group relative ${activeBinaural === 'theta' ? 'bg-purple-500/10 text-purple-400' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}
                                            >
                                                {activeBinaural === 'theta' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_purple]"></div>}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 text-center"><Waves size={18} /></div>
                                                    <div className="flex flex-col">
                                                        <span>Theta (4Hz)</span>
                                                        <span className="text-[10px] opacity-50 font-normal">Глубокая медитация</span>
                                                    </div>
                                                </div>
                                                <div className="opacity-50 group-hover:opacity-100">{activeBinaural === 'theta' ? <PauseCircle size={16}/> : <PlayCircle size={16}/>}</div>
                                            </button>
                                            
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleBinaural('alpha'); }}
                                                className={`w-full text-left px-5 py-3.5 text-sm font-bold flex items-center justify-between transition-colors group relative ${activeBinaural === 'alpha' ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}
                                            >
                                                {activeBinaural === 'alpha' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_blue]"></div>}
                                                <div className="flex items-center gap-4">
                                                    <div className="w-6 text-center"><Brain size={18} /></div>
                                                    <div className="flex flex-col">
                                                        <span>Alpha (10Hz)</span>
                                                        <span className="text-[10px] opacity-50 font-normal">Релакс и фокус</span>
                                                    </div>
                                                </div>
                                                <div className="opacity-50 group-hover:opacity-100">{activeBinaural === 'alpha' ? <PauseCircle size={16}/> : <PlayCircle size={16}/>}</div>
                                            </button>
                                        </div>

                                        {/* SECTION 2: SOLFEGGIO */}
                                        <div className="pb-2 border-b border-white/5">
                                            <div className="px-5 py-3 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/70">
                                                Сольфеджио (Тон)
                                            </div>
                                            {SOLFEGGIO_LIST.map((item) => (
                                                <button
                                                    key={item.freq}
                                                    onClick={() => setSolfeggio(item.freq)}
                                                    className={`w-full text-left px-5 py-3 text-xs flex items-center justify-between transition-colors group ${activeSolfeggio === item.freq ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                                        <span className="text-[10px] opacity-60">{item.desc}</span>
                                                    </div>
                                                    <div className={`transition-opacity ${activeSolfeggio === item.freq ? 'opacity-100' : 'opacity-30 group-hover:opacity-100'}`}>
                                                        {activeSolfeggio === item.freq ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>

                                        {/* SECTION 3: TIMER SOUNDS */}
                                        <div className="pb-4">
                                            <div className="px-5 py-3 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500/70">
                                                Звук Таймера (Тик)
                                            </div>
                                            {TIMER_SOUNDS.map((snd) => (
                                                <button
                                                    key={snd.id}
                                                    onClick={() => changeSoundMode(snd.id)}
                                                    className={`w-full text-left px-5 py-3 text-xs flex items-center gap-3 transition-colors ${soundMode === snd.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    <div className="w-4 flex justify-center">
                                                        <snd.icon size={14} />
                                                    </div>
                                                    <span className="font-bold tracking-wide">{snd.label}</span>
                                                    {soundMode === snd.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </MotionDiv>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>

                    {/* Desktop Share */}
                    <button 
                        onClick={handleShare}
                        className="hidden md:flex w-9 h-9 md:w-10 md:h-10 rounded-full items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Share2 size={18} />
                    </button>

                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 bg-white/5 border border-white/10 ml-2"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                </div>
            </div>
        </MotionHeader>

        {/* --- PHILOSOPHY MODAL --- */}
        <AnimatePresence>
            {isPhilosophyOpen && (
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                >
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsPhilosophyOpen(false)} 
                    />
                    
                    <MotionDiv 
                        initial={{ scale: 0.95, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-[#0f0f10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <BookOpen size={20} className="text-premium-purple" />
                                Философия Практики
                            </h2>
                            <button 
                                onClick={() => setIsPhilosophyOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                            >
                                <X size={16} className="text-white" />
                            </button>
                        </div>

                        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                            <ReactMarkdown
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-6" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-cyan-400 mt-6 mb-3 uppercase tracking-wide" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-4 text-gray-300 leading-relaxed font-light" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-2 mb-6 pl-4" {...props} />,
                                    li: ({node, ...props}) => (
                                        <li className="flex items-start gap-3 text-gray-300">
                                            <span className="mt-2 w-1 h-1 rounded-full bg-purple-500 shrink-0"></span>
                                            <span>{props.children}</span>
                                        </li>
                                    ),
                                    strong: ({node, ...props}) => <strong className="text-white font-bold" {...props} />,
                                    a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300 underline underline-offset-4" {...props} />
                                }}
                            >
                                {PHILOSOPHY_CONTENT}
                            </ReactMarkdown>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>

        {/* --- MOBILE MENU DRAWER --- */}
        <AnimatePresence>
            {isMobileMenuOpen && (
                <>
                    <MotionDiv 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                    <MotionDiv
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 left-0 right-0 bg-[#0f0f10] border-b border-white/10 z-40 md:hidden pt-28 pb-8 px-6 rounded-b-[32px] shadow-2xl"
                    >
                        <div className="flex flex-col gap-2">
                             {NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { handleNavClick(item.id); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                        (view === (item.id as string) && !isPhilosophyOpen) 
                                        ? 'bg-white/10 text-white border border-white/10' 
                                        : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    <span className="text-lg font-bold tracking-wide">{item.label}</span>
                                </button>
                             ))}

                             <div className="h-px bg-white/5 my-2" />

                             {deferredPrompt && (
                                <button onClick={handleInstallClick} className="flex items-center gap-4 p-4 text-cyan-400">
                                    <Download size={20} />
                                    <span className="text-sm font-bold uppercase tracking-widest">Установить App</span>
                                </button>
                             )}
                             <button onClick={() => { setShowMobileFaq(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-4 p-4 text-zinc-400">
                                <Sparkles size={20} />
                                <span className="text-sm font-bold uppercase tracking-widest">О приложении</span>
                             </button>
                        </div>
                    </MotionDiv>
                </>
            )}
        </AnimatePresence>
        </>
    );
};
