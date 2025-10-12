// Get the best German voice available
export const getGermanVoice = (): SpeechSynthesisVoice | null => {
  if (!isTTSAvailable()) return null;
  
  const voices = speechSynthesis.getVoices();
  
  // Prefer German voices in this order
  const preferredVoices = [
    'Google Deutsch',
    'Microsoft Katja - German',
    'Microsoft Conrad - German',
    'Anna',
    'de-DE',
  ];
  
  // Try to find preferred voice
  for (const preferred of preferredVoices) {
    const voice = voices.find(v => 
      v.name.includes(preferred) || 
      (v.lang.startsWith('de') && v.name.includes(preferred))
    );
    if (voice) return voice;
  }
  
  // Fall back to any German voice
  return voices.find(voice => voice.lang.startsWith('de')) || null;
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
