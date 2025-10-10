// Text-to-Speech using Web Speech API
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

    // Try to find a German voice
    const voices = speechSynthesis.getVoices();
    const germanVoice = voices.find(voice => voice.lang.startsWith('de'));
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    speechSynthesis.speak(utterance);
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
