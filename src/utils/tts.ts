// High-quality German voices to prefer, in rough quality order. These span
// both genders — voice gender is a device/OS choice, not something we filter.
const PREFERRED_DE_VOICES = [
  'Google Deutsch',
  'Microsoft', // Katja, Conrad, Hedda, etc. — whichever the OS provides
  'Anna', // macOS/iOS German
];

// Get the best available German voice (any gender).
export const getGermanVoice = (): SpeechSynthesisVoice | null => {
  if (!isTTSAvailable()) return null;

  const germanVoices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('de'));
  if (germanVoices.length === 0) return null;

  // Prefer a known high-quality voice, otherwise fall back to any German voice.
  for (const name of PREFERRED_DE_VOICES) {
    const match = germanVoices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }

  return germanVoices[0];
};

// Speak `text` with a genuine German browser voice, if one exists.
const speakWithWebSpeech = (
  text: string,
  lang: string,
  voice: SpeechSynthesisVoice
): Promise<void> =>
  new Promise((resolve, reject) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for learning
    utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    speechSynthesis.speak(utterance);
  });

let currentAudio: HTMLAudioElement | null = null;

// A German MP3 stream, so audio is German even when the browser/OS has no
// German voice installed (e.g. Brave, which blocks network voices). Returns
// real German neural audio; playback works cross-origin (no CORS needed).
const germanAudioUrl = (text: string): string => {
  const q = encodeURIComponent(text.slice(0, 200));
  return `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=de&q=${q}`;
};

const speakWithAudioStream = (text: string): Promise<void> =>
  new Promise((resolve, reject) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    const audio = new Audio(germanAudioUrl(text));
    currentAudio = audio;
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('German audio stream failed'));
    audio.play().catch(reject);
  });

/**
 * Speak German text so that ALL users actually hear German:
 * 1. If the browser has a real German voice, use it (works offline).
 * 2. Otherwise stream German audio (fixes Brave / OS without a German voice).
 * 3. Fall back to whatever speech is available as a last resort.
 */
export const speak = (text: string, lang: string = 'de-DE'): Promise<void> => {
  const run = (): Promise<void> => {
    const germanVoice = getGermanVoice();
    if (germanVoice) {
      return speakWithWebSpeech(text, lang, germanVoice).catch(() =>
        speakWithAudioStream(text)
      );
    }
    // No German voice available — stream German audio instead of reading it
    // aloud with an English voice. If the stream fails, stay silent rather than
    // mispronouncing German with a non-German voice.
    return speakWithAudioStream(text).catch(() => {});
  };

  // Voices can load asynchronously; wait briefly if the list is still empty.
  if (isTTSAvailable() && speechSynthesis.getVoices().length === 0) {
    return new Promise((resolve) => {
      let settled = false;
      const go = () => {
        if (settled) return;
        settled = true;
        run().then(resolve).catch(() => resolve());
      };
      speechSynthesis.addEventListener('voiceschanged', go, { once: true });
      setTimeout(go, 600); // fallback if the event never fires
    });
  }

  return run().catch(() => {});
};

// Check if TTS is available
export const isTTSAvailable = (): boolean => {
  return 'speechSynthesis' in window;
};

// Get available voices for a language
export const getVoicesForLanguage = (lang: string): SpeechSynthesisVoice[] => {
  if (!isTTSAvailable()) return [];
  return speechSynthesis.getVoices().filter(voice => voice.lang.startsWith(lang));
};
