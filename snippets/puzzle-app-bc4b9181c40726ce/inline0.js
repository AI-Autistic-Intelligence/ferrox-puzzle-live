
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

    export function wasm_play_snap(sound_type) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            if (sound_type === 1) {
                // 1: Legno Classico - Low resonant thud + quick tap
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);

                gain.gain.setValueAtTime(0.7, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

                const oscTap = ctx.createOscillator();
                const gainTap = ctx.createGain();
                oscTap.type = 'triangle';
                oscTap.frequency.setValueAtTime(1600, now);
                gainTap.gain.setValueAtTime(0.4, now);
                gainTap.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

                osc.connect(gain);
                gain.connect(ctx.destination);
                oscTap.connect(gainTap);
                gainTap.connect(ctx.destination);

                osc.start(now);
                oscTap.start(now);
                osc.stop(now + 0.06);
                oscTap.stop(now + 0.02);
            } else if (sound_type === 2) {
                // 2: Snap Meccanico - Crisp double click
                const osc1 = ctx.createOscillator();
                const gain1 = ctx.createGain();
                osc1.type = 'triangle';
                osc1.frequency.setValueAtTime(2400, now);
                gain1.gain.setValueAtTime(0.5, now);
                gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(3200, now + 0.012);
                gain2.gain.setValueAtTime(0.0001, now);
                gain2.gain.setValueAtTime(0.4, now + 0.012);
                gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

                osc1.connect(gain1);
                gain1.connect(ctx.destination);
                osc2.connect(gain2);
                gain2.connect(ctx.destination);

                osc1.start(now);
                osc1.stop(now + 0.025);
                osc2.start(now + 0.012);
                osc2.stop(now + 0.04);
            } else if (sound_type === 3) {
                // 3: Pop Morbido - Rounded downward sweep
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(650, now);
                osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

                gain.gain.setValueAtTime(0.8, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.06);
            }
        } catch (e) {
            console.warn("Audio playback failed:", e);
        }
    }
    