// Chiptune engine: one square lead, one triangle bass, noise drums, and
// the sound effects. Everything is synthesised — no audio files.
//
// The riff is an original garage-stomp in E minor. It is meant to feel like
// the kind of thing a crowd would chant, not to be any particular song.

let ctx = null;
let master = null;
let musicGain = null;
let running = false;
let enabled = true;
let timer = null;
let nextStepTime = 0;
let step = 0;
let rumbleGain = null;
let noiseBuffer = null;

const BPM = 126;
const STEP = 60 / BPM / 4; // one sixteenth

// Note names → frequency.
const N = {
  E2: 82.41, G2: 98.0, A2: 110.0, B2: 123.47, D3: 146.83,
  E3: 164.81, G3: 196.0, A3: 220.0, B3: 246.94, D4: 293.66, E4: 329.63,
};

// Two bars, 32 sixteenths. Straight driving eighths: up to the B and back.
// Bar 1: E E G A B A G E · Bar 2: E E G A B D B A
const LEAD = [
  'E3', null, 'E3', null, 'G3', null, 'A3', null, 'B3', null, 'A3', null, 'G3', null, 'E3', null,
  'E3', null, 'E3', null, 'G3', null, 'A3', null, 'B3', null, 'D4', null, 'B3', null, 'A3', null,
];
const BASS = [
  'E2', null, null, null, 'E2', null, null, null, 'B2', null, null, null, 'G2', null, null, null,
  'E2', null, null, null, 'E2', null, null, null, 'B2', null, null, null, 'A2', null, 'G2', null,
];
const KICK = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
const SNARE = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];

function ensure() {
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);
  musicGain = ctx.createGain();
  musicGain.gain.value = enabled ? 1 : 0;
  musicGain.connect(master);

  // One second of white noise, reused for drums and rumbles.
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return true;
}

function tone(type, freq, start, dur, gain, dest = master, slideTo = null) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, start);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  o.connect(g).connect(dest);
  o.start(start);
  o.stop(start + dur + 0.02);
}

function noise(start, dur, gain, dest = master, filterHz = null) {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, start);
  g.gain.exponentialRampToValueAtTime(0.001, start + dur);
  let node = src;
  if (filterHz) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filterHz;
    node = src.connect(f);
  }
  node.connect(g).connect(dest);
  src.start(start);
  src.stop(start + dur + 0.02);
}

function scheduleStep(i, t) {
  const lead = LEAD[i];
  if (lead) tone('square', N[lead], t, STEP * 1.7, 0.07, musicGain);
  const bass = BASS[i];
  if (bass) tone('triangle', N[bass], t, STEP * 3.6, 0.16, musicGain);
  if (KICK[i]) tone('sine', 140, t, 0.12, 0.5, musicGain, 40);
  if (SNARE[i]) noise(t, 0.09, 0.18, musicGain);
  if (i % 2 === 0) noise(t, 0.03, 0.05, musicGain); // hat on every eighth
}

function pump() {
  while (nextStepTime < ctx.currentTime + 0.12) {
    scheduleStep(step % LEAD.length, nextStepTime);
    nextStepTime += STEP;
    step++;
  }
}

/** Start the music. Must be called from a user gesture the first time. */
export function start() {
  if (!ensure()) return;
  if (ctx.state === 'suspended') ctx.resume();
  if (running) return;
  running = true;
  nextStepTime = ctx.currentTime + 0.05;
  step = 0;
  timer = setInterval(pump, 30);
}

export function setEnabled(on) {
  enabled = on;
  if (musicGain) musicGain.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.05);
}

export function isEnabled() {
  return enabled;
}

// ---------------------------------------------------------------------------
// Sound effects (these play even when the music is off)
// ---------------------------------------------------------------------------

export const sfx = {
  swing() {
    if (!ensure()) return;
    noise(ctx.currentTime, 0.12, 0.12, master, 1800);
  },
  catch(n) {
    if (!ensure()) return;
    const t = ctx.currentTime;
    // one rising blip per turtle caught
    for (let i = 0; i < Math.min(n, 5); i++) {
      tone('square', 440 * Math.pow(1.26, i), t + i * 0.07, 0.09, 0.12);
    }
  },
  jump() {
    if (!ensure()) return;
    tone('square', 220, ctx.currentTime, 0.18, 0.1, master, 880);
  },
  rumble(on) {
    if (!ensure()) return;
    if (on && !rumbleGain) {
      rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0;
      rumbleGain.connect(master);
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 90;
      src.connect(f).connect(rumbleGain);
      src.start();
      rumbleGain.gain.setTargetAtTime(0.9, ctx.currentTime, 0.2);
      rumbleGain._src = src;
    } else if (!on && rumbleGain) {
      const g = rumbleGain;
      rumbleGain = null;
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
      setTimeout(() => g._src.stop(), 600);
    }
  },
  fall() {
    if (!ensure()) return;
    const t = ctx.currentTime;
    tone('square', 600, t, 0.7, 0.14, master, 60);
    noise(t + 0.5, 0.4, 0.25, master, 300);
  },
  open() {
    if (!ensure()) return;
    noise(ctx.currentTime, 0.5, 0.3, master, 200);
  },
  clear() {
    if (!ensure()) return;
    const t = ctx.currentTime;
    ['E4', 'G3', 'B3', 'E4', 'E4'].forEach((n, i) => {
      tone('square', N[n] * (i === 4 ? 2 : 1), t + i * 0.1, 0.16, 0.12);
    });
  },
  buy() {
    if (!ensure()) return;
    const t = ctx.currentTime;
    tone('square', 880, t, 0.06, 0.1);
    tone('square', 1320, t + 0.07, 0.1, 0.1);
  },
  nope() {
    if (!ensure()) return;
    tone('square', 120, ctx.currentTime, 0.15, 0.1, master, 80);
  },
};
