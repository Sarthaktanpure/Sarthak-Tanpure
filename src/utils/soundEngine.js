// Web Audio API Sound Synthesizer — Zero External Audio Files
// Produces: Low control-room ambient tone, tactical UI keyclicks, heartbeat pulse, clock ticks, and sunrise dawn chord.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.roomToneGain = null;
    this.roomToneSource = null;
    this.humOsc = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  toggle(enable) {
    if (enable === undefined) {
      this.enabled = !this.enabled;
    } else {
      this.enabled = enable;
    }

    if (this.enabled) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startRoomTone();
      this.playClick();
    } else {
      this.stopRoomTone();
    }
    return this.enabled;
  }

  startRoomTone() {
    if (!this.ctx || !this.enabled || this.roomToneGain) return;

    try {
      // 1. Filtered pinkish/brown noise buffer for air handler / server racks
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 2.5; // boost
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(85, this.ctx.currentTime);

      // 2. 50/60 Hz electrical transformer hum
      this.humOsc = this.ctx.createOscillator();
      this.humOsc.type = 'sine';
      this.humOsc.frequency.setValueAtTime(58, this.ctx.currentTime);

      const humFilter = this.ctx.createBiquadFilter();
      humFilter.type = 'bandpass';
      humFilter.frequency.setValueAtTime(58, this.ctx.currentTime);
      humFilter.Q.setValueAtTime(5, this.ctx.currentTime);

      this.roomToneGain = this.ctx.createGain();
      this.roomToneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.roomToneGain.gain.exponentialRampToValueAtTime(0.025, this.ctx.currentTime + 3);

      noise.connect(lowpass);
      lowpass.connect(this.roomToneGain);

      this.humOsc.connect(humFilter);
      humFilter.connect(this.roomToneGain);

      this.roomToneGain.connect(this.ctx.destination);

      noise.start(0);
      this.humOsc.start(0);
      this.roomToneSource = noise;
    } catch (e) {
      console.warn("Web Audio ambient error:", e);
    }
  }

  stopRoomTone() {
    if (this.roomToneGain && this.ctx) {
      try {
        this.roomToneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.roomToneSource) {
            this.roomToneSource.stop();
            this.roomToneSource.disconnect();
            this.roomToneSource = null;
          }
          if (this.humOsc) {
            this.humOsc.stop();
            this.humOsc.disconnect();
            this.humOsc = null;
          }
          this.roomToneGain = null;
        }, 550);
      } catch (e) {
        this.roomToneGain = null;
      }
    }
  }

  // Tactical keyboard / relay micro-click
  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, t);
      filter.Q.setValueAtTime(3, t);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.015);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.02);
    } catch (e) {}
  }

  // Gentle heartbeat pulse for the fraud anomaly scene
  playHeartbeat() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, t);
      osc1.frequency.exponentialRampToValueAtTime(35, t + 0.12);

      gain1.gain.setValueAtTime(0.07, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.15);

      // Dub
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(55, t + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(30, t + 0.32);

      gain2.gain.setValueAtTime(0.05, t + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.34);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.18);
      osc2.stop(t + 0.35);
    } catch (e) {}
  }

  // Clock tick on HUD click
  playClockTick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.008);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.009);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.01);
    } catch (e) {}
  }

  // Warm chord on sunrise (Act VI)
  playSunriseChord() {
    if (!this.enabled || !this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // F-maj9 notes: F3 (174.61), C4 (261.63), E4 (329.63), G4 (392.00), A4 (440.00)
      const freqs = [174.61, 261.63, 329.63, 392.00, 440.00];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);
        filter.frequency.linearRampToValueAtTime(1400, t + 2.5);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.025 / freqs.length, t + 1.2 + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 4.6);
      });
    } catch (e) {}
  }
}

export const soundEngine = new SoundEngine();
