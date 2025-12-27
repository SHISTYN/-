
import * as Tone from 'tone';

interface BinauralNodes {
    leftOsc: Tone.Oscillator;
    rightOsc: Tone.Oscillator;
    filter: Tone.Filter;
    volume: Tone.Volume;
}

export class BinauralGenerator {
    private nodes: BinauralNodes | null = null;
    private destination: Tone.ToneAudioNode;

    constructor(destination?: Tone.ToneAudioNode) {
        this.destination = destination || Tone.Destination;
    }

    public play(baseFreq: number, beatFreq: number, volumeDb: number = -12) {
        // If playing, stop previous instance first
        if (this.nodes) {
            this.stop();
        }

        const leftFreq = baseFreq;
        const rightFreq = baseFreq + beatFreq;

        const leftOsc = new Tone.Oscillator(leftFreq, "sine");
        const rightOsc = new Tone.Oscillator(rightFreq, "sine");

        // Hard pan
        const leftPanner = new Tone.Panner(-1);
        const rightPanner = new Tone.Panner(1);

        // Filter to soften
        const filter = new Tone.Filter(300, "lowpass");
        const vol = new Tone.Volume(-60); // Start silent

        leftOsc.connect(leftPanner);
        rightOsc.connect(rightPanner);

        leftPanner.connect(filter);
        rightPanner.connect(filter);
        
        filter.connect(vol);
        vol.connect(this.destination);

        leftOsc.start();
        rightOsc.start();

        // Ramp volume up
        vol.volume.rampTo(volumeDb, 2);

        this.nodes = {
            leftOsc,
            rightOsc,
            filter,
            volume: vol
        };
    }

    public stop() {
        if (!this.nodes) return;
        
        // Capture nodes locally for cleanup closure
        const nodesToClean = this.nodes;
        // Important: Nullify immediately so UI/State knows we are stopped
        this.nodes = null; 
        
        const { leftOsc, rightOsc, volume, filter } = nodesToClean; 
        
        // Fast fade out
        if (volume) {
            volume.volume.rampTo(-Infinity, 0.5);
        }

        // Dispose after fade
        setTimeout(() => {
            try {
                leftOsc.stop();
                rightOsc.stop();
                leftOsc.dispose();
                rightOsc.dispose();
                volume.dispose();
                filter.dispose();
            } catch (e) {
                // Ignore errors if already disposed
            }
        }, 600);
    }
}

export const binauralEngine = new BinauralGenerator();
