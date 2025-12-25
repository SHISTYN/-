import React, { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { BreathState, BreathingPattern, BreathingPhase } from './types';
import { DEFAULT_PATTERNS } from './constants';
import { getBreathingAnalysis } from './services/geminiService';
import AppBackground from './components/AppBackground';
import SplashScreen from './components/SplashScreen';
import { Header } from './components/layout/Header';
import { useAudioSystem } from './hooks/useAudioSystem';
import { useUserProgress } from './hooks/useUserProgress';

// --- LAZY IMPORTS (Code Splitting) ---
const Controls = lazy(() => import('./components/Controls'));
const TimerVisual = lazy(() => import('./components/TimerVisual'));
const AnulomaVilomaInterface = lazy(() => import('./components/AnulomaVilomaInterface')); 
const BoxTimerVisual = lazy(() => import('./components/BoxTimerVisual'));
const WimHofInterface = lazy(() => import('./components/WimHofInterface'));
const AnalysisModal = lazy(() => import('./components/AnalysisModal'));
const LibraryView = lazy(() => import('./components/LibraryView'));
const TimerSidebar = lazy(() => import('./components/TimerSidebar'));
const MobileFaq = lazy(() => import('./components/MobileFaq'));

// --- TYPES ---
type ThemeMode = 'dark' | 'light';
type ExecutionMode = 'timer' | 'stopwatch';
type ViewState = 'library' | 'timer';

// Minimal Loader for Suspense
const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  // --- USER PROGRESS HOOK ---
  const { favorites, toggleFavorite } = useUserProgress();

  // --- State ---
  const [activePattern, setActivePattern] = useState<BreathingPattern>(DEFAULT_PATTERNS[0]);
  const [rounds, setRounds] = useState<number>(0); 
  const [view, setView] = useState<ViewState>('library');
  const [infoTab, setInfoTab] = useState<'about' | 'guide' | 'safety'>('about'); 
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('timer');
  const [manualStopwatchOpen, setManualStopwatchOpen] = useState(false); 
  
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>('dark');

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Timer State
  const [timerState, setTimerState] = useState<BreathState>({
    currentPhase: BreathingPhase.Ready,
    secondsRemaining: 3,
    totalSecondsElapsed: 0,
    currentRound: 1,
    currentBreath: 1,
    isActive: false,
    isPaused: false,
    sessionResults: []
  });

  // Analysis State
  const [isAnalysisOpen, setAnalysisOpen] = useState(false);
  const [analysisContent, setAnalysisContent] = useState("");
  const [isAnalyzing, setAnalyzing] = useState(false);
  
  // Modal State
  const [showMobileFaq, setShowMobileFaq] = useState(false);
  const [showResults, setShowResults] = useState(false); 

  // Audio State Hook
  const { soundMode, changeSoundMode, playSoundEffect, initAudio } = useAudioSystem();

  // Refs for Animation Frame
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  
  // Ref for Wake Lock
  const wakeLockRef = useRef<any>(null);

  // --- DEEP LINKING (ИЩЕЙКА) ---
  // Check URL on mount to restore specific technique
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const patternId = params.get('pattern');
    if (patternId) {
        const found = DEFAULT_PATTERNS.find(p => p.id === patternId);
        if (found) {
            setActivePattern(found);
            setView('timer');
            // Auto-configure based on loaded pattern
            if (found.mode === 'manual') {
                setInfoTab('guide');
                setExecutionMode('stopwatch');
            } else {
                setInfoTab('about');
                setExecutionMode('timer');
            }
            setRounds(found.mode === 'wim-hof' ? 3 : 12);
        }
    }
  }, []);

  // --- SYNC URL WITH STATE ---
  // When active pattern changes, update URL silently
  useEffect(() => {
      if (view === 'timer' && activePattern) {
          const url = new URL(window.location.href);
          url.searchParams.set('pattern', activePattern.id);
          window.history.replaceState({}, '', url);
      } else if (view === 'library') {
          const url = new URL(window.location.href);
          url.searchParams.delete('pattern');
          window.history.replaceState({}, '', url);
      }
  }, [activePattern, view]);

  // --- SPLASH SCREEN EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoadingApp(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // --- PWA INSTALL LISTENER ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // --- THEME LOGIC ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleShare = async () => {
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'EntheoBreath',
                  text: 'Дыхание, Измененные Состояния Сознания и AI-анализ.',
                  url: window.location.href,
              });
          } catch (error) {
              console.log('Error sharing', error);
          }
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert("Ссылка скопирована в буфер обмена!");
      }
  };

  // --- WAKE LOCK LOGIC ---
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && document.visibilityState === 'visible') {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err: any) {
          console.warn(`Wake Lock request failed: ${err.name}, ${err.message}`);
        }
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err: any) {
          console.warn(`Wake Lock release failed: ${err.name}, ${err.message}`);
        }
      }
    };

    if (timerState.isActive && !timerState.isPaused) {
        requestWakeLock();
    } else {
        releaseWakeLock();
    }

    const handleVisibilityChange = async () => {
        if (wakeLockRef.current !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
        releaseWakeLock();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isActive, timerState.isPaused]);


  // --- TIMER LOGIC ---
  const calculateTotalDuration = (p: BreathingPattern, r: number) => {
      if (p.mode === 'wim-hof' || p.mode === 'stopwatch' || p.mode === 'manual') return 0;
      const cycleDuration = p.inhale + p.holdIn + p.exhale + p.holdOut;
      return cycleDuration * r;
  };

  const formatDuration = (seconds: number) => {
      if (seconds <= 0) return "0м 0с";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}м ${s.toString().padStart(2, '0')}с`;
  };

  const totalSessionDuration = calculateTotalDuration(activePattern, rounds);
  const timeRemaining = Math.max(0, totalSessionDuration - timerState.totalSecondsElapsed);

  const advancePhase = useCallback(() => {
    setTimerState(prev => {
      let nextPhase = prev.currentPhase;
      let nextDuration = 0;
      let nextRound = prev.currentRound;
      let nextBreath = prev.currentBreath;
      let currentSessionResults = [...prev.sessionResults];
      let shouldPause = false;

      if (executionMode === 'stopwatch') return prev;
      if (activePattern.mode === 'wim-hof') return prev; 

      switch (prev.currentPhase) {
        case BreathingPhase.Ready:
          nextPhase = BreathingPhase.Inhale;
          nextDuration = activePattern.inhale;
          break;
        case BreathingPhase.Inhale:
          if (activePattern.holdIn > 0) {
            nextPhase = BreathingPhase.HoldIn;
            nextDuration = activePattern.holdIn;
          } else {
            nextPhase = BreathingPhase.Exhale;
            nextDuration = activePattern.exhale;
          }
          break;
        case BreathingPhase.HoldIn:
          nextPhase = BreathingPhase.Exhale;
          nextDuration = activePattern.exhale;
          break;
        case BreathingPhase.Exhale:
          if (activePattern.holdOut > 0) {
            nextPhase = BreathingPhase.HoldOut;
            nextDuration = activePattern.holdOut;
          } else {
            if (rounds > 0 && prev.currentRound >= rounds) {
               nextPhase = BreathingPhase.Done;
            } else {
               nextRound = prev.currentRound + 1;
               nextPhase = BreathingPhase.Inhale;
               nextDuration = activePattern.inhale;
            }
          }
          break;
        case BreathingPhase.HoldOut:
           if (rounds > 0 && prev.currentRound >= rounds) {
             nextPhase = BreathingPhase.Done;
           } else {
             nextRound = prev.currentRound + 1;
             nextPhase = BreathingPhase.Inhale;
             nextDuration = activePattern.inhale;
           }
           break;
        default: return prev;
      }

      if (nextPhase !== prev.currentPhase) playSoundEffect(soundMode);
      
      if (nextPhase === BreathingPhase.Done) {
         return { ...prev, currentPhase: nextPhase, isActive: false, secondsRemaining: 0 };
      }

      return { 
          ...prev, 
          currentPhase: nextPhase, 
          secondsRemaining: nextDuration, 
          currentRound: nextRound,
          currentBreath: nextBreath,
          sessionResults: currentSessionResults,
          isActive: !shouldPause, 
          isPaused: shouldPause
      };
    });
  }, [activePattern, rounds, soundMode, executionMode, playSoundEffect]);

  const tick = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setTimerState(prev => {
        if (!prev.isActive || prev.isPaused || prev.currentPhase === BreathingPhase.Done) return prev;
        
        if (executionMode === 'stopwatch') {
             return { ...prev, totalSecondsElapsed: prev.totalSecondsElapsed + deltaTime, secondsRemaining: prev.secondsRemaining + deltaTime };
        }

        const newTimeLeft = prev.secondsRemaining - deltaTime;
        if (newTimeLeft <= 0) return { ...prev, secondsRemaining: newTimeLeft, totalSecondsElapsed: prev.totalSecondsElapsed + deltaTime };
        return { ...prev, secondsRemaining: newTimeLeft, totalSecondsElapsed: prev.totalSecondsElapsed + deltaTime };
      });
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(tick);
  }, [executionMode, activePattern.mode]);

  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused) {
      requestRef.current = requestAnimationFrame(tick);
    } else {
      previousTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); }
  }, [timerState.isActive, timerState.isPaused, tick]);

  useEffect(() => {
     const isStopwatch = executionMode === 'stopwatch';
     if (!isStopwatch && activePattern.mode !== 'wim-hof' && timerState.isActive && !timerState.isPaused && timerState.secondsRemaining <= 0.05 && timerState.currentPhase !== BreathingPhase.Done) {
         advancePhase();
     }
  }, [timerState.secondsRemaining, timerState.isActive, timerState.isPaused, timerState.currentPhase, advancePhase, executionMode, activePattern.mode]);


  const toggleTimer = () => {
    initAudio(); 
    if (timerState.currentPhase === BreathingPhase.Done) {
        resetTimer();
        setTimeout(() => setTimerState(prev => ({ ...prev, isActive: true })), 100);
    } else {
        setTimerState(prev => ({ ...prev, isActive: !prev.isActive, isPaused: prev.isActive }));
    }
  };

  const resetTimer = () => {
    setTimerState({
        currentPhase: BreathingPhase.Ready,
        secondsRemaining: executionMode === 'stopwatch' ? 0 : 3,
        totalSecondsElapsed: 0,
        currentRound: 1,
        currentBreath: 1,
        isActive: false,
        isPaused: false,
        sessionResults: []
    });
    setShowResults(false);
  };

  const handleDeepAnalysis = async () => {
    const cacheKey = `entheo_analysis_${activePattern.id}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
        setAnalysisContent(cached);
        setAnalysisOpen(true);
        setAnalyzing(false);
        return;
    }

    setAnalysisOpen(true);
    setAnalyzing(true);
    const text = await getBreathingAnalysis(activePattern.name, `${activePattern.inhale}-${activePattern.holdIn}-${activePattern.exhale}-${activePattern.holdOut}`);
    localStorage.setItem(cacheKey, text);
    setAnalysisContent(text);
    setAnalyzing(false);
  };

  const selectPattern = (p: BreathingPattern) => {
      setActivePattern(p);
      setView('timer');
      
      if (p.mode === 'manual') {
          setInfoTab('guide');
          setExecutionMode('stopwatch'); 
          setManualStopwatchOpen(false); 
      } else {
          setInfoTab('about');
          setExecutionMode('timer'); 
      }
      
      setRounds(p.mode === 'wim-hof' ? 3 : 12); 
      resetTimer();
  };

  const handleModeSwitch = (mode: ExecutionMode) => {
      setExecutionMode(mode);
      setTimerState(prev => ({
          ...prev,
          isActive: false,
          isPaused: false,
          currentPhase: BreathingPhase.Ready,
          secondsRemaining: mode === 'stopwatch' ? 0 : 3,
          totalSecondsElapsed: 0,
          sessionResults: []
      }));
  };

  // --- APP SHELL ARCHITECTURE ---
  return (
    <div className="h-[100dvh] w-full flex flex-col font-sans selection:bg-purple-500/30 overflow-hidden relative text-zinc-900 dark:text-gray-100 transition-colors duration-500 bg-slate-50 dark:bg-[#000000]">
      
      <SplashScreen isLoading={isLoadingApp} />
      <AppBackground theme={theme} />

      {/* MODALS */}
      <Suspense fallback={null}>
        <MobileFaq isOpen={showMobileFaq} onClose={() => setShowMobileFaq(false)} />
        <AnalysisModal 
           isOpen={isAnalysisOpen} 
           onClose={() => setAnalysisOpen(false)} 
           title={`AI Анализ: ${activePattern.name}`} 
           content={analysisContent}
           isLoading={isAnalyzing}
        />
      </Suspense>

      {/* HEADER */}
      <Header 
        view={view}
        setView={setView}
        theme={theme}
        toggleTheme={toggleTheme}
        deferredPrompt={deferredPrompt}
        handleInstallClick={handleInstallClick}
        soundMode={soundMode}
        changeSoundMode={changeSoundMode}
        handleShare={handleShare}
        setShowMobileFaq={setShowMobileFaq}
      />

      {/* MAIN CONTENT AREA */}
      <main className="w-full flex-grow flex flex-col relative z-10 overflow-hidden">
        
        {view === 'library' && (
            // LIBRARY SCROLL CONTAINER
            <div className="flex-grow overflow-y-auto custom-scrollbar pt-24 md:pt-32 pb-24">
                <Suspense fallback={<LoadingFallback />}>
                    <LibraryView 
                        selectPattern={selectPattern} 
                        favorites={favorites} 
                        toggleFavorite={toggleFavorite} 
                    />
                </Suspense>
            </div>
        )}

        {view === 'timer' && (
            // TIMER SPLIT VIEW - FIX: Robust Flex Column
            <div className="flex-grow flex flex-col lg:flex-row h-full w-full relative pt-24 md:pt-28 lg:pt-32 overflow-hidden">
                
                {/* --- 1. TOP PANEL: VISUALIZER + CONTROLS --- */}
                {/* Mobile: Takes top part, NO SCROLL. Desktop: Flex 1 */}
                <div className={`
                    flex flex-col justify-between shrink-0 relative z-10
                    ${activePattern.mode === 'manual' ? 'hidden' : 'flex'}
                    lg:order-2 lg:flex-1 lg:h-full lg:overflow-hidden
                    h-[60%] border-b border-zinc-200 dark:border-white/5 lg:border-0
                `}>
                    
                    {/* Visualizer Area (Centered) */}
                    <div className="flex-1 flex items-center justify-center w-full px-4 min-h-0 relative">
                        {/* Background Effect */}
                        <div 
                            className={`absolute inset-0 transition-opacity duration-1000 z-0 pointer-events-none ${timerState.isActive ? 'opacity-30' : 'opacity-0'}`}
                            style={{ background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.15) 0%, rgba(0,0,0,0) 70%)' }}
                        ></div>

                        {/* Top Info (Mode/Time) */}
                        <div className="absolute top-0 left-0 right-0 flex justify-center py-2 z-20">
                             {/* Mode Toggle Button */}
                             <div className="flex items-center justify-center p-1 bg-gray-200 dark:bg-white/5 rounded-full backdrop-blur-md border border-zinc-200 dark:border-white/10 scale-75">
                                <button 
                                    onClick={() => handleModeSwitch('timer')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${executionMode === 'timer' ? 'bg-white dark:bg-black text-black dark:text-white shadow' : 'text-gray-500'}`}
                                >
                                    Таймер
                                </button>
                                <button 
                                    onClick={() => handleModeSwitch('stopwatch')}
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${executionMode === 'stopwatch' ? 'bg-white dark:bg-black text-black dark:text-white shadow' : 'text-gray-500'}`}
                                >
                                    Секундомер
                                </button>
                            </div>
                        </div>

                        {/* The Timer Itself */}
                        <div className="relative z-10 transform scale-90 md:scale-100">
                            <Suspense fallback={<LoadingFallback />}>
                                {activePattern.id === 'anuloma-viloma-base' && executionMode !== 'stopwatch' ? (
                                    <AnulomaVilomaInterface
                                        phase={timerState.currentPhase}
                                        timeLeft={timerState.secondsRemaining}
                                        totalTime={10} 
                                        currentRound={timerState.currentRound}
                                    />
                                ) : activePattern.id === 'box-breathing' && executionMode !== 'stopwatch' ? (
                                    <BoxTimerVisual
                                        phase={timerState.currentPhase}
                                        timeLeft={timerState.secondsRemaining}
                                        totalTimeForPhase={4}
                                        currentRound={timerState.currentRound}
                                        label={timerState.currentPhase}
                                    />
                                ) : (
                                    <TimerVisual 
                                        phase={timerState.currentPhase} 
                                        timeLeft={executionMode === 'stopwatch' ? timerState.totalSecondsElapsed : timerState.secondsRemaining}
                                        totalTimeForPhase={timerState.secondsRemaining} // Approx
                                        label={timerState.currentPhase}
                                        patternId={activePattern.id}
                                        currentRound={timerState.currentRound}
                                        currentBreath={timerState.currentBreath}
                                        totalBreaths={activePattern.breathCount}
                                        mode={executionMode === 'stopwatch' ? 'stopwatch' : activePattern.mode}
                                        theme={theme}
                                    />
                                )}
                            </Suspense>
                        </div>
                    </div>

                    {/* Bottom Controls Area (Fixed at bottom of Top Panel) */}
                    <div className="flex-shrink-0 w-full px-4 pb-4 pt-2 bg-white/50 dark:bg-[#050505]/50 backdrop-blur-md border-t border-white/5 z-20">
                        <div className="max-w-md mx-auto flex flex-col gap-4">
                            {/* Play Controls */}
                            <div className="flex items-center justify-center gap-6">
                                <button onClick={resetTimer} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-black dark:text-gray-400 dark:hover:text-white"><i className="fas fa-redo text-sm"></i></button>
                                <button onClick={toggleTimer} className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-transform active:scale-95 ${timerState.isActive && !timerState.isPaused ? 'bg-white text-rose-500 border-2 border-rose-500' : 'bg-zinc-900 text-white dark:bg-white dark:text-black'}`}>
                                    <i className={`fas fa-${timerState.isActive && !timerState.isPaused ? 'pause' : 'play ml-1'}`}></i>
                                </button>
                                {executionMode === 'timer' && (
                                    <div className="w-10 h-10 flex flex-col items-center justify-center bg-zinc-100 dark:bg-white/10 rounded-full">
                                        <span className="text-xs font-bold">{timerState.currentRound}</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Settings (Inputs) */}
                            <div className={`transition-all duration-300 ${timerState.isActive && !timerState.isPaused ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                                <Suspense fallback={null}>
                                    <Controls 
                                        pattern={{...activePattern, mode: executionMode === 'stopwatch' ? 'stopwatch' : activePattern.mode}} 
                                        onChange={setActivePattern} 
                                        rounds={rounds} 
                                        onRoundsChange={setRounds}
                                        readOnly={timerState.isActive && !timerState.isPaused}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 2. BOTTOM PANEL: SIDEBAR INFO --- */}
                {/* Mobile: Fills remaining space, Scrollable. Desktop: Left sidebar */}
                <div className={`
                    flex-1 min-h-0 overflow-y-auto custom-scrollbar relative bg-white dark:bg-[#0a0a0b] z-20
                    lg:order-1 lg:w-[480px] lg:flex-none lg:border-r border-zinc-200 dark:border-white/5
                    ${activePattern.mode === 'manual' ? 'h-full order-1' : ''}
                `}>
                    {activePattern.mode === 'wim-hof' ? (
                        <Suspense fallback={<LoadingFallback />}>
                           <WimHofInterface pattern={activePattern} onExit={() => setView('library')} />
                        </Suspense>
                    ) : (
                        <Suspense fallback={<div className="w-full h-full bg-white/5 animate-pulse"></div>}>
                            <TimerSidebar 
                                activePattern={activePattern}
                                setView={setView}
                                infoTab={infoTab}
                                setInfoTab={setInfoTab}
                                handleDeepAnalysis={handleDeepAnalysis}
                                isAnalyzing={isAnalyzing}
                            />
                        </Suspense>
                    )}
                </div>

                {/* Manual Mode Float Button */}
                {activePattern.mode === 'manual' && (
                    <button 
                        onClick={() => setManualStopwatchOpen(true)}
                        className="fixed bottom-8 right-8 z-50 bg-white dark:bg-zen-accent text-black font-bold p-4 rounded-full shadow-glow-cyan animate-pulse-slow hover:scale-110 transition-all active:scale-95"
                    >
                         <i className="fas fa-stopwatch text-xl"></i>
                    </button>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default App;