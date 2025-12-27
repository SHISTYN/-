
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { useAudioEngine } from '../context/AudioContext';

export const useAmbientTrack = (url: string | null, crossfadeTime: number = 2) => {
    const { isReady } = useAudioEngine();
    const [isPlaying, setIsPlaying] = useState(false);
    
    // We need two players to alternate for gapless playback
    const playerA = useRef<Tone.Player | null>(null);
    const playerB = useRef<Tone.Player | null>(null);
    const activePlayer = useRef<'A' | 'B'>('A');
    const nextEventId = useRef<number | null>(null);
    const bufferRef = useRef<Tone.ToneAudioBuffer | null>(null);

    useEffect(() => {
        if (!url || !isReady) return;

        const buffer = new Tone.ToneAudioBuffer(url, () => {
            bufferRef.current = buffer;
            
            // Initialize players
            playerA.current = new Tone.Player(buffer).toDestination();
            playerB.current = new Tone.Player(buffer).toDestination();
            
            // Set initial fading
            playerA.current.fadeIn = crossfadeTime;
            playerA.current.fadeOut = crossfadeTime;
            playerB.current.fadeIn = crossfadeTime;
            playerB.current.fadeOut = crossfadeTime;
        });

        return () => {
            if (playerA.current) playerA.current.dispose();
            if (playerB.current) playerB.current.dispose();
            if (nextEventId.current !== null) Tone.Transport.clear(nextEventId.current);
        };
    }, [url, isReady, crossfadeTime]);

    const scheduleNext = (startTime: number, duration: number) => {
        const nextStart = startTime + duration - crossfadeTime;
        
        nextEventId.current = Tone.Transport.schedule((time) => {
            // Swap players
            const current = activePlayer.current === 'A' ? playerA.current : playerB.current;
            const next = activePlayer.current === 'A' ? playerB.current : playerA.current;
            activePlayer.current = activePlayer.current === 'A' ? 'B' : 'A';

            if (next && bufferRef.current) {
                next.start(time);
                // Schedule the next loop recursively
                scheduleNext(time, bufferRef.current.duration);
            }
        }, nextStart);
    };

    const play = async () => {
        if (!bufferRef.current || !playerA.current || !isReady) return;
        
        await Tone.start();
        Tone.Transport.start();
        
        const now = Tone.now();
        playerA.current.start(now);
        activePlayer.current = 'A';
        setIsPlaying(true);

        scheduleNext(now, bufferRef.current.duration);
    };

    const stop = () => {
        if (playerA.current) playerA.current.stop();
        if (playerB.current) playerB.current.stop();
        if (nextEventId.current !== null) Tone.Transport.clear(nextEventId.current);
        Tone.Transport.stop();
        setIsPlaying(false);
    };

    return { play, stop, isPlaying };
};
