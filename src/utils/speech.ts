/**
 * Thin wrapper around the browser SpeechRecognition API for German speaking
 * practice. Supported in Chrome/Edge/Safari; Firefox lacks it and Brave
 * exposes the constructor but fails at runtime with a `network` error (its
 * speech backend is disabled) — callers should catch and show a fallback.
 */

// Minimal typings — lib.dom does not ship SpeechRecognition everywhere.
interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface RecognitionErrorEvent {
  error: string;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: ((e: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionCtor = new () => Recognition;

function getCtor(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const isSpeechRecognitionAvailable = (): boolean =>
  typeof window !== 'undefined' && getCtor() !== undefined;

export class SpeechNotSupportedError extends Error {
  constructor() {
    super('Speech recognition is not supported in this browser');
    this.name = 'SpeechNotSupportedError';
  }
}

/**
 * Listen for one utterance and resolve with its transcript.
 * Rejects with the recognition error string (`no-speech`, `not-allowed`,
 * `network`, ...) or SpeechNotSupportedError.
 */
export function listenOnce(lang = 'de-DE'): Promise<string> {
  return new Promise((resolve, reject) => {
    const Ctor = getCtor();
    if (!Ctor) {
      reject(new SpeechNotSupportedError());
      return;
    }
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    let settled = false;
    rec.onresult = (e) => {
      settled = true;
      const transcript = Array.from(
        { length: e.results.length },
        (_, i) => e.results[i][0]?.transcript ?? ''
      )
        .join(' ')
        .trim();
      resolve(transcript);
    };
    rec.onerror = (e) => {
      settled = true;
      reject(new Error(e.error));
    };
    rec.onend = () => {
      // Ended without a result or error (e.g. silence on some engines).
      if (!settled) reject(new Error('no-speech'));
    };

    try {
      rec.start();
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
