
import React, { useEffect, useState, useRef } from 'react';
import { BreathingPattern } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for Framer Motion type mismatch
const MotionButton = motion.button as any;
const MotionDiv = motion.div as any;

interface ControlsProps {
  pattern: BreathingPattern;
  onChange: (newPattern: BreathingPattern) => void;
  rounds: number;
  onRoundsChange: (r: number) => void;
  readOnly?: boolean;
}

// Ultra-Compact Input (Glass Capsule Style)
const MinimalInput: React.FC<{ 
    label: string; 
    value: number; 
    step: number; 
    onChange: (val: number) => void; 
    color: string;
    subLabel?: string;
}> = ({ label, value, step, onChange, color, subLabel }) => {

    const [localValue, setLocalValue] = useState(value.toString());

    useEffect(() => {
        setLocalValue(value.toString());
    }, [value]);

    const handleBlur = () => {
        let val = parseFloat(localValue);
        if (isNaN(val)) val = 0;
        val = Math.round(val * 10) / 10;
        setLocalValue(val.toString());
        onChange(val);
    };

    return (
        <div className="flex flex-col items-center justify-center group p-1 w-full h-full">
            {/* Label */}
            <div className="flex flex-col items-center mb-1.5 opacity-90">
                <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: color }}>
                    {label}
                </span>
                {subLabel && <span className="text-[8px] text-gray-500 mt-0.5">{subLabel}</span>}
            </div>

            {/* Controls Capsule */}
            <div className="flex items-center justify-between gap-1 w-full bg-white/5 border border-white/5 rounded-2xl p-1 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-lg">
                {/* Minus */}
                <MotionButton 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onChange(Math.max(0, Number((value - step).toFixed(1))))}
                    className="w-10 h-10 md:w-12 md:h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <i className="fas fa-minus text-xs"></i>
                </MotionButton>

                {/* Value */}
                <div className="flex-1 text-center min-w-[40px]">
                    <input
                        type="number"
                        inputMode="decimal"
                        step={step}
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleBlur}
                        className={`w-full bg-transparent text-center text-xl font-display font-bold outline-none p-0 appearance-none leading-none border-none focus:ring-0 drop-shadow-sm ${value === 0 ? 'text-gray-500 dark:text-gray-600' : 'text-gray-900 dark:text-white'}`}
                        style={{ MozAppearance: 'textfield' }}
                    />
                </div>

                {/* Plus */}
                <MotionButton 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => onChange(Number((value + step).toFixed(1)))}
                    className="w-10 h-10 md:w-12 md:h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <i className="fas fa-plus text-xs"></i>
                </MotionButton>
            </div>
            
            <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                    -webkit-appearance: none; 
                    margin: 0; 
                }
            `}</style>
        </div>
    );
};

const Controls: React.FC<ControlsProps> = ({ pattern, onChange, rounds, onRoundsChange, readOnly = false }) => {
  const [isPresetOpen, setPresetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setPresetOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logic to find presets
  const findCurrentPresetIndex = () => {
    if (!pattern.presets) return -1;
    return pattern.presets.findIndex(p => 
        p.inhale === pattern.inhale && 
        p.holdIn === pattern.holdIn && 
        p.exhale === pattern.exhale && 
        p.holdOut === pattern.holdOut &&
        (pattern.mode === 'wim-hof' ? p.breathCount === pattern.breathCount : true)
    );
  };

  const currentPresetIndex = findCurrentPresetIndex();
  const isCustom = currentPresetIndex === -1 && (pattern.presets?.length || 0) > 0;

  // Auto-scroll to selected item when opened
  useEffect(() => {
      if (isPresetOpen && listRef.current && currentPresetIndex !== -1) {
          const item = listRef.current.children[currentPresetIndex] as HTMLElement;
          if (item) {
              item.scrollIntoView({ block: 'center', behavior: 'auto' });
          }
      }
  }, [isPresetOpen, currentPresetIndex]);

  const applyPreset = (index: number) => {
      if (!pattern.presets || !pattern.presets[index]) return;
      const p = pattern.presets[index];
      onChange({ 
          ...pattern, 
          inhale: p.inhale, 
          holdIn: p.holdIn, 
          exhale: p.exhale, 
          holdOut: p.holdOut,
          breathCount: p.breathCount ?? pattern.breathCount,
          retentionProfile: p.retentionProfile ?? pattern.retentionProfile
      });
      setPresetOpen(false);
  };

  if (readOnly) return null;

  return (
    <div className="w-full animate-fade-in flex flex-col gap-4">
      
      {/* 1. TOP BAR: Presets & Rounds */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full relative z-40">
          
          {/* Custom Presets Selector */}
          {pattern.presets && pattern.presets.length > 0 && (
              <div ref={dropdownRef} className="relative flex-grow">
                  <div className="grid grid-cols-[48px_1fr_48px] items-center bg-white/50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm backdrop-blur-md h-14 transition-colors hover:bg-white/60 dark:hover:bg-white/10">
                      
                      {/* Left Button (Prev) */}
                      <div className="flex items-center justify-center h-full border-r border-gray-200/50 dark:border-white/5">
                        <MotionButton 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => pattern.presets && applyPreset(currentPresetIndex > 0 ? currentPresetIndex - 1 : 0)}
                            disabled={currentPresetIndex <= 0 && !isCustom}
                            className="w-full h-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-20 transition-all rounded-l-xl"
                        >
                            <i className="fas fa-chevron-left text-xs"></i>
                        </MotionButton>
                      </div>

                      {/* Middle Area (Toggle Dropdown) */}
                      <div 
                        onClick={() => setPresetOpen(!isPresetOpen)}
                        className="relative h-full flex items-center justify-center px-2 cursor-pointer w-full"
                      >
                          <div className="flex flex-col items-center justify-center w-full overflow-hidden">
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate w-full text-center tracking-wide flex items-center justify-center gap-2">
                                  {isCustom ? 'Свой режим' : pattern.presets[currentPresetIndex]?.name.split(' • ')[0]}
                                  <i className={`fas fa-chevron-${isPresetOpen ? 'up' : 'down'} text-[8px] opacity-50 transition-transform duration-300`}></i>
                              </span>
                              {!isCustom && pattern.presets[currentPresetIndex]?.name.includes(' • ') && (
                                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium truncate w-full text-center -mt-0.5">
                                      {pattern.presets[currentPresetIndex]?.name.split(' • ')[1]}
                                  </span>
                              )}
                              {isCustom && (
                                  <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center -mt-0.5">
                                      Кастомные настройки
                                  </span>
                              )}
                          </div>
                      </div>

                      {/* Right Button (Next) */}
                      <div className="flex items-center justify-center h-full border-l border-gray-200/50 dark:border-white/5">
                        <MotionButton 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => pattern.presets && applyPreset(currentPresetIndex < pattern.presets.length - 1 ? currentPresetIndex + 1 : 0)}
                            disabled={currentPresetIndex >= (pattern.presets?.length || 0) - 1}
                            className="w-full h-full flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-20 transition-all rounded-r-xl"
                        >
                            <i className="fas fa-chevron-right text-xs"></i>
                        </MotionButton>
                      </div>
                  </div>

                  {/* CUSTOM DROPDOWN LIST (The Fix) */}
                  <AnimatePresence>
                    {isPresetOpen && (
                        <MotionDiv
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute bottom-full mb-2 w-full bg-[#1c1c1e]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col max-h-[60vh] overflow-hidden"
                        >
                            <div className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/5 flex-shrink-0 bg-black/20 flex justify-between items-center">
                                <span>Выберите уровень</span>
                                <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400">{pattern.presets.length} вар.</span>
                            </div>
                            
                            <div ref={listRef} className="overflow-y-auto custom-scrollbar flex-1 p-1">
                                {pattern.presets?.map((p, idx) => {
                                    const isActive = idx === currentPresetIndex;
                                    const parts = p.name.split(' • ');
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => applyPreset(idx)}
                                            className={`w-full text-left px-3 py-3 rounded-lg mb-0.5 flex items-center justify-between transition-colors group ${
                                                isActive 
                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' 
                                                : 'hover:bg-white/5 text-gray-300 border border-transparent'
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-bold font-mono tracking-tight ${isActive ? 'text-cyan-300' : 'text-gray-200'}`}>
                                                    {parts[0]}
                                                </span>
                                                {parts[1] && (
                                                    <span className={`text-[10px] uppercase tracking-wide mt-0.5 ${isActive ? 'text-cyan-500/80' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                                        {parts[1]}
                                                    </span>
                                                )}
                                            </div>
                                            {isActive && <i className="fas fa-check text-xs text-cyan-400"></i>}
                                        </button>
                                    );
                                })}
                            </div>
                        </MotionDiv>
                    )}
                  </AnimatePresence>
              </div>
          )}

          {/* Rounds Selector */}
          {pattern.mode !== 'stopwatch' && pattern.mode !== 'wim-hof' && (
              <div className="flex items-center justify-between gap-2 bg-white/50 dark:bg-white/5 rounded-xl px-2 border border-gray-200 dark:border-white/5 shadow-sm backdrop-blur-md h-14 min-w-[140px] sm:w-auto">
                  <MotionButton whileTap={{ scale: 0.8 }} onClick={() => onRoundsChange(Math.max(0, rounds - 1))} className="text-gray-400 hover:text-white w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"><i className="fas fa-minus text-xs"></i></MotionButton>
                  <div className="flex flex-col items-center">
                      <span className="font-mono text-lg font-bold text-gray-900 dark:text-white leading-none">{rounds === 0 ? '∞' : rounds}</span>
                      <span className="text-[8px] font-bold uppercase text-gray-400 tracking-wider">Раунды</span>
                  </div>
                  <MotionButton whileTap={{ scale: 0.8 }} onClick={() => onRoundsChange(rounds + 1)} className="text-gray-400 hover:text-white w-10 h-full flex items-center justify-center hover:bg-white/10 rounded-lg transition-all"><i className="fas fa-plus text-xs"></i></MotionButton>
              </div>
          )}
      </div>

      {/* 2. MAIN CONTROLS GRID */}
      <div className="w-full bg-white/50 dark:bg-[#121212]/50 border border-gray-200 dark:border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-glass relative z-10">
         {pattern.mode === 'stopwatch' ? (
             <div className="text-center text-xs text-gray-500 py-2">Режим секундомера</div> 
         ) : (
             <div className="flex flex-col gap-6">
                 {/* 
                     ADAPTIVE LAYOUT:
                     - Wim Hof: 3 columns
                     - Standard: ALWAYS 2x2 Grid on Mobile, 4 columns on Desktop. 
                     - NEVER HIDE INPUTS even if they are 0.
                 */}
                 <div className={pattern.mode === 'wim-hof' 
                     ? 'grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4' 
                     : 'grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'
                 }>
                     {pattern.mode === 'wim-hof' ? (
                         <>
                            <MinimalInput label="Вдохи" value={pattern.breathCount || 30} step={5} color="#22d3ee" onChange={(v) => onChange({ ...pattern, breathCount: v })} />
                            <MinimalInput 
                                label="Темп" 
                                subLabel="(Вдох)"
                                value={pattern.inhale} 
                                step={0.1} 
                                color="#94a3b8" 
                                onChange={(v) => onChange({ ...pattern, inhale: v, exhale: v * 0.6 })}
                            />
                            <MinimalInput label="Восстан." value={pattern.holdIn} step={5} color="#7C3AED" onChange={(v) => onChange({ ...pattern, holdIn: v })} />
                         </>
                     ) : (
                         <>
                            {/* ALL 4 PHASES ALWAYS VISIBLE */}
                            <MinimalInput label="Вдох" value={pattern.inhale} step={0.5} color="#22d3ee" onChange={(v) => onChange({ ...pattern, inhale: v })} />
                            
                            <MinimalInput label="Задержка" value={pattern.holdIn} step={0.5} color="#F59E0B" onChange={(v) => onChange({ ...pattern, holdIn: v })} />
                            
                            <MinimalInput label="Выдох" value={pattern.exhale} step={0.5} color="#7C3AED" onChange={(v) => onChange({ ...pattern, exhale: v })} />
                            
                            <MinimalInput label="Пауза" value={pattern.holdOut} step={0.5} color="#fb7185" onChange={(v) => onChange({ ...pattern, holdOut: v })} />
                         </>
                     )}
                 </div>
             </div>
         )}
      </div>

    </div>
  );
};

export default Controls;
