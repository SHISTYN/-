
import { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import { BreathingPhase } from '../types';

export type SoundMode = 'mute' | 'bell' | 'hang' | 'bowl' | 'rain' | 'om' | 'gong' | 'harp' | 'flute';

export const useAudioSystem = () => {
    // Legacy state, kept for compatibility with prop types
    const [soundMode, setSoundMode] = useState<SoundMode>('bell');
    
    // Shared Reverb Node (High quality spatializer)
    const reverbRef = useRef<Tone.Reverb | null>(null);
    const volumeRef = useRef<Tone.Volume | null>(null);

    const initAudio = async () => {
        await Tone.start();
        if (!reverbRef.current) {
            // Apple-like cleanliness needs a pristine reverb
            reverbRef.current = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
            await reverbRef.current.generate();
            
            // Global FX Volume
            volumeRef.current = new Tone.Volume(-2).connect(reverbRef.current);
        }
    };

    // --- PHASE TRANSITION SOUNDS ---
    const playPhaseSound = async (phase: BreathingPhase) => {
        if (soundMode === 'mute') return;
        await initAudio();
        if (!volumeRef.current) return;

        switch (phase) {
            case BreathingPhase.Inhale: {
                // "Airy Swell" - Soft attack, opening filter, rising sensation
                const synth = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 3,
                    modulationIndex: 3.5,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.2, decay: 0.1, sustain: 0.3, release: 2 },
                    modulation: { type: "sine" },
                    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
                }).connect(volumeRef.current);
                
                // A Major Add9 chord for uplifting feeling
                synth.triggerAttackRelease(["A3", "C#4", "E4", "B4"], "2n"); 
                break;
            }
            case BreathingPhase.Exhale: {
                // "Grounding Release" - Descending, warm, resolving
                const synth = new Tone.PolySynth(Tone.AMSynth, {
                    harmonicity: 2,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.1, decay: 2, sustain: 0.1, release: 3 },
                    modulation: { type: "sine" },
                    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
                }).connect(volumeRef.current);

                // F Major 7 (Resolving)
                synth.triggerAttackRelease(["F3", "A3", "C4", "E4"], "1n");
                break;
            }
            case BreathingPhase.HoldIn: {
                // "Suspension" - High, thin, static glass ping
                const metal = new Tone.MetalSynth({
                    frequency: 200,
                    envelope: { attack: 0.005, decay: 1.4, release: 0.2 },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).connect(volumeRef.current);
                
                // Very soft high ping
                metal.volume.value = -12;
                metal.triggerAttackRelease("32n", undefined, 0.4);
                break;
            }
            case BreathingPhase.HoldOut: {
                // "Void" - Minimal low sine pulse (instead of stomping membrane)
                const synth = new Tone.Synth({
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.5, decay: 0.5, sustain: 0, release: 1 }
                }).connect(volumeRef.current);
                
                synth.volume.value = -5;
                synth.triggerAttackRelease("C2", "2n");
                break;
            }
            case BreathingPhase.Done: {
                // Success Chime
                const synth = new Tone.PolySynth(Tone.Synth).connect(volumeRef.current);
                synth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "1n");
                break;
            }
        }
    };

    // --- COUNTDOWN SOUNDS (3... 2... 1...) ---
    // UPDATED: "Glass Blip" instead of "Wood Stomp"
    const playCountdownTick = async (number: number) => {
        if (soundMode === 'mute') return;
        await initAudio();
        if (!volumeRef.current) return;

        // Apple-style: Clean, sine-based, snappy envelope, slight FM modulation for "glassiness"
        const blip = new Tone.FMSynth({
            harmonicity: 1.5, // Ratio creates a consonant, glassy bell tone
            modulationIndex: 3, 
            oscillator: { type: "sine" }, // Pure carrier
            modulation: { type: "sine" }, // Pure modulator
            envelope: { 
                attack: 0.005, // Instant but smooth attack (no click)
                decay: 0.15,   // Short decay (tight)
                sustain: 0, 
                release: 1 
            },
            modulationEnvelope: { 
                attack: 0.001, 
                decay: 0.1,    // Modulation fades fast leaving pure tone
                sustain: 0, 
                release: 0.1 
            }
        }).connect(volumeRef.current);

        blip.volume.value = -4; // Balance volume

        // Frequencies chosen for "Medical/Scientific" precision
        if (number > 1) {
            // 3, 2: Neutral High "Blip" (G5 - 784Hz)
            blip.triggerAttackRelease("G5", "32n");
        } else {
            // 1: Accent High "Ping" (C6 - 1046Hz) - The "Ready" signal
            // Slightly brighter modulation
            blip.modulationIndex.value = 5;
            blip.triggerAttackRelease("C6", "32n");
        }
    };

    const playSoundEffect = async (mode: SoundMode) => {
        // Legacy wrapper for manual sound menu clicks
        if (mode === 'mute') return;
        await initAudio();
        
        // Simple preview sound logic
        const synth = new Tone.PolySynth().toDestination();
        synth.volume.value = -10;
        synth.triggerAttackRelease(["C5", "E5"], "8n");
    };

    const changeSoundMode = (mode: SoundMode) => {
        setSoundMode(mode);
        playSoundEffect(mode);
    };

    return {
        soundMode,
        playSoundEffect,
        playCountdownTick,
        playPhaseSound,
        changeSoundMode,
        initAudio
    };
};
