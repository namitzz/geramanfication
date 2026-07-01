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

// Text-to-Speech using Web Speech API with German voice selection
export const speak = (text: string, lang: string = 'de-DE'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Slightly slower for learning
    
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(event);

    // Wait for voices to load if needed
    const setVoiceAndSpeak = () => {
      const germanVoice = getGermanVoice();
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
      speechSynthesis.speak(utterance);
    };

    // Voices might not be loaded immediately
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', setVoiceAndSpeak, { once: true });
    } else {
      setVoiceAndSpeak();
    }
  });
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
