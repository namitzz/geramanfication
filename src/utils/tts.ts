// Known female German voices, in order of preference.
const PREFERRED_FEMALE_DE = [
  'Google Deutsch', // female on Chrome
  'Microsoft Katja',
  'Microsoft Hedda',
  'Microsoft Ingrid',
  'Anna', // macOS/iOS German (female)
  'Petra',
  'Marlene',
  'Vicki',
  'Helena',
];

// Known male German voices to avoid when no explicit female match is found.
const MALE_DE_HINTS = ['conrad', 'stefan', 'markus', 'yannick', 'klaus', 'hans', 'male'];

// Get the best available FEMALE German voice.
export const getGermanVoice = (): SpeechSynthesisVoice | null => {
  if (!isTTSAvailable()) return null;

  const germanVoices = speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith('de'));
  if (germanVoices.length === 0) return null;

  // 1. Prefer a known female German voice by name.
  for (const name of PREFERRED_FEMALE_DE) {
    const match = germanVoices.find((v) =>
      v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) return match;
  }

  // 2. Otherwise pick a German voice that isn't a known male voice.
  const notMale = germanVoices.find(
    (v) => !MALE_DE_HINTS.some((m) => v.name.toLowerCase().includes(m))
  );
  if (notMale) return notMale;

  // 3. Last resort: any German voice.
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
