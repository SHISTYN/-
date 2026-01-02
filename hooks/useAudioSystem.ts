
import { useRef, useState, useEffect } from 'react';
import * as Tone from 'tone';
import { BreathingPhase } from '../types';

export type SoundMode = 'mute' | 'bell' | 'hang' | 'bowl' | 'rain' | 'om' | 'gong' | 'harp' | 'flute';

export const useAudioSystem = () => {
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
                // "Airy Swell"
                const synth = new Tone.PolySynth(Tone.FMSynth, {
                    harmonicity: 3,
                    modulationIndex: 3.5,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.2, decay: 0.1, sustain: 0.3, release: 2 },
                    modulation: { type: "sine" },
                    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
                }).connect(volumeRef.current);
                
                synth.triggerAttackRelease(["A3", "C#4", "E4", "B4"], "2n"); 
                break;
            }
            case BreathingPhase.Exhale: {
                // "Grounding Release"
                const synth = new Tone.PolySynth(Tone.AMSynth, {
                    harmonicity: 2,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.1, decay: 2, sustain: 0.1, release: 3 },
                    modulation: { type: "sine" },
                    modulationEnvelope: { attack: 0.5, decay: 0, sustain: 1, release: 0.5 }
                }).connect(volumeRef.current);

                synth.triggerAttackRelease(["F3", "A3", "C4", "E4"], "1n");
                break;
            }
            case BreathingPhase.HoldIn: {
                // "Suspension"
                const metal = new Tone.MetalSynth({
                    frequency: 200,
                    envelope: { attack: 0.005, decay: 1.4, release: 0.2 },
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    resonance: 4000,
                    octaves: 1.5
                }).connect(volumeRef.current);
                
                metal.volume.value = -12;
                metal.triggerAttackRelease("32n", undefined, 0.4);
                break;
            }
            case BreathingPhase.HoldOut: {
                // "Void"
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

    // --- COUNTDOWN SOUNDS (Apple-Style Taptic) ---
    const playCountdownTick = async (number: number) => {
        if (soundMode === 'mute') return;
        await initAudio();
        
        // Direct Destination for crispness (bypass reverb for 3, 2)
        // Only use Reverb for "1/Go" to make it shine.
        
        if (number > 1) {
            // 3, 2: "Glass Tick" (High Pitch Sine Drop)
            // This replicates the Taptic Engine feel: High freq, extremely fast decay.
            const osc = new Tone.Oscillator().toDestination();
            const env = new Tone.AmplitudeEnvelope({
                attack: 0.001, // Instant
                decay: 0.05,   // Very short (50ms)
                sustain: 0,
                release: 0.1
            }).toDestination();
            
            osc.connect(env);
            
            osc.frequency.setValueAtTime(1200, Tone.now()); // Start high (Glassy)
            osc.frequency.exponentialRampToValueAtTime(600, Tone.now() + 0.05); // Rapid drop creates the "Click"
            
            osc.start();
            env.triggerAttackRelease(0.05);
            osc.stop("+0.1");

        } else {
            // 1: "Crystal Ping" (Start signal)
            // Softer attack, longer tail, sent to Reverb
            const synth = new Tone.Synth({
                oscillator: { type: "sine" },
                envelope: { 
                    attack: 0.02, // Soft attack
                    decay: 0.3,   // Ringing
                    sustain: 0, 
                    release: 1 
                }
            }).connect(volumeRef.current!); // Connect to Reverb path

            synth.volume.value = -2;
            synth.triggerAttackRelease("C6", "8n"); // High C
        }
    };

    const playSoundEffect = async (mode: SoundMode) => {
        if (mode === 'mute') return;
        await initAudio();
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
