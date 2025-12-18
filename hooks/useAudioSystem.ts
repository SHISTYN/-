import { useRef, useState } from 'react';

export type SoundMode = 'mute' | 'bell' | 'hang' | 'bowl' | 'gong' | 'rain' | 'om' | 'flute' | 'harp';

export const useAudioSystem = () => {
    const [soundMode, setSoundMode] = useState<SoundMode>('bell');
    const audioContextRef = useRef<AudioContext | null>(null);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const playSoundEffect = (mode: SoundMode) => {
        if (mode === 'mute') return;
        if (!audioContextRef.current) initAudio();
        const ctx = audioContextRef.current!;
        const now = ctx.currentTime;

        const createOsc = (type: OscillatorType, freq: number, gainVal: number, duration: number, delay: number = 0) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(gainVal, now + delay + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + duration);
        };

        // Simple sound logic
        switch(mode) {
            case 'bell':
                createOsc('sine', 523.25, 0.1, 1.5);
                createOsc('sine', 1046.50, 0.05, 1.5);
                break;
            default:
                createOsc('sine', 440, 0.1, 1.0);
                break;
        }
    };

    const changeSoundMode = (mode: SoundMode) => {
        initAudio(); 
        setSoundMode(mode);
        playSoundEffect(mode); 
    };

    return {
        soundMode,
        setSoundMode,
        playSoundEffect,
        changeSoundMode,
        initAudio
    };
};