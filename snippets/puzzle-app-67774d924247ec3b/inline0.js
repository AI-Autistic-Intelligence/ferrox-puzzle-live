
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    export function wasm_play_snap(sound_type, volume) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const vol = typeof volume === 'number' ? Math.max(0.0, Math.min(2.0, volume)) : 1.0;

            if (sound_type === 1) {
                // 1: Legno Classico - Low resonant thud + quick tap
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(210, now);
                osc.frequency.exponentialRampToValueAtTime(75, now + 0.12);

                gain.gain.setValueAtTime(0.85 * vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

                const oscTap = ctx.createOscillator();
                const gainTap = ctx.createGain();
                oscTap.type = 'triangle';
                oscTap.frequency.setValueAtTime(2100, now);
                gainTap.gain.setValueAtTime(0.55 * vol, now);
                gainTap.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

                osc.connect(gain);
                gain.connect(ctx.destination);
                oscTap.connect(gainTap);
                gainTap.connect(ctx.destination);

                osc.start(now);
                oscTap.start(now);
                osc.stop(now + 0.135);
                oscTap.stop(now + 0.03);
            } else if (sound_type === 2) {
                // 2: Snap Meccanico - Crisp double click
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'triangle';
                osc1.frequency.setValueAtTime(2600, now);
                gain1.gain.setValueAtTime(0.70 * vol, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(3400, now + 0.016);
                gain2.gain.setValueAtTime(0.0001, now);
                gain2.gain.setValueAtTime(0.60 * vol, now + 0.016);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);

                osc1.start(now);
                osc1.stop(now + 0.04);
                osc2.start(now + 0.016);
                osc2.stop(now + 0.125);
            } else if (sound_type === 3) {
                // 3: Pop Morbido - Rounded downward sweep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(950, now);
                osc.frequency.exponentialRampToValueAtTime(160, now + 0.11);

                gain.gain.setValueAtTime(0.95 * vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.125);
            }
        } catch (e) {
            console.warn("Audio playback failed:", e);
        }
    }
    