export type QuizMode = 'mcq' | 'grammar' | 'cloze' | 'hard' | 'classes';

export interface QuizItem {
  prompt: string;
  promptSub?: string;
  promptDe?: boolean; // prompt is German (lang + pronounceable)
  speak?: string; // pronounce on show
  speakReveal?: string; // pronounce on reveal (e.g. full cloze sentence)
  options: string[];
  correctIndex: number;
  optionsDe?: boolean; // options are German
  explanation?: string;
  miss: { id: string; de: string; en: string };
}
