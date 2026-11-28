// Small sounds made in code (Web Audio). Off until the visitor turns sound on.
let context: AudioContext | null = null;
let enabled = false;

export function setSound(on: boolean) {
  enabled = on;
  if (on && !context) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtor) context = new AudioCtor();
  }
  if (on) void context?.resume();
}

function tone(frequency: number, at: number, length: number, type: OscillatorType, volume: number) {
  if (!context) return;
  const osc = context.createOscillator(); const gain = context.createGain();
  osc.type = type; osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, context.currentTime + at);
  gain.gain.linearRampToValueAtTime(volume, context.currentTime + at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + at + length);
  osc.connect(gain).connect(context.destination); osc.start(context.currentTime + at); osc.stop(context.currentTime + at + length + 0.05);
}

export type SoundName = "alarm" | "fixed" | "tick" | "drop" | "swap";
export function play(name: SoundName) {
  if (!enabled || !context) return;
  if (name === "alarm") for (let i = 0; i < 3; i++) { tone(880, i * 0.36, 0.16, "square", 0.08); tone(660, i * 0.36 + 0.18, 0.16, "square", 0.08); }
  if (name === "fixed") { tone(523, 0, 0.12, "triangle", 0.15); tone(659, 0.1, 0.12, "triangle", 0.15); tone(784, 0.2, 0.3, "triangle", 0.15); }
  if (name === "tick") tone(1200, 0, 0.04, "square", 0.04);
  if (name === "drop") tone(140, 0, 0.12, "sine", 0.2);
  if (name === "swap") { tone(440, 0, 0.08, "triangle", 0.12); tone(660, 0.07, 0.12, "triangle", 0.12); }
}
