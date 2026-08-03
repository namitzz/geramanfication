/**
 * Robust German text-to-speech for the browser.
 *
 * Priority: a real on-device German voice (offline, correct accent). If none
 * exists, best-effort stream German audio. Everything is non-throwing and
 * handles the common failure modes: async voice loading, the iOS autoplay
 * lock (needs priming inside a user gesture), and the cancel→speak race.
 */

const isAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

// Voices load asynchronously; cache them and refresh on change.
let voices: SpeechSynthesisVoice[] = [];
function refreshVoices() {
  if (isAvailable) voices = window.speechSynthesis.getVoices();
}
if (isAvailable) {
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

export const isTTSAvailable = (): boolean => isAvailable;

// Preferred German voices across platforms (any gender).
const PREFERRED_DE = ['google', 'microsoft', 'anna', 'petra', 'markus', 'katja', 'conrad', 'yannick'];

export function getGermanVoice(): SpeechSynthesisVoice | null {
  if (!isAvailable) return null;
  if (voices.length === 0) refreshVoices();
  const de = voices.filter((v) => v.lang.toLowerCase().startsWith('de'));
  if (de.length === 0) return null;
  for (const name of PREFERRED_DE) {
    const match = de.find((v) => v.name.toLowerCase().includes(name));
    if (match) return match;
  }
  return de[0];
}

export const getVoicesForLanguage = (lang: string): SpeechSynthesisVoice[] =>
  isAvailable ? window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith(lang)) : [];

/**
 * Unlock speech synthesis — must be called once from inside a real user
 * gesture (Safari/iOS blocks speech that isn't). Speaks a silent utterance.
 */
let primed = false;
export function primeSpeech(): void {
  if (!isAvailable || primed) return;
  primed = true;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
    window.speechSynthesis.cancel();
  } catch {
    /* ignore */
  }
}

let currentAudio: HTMLAudioElement | null = null;
function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

/** Last-resort German audio stream (best-effort; never throws or hangs). */
function streamGerman(text: string): Promise<void> {
  return new Promise((resolve) => {
    stopAudio();
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=${encodeURIComponent(
        text.slice(0, 200),
      )}`;
      const audio = new Audio(url);
      currentAudio = audio;
      const done = () => resolve();
      audio.onended = done;
      audio.onerror = done;
      setTimeout(done, 6000);
      audio.play().catch(done);
    } catch {
      resolve();
    }
  });
}

async function waitForVoices(ms = 1000): Promise<void> {
  if (!isAvailable || voices.length > 0) return;
  await new Promise<void>((resolve) => {
    const done = () => {
      refreshVoices();
      resolve();
    };
    window.speechSynthesis.addEventListener?.('voiceschanged', done, { once: true });
    setTimeout(done, ms);
  });
}

/**
 * Speak German `text`. Uses a native German voice when available, else streams
 * German audio, else stays silent (never mispronounces German with an English
 * voice). Safe to call repeatedly — cancels any in-flight speech first.
 */
export async function speak(text: string, lang = 'de-DE'): Promise<void> {
  if (!text) return;
  if (!isAvailable) return streamGerman(text);

  try {
    await waitForVoices();
    const voice = getGermanVoice();
    const synth = window.speechSynthesis;

    stopAudio();
    synth.cancel();
    try {
      synth.resume(); // clears a "stuck speaking" state seen on iOS
    } catch {
      /* ignore */
    }

    if (!voice) {
      await streamGerman(text);
      return;
    }

    await new Promise<void>((resolve) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.voice = voice;
      u.rate = 0.9; // a touch slower for learners
      let settled = false;
      const finish = () => {
        if (!settled) {
          settled = true;
          resolve();
        }
      };
      u.onend = finish;
      u.onerror = finish;
      // A small delay avoids the cancel→speak race that swallows audio on iOS.
      setTimeout(() => {
        try {
          synth.speak(u);
        } catch {
          finish();
        }
      }, 40);
      setTimeout(finish, 8000); // safety net
    });
  } catch {
    /* stay silent */
  }
}
