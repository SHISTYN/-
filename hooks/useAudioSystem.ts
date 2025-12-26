import { useRef, useState, useEffect } from 'react';

export type SoundMode = 'mute' | 'bell' | 'hang' | 'bowl' | 'gong' | 'rain' | 'om' | 'flute' | 'harp' | 'binaural_theta' | 'binaural_alpha';

export const useAudioSystem = () => {
    const [soundMode, setSoundMode] = useState<SoundMode>('bell');
    const audioContextRef = useRef<AudioContext | null>(null);
    const binauralNodesRef = useRef<{
        leftOsc: OscillatorNode | null;
        rightOsc: OscillatorNode | null;
        gain: GainNode | null;
    }>({ leftOsc: null, rightOsc: null, gain: null });

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    const stopBinaural = () => {
        const { leftOsc, rightOsc, gain } = binauralNodesRef.current;
        if (gain && audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            setTimeout(() => {
                leftOsc?.stop();
                rightOsc?.stop();
                leftOsc?.disconnect();
                rightOsc?.disconnect();
                gain.disconnect();
            }, 1600);
        }
        binauralNodesRef.current = { leftOsc: null, rightOsc: null, gain: null };
    };

    const playBinauralDrone = (baseFreq: number, beatFreq: number) => {
        initAudio();
        const ctx = audioContextRef.current!;
        stopBinaural();

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3); 
        masterGain.connect(ctx.destination);

        // Левое ухо (Несущая частота)
        const leftOsc = ctx.createOscillator();
        leftOsc.type = 'sine';
        leftOsc.frequency.value = baseFreq;
        const leftPan = ctx.createStereoPanner();
        leftPan.pan.value = -1;
        leftOsc.connect(leftPan).connect(masterGain);

        // Правое ухо (Частота + Бит)
        const rightOsc = ctx.createOscillator();
        rightOsc.type = 'sine';
        rightOsc.frequency.value = baseFreq + beatFreq;
        const rightPan = ctx.createStereoPanner();
        rightPan.pan.value = 1;
        rightOsc.connect(rightPan).connect(masterGain);

        leftOsc.start();
        rightOsc.start();

        binauralNodesRef.current = { leftOsc, rightOsc, gain: masterGain };
    };

    const playSoundEffect = (mode: SoundMode) => {
        if (mode === 'mute') return;
        initAudio();
        const ctx = audioContextRef.current!;
        const now = ctx.currentTime;

        const createOsc = (type: OscillatorType, freq: number, gainVal: number, duration: number, delay: number = 0) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, now + delay);
            
            gain.gain.setValueAtTime(0, now + delay);
            gain.gain.linearRampToValueAtTime(gainVal, now + delay + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + delay);
            osc.stop(now + delay + duration);
        };

        switch(mode) {
            case 'bell':
                createOsc('sine', 659.25, 0.1, 3.5);
                createOsc('sine', 1318.5, 0.03, 2.5, 0.02);
                break;
            case 'gong':
                createOsc('sine', 98, 0.25, 5.0);
                createOsc('triangle', 101, 0.1, 4.0);
                break;
            case 'om':
                createOsc('sine', 136.1, 0.15, 4.0);
                break;
            case 'binaural_theta':
                playBinauralDrone(180, 4.5); // Тета (Глубокая медитация)
                break;
            case 'binaural_alpha':
                playBinauralDrone(200, 10); // Альфа (Релаксация и фокус)
                break;
        }
    };

    const changeSoundMode = (mode: SoundMode) => {
        initAudio();
        setSoundMode(mode);
        if (mode.startsWith('binaural')) {
            playSoundEffect(mode);
        } else {
            stopBinaural();
            playSoundEffect(mode);
        }
    };

    useEffect(() => {
        return () => stopBinaural();
    }, []);

    return {
        soundMode,
        playSoundEffect,
        changeSoundMode,
        initAudio
    };
};