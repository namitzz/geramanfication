/**
 * Tiny synthesized sound effects (Web Audio, no audio files) for tactile
 * feedback: correct ding, wrong thud, session-complete chime. All calls are
 * no-ops when the "Sound effects" setting is off or Web Audio is unavailable,
 * and volumes are kept low so they sit under the German speech audio.
 */

import { useAppStore } from '../stores/appStore';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  // Browsers suspend contexts created before a gesture; answers are gestures.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function enabled(): boolean {
  return useAppStore.getState().settings.sfxEnabled;
}

/** Play one soft tone. */
function tone(
  freq: number,
  startIn: number,
  duration: number,
  type: OscillatorType = 'sine',
  peak = 0.06
): void {
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + startIn;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Bright little up-chirp for a correct answer. */
export function sfxCorrect(): void {
  if (!enabled()) return;
  tone(660, 0, 0.12, 'sine', 0.05);
  tone(880, 0.09, 0.16, 'sine', 0.05);
}

/** Soft low thud for a wrong answer (gentle, not punishing). */
export function sfxWrong(): void {
  if (!enabled()) return;
  tone(180, 0, 0.16, 'triangle', 0.06);
  tone(140, 0.06, 0.2, 'triangle', 0.05);
}

/** Small arpeggio chime when a session completes. */
export function sfxComplete(): void {
  if (!enabled()) return;
  tone(523, 0, 0.18, 'sine', 0.05); // C5
  tone(659, 0.12, 0.18, 'sine', 0.05); // E5
  tone(784, 0.24, 0.22, 'sine', 0.05); // G5
  tone(1047, 0.36, 0.3, 'sine', 0.045); // C6
}

/** Route right/wrong feedback in one call. */
export function sfxAnswer(correct: boolean): void {
  if (correct) sfxCorrect();
  else sfxWrong();
}
